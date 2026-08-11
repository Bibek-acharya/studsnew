"use client";

import React, { useEffect, useState } from "react";
import { messageApi, Conversation } from "@/services/message.api";
import ConversationItem from "./ConversationItem";

interface ConversationListProps {
  userRole: "student" | "institution";
  selectedId: number | null;
  onSelect: (conversation: Conversation) => void;
}

export default function ConversationList({ userRole, selectedId, onSelect }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await messageApi.getConversations(50, 0);
      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = conversations.filter((c) => {
    const name = (userRole === "student" ? c.institution_name : c.student_name) || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-center text-gray-400">No conversations</div>
        ) : (
          filtered.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={conversation.id === selectedId}
              onClick={() => onSelect(conversation)}
              userRole={userRole}
            />
          ))
        )}
      </div>
    </div>
  );
}
