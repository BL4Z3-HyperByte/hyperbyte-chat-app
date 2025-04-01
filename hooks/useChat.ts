import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IMessage } from "react-native-gifted-chat";
import { messagesApi } from "../api/messagesAPI";

export const useChat = (roomId: string, userId: string) => {
	const [page, setPage] = useState(1);
	const [allMessages, setAllMessages] = useState<IMessage[]>([]);
	const queryClient = useQueryClient();

	const messagesQuery = useQuery({
		queryKey: ["messages", roomId, page],
		queryFn: () => messagesApi.loadChat(roomId, page),
		enabled: !!roomId, // Only run if roomId is provided
	});

	const sendMessageMutation = useMutation({
		mutationFn: (text: string) => messagesApi.sendMessage(roomId, { text }),
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

	// Update allMessages when messagesQuery data changes
	useEffect(() => {
		if (messagesQuery.data) {
			const newMessages = messagesApi.convertToGiftedChat(
				messagesQuery.data
			);

			// Append new messages to existing ones for pagination
			setAllMessages((prev) => {
				const combinedMessages = [...prev, ...newMessages];

				// Filter out duplicates based on _id
				const uniqueMessages = Array.from(
					new Map(
						combinedMessages.map((msg) => [msg._id, msg])
					).values()
				);

				// Sort messages by createdAt in descending order (newest first)
				return uniqueMessages.sort(
					(a, b) =>
						(b.createdAt as Date).getTime() -
						(a.createdAt as Date).getTime()
				);
			});

			// Mark latest message as read if it's not from current user
			if (newMessages.length > 0) {
				const latestMessage = newMessages[0];
				if (latestMessage.user._id !== userId) {
					markLastReadMutation.mutate(latestMessage._id as string);
				}
			}
		}
	}, [messagesQuery.data]);

	// Load more messages (pagination)
	function loadMoreMessages() {
		setPage((prev) => prev + 1);
	}

	// Send a message
	function sendMessage(messages: IMessage[]) {
		const [message] = messages;
		sendMessageMutation.mutate(message.text);
	}

	return {
		messages: allMessages,
		isLoading: messagesQuery.isPending,
		error: messagesQuery.error,
		sendMessage,
		loadMoreMessages,
		clearChat: clearChatMutation.mutate,
	};
};
