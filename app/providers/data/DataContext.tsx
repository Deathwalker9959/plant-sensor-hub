import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useFirebase } from "../auth/Firebase"; // Import your Firebase configuration
import { getDatabase, set, update, get, ref, onValue } from "firebase/database";
import { SensorData, SensorValue } from "./SensorFactory";

type Data = {
	preferences?: Preferences;
	dashboardPreferences?: DashboardPreferences;
	groups?: Groups;
	alerts?: Alerts;
	selectedSensor?: SelectedSensor;
};

type DatabaseUserRef = {
	preferences: PreferencesData;
	dashboardPreferences: DashboardPreferencesData;
	groups: GroupData[];
	alerts: AlertData[];
};

export type Preferences = {
	preferences: PreferencesData | null;
	setPreferences: React.Dispatch<React.SetStateAction<PreferencesData | null>>;
	updatePreference: (key: string, value: string | boolean) => void;
};

export type SelectedSensor = {
	selectedSensor: SelectedSensorData | null;
	setSelectedSensor: React.Dispatch<React.SetStateAction<SelectedSensorData | null>>;
};

export type SelectedSensorData = {
	selectedSensor: number | null;
};

export type DashboardPreferences = {
	dashboardPreferences: DashboardPreferencesData | null;
	setDashboardPreferences: React.Dispatch<React.SetStateAction<DashboardPreferencesData | null>>;
	updateDashboardPreference: (key: string, value: any) => void;
};

export type DashboardPreferencesData = {
	activeIds: Set<number>;
};

export type PreferencesData = {
	temperatureOptions: string;
	clockOptions: string;
	alertsOptions: string;
};

export type Groups = {
	groups: GroupData[];
	setGroups: React.Dispatch<React.SetStateAction<GroupData[]>>;
	updateGroup: (group: GroupData) => void;
};

export type GroupData = {
	id: number;
	title: string;
	sensorIds: number[];
};

export type Alerts = {
	alerts: AlertData[];
	setAlerts: React.Dispatch<React.SetStateAction<AlertData[]>>;
	updateAlert: (alert: AlertData) => void;
};

export type AlertData = {
	title: string;
	sensorId: number;
	operator: ">" | "<" | "=";
	alertValue: string;
};

// Create the context
const DataContext = createContext<Data | null>(null);

// Define the interface for your provider props
interface DataProviderProps {
	children: React.ReactNode;
}

// Create the provider component
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
	const app = useFirebase()!;
	const [preferences, setPreferences] = useState<PreferencesData | null>(null);
	const [dashboardPreferences, setDashboardPreferences] = useState<DashboardPreferencesData | null>(
		null,
	);
	const [groups, setGroups] = useState<GroupData[]>([]);
	const [alerts, setAlerts] = useState<AlertData[]>([]);
	const auth = getAuth(app);
	const db = getDatabase(app);
	const user = auth.currentUser;

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				const preferencesRef = ref(db, `users/${user.uid}`);
				onValue(
					preferencesRef,
					(snapshot) => {
						const userData = snapshot.val() as DatabaseUserRef;
						setPreferences(userData.preferences);
					},
					{
						onlyOnce: true,
					},
				);
				onValue(
					ref(db, `users/${user.uid}/dashboardPreferences`),
					(snapshot) => {
						const userData = snapshot.val() as DashboardPreferencesData;
						setDashboardPreferences(userData);
					},
					{
						onlyOnce: true,
					},
				);
				onValue(
					ref(db, `users/${user.uid}/groups`),
					(snapshot) => {
						const userData = snapshot.val() as GroupData[];
						setGroups(userData);
					},
					{
						onlyOnce: true,
					},
				);
				onValue(
					ref(db, `users/${user.uid}/alerts`),
					(snapshot) => {
						const userData = snapshot.val() as AlertData[];
						setAlerts(Object.values(userData));
					},
					{
						onlyOnce: true,
					},
				);
			}
		});

		return () => unsubscribe(); // Cleanup the subscription
	}, [auth, db]);

	useEffect(() => {
		if (user) {
			const usersRef = ref(db, `users/${user.uid}`);
			onValue(usersRef, (snapshot) => {
				const userData = snapshot.val() as DatabaseUserRef;
				setPreferences(userData.preferences);
				setDashboardPreferences(userData.dashboardPreferences);
				setGroups(userData.groups);
				setAlerts(Object.values(userData.alerts))
			});
		}
	}, []);

	const updateDashboardPreference = (key: string, value: any) => {
		if (user) {
			const userRef = ref(db, `users/${user.uid}/dashboardPreferences`);
			update(userRef, {
				[key]: value,
			});
			setDashboardPreferences({
				...dashboardPreferences!,
				[key]: value,
			});
		}
	};

	const updatePreference = (key: string, value: string | boolean) => {
		if (user) {
			const userRef = ref(db, `users/${user.uid}/preferences`);
			update(userRef, {
				[key]: value,
			});
			setPreferences({
				...preferences!,
				[key]: value,
			});
		}
	};

	const updateGroup = (group: GroupData) => {
		if (user) {
			const userRef = ref(db, `users/${user.uid}/groups`);
			update(userRef, {
				[group.id]: group,
			});
		}
	};

	const updateAlert = (alert: AlertData) => {
		if (user) {
			const userRef = ref(db, `users/${user.uid}/alerts`);
			update(userRef, {
				[alert.sensorId]: alert,
			});
		}
	};

	const data = {
		preferences: {
			preferences,
			setPreferences,
			updatePreference,
		},
		dashboardPreferences: {
			dashboardPreferences,
			setDashboardPreferences,
			updateDashboardPreference,
		},
		groups: {
			groups,
			setGroups,
			updateGroup,
		},
		alerts: {
			alerts,
			setAlerts,
			updateAlert,
		},
	};

	return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

// Create a custom hook for accessing the context
export const useData = () => {
	const context = useContext(DataContext);
	if (context === undefined) {
		throw new Error("useData must be used within a DataProvider");
	}
	return context;
};
