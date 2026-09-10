"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  useNotifications,
  type UseNotificationsOptions,
} from "@/features/notifications/useNotifications";

type SuperadminNotifications = ReturnType<typeof useNotifications>;

const SuperadminNotificationsContext =
  createContext<SuperadminNotifications | null>(null);

// Superadmin inbox auth: the shared /api/v1/notifications endpoints are
// role-agnostic, so the superadmin_token goes verbatim (a stale default
// `token` key must never shadow it into a 401) and a 401 returns to the
// superadmin login — never the global user-session nuke to the landing page.
export function superadminInboxAuth(): {
  authToken?: string;
  suppressAuthExpired: boolean;
  onUnauthorized: () => void;
} {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("superadmin_token")
      : null;
  return {
    ...(token ? { authToken: token } : {}),
    suppressAuthExpired: true,
    onUnauthorized: () => {
      window.location.href = "/superadmin/login";
    },
  };
}

// One hook instance per mounted shell; the header bell and the
// manage-notifications page read this same state — badge equals server
// unread_count by construction.
export function NotificationsProvider({
  children,
  options,
}: {
  children: ReactNode;
  options?: UseNotificationsOptions;
}) {
  const state = useNotifications({ limit: 20, ...superadminInboxAuth(), ...options });
  return (
    <SuperadminNotificationsContext.Provider value={state}>
      {children}
    </SuperadminNotificationsContext.Provider>
  );
}

// Standalone renders (no provider above) get an inert stub — badge reads 0,
// actions no-op.
const FALLBACK: SuperadminNotifications = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
  refresh: () => Promise.resolve(),
  markRead: () => Promise.resolve(),
  markAllRead: () => Promise.resolve(),
  setArchived: () => Promise.resolve(),
  remove: () => Promise.resolve(),
};

export function useSuperadminNotifications(): SuperadminNotifications {
  return useContext(SuperadminNotificationsContext) ?? FALLBACK;
}
