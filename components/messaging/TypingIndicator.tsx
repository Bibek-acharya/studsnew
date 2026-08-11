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
    <div className="px-4 py-1 text-sm text-gray-500 italic">
      {others.length === 1 ? "Typing..." : `${others.length} people are typing...`}
    </div>
  );
}
