// Menu.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from "react-native";
import { getAuth } from "firebase/auth";
import { getDatabase, set, update, get, ref } from "firebase/database";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/routers";
import globalStyles from "../common/styles";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFirebase } from "../providers/auth/Firebase";
import Switch from "../components/Switch";
import TextEdit from "../components/TextEdit";
import RadioGroup, { RadioOption } from "../components/RadioGroup";
import { PreferencesData, useData } from "../providers/data/DataContext";

type Props = {
	navigation: StackNavigationProp<ParamListBase, "pages/profile">;
	route: RouteProp<ParamListBase, "pages/profile">;
};

const ProfileScreen: React.FC<Props> = ({ navigation, route }: Props) => {
	//@ts-ignore
	const app: FirebaseApp = useFirebase();
	const auth = getAuth(app);
	const db = getDatabase(app);
	const user = auth.currentUser;
	const [selectedOption, setSelectedOption] = useState("");
	const data = useData();

	const [preferences, setPreferences] = useState<PreferencesData | null>(
		data?.preferences?.preferences ?? null,
	);

	const temperatureOptions: RadioOption[] = [
		{
			label: "Celsius",
			value: "C",
		},
		{
			label: "Fahrenheit",
			value: "F",
		},
	];
	const clockOptions: RadioOption[] = [
		{
			label: "12 Hour",
			value: 0,
		},
		{
			label: "24 Hour",
			value: 1,
		},
	];
	const alertsOptions: RadioOption[] = [
		{
			label: "On",
			value: true,
		},
		{
			label: "Off",
			value: false,
		},
	];

	const previousScreen = () => {
		navigation.goBack();
	};

	const goToMenu = () => {
		navigation.navigate("pages/menu");
	};

	return (
		<View style={{ ...globalStyles.body, justifyContent: undefined }}>
			<View style={styles.header}>
				<View style={styles.headerContainer}>
					<TouchableOpacity onPress={goToMenu}>
						<FontAwesome5 name="bars" color={globalStyles.submitText.color} size={24} />
					</TouchableOpacity>
					<Text style={styles.title}>Profile</Text>
					<TouchableOpacity onPress={previousScreen}>
						<Text style={globalStyles.submitText}>Back</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.profileContainer}>
				<Text style={{ ...globalStyles.title, top: undefined, position: undefined }}>
					Welcome George
				</Text>
				<Text style={{ ...globalStyles.title, top: undefined, position: undefined, fontSize: 16 }}>
					Role: Manager
				</Text>
				<View style={{ top: 10, width: 300, marginBottom: 20 }}>
					<Switch
						options={["Account", "Preferences"]}
						textColor="#BDBDBD"
						selectedTextColor={globalStyles.textPrimary.color}
						height={40}
						borderRadius={50}
						selectedOption={(val) => setSelectedOption(val)}
					/>
				</View>
				<View style={{ width: "100%" }}>
					{selectedOption === "Account" ? (
						<View>
							<TextEdit
								initialValue={user?.email}
								style={{ width: "100%" }}
								fieldName="Email"></TextEdit>
						</View>
					) : (
						<View>
							<RadioGroup
								options={temperatureOptions}
								fieldName="Temperature Units"
								onValueChange={(value) =>
									data?.preferences?.updatePreference("temperatureOptions", value)
								}
								preselected={preferences?.temperatureOptions ?? "C"}></RadioGroup>
							<RadioGroup
								options={clockOptions}
								fieldName="Clock"
								onValueChange={(value) =>
									data?.preferences?.updatePreference("clockOptions", value)
								}
								preselected={preferences?.clockOptions ?? 0}></RadioGroup>
							<RadioGroup
								options={alertsOptions}
								fieldName="Alerts"
								onValueChange={(value) =>
									data?.preferences?.updatePreference("alertsOptions", value)
								}
								preselected={preferences?.alertsOptions ?? false}></RadioGroup>
						</View>
					)}
				</View>
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
	profileContainer: {
		top: 10,
		bottom: 10,
		display: "flex",
		alignItems: "center",
		width: "80%",
		paddingHorizontal: 20,
	},
});

export default ProfileScreen;
