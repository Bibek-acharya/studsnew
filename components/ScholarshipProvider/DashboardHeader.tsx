import React, { useEffect, useRef, useState } from 'react';
import { scholarshipProviderApi, ProviderNotification } from '@/services/scholarshipProviderApi';

interface HeaderProps {
  toggleSidebar: () => void;
  activeTab: string;
  onNavigate?: (section: string) => void;
  onNotificationUpdate?: () => void;
}

const DashboardHeader = ({ toggleSidebar, activeTab, onNavigate, onNotificationUpdate }: HeaderProps) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState<ProviderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
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
    try {
      const res = await scholarshipProviderApi.getNotifications(1, 10);
      setNotifications(res.notifications);
      setUnreadCount(res.unread_count);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  }

  async function handleMarkRead(id: number, link?: string) {
    try {
      await scholarshipProviderApi.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
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
      setUnreadCount(0);
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

  const getHeaderInfo = () => {
    switch(activeTab) {
      case 'sec-dashboard': return { title: 'Dashboard Overview', subtitle: "Welcome back, here's what's happening today." };
      case 'sec-org-profile': return { title: 'Organization Profile', subtitle: "Manage your institution's public identity." };
      case 'sec-create-scholarship': return { title: 'Create Opportunity', subtitle: "Launch a new scholarship program for students." };
      case 'sec-edit-scholarship': return { title: 'Edit Scholarship', subtitle: "Update your scholarship details." };
      case 'sec-manage-scholarships': return { title: 'Manage Scholarships', subtitle: "Monitor and evaluate all active scholarship programs." };
      case 'sec-applications': return { title: 'Applications Directory', subtitle: "Review and manage all student submissions." };
      case 'sec-student-profile': return { title: 'Applicant File', subtitle: "Detailed evaluation of student submission." };
      case 'sec-interviews': return { title: 'Interviews & Schedules', subtitle: "Track and manage upcoming candidate interviews." };
      case 'sec-reports': return { title: 'Analytics & Reports', subtitle: "Detailed insights and downloadable data sets." };
      case 'sec-settings': return { title: 'System Preferences', subtitle: "Configure your dashboard and notification settings." };
      case 'sec-messages': return { title: 'Messages / Chat', subtitle: "Communicate directly with interested candidates." };
      default: return { title: 'Dashboard', subtitle: 'Manage your organization data.' };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-30 shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-slate-500 hover:text-primary-600 focus:outline-none bg-slate-50 p-2 rounded-lg"
          onClick={toggleSidebar}
        >
          <i className="fa-solid fa-bars text-xl"></i>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 hidden sm:block">{title}</h1>
          <p className="text-sm text-slate-500 hidden sm:block mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative hidden lg:block">
          <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            placeholder="Search students, ID, programs..."
            className="pl-11 pr-4 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-72 bg-slate-50 transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
          <button
            onClick={() => onNavigate?.('sec-messages')}
            className="relative p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
            title="Messages"
          >
            <i className="fa-solid fa-envelope text-xl"></i>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white"></span>
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => { setShowNotifDropdown(!showNotifDropdown); if (!showNotifDropdown) loadNotifications(); }}
              className="relative p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              title="Notifications"
            >
              <i className="fa-solid fa-bell text-xl"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-danger text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Notifications</h3>
                  {unreadCount > 0 && (
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
                    notifications.map(notif => (
                      <button
                        key={notif.id}
                        onClick={() => handleMarkRead(notif.id, notif.link)}
                        className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition flex gap-3 ${
                          !notif.read ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
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

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                    <button
                      onClick={() => { setShowNotifDropdown(false); onNavigate?.('sec-dashboard'); }}
                      className="text-[10px] font-black text-primary-600 hover:text-primary-800 uppercase tracking-widest"
                    >
                      View all activity
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
