// NotFoundScreen.tsx
// This file defines a fallback screen for routes that do not exist.
// It provides a user-friendly message and a link to navigate back to the home screen.

import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "Oops!" }} />
			<View style={styles.container}>
				<Text style={styles.title}>This screen doesn't exist.</Text>

				<Link href="/" style={styles.link}>
					<Text style={styles.linkText}>Go to home screen!</Text>
				</Link>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	link: {
		marginTop: 15,
		paddingVertical: 15,
	},
	linkText: {
		fontSize: 14,
		color: "#2e78b7",
	},
});
