
import React, { useEffect, useState } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import Home from "./Home"; // Create a Home screen to navigate to after login
import Profile from "./Profile"; // Create a Profile screen to navigate to after login
import OtherProfile from "./OtherProfile"; // Create an OtherProfile screen to navigate to after login



export const InsideStack = createNativeStackNavigator<RootStackParamList>();

const InsideLayout = () => {
    return (
      <InsideStack.Navigator initialRouteName="Home">
        <InsideStack.Screen name="Home" component={Home} />
        <InsideStack.Screen name="Profile" component={Profile} />
        <InsideStack.Screen name="OtherProfile" component={OtherProfile} />
      </InsideStack.Navigator>
    );
  }
  
export default InsideLayout;