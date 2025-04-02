import apiClient from "../axio";
import { AuthenticateUserRequest, RegisterUserRequest } from "../types";

export const authApi = {
	register: async (userData: RegisterUserRequest) => {
		const response = await apiClient.post("/auth/register", userData);
		return response.data;
	},
	login: async (userData: AuthenticateUserRequest) => {
		const response = await apiClient.post("/auth/login", userData);
		return response.data;
	},
	// deleteAccount: async (userId: string): Promise<void> => {
	// await apiClient.delete(`/user/delete/${userId}`);
	// },
};
