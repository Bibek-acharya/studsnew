"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  useNotifications,
  type UseNotificationsOptions,
} from "@/features/notifications/useNotifications";

type StudentNotifications = ReturnType<typeof useNotifications>;

const StudentNotificationsContext =
  createContext<StudentNotifications | null>(null);

// One hook instance per mounted provider; the header bell, the sidebar badge,
// and the notifications section all read this same state (doc 13 §3 — kills
// the bell/badge disagreement of the old dual-fetch layout).
export function NotificationsProvider({
  children,
  options,
}: {
  children: ReactNode;
  options?: UseNotificationsOptions;
}) {
  const state = useNotifications(options ?? { limit: 50 });
  return (
    <StudentNotificationsContext.Provider value={state}>
      {children}
    </StudentNotificationsContext.Provider>
  );
}

// Standalone renders (no provider above) get an inert stub — badge reads 0,
// actions no-op.
const FALLBACK: StudentNotifications = {
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

export function useStudentNotifications(): StudentNotifications {
  return useContext(StudentNotificationsContext) ?? FALLBACK;
}
