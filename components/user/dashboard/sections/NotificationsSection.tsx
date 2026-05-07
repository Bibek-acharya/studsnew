'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Bell, BellOff, Loader2, AlertCircle } from 'lucide-react'
import { apiService, StudentNotificationItem } from '@/services/api'

type NotifCategory = 'all' | 'deadline' | 'application' | 'message' | 'counselling' | 'scholarship' | 'system'

interface Notification {
  id: number
  title: string
  message: string
  type: string
  time: string
  unread: boolean
}

const categoryDefs: { key: NotifCategory; label: string; bgClass: string; textClass: string; iconBg: string; iconColor: string }[] = [
  { key: 'all', label: 'All', bgClass: 'bg-blue-100 text-blue-700', textClass: 'text-blue-700', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { key: 'deadline', label: 'Deadlines', bgClass: 'bg-red-100 text-red-700', textClass: 'text-red-700', iconBg: 'bg-red-50', iconColor: 'text-red-500' },
  { key: 'application', label: 'Applications', bgClass: 'bg-blue-100 text-blue-700', textClass: 'text-blue-700', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { key: 'message', label: 'Messages', bgClass: 'bg-purple-100 text-purple-700', textClass: 'text-purple-700', iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { key: 'counselling', label: 'Counselling', bgClass: 'bg-indigo-100 text-indigo-700', textClass: 'text-indigo-700', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { key: 'scholarship', label: 'Scholarship', bgClass: 'bg-orange-100 text-orange-700', textClass: 'text-orange-700', iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
  { key: 'system', label: 'System', bgClass: 'bg-gray-100 text-gray-600', textClass: 'text-gray-600', iconBg: 'bg-gray-100', iconColor: 'text-gray-600' },
]

function computeRelativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return 'just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} minutes ago`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} hours ago`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay === 1) return '1 day ago'
  if (diffDay < 7) return `${diffDay} days ago`
  return new Date(dateStr).toLocaleDateString()
}

function getSvgForCategory(cat: NotifCategory): string {
  switch (cat) {
    case 'deadline':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
    case 'application':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>'
    case 'message':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
    case 'counselling':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>'
    case 'scholarship':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>'
    case 'system':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
    default:
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>'
  }
}

function mapTypeToCategory(type: string): NotifCategory {
  const t = type.toLowerCase()
  if (t.includes('deadline')) return 'deadline'
  if (t.includes('application') || t.includes('admission') || t.includes('submitted') || t.includes('document')) return 'application'
  if (t.includes('message') || t.includes('chat')) return 'message'
  if (t.includes('counselling') || t.includes('counsel') || t.includes('session')) return 'counselling'
  if (t.includes('scholarship')) return 'scholarship'
  if (t.includes('system') || t.includes('profile') || t.includes('info')) return 'system'
  return 'system'
}

export default function NotificationsSection() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [currentTab, setCurrentTab] = useState<NotifCategory>('all')

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await apiService.getStudentNotifications(1, 50)
        const items: StudentNotificationItem[] = res.data?.notifications || []
        setNotifications(items.map(n => {
          const category = mapTypeToCategory(n.type)
          return {
            id: n.id,
            title: n.title,
            message: n.message,
            type: category,
            time: computeRelativeTime(n.created_at),
            unread: !n.read,
          }
        }))
      } catch (err: any) {
        setError(err.message || 'Failed to load notifications')
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const markAsRead = async (id: number) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, unread: false } : n
    ))
    try {
      await apiService.markNotificationRead(id)
    } catch { /* ignore */ }
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    try {
      await apiService.markAllNotificationsRead()
    } catch { /* ignore */ }
  }

  const filteredNotifications = useMemo(() => {
    if (currentTab === 'all') return notifications
    return notifications.filter(n => n.type === currentTab)
  }, [notifications, currentTab])

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: notifications.length }
    notifications.forEach(n => {
      map[n.type] = (map[n.type] || 0) + 1
    })
    return map
  }, [notifications])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#0000ff]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Notifications</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex overflow-x-auto no-scrollbar gap-1 p-3">
            {categoryDefs.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCurrentTab(cat.key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap flex items-center gap-2 transition-colors ${
                  currentTab === cat.key
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${cat.bgClass}`}>
                  {counts[cat.key] || 0}
                </span>
              </button>
            ))}
          </div>
          <div className="px-4 pb-3 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {currentTab === 'all' ? 'Showing all notifications' : `Showing ${currentTab} notifications`}
            </p>
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
            >
              Mark All Read
            </button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No notifications</h3>
            <p className="text-sm text-gray-500">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map(notif => {
              const catDef = categoryDefs.find(c => c.key === notif.type) || categoryDefs[6]
              return (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 hover:bg-blue-50/50 flex items-start gap-3 transition-colors cursor-pointer ${
                    notif.unread ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${catDef.iconBg}`}>
                    <span
                      className={catDef.iconColor}
                      dangerouslySetInnerHTML={{ __html: getSvgForCategory(notif.type as NotifCategory) }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>
                  {notif.unread && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
