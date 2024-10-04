import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getNameFromLocalStorage, getPosts, makePost } from "./apiService";

interface Post {
  id: string;
  postType: string;
  postText: string;
  postUserId: string;
}

export const PostType = {
  SCENT: "scent",
  FACE: "face",
  BODY: "body",
  SUPPLEMENTS: "supplements",
};

const Profile = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedType, setSelectedType] = useState(PostType.SCENT);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    fetchPosts();
    fetchUserName();
  }, []);

  const fetchUserName = async () => {
    try {
      const name = await getNameFromLocalStorage();
      console.log("Fetched user name:", name); // Check what's being retrieved
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
      // await signOut(FIREBASE_AUTH);
      console.log("User signed out!");
    } catch (e) {
      console.error(e);
    }
  };

  const handleMakePost = async () => {
    try {
      const post = { postType: selectedType, postText: "Hello, world!" };
      await makePost(post);
      console.log("Post created!");
      fetchPosts(); // Refresh posts
    } catch (e) {
      console.error(e);
    }
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
    <View style={styles.postItem}>
      <Text>{item.postText}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        Your Name Here:{userName}
      </Text>
      {renderFilterButtons()}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPostItem}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
      <Button title="Make Post" onPress={handleMakePost} />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

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
  postItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default Profile;
