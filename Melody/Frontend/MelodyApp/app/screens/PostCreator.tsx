// PostCreator.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
  Image,
  ActivityIndicator,
} from "react-native";
import { PostType } from "../types/postType";
import { makePost } from "./apiService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToS3 } from "./s3Service"; // We'll implement this later

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "PostCreator">;

const PostCreator = () => {
  const navigation = useNavigation<NavigationProp>();
  const [postType, setPostType] = useState<PostType>(PostType.SCENT);
  const [postText, setPostText] = useState("");
  const [productName, setProductName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [tags, setTags] = useState<string[]>([]); // Uninteractable for now

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      // Request permissions for camera and media library
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus.status !== "granted" || mediaLibraryStatus.status !== "granted") {
        Alert.alert("Permission Denied", "Camera and media library permissions are required.");
      }
    })();
  }, []);

  const handleSubmit = async () => {
    try {
      setUploading(true);
      let imageUrl = null;
      if (imageUri) {
        // Upload image to S3 and get the URL
        //imageUrl = await uploadImageToS3(imageUri);
      }

      const postData = {
        postType,
        postText,
        data: {
          productName,
          companyName,
          tags,
          imageUrl, // Include the image URL in the post data
        },
      };
      await makePost(postData);
      Alert.alert("Post created!");
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error creating post");
    } finally {
      setUploading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const handlePickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const renderPostTypeButtons = () => {
    const postTypes = Object.values(PostType) as PostType[];
    return (
      <View style={styles.postTypeContainer}>
        {postTypes.map((type) => (
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
      {/* Image preview and buttons */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>No image selected</Text>
        </View>
      )}
      <View style={styles.buttonRow}>
        <Button title="Take Photo" onPress={handleTakePhoto} />
        <Button title="Pick Image" onPress={handlePickImage} />
      </View>
      {/* Tags section (uninteractable for now) */}
      <Text style={styles.placeholder}>#Tags (Coming Soon)</Text>
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Submit Post" onPress={handleSubmit} />
      )}
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
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
});