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

  const initials = (name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const timeStr = conversation.last_message_at
    ? new Date(conversation.last_message_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div
      onClick={onClick}
      className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between group ${
        isSelected
          ? "bg-blue-50 border border-blue-200"
          : "hover:bg-slate-50 border border-transparent"
      }`}
    >
      <div className="flex items-center space-x-2.5 overflow-hidden">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
            {initials}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`text-xs font-bold truncate ${isSelected ? "text-blue-600" : "text-slate-900"}`}>
            {name}
          </h3>
          <p className={`text-xs truncate mt-0.5 ${conversation.unread_count > 0 ? "font-semibold text-slate-800" : "text-slate-500"}`}>
            {conversation.last_message_preview || "No messages yet"}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center ml-2 flex-shrink-0 text-[10px]">
        <span className="text-slate-400">{timeStr}</span>
        {conversation.unread_count > 0 && (
          <span className="mt-1 bg-blue-600 text-white font-bold w-4 h-4 rounded-full flex items-center justify-center text-[9px]">
            {conversation.unread_count}
          </span>
        )}
      </div>
    </div>
  );
}
