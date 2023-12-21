// Menu.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/routers";
import globalStyles from "../common/styles";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFirebase } from "../auth/Firebase";

type Props = {
	navigation: StackNavigationProp<ParamListBase, "pages/menu">;
	route: RouteProp<ParamListBase, "pages/menu">;
};

const MenuScreen: React.FC<Props> = ({ navigation, route }: Props) => {
	//@ts-ignore
	const app: FirebaseApp = useFirebase();
	const auth = getAuth(app);

	const previousScreen = () => {
		navigation.canGoBack() ? navigation.goBack() : navigation.navigate("pages/home");
	};

	const navigateTo = (dest: string) => {
		navigation.navigate(dest);
	};

	const menuOptions = ["Home", "Sensors", "Profile", "Alerts", "Groups", "Triggers", "Preferences"];

	return (
		<View style={{ ...globalStyles.body, justifyContent: undefined }}>
			<TouchableOpacity style={globalStyles.headerLeft} onPress={previousScreen}>
				<Text style={globalStyles.textPrimary}>Back</Text>
			</TouchableOpacity>

			<Text style={globalStyles.title}>Menu</Text>

			<View style={{ top: 130, width: "100%", alignItems: "center" }}>
				{menuOptions.map((item, index) => (
					<View key={index} style={{ width: "80%" }}>
						<TouchableOpacity
							style={styles.menuButton}
							onPress={() => navigateTo(`pages/${item.toLowerCase()}`)}>
							<Text style={styles.menuButtonText}>{item}</Text>
						</TouchableOpacity>
						<View style={globalStyles.divider} />
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	menuButton: {
		flexDirection: "row",

		alignItems: "center",
	},
	menuButtonText: {
		color: "black",

		fontSize: 16,
		fontFamily: "Inter",

		fontWeight: "600",
	},
});

export default MenuScreen;
