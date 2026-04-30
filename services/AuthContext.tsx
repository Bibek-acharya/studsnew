"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import { apiService, AuthResponse } from "./api";
import { clearAuthSession, persistAuthSession } from "./authSession";

interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  image_url?: string;
  current_status?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string, role: string, educationLevel: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "studsphere_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(USER_STORAGE_KEY) : null;
    if (stored) {
      try {
        // Stored auth state is restored only on the client after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserState(JSON.parse(stored));
      } catch { /* ignore */ }
    }
    setLoading(false);

    const handleAuthExpired = () => {
      clearAuthSession(localStorage);
      setUserState(null);
      window.location.href = "/login";
    };

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => window.removeEventListener("auth-expired", handleAuthExpired);
  }, []);

  const isAuthenticated = !!user;

  const setUser = (userData: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    }
    setUserState(userData);
  };

  const login = async (email: string, password: string, _rememberMe = false) => {
    void _rememberMe;
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
      persistAuthSession(localStorage, userData, response.data.token);
    }
    setUserState(userData);
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

    if (typeof window !== "undefined") {
      persistAuthSession(localStorage, userData, response.data.token);
    }
    setUserState(userData);
  };

  const sendOTP = async (email: string) => {
    await apiService.sendOTP(email);
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      clearAuthSession(localStorage);
      localStorage.removeItem("onboarding_completed");
    }
    setUserState(null);
    window.location.href = "/";
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    verifyOTP,
    sendOTP,
    setUser,
  }), [user, isAuthenticated, loading]);

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
