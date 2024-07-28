import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
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
});

type User = {
  name: string;
};



const Home = () => {
  const [users, setUsers] = useState([]);

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
      const users = await getUsers();
      setUsers(users);
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Get Users" onPress={getUsers} />

      <FlatList data = {users}
      renderItem={({item}) => <Text style={styles.item}>{item.name}</Text>}
      >

      </FlatList>
    </View>
  );
};

export default Home;