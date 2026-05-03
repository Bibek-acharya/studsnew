import { useEffect, useRef, useState } from 'react';
import { scholarshipProviderApi, ProviderNotification } from '@/services/scholarshipProviderApi';
import { 
  Bell, 
  Settings, 
  GraduationCap, 
  FileCheck, 
  Mail, 
  Video, 
  Calendar, 
  Newspaper, 
  Pen, 
  Clock, 
  Search,
  Menu,
  CheckCircle2
} from 'lucide-react';

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
    setNotifLoading(true);
    try {
      const res = await scholarshipProviderApi.getNotifications(1, 10);
      setNotifications(res.notifications || []);
      setUnreadCount(res.unread_count || 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotifLoading(false);
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

  const getNotifConfig = (type: string) => {
    switch (type) {
      case 'application': 
        return { 
          icon: <FileCheck className="w-4 h-4" />, 
          iconColor: 'text-green-600', 
          bgColor: 'bg-green-50',
          borderColor: 'border-green-100'
        };
      case 'message': 
        return { 
          icon: <Mail className="w-4 h-4" />, 
          iconColor: 'text-blue-600', 
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-100'
        };
      case 'interview': 
        return { 
          icon: <Video className="w-4 h-4" />, 
          iconColor: 'text-purple-600', 
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-100'
        };
      case 'system': 
        return { 
          icon: <Settings className="w-4 h-4" />, 
          iconColor: 'text-slate-600', 
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-100'
        };
      case 'scholarship': 
        return { 
          icon: <GraduationCap className="w-4 h-4" />, 
          iconColor: 'text-amber-600', 
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-100'
        };
      case 'event': 
        return { 
          icon: <Calendar className="w-4 h-4" />, 
          iconColor: 'text-rose-600', 
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-100'
        };
      case 'news': 
        return { 
          icon: <Newspaper className="w-4 h-4" />, 
          iconColor: 'text-cyan-600', 
          bgColor: 'bg-cyan-50',
          borderColor: 'border-cyan-100'
        };
      case 'blog': 
        return { 
          icon: <Pen className="w-4 h-4" />, 
          iconColor: 'text-emerald-600', 
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-100'
        };
      default: 
        return { 
          icon: <Bell className="w-4 h-4" />, 
          iconColor: 'text-slate-500', 
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-100'
        };
    }
  };

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
      case 'sec-notifications': return { title: 'Notification Center', subtitle: "Stay updated with recent activities and system alerts." };
      default: return { title: 'Dashboard', subtitle: 'Manage your organization data.' };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-30 shrink-0">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-slate-500 hover:text-blue-600 focus:outline-none bg-slate-50 p-2 rounded-lg"
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 hidden sm:block tracking-tight">{title}</h1>
          <p className="text-xs text-slate-500 hidden sm:block font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative hidden lg:block">
          <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search students, programs..."
            className="pl-11 pr-4 py-2 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-slate-50/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-5">
          <button
            onClick={() => onNavigate?.('sec-messages')}
            className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Messages"
          >
            <Mail className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => { setShowNotifDropdown(!showNotifDropdown); if (!showNotifDropdown) loadNotifications(); }}
              className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest">Recent Alerts</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <div className="w-6 h-6 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-10 text-center text-slate-400">
                      <Bell className="w-10 h-10 mx-auto mb-2 opacity-20" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {notifications.map(notif => {
                        const config = getNotifConfig(notif.type);
                        return (
                          <button
                            key={notif.id}
                            onClick={() => handleMarkRead(notif.id, notif.link)}
                            className={`w-full text-left p-4 hover:bg-slate-50 transition-all flex gap-3 ${
                              !notif.read ? 'bg-blue-50/20' : ''
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${config.bgColor} ${config.iconColor} ${config.borderColor}`}>
                              {config.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${!notif.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-600'} truncate`}>
                                {notif.title}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 leading-relaxed">
                                {notif.message}
                              </p>
                              <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                <Clock className="w-3 h-3" />
                                {timeAgo(notif.created_at)}
                              </div>
                            </div>
                            {!notif.read && (
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0 animate-pulse"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                  <button
                    onClick={() => { setShowNotifDropdown(false); onNavigate?.('sec-notifications'); }}
                    className="text-[10px] font-bold text-slate-600 hover:text-blue-600 uppercase tracking-widest transition-colors"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
