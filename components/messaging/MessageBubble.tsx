"use client";

import React from "react";
import { Message } from "@/services/message.api";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onEdit?: (message: Message) => void;
  onDelete?: (message: Message) => void;
}

export default function MessageBubble({ message, isOwn, onEdit, onDelete }: MessageBubbleProps) {
  const isDeleted = message.deleted_at !== null;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
        } ${isDeleted ? "opacity-50 italic" : ""}`}
      >
        {!isOwn && (
          <p className={`text-xs font-medium mb-1 ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
            {message.sender_name}
          </p>
        )}

        {isDeleted ? (
          <p className="text-sm">This message was deleted</p>
        ) : (
          <>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>

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
                  {message.status === "read" ? "✓✓" : message.status === "delivered" ? "✓✓" : "✓"}
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
