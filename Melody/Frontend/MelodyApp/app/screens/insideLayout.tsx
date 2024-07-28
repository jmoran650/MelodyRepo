
import React, { useEffect, useState } from "react";

import { Text, View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged, User } from "firebase/auth";

import Home from "./Home"; // Create a Home screen to navigate to after login
import Profile from "./Profile"; // Create a Profile screen to navigate to after login


export const InsideStack = createNativeStackNavigator();
const InsideLayout = () => {
    return (
      <InsideStack.Navigator>
        <InsideStack.Screen name="screens/Home" component={Home} />
        <InsideStack.Screen name="screens/Profile" component={Profile} />
      </InsideStack.Navigator>
    );
  }
  
export default InsideLayout;