import React, { useEffect, useState } from "react";

import { Text, View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig"; // Correct import
import Login from "./screens/Login";
import InsideLayout from "./screens/insideLayout";
import Home from "./screens/Home"; // Create a Home screen to navigate to after login
import Profile from "./screens/Profile"; // Create a Profile screen to navigate to after login

//stack navigators
const Stack = createNativeStackNavigator();






export default function App() {

  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
  }, [initializing]);

  if (initializing) return <ActivityIndicator size="large" />;

  return (
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name={"screens/insideLayout"} component={InsideLayout} />
        ) : (
          <Stack.Screen name={"screens/Login"} component={Login} />
        )}  
      </Stack.Navigator>
  );
}
