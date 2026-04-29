'use client'

import React, { useState, useEffect } from 'react'
import { GraduationCap, CalendarCheck, Sparkle, Banknote, ChartBar, CheckCircle, Moon, Bell, Archive, Trash2, X, BellOff, Inbox, ArchiveRestore, Loader2, AlertCircle } from 'lucide-react'
import { apiService, StudentNotificationItem } from '@/services/api'

interface Notification {
  id: number
  title: string
  category: 'following' | 'system' | 'match'
  message: string
  time: string
  unread: boolean
  archived: boolean
  icon: string
}

function computeRelativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return 'just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}h ago`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function getIconComponent(category: string) {
  const icons: Record<string, React.ReactElement> = {
    system: <CheckCircle className="w-5 h-5" />,
    following: <Bell className="w-5 h-5" />,
  }
  return icons[category] || <Bell className="w-5 h-5" />
}

function getIconStyles(category: Notification['category']) {
  const styles = {
    following: { bg: 'bg-sky-100', text: 'text-sky-600' },
    system: { bg: 'bg-gray-100', text: 'text-gray-600' },
    match: { bg: 'bg-pink-100', text: 'text-pink-600' },
  }
  return styles[category] || styles.system
}

function getCategoryTag(category: string) {
  if (category === 'following') {
    return <span className="text-xs font-medium px-2 py-0.5 rounded-md border bg-white text-sky-600 border-sky-200">Following</span>
  } else if (category === 'system') {
    return <span className="text-xs font-medium px-2 py-0.5 rounded-md border bg-white text-gray-600 border-gray-200">System</span>
  }
  return null
}

type TabType = 'all' | 'following' | 'system' | 'archive'

const ARCHIVE_STORAGE_KEY = 'studsphere_archived_notifications'

function getArchivedIds(): number[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(ARCHIVE_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

function setArchivedIds(ids: number[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(ids))
}

export default function NotificationsSection() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [currentTab, setCurrentTab] = useState<TabType>('all')
  const [archivedIds, setArchivedIdsState] = useState<number[]>(getArchivedIds)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await apiService.getStudentNotifications(1, 50)
        const items: StudentNotificationItem[] = res.data?.notifications || []
        setNotifications(items.map(n => ({
          id: n.id,
          title: n.title,
          category: n.type === 'system' ? 'system' as const : 'following' as const,
          message: n.message,
          time: computeRelativeTime(n.created_at),
          unread: !n.read,
          archived: archivedIds.includes(n.id),
          icon: n.type === 'system' ? 'system' : 'following',
        })))
      } catch (err: any) {
        setError(err.message || 'Failed to load notifications')
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  useEffect(() => {
    setArchivedIds(archivedIds)
  }, [archivedIds])

  const markAsRead = async (id: number) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, unread: false } : n
    ))
    try {
      await apiService.markNotificationRead(id)
    } catch { /* ignore */ }
  }

  const toggleArchive = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setArchivedIdsState(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, archived: !n.archived } : n
    ))
  }

  const deleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markAllAsRead = async () => {
    const currentNotifications = getFilteredNotifications()
    setNotifications(prev => prev.map(n => {
      if (currentNotifications.some(cn => cn.id === n.id)) {
        return { ...n, unread: false }
      }
      return n
    }))
    try {
      await apiService.markAllNotificationsRead()
    } catch { /* ignore */ }
  }

  const getFilteredNotifications = () => {
    if (currentTab === 'archive') {
      return notifications.filter(n => n.archived === true)
    }
    return notifications.filter(n => {
      if (n.archived) return false
      if (currentTab === 'all') return true
      return n.category === currentTab
    })
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter(n => n.unread && !n.archived).length

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-slate-500">Loading notifications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => window.location.reload()} className="text-sm text-primary hover:underline">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <header className="flex items-center justify-between px-6 py-5 border-b border-gray-200 sticky top-0 z-10 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-sm font-semibold px-2.5 py-0.5 rounded-full min-w-[28px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </header>

      <nav className="flex gap-8 px-6 border-b border-gray-200 sticky top-[73px] z-10 bg-white/90 backdrop-blur-sm">
        {(['all', 'following', 'system', 'archive'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={`py-4 text-sm font-medium relative transition-colors ${
              currentTab === tab 
                ? 'text-slate-900 font-semibold' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {currentTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-blue-600 rounded-t" />
            )}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5">
              <BellOff className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No notifications</h3>
            <p className="text-sm text-slate-500 max-w-[260px]">
              You&apos;re all caught up!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notif, index) => {
              const iconStyles = getIconStyles(notif.category)
              return (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`group relative flex gap-4 px-6 py-5 cursor-pointer transition-all hover:bg-slate-50 ${
                    notif.unread ? 'bg-blue-50/50' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {notif.unread && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-blue-600 rounded-r" />
                  )}
                  
                  <div className={`w-11 h-11 rounded-md flex items-center justify-center flex-shrink-0 ${iconStyles.bg} ${iconStyles.text}`}>
                    {getIconComponent(notif.category)}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`font-medium ${notif.unread ? 'font-bold text-slate-900' : 'text-slate-800'}`}>
                          {notif.title}
                        </span>
                        {getCategoryTag(notif.category)}
                      </div>
                    </div>
                    
                    <p className={`text-sm ${notif.unread ? 'text-slate-800' : 'text-slate-600'}`}>
                      {notif.message}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-slate-400 font-medium">{notif.time}</span>
                    </div>
                  </div>

                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={(e) => toggleArchive(notif.id, e)}
                      className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 flex items-center justify-center transition-all "
                      title={notif.archived ? "Unarchive" : "Archive"}
                    >
                      {notif.archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => deleteNotification(notif.id, e)}
                      className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-300 flex items-center justify-center transition-all "
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}