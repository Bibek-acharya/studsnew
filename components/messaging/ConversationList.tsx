"use client";

import React, { useState } from "react";
import { Conversation } from "@/services/message.api";
import ConversationItem from "./ConversationItem";

interface ConversationListProps {
  userRole: "student" | "institution";
  selectedId: number | null;
  onSelect: (conversation: Conversation) => void;
  conversations: Conversation[];
}

export default function ConversationList({ userRole, selectedId, onSelect, conversations }: ConversationListProps) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) => {
    const name = (userRole === "student" ? c.institution_name : c.student_name) || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col h-full">
      <div className="p-3 border-b border-gray-200 shrink-0">
        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {filtered.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            {search ? "No matching conversations" : "No conversations yet"}
          </div>
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
