import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import globalStyles from "../common/styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
	const [email, setEmail] = useState("");

	const handleForgot = () => {
		// Login logic here
	};

	return (
		<View style={globalStyles.body}>
			<Text style={globalStyles.title}>Forgot Password</Text>
			<Link style={styles.signup} to="/pages/login">
				<Text style={globalStyles.textPrimary}>Login</Text>
			</Link>
			<Link style={globalStyles.closeBtn} to="/pages/login">
				<FontAwesome5 name="times" size={16} color="#BDBDBD" />
			</Link>
			<View style={globalStyles.formContainer}>
				<TextInput
					placeholder="Email"
					placeholderTextColor={"#BDBDBD"}
					style={{ ...globalStyles.input, ...globalStyles.input }}
					onChangeText={(text) => setEmail(text)}
					value={email}
				/>
				<View style={{ width: "80%", marginVertical: 20 }}>
					<TouchableOpacity onPress={() => handleForgot()}>
						<View style={{ ...globalStyles.input, ...globalStyles.submitButton }}>
							<Text style={globalStyles.submitText}>Send Reset Email</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	signup: {
		position: "absolute",
		top: 80,
		right: 40,
	},
});

export default ForgotPasswordScreen;
