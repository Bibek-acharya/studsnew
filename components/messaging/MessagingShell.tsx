"use client";

import React, { useState, useEffect } from "react";
import { messageApi, Conversation } from "@/services/message.api";
import { MessagingProvider, useMessaging } from "./MessagingContext";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import ContactInfo from "./ContactInfo";

function getStoredUserId(userRole: "student" | "institution"): number {
  const storageKeys = userRole === "student" ? ["studsphere_user", "user"] : ["institutionUser"];
  if (typeof window === "undefined") return 0;
  for (const key of storageKeys) {
    for (const storage of [window.localStorage, window.sessionStorage]) {
      const userData = storage.getItem(key);
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          const id = parsed.id || parsed.user?.id;
          if (id) return id;
        } catch {}
      }
    }
  }
  return 0;
}

function Shell({ userRole }: { userRole: "student" | "institution" }) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [userId, setUserId] = useState<number>(() => getStoredUserId(userRole));
  const [showContactInfo, setShowContactInfo] = useState(false);
  const { conversations, markConversationRead } = useMessaging();

  useEffect(() => {
    const rawUserId = getStoredUserId(userRole);
    const tokenKey = userRole === "student" ? "token" : "institutionToken";
    const token = localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey);
    if (token) {
      messageApi.connectWebSocket(userRole, rawUserId, token);
    }
    return () => { messageApi.disconnectWebSocket(); };
  }, [userRole]);

  const handleSelect = (conv: Conversation) => {
    setSelectedConversation(conv);
    markConversationRead(conv.id);
  };

  return (
    <div className="flex-1 flex overflow-hidden h-full max-w-[1920px] mx-auto w-full shadow-md">
      <ConversationList userRole={userRole} selectedId={selectedConversation?.id || null}
        onSelect={handleSelect} conversations={conversations} />
      {selectedConversation ? (
        <>
          <ChatWindow conversation={selectedConversation} userRole={userRole}
            userId={userId} onToggleContactInfo={() => setShowContactInfo(!showContactInfo)}
            showContactInfo={showContactInfo} />
          {showContactInfo && (
            <ContactInfo conversation={selectedConversation} userRole={userRole}
              onClose={() => setShowContactInfo(false)} />
          )}
        </>
      ) : (
        <main className="hidden md:flex flex-1 bg-white flex-col min-w-0 items-center justify-center text-slate-400">
          <i className="fa-regular fa-comments text-4xl mb-3 text-slate-200"></i>
          <p className="text-sm font-medium">Select a conversation to start chatting</p>
        </main>
      )}
    </div>
  );
}

export default function MessagingShell({ userRole }: { userRole: "student" | "institution" }) {
  return (
    <MessagingProvider>
      <Shell userRole={userRole} />
    </MessagingProvider>
  );
}
