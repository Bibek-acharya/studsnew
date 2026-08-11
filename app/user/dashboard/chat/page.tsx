"use client";

import MessagingShell from "@/components/messaging/MessagingShell";

export default function ChatPage() {
  return (
    <div className="-mx-4 -my-6 lg:-mx-8 h-[calc(100vh-4rem)]">
      <MessagingShell userRole="student" />
    </div>
  );
}
