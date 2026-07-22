"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { apiService, AuthResponse } from "./api";
import { clearAllAuthSessions, persistAuthSession } from "./authSession";

interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  image_url?: string;
  current_status?: string;
  provider_id?: number;
  permissions?: string[];
  is_sub_user?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string,
    educationLevel: string,
  ) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  setUser: (user: User) => void;
  setSession: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "studsphere_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      // NOTE: middleware.ts requires a `token` cookie to protect /user/dashboard/* routes.
      // The backend MUST set an HttpOnly `token` cookie on login for this to work.
      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || sessionStorage.getItem("token")
          : null;
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem(USER_STORAGE_KEY) ||
            sessionStorage.getItem(USER_STORAGE_KEY)
          : null;

      // Only trust cached user state when a real auth token is also present.
      // This prevents stale superadmin/user records from being shown after logout.
      if (stored && storedToken) {
        try {
          // Stored auth state is restored only on the client after hydration.
          setUserState(JSON.parse(stored));
          if (isMounted) {
            setLoading(false);
          }
          return;
        } catch {
          clearAllAuthSessions();
          if (isMounted) {
            setLoading(false);
          }
        }
      } else if (stored && !storedToken && typeof window !== "undefined") {
        clearAllAuthSessions();
      } else if (isMounted) {
        setLoading(false);
      }

      // Sync check: if localStorage has token but cookie is missing, clear stale state
      if (
        storedToken &&
        typeof window !== "undefined" &&
        !document.cookie.includes("token=")
      ) {
        // Only clear if cookie is missing - backend should set it on login
        // This prevents stale sessions when cookie expires but localStorage doesn't know
        const hasTokenCookie = document.cookie
          .split(";")
          .some((c) => c.trim().startsWith("token="));
        if (!hasTokenCookie) {
          clearAllAuthSessions();
          setUserState(null);
        }
      }
    };

    void bootstrapAuth();

    const handleAuthExpired = () => {
      clearAllAuthSessions();
      setUserState(null);
      window.location.href = "/";
    };

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => {
      isMounted = false;
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, []);

  const isAuthenticated = !!user;

  const setUser = (userData: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    }
    setUserState(userData);
  };

  const setSession = (userData: User, token: string) => {
    if (typeof window !== "undefined") {
      persistAuthSession(userData, token, true);
    }
    setUserState(userData);
  };

  const login = async (email: string, password: string, rememberMe = false) => {
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
      image_url: response.data.user.image_url,
    };

    if (typeof window !== "undefined") {
      persistAuthSession(userData, response.data.token, rememberMe);
    }
    setUserState(userData);
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string,
    educationLevel: string,
  ) => {
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
      image_url: response.data.user.image_url,
    };

    if (typeof window !== "undefined") {
      persistAuthSession(userData, response.data.token, true);
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
      clearAllAuthSessions();
    }
    setUserState(null);
    window.location.href = "/";
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      register,
      verifyOTP,
      sendOTP,
      setUser,
      setSession,
    }),
    [user, isAuthenticated, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
