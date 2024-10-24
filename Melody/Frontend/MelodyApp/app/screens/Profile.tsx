// Profile.tsx

import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { getNameFromLocalStorage, getPosts } from "./apiService";
import { Post, PostType } from "../types/postType";


type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Profile">;

const Profile = () => {
  const navigation = useNavigation<NavigationProp>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedType, setSelectedType] = useState<PostType>(PostType.SCENT);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    fetchPosts();
    fetchUserName();
  }, []);

  const fetchUserName = async () => {
    try {
      const name = await getNameFromLocalStorage();
      if (!name) {
        throw new Error("User name not found");
      }
      setUserName(name);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = async () => {
    try {
      // Implement sign-out logic here
      console.log("User signed out!");
    } catch (e) {
      console.error(e);
    }
  };

  const handleMakePost = () => {
    navigation.navigate("PostCreator");
  };

  const renderFilterButtons = () => {
    return (
      <View style={styles.filterContainer}>
        {Object.values(PostType).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              selectedType === type && styles.selectedFilterButton,
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={styles.filterButtonText}>{type.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const filteredPosts = posts.filter((post) => post.postType === selectedType);

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={styles.postTile}>
      {/* Display image if available */}
      {item.data?.imageUrl ? (
        <Image source={{ uri: item.data.imageUrl }} style={styles.imagePlaceholder} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}
      {/* Post details */}
      <View style={styles.postDetails}>
        <Text style={styles.postType}>{item.postType.toUpperCase()}</Text>
        {item.data?.productName && (
          <Text style={styles.postDetail}>Product: {item.data.productName}</Text>
        )}
        {item.data?.companyName && (
          <Text style={styles.postDetail}>Company: {item.data.companyName}</Text>
        )}
        <Text numberOfLines={2} style={styles.postText}>
          {item.postText}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        {userName}'s Profile
      </Text>
      {renderFilterButtons()}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPostItem}
        contentContainerStyle={{ paddingVertical: 16 }}
        numColumns={2}
      />
      <Button title="Make Post" onPress={handleMakePost} />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  filterButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#eee",
  },
  selectedFilterButton: {
    backgroundColor: "#ccc",
  },
  filterButtonText: {
    fontSize: 16,
  },
  postTile: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  imagePlaceholder: {
    height: 100,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    color: "#888",
  },
  postDetails: {
    padding: 8,
  },
  postType: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  postDetail: {
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
  },
  postText: {
    fontSize: 12,
    color: "#333",
  },
});