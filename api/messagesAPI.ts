import { IMessage } from "react-native-gifted-chat";
import apiClient from "../axio";
import { ServerMessage } from "../types";

export const messagesApi = {
	sendMessage: async (
		roomId: string,
		messageData: Partial<ServerMessage>
	): Promise<ServerMessage> => {
		const response = await apiClient.post(
			`chat/messages/send/${roomId}`,
			messageData
		);
		return response.data;
	},

	loadChat: async (
		roomId: string,
		page: number
	): Promise<ServerMessage[]> => {
		const response = await apiClient.get(
			`chat/messages/loadChat/${roomId}/${page}`
		);
		return response.data.data.messages;
	},

	markLastRead: async (roomId: string, messageId: string): Promise<void> => {
		await apiClient.patch(`chat/messages/lastRead/${roomId}/${messageId}`);
	},

	clearChat: async (roomId: string): Promise<void> => {
		await apiClient.delete(`chat/messages/clearChat/${roomId}`);
	},

	convertToGiftedChat: (messages: ServerMessage[]): IMessage[] => {
		const convertedMessages = messages.map((msg) => {
			const giftedChatMessage: IMessage = {
				_id: msg.id,
				text: "",
				createdAt: new Date(msg.timestamp),
				user: {
					_id: msg.senderId,
				},
			};

			if (msg.message.type === "media") {
				giftedChatMessage.image = msg.message.content;
			} else {
				giftedChatMessage.text = msg.message.content;
			}

			return giftedChatMessage;
		});

		return convertedMessages;
	},
};
