"use client";

import React, { useState } from "react";
import { Message } from "@/services/message.api";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onEdit?: (message: Message) => void;
  onDelete?: (message: Message) => void;
}

const MAX_LENGTH = 200;

export default function MessageBubble({ message, isOwn, onEdit, onDelete }: MessageBubbleProps) {
  const isDeleted = message.deleted_at !== null;
  const [expanded, setExpanded] = useState(false);
  const isLong = message.content && message.content.length > MAX_LENGTH;
  const displayContent = isLong && !expanded
    ? message.content.slice(0, MAX_LENGTH) + "..."
    : message.content;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
        } ${isDeleted ? "opacity-50 italic" : ""}`}
      >
        {/* Sender label — show for both sides */}
        <p className={`text-xs font-medium mb-1 ${isOwn ? "text-blue-200" : "text-gray-500"}`}>
          {isOwn ? "You" : message.sender_name}
        </p>

        {isDeleted ? (
          <p className="text-sm">This message was deleted</p>
        ) : (
          <>
            <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className={`text-xs mt-1 underline ${isOwn ? "text-blue-100" : "text-blue-600"}`}
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}

            {message.attachments?.length > 0 && (
              <div className="mt-2 space-y-1">
                {message.attachments.map((attachment) => (
                  <div key={attachment.id} className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
                    {attachment.file_type.startsWith("image/") ? (
                      <img
                        src={`/api/v1/uploads/${attachment.thumbnail_key || attachment.storage_key}`}
                        alt={attachment.file_name}
                        className="rounded max-w-xs max-h-40"
                      />
                    ) : (
                      <a
                        href={`/api/v1/uploads/${attachment.storage_key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {attachment.file_name} ({(attachment.file_size / 1024).toFixed(1)} KB)
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : ""}`}>
              <span className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-400"}`}>
                {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              {message.edited_at && (
                <span className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-400"}`}>
                  (edited)
                </span>
              )}
              {isOwn && (
                <span className="text-xs">
                  {message.status === "read" ? (
                    <svg className="w-4 h-4 text-blue-300 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : message.status === "delivered" ? (
                    <svg className="w-4 h-4 text-blue-300 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-blue-300 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
              )}
            </div>
          </>
        )}

        {isOwn && !isDeleted && (
          <div className="flex gap-2 mt-1">
            {onEdit && (
              <button onClick={() => onEdit(message)} className="text-xs underline">
                Edit
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(message)} className="text-xs underline">
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
