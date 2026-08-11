"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { messageApi, Conversation } from "@/services/message.api";

interface MessagingContextValue {
  unreadCount: number;
  conversations: Conversation[];
  refreshConversations: () => Promise<void>;
  markConversationRead: (convId: number) => void;
}

const MessagingContext = createContext<MessagingContextValue | null>(null);

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const refreshConversations = useCallback(async () => {
    try {
      const data = await messageApi.getConversations(50, 0);
      setConversations(data);
    } catch {}
  }, []);

  const unreadCount = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  const markConversationRead = useCallback((convId: number) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unread_count: 0 } : c))
    );
  }, []);

  useEffect(() => {
    refreshConversations();
    pollRef.current = setInterval(refreshConversations, 30000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [refreshConversations]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("messaging-unread-changed", { detail: unreadCount }));
  }, [unreadCount]);

  useEffect(() => {
    const unsubCreated = messageApi.on("message.created", () => refreshConversations());
    const unsubRead = messageApi.on("message.read", () => refreshConversations());
    return () => { unsubCreated(); unsubRead(); };
  }, [refreshConversations]);

  return (
    <MessagingContext.Provider value={{ unreadCount, conversations, refreshConversations, markConversationRead }}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const ctx = useContext(MessagingContext);
  if (!ctx) throw new Error("useMessaging must be used within MessagingProvider");
  return ctx;
}
