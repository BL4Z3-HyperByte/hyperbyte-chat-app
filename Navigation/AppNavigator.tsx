import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../hooks/useAuth";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";

function AppNavigator() {
	const { isAuthenticated } = useAuth();

	return (
		<NavigationContainer>
			{isAuthenticated ? <AppStack /> : <AuthStack />}
		</NavigationContainer>
	);
}

export default AppNavigator;
