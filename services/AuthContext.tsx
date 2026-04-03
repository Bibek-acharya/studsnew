"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { apiService } from "./api";

interface AuthContextType {
  token: string | null;
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string, role: string, educationLevel: string) => Promise<any>;
  verifyOTP: (identifier: string, otp: string) => Promise<any>;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(apiService.getToken());
  const [user, setUserState] = useState<any>(apiService.getUser());

  const setUser = (userData: any) => {
    setUserState(userData);
    apiService.setUser(userData);
  };

  const login = async (email: string, password: string) => {
    const mockToken = "mock-token-" + Date.now();
    const mockUser = { id: 1, first_name: email.split("@")[0], last_name: "", email, role: "student" };
    apiService.setToken(mockToken);
    apiService.setUser(mockUser);
    setToken(mockToken);
    setUserState(mockUser);
    return { success: true };
  };

  const register = async (email: string, _password: string, firstName: string, lastName: string, _role: string, _educationLevel: string) => {
    const mockUser = { id: 1, first_name: firstName, last_name: lastName, email, role: "student" };
    apiService.setUser(mockUser);
    setUserState(mockUser);
    return { requires_otp: true };
  };

  const verifyOTP = async (_identifier: string, _otp: string) => {
    const mockToken = "mock-token-" + Date.now();
    apiService.setToken(mockToken);
    setToken(mockToken);
    return { success: true };
  };

  const logout = () => {
    apiService.setToken(null);
    apiService.setUser(null);
    setToken(null);
    setUserState(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout, register, verifyOTP, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return { token: "mock-token", user: null, isAuthenticated: true, login: async () => {}, logout: () => {}, register: async () => ({}), verifyOTP: async () => {}, setUser: () => {} };
  }
  return context;
}
