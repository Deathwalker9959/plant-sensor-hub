import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
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
		Inter: require("../assets/fonts/Inter-Regular.ttf"),
		...FontAwesome.font,
	});

	// Initialize Firebase
	const firebaseConfig = {
		apiKey: "AIzaSyAu3Ul7fCPCVwKW0V4dtyrxHyAf5kw54b8",
		projectId: "plant-sensor-hub",
		appId: "1:876914927881:web:07fff7e6d5c087075dcbd8",
		authDomain: "plant-sensor-hub.firebaseapp.com",
		databaseURL: "https://plant-sensor-hub-default-rtdb.europe-west1.firebasedatabase.app/",
		measurementId: "G-H0PXG97JES",
	};

	const app = initializeApp(firebaseConfig, "plant-sensor-hub");

	const [loggedIn, setLoggedIn] = useState(false);
	getAuth(app).setPersistence(getReactNativePersistence(AsyncStorage));
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
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<Stack.Navigator
					initialRouteName={loggedIn ? "pages/menu" : "pages/login"} // Updated route names
					screenOptions={{
						headerShown: false,
					}}>
					<Stack.Screen name="pages/login" component={LoginScreen} initialParams={{ app: app }} />
					<Stack.Screen name="pages/signup" component={SignupScreen} initialParams={{ app: app }} />
					<Stack.Screen name="pages/forgot_password" component={ForgotPasswordScreen} />
					<Stack.Screen name="pages/menu" component={MenuScreen} initialParams={{ app: app }} />
				</Stack.Navigator>
			</ThemeProvider>
		);
	}

	return <RootLayoutNav />;
}
