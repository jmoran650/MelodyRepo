// Login.tsx
import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "./authContext"; // Import AuthContext
import { logInUser, createUser } from "./apiService";

const Login = () => {
  const { login } = useContext(AuthContext); // Get login function from context
  const [userName, setUserName] = useState(""); // For signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false); // New state variable
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const signInResponse = await logInUser({ email, password });
      //console.log("Signed in:", signInResponse);
      const token = signInResponse.token;
      if (token) {
        await login(token); // Use login function from AuthContext
      } else {
        setError("Invalid credentials");
      }
    } catch (e: any) {
      setError(e.message || "Login failed");
      console.error(e);
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      const signUpResponse = await createUser({
        name: userName,
        email,
        password,
      });
      //console.log("Signed up:", signUpResponse);
      // Optionally, automatically sign in the user after signup
      if (signUpResponse.token) {
        await login(signUpResponse.token);
      } else {
        setIsSignupMode(false); // Switch back to login mode after successful signup
      }
    } catch (e: any) {
      setError(e.message || "Signup failed");
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
    <View style={styles.container}>
      <View style={styles.form}>
        {isSignupMode && (
          <TextInput
            value={userName}
            placeholder="Name"
            onChangeText={setUserName}
            style={styles.input}
          />
        )}
        <TextInput
          value={email}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          value={password}
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          <>
            {isSignupMode ? (
              <>
                <Button title="Sign Up" onPress={handleSignUp} />
                <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
                  <Text style={styles.toggleButtonText}>
                    Already have an account? Sign In
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Button title="Sign In" onPress={handleSignIn} />
                <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
                  <Text style={styles.toggleButtonText}>
                    Don't have an account? Sign Up
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    padding: 16,
    backgroundColor: "#fff", // Set background color
  },
  form: {
    width: "100%",
    maxWidth: 400, // Limit width for larger screens
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 12,
  },
  loader: {
    marginVertical: 20,
  },
  toggleButton: {
    marginTop: 16,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#007BFF",
  },
});

export default Login;