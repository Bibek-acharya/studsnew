"use client";

import React, { useRef, useEffect } from "react";
import { Bell, X } from "lucide-react";
import type { NotificationItem } from "@/features/notifications/types";
import { resolveIcon } from "./icons";

// Bell dropdown over the unified NotificationItem (features/notifications).
// Icons derive from category/event_key via icons.ts — never from stored
// styles. Consumers pass hook items directly; no local view-model mapping.
interface NotificationBellProps {
  notifications: NotificationItem[];
  unreadCount: number;
  loading?: boolean;
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onViewAll: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  maxDisplay?: number;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationBell({
  notifications,
  unreadCount,
  loading = false,
  onMarkRead,
  onMarkAllRead,
  onViewAll,
  isOpen,
  onToggle,
  onClose,
  maxDisplay = 8,
}: NotificationBellProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const displayNotifications = notifications.slice(0, maxDisplay);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="icon-btn-hover text-gray-400 hover:text-gray-600 transition-colors relative"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              </div>
            ) : displayNotifications.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <Bell size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">No notifications yet</p>
              </div>
            ) : (
              displayNotifications.map((notif) => {
                const { icon: Icon, color, bg } = resolveIcon(
                  notif.category,
                  notif.event_key,
                );
                const read = notif.read_at !== null;
                return (
                  <button
                    key={notif.id}
                    onClick={() => {
                      if (!read) onMarkRead(notif.id);
                    }}
                    className={`w-full text-left p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                      !read ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${bg}`}
                    >
                      <Icon size={14} className={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-semibold truncate ${
                          !read ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.body}
                      </p>
                      {notif.created_at && (
                        <p className="text-[10px] text-gray-400 font-medium mt-1">
                          {timeAgo(notif.created_at)}
                        </p>
                      )}
                    </div>
                    {!read && (
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 border-t border-gray-100 text-center">
              <button
                onClick={onViewAll}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
              >
                View all activity
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
