"use client";

import React, { useMemo, useState } from "react";
import { BadgeCheck } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";
import MessageBell from "@/components/shared/MessageBell";
import { resolveIcon } from "@/components/notifications/icons";
import { useNotifications } from "@/features/notifications/useNotifications";

interface TopBarProps {
  providerUser: any;
  unreadMessages: number;
  onNavigate?: (section: string) => void;
  onNotificationUpdate?: () => void;
}

// Provider bell on the shared inbox client. The hook owns fetch + 60s poll +
// visibility refresh; the badge reads the server unread_count through the
// same state the dropdown lists (no local counters, no provider-scoped fetch).
const TopBar: React.FC<TopBarProps> = ({
  providerUser,
  unreadMessages,
  onNavigate,
  onNotificationUpdate,
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const {
    items,
    unreadCount: notifUnreadCount,
    loading: notifLoading,
    markRead,
    markAllRead,
  } = useNotifications({ limit: 10 });

  const notifications = useMemo(
    () =>
      items.slice(0, 10).map((n) => {
        const { icon: Icon, color, bg } = resolveIcon(n.category, n.event_key);
        return {
          id: n.id,
          title: n.title,
          message: n.body,
          read: n.read_at !== null,
          created_at: n.created_at,
          icon: <Icon size={14} className={color} />,
          iconBg: bg,
        };
      }),
    [items],
  );

  const act = (promise: Promise<unknown>) => {
    promise.then(() => onNotificationUpdate?.()).catch(() => {});
  };

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
          onMarkRead={(id) => act(markRead(Number(id)))}
          onMarkAllRead={() => act(markAllRead())}
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
