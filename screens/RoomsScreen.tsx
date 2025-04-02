import React, { useState } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	TextInput,
	Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRooms } from "../hooks/useRooms";
import { useAuth } from "../Contexts/AuthContext";

function RoomsScreen({ navigation }: any) {
	const { user } = useAuth();

	const { rooms, isLoading, createRoom, joinRoom } = useRooms(user?.id || "");

	const [showNewRoomModal, setShowNewRoomModal] = useState(false);
	const [newRoomName, setNewRoomName] = useState("");
	const [joinRoomId, setJoinRoomId] = useState("");
	const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);

	function handleCreateRoom() {
		if (newRoomName.trim()) {
			createRoom({
				name: newRoomName,
				participants: [user!.id],
			});
			setNewRoomName("");
			setShowNewRoomModal(false);
		}
	}

	function handleJoinRoom() {
		if (joinRoomId.trim()) {
			joinRoom(joinRoomId);
			setJoinRoomId("");
			setShowJoinRoomModal(false);
		}
	}

	function renderRoom({ item }: { item: any }) {
		return (
			<TouchableOpacity
				style={styles.roomItem}
				onPress={() =>
					navigation.navigate("Chat", {
						roomId: item.id,
						roomName: item.name,
					})
				}>
				<Text style={styles.roomName}>{item.name}</Text>
				<Text style={styles.roomParticipants}>
					{item.participants.length} participant
					{item.participants.length !== 1 ? "s" : ""}
				</Text>
			</TouchableOpacity>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Chat Rooms</Text>
				<View style={styles.buttonsContainer}>
					<TouchableOpacity
						style={styles.createButton}
						onPress={() => setShowNewRoomModal(true)}>
						<Text style={styles.buttonText}>New Room</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.joinButton}
						onPress={() => setShowJoinRoomModal(true)}>
						<Text style={styles.buttonText}>Join Room</Text>
					</TouchableOpacity>
				</View>
			</View>

			{isLoading ? (
				<ActivityIndicator
					size='large'
					color='#007bff'
					style={styles.loader}
				/>
			) : rooms.length > 0 ? (
				<FlatList
					data={rooms}
					renderItem={renderRoom}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.roomsList}
				/>
			) : (
				<View style={styles.emptyState}>
					<Text style={styles.emptyStateText}>
						No rooms available.
					</Text>
					<Text>Create a new room or join an existing one.</Text>
				</View>
			)}

			{/* Create Room Modal */}
			<Modal
				visible={showNewRoomModal}
				animationType='slide'
				transparent={true}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTitle}>Create New Room</Text>
						<TextInput
							style={styles.modalInput}
							placeholder='Room Name'
							value={newRoomName}
							onChangeText={setNewRoomName}
						/>
						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={[
									styles.modalButton,
									styles.cancelButton,
								]}
								onPress={() => {
									setNewRoomName("");
									setShowNewRoomModal(false);
								}}>
								<Text style={styles.cancelButtonText}>
									Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.modalButton,
									styles.createModalButton,
								]}
								onPress={handleCreateRoom}>
								<Text style={styles.createButtonText}>
									Create
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* Join Room Modal */}
			<Modal
				visible={showJoinRoomModal}
				animationType='slide'
				transparent={true}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTitle}>Join Room</Text>
						<TextInput
							style={styles.modalInput}
							placeholder='Room ID'
							value={joinRoomId}
							onChangeText={setJoinRoomId}
						/>
						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={[
									styles.modalButton,
									styles.cancelButton,
								]}
								onPress={() => {
									setJoinRoomId("");
									setShowJoinRoomModal(false);
								}}>
								<Text style={styles.cancelButtonText}>
									Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.modalButton,
									styles.createModalButton,
								]}
								onPress={handleJoinRoom}>
								<Text style={styles.createButtonText}>
									Join
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	header: {
		padding: 15,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	createButton: {
		backgroundColor: "#007bff",
		borderRadius: 5,
		padding: 10,
		flex: 1,
		marginRight: 5,
		alignItems: "center",
	},
	joinButton: {
		backgroundColor: "#28a745",
		borderRadius: 5,
		padding: 10,
		flex: 1,
		marginLeft: 5,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	roomsList: {
		padding: 15,
	},
	roomItem: {
		backgroundColor: "#fff",
		borderRadius: 5,
		padding: 15,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	roomName: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 5,
	},
	roomParticipants: {
		color: "#666",
		fontSize: 14,
	},
	loader: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyState: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	emptyStateText: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		width: "80%",
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 15,
		textAlign: "center",
	},
	modalInput: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	modalButton: {
		borderRadius: 5,
		padding: 10,
		flex: 1,
		alignItems: "center",
	},
	cancelButton: {
		backgroundColor: "#f8f9fa",
		marginRight: 5,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	cancelButtonText: {
		color: "#212529",
	},
	createModalButton: {
		backgroundColor: "#007bff",
		marginLeft: 5,
	},
	createButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});

export default RoomsScreen;
