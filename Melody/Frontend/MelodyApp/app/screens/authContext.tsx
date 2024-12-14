// AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { validateToken } from './apiService'; 
import { getToken, setToken, removeToken } from '../utils/tokenStorage';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (token: string, refreshToken: string) => Promise<void>;
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

const REFRESH_TOKEN_KEY = "refreshToken";
const USER_NAME_KEY = "userName";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = await getToken();
      console.log("[AuthContext] Retrieved token on mount:", token);
      if (token) {
        const userData = await validateToken(token);
        console.log("[AuthContext] validateToken result:", userData);
        if (userData) {
          setUser(userData);
          console.log("[AuthContext] User set after validation:", userData);
        } else {
          await removeToken();
          console.log("[AuthContext] Invalid token removed");
          setUser(null);
          await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
          await SecureStore.deleteItemAsync(USER_NAME_KEY);
        }
      } else {
        console.log("[AuthContext] No token found at startup");
      }
    };
    checkUser();
  }, []);

  const login = async (token: string, refreshToken: string) => {
    console.log("[AuthContext] login called with token:", token);
    await setToken(token);
    console.log("[AuthContext] Token set in storage");
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    console.log("[AuthContext] refreshToken set in SecureStore");
    const userData = await validateToken(token);
    console.log("[AuthContext] validateToken after login:", userData);
    if (userData) {
      setUser(userData);
      console.log("[AuthContext] User set after login:", userData);
      await SecureStore.setItemAsync(USER_NAME_KEY, userData.name);
      console.log("[AuthContext] userName set in SecureStore");
    }
  };

  const logout = async () => {
    console.log("[AuthContext] logout called");
    await removeToken();
    console.log("[AuthContext] Token removed from storage");
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    console.log("[AuthContext] refreshToken removed from SecureStore");
    await SecureStore.deleteItemAsync(USER_NAME_KEY);
    console.log("[AuthContext] userName removed from SecureStore");
    setUser(null);
    console.log("[AuthContext] User state set to null after logout");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};