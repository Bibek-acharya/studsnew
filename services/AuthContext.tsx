"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiService } from "./api";

interface AuthContextType {
  token: string | null;
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string, role: string, educationLevel: string) => Promise<any>;
  verifyOTP: (email: string, otp: string) => Promise<any>;
  sendOTP: (email: string) => Promise<any>;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUserState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = apiService.getToken();
      if (storedToken && storedToken !== "mock-token") {
        try {
          const response = await apiService.getProfile();
          setToken(storedToken);
          setUserState(response.data.user);
        } catch {
          apiService.setToken(null);
          apiService.setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const setUser = (userData: any) => {
    setUserState(userData);
    apiService.setUser(userData);
  };

  const login = async (email: string, password: string) => {
    const response = await apiService.login(email, password);
    const { token: newToken, user: userData } = response.data;
    apiService.setToken(newToken);
    apiService.setUser(userData);
    setToken(newToken);
    setUserState(userData);
    return response;
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, role: string, educationLevel: string) => {
    const response = await apiService.register({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      role,
      education_level: educationLevel,
    });
    return response;
  };

  const verifyOTP = async (email: string, otp: string) => {
    const response = await apiService.verifyOTP(email, otp);
    const { token: newToken, user: userData } = response.data;
    apiService.setToken(newToken);
    apiService.setUser(userData);
    setToken(newToken);
    setUserState(userData);
    return response;
  };

  const sendOTP = async (email: string) => {
    return apiService.sendOTP(email);
  };

  const logout = () => {
    apiService.setToken(null);
    apiService.setUser(null);
    setToken(null);
    setUserState(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, login, logout, register, verifyOTP, sendOTP, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
