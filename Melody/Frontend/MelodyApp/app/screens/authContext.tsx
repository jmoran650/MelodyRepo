// AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { validateToken } from './apiService'; // This is acceptable
import { getToken, setToken, removeToken } from '../utils/tokenStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties if needed
}

interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = await getToken();
      if (token) {
        const userData = await validateToken(token);
        if (userData) {
          setUser(userData);
        } else {
          await removeToken();
          setUser(null);
        }
      }
    };
    checkUser();
  }, []);

  const login = async (token: string) => {
    await setToken(token);
    const userData = await validateToken(token);
    if (userData) {
      setUser(userData);
      await AsyncStorage.setItem('userName', userData.name);
    }
  };

  const logout = async () => {
    await removeToken();
    await AsyncStorage.removeItem('userName');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};