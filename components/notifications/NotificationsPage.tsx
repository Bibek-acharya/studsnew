"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Bell,
  Clock,
  Archive,
  ArchiveRestore,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { apiService, StudentNotificationItem } from "@/services/api";
import { SkeletonNotificationList } from "@/components/ui/Skeleton";

type NotificationTab = "all" | "following" | "system" | "archive";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  createdAt: string;
  isRead: boolean;
  isArchived: boolean;
  isFollowing: boolean;
  icon: string;
  color: string;
  bgColor: string;
}

const notificationTabs: NotificationTab[] = [
  "all",
  "following",
  "system",
  "archive",
];

const dayOrder = [
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "upcoming", label: "Upcoming" },
  { key: "earlier", label: "Earlier" },
] as const;

function getDayKey(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const key = startOfDay(d);
  if (key === startOfDay(today)) return "today";
  if (key === startOfDay(tomorrow)) return "tomorrow";
  return key < startOfDay(today) ? "earlier" : "upcoming";
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentTab, setCurrentTab] = useState<NotificationTab>("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiService.getStudentNotifications(1, 50);
        const items: StudentNotificationItem[] = res.data?.notifications || [];
        setNotifications(
          items.map((n) => ({
            id: String(n.id),
            type: n.type || "system",
            title: n.title,
            message: n.message,
            time: n.created_at
              ? new Date(n.created_at).toLocaleDateString()
              : "",
            createdAt: n.created_at,
            isRead: n.read,
            isArchived: false,
            isFollowing: false,
            icon: "fa-bell",
            color: "text-gray-500",
            bgColor: "bg-gray-100",
          })),
        );
      } catch (err: any) {
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.isRead && !n.isArchived).length,
    [notifications],
  );

  const visibleNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (currentTab === "all") return !n.isArchived;
      if (currentTab === "following") return !n.isArchived && n.isFollowing;
      if (currentTab === "system")
        return !n.isArchived && n.type === "system";
      if (currentTab === "archive") return n.isArchived;
      return true;
    });
  }, [currentTab, notifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    apiService.markNotificationRead(Number(id)).catch(() => {});
  };

  const toggleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isArchived: !n.isArchived } : n)),
    );
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (currentTab === "all" && !n.isArchived) return { ...n, isRead: true };
        if (currentTab === "following" && !n.isArchived && n.isFollowing)
          return { ...n, isRead: true };
        if (currentTab === "system" && !n.isArchived && n.type === "system")
          return { ...n, isRead: true };
        if (currentTab === "archive" && n.isArchived)
          return { ...n, isRead: true };
        return n;
      }),
    );
    apiService.markAllNotificationsRead().catch(() => {});
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[#475569]" />
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadNotificationCount > 0 && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                {unreadNotificationCount}
              </span>
            )}
          </div>
          <button
            onClick={markAllAsRead}
            className="rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-900"
          >
            Mark all as read
          </button>
        </div>

        <div className="no-scrollbar flex gap-4 overflow-x-auto whitespace-nowrap border-b border-gray-50 bg-gray-50/50 px-4 py-2 text-sm">
          {notificationTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`pb-1 capitalize transition-all ${
                currentTab === tab
                  ? "border-b-2 border-blue-600 font-medium text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-4">
            <SkeletonNotificationList />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 text-red-500 py-16">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : visibleNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              No notifications
            </h3>
            <p className="text-sm text-gray-500">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="no-scrollbar max-h-[70vh] flex-col overflow-y-auto">
            {dayOrder
              .map((group) => ({
                ...group,
                items: visibleNotifications.filter(
                  (n) => getDayKey(n.createdAt) === group.key,
                ),
              }))
              .filter((group) => group.items.length > 0)
              .map((group) => (
                <div key={group.key}>
                  <div className="bg-gray-50/70 px-4 py-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {group.label}
                    </p>
                  </div>
                  {group.items.map((notif) => (
                    <div
                      key={notif.id}
                      className="group relative flex cursor-pointer items-start gap-3 border-b border-gray-50 bg-white p-3 transition-colors hover:bg-gray-50"
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div
                        className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notif.bgColor} ${notif.color}`}
                      >
                        <i className="fa-solid fa-bell text-sm"></i>
                      </div>
                      <div className="flex-1 min-w-0 pr-10">
                        <div className="mb-0.5 flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-black">
                            {notif.title}
                          </p>
                          {notif.isFollowing && (
                            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600 whitespace-nowrap">
                              Following
                            </span>
                          )}
                        </div>
                        <p className="line-clamp-2 text-sm leading-relaxed text-gray-800">
                          {notif.message}
                        </p>
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} /> {notif.time}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-blue-500"></div>
                      )}
                      <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 transition-all group-hover:opacity-100">
                        <button
                          onClick={(e) => toggleArchive(notif.id, e)}
                          className="rounded-md p-1 px-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                          {notif.isArchived ? (
                            <ArchiveRestore size={16} />
                          ) : (
                            <Archive size={16} />
                          )}
                        </button>
                        <button
                          onClick={(e) => removeNotification(notif.id, e)}
                          className="rounded-md p-1 px-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}