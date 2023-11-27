import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp as firebaseInitializeApp, FirebaseApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import React, { createContext, useContext } from "react";

const initializeApp = () => {
	const firebaseConfig = {
		apiKey: "AIzaSyAu3Ul7fCPCVwKW0V4dtyrxHyAf5kw54b8",
		projectId: "plant-sensor-hub",
		appId: "1:876914927881:web:07fff7e6d5c087075dcbd8",
		authDomain: "plant-sensor-hub.firebaseapp.com",
		databaseURL: "https://plant-sensor-hub-default-rtdb.europe-west1.firebasedatabase.app/",
		measurementId: "G-H0PXG97JES",
	};

	const app = firebaseInitializeApp(firebaseConfig, "plant-sensor-hub");
	const auth = getAuth(app).setPersistence(getReactNativePersistence(AsyncStorage));
	return app;
};

const FirebaseContext = createContext<FirebaseApp | null>(null);

interface FirebaseProviderProps {
	children: React.ReactNode;
}

const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
	return <FirebaseContext.Provider value={initializeApp()}>{children}</FirebaseContext.Provider>;
};

const useFirebase = () => {
	return useContext(FirebaseContext);
};

export { initializeApp, FirebaseProvider, useFirebase };
