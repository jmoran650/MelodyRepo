import React from "react";
import { View, Text, Button } from "react-native";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { signOut } from "firebase/auth";

const Home = () => {
  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      console.log("User signed out!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default Home;