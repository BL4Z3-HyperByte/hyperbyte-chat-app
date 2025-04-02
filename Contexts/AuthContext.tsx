import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContextType, User } from "../types";
import { setAuthToken } from "../axio";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authAPI";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// Load Stored Token
	useEffect(() => {
		async function loadStoredAuth() {
			try {
				const storedUser = await AsyncStorage.getItem("user");
				const storedToken = await AsyncStorage.getItem("token");

				if (storedUser && storedToken) {
					setUser(JSON.parse(storedUser));
					setAuthToken(storedToken);
					setIsAuthenticated(true);
				}
			} catch (error) {
				console.error("Failed to load auth info:", error);
			}
		}

		loadStoredAuth();
	}, []);

	const loginMutation = useMutation({
		mutationFn: async (vars: { email: string; password: string }) => {
			const { email, password } = vars;
			return await authApi.login({ email: email, password: password });
		},
		async onSuccess(data: { data: { user: User; token: string } }) {
			const { token, user } = data.data;

			await AsyncStorage.setItem("user", JSON.stringify(user));
			await AsyncStorage.setItem("token", token);

			setAuthToken(token);
			setUser(user);
			setIsAuthenticated(true);
		},
	});

	const registerMutation = useMutation({
		mutationFn: async (vars: {
			email: string;
			password: string;
			username: string;
		}) => {
			return authApi.register({
				email: vars.email,
				username: vars.username,
				password: vars.password,
			});
		},
	});

	async function logout() {
		try {
			await AsyncStorage.removeItem("user");
			await AsyncStorage.removeItem("token");

			setAuthToken("");
			setUser(null);
			setIsAuthenticated(false);
		} catch (error) {
			console.error("Logout error:", error);
		}
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				isRegistering: registerMutation.isPending,
				registrationError: registerMutation.error,
				isLoggingIn: loginMutation.isPending,
				loggingInError: loginMutation.error,
				login: loginMutation.mutate,
				register: registerMutation.mutate,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
