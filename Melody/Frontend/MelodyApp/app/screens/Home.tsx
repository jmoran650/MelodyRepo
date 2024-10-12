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
  TextInput,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { getUsers } from "./apiService";
import { RootStackParamList } from "../types/navigation";
import { searchUsers } from "./apiService";

type User = {
  name: string;
  id: string;
  email: string;
  password: string;
};

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, "Home">;

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Function to navigate to another user's profile
  const navigateToProfile = (userId: string) => {
    navigation.navigate("OtherProfile", { userId });
  };

  // Function to navigate to the current user's own profile
  const navigateToMyProfile = () => {
    navigation.navigate("Profile"); // Assuming 'Profile' is the name of your own profile screen
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

  const handleSearch = async (text: string) => {
    setSearchTerm(text);
  
    if (text.length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
  
    try {
      const response = await searchUsers(text);
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Go to My Profile" onPress={navigateToMyProfile} />
      <Button
        title="View Friends"
        onPress={() => navigation.navigate("FriendsList")}
      />
      <Button title="Sign Out" onPress={handleSignOut} />
      <TextInput
      style={styles.searchInput}
      placeholder="Search users..."
      value={searchTerm}
      onChangeText={handleSearch}
    />

    {showSearchResults && (
      <View style={styles.searchResultsContainer}>
        {searchResults.slice(0, 8).map((user) => (
          <TouchableOpacity
            key={user.id}
            onPress={() => {
              navigateToProfile(user.id);
              setShowSearchResults(false);
              setSearchTerm("");
            }}
          >
            <Text style={styles.searchResultItem}>{user.name}</Text>
          </TouchableOpacity>
        ))}
        {searchResults.length > 8 && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SearchResults", { searchTerm });
              setShowSearchResults(false);
              setSearchTerm("");
            }}
          >
            <Text style={styles.moreText}>More...</Text>
          </TouchableOpacity>
        )}
      </View>
    )}
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
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginVertical: 16,
  },
  searchResultsContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    maxHeight: 200,
  },
  searchResultItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  moreText: {
    padding: 8,
    color: "blue",
  },
});
