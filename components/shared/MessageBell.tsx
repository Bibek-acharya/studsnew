"use client";

import React from "react";
import { MessageSquare } from "lucide-react";

interface MessageBellProps {
  unreadCount: number;
  onClick: () => void;
}

export default function MessageBell({ unreadCount, onClick }: MessageBellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="icon-btn-hover text-gray-400 hover:text-gray-600 transition-colors relative"
      title="Messages"
    >
      <MessageSquare size={20} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
