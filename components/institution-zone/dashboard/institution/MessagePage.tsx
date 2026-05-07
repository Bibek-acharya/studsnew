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

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Emily Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Thank you for the information!",
    time: "2 min ago",
    online: true,
    tag: "Admission",
    tagColor: "bg-blue-50 text-blue-600",
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
    studentName: "Emily Johnson",
    contactNumber: "+1 (555) 123-4567",
    email: "emily.johnson@email.com",
    enquiries: ["B.Tech Application", "Fee Structure", "Hostel Facility"],
    messages: [
      { id: 1, text: "Hello! I'm interested in the B.Tech Computer Science program.", sender: "them", time: "10:15 AM" },
      { id: 2, text: "Hi Emily! Great choice. The program is a 4-year course with excellent placement records.", sender: "me", time: "10:17 AM" },
      { id: 3, text: "What are the eligibility criteria and fee structure?", sender: "them", time: "10:19 AM" },
      { id: 4, text: "Eligibility is 60%+ in 12th with PCM. The annual fee is $12,000. We also offer scholarships.", sender: "me", time: "10:22 AM" },
      { id: 5, text: "That sounds good! Do you have hostel facilities?", sender: "them", time: "10:25 AM" },
      { id: 6, text: "Yes, we have separate hostels for boys and girls with modern amenities. Would you like to schedule a campus visit?", sender: "me", time: "10:28 AM" },
      { id: 7, text: "Yes, please. Thank you for the information!", sender: "them", time: "10:30 AM" },
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "When is the entrance exam?",
    time: "1 hour ago",
    online: false,
    tag: "Inquiry",
    tagColor: "bg-amber-50 text-amber-600",
    status: "Resolved",
    statusColor: "bg-gray-100 text-gray-600",
    studentName: "Michael Chen",
    contactNumber: "+1 (555) 987-6543",
    email: "michael.chen@email.com",
    enquiries: ["BBA Program", "Entrance Exam", "Application Deadline"],
    messages: [
      { id: 1, text: "Hi, I want to know about the BBA program.", sender: "them", time: "Yesterday, 2:30 PM" },
      { id: 2, text: "Hello Michael! The BBA is a 3-year program covering management, marketing, and finance.", sender: "me", time: "Yesterday, 2:32 PM" },
      { id: 3, text: "What's the admission process?", sender: "them", time: "Yesterday, 2:35 PM" },
      { id: 4, text: "You need to fill the online application form and appear for our entrance test.", sender: "me", time: "Yesterday, 2:38 PM" },
      { id: 5, text: "When is the entrance exam?", sender: "them", time: "Yesterday, 2:40 PM" },
    ],
  },
  {
    id: 3,
    name: "Sarah Williams",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "I've submitted the documents.",
    time: "3 hours ago",
    online: true,
    tag: "Counselling",
    tagColor: "bg-purple-50 text-purple-600",
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
    studentName: "Sarah Williams",
    contactNumber: "+1 (555) 456-7890",
    email: "sarah.williams@email.com",
    enquiries: ["M.Sc Physics", "Lab Facilities", "Research Programs"],
    messages: [
      { id: 1, text: "Can you tell me about the M.Sc Physics program?", sender: "them", time: "Yesterday, 4:00 PM" },
      { id: 2, text: "Hi Sarah! It's a 2-year program with specializations in Nuclear Physics and Electronics.", sender: "me", time: "Yesterday, 4:05 PM" },
      { id: 3, text: "What about research opportunities?", sender: "them", time: "Yesterday, 4:10 PM" },
      { id: 4, text: "We have active research groups in Quantum Mechanics and Material Science with well-equipped labs.", sender: "me", time: "Yesterday, 4:12 PM" },
      { id: 5, text: "Perfect. I've submitted the documents.", sender: "them", time: "Yesterday, 4:15 PM" },
    ],
  },
];

const MessagePage: React.FC = () => {
  const [activeId, setActiveId] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeId)!;
  const [convoMessages, setConvoMessages] = useState<Message[]>(activeConversation.messages);

  useEffect(() => {
    setConvoMessages(activeConversation.messages);
    setNewMessage("");
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convoMessages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now(),
      text: newMessage.trim(),
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setConvoMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Messages"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "Messages" },
        ]}
      />

      <div className="flex gap-0 rounded-xl border border-gray-100 shadow-sm overflow-hidden bg-white h-[calc(100vh-220px)] min-h-[600px]">
        {/* Left Panel - Conversation List */}
        <div className="w-80 shrink-0 border-r border-gray-100 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={`flex items-start gap-3 p-4 cursor-pointer border-b border-gray-100 transition-colors ${
                  activeId === conv.id
                    ? "bg-blue-50 border-l-2 border-l-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-sm font-semibold text-gray-800 truncate">
                      {conv.name}
                    </h4>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">
                      {conv.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mb-1.5">
                    {conv.lastMessage}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${conv.tagColor}`}>
                      {conv.tag}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${conv.statusColor}`}>
                      {conv.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel - Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeConversation.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                {activeConversation.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {activeConversation.name}
                </h3>
                <p className="text-xs text-green-600 font-medium">
                  {activeConversation.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                showInfo
                  ? "bg-blue-50 text-blue-600"
                  : "border border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Info />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50/50">
            {convoMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] ${msg.sender === "me" ? "items-end" : "items-start"}`}>
                  <div
                    className={
                      msg.sender === "me"
                        ? "bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-2.5"
                        : "bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2.5"
                    }
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 px-1">
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="px-6 py-4 border-t border-gray-100 bg-white">
            <div className="flex items-end gap-3">
              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 shrink-0">
                <Paperclip />
              </button>
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none resize-none max-h-32"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <PaperPlaneRight />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Contact Info */}
        {showInfo && (
          <div className="w-72 shrink-0 border-l border-gray-100 flex flex-col bg-white">
            <div className="flex flex-col items-center p-6 border-b border-gray-100">
              <div className="relative mb-3">
                <img
                  src={activeConversation.avatar}
                  alt=""
                  className="w-20 h-20 rounded-full"
                />
                {activeConversation.online && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <h3 className="text-base font-semibold text-gray-800">
                {activeConversation.name}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">Student</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2.5 mb-2">
                  <User className="text-gray-500 text-sm" />
                  <span className="text-xs font-medium text-gray-500">Student Name</span>
                </div>
                <p className="text-sm font-medium text-gray-800 pl-6">
                  {activeConversation.studentName}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2.5 mb-2">
                  <Phone className="text-gray-500 text-sm" />
                  <span className="text-xs font-medium text-gray-500">Contact Number</span>
                </div>
                <p className="text-sm font-medium text-gray-800 pl-6">
                  {activeConversation.contactNumber}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2.5 mb-2">
                  <Envelope className="text-gray-500 text-sm" />
                  <span className="text-xs font-medium text-gray-500">Email</span>
                </div>
                <p className="text-sm font-medium text-gray-800 pl-6 truncate">
                  {activeConversation.email}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2.5 mb-2">
                  <Question className="text-gray-500 text-sm" />
                  <span className="text-xs font-medium text-gray-500">Enquiries</span>
                </div>
                <div className="pl-6 space-y-1">
                  {activeConversation.enquiries.map((enq, i) => (
                    <p key={i} className="text-sm text-gray-700">
                      · {enq}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
