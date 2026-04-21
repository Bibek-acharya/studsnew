"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import { apiService, AuthResponse } from "./api";
import { setBlogToken as setBlogApiToken } from "./blogApi";

interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  image_url?: string;
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
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return null;
};

const saveAuth = (token: string, user: User) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
  apiService.setToken(token);
  setBlogApiToken(token);
};

const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  apiService.setToken(null);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [storedAuth, setStoredAuth] = useState<{ token: string; user: User } | null>(null);

  useEffect(() => {
    const stored = loadStoredAuth();
    setStoredAuth(stored);
    setLoading(false);
  }, []);

  const token = storedAuth?.token ?? null;
  const user = storedAuth?.user ?? null;
  const isAuthenticated = !!token;

  const setUser = (userData: User) => {
    const currentToken = storedAuth?.token || "";
    saveAuth(currentToken, userData);
    setStoredAuth({ token: currentToken, user: userData });
  };

  const login = async (email: string, password: string) => {
    const response: AuthResponse = await apiService.login(email, password);
    
    if (!response.data?.token) {
      throw new Error(response.message || "Login failed. Please try again.");
    }

    const userData: User = {
      id: response.data.user.id,
      first_name: response.data.user.first_name,
      last_name: response.data.user.last_name,
      email: response.data.user.email,
      role: response.data.user.role,
    };

    saveAuth(response.data.token, userData);
    setStoredAuth({ token: response.data.token, user: userData });
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, role: string, educationLevel: string) => {
    const response = await apiService.register({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      role: role || "student",
      education_level: educationLevel,
    });

    if (!response.data?.requires_otp) {
      throw new Error("Registration response invalid");
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    const response: AuthResponse = await apiService.verifyOTP(email, otp);
    
    if (!response.data?.token) {
      throw new Error(response.message || "Verification failed");
    }

    const userData: User = {
      id: response.data.user.id,
      first_name: response.data.user.first_name,
      last_name: response.data.user.last_name,
      email: response.data.user.email,
      role: response.data.user.role,
    };

    saveAuth(response.data.token, userData);
    setStoredAuth({ token: response.data.token, user: userData });
  };

  const sendOTP = async (email: string) => {
    await apiService.sendOTP(email);
  };

  const logout = () => {
    clearAuth();
    setStoredAuth(null);
  };

  const superadminLogin = async (email: string, password: string) => {
    const response: AuthResponse = await apiService.login(email, password);
    
    if (!response.data?.token) {
      throw new Error(response.message || "Login failed. Please try again.");
    }

    const userData: User = {
      id: response.data.user.id,
      first_name: response.data.user.first_name,
      last_name: response.data.user.last_name,
      email: response.data.user.email,
      role: response.data.user.role,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("studsphere_superadmin_auth", JSON.stringify({ token: response.data.token, user: userData }));
    }
    setBlogApiToken(response.data.token);
    saveAuth(response.data.token, userData);
    setStoredAuth({ token: response.data.token, user: userData });
  };

  const superadminRegister = async (data: { first_name: string; last_name: string; email: string; password: string; access_code: string }) => {
    const response = await apiService.register({
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      role: "superadmin",
      access_code: data.access_code,
    });

    if (!response.data?.requires_otp) {
      throw new Error("Registration response invalid");
    }
  };

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    verifyOTP,
    sendOTP,
    setUser,
    superadminLogin,
    superadminRegister,
  }), [token, user, isAuthenticated, loading]);

  return (
    <AuthContext.Provider value={value}>
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