import apiClient from "../axio";
import { CreateRoomRequest, Room } from "../types";

export const roomsApi = {
	createRoom: async (roomData: CreateRoomRequest): Promise<Room> => {
		const response = await apiClient.post("/rooms/create", roomData);
		return response.data;
	},

	joinRoom: async (roomId: string): Promise<Room> => {
		const response = await apiClient.post(`/rooms/join/${roomId}`);
		return response.data;
	},

	leaveRoom: async (roomId: string): Promise<void> => {
		await apiClient.delete(`/rooms/leave/${roomId}`);
	},
};
