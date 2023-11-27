// Menu.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { getAuth } from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/routers";
import globalStyles from "../common/styles";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFirebase } from "../auth/Firebase";
import Switch from "../components/switch";

type Props = {
	navigation: StackNavigationProp<ParamListBase, "pages/account">;
	route: RouteProp<ParamListBase, "pages/account">;
};

const AccountScreen: React.FC<Props> = ({ navigation, route }: Props) => {
	//@ts-ignore
	const app: FirebaseApp = useFirebase();
	const auth = getAuth(app);
	const user = auth.currentUser?.email;

	const previousScreen = () => {
		navigation.goBack();
	};

	const goToMenu = () => {
		navigation.navigate("pages/menu");
	}

	return (
		<View style={{ ...globalStyles.body, justifyContent: undefined }}>
			<View style={styles.header}>
				<View style={styles.headerContainer}>
					<TouchableOpacity onPress={goToMenu}>
						<FontAwesome5 name="bars" color={globalStyles.submitText.color} size={24} />
					</TouchableOpacity>
					<Text style={styles.title}>Account</Text>
					<TouchableOpacity onPress={previousScreen}>
						<Text style={globalStyles.submitText}>Back</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View style={{top:10}}>
			<Switch options={['asd','1']} width={100} height={100}></Switch>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		backgroundColor: globalStyles.textPrimary.color,
		height: "12.5%",
		width: "100%",
	},
	headerContainer: {
		width: "100%",
		height: "100%",
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	title: {
		color: globalStyles.submitText.color,
		fontSize: globalStyles.title.fontSize,
		fontFamily: globalStyles.title.fontFamily,
		fontWeight: globalStyles.title.fontWeight,
		flexGrow: 1,
		textAlign: "center",
	},
});

export default AccountScreen;
