"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  MagnifyingGlass,
  Chats,
  PaperPlaneRight,
  Paperclip,
  Info,
  Phone,
  Envelope,
  User,
  Question,
} from "@phosphor-icons/react";
import SectionHeader from "../shared/SectionHeader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Message {
  id: number;
  text: string;
  sender: "them" | "me";
  time: string;
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  online: boolean;
  tag: string;
  tagColor: string;
  status: string;
  statusColor: string;
  messages: Message[];
  studentName: string;
  contactNumber: string;
  email: string;
  enquiries: string[];
}

const tagColors = [
  "bg-blue-50 text-blue-600",
  "bg-amber-50 text-amber-600",
  "bg-green-50 text-green-600",
  "bg-purple-50 text-purple-600",
  "bg-pink-50 text-pink-600",
];

const MessagePage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("institutionToken");
    if (!token) { setLoading(false); return; }

    fetch(`${API_BASE_URL}/api/v1/institution/messages/students`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        const contacts = data?.data || [];
        const convs: Conversation[] = contacts.map((c: any, i: number) => ({
          id: c.user_id || i,
          name: c.name || `User #${c.user_id}`,
          avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
          lastMessage: c.last_message || "",
          time: "",
          online: false,
          tag: "Inquiry",
          tagColor: tagColors[i % tagColors.length],
          status: c.unread > 0 ? "New" : "Read",
          statusColor: c.unread > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600",
          messages: [],
          studentName: c.name || "",
          contactNumber: "",
          email: "",
          enquiries: [],
        }));
        setConversations(convs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadMessages = async (conv: Conversation) => {
    const token = localStorage.getItem("institutionToken");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/institution/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const msgs: Message[] = (data?.data?.messages || []).map((m: any) => ({
        id: m.id,
        text: m.content,
        sender: m.direction === "outgoing" ? "me" : "them",
        time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }));
      setActiveConv({ ...conv, messages: msgs });
    } catch { setActiveConv({ ...conv, messages: [] }); }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConv?.messages]);

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConv(conv);
    loadMessages(conv);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConv) return;
    const token = localStorage.getItem("institutionToken");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/institution/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id: activeConv.id, subject: activeConv.name, content: messageInput.trim() }),
      });
      const data = await res.json();
      const sent = data?.data;
      const newMsg: Message = {
        id: sent?.id || Date.now(),
        text: messageInput.trim(),
        sender: "me",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setActiveConv({ ...activeConv, messages: [...activeConv.messages, newMsg] });
      setConversations(prev =>
        prev.map(c => c.id === activeConv.id ? { ...c, lastMessage: messageInput.trim(), time: "Just now" } : c)
      );
      setMessageInput("");
    } catch { /* skip */ }
  };

  const filtered = conversations.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full">
      <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
        <div className="mb-4">
          <SectionHeader
            title="Messages"
            breadcrumbItems={[
              { label: "Dashboard", href: "/institution-zone/dashboard" },
              { label: "Messages" },
            ]}
          />
        </div>

        <div className="flex-1 flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-0">
          {/* Left panel */}
          <div className="w-full sm:w-80 lg:w-96 border-r border-gray-200 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none bg-gray-50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  <p className="text-sm">Loading conversations...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Chats className="w-12 h-12 mb-3 opacity-40" />
                  <p className="text-sm">{search ? "No conversations found." : "No conversations yet."}</p>
                </div>
              ) : (
                filtered.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                      activeConv?.id === conv.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img src={conv.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      {conv.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-semibold text-gray-900 truncate">{conv.name}</span>
                        <span className="text-[11px] text-gray-400 flex-shrink-0">{conv.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{conv.lastMessage || "No messages yet"}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 flex flex-col min-w-0">
            {activeConv ? (
              <>
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={activeConv.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      {activeConv.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{activeConv.name}</h3>
                      <p className="text-xs text-gray-500">
                        {activeConv.online ? "Online" : activeConv.tag}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400" title="Call">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400" title="Email">
                      <Envelope className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400" title="Info">
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {activeConv.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <p className="text-sm">No messages in this conversation.</p>
                    </div>
                  ) : (
                    activeConv.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                            msg.sender === "me"
                              ? "bg-blue-600 text-white rounded-br-md"
                              : "bg-gray-100 text-gray-800 rounded-bl-md"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className={`text-[10px] mt-1 ${msg.sender === "me" ? "text-blue-200" : "text-gray-400"}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <PaperPlaneRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <Chats className="w-20 h-20 mb-4 opacity-30" />
                <p className="text-lg font-medium text-gray-600">Select a conversation</p>
                <p className="text-sm mt-1">Choose a conversation from the left panel to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
