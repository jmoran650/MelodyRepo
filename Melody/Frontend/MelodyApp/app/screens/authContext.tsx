// AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode} from 'react';
import { validateToken } from './apiService';
import { getToken, setToken, removeToken } from '../utils/tokenStorage';

interface AuthContextProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = await getToken();
      if (token) {
        const userData = await validateToken(token);
        if (userData) {
          setUser(userData);
        } else {
          await removeToken();
        }
      }
    };
    checkUser();
  }, []);

  const login = async (token: string) => {
    await setToken(token);
    const userData = await validateToken(token);
    setUser(userData);
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={ {user, setUser, login, logout} }>
      {children}
    </AuthContext.Provider>
  );
};