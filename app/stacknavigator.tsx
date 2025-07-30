// StackNavigator.tsx
// This file defines the navigation structure of the app using a stack navigator.
// It includes routes for authentication, sensor management, and user profile screens.

import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Import individual screens/pages
import LoginScreen from "./pages/login"; // Login page for user authentication
import SignupScreen from "./pages/signup"; // Signup page for new users
import ForgotPasswordScreen from "./pages/forgot_password"; // Password recovery page
import MenuScreen from "./pages/menu"; // Main menu screen
import ProfileScreen from "./pages/profile"; // User profile screen
import { useUser } from "./providers/auth/UserContext"; // Context to manage user authentication state
import HomeScreen from "./pages/home"; // Home screen displaying dashboard or main content
import SensorView from "./pages/sensor_view"; // Detailed view of a specific sensor
import SensorAdd from "./pages/sensor_add"; // Screen to add a new sensor
import SensorListView from "./pages/sensor_list_view"; // List view of all sensors
import { SensorProvider } from "./providers/data/SensorFactory"; // Provides mock sensor data
import { DataProvider } from "./providers/data/DataContext"; // Provides application-wide data context
import SensorGroups from "./pages/groups"; // Screen to manage sensor groups
import AlertsAdd from "./pages/alerts_add"; // Screen to add new alerts
import GroupAdd from "./pages/group_add"; // Screen to add new sensor groups
import Alerts from "./pages/alerts"; // Screen to view and manage alerts

// Create a stack navigator instance
const Stack = createStackNavigator();

const StackNavigator: React.FC = () => {
	const { user } = useUser(); // Get the current user from context

	// Render different navigation stacks based on user authentication state
	return user ? (
		<DataProvider>
			<SensorProvider>
				<Stack.Navigator initialRouteName={"pages/menu"} screenOptions={{ headerShown: false }}>
					{/* Authenticated user routes */}
					<Stack.Screen name="pages/menu" component={MenuScreen} />
					<Stack.Screen name="pages/profile" component={ProfileScreen} />
					<Stack.Screen name="pages/home" component={HomeScreen} />
					<Stack.Screen name="pages/sensor_view" component={SensorView} />
					<Stack.Screen name="pages/sensor_add" component={SensorAdd} />
					<Stack.Screen name="pages/sensor_list_view" component={SensorListView} />
					<Stack.Screen name="pages/groups" component={SensorGroups} />
					<Stack.Screen name="pages/group_add" component={GroupAdd} />
					<Stack.Screen name="pages/alerts" component={Alerts} />
					<Stack.Screen name="pages/alerts_add" component={AlertsAdd} />
				</Stack.Navigator>
			</SensorProvider>
		</DataProvider>
	) : (
		<Stack.Navigator initialRouteName="pages/login" screenOptions={{ headerShown: false }}>
			{/* Unauthenticated user routes */}
			<Stack.Screen name="pages/login" component={LoginScreen} />
			<Stack.Screen name="pages/signup" component={SignupScreen} />
			<Stack.Screen name="pages/forgot_password" component={ForgotPasswordScreen} />
		</Stack.Navigator>
	);
};

export default StackNavigator;
