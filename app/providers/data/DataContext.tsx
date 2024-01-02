import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useFirebase } from "../auth/Firebase"; // Import your Firebase configuration
import { getDatabase, set, update, get, ref, onValue } from "firebase/database";
import { SensorData, SensorValue } from "./SensorFactory";

type Data = {
	preferences?: Preferences;
    dashboardPreferences?: DashboardPreferences;
    selectedSensor?: SelectedSensor;
};

type DatabaseUserRef = {
	preferences: PreferencesData;
	dashboardPreferences: DashboardPreferencesData;
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
};

export type DashboardPreferencesData = {
    activeIds: number[];
};

export type PreferencesData = {
	temperatureOptions: string;
	clockOptions: string;
	alertsOptions: string;
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
	const [selectedSensor, setSelectedSensor] = useState<SelectedSensorData | null>(null);
    const [dashboardPreferences, setDashboardPreferences] = useState<DashboardPreferencesData | null>(null);
	const auth = getAuth(app);
	const db = getDatabase(app);
    const user = auth.currentUser;

    const updatePreference = (key: string, value: string | boolean) => {
        if (user) {
            const userRef = ref(db, `users/${user.uid}/preferences`);
            update(userRef, {
                [key]: value
            });
			setPreferences({
				...preferences!,
				[key]: value,
			})
        }
    }

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
			}
		});

		return () => unsubscribe(); // Cleanup the subscription
	}, [auth, db]);

	const data = {
		preferences: {
            preferences,
            setPreferences,
            updatePreference
        },
		selectedSensor: {
            selectedSensor,
            setSelectedSensor
        }
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
