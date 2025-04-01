import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateRoomRequest, Room } from "../types";
import { roomsApi } from "../api/roomsAPI";

export const useRooms = (userId: string) => {
	const queryClient = useQueryClient();

	const getRoomsForUser = async () => {
		const response = await fetch(
			`${process.env.CHAT_API}/rooms/user/${userId}`
		);
		if (!response.ok) {
			throw new Error("Failed to fetch rooms");
		}
		return response.json() as Promise<Room[]>;
	};

	const roomsQuery = useQuery({
		queryKey: ["rooms", userId],
		queryFn: getRoomsForUser,
	});

	const createRoomMutation = useMutation({
		mutationFn: (roomData: CreateRoomRequest) =>
			roomsApi.createRoom(roomData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rooms", userId] });
		},
	});

	const joinRoomMutation = useMutation({
		mutationFn: (roomId: string) => roomsApi.joinRoom(roomId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rooms", userId] });
		},
	});

	const leaveRoomMutation = useMutation({
		mutationFn: (roomId: string) => roomsApi.leaveRoom(roomId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rooms", userId] });
		},
	});

	return {
		rooms: roomsQuery.data || [],
		isLoading: roomsQuery.isPending,
		error: roomsQuery.error,
		createRoom: createRoomMutation.mutate,
		joinRoom: joinRoomMutation.mutate,
		leaveRoom: leaveRoomMutation.mutate,
	};
};
