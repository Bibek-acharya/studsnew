"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { notificationClient } from "../../services/notificationClient";
import type { ApiRequestOptions } from "../../services/api";
import { toNotificationItem, type NotificationItem } from "./types";

const POLL_INTERVAL_MS = 60_000;

export interface UseNotificationsOptions {
  page?: number;
  limit?: number;
  category?: string;
  archived?: boolean;
  // False while logged out (e.g. the guest navbar): skip the fetch and the
  // poll so public pages never 401 against the inbox endpoints.
  enabled?: boolean;
  // Explicit token for role sessions (e.g. superadmin_token): sent verbatim
  // so a stale default `token` key can never shadow it into a 401.
  authToken?: string;
  // Skip the global user-session auth-expired nuke; implied when the caller
  // takes ownership via onUnauthorized.
  suppressAuthExpired?: boolean;
  // Called on 401 so role surfaces can redirect to their own login page
  // instead of the landing page.
  onUnauthorized?: () => void;
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

  // Auth overrides for every inbox call: explicit role token verbatim, and
  // the global user-session nuke suppressed once the caller owns 401s.
  const reqOpts = useCallback((): ApiRequestOptions | undefined => {
    const { authToken, suppressAuthExpired, onUnauthorized } = optionsRef.current;
    const opts: ApiRequestOptions = {};
    if (authToken) opts.authToken = authToken;
    if (suppressAuthExpired || onUnauthorized) opts.suppressAuthExpired = true;
    return Object.keys(opts).length > 0 ? opts : undefined;
  }, []);

  const noteAuthError = useCallback((e: unknown) => {
    if ((e as { status?: number })?.status === 401) {
      optionsRef.current.onUnauthorized?.();
    }
  }, []);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const [inbox, count] = await Promise.all([
        notificationClient.listNotifications(optionsRef.current.page ?? 1, {
          limit: optionsRef.current.limit,
          category: optionsRef.current.category,
          archived: optionsRef.current.archived,
        }, reqOpts()),
        notificationClient.fetchUnreadCount(reqOpts()),
      ]);
      setItems(inbox.data.notifications.map(toNotificationItem));
      setUnreadCount(count.data.unread_count);
    } catch (e) {
      noteAuthError(e);
      setError(e instanceof Error ? e.message : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [reqOpts, noteAuthError]);

  useEffect(() => {
    if ((optionsRef.current.enabled ?? true) === false) {
      setLoading(false);
      return;
    }
    // Mount-time fetch is the whole point of this polling hook.
    void refresh();
    const poll = setInterval(() => {
      notificationClient
        .fetchUnreadCount(reqOpts())
        .then((count) => setUnreadCount(count.data.unread_count))
        .catch((e: unknown) => {
          noteAuthError(e);
        });
    }, POLL_INTERVAL_MS);
    const onVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh, reqOpts, noteAuthError]);

  const markRead = useCallback(async (id: number) => {
    try {
      await notificationClient.markRead(id, reqOpts());
    } catch (e) {
      noteAuthError(e);
      throw e;
    }
    const wasUnread = itemsRef.current.some((n) => n.id === id && !n.read_at);
    setItems((prev) =>
      prev.map((n) =>
        n.id === id && !n.read_at
          ? { ...n, read_at: new Date().toISOString() }
          : n,
      ),
    );
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
  }, [reqOpts, noteAuthError]);

  const markAllRead = useCallback(async () => {
    try {
      await notificationClient.markAllRead(reqOpts());
    } catch (e) {
      noteAuthError(e);
      throw e;
    }
    const now = new Date().toISOString();
    setItems((prev) =>
      prev.map((n) => (n.read_at ? n : { ...n, read_at: now })),
    );
    setUnreadCount(0);
  }, [reqOpts, noteAuthError]);

  const setArchived = useCallback(
    async (id: number, archived: boolean) => {
      try {
        await notificationClient.setArchived(id, archived, reqOpts());
      } catch (e) {
        noteAuthError(e);
        throw e;
      }
      await refresh();
    },
    [refresh, reqOpts, noteAuthError],
  );

  const remove = useCallback(async (id: number) => {
    try {
      await notificationClient.remove(id, reqOpts());
    } catch (e) {
      noteAuthError(e);
      throw e;
    }
    const wasUnread = itemsRef.current.some((n) => n.id === id && !n.read_at);
    setItems((prev) => prev.filter((n) => n.id !== id));
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
  }, [reqOpts, noteAuthError]);

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
