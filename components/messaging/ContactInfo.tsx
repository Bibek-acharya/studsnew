"use client";

import React from "react";
import { Conversation } from "@/services/message.api";

interface ContactInfoProps {
  conversation: Conversation;
  userRole: "student" | "institution";
  onClose?: () => void;
}

export default function ContactInfo({ conversation, userRole, onClose }: ContactInfoProps) {
  const name = userRole === "student" ? conversation.institution_name : conversation.student_name;
  const initials = (name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-[320px] bg-white border-l border-gray-200 flex flex-col h-full shrink-0 overflow-y-auto">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="text-base font-semibold text-gray-900">Contact Info</h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg ring-4 ring-gray-50">
            {initials}
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-900 leading-tight">{name || "Unknown"}</h4>
            <p className="text-sm text-gray-500 capitalize">{userRole === "student" ? "Student" : "Institution"}</p>
          </div>
        </div>

        <div className="space-y-5 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0 border border-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="min-w-0 flex items-center justify-between w-full">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Conversation</p>
                <p className="text-sm font-semibold text-gray-900">{conversation.id ? `#${conversation.id}` : "New"}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0 border border-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">Last Active</p>
              <p className="text-sm font-semibold text-gray-900">
                {conversation.last_message_at
                  ? new Date(conversation.last_message_at).toLocaleDateString()
                  : "Never"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0 border border-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">Unread Messages</p>
              <p className="text-sm font-semibold text-gray-900">{conversation.unread_count || 0}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 text-center">
            Messages are end-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
