import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./authContext";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getUsers } from "./apiService";
import { RootStackParamList } from "../types/navigation";

type User = {
  name: string;
  id: string;
  email: string;
  password: string;
};

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Function to navigate to another user's profile
  const navigateToProfile = (userId: string) => {
    navigation.navigate('OtherProfile', { userId });
  };

  // Function to navigate to the current user's own profile
  const navigateToMyProfile = () => {
    navigation.navigate('Profile'); // Assuming 'Profile' is the name of your own profile screen
  };

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
      const response = await getUsers();
      //console.log(response);
      setUsers(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Go to My Profile" onPress={navigateToMyProfile} />
      <Button title="Sign Out" onPress={handleSignOut} />
      <FlatList
        data={users}
        style={{ flex: 1 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToProfile(item.id)}>
            <View style={styles.userItem}>
              <Text style={styles.userText}>Name: {item.name}</Text>
              <Text style={styles.userText}>Email: {item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userText: {
    fontSize: 16,
  },
});