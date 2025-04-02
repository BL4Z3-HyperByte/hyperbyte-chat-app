import { User } from "react-native-gifted-chat";
import apiClient from "../axio";
import { RegisterUserRequest } from "../types";

export const userApi = {
	getUser: async (userId: string) => {
		const response = await apiClient.get(`/users/${userId}`);
		return response.data;
	},

	getUsers: async () => {
		const response = await apiClient.get(`/`);
		return response.data;
	},

	updateUser: async (userId: string, userData: Partial<User>) => {
		const response = await apiClient.patch(
			`/users/update/${userId}`,
			userData
		);
		return response.data;
	},
};
