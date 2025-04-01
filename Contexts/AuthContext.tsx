import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContextType, CreateUserRequest, User } from "../types";
import { setAuthToken } from "../axio";
import { userApi } from "../api/userAPI";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

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
			} finally {
				setIsLoading(false);
			}
		}

		loadStoredAuth();
	}, []);

	async function login(credentials: { email: string; password: string }) {
		setIsLoading(true);

		try {
			const response = await fetch(
				`${process.env.EXPO_PUBLIC_CHAT_API}/login`,
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

			const data = await response.json();
			const { user, token } = data;

			await AsyncStorage.setItem("user", JSON.stringify(user));
			await AsyncStorage.setItem("token", token);

			setAuthToken(token);
			setUser(user);
			setIsAuthenticated(true);
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}

	async function register(userData: CreateUserRequest) {
		setIsLoading(true);

		try {
			await userApi.createUser(userData);
		} catch (error) {
			console.error("Registration error:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}

	async function logout() {
		try {
			// Clear stored auth data
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
				isLoading,
				login,
				register,
				logout,
			}}>
			{!isLoading && children}
		</AuthContext.Provider>
	);
}

// export function useAuth() {
// 	const context = useContext(AuthContext);
// 	if (context === undefined) {
// 		throw new Error("useAuth must be used within an AuthProvider");
// 	}
// 	return context;
// }
