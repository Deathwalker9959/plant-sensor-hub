// Menu.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { getAuth } from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/routers";
import globalStyles from "../common/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useFirebase } from "../providers/auth/Firebase";
import { SensorValue, useSensorData } from "../providers/data/SensorFactory";
import { useData } from "../providers/data/DataContext";
import { ScrollView } from "react-native-gesture-handler";
type Props = {
	navigation: StackNavigationProp<ParamListBase, "pages/sensor_list_view">;
	route: RouteProp<ParamListBase, "pages/sensor_list_view">;
};

const SensorListView: React.FC<Props> = ({ navigation, route }: Props) => {
	//@ts-ignore
	const app: FirebaseApp = useFirebase();
	const sensorData = useSensorData();
	const previousScreen = () => {
		navigation.canGoBack() ? navigation.goBack() : navigation.navigate("pages/home");
	};

	const mappedSensorData = sensorData.map((v) => ({
		timestamp: v.values?.[0].date,
		value: v.values?.[0].value,
		label: v.title,
		unit: v.unit,
	}));

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
					Sensors List
				</Text>
			</View>
			<View style={styles.bodyRow}>
				<ScrollView style={{
					height: "100%",
					marginBottom: 40,
				}}>
					{mappedSensorData.map((v, i) => (
						<>
							<View
								key={i}
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									paddingHorizontal: 20,
									paddingVertical: 10,
								}}>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "center",
										alignContent: "center",
										alignItems: "center",
									}}>
									<MaterialIcons name="circle" size={16} color={globalStyles.submitButton.backgroundColor} />
									<Text style={{ ...globalStyles.textPrimary, paddingLeft: 20 }}>
										{v.label}
									</Text>
								</View>
								<Text style={{ ...globalStyles.textPrimary, color: "black" }}>
									{!Number.isNaN(Number.parseInt(v.value as any)) ? (v.value as number).toFixed(3) : v.value}{" "}{v.unit}
								</Text>
							</View>
							<View style={globalStyles.divider} key={`${i}_div`} />
						</>
					))}
				</ScrollView>
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

export default SensorListView;
