//insideLayout.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import FriendsList from "./friendsList"; // Create a FriendsList screen to navigate to after login
import Home from "./Home"; // Create a Home screen to navigate to after login
import OtherProfile from "./OtherProfile"; // Create an OtherProfile screen to navigate to after login
import Profile from "./Profile"; // Create a Profile screen to navigate to after login
import SearchResults from "./SearchResultScreen"; // Create a SearchResults screen to navigate to after login
import PostCreator from "./PostCreator";
import Login from "./Login";
export const InsideStack = createNativeStackNavigator<RootStackParamList>();

const InsideLayout = () => {
  return (
    <InsideStack.Navigator initialRouteName="Home">
      <InsideStack.Screen name="Home" component={Home} />
      <InsideStack.Screen name="Profile" component={Profile} />
      <InsideStack.Screen name="OtherProfile" component={OtherProfile} />
      <InsideStack.Screen name="FriendsList" component={FriendsList} />
      <InsideStack.Screen name="SearchResults" component={SearchResults} />
      <InsideStack.Screen name="PostCreator" component={PostCreator} />
      <InsideStack.Screen name="Login" component={Login} />
    </InsideStack.Navigator>
  );
};

export default InsideLayout;
