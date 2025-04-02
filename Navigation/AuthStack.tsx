import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createStackNavigator();

export function AuthStack() {
	return (
		<Stack.Navigator initialRouteName='Login'>
			<Stack.Screen
				name='Login'
				component={LoginScreen}
				options={{ headerShown: true }}
			/>
			<Stack.Screen
				name='Register'
				component={RegisterScreen}
				options={{ headerShown: true }}
			/>
		</Stack.Navigator>
	);
}
