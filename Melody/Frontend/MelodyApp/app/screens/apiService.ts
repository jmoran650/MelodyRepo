const API_URL = "http://localhost:3000";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Fetch all users
export const getUsers = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }

    const data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Create a new user (No changes needed here)
export const createUser = async (user: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Error creating user: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// User login (No changes needed here)
export const logInUser = async (user: { email: string; password: string }) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Error signing in: ${response.statusText}`);
    }

    const data = await response.json();
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("userName", data.user.name);
    //console.log("returned data from login", data);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Validate token (No changes needed here)
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

// Make a post (Updated to remove userId and include Authorization header)
export const makePost = async (post: {
  postType: string;
  postText: string;
}) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${API_URL}/makePost`, {
      // Updated endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error(`Error creating post: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Get all posts (Include Authorization header)
export const getPosts = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${API_URL}/posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching posts: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Get user ID from local storage (No changes needed here)
export const getIdFromLocalStorage = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const user = await validateToken(token);
      return user.id;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting id from local storage:", error);
    return null;
  }
};

// Get user name from local storage (No changes needed here)
export const getNameFromLocalStorage = async () => {
  try {
    const name = await AsyncStorage.getItem("userName");
    return name;
  } catch (error) {
    console.error("Error getting name from local storage:", error);
    return null;
  }
};

// Get posts by user (Include Authorization header)
export const getPostsByUser = async (userId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${API_URL}/posts/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include authorization header
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching posts: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Request friend (No changes needed here)
export const requestFriend = async (receiverId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${API_URL}/friend/request/${receiverId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || response.statusText;
      throw new Error(`Error sending friend request: ${errorMessage}`);
    }

    return responseData;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Get other user's profile (Include Authorization header)
export const getOtherProfile = async (userId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${API_URL}/profile/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include authorization header
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching profile: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Get friends list
export const getFriends = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${API_URL}/friends`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || response.statusText;
      throw new Error(`Error fetching friends: ${errorMessage}`);
    }

    return responseData.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const getFriendRequests = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${API_URL}/friend/requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || response.statusText;
      throw new Error(`Error fetching friend requests: ${errorMessage}`);
    }

    return responseData.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const acceptFriendRequest = async (requesterId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${API_URL}/friend/accept/${requesterId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || response.statusText;
      throw new Error(`Error accepting friend request: ${errorMessage}`);
    }

    return responseData;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const denyFriendRequest = async (requesterId: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${API_URL}/friend/deny/${requesterId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || response.statusText;
      throw new Error(`Error denying friend request: ${errorMessage}`);
    }

    return responseData;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Additional functions can be added here (e.g., acceptFriendRequest, denyFriendRequest)
