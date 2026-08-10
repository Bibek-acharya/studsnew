"use client";

import React, { useState, useRef } from "react";

interface MessageInputProps {
  onSend: (content: string, attachmentIds: number[]) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  onUpload: (file: File) => Promise<number>;
  disabled?: boolean;
}

export default function MessageInput({ onSend, onTypingStart, onTypingStop, onUpload, disabled }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [attachmentIds, setAttachmentIds] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (!content.trim() && attachmentIds.length === 0) return;
    onSend(content, attachmentIds);
    setContent("");
    setAttachmentIds([]);
    onTypingStop();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onTypingStart();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop();
    }, 3000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadId = await onUpload(file);
      setAttachmentIds((prev) => [...prev, uploadId]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="border-t border-gray-200 p-3">
      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.zip,.rar,.7z"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || disabled}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          {uploading ? "⏳" : "📎"}
        </button>
        <textarea
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={disabled || (!content.trim() && attachmentIds.length === 0)}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
