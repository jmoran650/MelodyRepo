// s3Service.ts
// s3Service.ts
import { API_URL, fetchWithAuth } from "./apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export const uploadImageToS3 = async (imageUri: string): Promise<string> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    let mimeType = 'image/jpeg';
    if (imageUri.endsWith('.png')) {
      mimeType = 'image/png';
    }

    console.log('Image URI:', imageUri);
    console.log('MIME Type:', mimeType);

    // Use fetchWithAuth here instead of fetch
    const { uploadURL, key } = await fetchWithAuth(`${API_URL}/generate-upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileType: mimeType }),
    }, 'Failed to get upload URL');

    console.log('Received uploadURL:', uploadURL);
    console.log('Received key:', key);

    // Upload the image directly to S3 using the pre-signed URL
    const uploadResponse = await FileSystem.uploadAsync(uploadURL, imageUri, {
      httpMethod: 'PUT',
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {
        'Content-Type': mimeType,
      },
    });

    console.log('Upload Response:', uploadResponse);

    if (uploadResponse.status !== 200 && uploadResponse.status !== 201) {
      throw new Error(`Failed to upload image to S3. Status code: ${uploadResponse.status}`);
    }

    const imageUrl = `https://melodyimagebucket.s3.amazonaws.com/${key}`;
    console.log('Final Image URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};