import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { useAuth } from "../Contexts/AuthContext";

function AppNavigator() {
	const { isAuthenticated } = useAuth();

	return (
		<NavigationContainer>
			{isAuthenticated ? <AppStack /> : <AuthStack />}
		</NavigationContainer>
	);
}

export default AppNavigator;
