import { IMessage } from "react-native-gifted-chat";
import apiClient from "../axio";
import { SendMessageRequest, ServerMessage } from "../types";

export const messagesApi = {
	sendMessage: async (
		roomId: string,
		messageData: SendMessageRequest
	): Promise<ServerMessage> => {
		const response = await apiClient.post(
			`/messages/send/${roomId}`,
			messageData
		);
		return response.data;
	},

	loadChat: async (
		roomId: string,
		page: number
	): Promise<ServerMessage[]> => {
		const response = await apiClient.get(
			`/messsages/loadChat/${roomId}/${page}`
		);
		return response.data;
	},

	markLastRead: async (roomId: string, messageId: string): Promise<void> => {
		await apiClient.patch(`/messages/lastRead/${roomId}/${messageId}`);
	},

	clearChat: async (roomId: string): Promise<void> => {
		await apiClient.delete(`/messages/clearChat/${roomId}`);
	},

	convertToGiftedChat: (messages: ServerMessage[]): IMessage[] => {
		return messages.map((msg) => ({
			_id: msg.id,
			text: msg.text,
			createdAt: new Date(msg.createdAt),
			user: {
				_id: msg.userId,
				// You might want to include more user details here if available
			},
		}));
	},
};
