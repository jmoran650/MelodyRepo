import React from "react";
import { View, Text, Button } from "react-native";
import { 
  makePost,
  getPosts,
  getIdFromLocalStorage
 } from "./apiService";

const Profile = () => {
  const handleSignOut = async () => {
    try {
     // await signOut(FIREBASE_AUTH);
      console.log("User signed out!");
    } catch (e) {
      console.error(e);
    }
  };

  // postType!: string;

  // @Column("uuid")
  // postUserId!: string;

  // @Column()
  // postText!: string;

  const handleMakePost = async () => {
    try {
      const userID: string = await getIdFromLocalStorage();
      if (!userID) {
        throw new Error("User ID not found");
      }
      const post = { postType: "scent", postText: "Hello, world!", postUserId: userID };
      await makePost(post);
      console.log("Post created!");
    } catch (e) {
      console.error(e);
    }
  };

  const handleGetPost = async () => {
    try {
      const posts = await getPosts();
      console.log("Posts retrieved:", posts);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGetId = async () => {
    // Implement get ID functionality
    try {
      const id = await getIdFromLocalStorage();
      console.log("ID retrieved:", id);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to the Profile Screen!</Text>
      <Button title="Make Post" onPress = {handleMakePost} />
      <Button title="Get Post" onPress = {handleGetPost} />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default Profile;