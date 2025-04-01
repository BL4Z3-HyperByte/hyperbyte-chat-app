import { createStackNavigator } from "@react-navigation/stack";
import RoomsScreen from "../screens/RoomsScreen";
import ChatScreen from "../screens/ChatScreen";

const Stack = createStackNavigator();

export function AppStack() {
	return (
		<Stack.Navigator initialRouteName='Rooms'>
			<Stack.Screen
				name='Rooms'
				component={RoomsScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='Chat'
				component={ChatScreen}
			/>
		</Stack.Navigator>
	);
}
