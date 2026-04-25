"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiService } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const SUPERADMIN_STORAGE_KEY = "studsphere_superadmin_auth";

// ─── Default seeded credentials (mirrors seed_admin_user.go defaults) ─────────
const DEFAULT_SUPERADMIN_EMAIL = "admin@studsphere.com";
const DEFAULT_SUPERADMIN_PASSWORD = "Admin@1234";
const ACCESS_CODE = "SUPER2026";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SuperadminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface SuperadminAuthContextType {
  token: string | null;
  admin: SuperadminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    access_code: string;
  }) => Promise<void>;
  logout: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const SuperadminAuthContext = createContext<SuperadminAuthContextType | undefined>(undefined);

// ─── Local storage helpers ───────────────────────────────────────────────────

function loadStoredAdmin(): { token: string; admin: SuperadminUser } | null {
  try {
    const raw = localStorage.getItem(SUPERADMIN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) {
        apiService.setToken(parsed.token);
      }
      return parsed;
    }
  } catch { /* ignore */ }
  return null;
}

function saveAdminAuth(token: string, admin: SuperadminUser) {
  localStorage.setItem(SUPERADMIN_STORAGE_KEY, JSON.stringify({ token, admin }));
  apiService.setToken(token);
}

function clearAdminAuth() {
  localStorage.removeItem(SUPERADMIN_STORAGE_KEY);
  apiService.setToken(null);
}

// ─── Local admin "database" (for offline / no-DB mode) ───────────────────────
// Stores additional admins registered via the signup form in the browser only.
const LOCAL_ADMINS_KEY = "studsphere_local_admins";

function getLocalAdmins(): Array<{ email: string; password: string; first_name: string; last_name: string }> {
  try {
    const raw = localStorage.getItem(LOCAL_ADMINS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLocalAdmin(admin: { email: string; password: string; first_name: string; last_name: string }) {
  const admins = getLocalAdmins();
  admins.push(admin);
  localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(admins));
}

// ─── Backend API call (tries real backend, throws on any error) ──────────────

async function tryBackendLogin(
  email: string,
  password: string
): Promise<{ token: string; user: SuperadminUser } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/superadmin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(3000), // 3-second timeout
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || data.error || "Login failed");
    }
    const data = await res.json();
    return data.data as { token: string; user: SuperadminUser };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "";
    // Network / connection errors — signal to caller to use offline fallback
    if (
      (err instanceof Error && (err.name === "TypeError" || err.name === "AbortError")) ||
      message.includes("Failed to fetch") ||
      message.includes("ERR_CONNECTION_REFUSED")
    ) {
      return null; // backend unavailable
    }
    throw err; // real error (wrong password, 403, etc.) — re-throw
  }
}

async function tryBackendRegister(data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  access_code: string;
}): Promise<{ token: string; user: SuperadminUser } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/superadmin/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      const resData = await res.json().catch(() => ({}));
      throw new Error(resData.message || resData.error || "Registration failed");
    }
    const resData = await res.json();
    return resData.data as { token: string; user: SuperadminUser };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "";
    if (
      (err instanceof Error && (err.name === "TypeError" || err.name === "AbortError")) ||
      message.includes("Failed to fetch") ||
      message.includes("ERR_CONNECTION_REFUSED")
    ) {
      return null; // backend unavailable
    }
    throw err;
  }
}

// ─── Offline fallback login ───────────────────────────────────────────────────

function offlineLogin(email: string, password: string): { token: string; user: SuperadminUser } {
  // Check default seeded credentials
  if (email === DEFAULT_SUPERADMIN_EMAIL && password === DEFAULT_SUPERADMIN_PASSWORD) {
    return {
      token: `local_sa_${Date.now()}`,
      user: { id: 1, email, first_name: "Super", last_name: "Admin", role: "superadmin" },
    };
  }

  // Check any locally-registered admins
  const locals = getLocalAdmins();
  const found = locals.find((a) => a.email === email && a.password === password);
  if (found) {
    return {
      token: `local_sa_${Date.now()}`,
      user: { id: Date.now(), email, first_name: found.first_name, last_name: found.last_name, role: "superadmin" },
    };
  }

  throw new Error("Invalid administrative credentials.");
}

function offlineRegister(data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  access_code: string;
}): { token: string; user: SuperadminUser } {
  if (data.access_code !== ACCESS_CODE) {
    throw new Error("Invalid administrative access code.");
  }

  const locals = getLocalAdmins();
  if (locals.find((a) => a.email === data.email) || data.email === DEFAULT_SUPERADMIN_EMAIL) {
    throw new Error("An administrator with this email already exists.");
  }

  saveLocalAdmin({
    email: data.email,
    password: data.password,
    first_name: data.first_name,
    last_name: data.last_name,
  });

  return {
    token: `local_sa_${Date.now()}`,
    user: { id: Date.now(), email: data.email, first_name: data.first_name, last_name: data.last_name, role: "superadmin" },
  };
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function SuperadminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<SuperadminUser | null>(null);
  const [loading, setLoading] = useState(true);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const stored = loadStoredAdmin();
    if (stored) {
      setToken(stored.token);
      setAdmin(stored.admin);
    }
    setLoading(false);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const login = async (email: string, password: string) => {
    // Try real backend first
    const backendResult = await tryBackendLogin(email, password);

    const result = backendResult ?? offlineLogin(email, password);

    saveAdminAuth(result.token, result.user);
    setToken(result.token);
    setAdmin(result.user);
  };

  const register = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    access_code: string;
  }) => {
    const backendResult = await tryBackendRegister(data);

    const result = backendResult ?? offlineRegister(data);

    saveAdminAuth(result.token, result.user);
    setToken(result.token);
    setAdmin(result.user);
  };

  const logout = () => {
    clearAdminAuth();
    setToken(null);
    setAdmin(null);
  };

  return (
    <SuperadminAuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </SuperadminAuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSuperadminAuth() {
  const ctx = useContext(SuperadminAuthContext);
  if (!ctx) throw new Error("useSuperadminAuth must be used inside SuperadminAuthProvider");
  return ctx;
}
