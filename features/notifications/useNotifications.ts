"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { notificationClient } from "../../services/notificationClient";
import { toNotificationItem, type NotificationItem } from "./types";

const POLL_INTERVAL_MS = 60_000;

export interface UseNotificationsOptions {
  page?: number;
  limit?: number;
}

// One hook instance per mounted provider; the unread badge and the bell read
// the same state. Polling: 60s unread-count only — full list refreshes on
// visibility change (P3 realtime swaps this to subscribe mode later).
export function useNotifications(options: UseNotificationsOptions = {}) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);
  const itemsRef = useRef<NotificationItem[]>([]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const [inbox, count] = await Promise.all([
        notificationClient.listNotifications(optionsRef.current.page ?? 1, {
          limit: optionsRef.current.limit,
        }),
        notificationClient.fetchUnreadCount(),
      ]);
      setItems(inbox.data.notifications.map(toNotificationItem));
      setUnreadCount(count.data.unread_count);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Mount-time fetch is the whole point of this polling hook — the setState
    // calls inside refresh() are intentional here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    const poll = setInterval(() => {
      notificationClient
        .fetchUnreadCount()
        .then((count) => setUnreadCount(count.data.unread_count))
        .catch(() => undefined);
    }, POLL_INTERVAL_MS);
    const onVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh]);

  const markRead = useCallback(async (id: number) => {
    await notificationClient.markRead(id);
    const wasUnread = itemsRef.current.some((n) => n.id === id && !n.read_at);
    setItems((prev) =>
      prev.map((n) =>
        n.id === id && !n.read_at
          ? { ...n, read_at: new Date().toISOString() }
          : n,
      ),
    );
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    await notificationClient.markAllRead();
    const now = new Date().toISOString();
    setItems((prev) =>
      prev.map((n) => (n.read_at ? n : { ...n, read_at: now })),
    );
    setUnreadCount(0);
  }, []);

  const setArchived = useCallback(
    async (id: number, archived: boolean) => {
      await notificationClient.setArchived(id, archived);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(async (id: number) => {
    await notificationClient.remove(id);
    const wasUnread = itemsRef.current.some((n) => n.id === id && !n.read_at);
    setItems((prev) => prev.filter((n) => n.id !== id));
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  return {
    items,
    unreadCount,
    loading,
    error,
    refresh,
    markRead,
    markAllRead,
    setArchived,
    remove,
  };
}
