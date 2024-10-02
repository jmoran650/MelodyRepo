const API_URL = "http://localhost:3000";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fetch all users
export const getUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching users: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

// Create a new user
export const createUser = async (user: { name: string , email: string, password: string }) => {
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error(`Error creating user: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const logInUser = async (user: { email: string, password: string }) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error(`Error signing in: ${response}`);
        }

        const data = await response.json();
        AsyncStorage.setItem('token', data.token);
        console.log("returned data from login", data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

export const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/validateToken`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error validating token:', error);
      return null;
    }
  };

  export const makePost = async (post: { postType: string, postText: string, postUserId: string }) => {
    try {
        const response = await fetch(`${API_URL}/makePost/${post.postUserId}`, { // Add userId in URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postType: post.postType,
                postText: post.postText
            })
        });

        if (!response.ok) {
            throw new Error(`Error creating post: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const getPosts = async () => {
    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching posts: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const getIdFromLocalStorage = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            const user = await validateToken(token);
            return user.id;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting id from local storage:', error);
        return null;
    }
}