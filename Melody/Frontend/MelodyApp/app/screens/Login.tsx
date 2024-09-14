import React, { useState } from "react";
import { View, TextInput, Button, Text, ActivityIndicator } from "react-native";
import { FIREBASE_AUTH } from "../../firebaseConfig"; // Correct import
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { logInUser, createUser  } from "./apiService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signin = async () => {
    setLoading(true);
    try {
      const signInResponse = await logInUser({email, password});
      console.log("Signed in:", signInResponse);
    } catch (e: any) {
      setError(e.message);
      console.error(e);
    }
    setLoading(false);
  };

  const signup = async () => {
    setLoading(true);
    try {
      const signUpResponse = await createUser({ id: userId, name, email, password });
      console.log("Signed up:", signUpResponse);
    } catch (e: any) {
      setError(e.message);
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        value={email}
        placeholder="Email"
        autoCapitalize="none"
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
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Button title="Sign In" onPress={signin} />
          <Button title="Sign Up" onPress={signup} />
        </>
      )}
    </View>
  );
};

export default Login;