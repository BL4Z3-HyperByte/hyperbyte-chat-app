// src/hooks/useAuth.ts
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CreateUserRequest, User } from "../types";
import { setAuthToken } from "../axio";
import { userApi } from "../api/userAPI";

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

export const useAuth = () => {
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		token: null,
		isAuthenticated: false,
	});

	const loginMutation = useMutation({
		mutationFn: async (credentials: {
			email: string;
			password: string;
		}) => {
			// Replace with your actual login endpoint
			const response = await fetch("https://your-api-url.com/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(credentials),
			});

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
		mutationFn: (userData: CreateUserRequest) =>
			userApi.createUser(userData),
		onSuccess: (user) => {
			// Typically, registration doesn't log you in automatically
			// You might want to automatically log in the user or redirect to login
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
};
