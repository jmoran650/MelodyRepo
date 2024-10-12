// PostCreator.tsx

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../types/navigation";
import { PostType } from "../types/postType";
import { makePost } from "./apiService";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostCreator"
>;

const PostCreator = () => {
  const navigation = useNavigation<NavigationProp>();
  const [postType, setPostType] = useState<PostType>(PostType.SCENT);
  const [postText, setPostText] = useState("");
  const [productName, setProductName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [tags, setTags] = useState<string[]>([]); // Uninteractable for now

  const handleSubmit = async () => {
    try {
      const postData = {
        postType,
        postText,
        data: {
          productName,
          companyName,
          tags,
        },
      };
      await makePost(postData);
      Alert.alert("Post created!");
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error creating post");
    }
  };

  const renderPostTypeButtons = () => {
    return (
      <View style={styles.postTypeContainer}>
        {Object.values(PostType).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.postTypeButton,
              postType === type && styles.selectedPostTypeButton,
            ]}
            onPress={() => setPostType(type)}
          >
            <Text style={styles.postTypeButtonText}>{type.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Post</Text>
      {renderPostTypeButtons()}
      <TextInput
        style={styles.input}
        placeholder="Write thoughts..."
        value={postText}
        onChangeText={setPostText}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Company Name"
        value={companyName}
        onChangeText={setCompanyName}
      />
      {/* Tags section (uninteractable for now) */}
      <Text style={styles.placeholder}>#Tags (Coming Soon)</Text>
      <Button title="Submit Post" onPress={handleSubmit} />
    </View>
  );
};

export default PostCreator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  postTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  postTypeButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#eee",
  },
  selectedPostTypeButton: {
    backgroundColor: "#ccc",
  },
  postTypeButtonText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  placeholder: {
    color: "#888",
    marginBottom: 16,
  },
});
