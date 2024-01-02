import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
/* Pages */
import LoginScreen from "./pages/login";
import SignupScreen from "./pages/signup";
import ForgotPasswordScreen from "./pages/forgot_password";
import MenuScreen from "./pages/menu";
import ProfileScreen from "./pages/profile";
import { useUser } from "./providers/auth/UserContext";
import HomeScreen from "./pages/home";
import SensorView from "./pages/sensor_view";
import { SensorProvider } from "./providers/data/SensorFactory";
import { DataProvider } from "./providers/data/DataContext";
const Stack = createStackNavigator();

const StackNavigator: React.FC = () => {
	const { user } = useUser();

	return user ? (
		<DataProvider>
			<SensorProvider>
				<Stack.Navigator initialRouteName={"pages/menu"} screenOptions={{ headerShown: false }}>
					<Stack.Screen name="pages/menu" component={MenuScreen} />
					<Stack.Screen name="pages/profile" component={ProfileScreen} />
					<Stack.Screen name="pages/home" component={HomeScreen} />
					<Stack.Screen name="pages/sensor_view" component={SensorView} />
				</Stack.Navigator>
			</SensorProvider>
		</DataProvider>
	) : (
		<Stack.Navigator initialRouteName="pages/login" screenOptions={{ headerShown: false }}>
			<Stack.Screen name="pages/login" component={LoginScreen} />
			<Stack.Screen name="pages/signup" component={SignupScreen} />
			<Stack.Screen name="pages/forgot_password" component={ForgotPasswordScreen} />
		</Stack.Navigator>
	);
};

export default StackNavigator;
