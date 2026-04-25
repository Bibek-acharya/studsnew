"use client";

import React from "react";
import { MessageSquare } from "lucide-react";

const messages = [
  { initials: "AS", name: "Anjali Sharma", time: "2 hours ago", text: "I have a question about the scholarship application process..." },
  { initials: "RM", name: "Ramesh Magar", time: "1 day ago", text: "Can I apply for multiple scholarships at the same time?" },
  { initials: "PK", name: "Priya KC", time: "2 days ago", text: "What documents are required for the entrance exam?" },
];

export default function MessageInquirySection() {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
        <MessageSquare size={20} className="text-blue-600" /> Messages & Inquiries
      </h2>
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.name} className="flex items-start gap-3 rounded-md bg-gray-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white">
              {m.initials}
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-semibold text-gray-900">{m.name}</p>
                <span className="text-xs text-gray-500">{m.time}</span>
              </div>
              <p className="mb-2 text-sm text-gray-600">{m.text}</p>
              <div className="flex items-center gap-2">
                <button type="button" className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700">Reply</button>
                <button type="button" className="rounded-md bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-300">Mark as Read</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
