"use client";

import React, { useState, useEffect } from "react";
import { messageApi, Conversation } from "@/services/message.api";
import ConversationList from "@/components/messaging/ConversationList";
import ChatWindow from "@/components/messaging/ChatWindow";

export default function MessagePage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    const userData = localStorage.getItem("institutionUser");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);

      const token = localStorage.getItem("institutionToken");
      if (token) {
        messageApi.connectWebSocket("institution", user.id, token);
      }
    }

    return () => {
      messageApi.disconnectWebSocket();
    };
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <ConversationList
        userRole="institution"
        selectedId={selectedConversation?.id || null}
        onSelect={setSelectedConversation}
      />
      {selectedConversation ? (
        <div className="flex-1">
          <ChatWindow
            conversation={selectedConversation}
            userRole="institution"
            userId={userId}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Select a conversation to start chatting
        </div>
      )}
    </div>
  );
}
