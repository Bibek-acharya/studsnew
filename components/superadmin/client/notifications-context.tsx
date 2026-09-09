"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  useNotifications,
  type UseNotificationsOptions,
} from "@/features/notifications/useNotifications";

type SuperadminNotifications = ReturnType<typeof useNotifications>;

const SuperadminNotificationsContext =
  createContext<SuperadminNotifications | null>(null);

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
  const state = useNotifications(options ?? { limit: 20 });
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
