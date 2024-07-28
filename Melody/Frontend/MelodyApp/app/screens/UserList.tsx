import React, { useState, useEffect } from "react";
import { View, Text,} from "react-native";
import { getUsers } from "./apiService";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
}

export const userList = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const users = await getUsers();
        setUsers(users);
    };

    // const handleAddUser = async () => {
    //     const newUser = { firstName: "Jane", lastName: "Doe", age: 28 };
    //     const createdUser = await createUser(newUser);
    //     setUsers([...users, createdUser]);
    // };

    return (
        <View>
            <Text>Users</Text>
            <View>
                {users.map(user => (
                    <li key={user.id}>{user.firstName} {user.lastName} ({user.age})</li>
                ))}
            </View>
        </View>
    );
};
