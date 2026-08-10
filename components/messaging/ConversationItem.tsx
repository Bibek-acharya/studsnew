"use client";

import React from "react";
import { Conversation } from "@/services/message.api";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  userRole: "student" | "institution";
}

export default function ConversationItem({ conversation, isSelected, onClick, userRole }: ConversationItemProps) {
  const name = userRole === "student"
    ? conversation.institution_name
    : conversation.student_name;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
        isSelected ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-gray-50"
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm truncate">{name}</span>
          {conversation.last_message_at && (
            <span className="text-xs text-gray-400">
              {new Date(conversation.last_message_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-500 truncate">{conversation.last_message_preview || "No messages yet"}</p>
          {conversation.unread_count > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
              {conversation.unread_count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
