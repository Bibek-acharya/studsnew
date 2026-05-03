import { useEffect, useState } from 'react';
import { scholarshipProviderApi, ProviderNotification } from '@/services/scholarshipProviderApi';
import { toast } from 'sonner';
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
  Check, 
  Clock, 
  Filter,
  CheckCircle2} from 'lucide-react';

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

  const getNotifConfig = (type: string) => {
    switch (type) {
      case 'application': 
        return { 
          icon: <FileCheck className="w-5 h-5" />, 
          iconColor: 'text-green-600', 
          bgColor: 'bg-green-50',
          borderColor: 'border-green-100'
        };
      case 'message': 
        return { 
          icon: <Mail className="w-5 h-5" />, 
          iconColor: 'text-blue-600', 
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-100'
        };
      case 'interview': 
        return { 
          icon: <Video className="w-5 h-5" />, 
          iconColor: 'text-purple-600', 
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-100'
        };
      case 'system': 
        return { 
          icon: <Settings className="w-5 h-5" />, 
          iconColor: 'text-slate-600', 
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-100'
        };
      case 'scholarship': 
        return { 
          icon: <GraduationCap className="w-5 h-5" />, 
          iconColor: 'text-amber-600', 
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-100'
        };
      case 'event': 
        return { 
          icon: <Calendar className="w-5 h-5" />, 
          iconColor: 'text-rose-600', 
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-100'
        };
      case 'news': 
        return { 
          icon: <Newspaper className="w-5 h-5" />, 
          iconColor: 'text-cyan-600', 
          bgColor: 'bg-cyan-50',
          borderColor: 'border-cyan-100'
        };
      case 'blog': 
        return { 
          icon: <Pen className="w-5 h-5" />, 
          iconColor: 'text-emerald-600', 
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-100'
        };
      default: 
        return { 
          icon: <Bell className="w-5 h-5" />, 
          iconColor: 'text-slate-500', 
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-100'
        };
    }
  };

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
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] flex items-center justify-center shadow-sm">
              {notifications.filter(n => !n.read).length}
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
              No notifications found in this category. You're all caught up!
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredNotifications.map((notif) => {
              const config = getNotifConfig(notif.type);
              return (
                <div 
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id)}
                  className={`group relative flex gap-4 px-6 py-4 cursor-pointer transition-all rounded-2xl border ${
                    !notif.read 
                      ? 'bg-white border-blue-200 shadow-md shadow-blue-50/50 hover:shadow-lg hover:shadow-blue-100/50' 
                      : 'bg-white/80 border-slate-100 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${config.bgColor} ${config.iconColor} ${config.borderColor} transition-transform group-hover:scale-105`}>
                    {config.icon}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm leading-tight ${!notif.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        {formatDate(notif.created_at)}
                      </span>
                    </div>
                    
                    <p className={`text-sm leading-relaxed line-clamp-2 ${!notif.read ? 'text-slate-800' : 'text-slate-500'}`}>
                      {notif.message}
                    </p>
                  </div>

                  {!notif.read && (
                    <div className="flex items-center ml-2">
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)] animate-pulse" />
                    </div>
                  )}
                  
                  {/* Mark as read button on hover */}
                  {!notif.read && (
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:right-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleMarkRead(notif.id); }}
                        className="w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center transition-all active:scale-95"
                        title="Mark as read"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  )}
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
