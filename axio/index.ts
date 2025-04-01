import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_CHAT_API;

const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const setAuthToken = (token: string) => {
	apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default apiClient;
