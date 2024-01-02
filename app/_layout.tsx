import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
	DarkTheme,
	DefaultTheme,
	NavigationContainer,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useColorScheme } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

/* Pages */
import { FirebaseProvider, initializeApp } from "./providers/auth/Firebase";
import { UserProvider } from "./providers/auth/UserContext";
import StackNavigator from "./StackNavigator";
import { SensorProvider } from "./providers/data/SensorFactory";
import { DataProvider } from "./providers/data/DataContext";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		Inter: require("../assets/fonts/Inter.ttf"),
		...FontAwesome.font,
		...MaterialIcons.font,
		...MaterialCommunityIcons.font,
	});

	const app = initializeApp();

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	function RootLayoutNav() {
		const colorScheme = useColorScheme();
		return (
			<FirebaseProvider>
				<UserProvider>
					<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
						<StackNavigator />
					</ThemeProvider>
				</UserProvider>
			</FirebaseProvider>
		);
	}

	return <RootLayoutNav />;
}
