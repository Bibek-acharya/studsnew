"use client";

import React, { useState, useCallback, useMemo, memo, useRef, useEffect } from "react";
import { MessageSquare, Search, Paperclip, Smile, Send, ChevronLeft } from "lucide-react";

interface ChatMessage {
  id: number;
  sender: string;
  initials: string;
  text: string;
  time: string;
  isIncoming: boolean;
}

interface Chat {
  id: number;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  online: boolean;
  status: "new" | "unread" | "read";
  color: string;
  messages: ChatMessage[];
}

const MOCK_CHATS: Chat[] = [
  {
    id: 1, name: "Sita Kumari", initials: "SK", lastMessage: "Regarding scholarship application", time: "2m", online: true, status: "new", color: "from-purple-400 to-purple-600",
    messages: [
      { id: 1, sender: "SK", initials: "SK", text: "Hello, I am writing regarding my scholarship application.", time: "10:30 AM", isIncoming: true },
      { id: 2, sender: "Me", initials: "AU", text: "Dear Sita, Thank you for your inquiry. Let me check your application status.", time: "10:32 AM", isIncoming: false },
      { id: 3, sender: "SK", initials: "SK", text: "I submitted my application for the Need Based Scholarship 2026. I wanted to know when the results will be published?", time: "10:35 AM", isIncoming: true },
      { id: 4, sender: "Me", initials: "AU", text: "The results for Need Based Scholarship 2026 will be published by April 30, 2026. You will receive an email notification once the results are out.", time: "10:38 AM", isIncoming: false },
      { id: 5, sender: "SK", initials: "SK", text: "Thank you so much for the information. Also, I wanted to ask if I need to submit any additional documents?", time: "10:40 AM", isIncoming: true },
      { id: 6, sender: "Me", initials: "AU", text: "Your application is complete. All required documents have been received. If we need any additional information, we will contact you via email or phone.", time: "10:42 AM", isIncoming: false },
      { id: 7, sender: "SK", initials: "SK", text: "Perfect! One more question - if selected, when will the scholarship amount be disbursed?", time: "10:45 AM", isIncoming: true },
    ],
  },
  {
    id: 2, name: "Ramesh Magar", initials: "RM", lastMessage: "Thank you for the opportunity", time: "1h", online: true, status: "unread", color: "from-green-400 to-green-600",
    messages: [{ id: 1, sender: "RM", initials: "RM", text: "Thank you for the opportunity", time: "9:00 AM", isIncoming: true }],
  },
  {
    id: 3, name: "Priya Thapa", initials: "PT", lastMessage: "Submitted all documents", time: "3h", online: false, status: "read", color: "from-orange-400 to-orange-600",
    messages: [{ id: 1, sender: "PT", initials: "PT", text: "Submitted all documents", time: "7:00 AM", isIncoming: true }],
  },
  {
    id: 4, name: "Deepak Bhatt", initials: "DB", lastMessage: "Question about payment deadline", time: "5h", online: true, status: "unread", color: "from-blue-400 to-blue-600",
    messages: [{ id: 1, sender: "DB", initials: "DB", text: "Question about payment deadline", time: "5:00 AM", isIncoming: true }],
  },
  {
    id: 5, name: "Anita KC", initials: "AK", lastMessage: "Request for extension", time: "1d", online: false, status: "read", color: "from-pink-400 to-pink-600",
    messages: [],
  },
  {
    id: 6, name: "Sujan Rai", initials: "SR", lastMessage: "Confirmation of interview date", time: "2d", online: true, status: "read", color: "from-indigo-400 to-indigo-600",
    messages: [],
  },
];

const Messages: React.FC = memo(() => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "new">("all");
  const [search, setSearch] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const filteredChats = useMemo(() => {
    return MOCK_CHATS.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || c.status === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [selectedChat?.id, selectedChat?.messages.length]);

  const handleSend = useCallback(() => {
    if (!messageInput.trim() || !selectedChat) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: "Me",
      initials: "AU",
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isIncoming: false,
    };
    setSelectedChat((prev) => prev ? { ...prev, messages: [...prev.messages, newMsg] } : null);
    setMessageInput("");
  }, [messageInput, selectedChat]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)] overflow-hidden">
      {/* Chat List */}
      <div className="lg:col-span-1 border border-slate-200 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900">Messages</h3>
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{MOCK_CHATS.filter((c) => c.status !== "read").length}</span>
          </div>
          <div className="flex gap-2 mb-3">
            {(["all", "unread", "new"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${filter === f ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2 focus-within:border-blue-500">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search messages..." className="bg-transparent border-none outline-none text-sm ml-2 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="divide-y divide-slate-100 overflow-y-auto overscroll-contain flex-1">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 hover:bg-blue-50 cursor-pointer transition-colors ${selectedChat?.id === chat.id ? "bg-blue-50 border-l-2 border-blue-500" : "border-l-2 border-transparent"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${chat.color} flex items-center justify-center text-white font-semibold text-sm relative`}>
                  {chat.initials}
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${chat.online ? "bg-green-500" : "bg-slate-400"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-slate-900">{chat.name}</p>
                    <span className={`text-xs ${chat.status !== "read" ? "text-blue-600 font-medium" : "text-slate-400"}`}>{chat.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                  {chat.status !== "read" && (
                    <span className={`inline-flex items-center mt-1 text-xs font-semibold px-2 py-0.5 rounded ${chat.status === "new" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                      {chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat View */}
      <div className="lg:col-span-2 border border-slate-200 rounded-xl overflow-hidden flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3 flex-shrink-0">
              <button onClick={() => setSelectedChat(null)} className="lg:hidden p-1 hover:bg-slate-200 rounded"><ChevronLeft className="w-5 h-5" /></button>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedChat.color} flex items-center justify-center text-white font-semibold text-sm`}>
                {selectedChat.initials}
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">{selectedChat.name}</p>
                <p className="text-xs text-slate-500">{selectedChat.online ? "Online" : "Offline"}</p>
              </div>
            </div>

            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 bg-white min-h-0">
              <div className="flex items-center justify-center">
                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Today</span>
              </div>
              {selectedChat.messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.isIncoming ? "" : "justify-end"}`}>
                  {msg.isIncoming && (
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${selectedChat.color} flex items-center justify-center text-white text-xs shrink-0`}>
                      {msg.initials}
                    </div>
                  )}
                  <div className={`${msg.isIncoming ? "bg-slate-100 rounded-2xl rounded-tl-none" : "bg-blue-600 text-white rounded-2xl rounded-tr-none"} p-3 max-w-md`}>
                    <p className="text-sm">{msg.text}</p>
                    <span className={`text-xs mt-1 block ${msg.isIncoming ? "text-slate-400" : "text-blue-100"}`}>{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-slate-200 rounded-lg transition"><Paperclip className="w-4 h-4 text-slate-600" /></button>
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button className="p-2 hover:bg-slate-200 rounded-lg transition"><Smile className="w-4 h-4 text-slate-600" /></button>
                <button onClick={handleSend} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

Messages.displayName = "Messages";

export default Messages;
