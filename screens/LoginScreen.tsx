import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";

const LoginScreen = ({ navigation }: any) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login, isLoggingIn, loginError } = useAuth();

	const handleLogin = () => {
		login({ email, password });
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={styles.keyboardAvoidingView}
				behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<View style={styles.formContainer}>
					<Text style={styles.title}>Welcome to Chat App</Text>

					<TextInput
						style={styles.input}
						placeholder='Email'
						value={email}
						onChangeText={setEmail}
						autoCapitalize='none'
						keyboardType='email-address'
					/>

					<TextInput
						style={styles.input}
						placeholder='Password'
						value={password}
						onChangeText={setPassword}
						secureTextEntry
					/>

					{loginError && (
						<Text style={styles.errorText}>
							{loginError instanceof Error
								? loginError.message
								: "Login failed"}
						</Text>
					)}

					<TouchableOpacity
						style={styles.button}
						onPress={handleLogin}
						disabled={isLoggingIn}>
						{isLoggingIn ? (
							<ActivityIndicator color='#fff' />
						) : (
							<Text style={styles.buttonText}>Log In</Text>
						)}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.registerLink}
						onPress={() => navigation.navigate("Register")}>
						<Text>Don't have an account? Register</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	keyboardAvoidingView: {
		flex: 1,
	},
	formContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 30,
	},
	input: {
		width: "100%",
		height: 50,
		backgroundColor: "#fff",
		borderRadius: 5,
		marginBottom: 15,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	button: {
		width: "100%",
		height: 50,
		backgroundColor: "#007bff",
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	errorText: {
		color: "red",
		marginBottom: 10,
	},
	registerLink: {
		marginTop: 20,
	},
});

export default LoginScreen;
