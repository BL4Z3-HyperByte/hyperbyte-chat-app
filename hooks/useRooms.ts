import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateRoomRequest } from "../types";
import { roomsApi } from "../api/roomsAPI";

export function useRooms(userId: string) {
	const queryClient = useQueryClient();

	const roomsQuery = useQuery({
		queryKey: ["rooms", userId],
		queryFn: async () => {
			return roomsApi.getRooms();
		},
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
}
