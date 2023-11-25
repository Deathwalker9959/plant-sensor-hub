import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Link } from "@react-navigation/native";
import globalStyles from "../common/styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/routers";

type Props = {
	navigation: StackNavigationProp<ParamListBase, "pages/signup">;
	route: RouteProp<ParamListBase, "pages/signup">;
};

const SignupScreen: React.FC<Props> = ({ navigation, route }: Props) => {
	//@ts-ignore
	const app = route.params?.app;
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isChecked, setChecked] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);
	const [registered, setRegistered] = useState(false);

	const auth = getAuth(app);

	const handleSignup = async () => {
		try {
			setSubmitting(true);
			await createUserWithEmailAndPassword(auth, email, password);
			setSubmitting(false);
			setRegistered(true);
			navigation.navigate("pages/menu");
		} catch (error) {
			setSubmitting(false);
			if (typeof error === "string") {
				Alert.alert("Error", error);
			} else if (error instanceof Error) {
				Alert.alert("Error", error.message);
			} else {
				Alert.alert("Error", "An error occurred during signup.");
			}
		}
	};
	return (
		<View style={globalStyles.body}>
			<Text style={globalStyles.title}>Sign Up</Text>
			<Link style={styles.signup} to="/pages/login">
				<Text style={globalStyles.textPrimary}>Login</Text>
			</Link>
			<Link style={globalStyles.closeBtn} to="/pages/login">
				<FontAwesome5 name="times" size={16} color="#BDBDBD" />
			</Link>
			<View style={globalStyles.formContainer}>
				<TextInput
					placeholder="Name"
					placeholderTextColor={"#BDBDBD"}
					style={{ ...globalStyles.input, ...globalStyles.input }}
					onChangeText={(text) => setName(text)}
					value={name}
				/>
				<TextInput
					placeholder="Email"
					placeholderTextColor={"#BDBDBD"}
					style={{ ...globalStyles.input, ...globalStyles.input }}
					onChangeText={(text) => setEmail(text)}
					value={email}
				/>
				<TextInput
					placeholder="Password"
					placeholderTextColor={"#BDBDBD"}
					style={{ ...globalStyles.input, ...globalStyles.input }}
					secureTextEntry
					onChangeText={(text) => setPassword(text)}
					value={password}
				/>
				<View style={styles.section}>
					<Checkbox
						style={styles.checkbox}
						value={isChecked}
						onValueChange={setChecked}
						color={isChecked ? "#5DB075" : undefined}
					/>
					<Text style={styles.paragraph}>I would like to receive alerts.</Text>
				</View>
				<View style={{ width: "80%", marginVertical: 20 }}>
					<TouchableOpacity onPress={() => handleSignup()} disabled={registered}>
						<View style={{ ...globalStyles.input, ...globalStyles.submitButton }}>
							{registered ? (
								<View style={{ alignSelf: "center" }}>
									<FontAwesome5 name="check" size={20} color={globalStyles.submitText.color} />
								</View>
							) : (
								<TouchableOpacity onPress={() => handleSignup()} disabled={registered}>
									{isSubmitting ? (
										<ActivityIndicator
											style={{ ...globalStyles.submitText }}
											size="small"
											color={globalStyles.submitText.color}
										/>
									) : (
										<Text style={globalStyles.submitText}>Sign Up</Text>
									)}
								</TouchableOpacity>
							)}
						</View>
					</TouchableOpacity>
				</View>
				<Link to="/pages/forgot_password">
					<Text style={globalStyles.textPrimary}>Forgot your password?</Text>
				</Link>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		width: "80%",
		flexDirection: "row",
		alignItems: "center",
	},
	checkbox: {
		marginTop: 10,
		marginRight: 10,
		backgroundColor: "#F6F6F6",
		borderWidth: 1,
		borderColor: "#E8E8E8",
		borderRadius: 4,
	},
	signup: {
		position: "absolute",
		top: 80,
		right: 40,
	},
	paragraph: {
		marginTop: 10,
		fontSize: 14,
		fontFamily: "Inter",
		color: "#666666",
		textAlign: "center",
	},
});

export default SignupScreen;
