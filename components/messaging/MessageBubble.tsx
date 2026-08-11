"use client";

import React, { useState } from "react";
import { Message } from "@/services/message.api";
import { getImageUrl } from "@/services/api";
import ImagePreview from "./ImagePreview";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  ownInitials: string;
  otherInitials: string;
  onEdit?: (message: Message) => void;
  onDelete?: (message: Message) => void;
}

const MAX_LENGTH = 200;

function StatusCheck({ status }: { status: string }) {
  if (status === "read") {
    return (
      <span className="text-blue-400" title="Read">
        <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
        </svg>
      </span>
    );
  }
  if (status === "delivered") {
    return (
      <span className="text-slate-300" title="Delivered">
        <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
        </svg>
      </span>
    );
  }
  if (status === "sending") {
    return (
      <span className="text-slate-300" title="Sending">
        <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
      </span>
    );
  }
  return (
    <span className="text-slate-300" title="Sent">
      <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    </span>
  );
}

export default function MessageBubble({ message, isOwn, ownInitials, otherInitials, onEdit, onDelete }: MessageBubbleProps) {
  const isDeleted = message.deleted_at !== null;
  const [expanded, setExpanded] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ src: string; name: string } | null>(null);
  const isLong = message.content && message.content.length > MAX_LENGTH;
  const displayContent = isLong && !expanded
    ? message.content.slice(0, MAX_LENGTH) + "..."
    : message.content;

  const timeStr = new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).toLowerCase();

  const avatarEl = (
    <div className={`w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-[10px] flex-shrink-0 ${isOwn ? "ml-1" : "mr-1"}`}>
      {isOwn ? ownInitials : otherInitials}
    </div>
  );

  const bubbleContent = (
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

      {message.attachments?.length > 0 && (
        <div className="mt-2 space-y-1.5">
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
                  className={`flex items-center gap-1.5 underline ${isOwn ? "text-blue-200 hover:text-white" : "text-blue-600 hover:text-blue-700"}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{attachment.file_name}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );

  const editDeleteButtons = !isDeleted && isOwn && (
    <div className="absolute top-1/2 -translate-y-1/2 -left-14 hidden group-hover/action:flex items-center space-x-1 bg-white p-1 rounded-md border border-slate-200 shadow-sm z-10">
      {onEdit && (
        <button onClick={() => onEdit(message)} className="p-1 text-slate-400 hover:text-blue-600" title="Edit">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}
      {onDelete && (
        <button onClick={() => onDelete(message)} className="p-1 text-slate-400 hover:text-red-500" title="Delete">
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
    ? "bg-blue-600 text-white rounded-2xl shadow-sm"
    : "bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-sm";

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

        <div className={`relative ${bubbleClass} p-3.5 text-xs leading-relaxed ${isDeleted ? "opacity-60" : ""}`}>
          {isDeleted ? (
            <p className={isOwn ? "italic" : "italic text-slate-500"}>This message was deleted</p>
          ) : (
            <>
              {bubbleContent}
              <div className={`flex items-center space-x-1 mt-1 text-[9px] ${isOwn ? "justify-end" : "justify-start"} ${isOwn ? "text-white/80" : "text-slate-400"} font-medium`}>
                {isOwn && <StatusCheck status={message.status || "sent"} />}
              </div>
            </>
          )}
        </div>
      </div>

      {isOwn && avatarEl}
    </div>
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
