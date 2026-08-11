"use client";

import React from "react";

interface TypingIndicatorProps {
  typingUsers: Array<{ user_type: string; user_id: number }>;
  currentUserId: number;
}

export default function TypingIndicator({ typingUsers, currentUserId }: TypingIndicatorProps) {
  const others = typingUsers.filter((u) => u.user_id !== currentUserId);

  if (others.length === 0) return null;

  return (
    <div className="px-6 py-2 bg-slate-50/50">
      <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-md inline-flex border border-slate-200 shadow-sm">
        <span className="text-slate-700">
          {others.length === 1 ? "Someone" : `${others.length} people`}
        </span>
        <span>typing</span>
        <div className="flex space-x-1 ml-2">
          <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}
