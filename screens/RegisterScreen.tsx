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

const RegisterScreen = ({ navigation }: any) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const { register, isRegistering, registerError } = useAuth();

	const handleRegister = () => {
		if (password !== confirmPassword) {
			setPasswordError("Passwords do not match");
			return;
		}

		setPasswordError("");
		register({
			username,
			email,
			password,
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={styles.keyboardAvoidingView}
				behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<View style={styles.formContainer}>
					<Text style={styles.title}>Create Account</Text>

					<TextInput
						style={styles.input}
						placeholder='Username'
						value={username}
						onChangeText={setUsername}
					/>

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

					<TextInput
						style={styles.input}
						placeholder='Confirm Password'
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						secureTextEntry
					/>

					{passwordError ? (
						<Text style={styles.errorText}>{passwordError}</Text>
					) : registerError ? (
						<Text style={styles.errorText}>
							{registerError instanceof Error
								? registerError.message
								: "Registration failed"}
						</Text>
					) : null}

					<TouchableOpacity
						style={styles.button}
						onPress={handleRegister}
						disabled={isRegistering}>
						{isRegistering ? (
							<ActivityIndicator color='#fff' />
						) : (
							<Text style={styles.buttonText}>Register</Text>
						)}
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.loginLink}
						onPress={() => navigation.navigate("Login")}>
						<Text>Already have an account? Log In</Text>
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
	loginLink: {
		marginTop: 20,
	},
});

export default RegisterScreen;
