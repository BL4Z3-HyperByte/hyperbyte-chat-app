// src/screens/ChatScreen.tsx
import React, { useEffect } from "react";
import {
	View,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
	Text,
	Alert,
} from "react-native";
import {
	GiftedChat,
	Bubble,
	InputToolbar,
	Send,
} from "react-native-gifted-chat";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatScreen = ({ route, navigation }: any) => {
	const { roomId, roomName } = route.params;
	const { user } = useAuth();
	const userId = user?.id || "";

	const {
		messages,
		isLoading,
		error,
		sendMessage,
		loadMoreMessages,
		clearChat,
	} = useChat(roomId, userId);

	// Set navigation header title
	useEffect(() => {
		navigation.setOptions({
			title: roomName,
			headerRight: () => (
				<TouchableOpacity
					style={styles.clearButton}
					onPress={() => {
						Alert.alert(
							"Clear Chat",
							"Are you sure you want to clear all messages? This cannot be undone.",
							[
								{ text: "Cancel", style: "cancel" },
								{
									text: "Clear",
									style: "destructive",
									onPress: () => clearChat(),
								},
							]
						);
					}}>
					<Text style={styles.clearButtonText}>Clear</Text>
				</TouchableOpacity>
			),
		});
	}, [navigation, roomName]);

	const renderBubble = (props: any) => {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: "#007bff",
					},
					left: {
						backgroundColor: "#f0f0f0",
					},
				}}
				textStyle={{
					right: {
						color: "#fff",
					},
					left: {
						color: "#000",
					},
				}}
			/>
		);
	};

	const renderInputToolbar = (props: any) => {
		return (
			<InputToolbar
				{...props}
				containerStyle={{
					backgroundColor: "#fff",
					borderTopColor: "#E8E8E8",
					borderTopWidth: 1,
					padding: 4,
				}}
			/>
		);
	};

	const renderSend = (props: any) => {
		return (
			<Send
				{...props}
				disabled={!props.text}
				containerStyle={{
					width: 44,
					height: 44,
					alignItems: "center",
					justifyContent: "center",
					marginHorizontal: 4,
				}}>
				<View
					style={{
						width: 32,
						height: 32,
						borderRadius: 16,
						backgroundColor: props.text ? "#007bff" : "#ccc",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Text style={{ color: "#fff", fontSize: 16 }}>→</Text>
				</View>
			</Send>
		);
	};

	if (error) {
		return (
			<View style={styles.centerContainer}>
				<Text style={styles.errorText}>
					{error instanceof Error
						? error.message
						: "An error occurred"}
				</Text>
				<TouchableOpacity
					style={styles.retryButton}
					onPress={() => navigation.goBack()}>
					<Text style={styles.retryButtonText}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			{isLoading && messages.length === 0 ? (
				<View style={styles.centerContainer}>
					<ActivityIndicator
						size='large'
						color='#007bff'
					/>
				</View>
			) : (
				<GiftedChat
					messages={messages}
					onSend={(messages) => sendMessage(messages)}
					user={{
						_id: userId,
						name: user?.username || "User",
						avatar: user?.avatar || undefined,
					}}
					renderBubble={renderBubble}
					renderInputToolbar={renderInputToolbar}
					renderSend={renderSend}
					alwaysShowSend
					scrollToBottom
					infiniteScroll
					loadEarlier={messages.length > 0}
					onLoadEarlier={loadMoreMessages}
					isLoadingEarlier={isLoading && messages.length > 0}
				/>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorText: {
		color: "red",
		fontSize: 16,
		marginBottom: 20,
		textAlign: "center",
		paddingHorizontal: 20,
	},
	retryButton: {
		backgroundColor: "#007bff",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 5,
	},
	retryButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	clearButton: {
		marginRight: 15,
	},
	clearButtonText: {
		color: "#007bff",
		fontSize: 16,
	},
});

export default ChatScreen;
