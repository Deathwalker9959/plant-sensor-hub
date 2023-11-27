import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
	DarkTheme,
	DefaultTheme,
	NavigationContainer,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, onAuthStateChanged } from "firebase/auth";

/* Pages */
import LoginScreen from "./pages/login";
import SignupScreen from "./pages/signup";
import ForgotPasswordScreen from "./pages/forgot_password";
import MenuScreen from "./pages/menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseProvider } from "./auth/Firebase";
import AccountScreen from "./pages/account";
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

	const [loggedIn, setLoggedIn] = useState(true);

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
				<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
					<Stack.Navigator
						initialRouteName={loggedIn ? "pages/menu" : "pages/login"} // Updated route names
						screenOptions={{
							headerShown: false,
						}}>
						<Stack.Screen name="pages/login" component={LoginScreen} />
						<Stack.Screen name="pages/signup" component={SignupScreen} />
						<Stack.Screen name="pages/forgot_password" component={ForgotPasswordScreen} />
						<Stack.Screen name="pages/menu" component={MenuScreen} />
						<Stack.Screen name="pages/account" component={AccountScreen} />
					</Stack.Navigator>
				</ThemeProvider>
			</FirebaseProvider>
		);
	}

	return <RootLayoutNav />;
}
