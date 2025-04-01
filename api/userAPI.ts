import { User } from "react-native-gifted-chat";
import apiClient from "../axio";
import { CreateUserRequest } from "../types";

export const userApi = {
	createUser: async (userData: CreateUserRequest): Promise<User> => {
		const response = await apiClient.post("/user/create", userData);
		return response.data;
	},

	getUser: async (userId: string): Promise<User> => {
		const response = await apiClient.get(`/user/${userId}`);
		return response.data;
	},

	updateUser: async (
		userId: string,
		userData: Partial<User>
	): Promise<User> => {
		const response = await apiClient.patch(
			`/user/upadte/${userId}`,
			userData
		);
		return response.data;
	},

	deleteUser: async (userId: string): Promise<void> => {
		await apiClient.delete(`/user/delete/${userId}`);
	},
};
