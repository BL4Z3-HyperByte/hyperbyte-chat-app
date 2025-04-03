import apiClient from "../axio";
import { CreateRoomRequest, Room } from "../types";

export const roomsApi = {
	getRooms: async (): Promise<Room[]> => {
		const response = await apiClient.get("/chat/rooms");
		return response.data.data.rooms;
	},

	createRoom: async (roomData: CreateRoomRequest): Promise<Room> => {
		const response = await apiClient.post("/chat/rooms/create", roomData);
		return response.data;
	},

	joinRoom: async (roomId: string): Promise<Room> => {
		const response = await apiClient.post(`/chat/rooms/join/${roomId}`);
		return response.data;
	},

	leaveRoom: async (roomId: string): Promise<void> => {
		await apiClient.delete(`/chat/rooms/leave/${roomId}`);
	},
};
