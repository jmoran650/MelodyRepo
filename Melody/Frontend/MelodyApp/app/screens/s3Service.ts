// s3Service.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./apiService";
import * as FileSystem from "expo-file-system";

export const uploadImageToS3 = async (imageUri: string): Promise<string> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    // Get MIME type
    let mimeType = 'image/jpeg'; // Default to JPEG
    if (imageUri.endsWith('.png')) {
      mimeType = 'image/png';
    }

    console.log('Image URI:', imageUri);
    console.log('MIME Type:', mimeType);

    // Request a pre-signed URL from the backend
    const response = await fetch(`${API_URL}/generate-upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fileType: mimeType }),
    });

    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { uploadURL, key } = await response.json();

    console.log('Received uploadURL:', uploadURL);
    console.log('Received key:', key);

    // Upload the image directly to S3 using the pre-signed URL
    const uploadResponse = await FileSystem.uploadAsync(uploadURL, imageUri, {
      httpMethod: 'PUT',
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {
        'Content-Type': mimeType,    // Must match ContentType in pre-signed URL
      },
    });

    console.log('Upload Response:', uploadResponse);

    if (uploadResponse.status !== 200 && uploadResponse.status !== 201) {
      throw new Error(`Failed to upload image to S3. Status code: ${uploadResponse.status}`);
    }

    // Return the image URL
    const imageUrl = `https://melodyimagebucket.s3.amazonaws.com/${key}`;
    console.log('Final Image URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};