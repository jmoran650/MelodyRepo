import React, { useState } from "react";
import { View, TextInput, Button, Text, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logInUser, createUser } from "./apiService";

const Login = () => {
  const [userName, setUserName] = useState(""); // For signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false); // New state variable
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const signInResponse = await logInUser({ email, password });
      console.log("Signed in:", signInResponse);
      const token = signInResponse.token;
      await AsyncStorage.setItem('token', token);
      // Navigate to the next screen or perform additional actions
    } catch (e: any) {
      setError(e.message);
      console.error(e);
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const signUpResponse = await createUser({ name: userName, email, password });
      console.log("Signed up:", signUpResponse);
      // Optionally, automatically sign in the user after signup
      // Or switch back to login mode
      setIsSignupMode(false); // Switch back to login mode after successful signup
    } catch (e: any) {
      setError(e.message);
      console.error(e);
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
    setError(""); // Clear any existing errors
    // Reset input fields if necessary
    setUserName("");
    setEmail("");
    setPassword("");
  };

  return (
    <View style={{ padding: 16 }}>
      {isSignupMode && (
        <TextInput
          value={userName}
          placeholder="Name"
          onChangeText={(text) => setUserName(text)}
          style={{ height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 12 }}
        />
      )}
      <TextInput
        value={email}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        style={{ height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 12 }}
      />
      <TextInput
        value={password}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        style={{ height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 12 }}
      />
      {error ? <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {isSignupMode ? (
            <>
              <Button title="Sign Up" onPress={handleSignUp} />
              <Button title="Switch to Sign In" onPress={toggleMode} />
            </>
          ) : (
            <>
              <Button title="Sign In" onPress={handleSignIn} />
              <Button title="Switch to Sign Up" onPress={toggleMode} />
            </>
          )}
        </>
      )}
    </View>
  );
};

export default Login;