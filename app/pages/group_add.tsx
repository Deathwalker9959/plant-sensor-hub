// Menu.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/routers";
import globalStyles from "../common/styles";
import { SensorData, useSensorData } from "../providers/data/SensorFactory";
import { useData } from "../providers/data/DataContext";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import MultiSelect from "react-native-multiple-select";
type Props = {
	navigation: StackNavigationProp<ParamListBase, "pages/group_add">;
	route: RouteProp<ParamListBase, "pages/group_add">;
};

const mapSensorOptions = (
	sensors: SensorData[],
	activeIds: Set<number> | never[],
): { label: string; value: number }[] => {
	const filteredSensors = sensors.filter(
		(sensor) => Array.from(activeIds.values()).includes(sensor.id) === false,
	);
	// Transform to picker format
	const pickerOptions = filteredSensors.map((sensor) => ({
		label: sensor.title,
		value: sensor.id,
	}));
	return pickerOptions;
};

const GroupAdd: React.FC<Props> = ({ navigation, route }: Props) => {
	const data = useData(); // assuming useData is a custom hook
	const activeSensors = data?.dashboardPreferences?.dashboardPreferences?.activeIds ?? [];
	const allSensors = useSensorData(); // assuming useSensorData is a custom hook
	// Fetch sensor data
	const [sensorOptions, setSensorOptions] = useState<{ label: string; value: number }[]>(
		mapSensorOptions(allSensors, activeSensors),
	);

	const [selectedSensorId, setSelectedSensorId] = useState<number>(sensorOptions[0]?.value);

	const previousScreen = () => {
		navigation.canGoBack() ? navigation.goBack() : navigation.navigate("pages/home");
	};

	const [groupName, setGroupName] = useState<string>("");

	const [selectedSensors, setSelectedSensors] = useState<number[]>([]);

	const onSelectedItemsChange = (selectedItems: number[]) => {
		setSelectedSensors(selectedItems);
	};

	const createGroup = () => {
		const groups = (data?.groups?.groups ?? []).filter((v) => v);
		let id = Math.max(...(groups.length > 0 ? groups.map((v) => v.id) : [0])) + 1;
		data?.groups?.updateGroup({ id: id, title: groupName, sensorIds: selectedSensors });
		previousScreen();
	};

	return (
		<View style={{ flex: 1, backgroundColor: globalStyles.body.backgroundColor }}>
			<View style={styles.headerRow}>
				<TouchableOpacity style={styles.dockLeft} onPress={previousScreen}>
					<Text style={{ ...globalStyles.textPrimary }}>Back</Text>
				</TouchableOpacity>
				<Text
					style={{ ...globalStyles.title, ...styles.title }}
					numberOfLines={2}
					ellipsizeMode="clip">
					Create Group
				</Text>
			</View>
			<View style={styles.bodyRow}>
				<TextInput
					placeholder="Group Name"
					placeholderTextColor={"#BDBDBD"}
					style={{ ...globalStyles.input, alignSelf: "center", width: "100%" }}
					onChangeText={(text: string) => setGroupName(text)}
					value={groupName}
				/>
				<View style={globalStyles.divider} />
				<View style={{ marginTop: 10 }}>
					<MultiSelect
						hideTags
						items={allSensors.map((v) => ({ id: v.id, name: v.title })) || []}
						uniqueKey="id"
						onSelectedItemsChange={onSelectedItemsChange}
						selectedItems={selectedSensors}
						selectText="Select Sensors"
						searchInputPlaceholderText="Search Sensors..."
						altFontFamily="Inter"
						tagRemoveIconColor="#CCC"
						tagBorderColor="#CCC"
						tagTextColor="#CCC"
						selectedItemTextColor={globalStyles.textPrimary.color}
						selectedItemIconColor={globalStyles.textPrimary.color}
						itemTextColor="#000"
						displayKey="name"
						searchInputStyle={{ color: "#CCC" }}
						submitButtonColor="#CCC"
						submitButtonText="Submit"
					/>
				</View>
				<TouchableOpacity
					style={{
						...globalStyles.submitButton,
						backgroundColor: globalStyles.textPrimary.color,
						marginTop: 20,
					}}
					onPress={createGroup}>
					<Text style={{ ...globalStyles.submitText }}>
						<FontAwesome5 name="plus" size={16} color="white" />
						{"  "}
						Create Group
					</Text>
				</TouchableOpacity>
			</View>
		</View>
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
		height: "auto",
		paddingTop: 50,
		paddingBottom: 20,
		paddingHorizontal: 20,
	},
	bodyRow: {
		...globalStyles.body,
		alignItems: undefined,
		justifyContent: undefined,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	dockLeft: {
		position: "absolute",
		left: 20,
		top: 55,
	},
	graph: {
		width: "100%",
		height: 200,
		marginVertical: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	graphSelect: {
		width: "100%",
		height: 50,
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	intervalSelection: {
		fontSize: 16,
		backgroundColor: globalStyles.textPrimary.color,
		borderRadius: 10,
		width: 80,
		height: 40,
		justifyContent: "center",
		textAlignVertical: "center",
		textAlign: "center",
		color: "white",
		elevation: 5,
	},
});

export default GroupAdd;
