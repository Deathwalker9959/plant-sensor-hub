// TextEdit.tsx
// A text input component with editing capabilities.
// Supports initial value, placeholder, and triggers a callback on text change.

import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, TextInputProps } from "react-native";
import globalStyles from "../common/styles";

interface TextEditProps extends TextInputProps {
	initialValue?: string | null;
	onTextChange?: (text: string) => void;
	fieldName?: string; // Add field name prop
}

const TextEdit: React.FC<TextEditProps> = ({
	initialValue = "",
	onTextChange,
	placeholder,
	placeholderTextColor,
	fieldName, // Use field name
	style,
	...textInputProps
}) => {
	const [text, setText] = useState<string | null>(initialValue);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const inputRef = useRef<TextInput>(null);

	const handleEditPress = () => {
		setIsEditing(true);
		inputRef.current?.focus();
	};

	useEffect(() => {
		setText(initialValue);
	}, [initialValue]);

	const handleBlur = () => {
		setIsEditing(false);
		if (text !== initialValue && text !== null) {
			onTextChange?.(text);
		}
	};

	// Ensure that style is an object before spreading it
	const combinedStyle = StyleSheet.flatten([styles.container, style]);

	return (
		<View>
			{fieldName && <Text style={styles.fieldName}>{fieldName}</Text>}
			<View style={combinedStyle}>
				<TextInput
					ref={inputRef}
					style={styles.textInput}
					value={text ?? ""}
					onChangeText={setText}
					placeholder={placeholder}
					placeholderTextColor={placeholderTextColor}
					onBlur={handleBlur}
					{...textInputProps}
				/>
				{!isEditing && (
					<TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
						<Text style={styles.buttonText}>Edit</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 10,
		flexDirection: "row",
	},
	fieldName: {
		fontSize: 16,
		marginBottom: 5,
	},
	textInput: {
		flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: globalStyles.divider.backgroundColor,
        borderTopWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
		borderWidth: 1,
		paddingHorizontal: 10,
		marginBottom: 10,
		flexDirection: "row",
        flexGrow:1,
	},
	editButton: {
		flexDirection: "row",
        borderBottomWidth: 1,
        padding:0,
        marginBottom:10,
        borderBottomColor: globalStyles.divider.backgroundColor,
	},
	buttonText: {
		color: "black",
        fontWeight: "bold",
        marginBottom: 10,
	},
});

export default TextEdit;
