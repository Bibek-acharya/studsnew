"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Send,
  EllipsisVertical,
  Plus,
  MessageSquare,
  Paperclip,
  X,
  Image,
} from "lucide-react";
import { toast } from "sonner";
import { scholarshipProviderApi, ProviderMessage } from "@/services/scholarshipProviderApi";

interface Conversation {
  userId: number;
  userName: string;
  userEmail: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  color: string;
  messages: ProviderMessage[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const COLORS = [
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-blue-500",
  "bg-pink-500",
  "bg-indigo-500",
];

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString();
}

function formatLastMessage(content: string): string {
  const lines = content.split("\n").filter(Boolean);
  const parts: string[] = [];
  for (const line of lines) {
    const imgMatch = line.match(/^!\[image\]\((.+)\)$/);
    if (imgMatch) {
      const name = decodeURIComponent(imgMatch[1].split("/").pop() || "");
      parts.push(name);
      continue;
    }
    const fileMatch = line.match(/^\[File\]\((.+)\)$/);
    if (fileMatch) {
      const name = decodeURIComponent(fileMatch[1].split("/").pop() || "");
      parts.push(name);
      continue;
    }
    parts.push(line);
  }
  return parts.join(" · ") || content;
}

function formatMessageTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const Messages: React.FC<{ onUnreadChange?: (count: number) => void }> = ({ onUnreadChange }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [search, setSearch] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedPreview, setAttachedPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showSenderInfo, setShowSenderInfo] = useState(false);
  const [userInfo, setUserInfo] = useState<{ id: number; first_name: string; last_name: string; email: string; phone: string; gender: string; address: string; bio: string; role: string } | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await scholarshipProviderApi.getMessages(1, 100);
        const byUser: Record<number, ProviderMessage[]> = {};
        for (const msg of res.messages) {
          if (!byUser[msg.user_id]) byUser[msg.user_id] = [];
          byUser[msg.user_id].push(msg);
        }

        const convs: Conversation[] = Object.entries(byUser).map(([uid, msgs], i) => {
          const sorted = msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          const last = sorted[sorted.length - 1];
          const name = last.user_name || `User #${uid}`;
          return {
            userId: Number(uid),
            userName: name,
            userEmail: last.user_email,
            initials: getInitials(name),
            lastMessage: last.content,
            time: formatTime(last.created_at),
            unread: sorted.some((m) => !m.read && m.direction === "incoming"),
            color: COLORS[i % COLORS.length],
            messages: sorted,
          };
        });

        convs.sort((a, b) => new Date(b.messages[b.messages.length - 1].created_at).getTime() - new Date(a.messages[a.messages.length - 1].created_at).getTime());

        setConversations(convs);
        onUnreadChange?.(convs.filter((c) => c.unread).length);
      } catch {
        toast.error("Failed to load messages");
      }
    })();
  }, [onUnreadChange]);

  const selectedConv = useMemo(() => {
    if (selectedId === null) return null;
    return conversations.find((c) => c.userId === selectedId) || null;
  }, [selectedId, conversations]);

  useEffect(() => {
    if (!showSenderInfo || !selectedConv) {
      setUserInfo(null);
      return;
    }
    scholarshipProviderApi.getUserInfo(selectedConv.userId)
      .then((res) => setUserInfo(res))
      .catch(() => setUserInfo(null));
  }, [showSenderInfo, selectedConv]);

  const filteredConversations = useMemo(() => {
    if (!search) return conversations;
    return conversations.filter((c) =>
      c.userName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, conversations]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [selectedConv?.messages.length]);

  const isImageFile = (file: File) => file.type.startsWith("image/");

  const handleAttach = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFile(file);
    if (isImageFile(file)) {
      const reader = new FileReader();
      reader.onloadend = () => setAttachedPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setAttachedPreview(null);
    }
    e.target.value = "";
  }, []);

  const clearAttachment = useCallback(() => {
    setAttachedFile(null);
    setAttachedPreview(null);
  }, []);

  const handleSend = useCallback(async () => {
    if ((!messageInput.trim() && !attachedFile) || !selectedConv) return;

    let fileUrl = "";
    if (attachedFile) {
      setUploading(true);
      try {
        const folder = "general";
        fileUrl = await scholarshipProviderApi.uploadImage(attachedFile, folder);
      } catch {
        toast.error("Failed to upload file");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const content = fileUrl
      ? isImageFile(attachedFile!)
        ? `${messageInput.trim()}\n![image](${fileUrl})`
        : `${messageInput.trim()}\n[File](${fileUrl})`
      : messageInput.trim();

    try {
      const newMsg = await scholarshipProviderApi.createMessage({
        user_id: selectedConv.userId,
        subject: `Reply to ${selectedConv.userName}`,
        content,
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.userId === selectedConv.userId
            ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.content, time: formatTime(newMsg.created_at) }
            : c
        )
      );
      setMessageInput("");
      clearAttachment();
    } catch {
      toast.error("Failed to send message");
    }
  }, [messageInput, selectedConv, attachedFile]);

  const selectConversation = useCallback((userId: number) => {
    setSelectedId(userId);
    setConversations((prev) => {
      const conv = prev.find((c) => c.userId === userId);
      if (conv) {
        conv.messages
          .filter((m) => !m.read && m.direction === "incoming")
          .forEach((m) => scholarshipProviderApi.markMessageRead(m.id).catch(() => {}));
      }
      const updated = prev.map((c) =>
        c.userId === userId ? { ...c, unread: false } : c
      );
      onUnreadChange?.(updated.filter((c) => c.unread).length);
      return updated;
    });
  }, [onUnreadChange]);

  return (
    <div className="flex gap-6 h-full overflow-hidden">
      <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              id="msg-search-input"
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div id="msg-conversation-list" className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.userId}
              onClick={() => selectConversation(conv.userId)}
              className={`p-4 mx-3 my-1 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg ${
                selectedConv?.userId === conv.userId ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-full ${conv.color} flex items-center justify-center text-white text-sm font-bold relative shrink-0`}
                >
                  {conv.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate">{conv.userName}</p>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{formatLastMessage(conv.lastMessage)}</p>
                  {conv.unread && (
                    <span className="inline-flex items-center mt-1 text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      Unread
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

      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden relative">
        {showSenderInfo && selectedConv && (
          <>
            <div className="absolute inset-0 bg-black/20 z-40" onClick={() => setShowSenderInfo(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 z-50 shadow-xl p-5 overflow-y-auto animate-slide-in">
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-sm font-bold text-gray-900">Sender Info</h4>
                <button onClick={() => setShowSenderInfo(false)} className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className={`w-14 h-14 rounded-full ${selectedConv.color} flex items-center justify-center text-white text-lg font-bold mx-auto mb-3`}>
                {selectedConv.initials}
              </div>

              <div className="text-center mb-5">
                <p className="text-sm font-bold text-gray-900">{selectedConv.userName}</p>
                <p className="text-xs text-gray-500">{selectedConv.userEmail}</p>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                {userInfo ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Name</span>
                      <span className="text-xs font-medium text-gray-900">{userInfo.first_name} {userInfo.last_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Email</span>
                      <span className="text-xs font-medium text-gray-900">{userInfo.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Phone</span>
                      <span className="text-xs font-medium text-gray-900">{userInfo.phone || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Gender</span>
                      <span className="text-xs font-medium text-gray-900">{userInfo.gender || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Address</span>
                      <span className="text-xs font-medium text-gray-900">{userInfo.address || "—"}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">No user data found</p>
                )}
              </div>
            </div>
          </>
        )}
        {selectedConv ? (
          <>
            <div
              id="chat-header"
              className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full ${selectedConv.color} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {selectedConv.initials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {selectedConv.userName}
                  </h3>
                  <p className="text-xs text-gray-500">{selectedConv.userEmail}</p>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowSenderInfo(!showSenderInfo)}
                  className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  title="Sender info"
                >
                  <EllipsisVertical className="text-lg" />
                </button>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              id="chat-messages"
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {selectedConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.direction === "incoming" ? "" : "justify-end"
                  }`}
                >
                  {msg.direction === "incoming" && (
                    <div
                      className={`w-8 h-8 rounded-full ${selectedConv.color} flex items-center justify-center text-white text-xs shrink-0`}
                    >
                      {selectedConv.initials}
                    </div>
                  )}
                  <div
                    className={`${
                      msg.direction === "incoming"
                        ? "bg-gray-100 rounded-2xl rounded-tl-none"
                        : "bg-blue-600 text-white rounded-2xl rounded-tr-none"
                    } p-3 max-w-md`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {msg.content.split('\n').map((line, li) => {
                        const imgMatch = line.match(/^!\[image\]\((.+)\)$/);
                        if (imgMatch) {
                          return <img key={li} src={imgMatch[1]} alt="image" className="max-w-xs rounded-lg mt-1" />;
                        }
                        const fileMatch = line.match(/^\[File\]\((.+)\)$/);
                        if (fileMatch) {
                          return <a key={li} href={fileMatch[1]} target="_blank" rel="noopener noreferrer" className="text-sm underline block mt-1">📎 View File</a>;
                        }
                        return line ? <span key={li}>{line}<br /></span> : null;
                      })}
                    </div>
                    <span
                      className={`text-xs mt-1 block ${
                        msg.direction === "incoming" ? "text-gray-400" : "text-blue-100"
                      }`}
                    >
                      {formatMessageTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 flex-shrink-0 bg-white">
              {attachedFile && (
                <div className="flex items-center gap-2 mb-2 px-1">
                  {attachedPreview ? (
                    <img src={attachedPreview} alt="preview" className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                      <Image className="w-5 h-5" />
                    </div>
                  )}
                  <span className="text-xs text-gray-600 truncate flex-1">{attachedFile.name}</span>
                  <button onClick={clearAttachment} className="text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-end gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAttach}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 flex-shrink-0 disabled:opacity-50"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
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
                  disabled={uploading}
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-60"
                >
                  <Send className="text-lg" />
                </button>
              </div>
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
  