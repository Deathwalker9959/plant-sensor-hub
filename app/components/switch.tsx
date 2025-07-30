// Switch.tsx
// A customizable switch component for toggling between options.
// Animates the selected option and supports dynamic styling.

import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Dimensions } from "react-native";
import { StyleSheet } from "react-native";


interface SwitchProps {
	options: string[];
	backgroundColor?: string;
	textColor?: string;
	selectedTextColor?: string;
	selectedColor?: string;
	width?: number;
	height: number;
	borderColor?: string;
	borderRadius?: number;
	borderWidth?: number;
	fieldName?: string;
	selectedOption?: (val: string) => void;
}

const Switch: React.FC<SwitchProps> = ({
	options,
	backgroundColor,
	textColor,
	selectedTextColor,
	selectedColor,
	width,
	height,
	borderColor,
	borderRadius,
	borderWidth,
	fieldName,
	selectedOption: selectedOptionProp,
}) => {
	const [parentWidth, setParentWidth] = useState(0); // State to store the parent's width
	const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
	const [selectedOption, setSelectedOption] = useState(options[0]);
	const animate = useRef(new Animated.Value(0)).current;
	const optionWidth = parentWidth / options.length; // Calculate the width of each option

	const switchOption = () => {
		const newIndex = selectedOptionIndex === 0 ? 1 : 0;
		setSelectedOption(selectedOption === options[0] ? options[1] : options[0]);
		setSelectedOptionIndex(newIndex);
		Animated.spring(animate, {
			toValue: selectedOption === options[0] ? optionWidth - (borderWidth ?? 1) * 2 : 0,
			useNativeDriver: false, // Set to false since we're animating non-Opacity/Translate properties
			bounciness: 0,
		}).start();
	};

	//On update selectedOption set selectedOptionProp
	useEffect(() => {
		if (selectedOptionProp)
			selectedOptionProp(selectedOption);
	}, [selectedOption]);

	const switchStyle = {
		left: 0,
		top: borderWidth ?? 1,
		transform: [
			{
				translateX: animate, // Use the animated value directly
			},
		],
		backgroundColor: selectedColor ?? "white",
		borderRadius: (borderRadius ?? 1) * 2,
		width: optionWidth - (borderWidth ?? 1) * 2,
		height: height - 4 * (borderWidth ?? 1),
	};

	return (
		<View>
			{fieldName && <Text style={styles.fieldName}>{fieldName}</Text>}
			<View
			onLayout={(event) => {
				const { width } = event.nativeEvent.layout;
				setParentWidth(width); // Update the state with the new width
			}}>
			<TouchableOpacity onPress={switchOption}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						backgroundColor: backgroundColor ?? "#F6F6F6",
						borderRadius: borderRadius ?? 1,
						borderColor: borderColor ?? "#E8E8E8",
						borderWidth: borderWidth ?? 1,
						width: "100%",
						height: height,
					}}>
					<Animated.View style={{ ...switchStyle, position: "absolute" }} />
					{options.map((option, index) => (
						<Text
							key={index}
							style={{
								flex: 1,
								textAlign: "center",
								color: index === selectedOptionIndex ? selectedTextColor ?? "green" : textColor ?? "black", // Change the color based on selection
							}}>
							{option}
						</Text>
					))}
				</View>
			</TouchableOpacity>
		</View>
		</View>
		
	);
};

const styles = StyleSheet.create({
	fieldName: {
		fontSize: 16,
		marginBottom: 5,
	}
})

export default Switch;
