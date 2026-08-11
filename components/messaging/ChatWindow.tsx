"use client";

import React, { useEffect, useState, useRef } from "react";
import { messageApi, Message, Conversation } from "@/services/message.api";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

interface ChatWindowProps {
  conversation: Conversation;
  userRole: "student" | "institution";
  userId: number;
  onToggleContactInfo?: () => void;
}

export default function ChatWindow({ conversation, userRole, userId, onToggleContactInfo }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Array<{ user_type: string; user_id: number }>>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleEdit = async (message: Message) => {
    const newContent = prompt("Edit message:", message.content);
    if (newContent && newContent !== message.content) {
      await messageApi.editMessage(conversation.id, message.id, newContent);
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, content: newContent, edited_at: new Date().toISOString() } : m))
      );
    }
  };

  const handleDelete = async (message: Message) => {
    if (confirm("Delete this message?")) {
      await messageApi.deleteMessage(conversation.id, message.id);
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, deleted_at: new Date().toISOString() } : m))
      );
    }
  };

  const contactName = userRole === "student" ? conversation.institution_name : conversation.student_name;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="h-[60px] px-4 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
            {(contactName || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{contactName || "Unknown"}</h2>
            <p className="text-xs text-gray-500">{userRole === "student" ? "Institution" : "Student"}</p>
          </div>
        </div>
        {onToggleContactInfo && (
          <button
            onClick={onToggleContactInfo}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Contact Info"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {loading ? (
          <div className="text-center text-gray-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400">No messages yet</div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender_type === userRole && message.sender_id === userId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
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
    </div>
  );
}
