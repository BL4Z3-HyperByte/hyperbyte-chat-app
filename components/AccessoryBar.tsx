import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import {
	getLocationAsync,
	pickImageAsync,
	takePictureAsync,
} from "../mediaUtils";

export default class AccessoryBar extends React.Component<any> {
	render() {
		const { onSend, isTyping } = this.props;

		return (
			<View style={styles.container}>
				<Button
					onPress={() => pickImageAsync(onSend)}
					name='photo'
				/>
				<Button
					onPress={() => takePictureAsync(onSend)}
					name='camera'
				/>
				<Button
					onPress={() => getLocationAsync(onSend)}
					name='my-location'
				/>
				<Button
					onPress={() => {
						isTyping();
					}}
					name='chat'
				/>
			</View>
		);
	}
}

const Button = ({
	onPress,
	size = 30,
	color = "rgba(0,0,0,0.5)",
	...props
}: {
	onPress: () => void;
	size?: number;
	color?: string;
} & Record<string, any>) => (
	<TouchableOpacity onPress={onPress}>
		<MaterialIcons
			size={size}
			color={color}
			{...props}
		/>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	container: {
		height: 44,
		width: "100%",
		backgroundColor: "white",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: "rgba(0,0,0,0.3)",
	},
});
