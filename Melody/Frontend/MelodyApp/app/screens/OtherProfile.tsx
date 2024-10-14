// OtherProfile.tsx

import { RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { RootStackParamList } from "../types/navigation";
import { getOtherProfile, getPostsByUser, requestFriend } from "./apiService";

type OtherProfileScreenRouteProp = RouteProp<
  RootStackParamList,
  "OtherProfile"
>;

type Props = {
  route: OtherProfileScreenRouteProp;
};

type User = {
  id: string;
  name: string;
  email: string;
};

type Post = {
  id: string;
  postType: string;
  postText: string;
  postUserId: string;
  data?: {
    productName?: string;
    companyName?: string;
    tags?: string[];
  };
};

enum PostType {
  SCENT = "scent",
  FACE = "face",
  BODY = "body",
  SUPPLEMENTS = "supplements",
}

const OtherProfile: React.FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedType, setSelectedType] = useState<PostType | null>(null);

  const fetchUserProfile = async () => {
    try {
      const response = await getOtherProfile(userId);
      setUser(response);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await getPostsByUser(userId);
      setPosts(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const sendFriendRequest = async () => {
    try {
      await requestFriend(userId);
      Alert.alert("Friend request sent!");
    } catch (e) {
      console.error(e);
      Alert.alert("Error sending friend request");
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading user profile...</Text>
      </View>
    );
  }

  const renderFilterButtons = () => {
    return (
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === null && styles.selectedFilterButton,
          ]}
          onPress={() => setSelectedType(null)}
        >
          <Text style={styles.filterButtonText}>ALL</Text>
        </TouchableOpacity>
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

  const filteredPosts = selectedType
    ? posts.filter((post) => post.postType === selectedType)
    : posts;

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={styles.postTile}>
      {/* Placeholder for image */}
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderText}>Image</Text>
      </View>
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
    <View style={styles.container}>
      <Text style={styles.nameText}>{user.name}'s Profile</Text>
      <Text>Email: {user.email}</Text>
      {/* Add a button to send a friend request */}
      <Button title="Send Friend Request" onPress={sendFriendRequest} />
      {/* Filter buttons */}
      {renderFilterButtons()}
      {/* Display user's posts */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPostItem}
        numColumns={2}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
};

export default OtherProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  nameText: {
    fontSize: 24,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  filterButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#eee",
    margin: 4,
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
    elevation: 2,
    shadowColor: "#000",
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