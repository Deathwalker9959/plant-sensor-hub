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
import SensorAdd from "./pages/sensor_add";
import SensorListView from "./pages/sensor_list_view";
import { SensorProvider } from "./providers/data/SensorFactory";
import { DataProvider } from "./providers/data/DataContext";
import SensorGroups from "./pages/groups";
import AlertsAdd from "./pages/alerts_add";
import GroupAdd from "./pages/group_add";
import Alerts from "./pages/alerts";
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
			<Stack.Screen name="pages/login" component={LoginScreen} />
			<Stack.Screen name="pages/signup" component={SignupScreen} />
			<Stack.Screen name="pages/forgot_password" component={ForgotPasswordScreen} />
		</Stack.Navigator>
	);
};

export default StackNavigator;
