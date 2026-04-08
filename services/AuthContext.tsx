"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
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
};

const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY);
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

  const login = async (email: string, _password: string) => {
    const storedUsersRaw = localStorage.getItem("studsphere_users");
    const storedUsers: Array<{ email: string; password: string; first_name: string; last_name: string; role: string }> = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

    const found = storedUsers.find((u) => u.email === email && u.password === _password);

    if (!found) {
      throw new Error("Invalid email or password. Please try again.");
    }

    const mockToken = `tok_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const userData: User = {
      first_name: found.first_name,
      last_name: found.last_name,
      email: found.email,
      role: found.role,
    };

    saveAuth(mockToken, userData);
    setToken(mockToken);
    setUserState(userData);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, role: string, _educationLevel: string) => {
    const storedUsersRaw = localStorage.getItem("studsphere_users");
    const storedUsers: Array<{ email: string; password: string; first_name: string; last_name: string; role: string }> = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

    const exists = storedUsers.find((u) => u.email === email);
    if (exists) {
      throw new Error("An account with this email already exists.");
    }

    storedUsers.push({ email, password, first_name: firstName, last_name: lastName, role });
    localStorage.setItem("studsphere_users", JSON.stringify(storedUsers));

    const mockToken = `tok_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const userData: User = { first_name: firstName, last_name: lastName, email, role };

    saveAuth(mockToken, userData);
    setToken(mockToken);
    setUserState(userData);
  };

  const verifyOTP = async (_email: string, _otp: string) => {
    /* no-op for mock */
  };

  const sendOTP = async (_email: string) => {
    /* no-op for mock */
  };

  const logout = () => {
    clearAuth();
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
