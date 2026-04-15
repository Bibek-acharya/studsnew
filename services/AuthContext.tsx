"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiService } from "./api";

interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string, role: string, educationLevel: string) => Promise<void>;
  superadminLogin: (email: string, password: string) => Promise<void>;
  superadminRegister: (data: { first_name: string; last_name: string; email: string; password: string; access_code: string }) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "studsphere_auth";

const loadStoredAuth = (): { token: string; user: User } | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return null;
};

const saveAuth = (token: string, user: User) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
  // Also set in apiService just in case
  apiService.setToken(token);
};

const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY);
  apiService.setToken(null);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = loadStoredAuth();
    if (stored) {
      setToken(stored.token);
      setUserState(stored.user);
    }
    setLoading(false);
  }, []);

  const setUser = (userData: User) => {
    setUserState(userData);
    if (token) saveAuth(token, userData);
  };

  const login = async (email: string, password: string) => {
    const response = await apiService.login(email, password);
    const { token: receivedToken, user: receivedUser } = response.data;
    
    saveAuth(receivedToken, receivedUser);
    setToken(receivedToken);
    setUserState(receivedUser);
  };

  const superadminLogin = async (email: string, password: string) => {
    const response = await apiService.superadminLogin(email, password);
    const { token: receivedToken, user: receivedUser } = response.data;
    
    saveAuth(receivedToken, receivedUser);
    setToken(receivedToken);
    setUserState(receivedUser);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, role: string, educationLevel: string) => {
    await apiService.register({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      role,
      education_level: educationLevel
    });
    // Registration might require OTP, but for now we proceed as if success leads to login or OTP flow
  };

  const superadminRegister = async (data: { first_name: string; last_name: string; email: string; password: string; access_code: string }) => {
    const response = await apiService.superadminRegister(data);
    const { token: receivedToken, user: receivedUser } = response.data;
    
    saveAuth(receivedToken, receivedUser);
    setToken(receivedToken);
    setUserState(receivedUser);
  };

  const verifyOTP = async (email: string, otp: string) => {
    const response = await apiService.verifyOTP(email, otp);
    const { token: receivedToken, user: receivedUser } = response.data;
    
    saveAuth(receivedToken, receivedUser);
    setToken(receivedToken);
    setUserState(receivedUser);
  };

  const sendOTP = async (email: string) => {
    await apiService.sendOTP(email);
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUserState(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      logout, 
      register, 
      superadminLogin,
      superadminRegister,
      verifyOTP, 
      sendOTP, 
      setUser 
    }}>
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
