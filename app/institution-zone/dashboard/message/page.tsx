"use client";

import MessagingShell from "@/components/messaging/MessagingShell";

export default function MessagePage() {
  return (
    <div className="-m-4 md:-m-6 lg:-m-8 h-[calc(100vh-4rem)]">
      <MessagingShell userRole="institution" />
    </div>
  );
}
