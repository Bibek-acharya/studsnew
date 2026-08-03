"use client";

import React, { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { scholarshipProviderApi, ProviderNotification } from "@/services/scholarshipProviderApi";
import NotificationBell, { NotificationItem } from "@/components/shared/NotificationBell";
import MessageBell from "@/components/shared/MessageBell";

interface TopBarProps {
  providerUser: any;
  unreadMessages: number;
  onNavigate?: (section: string) => void;
  onNotificationUpdate?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  providerUser,
  unreadMessages,
  onNavigate,
  onNotificationUpdate,
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifUnreadCount, setNotifUnreadCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadNotifications() {
    setNotifLoading(true);
    try {
      const res = await scholarshipProviderApi.getNotifications(1, 10);
      const items: NotificationItem[] = (res.notifications || []).map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        read: n.read,
        created_at: n.created_at,
      }));
      setNotifications(items);
      setNotifUnreadCount(res.unread_count || 0);
    } catch {
      setNotifications([]);
      setNotifUnreadCount(0);
    } finally {
      setNotifLoading(false);
    }
  }

  async function handleMarkRead(id: number | string) {
    try {
      await scholarshipProviderApi.markNotificationRead(Number(id));
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setNotifUnreadCount((prev) => Math.max(0, prev - 1));
      onNotificationUpdate?.();
    } catch {
      // ignore
    }
  }

  async function handleMarkAllRead() {
    try {
      await scholarshipProviderApi.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setNotifUnreadCount(0);
      onNotificationUpdate?.();
    } catch {
      // ignore
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1"></div>

      <div className="flex items-center gap-4">
        <MessageBell
          unreadCount={unreadMessages}
          onClick={() => onNavigate?.("sec-messages")}
        />
        <NotificationBell
          notifications={notifications}
          unreadCount={notifUnreadCount}
          loading={notifLoading}
          isOpen={showNotifDropdown}
          onToggle={() => setShowNotifDropdown(!showNotifDropdown)}
          onClose={() => setShowNotifDropdown(false)}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onViewAll={() => {
            setShowNotifDropdown(false);
            onNavigate?.("sec-notifications");
          }}
        />

        <div className="h-8 w-px bg-slate-300"></div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
          {providerUser?.logo_url ? (
            <img src={providerUser.logo_url} alt={providerUser.provider_name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-600 to-blue-500 text-white flex items-center justify-center font-semibold text-sm">
              {getInitials(providerUser?.provider_name || "Admin User")}
            </div>
          )}
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-800 inline-flex items-center gap-1">
              {providerUser?.provider_name || "Admin User"} <BadgeCheck className="w-3.5 h-3.5 text-white fill-[#2563eb]" />
            </p>
            <p className="text-xs text-slate-500">{providerUser?.role || "Administrator"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
