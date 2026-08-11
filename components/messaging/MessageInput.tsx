"use client";

import React, { useState, useRef } from "react";

interface PendingFile {
  id: number;
  name: string;
  size: number;
  blob?: File;
}

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
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "";
      el.style.height = Math.min(el.scrollHeight, 128) + "px";
    }
  };

  const handleSend = () => {
    if (!content.trim() && pendingFiles.length === 0) return;
    setUploadError(null);
    pendingFiles.forEach((f) => { if (f.blob) URL.revokeObjectURL(URL.createObjectURL(f.blob)); });
    onSend(content, pendingFiles.map((f) => f.id));
    setContent("");
    setPendingFiles([]);
    onTypingStop();
    if (textareaRef.current) {
      textareaRef.current.style.height = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    autoResize();
    onTypingStart();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop();
    }, 3000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const uploadId = await onUpload(file);
      setPendingFiles((prev) => [...prev, { id: uploadId, name: file.name, size: file.size, blob: file }]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = (id: number) => {
    setPendingFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.blob) URL.revokeObjectURL(URL.createObjectURL(file.blob));
      return prev.filter((f) => f.id !== id);
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const canSend = !disabled && (content.trim().length > 0 || pendingFiles.length > 0);

  return (
    <div className="p-4 bg-white border-t border-slate-200">
      {uploadError && (
        <div className="mb-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-1.5 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="flex-1">{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="text-red-400 hover:text-red-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {pendingFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {pendingFiles.map((file) => (
            <div key={file.id} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-sm">
              {file.blob && file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img src={URL.createObjectURL(file.blob)} alt={file.name} className="w-8 h-8 rounded object-cover" />
              ) : (
                <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <span className="text-gray-700 truncate max-w-[150px] text-xs">{file.name}</span>
              <span className="text-gray-400 text-xs">{formatSize(file.size)}</span>
              <button onClick={() => removeFile(file.id)} className="text-gray-400 hover:text-red-500 ml-1 shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="flex items-end space-x-2 max-w-4xl mx-auto"
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.zip,.rar,.7z"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || disabled}
          className="w-[42px] h-[42px] flex-shrink-0 flex items-center justify-center text-slate-400 hover:text-slate-600 bg-slate-50 border border-slate-200 rounded-md transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          )}
        </button>
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Write your message..."
            disabled={disabled}
            rows={1}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all text-slate-700 placeholder-slate-400 resize-none min-h-[42px] max-h-32"
            style={{ overflowY: "hidden" }}
          />
        </div>
        <button
          type="submit"
          disabled={!canSend}
          className="w-[42px] h-[42px] flex-shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-50"
        >
          <i className="fa-solid fa-paper-plane text-xs"></i>
        </button>
      </form>
    </div>
  );
}
