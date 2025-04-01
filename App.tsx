import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { AuthProvider } from "./Contexts/AuthContext";
import AppNavigator from "./Navigation/AppNavigator";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000,
			retry: 3,
		},
	},
});

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<SafeAreaProvider>
				{/* <AuthProvider> */}
				<AppNavigator />
				{/* </AuthProvider> */}
			</SafeAreaProvider>
		</QueryClientProvider>
	);
};

export default App;
