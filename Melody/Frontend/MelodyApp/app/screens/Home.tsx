import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, FlatList, Alert, TextInput } from "react-native";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { getUsers, createUser } from "./apiService";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

type User = {
  name: string;
  id: string;
  email: string;
};

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      console.log("User signed out!");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const users = await getUsers();
      setUsers(users);
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
      const newUser = { name, id: parseInt(id), email};
      await createUser(newUser);
      setName("");
      setEmail("");
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

      <FlatList
        data={users}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{[item.name,"--",item.id,"--",item.email]}</Text>}
      />
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
      <View style={styles.buttonContainer}>
        <Button title="Create User" onPress={handleCreateUser} />
      </View>
    </View>
  );
};

export default Home;