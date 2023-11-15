import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./pages/login";
import SignupScreen from "./pages/signup";
import ForgotPasswordScreen from "./pages/forgot_password";

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
          initialRouteName="pages/login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="pages/login" component={LoginScreen} />
          <Stack.Screen name="pages/signup" component={SignupScreen} />
          <Stack.Screen name="pages/forgot_password" component={ForgotPasswordScreen} />
        </Stack.Navigator>
      </ThemeProvider>
    );
  }

  return <RootLayoutNav />;
}
