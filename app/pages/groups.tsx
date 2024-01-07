// Menu.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
	TouchableOpacity,
	StyleSheet,
	Dimensions,
	StatusBar,
	Text,
	View,
	Button,
} from "react-native";
import { getAuth } from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ParamListBase } from "@react-navigation/routers";
import globalStyles from "../common/styles";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useFirebase } from "../providers/auth/Firebase";
import { SensorData, SensorValue, useSensorData } from "../providers/data/SensorFactory";
import { GroupData, useData } from "../providers/data/DataContext";
import { ScrollView } from "react-native-gesture-handler";
import Accordion, { AccordionProps } from "react-native-collapsible/Accordion";
type Props = {
	navigation: StackNavigationProp<ParamListBase, "pages/groups">;
	route: RouteProp<ParamListBase, "pages/groups">;
};

const SensorGroups: React.FC<Props> = ({ navigation, route }: Props) => {
	//@ts-ignore
	const app: FirebaseApp = useFirebase();
	const data = useData();
	const sensorData = useSensorData();
	const [groups, setGroups] = useState<GroupData[]>(data?.groups?.groups ?? []);
	const previousScreen = () => {
		navigation.canGoBack() ? navigation.goBack() : navigation.navigate("pages/home");
	};

	const navigateGroupAdd = () => {
		navigation.navigate("pages/group_add");
	};

	useEffect(() => {
		setGroups(data?.groups?.groups ?? []);
	}, [data]);

	const mappedSensorData = sensorData.map((v) => ({
		timestamp: v.values?.[0].date,
		value: v.values?.[0].value,
		label: v.title ?? "No Name",
		id: v.id,
	}));

	const sections: { title: string; content: JSX.Element }[] = groups.filter((g) => g).map(({ title, sensorIds }) => {
		return {
			title,
			content: (
				<View>
					{sensorIds.map((sensorId, i) => {
						const sensor = mappedSensorData.find((v) => v.id === sensorId);
						return (
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
										key={`${i}_label`}
										style={{
											flexDirection: "row",
											justifyContent: "center",
											alignContent: "center",
											alignItems: "center",
										}}>
										<MaterialIcons
											key={`${i}_icon`}
											name="circle"
											size={16}
											color={globalStyles.submitButton.backgroundColor}
										/>
										<Text style={{ ...globalStyles.textPrimary, paddingLeft: 20 }} key={`${i}_text`}>{sensor?.label ?? ""}</Text>
									</View>
									<Text style={{ ...globalStyles.textPrimary, color: "black" }}>
										{!Number.isNaN(Number.parseInt(sensor!.value as any))
											? (sensor!.value as number).toFixed(3)
											: sensor!.value}
									</Text>
								</View>
								<View style={globalStyles.divider} key={`${i}_div`} />
							</>
						);
					})}
				</View>
			),
		};
	});

	const [activeSections, setActiveSections] = useState<number[]>([]);
	const accordionProps: AccordionProps<{ title: string; content: JSX.Element }> = {
		sections: sections,
		renderHeader(section, _, isActive) {
			return (
				<View style={styles.accordHeader}>
					<Text style={styles.accordTitle}>{section.title ?? "No Name"}</Text>
					<FontAwesome5 name={isActive ? "chevron-up" : "chevron-down"} size={20} color="white" />
				</View>
			);
		},

		renderContent(section, _, isActive) {
			return <View style={styles.accordBody}>{section.content}</View>;
		},
		onChange: function (indexes: number[]): void {
			setActiveSections(indexes);
		},
		activeSections: activeSections,
		sectionContainerStyle: styles.accordContainer,
		align: "bottom",
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
					Sensors List
				</Text>
			</View>
			<View style={styles.bodyRow}>
				<ScrollView
					style={{
						height: "100%",
						marginBottom: 40,
					}}>
					<Accordion {...accordionProps} />
					<TouchableOpacity
						style={{
							...globalStyles.submitButton,
							marginTop: 20,
							width: "50%",
							alignSelf: "center",
							justifyContent: "center",
							backgroundColor: globalStyles.textPrimary.color,
						}}
						onPress={navigateGroupAdd}>
						<Text style={globalStyles.submitText}>
							<FontAwesome5 name="plus" size={20} color="white" />
							{"  "}
							Create Group
						</Text>
					</TouchableOpacity>
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

	container: {
		flex: 1,
	},
	accordContainer: {
		paddingBottom: 4,
	},
	accordHeader: {
		padding: 12,
		backgroundColor: globalStyles.submitButton.backgroundColor,
		color: "#eee",
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	accordTitle: {
		fontSize: 20,
		color: "white",
	},
	accordBody: {
		padding: 12,
	},
	textSmall: {
		fontSize: 16,
	},
});

export default SensorGroups;
