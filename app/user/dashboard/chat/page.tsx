"use client";

import React, { useState, useEffect } from "react";
import { messageApi, Conversation } from "@/services/message.api";
import ConversationList from "@/components/messaging/ConversationList";
import ChatWindow from "@/components/messaging/ChatWindow";
import ContactInfo from "@/components/messaging/ContactInfo";

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [showContactInfo, setShowContactInfo] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        messageApi.connectWebSocket("student", user.id, token);
      }
    }

    return () => {
      messageApi.disconnectWebSocket();
    };
  }, []);

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      <ConversationList
        userRole="student"
        selectedId={selectedConversation?.id || null}
        onSelect={setSelectedConversation}
      />
      {selectedConversation ? (
        <div className="flex-1 flex">
          <div className="flex-1">
            <ChatWindow
              conversation={selectedConversation}
              userRole="student"
              userId={userId}
              onToggleContactInfo={() => setShowContactInfo(!showContactInfo)}
            />
          </div>
          {showContactInfo && (
            <ContactInfo
              conversation={selectedConversation}
              userRole="student"
              onClose={() => setShowContactInfo(false)}
            />
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Select a conversation to start chatting
        </div>
      )}
    </div>
  );
}
