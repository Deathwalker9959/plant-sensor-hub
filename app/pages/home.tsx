import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/routers";
import globalStyles from "../common/styles";
import { useFirebase } from "../providers/auth/Firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import SensorBlock from "../components/SensorBlock";
import {
	SensorData,
	SensorValue,
	getSensorData,
	useSensorData,
} from "../providers/data/SensorFactory";
import { FirebaseApp } from "firebase/app";
import { useData } from "../providers/data/DataContext";

type Props = {
	navigation: StackNavigationProp<ParamListBase, "pages/home">;
	route: RouteProp<ParamListBase, "pages/home">;
};

const HomeScreen: React.FC<Props> = ({ navigation, route }: Props) => {
	const app: FirebaseApp = useFirebase()!;
	const data = useData();

	const [sensorData, setSensorData] = useState<SensorData[]>(useSensorData());
	const [sensorDataLoaded, setSensorDataLoaded] = useState<boolean>(false);

	const navigateToSensorView = (sensorId: number, sensorData?: SensorValue[]) => {
		data?.selectedSensor?.setSelectedSensor({
			selectedSensor: sensorId,
		});
		navigation.navigate("pages/sensor_view", { sensorId });
	};

	const previousScreen = () => {
		navigation.canGoBack() ? navigation.goBack() : navigation.navigate("pages/home");
	};

	return (
		<ScrollView style={{ flex: 1, backgroundColor: globalStyles.body.backgroundColor }}>
			<View style={styles.headerRow}>
				<TouchableOpacity containerStyle={styles.space33} onPress={previousScreen}>
					<Text style={{...globalStyles.textPrimary}}>Back</Text>
				</TouchableOpacity>
				<Text style={{ ...globalStyles.title, ...styles.title }}>Sensors</Text>
				<View style={styles.space33}></View>
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
			<View style={styles.bodyRow}>
				{sensorData.map((v, i) => (
					<SensorBlock
						key={i}
						sensorId={v.id ?? -1}
						sensorName={v.title ?? "N/A"}
						sensorUnit={v.unit ?? "N/A"}
						sensorValue={v.values?.[0]?.value.toString() ?? "N/A"}
						sensorHistoricalData={v.values}
						onPress={navigateToSensorView}
					/>
				))}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	title: {
		position: undefined,
		top: undefined,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
	},
	headerRow: {
		...globalStyles.body,
		flexDirection: "row",
		justifyContent: 'space-between',
		height: "auto",
		paddingTop: 50,
		paddingBottom: 20,
		paddingHorizontal: 20,
	},
	navBarRow: {
		...globalStyles.body,
		flexDirection: "row",
		justifyContent: "space-between",
		height: "auto",
		paddingHorizontal: 20,
		paddingTop: 10,
		paddingBottom: 20,
	},
	bodyCol: {
		...globalStyles.body,
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: undefined,
	},
	bodyRow: {
		...globalStyles.body,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: undefined,
		paddingHorizontal: 20,
		flexWrap: "wrap",
		height: "100%",
		marginBottom: undefined,
	},
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
	space33: {
		width: "33.33%",
	},
});

export default HomeScreen;
