"use client";
import React, { useState, useEffect, useCallback } from "react";
import SectionHeader from "../shared/SectionHeader";
import { Loader2, CheckCheck } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("institutionToken");
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 0) return "Just now";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface NotificationItem {
  id: string | number;
  type: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  created_at: string;
}

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    const items: NotificationItem[] = [];
    try {
      const dashRes = await fetch(
        `${API_BASE_URL}/api/v1/institution/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ).then((r) => r.json());
      const dash = dashRes?.data || {};
      if (dash.pending_bookings > 0) {
        items.push({
          id: "pending-bookings",
          type: "admission",
          icon: "ph ph-user-plus",
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600",
          title: "Pending Counselling Bookings",
          desc: `${dash.pending_bookings} student(s) waiting for counselling`,
          time: "Now",
          unread: true,
          created_at: new Date().toISOString(),
        });
      }
    } catch {
      /* skip */
    }

    try {
      const msgRes = await fetch(
        `${API_BASE_URL}/api/v1/institution/messages/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ).then((r) => r.json());
      const contacts = msgRes?.data || [];
      if (Array.isArray(contacts)) {
        contacts.slice(0, 5).forEach((c: any, i: number) => {
          items.push({
            id: `msg-${c.user_id || i}`,
            type: "message",
            icon: "ph ph-chats",
            iconBg: "bg-green-50",
            iconColor: "text-green-600",
            title: "New message from applicant",
            desc: `${c.name || `User #${c.user_id}`} - ${c.last_message || ""}`,
            time: timeAgo(c.last_message_date),
            unread: true,
            created_at: c.last_message_date || new Date().toISOString(),
          });
        });
      }
    } catch {
      /* skip */
    }

    try {
      const notifRes = await fetch(
        `${API_BASE_URL}/api/v1/institution/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ).then((r) => r.json());
      const list = notifRes?.data?.notifications || notifRes?.data || [];
      if (Array.isArray(list)) {
        list.forEach((n: any) => {
          const cat = (n.type || "system").toLowerCase();
          const typeMap: Record<string, string> = {
            application: "admission",
            admission: "admission",
            scholarship: "scholarship",
            entrance: "entrance",
            message: "message",
            news: "news",
            event: "events",
            blog: "blogs",
          };
          const mappedType = typeMap[cat] || "system";
          const colorMap: Record<string, string[]> = {
            admission: ["bg-blue-50", "text-blue-600"],
            scholarship: ["bg-orange-50", "text-orange-500"],
            entrance: ["bg-green-50", "text-green-600"],
            message: ["bg-green-50", "text-green-600"],
            events: ["bg-yellow-50", "text-yellow-600"],
            system: ["bg-red-50", "text-red-600"],
          };
          const [iconBg, iconColor] = colorMap[mappedType] || [
            "bg-gray-50",
            "text-gray-600",
          ];
          items.push({
            id: n.id,
            type: mappedType,
            icon: "ph ph-bell",
            iconBg,
            iconColor,
            title: n.title || "Notification",
            desc: n.message || "",
            time: timeAgo(n.created_at),
            unread: !n.read,
            created_at: n.created_at,
          });
        });
      }
    } catch {
      /* endpoint may not exist */
    }

    items.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    setNotifications(items);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    const token = getToken();
    if (!token || markingRead) return;
    setMarkingRead(true);
    try {
      await fetch(`${API_BASE_URL}/api/v1/institution/notifications/read-all`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch {
      /* skip */
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setMarkingRead(false);
    window.dispatchEvent(new Event("institution-notifications-read"));
  };

  const tabs = [
    { key: "all", label: "All", count: notifications.length },
    {
      key: "admission",
      label: "Admission",
      count: notifications.filter((n) => n.type === "admission").length,
    },
    {
      key: "scholarship",
      label: "Scholarship",
      count: notifications.filter((n) => n.type === "scholarship").length,
    },
    {
      key: "entrance",
      label: "Entrance",
      count: notifications.filter((n) => n.type === "entrance").length,
    },
    {
      key: "message",
      label: "Message",
      count: notifications.filter((n) => n.type === "message").length,
    },
    {
      key: "news",
      label: "News",
      count: notifications.filter((n) => n.type === "news").length,
    },
    {
      key: "events",
      label: "Events",
      count: notifications.filter((n) => n.type === "events").length,
    },
    {
      key: "blogs",
      label: "Blogs",
      count: notifications.filter((n) => n.type === "blogs").length,
    },
    {
      key: "system",
      label: "System",
      count: notifications.filter((n) => n.type === "system").length,
    },
  ];

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Notification"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard/overview" },
          { label: "Notification" },
        ]}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100">
          <div
            className="flex overflow-x-auto gap-1 p-3"
            style={{ scrollbarWidth: "none" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? "bg-brand-50 text-brand-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                      activeTab === tab.key
                        ? "bg-brand-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="px-4 pb-3 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {loading
                ? "Loading..."
                : `${filteredNotifications.length} notification${filteredNotifications.length !== 1 ? "s" : ""}`}
            </p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markingRead}
                className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCheck className="w-4 h-4" />
                {markingRead ? "Marking..." : "Mark All Read"}
              </button>
            )}
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              <p>No notifications</p>
            </div>
          ) : (
            filteredNotifications.map((notif, i) => (
              <div
                key={notif.id || i}
                className="p-4 hover:bg-brand-50 flex items-start gap-3 transition-colors cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-full ${notif.iconBg} flex items-center justify-center shrink-0`}
                >
                  <i className={`${notif.icon} ${notif.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {notif.desc}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                </div>
                {notif.unread && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
