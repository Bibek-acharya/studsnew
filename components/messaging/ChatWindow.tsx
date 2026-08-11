"use client";

import React, { useEffect, useState, useRef } from "react";
import { Info } from "lucide-react";
import { messageApi, Message, Conversation } from "@/services/message.api";
import { collegeApi } from "@/services/college.api";
import { dashboardApi } from "@/services/dashboard.api";
import { getImageUrl } from "@/services/api";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

interface ChatWindowProps {
  conversation: Conversation;
  userRole: "student" | "institution";
  userId: number;
  onToggleContactInfo?: () => void;
  showContactInfo?: boolean;
}

export default function ChatWindow({ conversation, userRole, userId, onToggleContactInfo, showContactInfo }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Array<{ user_type: string; user_id: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [otherAvatarUrl, setOtherAvatarUrl] = useState<string>("");
  const [ownAvatarUrl, setOwnAvatarUrl] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tokenKey = userRole === "student" ? "token" : "institutionToken";
    const userKey = userRole === "student" ? "studsphere_user" : "institutionUser";
    const token = localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey);
    const userData = localStorage.getItem(userKey) || sessionStorage.getItem(userKey);
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const imgUrl = parsed.image_url || parsed.logo_url || "";
        if (imgUrl) setOwnAvatarUrl(getImageUrl(imgUrl.startsWith("/") ? imgUrl : `/${imgUrl}`));
      } catch {}
    }

    async function fetchOtherAvatar() {
      try {
        if (userRole === "student" && conversation.institution_id) {
          const resp = await collegeApi.getPublicInstitutionById(conversation.institution_id);
          const data = resp?.data || resp;
          if (data?.logo_url) setOtherAvatarUrl(getImageUrl(data.logo_url.startsWith("/") ? data.logo_url : `/${data.logo_url}`));
        } else if (userRole === "institution" && conversation.student_id) {
          if (token) {
            const resp = await dashboardApi.getStudentProfile(conversation.student_id);
            const data = resp?.data || resp;
            if (data?.image_url) setOtherAvatarUrl(getImageUrl(data.image_url.startsWith("/") ? data.image_url : `/${data.image_url}`));
          }
        }
      } catch {}
    }
    fetchOtherAvatar();
  }, [userRole, conversation.institution_id, conversation.student_id]);

  useEffect(() => {
    loadMessages();
    const cleanup = setupWebSocketListeners();
    markAsRead();

    const pollInterval = setInterval(async () => {
      try {
        const latestMsgs = await messageApi.getMessages(conversation.id, 1, 0);
        if (!latestMsgs || latestMsgs.length === 0) return;
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMsgs = latestMsgs.filter((m) => !existingIds.has(m.id));
          if (newMsgs.length === 0) return prev;
          return [...prev, ...newMsgs].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
      } catch {}
    }, 5000);

    return () => {
      cleanup();
      clearInterval(pollInterval);
    };
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await messageApi.getMessages(conversation.id, 50, 0);
      setMessages(data);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocketListeners = () => {
    const unsubCreated = messageApi.on("message.created", (data) => {
      if (data.conversation_id === conversation.id) {
        const incoming = data.message;
        setMessages((prev) => {
          const exists = prev.some((m) => m.client_message_id === incoming.client_message_id);
          if (exists) {
            return prev.map((m) =>
              m.client_message_id === incoming.client_message_id ? { ...incoming, status: "sent" } : m
            );
          }
          return [...prev, { ...incoming, status: "delivered" }];
        });
      }
    });

    const unsubRead = messageApi.on("message.read", (data) => {
      if (data.conversation_id === conversation.id) {
        setMessages((prev) =>
          prev.map((m) => (m.sender_id === userId ? { ...m, status: "read" } : m))
        );
      }
    });

    const unsubTypingStart = messageApi.on("typing.start", (data) => {
      if (data.conversation_id === conversation.id) {
        setTypingUsers((prev) => [
          ...prev.filter((u) => !(u.user_type === data.user_type && u.user_id === data.user_id)),
          { user_type: data.user_type, user_id: data.user_id },
        ]);
      }
    });

    const unsubTypingStop = messageApi.on("typing.stop", (data) => {
      if (data.conversation_id === conversation.id) {
        setTypingUsers((prev) =>
          prev.filter((u) => !(u.user_type === data.user_type && u.user_id === data.user_id))
        );
      }
    });

    return () => {
      unsubCreated();
      unsubRead();
      unsubTypingStart();
      unsubTypingStop();
    };
  };

  const markAsRead = async () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      await messageApi.markAsRead(conversation.id, lastMessage.id);
      messageApi.sendReadReceipt(conversation.id, lastMessage.id);
    }
  };

  const handleSend = async (content: string, attachmentIds: number[]) => {
    const clientMessageId = crypto.randomUUID();

    const tempMessage: Message = {
      id: Date.now(),
      conversation_id: conversation.id,
      sender_type: userRole,
      sender_id: userId,
      sender_name: "You",
      client_message_id: clientMessageId,
      content,
      created_at: new Date().toISOString(),
      edited_at: null,
      deleted_at: null,
      read_at: null,
      status: "sending",
      attachments: [],
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const sentMessage = await messageApi.sendMessage(conversation.id, {
        content,
        client_message_id: clientMessageId,
        attachment_ids: attachmentIds,
      });

      setMessages((prev) =>
        prev.map((m) => (m.client_message_id === clientMessageId ? { ...sentMessage, status: "sent" } : m))
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) => (m.client_message_id === clientMessageId ? { ...m, status: "sending" } : m))
      );
      console.error("Failed to send message:", error);
    }
  };

  const handleUpload = async (file: File): Promise<number> => {
    const response = await messageApi.uploadFile(file);
    return response.upload_id;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEdit = async (message: Message, newContent: string) => {
    await messageApi.editMessage(conversation.id, message.id, newContent);
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, content: newContent, edited_at: new Date().toISOString() } : m))
    );
  };

  const handleDelete = async (message: Message) => {
    await messageApi.deleteMessage(conversation.id, message.id);
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, deleted_at: new Date().toISOString() } : m))
    );
  };

  const contactName = userRole === "student" ? conversation.institution_name : conversation.student_name;
  const contactInitials = (contactName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const otherInitials = contactInitials;

  return (
    <main className="flex-1 bg-white flex-col min-w-0 relative flex">
      <header className="h-[72px] flex-shrink-0 border-b border-slate-200 px-6 flex items-center justify-between bg-white z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
            {contactInitials}
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {contactName || "Unknown"}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {userRole === "student" ? "Institution" : "Student"}
            </p>
          </div>
        </div>

        {onToggleContactInfo && (
          <button
            onClick={onToggleContactInfo}
            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
              showContactInfo
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-slate-300 text-slate-400 hover:text-slate-600 hover:border-slate-400"
            }`}
            title="Info"
          >
            <Info className="w-4 h-4" />
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50" id="chatMessagesContainer">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
            <i className="fa-regular fa-comments text-3xl mb-2 text-slate-200"></i>
            No messages yet
          </div>
        ) : (
          <>
            <div className="flex justify-center my-2">
              <span className="bg-slate-200 text-slate-600 text-[10px] px-3 py-0.5 rounded-sm font-medium">
                {(() => {
                  const first = messages[0];
                  if (!first) return "";
                  const d = new Date(first.created_at);
                  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                })()}
              </span>
            </div>
            {messages.map((message) => (
               <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_type === userRole && message.sender_id === userId}
                otherInitials={otherInitials}
                otherAvatarUrl={otherAvatarUrl}
                ownAvatarUrl={ownAvatarUrl}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <TypingIndicator typingUsers={typingUsers} currentUserId={userId} />

      <MessageInput
        onSend={handleSend}
        onTypingStart={() => messageApi.sendTypingStart(conversation.id)}
        onTypingStop={() => messageApi.sendTypingStop(conversation.id)}
        onUpload={handleUpload}
      />
    </main>
  );
}
