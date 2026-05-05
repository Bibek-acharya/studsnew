"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, Bell, MessageSquare, BadgeCheck } from "lucide-react";
import { scholarshipProviderApi, ProviderNotification } from "@/services/scholarshipProviderApi";

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
  const [notifications, setNotifications] = useState<ProviderNotification[]>([]);
  const [notifUnreadCount, setNotifUnreadCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifDropdown(false);
      }
    }
    if (showNotifDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifDropdown]);

  async function loadNotifications() {
    setNotifLoading(true);
    try {
      const res = await scholarshipProviderApi.getNotifications(1, 10);
      setNotifications(res.notifications || []);
      setNotifUnreadCount(res.unread_count || 0);
    } catch {
      setNotifications([]);
      setNotifUnreadCount(0);
    } finally {
      setNotifLoading(false);
    }
  }

  async function handleMarkRead(id: number, link?: string) {
    try {
      await scholarshipProviderApi.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setNotifUnreadCount(prev => Math.max(0, prev - 1));
      onNotificationUpdate?.();

      if (link === 'messages') {
        onNavigate?.('sec-messages');
      } else if (link === 'applications') {
        onNavigate?.('sec-applications');
      }
    } catch {
      // ignore
    }
    setShowNotifDropdown(false);
  }

  async function handleMarkAllRead() {
    try {
      await scholarshipProviderApi.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setNotifUnreadCount(0);
      onNotificationUpdate?.();
    } catch {
      // ignore
    }
  }

  function getNotifIcon(type: string): string {
    switch (type) {
      case 'application': return 'fa-file-circle-check text-green-500';
      case 'message': return 'fa-envelope text-blue-500';
      case 'interview': return 'fa-video text-purple-500';
      case 'system': return 'fa-gear text-slate-500';
      default: return 'fa-bell text-slate-400';
    }
  }

  function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
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
        <button
          onClick={() => onNavigate?.('sec-messages')}
          className="relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors"
          title="Messages"
        >
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {unreadMessages}
          </span>
          <MessageSquare className="w-5 h-5" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setShowNotifDropdown(!showNotifDropdown); if (!showNotifDropdown) loadNotifications(); }}
            className="relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors"
            title="Notifications"
          >
            {notifUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {notifUnreadCount > 9 ? '9+' : notifUnreadCount}
              </span>
            )}
            <Bell className="w-5 h-5" />
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-2xl border border-slate-200 overflow-hidden z-50">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Notifications</h3>
                {notifUnreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-black text-primary-600 hover:text-primary-800 uppercase tracking-widest"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <i className="fa-solid fa-spinner fa-spin text-primary-600"></i>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <i className="fa-regular fa-bell text-2xl mb-2"></i>
                    <p className="text-xs font-bold">No notifications yet</p>
                  </div>
                ) : (
                  (notifications || []).map(notif => (
                    <button
                      key={notif.id}
                      onClick={() => handleMarkRead(notif.id, notif.link)}
                      className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition flex gap-3 ${
                        !notif.read ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
                        !notif.read ? 'bg-primary-100' : 'bg-slate-100'
                      }`}>
                        <i className={`fa-solid ${getNotifIcon(notif.type)} text-sm`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${!notif.read ? 'text-slate-800' : 'text-slate-600'}`}>
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">{timeAgo(notif.created_at)}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 shrink-0"></div>
                      )}
                    </button>
                  ))
                )}
              </div>

              {notifications && notifications.length > 0 && (
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                  <button
                    onClick={() => { setShowNotifDropdown(false); onNavigate?.('sec-notifications'); }}
                    className="text-[10px] font-black text-primary-600 hover:text-primary-800 uppercase tracking-widest"
                  >
                    View all activity
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

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
