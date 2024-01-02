import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { Link } from "@react-navigation/native";
import globalStyles from "../common/styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/routers";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useFirebase } from "../providers/auth/Firebase";
import { useUser } from "../providers/auth/UserContext";
import * as SecureStore from "expo-secure-store";
import Checkbox from "expo-checkbox";
import { FirebaseError } from "firebase/app";

type Props = {
	navigation: StackNavigationProp<ParamListBase, "pages/login">;
	route: RouteProp<ParamListBase, "pages/login">;
};

const LoginScreen: React.FC<Props> = ({ navigation, route }: Props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);

	const { user, setUser } = useUser();

	//@ts-ignore
	const app: FirebaseApp = useFirebase();
	const auth = getAuth(app);

	const handleLogin = async () => {
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			if (userCredential) {
				const userObject = userCredential.user;
				if (rememberMe) SecureStore.setItemAsync("user", JSON.stringify(userObject));
				setUser(userObject); // Now you're setting the actual user object
			}
		} catch (error) {
			if (typeof error === "string") {
				Alert.alert("Error", error);
			} else if (error instanceof FirebaseError) {
				switch (error.code) {
					case "auth/invalid-email":
						Alert.alert("Error", "Invalid email address.");
						break;
					case "auth/user-disabled":
						Alert.alert("Error", "This account has been disabled.");
						break;
					case "auth/user-not-found":
						Alert.alert("Error", "This account does not exist.");
						break;
					case "auth/wrong-password":
						Alert.alert("Error", "Incorrect password.");
						break;
					default:
						Alert.alert("Error", "An error occurred during login.");
				}
			} else {
				Alert.alert("Error", "An error occurred during login.");
			}
		}
	};

	return (
		<View style={globalStyles.body}>
			<Text style={globalStyles.title}>Log In</Text>
			<Link style={styles.signup} to="/pages/signup">
				<Text style={globalStyles.textPrimary}>Sign Up</Text>
			</Link>
			<View style={globalStyles.formContainer}>
				<TextInput
					placeholder="Email"
					placeholderTextColor={"#BDBDBD"}
					style={globalStyles.input}
					onChangeText={(text) => setEmail(text)}
					value={email}
				/>
				<TextInput
					placeholder="Password"
					placeholderTextColor={"#BDBDBD"}
					style={globalStyles.input}
					secureTextEntry
					onChangeText={(text) => setPassword(text)}
					value={password}
				/>
				<View style={{ ...globalStyles.input, ...styles.checkboxContainer }}>
					<Text style={styles.checkboxText}>Remember Me</Text>
					<Checkbox
						value={rememberMe}
						onValueChange={(val) => setRememberMe(val)}
						style={{ ...globalStyles.input, ...styles.checkbox }}></Checkbox>
				</View>
				<View style={{ width: "80%", marginVertical: 20 }}>
					<TouchableOpacity onPress={() => handleLogin()}>
						<View style={{ ...globalStyles.input, ...globalStyles.submitButton }}>
							<Text style={globalStyles.submitText}>Log In</Text>
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
	signup: {
		position: "absolute",
		top: 80,
		right: 40,
	},
	checkboxContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "transparent",
		borderColor: "transparent",
		margin: 0,
		padding: 0,
		paddingLeft: 10,
		marginVertical: 0,
	},
	checkbox: {
		height: 30,
		width: 30,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "#BDBDBD",
	},
	checkboxText: {
		fontWeight: "500",
		color: "#BDBDBD",
		alignSelf: "center",
	},
});

export default LoginScreen;
