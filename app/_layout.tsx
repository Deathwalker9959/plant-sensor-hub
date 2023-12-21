import FontAwesome from "@expo/vector-icons/FontAwesome";
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
import { getAuth, getReactNativePersistence, onAuthStateChanged } from "firebase/auth";

/* Pages */
import LoginScreen from "./pages/login";
import SignupScreen from "./pages/signup";
import ForgotPasswordScreen from "./pages/forgot_password";
import MenuScreen from "./pages/menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseProvider, initializeApp } from "./auth/Firebase";
import ProfileScreen from "./pages/profile";
import { getApps } from "firebase/app";
import { UserProvider, useUser } from "./auth/UserContext";
import HomeScreen from "./pages/home";
import StackNavigator from "./stacknavigator";
// import HomeScreen from "./pages/home";
// import AccountScreen from "./pages/account";
// import PreferencesScreen from "./pages/preferences";
// import GroupsScreen from "./pages/groups";
// import TriggersScreen from "./pages/triggers";

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
