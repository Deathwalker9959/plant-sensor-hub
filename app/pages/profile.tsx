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
import { useFirebase } from "../auth/Firebase";
import Switch from "../components/switch";
import TextEdit from "../components/textedit";
import RadioGroup, { RadioOption } from "../components/radiogroup";

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

	const [temperaturePreference, setTemperaturePreference] = useState("Celsius");
	const [clockPreference, setClockPreference] = useState("12 Hour");
	const [alertsPreference, setAlertsPreference] = useState(false);

	const temperatureOptions: RadioOption[] = [
		{
			label: "Celsius",
			value: "Celsius",
		},
		{
			label: "Fahrenheit",
			value: "Fahrenheit",
		},
	];
	const clockOptions: RadioOption[] = [
		{
			label: "12 Hour",
			value: "12",
		},
		{
			label: "24 Hour",
			value: "24",
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

	const updateFirestore = (settingName: string, value: any) => {
		if (!user?.uid) return; // No user logged in

		const updates: any = {};
		updates[`users/${user.uid}/${settingName}`] = value;
		update(ref(db), updates);
	};

	const getUserPreferences = () => {
		if (!user?.uid) return; // No user logged in

		//get data from preferences
		get(ref(db, `users/${user.uid}`)).then((snapshot) => {
			console.log("snapshot", snapshot.val());
			if (snapshot.exists()) {
				const data = snapshot.val();
				setTemperaturePreference(data.temperatureOptions);
				setClockPreference(data.clockOptions);
				setAlertsPreference(data.alertsOptions);
			} else {
				console.log("No data available");
			}
		});
	};

	getUserPreferences();

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
								onValueChange={(value) => updateFirestore("temperatureOptions", value)}
								preselected={temperaturePreference}></RadioGroup>
							<RadioGroup
								options={clockOptions}
								fieldName="Clock"
								onValueChange={(value) => updateFirestore("clockOptions", value)}
								preselected={clockPreference}></RadioGroup>
							<RadioGroup
								options={alertsOptions}
								fieldName="Alerts"
								onValueChange={(value) => updateFirestore("alertsOptions", value)}
								preselected={alertsPreference}></RadioGroup>
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
