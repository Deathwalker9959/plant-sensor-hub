import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";

interface SwitchProps {
	options: string[];
	backgroundColor?: string;
	textColor?: string;
	selectedColor?: string;
	width: number;
	height: number;
	borderColor?: string;
	borderRadius?: number;
	borderWidth?: number;
}

const Switch: React.FC<SwitchProps> = ({
	options,
	backgroundColor,
	textColor,
	selectedColor,
	width,
	height,
	borderColor,
	borderRadius,
	borderWidth,
}) => {
	const [selectedOption, setSelectedOption] = useState(options[0]);
	const animate = useRef(new Animated.Value(0)).current;

	const switchOption = () => {
		setSelectedOption(selectedOption === options[0] ? options[1] : options[0]);
		Animated.spring(animate, {
			toValue: selectedOption === options[0] ? 1 : 0,
			damping: 10,
			useNativeDriver: true,
		}).start();
	};

	const switchStyle = {
		left: 0,
		top: borderWidth ?? 1,
		transform: [
			{
				translateX: animate.interpolate({
					inputRange: [0, 1],
					outputRange: [0, width / 2 - (borderWidth ?? 1) * 2], // adjust translateX to match the width of each option
				}),
			},
		],
		backgroundColor: selectedColor ?? "white",
		width: width / 2, // Set width to half of the container to match the size of each option
		height: height - 4 * (borderWidth ?? 1),
	};

	return (
		<TouchableOpacity onPress={switchOption} style={{ width: width, height: height }}>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: backgroundColor ?? "#F6F6F6",
					borderRadius: borderRadius ?? 1,
					borderColor: borderColor ?? "#E8E8E8",
					borderWidth: borderWidth ?? 1,
					width: width,
					height: height,
				}}>
				<Animated.View style={{ ...switchStyle, position: "absolute" }} />
				{options.map((option, index) => {
					return (
						<Text
							key={index}
							style={{
								flex: 1,
								textAlign: "center",
								color: textColor ?? "black",
							}}>
							{option}
						</Text>
					);
				})}
			</View>
		</TouchableOpacity>
	);
};

export default Switch;
