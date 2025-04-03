import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IMessage } from "react-native-gifted-chat";
import { messagesApi } from "../api/messagesAPI";
import { ServerMessage } from "../types";

export function useChat(roomId: string, userId: string) {
	const [page, setPage] = useState(1);
	const [allMessages, setAllMessages] = useState<IMessage[]>([]);
	const queryClient = useQueryClient();

	const messagesQuery = useQuery({
		queryKey: ["messages", roomId, page],
		queryFn: () => messagesApi.loadChat(roomId, page),
		enabled: !!roomId, // Only run if roomId is provided
	});

	const sendMessageMutation = useMutation({
		mutationFn: (msg: Partial<ServerMessage>) =>
			messagesApi.sendMessage(roomId, msg),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["messages", roomId] });
		},
	});

	const markLastReadMutation = useMutation({
		mutationFn: (messageId: string) =>
			messagesApi.markLastRead(roomId, messageId),
	});

	const clearChatMutation = useMutation({
		mutationFn: () => messagesApi.clearChat(roomId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["messages", roomId] });
			setAllMessages([]);
		},
	});

	useEffect(() => {
		if (messagesQuery.data) {
			const newMessages = messagesApi.convertToGiftedChat(
				messagesQuery.data ?? []
			);

			setAllMessages((prev) => {
				const combinedMessages = [...prev, ...newMessages];

				const uniqueMessages = Array.from(
					new Map(
						combinedMessages.map((msg) => [msg._id, msg])
					).values()
				);

				return uniqueMessages.sort(
					(a, b) =>
						(b.createdAt as Date).getTime() -
						(a.createdAt as Date).getTime()
				);
			});

			if (newMessages.length > 0) {
				const latestMessage = newMessages[0];
				if (latestMessage.user._id !== userId) {
					markLastReadMutation.mutate(latestMessage._id as string);
				}
			}
		}
	}, [messagesQuery.data]);

	function loadMoreMessages() {
		setPage((prev) => prev + 1);
	}

	// Send a message
	function sendMessage(messages: IMessage[]) {
		const [message] = messages;

		const messageToSend: Partial<ServerMessage> = {
			read: "unread",
			message: {
				type: message.image ? "media" : "text",
				content: message.image ?? message.text,
			},
		};

		sendMessageMutation.mutate(messageToSend);
	}

	return {
		messages: allMessages,
		isLoading: messagesQuery.isPending,
		error: messagesQuery.error,
		sendMessage,
		loadMoreMessages,
		clearChat: clearChatMutation.mutate,
	};
}
