"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notificationClient } from '@/services/notificationClient';
import { toNotificationItem, type NotificationItem } from '@/features/notifications/types';
import { resolveRoute } from '@/features/notifications/routes';
import { resolveIcon } from '@/components/notifications/icons';
import { toast } from 'sonner';
import {
  Bell,
  Check,
  Clock,
  Filter,
  CheckCircle2} from 'lucide-react';

// Provider inbox on the shared notification client. Pagination contract
// preserved: server-side page/limit with the meta footer. Legacy rows arrive
// through the transition envelope (event_key "" — Task 1's flipped mapping
// already reads legacy `type` as the category); row links resolve through
// routes.ts, which translates the provider legacy slugs.
const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [activeTab, setActiveTab] = useState('All');

  const TABS = ['All', 'system', 'scholarship', 'application', 'message', 'interview', 'event', 'news', 'blog'];

  const filteredNotifications = activeTab === 'All'
    ? notifications
    : notifications.filter(n => n.category === activeTab);

  useEffect(() => {
    loadNotifications(1);
  }, []);

  async function loadNotifications(page: number) {
    setLoading(true);
    try {
      const res = await notificationClient.listNotifications(page, { limit: 20 });
      setNotifications(res.data.notifications.map(toNotificationItem));
      setMeta(res.data.meta);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id: number) {
    try {
      await notificationClient.markRead(id);
      const now = new Date().toISOString();
      setNotifications(prev => prev.map(n => n.id === id && !n.read_at ? { ...n, read_at: now } : n));
    } catch {
      // ignore
    }
  }

  async function handleMarkAllRead() {
    try {
      await notificationClient.markAllRead();
      const now = new Date().toISOString();
      setNotifications(prev => prev.map(n => (n.read_at ? n : { ...n, read_at: now })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;

    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/30 px-4 sm:px-8 pb-8">
      <header className="flex items-center justify-between py-6 ">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h2>
          {notifications.filter(n => !n.read_at).length > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] flex items-center justify-center shadow-sm">
              {notifications.filter(n => !n.read_at).length}
            </span>
          )}
        </div>
        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm active:scale-[0.98]"
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark all as read
        </button>
      </header>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-2">
        <Filter className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
        <div className="flex gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab === 'All' ? 'Everything' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading && filteredNotifications.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest animate-pulse">Syncing alerts...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Bell className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Clean Slate!</h3>
            <p className="text-sm text-slate-500 max-w-[260px] mx-auto">
              No notifications found in this category. You&apos;re all caught up!
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredNotifications.map((notif) => {
              const read = notif.read_at !== null;
              const { icon: Icon, color, bg } = resolveIcon(notif.category, notif.event_key);
              const href = notif.link ? resolveRoute("provider", notif.link) : null;
              const mark = () => { if (!read) void handleMarkRead(notif.id); };
              const rowClass = `group relative flex gap-4 px-6 py-4 cursor-pointer transition-all rounded-2xl border ${
                !read
                  ? 'bg-white border-blue-200 shadow-md shadow-blue-50/50 hover:shadow-lg hover:shadow-blue-100/50'
                  : 'bg-white/80 border-slate-100 hover:bg-white hover:border-slate-200'
              }`;
              const body = (
                <>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-100 ${bg} transition-transform group-hover:scale-105`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>

                  <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm leading-tight ${!read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        {formatDate(notif.created_at)}
                      </span>
                    </div>

                    <p className={`text-sm leading-relaxed line-clamp-2 ${!read ? 'text-slate-800' : 'text-slate-500'}`}>
                      {notif.body}
                    </p>
                  </div>

                  {!read && (
                    <div className="flex items-center ml-2">
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)] animate-pulse" />
                    </div>
                  )}

                  {/* Mark as read button on hover */}
                  {!read && (
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:right-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); void handleMarkRead(notif.id); }}
                        className="w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center transition-all active:scale-95"
                        title="Mark as read"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              );
              return href ? (
                <Link key={notif.id} href={href} onClick={mark} className={rowClass}>
                  {body}
                </Link>
              ) : (
                <div key={notif.id} onClick={mark} className={rowClass}>
                  {body}
                </div>
              );
            })}
          </div>
        )}

        {meta.total > meta.limit && (
          <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {notifications.length} of {meta.total} alerts
            </span>
            <div className="flex gap-2">
              <button
                disabled={meta.page === 1}
                onClick={() => loadNotifications(meta.page - 1)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-100 transition-all"
              >
                Previous
              </button>
              <button
                disabled={meta.page * meta.limit >= meta.total}
                onClick={() => loadNotifications(meta.page + 1)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-100 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
