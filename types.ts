export interface ServerMessage {
	id: string;
	roomId: string;
	senderId: string;
	message: {
		type: "media" | "text";
		content: string;
	};
	read: "read" | "unread";
	timestamp: string;
}

export interface SendMessageRequest {
	text: string;
}

export interface Room {
	id: string;
	name: string;
	participants: string[]; // User IDs
	createdAt: string;
	lastActivity?: string;
}

export interface CreateRoomRequest {
	name: string;
	participants: string[]; // User IDs
}

export interface User {
	id: string;
	username: string;
	email: string;
}

export interface RegisterUserRequest {
	username: string;
	email: string;
	password: string;
}

export interface AuthenticateUserRequest {
	email: string;
	password: string;
}

export interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoggingIn: boolean;
	isRegistering: boolean;
	loggingInError: Error | null;
	registrationError: Error | null;
	login: (credentials: AuthenticateUserRequest) => void;
	register: (userData: RegisterUserRequest) => void;
	logout: () => void;
}
