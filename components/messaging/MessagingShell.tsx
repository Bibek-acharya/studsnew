"use client";

import React, { useState, useEffect } from "react";
import { messageApi, Conversation } from "@/services/message.api";
import { MessagingProvider, useMessaging } from "./MessagingContext";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import ContactInfo from "./ContactInfo";

function Shell({ userRole }: { userRole: "student" | "institution" }) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const { conversations, markConversationRead } = useMessaging();

  useEffect(() => {
    const storageKey = userRole === "student" ? "user" : "institutionUser";
    const tokenKey = userRole === "student" ? "token" : "institutionToken";
    const userData = localStorage.getItem(storageKey);
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
      const token = localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey);
      if (token) {
        messageApi.connectWebSocket(userRole, user.id, token);
      }
    }
    return () => { messageApi.disconnectWebSocket(); };
  }, [userRole]);

  const handleSelect = (conv: Conversation) => {
    setSelectedConversation(conv);
    markConversationRead(conv.id);
  };

  return (
    <div className="flex flex-1 min-h-0 h-full rounded-lg border border-gray-200 bg-white overflow-hidden">
      <ConversationList userRole={userRole} selectedId={selectedConversation?.id || null}
        onSelect={handleSelect} conversations={conversations} />
      {selectedConversation ? (
        <div className="flex-1 flex min-w-0">
          <div className="flex-1 min-w-0 flex flex-col min-h-0">
            <ChatWindow conversation={selectedConversation} userRole={userRole}
              userId={userId} onToggleContactInfo={() => setShowContactInfo(!showContactInfo)} />
          </div>
          {showContactInfo && (
            <ContactInfo conversation={selectedConversation} userRole={userRole}
              onClose={() => setShowContactInfo(false)} />
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>Select a conversation to start chatting</p>
        </div>
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
