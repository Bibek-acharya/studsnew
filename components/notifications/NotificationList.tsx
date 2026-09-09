"use client";

import React from "react";
import { Bell } from "lucide-react";
import type { NotificationItem } from "@/features/notifications/types";
import { resolveIcon } from "@/components/notifications/icons";
import { SkeletonNotificationList } from "@/components/ui/Skeleton";

interface NotificationListProps {
  items: NotificationItem[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onMarkRead: (id: number) => void;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

function dayLabel(date: Date, now: Date): string {
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round(
    (startOfDay(now) - startOfDay(date)) / 86_400_000,
  );
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NotificationList({
  items,
  loading = false,
  error = null,
  onRetry,
  onMarkRead,
  activeCategory,
  onCategoryChange,
}: NotificationListProps) {
  if (loading) {
    return <SkeletonNotificationList count={4} />;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-medium text-red-600">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (items.length === 0) {
    // Empty inbox: text only — no splash art, never mock data (doc 13 §8).
    return (
      <div className="py-10 text-center text-gray-400">
        <Bell size={20} className="mx-auto mb-2 opacity-50" />
        <p className="text-xs font-medium">You&apos;re all caught up</p>
      </div>
    );
  }

  const categories: string[] = [];
  for (const item of items) {
    if (item.category && !categories.includes(item.category)) {
      categories.push(item.category);
    }
  }

  const filtered =
    activeCategory && activeCategory !== "all"
      ? items.filter((item) => item.category === activeCategory)
      : items;

  const now = new Date();
  const groups: Array<{ label: string; items: NotificationItem[] }> = [];
  for (const item of filtered) {
    const label = dayLabel(new Date(item.created_at), now);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.items.push(item);
    } else {
      groups.push({ label, items: [item] });
    }
  }

  return (
    <div>
      {onCategoryChange && (
        <div
          role="tablist"
          className="flex gap-1 overflow-x-auto px-3 py-2 border-b border-gray-100"
        >
          {["all", ...categories].map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize whitespace-nowrap transition-colors ${
                (activeCategory ?? "all") === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category === "all" ? "All" : category}
            </button>
          ))}
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {groups.map((group) => (
          <section key={group.label}>
            <p
              data-day-header
              className="px-3 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider"
            >
              {group.label}
            </p>
            {group.items.map((notif) => {
              const read = notif.read_at !== null;
              const { icon: Icon, color, bg } = resolveIcon(
                notif.category,
                notif.event_key,
              );
              return (
                <button
                  key={notif.id}
                  onClick={() => {
                    if (!read) onMarkRead(notif.id);
                  }}
                  className={`w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                    read ? "" : "bg-blue-50/30"
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
                        read ? "text-gray-600" : "text-gray-900"
                      }`}
                    >
                      {notif.title}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.body}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">
                      {new Date(notif.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!read && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  )}
                </button>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
