"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Send,
  Trash,
  X,
  Plus,
  MessageSquare,
} from "lucide-react";

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
    id: 1,
    name: "Sita Kumari",
    initials: "SK",
    lastMessage: "Regarding scholarship application",
    time: "2m",
    online: true,
    status: "new",
    color: "bg-purple-500",
    messages: [
      {
        id: 1,
        sender: "SK",
        initials: "SK",
        text: "Hello, I am writing regarding my scholarship application.",
        time: "10:30 AM",
        isIncoming: true,
      },
      {
        id: 2,
        sender: "Me",
        initials: "AU",
        text: "Dear Sita, Thank you for your inquiry. Let me check your application status.",
        time: "10:32 AM",
        isIncoming: false,
      },
      {
        id: 3,
        sender: "SK",
        initials: "SK",
        text: "I submitted my application for the Need Based Scholarship 2026. I wanted to know when the results will be published?",
        time: "10:35 AM",
        isIncoming: true,
      },
      {
        id: 4,
        sender: "Me",
        initials: "AU",
        text: "The results for Need Based Scholarship 2026 will be published by April 30, 2026. You will receive an email notification once the results are out.",
        time: "10:38 AM",
        isIncoming: false,
      },
      {
        id: 5,
        sender: "SK",
        initials: "SK",
        text: "Thank you so much for the information. Also, I wanted to ask if I need to submit any additional documents?",
        time: "10:40 AM",
        isIncoming: true,
      },
      {
        id: 6,
        sender: "Me",
        initials: "AU",
        text: "Your application is complete. All required documents have been received. If we need any additional information, we will contact you via email or phone.",
        time: "10:42 AM",
        isIncoming: false,
      },
      {
        id: 7,
        sender: "SK",
        initials: "SK",
        text: "Perfect! One more question - if selected, when will the scholarship amount be disbursed?",
        time: "10:45 AM",
        isIncoming: true,
      },
    ],
  },
  {
    id: 2,
    name: "Ramesh Magar",
    initials: "RM",
    lastMessage: "Thank you for the opportunity",
    time: "1h",
    online: true,
    status: "unread",
    color: "bg-green-500",
    messages: [
      {
        id: 1,
        sender: "RM",
        initials: "RM",
        text: "Thank you for the opportunity",
        time: "9:00 AM",
        isIncoming: true,
      },
    ],
  },
  {
    id: 3,
    name: "Priya Thapa",
    initials: "PT",
    lastMessage: "Submitted all documents",
    time: "3h",
    online: false,
    status: "read",
    color: "bg-orange-500",
    messages: [
      {
        id: 1,
        sender: "PT",
        initials: "PT",
        text: "Submitted all documents",
        time: "7:00 AM",
        isIncoming: true,
      },
    ],
  },
  {
    id: 4,
    name: "Deepak Bhatt",
    initials: "DB",
    lastMessage: "Question about payment deadline",
    time: "5h",
    online: true,
    status: "unread",
    color: "bg-blue-500",
    messages: [
      {
        id: 1,
        sender: "DB",
        initials: "DB",
        text: "Question about payment deadline",
        time: "5:00 AM",
        isIncoming: true,
      },
    ],
  },
  {
    id: 5,
    name: "Anita KC",
    initials: "AK",
    lastMessage: "Request for extension",
    time: "1d",
    online: false,
    status: "read",
    color: "bg-pink-500",
    messages: [],
  },
  {
    id: 6,
    name: "Sujan Rai",
    initials: "SR",
    lastMessage: "Confirmation of interview date",
    time: "2d",
    online: true,
    status: "read",
    color: "bg-indigo-500",
    messages: [],
  },
];

const Messages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [search, setSearch] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const filteredChats = useMemo(() => {
    return MOCK_CHATS.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

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
    setSelectedChat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newMsg] } : null
    );
    setMessageInput("");
  }, [messageInput, selectedChat]);

  const clearChat = useCallback(() => {
    setSelectedChat(null);
  }, []);

  const filterConversations = useCallback((value: string) => {
    setSearch(value);
  }, []);

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] overflow-hidden">
      {/* Chat List Sidebar */}
      <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              id="msg-search-input"
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500"
              placeholder="Search..."
              onChange={(e) => filterConversations(e.target.value)}
            />
          </div>
        </div>
        <div id="msg-conversation-list" className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-2 ${
                selectedChat?.id === chat.id
                  ? "bg-blue-50 border-l-2 border-blue-500"
                  : "border-transparent"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-full ${chat.color} flex items-center justify-center text-white text-sm font-bold relative shrink-0`}
                >
                  {chat.initials}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      chat.online ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{chat.name}</p>
                    <span
                      className={`text-xs ${
                        chat.status !== "read" ? "text-blue-600 font-medium" : "text-gray-400"
                      }`}
                    >
                      {chat.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                  {chat.status !== "read" && (
                    <span
                      className={`inline-flex items-center mt-1 text-xs font-semibold px-2 py-0.5 rounded ${
                        chat.status === "new"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {chat.status === "new" ? "New" : "Unread"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-gray-100">
          <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> New Message
          </button>
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {selectedChat ? (
          <>
            <div
              id="chat-header"
              className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full ${selectedChat.color} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {selectedChat.initials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {selectedChat.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedChat.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500"
                title="Clear chat"
              >
                <Trash className="text-lg" />
              </button>
            </div>

            <div
              ref={messagesContainerRef}
              id="chat-messages"
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              <div className="flex items-center justify-center">
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  Today
                </span>
              </div>
              {selectedChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.isIncoming ? "" : "justify-end"
                  }`}
                >
                  {msg.isIncoming && (
                    <div
                      className={`w-8 h-8 rounded-full ${selectedChat.color} flex items-center justify-center text-white text-xs shrink-0`}
                    >
                      {msg.initials}
                    </div>
                  )}
                  <div
                    className={`${
                      msg.isIncoming
                        ? "bg-gray-100 rounded-2xl rounded-tl-none"
                        : "bg-blue-600 text-white rounded-2xl rounded-tr-none"
                    } p-3 max-w-md`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        msg.isIncoming ? "text-gray-400" : "text-blue-100"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div
              id="chat-typing"
              className="px-4 pb-1 flex justify-start hidden"
            >
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex items-end gap-3 flex-shrink-0 bg-white">
              <textarea
                id="chat-input"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 resize-none"
                rows={1}
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center flex-shrink-0"
              >
                <Send className="text-lg" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;