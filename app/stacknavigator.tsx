import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
/* Pages */
import LoginScreen from "./pages/login";
import SignupScreen from "./pages/signup";
import ForgotPasswordScreen from "./pages/forgot_password";
import MenuScreen from "./pages/menu";
import ProfileScreen from "./pages/profile";
import { UserProvider, useUser } from "./auth/UserContext";
import HomeScreen from "./pages/home";
const Stack = createStackNavigator();

const StackNavigator: React.FC = () => {
  const { user } = useUser();

  return (
    <Stack.Navigator
      initialRouteName={user ? "pages/menu" : "pages/login"}
      screenOptions={{ headerShown: false }}
    >
      {user ? (
        <>
          <Stack.Screen name="pages/menu" component={MenuScreen} />
          <Stack.Screen name="pages/profile" component={ProfileScreen} />
          <Stack.Screen name="pages/home" component={HomeScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="pages/login" component={LoginScreen} />
          <Stack.Screen name="pages/signup" component={SignupScreen} />
          <Stack.Screen name="pages/forgot_password" component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
