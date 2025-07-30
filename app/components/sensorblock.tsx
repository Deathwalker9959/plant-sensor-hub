import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ReactElement } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useData } from "../providers/data/DataContext";
import { SensorValue } from "../providers/data/SensorFactory";

// SensorBlock.tsx
// Displays sensor information including name, value, and unit.
// Maps sensor units to appropriate icons and supports click actions.

interface SensorBlockProps {
	sensorId: number;
	sensorName: string;
	sensorValue?: string;
	sensorUnit?: string;
	sensorHistoricalData?: SensorValue[];
	showSensorUnit?: boolean;
	onPress?: (sensorId: number, sensorData?: SensorValue[]) => void;
}

const mapUnitToIcon = (unit: string): string => {
	switch (unit) {
		case "ppm": {
			return "smoke-detector-variant";
		}
		case "ppb": {
			return "smoke-detector-variant";
		}
		case "hPa": {
			return "thermometer-low";
		}
		case "%": {
			return "air-humidifier";
		}
		case "℃": {
			return "thermometer";
		}
		case "℉": {
			return "thermometer";
		}
		case "V": {
			return "power";
		}
		case "mA": {
			return "current-dc";
		}
		case "Wh": {
			return "gauge";
		}
		case "ppl": {
			return "human-queue";
		}
		case "Watt": {
			return "flash";
		}
		case "plus": {
			return "plus";
		}
		default: {
			return "weather-sunny";
		}
	}
};

const SensorBlock: React.FC<SensorBlockProps> = ({
	sensorId,
	sensorName,
	sensorValue,
	sensorUnit,
	sensorHistoricalData,
	showSensorUnit,
	onPress,
}) => {
	const data = useData();
	const temperatureOption = data?.preferences?.preferences?.temperatureOptions

	const handleSensorPress = () => {
		if (onPress) {
			onPress(sensorId, sensorHistoricalData);
		}
	};

	if (temperatureOption == "F" && sensorUnit == "℃") {
		sensorValue = ((parseFloat(sensorValue!) * 9) / 5 + 32).toFixed(2);
		sensorUnit = "℉";
	}

	return (
		<TouchableOpacity style={styles.container} onPress={handleSensorPress}>
			<Text style={styles.sensorName} ellipsizeMode="tail" numberOfLines={2}>
				{sensorName}
			</Text>

			<View style={styles.sensorIcon}>
				{/*@ts-ignore*/}
				<MaterialCommunityIcons name={mapUnitToIcon(sensorUnit ?? "")} size={57} color="black" />
			</View>

			<Text style={styles.sensorValue}>{sensorValue}</Text>

			{showSensorUnit !== false ? (<Text style={styles.sensorUnit}>{sensorUnit}</Text>) : null}
		</TouchableOpacity>
	);
};

export default SensorBlock;

const styles = StyleSheet.create({
	container: {
		width: 104,
		height: 183,
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
		backgroundColor: "#E8E8E8",
		borderRadius: 10,
		elevation: 4,
		border: "1px solid #E8E8E8",
		marginBottom: 20,
	},
	sensorName: {
		color: "black",
		fontSize: 18,
		fontFamily: "Inter",
		fontWeight: "400",
		paddingHorizontal: 10,
	},
	sensorIcon: {
		height: 52,
		objectFit: "scale-down",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	sensorValue: {
		color: "black",
		fontSize: 25,
		fontFamily: "Inter",
		fontWeight: "400",
		paddingBottom: 0,
		marginBottom: 0,
	},
	sensorUnit: {
		color: "black",
		fontSize: 14,
		fontFamily: "Inter",
		fontWeight: "400",
		paddingBottom: 10,
		paddingTop: 0,
		marginTop: -20,
	},
});
