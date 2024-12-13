// Profile.tsx

import React, { useEffect, useState, useContext } from "react";
import {
  Alert,
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
import { getPostsByUser, deletePost } from "./apiService";
import { Post, PostType } from "../types/postType";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from "./authContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Profile">;

const Profile = () => {
  const navigation = useNavigation<NavigationProp>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedType, setSelectedType] = useState<PostType>(PostType.SCENT);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchPosts();
    } else {
      setPosts([]); // Clear posts if no user
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      if (user && user.id) {
        const response = await getPostsByUser(user.id);
        setPosts(response.data);
      } else {
        setPosts([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (e) {
      console.error(e);
    }
  };

  const handleMakePost = () => {
    navigation.navigate("PostCreator");
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      // Refresh the posts
      fetchPosts();
    } catch (error) {
      console.error(error);
      Alert.alert("Error deleting post");
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
    <PostItem post={item} onDelete={handleDeletePost} />
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        {user?.name}'s Profile
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

type PostItemProps = {
  post: Post;
  onDelete: (postId: string) => void;
};

const PostItem: React.FC<PostItemProps> = ({ post, onDelete }) => {
  const handleDelete = () => {
    // Show confirmation alert
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(post.id),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.postTile}>
      {/* More options icon */}
      <TouchableOpacity style={styles.moreIcon} onPress={handleDelete}>
        <Icon name="more-vert" size={24} color="#000" />
      </TouchableOpacity>
      {/* Display image if available */}
      {post.data?.imageUrl ? (
        <Image source={{ uri: post.data.imageUrl }} style={styles.imagePlaceholder} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}
      {/* Post details */}
      <View style={styles.postDetails}>
        <Text style={styles.postType}>{post.postType.toUpperCase()}</Text>
        {post.data?.productName && (
          <Text style={styles.postDetail}>Product: {post.data.productName}</Text>
        )}
        {post.data?.companyName && (
          <Text style={styles.postDetail}>Company: {post.data.companyName}</Text>
        )}
        <Text numberOfLines={2} style={styles.postText}>
          {post.postText}
        </Text>
      </View>
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
  moreIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },

});