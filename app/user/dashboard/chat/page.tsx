"use client";

import MessagingShell from "@/components/messaging/MessagingShell";

export default function ChatPage() {
  return (
    <div className="p-4 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="h-full border border-slate-200 rounded-lg overflow-hidden bg-slate-100">
        <MessagingShell userRole="student" />
      </div>
    </div>
  );
}
