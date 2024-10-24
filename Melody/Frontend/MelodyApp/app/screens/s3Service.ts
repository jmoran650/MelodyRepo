// s3Service.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./apiService";
import * as FileSystem from "expo-file-system";

export const uploadImageToS3 = async (imageUri: string): Promise<string> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    // Get MIME type
    let mimeType = "image/jpeg"; // Default to JPEG
    if (imageUri.endsWith(".png")) {
      mimeType = "image/png";
    }

    // Request a pre-signed URL from the backend
    const response = await fetch(`${API_URL}/generate-upload-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fileType: mimeType }),
    });

    if (!response.ok) {
      throw new Error("Failed to get upload URL");
    }

    const { uploadURL, key } = await response.json();

    // Upload the image directly to S3 using the pre-signed URL
    const uploadResponse = await FileSystem.uploadAsync(uploadURL, imageUri, {
      headers: {
        "Content-Type": mimeType,
      },
      httpMethod: "PUT",
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    });

    if (uploadResponse.status !== 200) {
      throw new Error("Failed to upload image to S3");
    }

    // Return the image URL
    const imageUrl = `https://${"your-bucket-name"}.s3.amazonaws.com/${key}`;
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};