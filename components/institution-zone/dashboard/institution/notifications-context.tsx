"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  useNotifications,
  type UseNotificationsOptions,
} from "@/features/notifications/useNotifications";

type InstitutionNotifications = ReturnType<typeof useNotifications>;

const InstitutionNotificationsContext =
  createContext<InstitutionNotifications | null>(null);

// One hook instance per mounted layout; the header bell and the notifications
// page read this same state — badge equals server unread_count by construction.
export function NotificationsProvider({
  children,
  options,
}: {
  children: ReactNode;
  options?: UseNotificationsOptions;
}) {
  const state = useNotifications(options ?? { limit: 50 });
  return (
    <InstitutionNotificationsContext.Provider value={state}>
      {children}
    </InstitutionNotificationsContext.Provider>
  );
}

// Standalone renders (no provider above) get an inert stub — badge reads 0,
// actions no-op.
const FALLBACK: InstitutionNotifications = {
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

export function useInstitutionNotifications(): InstitutionNotifications {
  return useContext(InstitutionNotificationsContext) ?? FALLBACK;
}
