import React, { useEffect, useState, useContext } from "react";

import { Text, View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import InsideLayout from "./screens/insideLayout";
import Home from "./screens/Home"; // Create a Home screen to navigate to after login
import Profile from "./screens/Profile"; // Create a Profile screen to navigate to after login
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext, AuthProvider } from "./screens/authContext";
//stack navigators
const Stack = createNativeStackNavigator();


const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  if (user === undefined) {
    // Show a loading indicator while checking authentication state
    return <ActivityIndicator size="large" />;
  }

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen
          name="screens/insideLayout"
          component={InsideLayout}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="screens/Login"
          component={Login}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
        <AppNavigator />
    </AuthProvider>
  );
}