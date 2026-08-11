"use client";

import React, { useState } from "react";
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

  const [aboutOpen, setAboutOpen] = useState(true);
  const [addressOpen, setAddressOpen] = useState(true);

  return (
    <aside className="w-full md:w-80 lg:w-[360px] flex-shrink-0 bg-white border-l border-slate-200 flex flex-col z-20 transition-all duration-300">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {userRole === "student" ? "College Info" : "Student Info"}
        </span>
        {onClose && (
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md">
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold mx-auto ring-2 ring-slate-200">
              {initials}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{name || "Unknown"}</h3>

            <div className="flex flex-col items-center justify-center space-y-1 mt-2 text-slate-500 text-xs">
              <div className="flex items-center space-x-1.5">
                <i className="fa-solid fa-user w-3"></i>
                <span>{userRole === "student" ? "Institution" : "Student"}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <i className="fa-regular fa-calendar w-3"></i>
                <span>
                  {conversation.last_message_at
                    ? "Last active " + new Date(conversation.last_message_at).toLocaleDateString()
                    : "Never active"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-200" />

        <div className="border-b border-slate-200 pb-4">
          <button
            onClick={() => setAboutOpen(!aboutOpen)}
            className="w-full flex items-center justify-between text-left font-bold text-slate-900 py-1 text-xs"
          >
            <span>About</span>
            <i className={`fa-solid fa-chevron-up text-[10px] text-slate-400 transition-transform ${aboutOpen ? "" : "rotate-180"}`}></i>
          </button>
          <div className={`${aboutOpen ? "open" : ""} space-y-3 pt-2 text-xs`} style={{ display: aboutOpen ? "block" : "none" }}>
            <p className="text-slate-600 leading-relaxed">
              {userRole === "student"
                ? `${name || "This institution"} is available for questions. Click "View Profile" to see details about courses, fees, and more.`
                : `${name || "This student"} is interested in learning more about your institution.`}
            </p>
            <button className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-blue-600 font-semibold rounded-sm transition-all text-xs">
              View Profile
            </button>
          </div>
        </div>

        <div className="border-b border-slate-200 pb-4">
          <button
            onClick={() => setAddressOpen(!addressOpen)}
            className="w-full flex items-center justify-between text-left font-bold text-slate-900 py-1 text-xs"
          >
            <span>Details</span>
            <i className={`fa-solid fa-chevron-up text-[10px] text-slate-400 transition-transform ${addressOpen ? "" : "rotate-180"}`}></i>
          </button>
          <div className={`${addressOpen ? "open" : ""} space-y-2 pt-2 text-xs`} style={{ display: addressOpen ? "block" : "none" }}>
            <div>
              <p className="text-slate-400 font-medium">Role</p>
              <p className="text-slate-800 font-semibold mt-0.5 capitalize">
                {userRole === "student" ? "Institution" : "Student"}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Conversation ID</p>
              <p className="text-slate-800 font-semibold mt-0.5">#{conversation.id}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Messages</p>
              <p className="text-slate-800 font-semibold mt-0.5">
                {conversation.unread_count > 0 ? `${conversation.unread_count} unread` : "All read"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
