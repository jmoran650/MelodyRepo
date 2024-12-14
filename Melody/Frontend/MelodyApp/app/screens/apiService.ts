export const API_URL = "http://localhost:3000";
//import AsyncStorage from "@react-native-async-storage/async-storage";
import { setToken } from "../utils/tokenStorage";
import * as SecureStore from 'expo-secure-store';

async function handleResponse(response: Response, defaultMessage: string) {
  if (!response.ok) {
    let errorMessage = `${defaultMessage}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = `${defaultMessage}: ${errorData.message}`;
      }
    } catch (parseError) {
      // If parsing fails, fallback to statusText
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const refreshAccessToken = async () => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });

  if (!response.ok) {
    const errorMessage = `Error refreshing token: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const newAccessToken = data.token;
  await setToken(newAccessToken);
  return newAccessToken;
};

/**
 * A helper function to make authenticated requests.
 * It automatically adds the Authorization header and tries to refresh the token on 401 errors.
 */
export async function fetchWithAuth(url: string, options: RequestInit, defaultMessage: string): Promise<any> {
  let token = await SecureStore.getItemAsync("userToken");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  // Add Authorization header
  options.headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`
  };

  let response = await fetch(url, options);
  if (response.status === 401) {
    console.log("[fetchWithAuth] 401 encountered, trying to refresh token");
    try {
      const newToken = await refreshAccessToken();
      // Retry the request with the new token
      options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${newToken}`
      };
      response = await fetch(url, options);
    } catch (refreshError) {
      console.error("[fetchWithAuth] Refresh token failed, user must re-login", refreshError);
      throw refreshError;
    }
  }

  return handleResponse(response, defaultMessage);
}

// Fetch all users
export const getUsers = async () => {
  return fetchWithAuth(`${API_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }, "Error fetching users");
};

// Create a new user
export const createUser = async (user: { name: string; email: string; password: string }) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return handleResponse(response, "Error creating user");
};

// User login (no auth needed)
export const logInUser = async (user: { email: string; password: string }) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  return handleResponse(response, "Error signing in");
};

// Validate token (no token refresh here because we just validate)
export const validateToken = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/validateToken`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error validating token:", error);
    return null;
  }
};

// Make a post
export const makePost = async (post: { postType: string; postText: string; data?: any }) => {
  return fetchWithAuth(`${API_URL}/makePost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  }, "Error creating post");
};

// Get all posts
export const getPosts = async () => {
  return fetchWithAuth(`${API_URL}/posts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }, "Error fetching posts");
};

// Get user ID from local storage (No changes needed)
export const getIdFromLocalStorage = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      const user = await validateToken(token);
      return user?.id ?? null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting id from local storage:", error);
    return null;
  }
};

// Get user name from local storage (No changes needed)
export const getNameFromLocalStorage = async () => {
  try {
    const name = await SecureStore.getItemAsync("userName");
    return name;
  } catch (error) {
    console.error("Error getting name from local storage:", error);
    return null;
  }
};

// Get posts by user
export const getPostsByUser = async (userId: string) => {
  return fetchWithAuth(`${API_URL}/posts/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }, "Error fetching posts");
};

// Request friend
export const requestFriend = async (receiverId: string) => {
  return fetchWithAuth(`${API_URL}/friend/request/${receiverId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  }, "Error sending friend request");
};

// Get other user's profile
export const getOtherProfile = async (userId: string) => {
  return fetchWithAuth(`${API_URL}/profile/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }, "Error fetching profile");
};

// Get friends list
export const getFriends = async () => {
  const data = await fetchWithAuth(`${API_URL}/friends`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }, "Error fetching friends");
  return data.data;
};

export const getFriendRequests = async () => {
  const data = await fetchWithAuth(`${API_URL}/friend/requests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }, "Error fetching friend requests");
  return data.data;
};

export const acceptFriendRequest = async (requesterId: string) => {
  return fetchWithAuth(`${API_URL}/friend/accept/${requesterId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  }, "Error accepting friend request");
};

export const denyFriendRequest = async (requesterId: string) => {
  return fetchWithAuth(`${API_URL}/friend/deny/${requesterId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  }, "Error denying friend request");
};

export const searchUsers = async (searchTerm: string, page: number = 1, pageSize: number = 8) => {
  return fetchWithAuth(`${API_URL}/search/users?q=${encodeURIComponent(searchTerm)}&page=${page}&pageSize=${pageSize}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }, "Error searching users");
};

export const deletePost = async (postId: string) => {
  const responseText = await fetchWithAuth(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  }, "Error deleting post");

  return responseText;
};