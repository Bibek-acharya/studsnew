"use client";

import React, { useState, useRef } from "react";
import { Conversation } from "@/services/message.api";
import ConversationItem from "./ConversationItem";

interface ConversationListProps {
  userRole: "student" | "institution";
  selectedId: number | null;
  onSelect: (conversation: Conversation) => void;
  conversations: Conversation[];
}

export default function ConversationList({ userRole, selectedId, onSelect, conversations }: ConversationListProps) {
  const [search, setSearch] = useState("");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sort, setSort] = useState<"newest" | "oldest" | "unread">("newest");
  const sortMenuRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setSortMenuOpen(false);
      }
    }
    if (sortMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortMenuOpen]);

  const filtered = conversations.filter((c) => {
    const name = (userRole === "student" ? c.institution_name : c.student_name) || "";
    const preview = c.last_message_preview || "";
    const q = search.toLowerCase();
    return name.toLowerCase().includes(q) || preview.toLowerCase().includes(q);
  });

  let sorted = [...filtered];
  if (sort === "oldest") {
    sorted.reverse();
  } else if (sort === "unread") {
    sorted.sort((a, b) => b.unread_count - a.unread_count);
  }

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);
  const sortLabel = { newest: "Newest", oldest: "Oldest", unread: "Unread" }[sort];

  return (
    <aside className="w-full md:w-80 lg:w-[340px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col z-10 transition-all duration-300">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Messages</h1>
          {totalUnread > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              {totalUnread}
            </span>
          )}
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
          </div>
          <input
            type="text"
            placeholder="Search message"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all text-slate-700 placeholder-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="relative" ref={sortMenuRef}>
            <button
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
              className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <i className="fa-solid fa-arrow-down-up-across-line text-[10px]"></i>
              <span>{sortLabel}</span>
              <i className="fa-solid fa-chevron-down text-[10px] ml-1"></i>
            </button>
            {sortMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-md shadow-md py-1 z-50">
                {(["newest", "oldest", "unread"] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => { setSort(option); setSortMenuOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${sort === option ? "text-blue-600 bg-blue-50" : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"}`}
                  >
                    {{ newest: "Newest", oldest: "Oldest", unread: "Unread" }[option]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sorted.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            <i className="fa-regular fa-comment-slash text-xl mb-2 block"></i>
            <p>{search ? "No conversations found" : "No conversations yet"}</p>
          </div>
        ) : (
          sorted.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={conversation.id === selectedId}
              onClick={() => onSelect(conversation)}
              userRole={userRole}
            />
          ))
        )}
      </div>
    </aside>
  );
}
