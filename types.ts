export interface ServerMessage {
	id: string;
	text: string;
	createdAt: string;
	userId: string;
	roomId: string;
	// Add more message properties as needed
}

export interface SendMessageRequest {
	text: string;
	// Add more fields as needed
}

export interface Room {
	id: string;
	name: string;
	participants: string[]; // User IDs
	createdAt: string;
	lastActivity?: string;
	// Add more room properties as needed
}

export interface CreateRoomRequest {
	name: string;
	participants: string[]; // User IDs
	// Add more fields as needed
}

export interface User {
	id: string;
	username: string;
	email: string;
}

export interface CreateUserRequest {
	username: string;
	email: string;
	password: string;
	// Add more fields as needed
}

export interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (credentials: { email: string; password: string }) => Promise<void>;
	register: (userData: CreateUserRequest) => Promise<void>;
	logout: () => void;
}
