import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig"; // Correct import
import Login from "./screens/Login";
import Home from "./screens/Home"; // Create a Home screen to navigate to after login
import Profile from "./screens/Profile"; // Create a Profile screen to navigate to after login
import { NavigationContainer } from "@react-navigation/native";

//stack navigators
const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function insideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="screens/Home" component={Home} />
      <InsideStack.Screen name="screens/Profile" component={Profile} />
    </InsideStack.Navigator>
  );
}




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
          <Stack.Screen name={"Inside"} component={insideLayout} />
        ) : (
          <Stack.Screen name={"screens/Login"} component={Login} />
        )}  
      </Stack.Navigator>
  );
}
