import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";

interface AuthContextProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  user: IUser | null;
  login: (token: string) => void;
  logout: () => void;
  setUser: (user: IUser) => void;
}

interface IUser {
  id: string;
  name: string;
  username: string;
  image: string;
  about: string;
  createdAt: Date;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    apiClient
      .get("users/me")
      .then((data: any) => setUser(data.data))
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401)
          logout();
      });

    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setToken(token);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        login,
        logout,
        isLoading,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
