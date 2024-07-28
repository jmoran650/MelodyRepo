import axios from "axios";

const API_URL = "http://localhost:3000";

export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    console.log(response.data);
    return response.data;
};

export const createUser = async (user: { firstName: string; lastName: string; age: number }) => {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
};