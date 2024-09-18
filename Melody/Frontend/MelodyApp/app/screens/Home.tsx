import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./authContext";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import { getUsers, createUser } from "./apiService";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 11,
    flexDirection: "column",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  userItem: {
    padding: 10,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  listContainer: {
    flex: 1,
  },
  inputContainer: {
    flexShrink: 0,
  },
});

type User = {
  name: string;
  id: string;
  email: string;
  password: string;
};

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const { user, logout } = useContext(AuthContext);

  const handleSignOut = async () => {
    try {
      await logout();
      console.log("User signed out!");
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await getUsers();
      console.log(users);
      setUsers(users.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateUser = async () => {
    if (!name || !id || !email) {
      Alert.alert("Please fill out all fields");
      return;
    }

    try {
      const newUser = { name, id: parseInt(id), email, password };
      await createUser(newUser);
      setName("");
      setEmail("");
      setPassword("");
      setId("");
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Get Users" onPress={fetchUsers} />
      <View style={styles.listContainer}>
        <Text>This is where the list should be!</Text>
        <FlatList
          data={users}
          style={{ flex: 1 }}
          keyExtractor={(item) => item.id} // Ensure the ID is unique and a string
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Text style={styles.userText}>Name: {item.name}</Text>
              <Text style={styles.userText}>ID: {item.id}</Text>
              <Text style={styles.userText}>Email: {item.email}</Text>
              <Text style={styles.userText}>Password: {item.password}</Text>
            </View>
          )}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="ID"
        value={id}
        onChangeText={setId}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
        <Button title="Create User" onPress={handleCreateUser} />
      </View>
    </View>
  );
};

export default Home;
