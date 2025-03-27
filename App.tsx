import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat, IMessage, Message } from "react-native-gifted-chat";
import { View, StyleSheet, SafeAreaView } from "react-native";

const ChatScreen = () => {
	const [messages, setMessages] = useState<IMessage[]>([]);

	useEffect(() => {
		setMessages([
			{
				_id: 1,
				text: "Hello from Expo!",
				createdAt: new Date(),
				user: {
					_id: 2,
					name: "Expo User",
					avatar: "https://placeimg.com/140/140/any",
				},
			},
		]);
	}, []);

	const onSend = useCallback((newMessages: IMessage[] = []) => {
		setMessages((previousMessages) =>
			GiftedChat.append(previousMessages, newMessages)
		);
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<GiftedChat
				messages={messages}
				onSend={onSend}
				user={{
					_id: 1,
				}}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default ChatScreen;
