const API_URL = "http://localhost:3000";

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
export const createUser = async (user: { id: number; name: string; email: string, password: string }) => {
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
            throw new Error(`Error signing in: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("returned data from login", data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}