import React, { useEffect, useState } from 'react';
import { scholarshipProviderApi, ProviderNotification } from '@/services/scholarshipProviderApi';
import { toast } from 'sonner';

const Notifications = () => {
  const [notifications, setNotifications] = useState<ProviderNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [activeTab, setActiveTab] = useState('All');

  const TABS = ['All', 'system', 'scholarship', 'application', 'message', 'interview', 'event', 'news', 'blog'];

  const filteredNotifications = activeTab === 'All' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  useEffect(() => {
    loadNotifications(1);
  }, []);

  async function loadNotifications(page: number) {
    setLoading(true);
    try {
      const res = await scholarshipProviderApi.getNotifications(page, 20);
      setNotifications(res.notifications || []);
      setMeta(res.meta || { total: 0, page: 1, limit: 20 });
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id: number) {
    try {
      await scholarshipProviderApi.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch {
      // ignore
    }
  }

  async function handleMarkAllRead() {
    try {
      await scholarshipProviderApi.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  }

  function getNotifIcon(type: string): string {
    switch (type) {
      case 'application': return 'fa-file-circle-check text-green-500 bg-green-50';
      case 'message': return 'fa-envelope text-blue-500 bg-blue-50';
      case 'interview': return 'fa-video text-purple-500 bg-purple-50';
      case 'system': return 'fa-gear text-slate-500 bg-slate-50';
      case 'scholarship': return 'fa-graduation-cap text-amber-500 bg-amber-50';
      case 'event': return 'fa-calendar-star text-rose-500 bg-rose-50';
      case 'news': return 'fa-newspaper text-cyan-500 bg-cyan-50';
      case 'blog': return 'fa-pen-nib text-emerald-500 bg-emerald-50';
      default: return 'fa-bell text-slate-400 bg-slate-50';
    }
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="w-full min-h-screen bg-white px-4 sm:px-8 pb-8">
      <header className="flex items-center justify-between py-5 sticky top-0 z-10 bg-white">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="bg-primary-600 text-white text-sm font-semibold px-2.5 py-0.5 rounded-full min-w-[28px] flex items-center justify-center">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </div>
        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:text-primary-600 hover:border-primary-200 hover:bg-slate-50 transition-all shadow-sm"
        >
          Mark all as read
        </button>
      </header>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-md mb-6 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all capitalize ${
              activeTab === tab 
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {loading && filteredNotifications.length === 0 ? (
          <div className="py-20 text-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-primary-600"></i>
            <p className="text-sm text-slate-500 mt-4 font-bold uppercase tracking-widest">Fetching alerts...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <i className="fa-regular fa-bell text-3xl text-slate-300"></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No notifications</h3>
            <p className="text-sm text-slate-500 max-w-[260px]">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => handleMarkRead(notif.id)}
                className={`group relative flex gap-4 px-6 py-5 cursor-pointer transition-all hover:bg-slate-50 ${!notif.read ? 'bg-primary-50/20' : ''}`}
              >
                {!notif.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r" />
                )}
                
                <div className={`w-11 h-11 rounded-md flex items-center justify-center flex-shrink-0 ${getNotifIcon(notif.type).split(' ').slice(1).join(' ')}`}>
                  <i className={`fa-solid ${getNotifIcon(notif.type).split(' ')[0]} text-lg`}></i>
                </div>
                
                <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${!notif.read ? 'font-bold text-slate-900' : 'text-slate-800'}`}>
                      {notif.title}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${!notif.read ? 'text-slate-800' : 'text-slate-600'}`}>
                    {notif.message}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-slate-400 font-medium">{formatDate(notif.created_at)}</span>
                  </div>
                </div>

                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  {!notif.read && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleMarkRead(notif.id); }}
                      className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-primary-600 hover:border-slate-300 flex items-center justify-center transition-all"
                      title="Mark as read"
                    >
                      <i className="fa-solid fa-check"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {meta.total > meta.limit && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Showing {notifications.length} of {meta.total} notifications
            </span>
            <div className="flex gap-2">
              <button
                disabled={meta.page === 1}
                onClick={() => loadNotifications(meta.page - 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={meta.page * meta.limit >= meta.total}
                onClick={() => loadNotifications(meta.page + 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold disabled:opacity-50"
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
