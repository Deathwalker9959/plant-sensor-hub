// Menu.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { getAuth } from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/routers";
import globalStyles from "../common/styles";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useFirebase } from "../providers/auth/Firebase";
import { deleteItemAsync } from "expo-secure-store";
import { useUser } from "../providers/auth/UserContext";
import { SensorValue, useSensorData } from "../providers/data/SensorFactory";
import { useData } from "../providers/data/DataContext";
import { BarChart } from "react-native-gifted-charts";
import { itemType } from "react-native-gifted-charts/src/BarChart/types";
import { ScrollView } from "react-native-gesture-handler";
type Props = {
	navigation: StackNavigationProp<ParamListBase, "pages/sensor_view">;
	route: RouteProp<ParamListBase, "pages/sensor_view">;
};

function aggregateSensorData(
	sensorData: SensorValue[],
	timeSpan: "Hourly" | "Daily" | "Weekly" | "Monthly",
): itemType[] {
	if (sensorData.length === 0) {
		return [];
	}

	// Adjusted function to get the start of the week
	const getWeekStart = (date: Date): Date => {
		const weekStart = new Date(date);
		weekStart.setDate(
			weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1),
		); // Set to Monday
		return weekStart;
	};

	const getWeekNumber = (date: Date): number => {
		const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
		return Math.ceil((date.getDate() + firstDayOfMonth.getDay() - 1) / 7);
	};

	// Helper function to format date strings
	const formatDateString = (d: Date) =>
		`${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;

	const formatDateLabel = (timestamp: string, timeSpan: string): string => {
		switch (timeSpan) {
			case "Hourly":
				return `${new Date(timestamp).getHours()}`;
			case "Daily":
				const dayDate = new Date(timestamp);
				return `${dayDate.getDay()}/${dayDate.getMonth() + 1}`;
			case "Weekly": {
				// Extract year, month, and week number from the timestamp
				const [year, month, week] = timestamp.split(/[-W]/).map(Number);
				const firstDayOfMonth = new Date(year, month - 1, 1);
				const weekStart = new Date(firstDayOfMonth);
				weekStart.setDate(weekStart.getDate() + (week - 1) * 7 - weekStart.getDay() + 1);
				const weekEnd = new Date(weekStart);
				weekEnd.setDate(weekEnd.getDate() + 6);
				return `${formatDateString(weekStart)}-${formatDateString(weekEnd)}`;
			}
			case "Monthly":
				return `${new Date(timestamp).getMonth() + 1}/${new Date(timestamp).getFullYear()}`;
			default:
				return new Date(timestamp).toDateString();
		}
	};

	// Pre-slice data based on timeSpan
	if (timeSpan === "Daily") {
		sensorData = sensorData.slice(0, 7 * 24); // First 7 days (assuming 24 data points per day)
	} else if (timeSpan === "Weekly") {
		sensorData = sensorData.slice(0, 4 * 7 * 24); // First 4 weeks (assuming 7 days/week and 24 data points/day)
	} else if (timeSpan === "Monthly") {
		sensorData = sensorData.slice(0, 12 * 30 * 24); // Approx. first 12 months (assuming 30 days/month and 24 data points/day)
	} // No slicing needed for 'Hourly' as it takes the first 24 values directly

	// Sorting function for timestamps
	const sortByTimestamp = (a: [string, any], b: [string, any]) => {
		return new Date(a[0]).getTime() - new Date(b[0]).getTime();
	};

	const isNumberValues = sensorData?.every((v) => typeof v.value === "number");

	if (timeSpan === "Hourly") {
		// For Hourly, take the first 24 values
		return sensorData
			.slice(0, 24)
			.map((item, index) => ({
				timestamp: `${index}:00`,
				value: item.value,
				label: `${index}`,
			}))
			.sort(sortByTimestamp); // Sort hourly data
	} else {
		const aggregatedData: {
			[key: string]: { totalValue: number; count: number; hoursOn: number; hoursOff: number };
		} = {};

		sensorData.forEach((item) => {
			const date = new Date(item.date);
			let periodKey: string;

			if (timeSpan === "Daily") {
				periodKey = date.toISOString().split("T")[0];
			} else if (timeSpan === "Weekly") {
				const weekNumber = getWeekNumber(date);
				if (weekNumber > 4) {
					return; // Skip if the week number is beyond the first four weeks
				}
				periodKey = `${date.getFullYear()}-${date.getMonth() + 1}-W${weekNumber}`;
			} else {
				// Monthly
				periodKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
			}

			if (!aggregatedData[periodKey]) {
				aggregatedData[periodKey] = { totalValue: 0, count: 0, hoursOn: 0, hoursOff: 0 };
			}

			if (isNumberValues) {
				aggregatedData[periodKey].totalValue += item.value;
				aggregatedData[periodKey].count++;
			} else {
				if (item.value === "open") {
					aggregatedData[periodKey].hoursOn++;
				} else {
					aggregatedData[periodKey].hoursOff++;
				}
			}
		});

		// Sorting and mapping
		return Object.entries(aggregatedData).map(
			([timestamp, { totalValue, count, hoursOff, hoursOn }]) => {
				return {
					timestamp,
					value: isNumberValues ? totalValue / count : `On:${hoursOn}h Off:${hoursOff}h`,
					label: formatDateLabel(timestamp, timeSpan),
				};
			},
		) as itemType[];
	}
}

const MenuScreen: React.FC<Props> = ({ navigation, route }: Props) => {
	//@ts-ignore
	const app: FirebaseApp = useFirebase();
	const { sensorId } = route.params as { sensorId: number };
	const data = useData();
	const sensorData = useSensorData().find((v) => v.id === sensorId);
	const [dataInterval, setDataInterval] = useState<"Hourly" | "Daily" | "Weekly" | "Monthly">(
		"Hourly",
	);

	const previousScreen = () => {
		navigation.canGoBack() ? navigation.goBack() : navigation.navigate("pages/home");
	};

	const isNumberValues = sensorData?.values?.every((v) => typeof v.value === "number");

	let barData: itemType[] = aggregateSensorData(sensorData!.values!, dataInterval).map((v, i) => ({
		value: v.value,
		timestamp: v.timestamp,
		label: v.label,
		frontColor: !(i % 2) ? globalStyles.textPrimary.color : "#4B9460",
	}));

	const barWidth =
		Dimensions.get("window").width / barData.length -
		(Dimensions.get("window").width / barData.length) * 0.2;

	barData = barData.map((v) => ({
		...v,
		labelWidth: barWidth,
		labelTextStyle: {
			fontSize: Math.min(barWidth - 3, 14),
			textAlign: "center",
			textAlignVertical: "center",
			fontFamily: "Inter",
			fontWeight: "bold",
		},
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
					{sensorData?.title}
				</Text>
			</View>
			<View style={styles.bodyRow}>
				{isNumberValues ? (
					<View style={styles.graph}>
						<BarChart
							isAnimated={true}
							width={Dimensions.get("window").width}
							barWidth={barWidth}
							barBorderRadius={4}
							frontColor="lightgray"
							data={barData}
							yAxisThickness={0}
							xAxisThickness={0}
							spacing={(Dimensions.get("window").width - 40) / barData.length - barWidth}
						/>
					</View>
				) : (
					<></>
				)}
				<View style={styles.graphSelect}>
					{["Hourly", "Daily", "Weekly", "Monthly"].map((v, i) => (
						<TouchableOpacity key={i} style={{ flexDirection: "row" }}>
							<Text
								style={styles.intervalSelection}
								onPress={() => {
									// @ts-ignore
									setDataInterval(v);
								}}>
								{v}
							</Text>
						</TouchableOpacity>
					))}
				</View>
				<ScrollView>
					{barData.map((v, i) => (
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
									<MaterialIcons name="circle" size={16} color={v.frontColor} />
									<Text style={{ ...globalStyles.textPrimary, paddingLeft: 20 }}>
										{v.timestamp}
									</Text>
								</View>
								<Text style={{ ...globalStyles.textPrimary, color: "black" }}>
									{isNumberValues ? v.value.toFixed(3) : v.value}
								</Text>
							</View>
							<View style={globalStyles.divider} />
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

export default MenuScreen;
