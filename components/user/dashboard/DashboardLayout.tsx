'use client'

import { useState, useMemo, useEffect, useRef, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import Link from 'next/link'
import { Menu, Search, Bell, Clock } from 'lucide-react'
import { apiService, getImageUrl } from '@/services/api'
import { useAuth } from '@/services/AuthContext'

interface DashboardLayoutProps {
  children: ReactNode
}

type NotificationTab = 'all' | 'following' | 'system' | 'archive'

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  type: 'system' | 'user'
  isFollowing?: boolean
  isRead: boolean
  isArchived: boolean
  bgColor: string
  color: string
}

const notificationTabs: NotificationTab[] = ['all', 'following', 'system', 'archive']

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [currentNotifTab, setCurrentNotifTab] = useState<NotificationTab>('all')
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [notifLoading, setNotifLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const notificationsRef = useRef<HTMLDivElement | null>(null)

  const initials = useMemo(() => {
    if (!user) return 'KS'
    return ((user.first_name?.[0] || '') + (user.last_name?.[0] || '')).toUpperCase() || 'U'
  }, [user])

  const statusLabels: Record<string, string> = {
    see_graduate: "SEE Graduate",
    plus_two_running: "+2 Running",
    plus_two_graduate: "+2 Graduate",
  };

  const profileLabel = useMemo(() => {
    if (!user) return "Student";
    if (user.role === "admin") return "Admin";
    if (user.current_status && statusLabels[user.current_status]) {
      return statusLabels[user.current_status];
    }
    return "Student";
  }, [user]);

  const timeAgo = (dateStr: string) => {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 30) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const visibleNotifications = useMemo(
    () =>
      notifications.filter((notification) => {
        if (currentNotifTab === 'all') return !notification.isArchived
        if (currentNotifTab === 'following')
          return !notification.isArchived && notification.isFollowing
        if (currentNotifTab === 'system')
          return !notification.isArchived && notification.type === 'system'
        if (currentNotifTab === 'archive') return notification.isArchived
        return !notification.isArchived
      }),
    [currentNotifTab, notifications],
  )

  const unreadNotificationCount = useMemo(
    () =>
      notifications.filter((notification) => !notification.isRead && !notification.isArchived).length,
    [notifications],
  )

  const markAsRead = async (id: string) => {
    try {
      await apiService.markNotificationRead(Number(id))
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      )
    } catch {
      // ignore
    }
  }

  const toggleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isArchived: !notification.isArchived }
          : notification,
      ),
    )
  }

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsRead()
      setNotifications((prev) =>
        prev.map((notification) => {
          if (currentNotifTab === 'all' && !notification.isArchived)
            return { ...notification, isRead: true }
          if (currentNotifTab === 'following' && !notification.isArchived && notification.isFollowing)
            return { ...notification, isRead: true }
          if (currentNotifTab === 'system' && !notification.isArchived && notification.type === 'system')
            return { ...notification, isRead: true }
          if (currentNotifTab === 'archive' && notification.isArchived)
            return { ...notification, isRead: true }
          return notification
        }),
      )
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiService.getStudentNotifications()
        const mapped: NotificationItem[] = res.data.notifications.map((n) => ({
          id: String(n.id),
          title: n.title,
          message: n.message,
          time: n.created_at,
          type: n.type === 'system' ? 'system' : 'user',
          isFollowing: false,
          isRead: n.read,
          isArchived: false,
          bgColor: n.type === 'system' ? 'bg-blue-50' : 'bg-violet-50',
          color: n.type === 'system' ? 'text-blue-600' : 'text-violet-600',
        }))
        setNotifications(mapped)
      } catch {
        // ignore
      } finally {
        setNotifLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden text-gray-800">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              id="menu-toggle" 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-[#0000ff]"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="relative hidden md:block w-64 lg:w-96">
              <input
                type="text"
                placeholder="Search colleges, courses, scholarships..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] text-sm transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px]" />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <Link
              href="/user/dashboard/notifications"
              className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[11px] font-bold text-white ">
                    {unreadNotificationCount}
                  </span>
                )}
              </Link>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <button
                type="button"
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white border border-blue-700 transition-colors hover:bg-blue-700"
                aria-label="User profile"
              >
                {user?.image_url ? (
                  <img src={getImageUrl(user.image_url)} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-sm font-semibold">{initials}</span>
                )}
                <span className="absolute -bottom-0.5 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 " />
              </button>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-gray-800 transition-colors">{user?.first_name || 'User'} {user?.last_name || ''}</p>
                <p className="text-xs text-gray-500">{profileLabel}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-0">
          {children}
        </main>
      </div>

      {/* <PreferenceModal isOpen={preferenceModalOpen} onClose={() => setPreferenceModalOpen(false)} /> */}
    </div>
  )
}
