import { RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, View } from "react-native";
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
};

const OtherProfile: React.FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

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

  return (
    <View style={styles.container}>
      <Text style={styles.nameText}>{user.name}</Text>
      <Text>Email: {user.email}</Text>
      {/* Add a button to send a friend request */}
      <Button title="Send Friend Request" onPress={sendFriendRequest} />
      {/* Display user's posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <Text>{item.postText}</Text>
          </View>
        )}
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
  postItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
