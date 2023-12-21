import React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/routers";
import globalStyles from "../common/styles";
import { useFirebase } from "../auth/Firebase";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
	navigation: StackNavigationProp<ParamListBase, "pages/home">;
	route: RouteProp<ParamListBase, "pages/home">;
};

const HomeScreen: React.FC<Props> = ({ navigation, route }: Props) => {
	// @ts-ignore
	const app: FirebaseApp = useFirebase();

	return (
		<ScrollView style={{ flex: 1 }}>
			<View style={styles.headerRow}>
				<Text style={{ ...globalStyles.title, ...styles.title }}>Sensors</Text>
			</View>
			<View style={styles.navBarRow}>
				<TouchableOpacity style={styles.menuButton}>
					<Text style={styles.menuButtonText}>Groups</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.menuButton}>
					<Text style={styles.menuButtonText}>Triggers</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.menuButton}>
					<Text style={styles.menuButtonText}>Sensors</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.bodyRow}>{/* Body Content Here */}</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	title: {
		position: undefined,
		top: undefined,
	},
	headerRow: {
		...globalStyles.body,
		flexDirection: "row",
		justifyContent: "center",
		height: "auto",
		paddingTop: 50,
		paddingBottom: 20,
	},
	navBarRow: {
		...globalStyles.body,
		flexDirection: "row",
		justifyContent: "space-between",
		height: "auto",
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
	bodyRow: {
		...globalStyles.body,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	// Existing styles
	menuButton: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 10,
		backgroundColor: globalStyles.submitButton.backgroundColor,
		width: 100,
		height: 33,
		boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 4,
		shadowColor: "rgb(0, 0, 0)",
		shadowOpacity: 0.25,
		elevation: 4,
	},
	menuButtonText: {
		color: "white",
		fontSize: 16,
		fontFamily: "Inter",
		fontWeight: "600",
		textAlign: "center",
		width: "100%",
	},
});

export default HomeScreen;
