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
}

export default function ChatWindow({ conversation, userRole, userId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Array<{ user_type: string; user_id: number }>>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const cleanup = setupWebSocketListeners();
    markAsRead();
    return cleanup;
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
        setMessages((prev) => [...prev, data.message]);
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
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
