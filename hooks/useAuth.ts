import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { RegisterUserRequest, User } from "../types";
import { setAuthToken } from "../axio";
import { userApi } from "../api/userAPI";

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

function useAuth() {
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		token: null,
		isAuthenticated: false,
	});

	useEffect(() => {
		console.log(authState);
	});

	const loginMutation = useMutation({
		mutationFn: async (credentials: {
			email: string;
			password: string;
		}) => {
			const response = await fetch(
				`${process.env.EXPO_PUBLIC_CHAT_API}/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(credentials),
				}
			);

			if (!response.ok) {
				throw new Error("Login failed");
			}

			return response.json();
		},
		onSuccess: (data) => {
			const { user, token } = data;
			setAuthToken(token);
			setAuthState({
				user,
				token,
				isAuthenticated: true,
			});
		},
	});

	const registerMutation = useMutation({
		mutationFn: (userData: RegisterUserRequest) =>
			userApi.createUser(userData),
		onSuccess: (user) => {
			console.log("Registration successful", user);
		},
	});

	const logout = () => {
		setAuthState({
			user: null,
			token: null,
			isAuthenticated: false,
		});
		// Clear the auth token
		setAuthToken("");
	};

	return {
		user: authState.user,
		isAuthenticated: authState.isAuthenticated,
		login: loginMutation.mutate,
		register: registerMutation.mutate,
		logout,
		isLoggingIn: loginMutation.isPending,
		isRegistering: registerMutation.isPending,
		loginError: loginMutation.error,
		registerError: registerMutation.error,
	};
}
