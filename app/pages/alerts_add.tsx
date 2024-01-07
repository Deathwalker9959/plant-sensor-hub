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
type Props = {
	navigation: StackNavigationProp<ParamListBase, "pages/alerts_add">;
	route: RouteProp<ParamListBase, "pages/alerts_add">;
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

const AlertsAdd: React.FC<Props> = ({ navigation, route }: Props) => {
	const data = useData(); // assuming useData is a custom hook
	const activeSensors = data?.dashboardPreferences?.dashboardPreferences?.activeIds ?? [];
	const allSensors = useSensorData(); // assuming useSensorData is a custom hook
	// Fetch sensor data
	const [sensorOptions, setSensorOptions] = useState<{ label: string; value: number }[]>(
		mapSensorOptions(allSensors, activeSensors),
	);

	const [selectedSensorId, setSelectedSensorId] = useState<number>(sensorOptions[0]?.value);
	const [selectedComparator, setSelectedComparator] = useState<">" | "<" | "=">(">");

	const previousScreen = () => {
		navigation.canGoBack() ? navigation.goBack() : navigation.navigate("pages/home");
	};

	const [alertName, setAlertName] = useState<string>("");
	const [alertValue, setAlertValue] = useState<string>();

	const createAlert = () => {
		data?.alerts?.updateAlert({
			operator: selectedComparator,
			sensorId: selectedSensorId,
			title: alertName,
			alertValue: alertValue!,
		})
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
					Create Alert
				</Text>
			</View>
			<View style={styles.bodyRow}>
				<TextInput
					placeholder="Alert Name"
					placeholderTextColor={"#BDBDBD"}
					style={{ ...globalStyles.input, alignSelf: "center", width: "100%" }}
					onChangeText={(text: string) => setAlertName(text)}
					value={alertName}
				/>
				<View style={globalStyles.divider} />
				<Text style={{ ...globalStyles.textPrimary, color: "black", textAlign: "center" }}>
					Sensor Name
				</Text>
				<Picker
					selectedValue={selectedSensorId}
					onValueChange={(value: number) => setSelectedSensorId(value)}
					placeholder="Select a sensor">
					{sensorOptions.map((sensor, idx) => (
						<Picker.Item key={idx} label={sensor.label} value={sensor.value} />
					))}
				</Picker>
				<View style={globalStyles.divider} />
				<Text style={{ ...globalStyles.textPrimary, color: "black", textAlign: "center" }}>
					Comparison Method
				</Text>
				<View style={{ flexDirection: "row", flexWrap: "nowrap" }}>
					<Picker
						style={{ width: "50%" }}
						selectedValue={selectedComparator}
						onValueChange={setSelectedComparator}>
						<Picker.Item label="Greater than" value=">" />
						<Picker.Item label="Less Than" value="<" />
						<Picker.Item label="Equal to" value="=" />
					</Picker>
					<TextInput
						placeholder="Value"
						placeholderTextColor={"#BDBDBD"}
						style={{ ...globalStyles.input, alignSelf: "center", width: "50%" }}
						onChangeText={setAlertValue}
						value={alertValue?.toString()}
					/>
				</View>
				<View style={globalStyles.divider} />
				<TouchableOpacity
					style={{
						...globalStyles.submitButton,
						backgroundColor: globalStyles.textPrimary.color,
						marginTop: 20,
					}}
					onPress={createAlert}>
					<Text style={{ ...globalStyles.submitText }}>
						<FontAwesome5 name="plus" size={16} color="white" />
						{"  "}
						Create Alert
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

export default AlertsAdd;
