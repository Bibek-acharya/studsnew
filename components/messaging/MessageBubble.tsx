"use client";

import React, { useState } from "react";
import { Message } from "@/services/message.api";
import { getImageUrl } from "@/services/api";
import ImagePreview from "./ImagePreview";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  otherInitials: string;
  otherAvatarUrl?: string;
  ownAvatarUrl?: string;
  onEdit?: (message: Message, newContent: string) => Promise<void>;
  onDelete?: (message: Message) => Promise<void>;
}

const MAX_LENGTH = 200;

function truncateFileName(name: string, maxLen: number = 20): string {
  if (name.length <= maxLen) return name;
  const dotIdx = name.lastIndexOf(".");
  if (dotIdx <= 0) {
    const half = Math.floor((maxLen - 3) / 2);
    return name.slice(0, half) + "..." + name.slice(name.length - half);
  }
  const ext = name.slice(dotIdx);
  const base = name.slice(0, dotIdx);
  const available = maxLen - ext.length - 3;
  if (available <= 2) return name.slice(0, maxLen - 3) + "..." + ext;
  const front = Math.ceil(available / 2);
  const back = available - front;
  return base.slice(0, front) + "..." + base.slice(base.length - back) + ext;
}

function StatusCheck({ status }: { status: string }) {
  if (status === "read") {
    return (
      <span className="text-blue-400" title="Read">
        <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13l4 4L23 7" />
        </svg>
      </span>
    );
  }
  if (status === "delivered") {
    return (
      <span className="text-slate-400" title="Delivered">
        <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13l4 4L23 7" />
        </svg>
      </span>
    );
  }
  return (
    <span className="text-slate-400" title="Sent">
      <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export default function MessageBubble({ message, isOwn, otherInitials, otherAvatarUrl, ownAvatarUrl, onEdit, onDelete }: MessageBubbleProps) {
  const isDeleted = message.deleted_at !== null;
  const [expanded, setExpanded] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ src: string; name: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const isLong = message.content && message.content.length > MAX_LENGTH;
  const displayContent = isLong && !expanded
    ? message.content.slice(0, MAX_LENGTH) + "..."
    : message.content;

  const timeStr = new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).toLowerCase();

  const isImageOnly = !message.content?.trim()
    && (message.attachments?.length ?? 0) > 0
    && message.attachments!.every(a => a.file_type.startsWith("image/"));

  const avatarEl = (
    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-[10px] flex-shrink-0 mr-1 overflow-hidden">
      {otherAvatarUrl ? (
        <img src={otherAvatarUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        otherInitials
      )}
    </div>
  );

  const ownAvatarEl = ownAvatarUrl && (
    <div className="w-7 h-7 rounded-full flex-shrink-0 ml-1 overflow-hidden">
      <img src={ownAvatarUrl} alt="" className="w-full h-full object-cover" />
    </div>
  );

  const bubbleContent = (
    <>
      {message.content && message.content.trim() && (
        <>
          <p className="whitespace-pre-wrap">{displayContent}</p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className={`text-[10px] mt-1 underline ${isOwn ? "text-blue-200" : "text-blue-600"}`}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </>
      )}
    </>
  );

  const attachmentsEl = message.attachments?.length > 0 ? (
    <div className={isImageOnly ? "space-y-1.5" : "mt-1.5 space-y-1.5"}>
      {message.attachments.map((attachment) => (
        <div key={attachment.id}>
          {attachment.file_type.startsWith("image/") ? (
            <img
              src={getImageUrl(`/uploads/${attachment.thumbnail_key || attachment.storage_key}`)}
              alt={attachment.file_name}
              onClick={() => setPreviewFile({ src: getImageUrl(`/uploads/${attachment.thumbnail_key || attachment.storage_key}`), name: attachment.file_name })}
              className="rounded-lg max-w-xs max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />
          ) : (
            <a
              href={getImageUrl(`/uploads/${attachment.storage_key}`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-[11px] ${isOwn ? "text-blue-200 hover:text-white" : "text-blue-600 hover:text-blue-700"}`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{truncateFileName(attachment.file_name)}</span>
              <span className="text-[10px] opacity-60 ml-auto">
                {(attachment.file_size / 1024).toFixed(0)} KB
              </span>
            </a>
          )}
        </div>
      ))}
    </div>
  ) : null;

  const editDeleteButtons = !isDeleted && isOwn && (
    <div className="absolute top-1/2 -translate-y-1/2 -left-14 hidden group-hover:flex items-center space-x-1 bg-white p-1 rounded-md border border-slate-200 shadow-sm z-10">
      {onEdit && (
        <button onClick={() => { setEditText(message.content || ""); setEditing(true); }} className="p-1 text-slate-400 hover:text-blue-600" title="Edit">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}
      {onDelete && (
        <button onClick={() => setDeleting(true)} className="p-1 text-slate-400 hover:text-red-500" title="Delete">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );

  const timeRow = (
    <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-slate-400">
      <span>{timeStr}</span>
      {message.edited_at && <span>(edited)</span>}
    </div>
  );

  const bubbleClass = isOwn
    ? "bg-blue-600 text-white rounded-2xl"
    : "bg-white text-slate-800 border border-slate-200 rounded-2xl";

  const statusEl = isOwn && !isDeleted && (
    <span className={`flex ${isOwn ? "justify-end" : "justify-start"} mt-0.5`}>
      <StatusCheck status={message.status || "sent"} />
    </span>
  );

  const handleEditSubmit = async () => {
    if (editText.trim() && editText !== message.content && onEdit) {
      await onEdit(message, editText.trim());
    }
    setEditing(false);
  };

  const handleDeleteConfirm = async () => {
    if (onDelete) {
      await onDelete(message);
    }
    setDeleting(false);
  };

  return (
    <>
    <div className={`flex items-end space-x-2 my-2.5 ${isOwn ? "justify-end" : "justify-start"} group`}>
      {!isOwn && avatarEl}

      <div className={`max-w-[80%] sm:max-w-[70%] flex flex-col ${isOwn ? "items-end" : "items-start"} relative group/action`}>
        {isOwn ? (
          <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-slate-400">
            <span>{timeStr}</span>
            {message.edited_at && <span>(edited)</span>}
          </div>
        ) : (
          timeRow
        )}

        {editDeleteButtons}

        <div className="flex flex-col">
          {isDeleted ? (
            <div className={`relative ${bubbleClass} px-3 py-2 text-xs leading-relaxed opacity-60`}>
              <p className={isOwn ? "italic" : "italic text-slate-500"}>This message was deleted</p>
            </div>
          ) : isImageOnly ? (
            <div className="relative">
              {attachmentsEl}
            </div>
          ) : (
            <div className={`relative ${bubbleClass} px-3 py-2 text-xs leading-relaxed`}>
              {bubbleContent}
              {attachmentsEl}
            </div>
          )}

          {statusEl}
        </div>
      </div>

      {isOwn && ownAvatarEl}
    </div>

    {editing && (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditing(false)}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-sm font-bold text-slate-900 mb-3">Edit Message</h3>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none min-h-[80px]"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleEditSubmit();
              }
              if (e.key === "Escape") setEditing(false);
            }}
          />
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setEditing(false)} className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
              Cancel
            </button>
            <button onClick={handleEditSubmit} className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>
    )}

    {deleting && (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setDeleting(false)}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-sm font-bold text-slate-900 mb-2">Delete Message</h3>
          <p className="text-xs text-slate-500 mb-4">This message will be deleted. This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleting(false)} className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
              Cancel
            </button>
            <button onClick={handleDeleteConfirm} className="px-4 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    )}

    {previewFile && (
      <ImagePreview
        src={previewFile.src}
        fileName={previewFile.name}
        onClose={() => setPreviewFile(null)}
      />
    )}
    </>
  );
}
