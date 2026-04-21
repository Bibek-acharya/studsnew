'use client'

import { useState, useMemo, useEffect, useRef, ReactNode } from 'react'
import Sidebar from './Sidebar'
import PreferenceModal from './PreferenceModal'
import { Menu, Search, Bell, User, Archive, ArchiveRestore, Trash2, Clock, Settings } from 'lucide-react'

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
  const [preferenceModalOpen, setPreferenceModalOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [currentNotifTab, setCurrentNotifTab] = useState<NotificationTab>('all')
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'New message from Admissions',
      message: 'You have a new update about your application.',
      time: '2m ago',
      type: 'system',
      isFollowing: false,
      isRead: false,
      isArchived: false,
      bgColor: 'bg-blue-50',
      color: 'text-blue-600',
    },
    {
      id: '2',
      title: 'Scholarship deadline reminder',
      message: 'Deadline is tomorrow for the Fulbright scholarship.',
      time: '1h ago',
      type: 'system',
      isFollowing: false,
      isRead: false,
      isArchived: false,
      bgColor: 'bg-amber-50',
      color: 'text-amber-600',
    },
    {
      id: '3',
      title: 'New forum response',
      message: 'Someone replied to your college review thread.',
      time: '3h ago',
      type: 'user',
      isFollowing: true,
      isRead: true,
      isArchived: false,
      bgColor: 'bg-violet-50',
      color: 'text-violet-600',
    },
  ])
  const notificationsRef = useRef<HTMLDivElement | null>(null)

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

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    )
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

  const markAllAsRead = () => {
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
  }

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
            <button
              onClick={() => setPreferenceModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-100 transition-colors"
              title="Update Preferences"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden lg:inline">Preferences</span>
            </button>
            <div ref={notificationsRef} className="relative">
              <button
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
                aria-expanded={notificationsOpen}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[11px] font-bold text-white ">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute top-full right-0 z-50 mt-2 cursor-default font-sans">
                  <div className="absolute -top-1.5 right-5 z-30 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white" />
                  <div className="relative z-20 flex w-[320px] flex-col overflow-hidden rounded-md border border-gray-200 bg-white text-left shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                    <div className="z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        {unreadNotificationCount > 0 && (
                          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white ">
                            {unreadNotificationCount}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={markAllAsRead}
                        className="rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-900"
                      >
                        Mark all as read
                      </button>
                    </div>

                    <div className="no-scrollbar flex gap-4 overflow-x-auto whitespace-nowrap border-b border-gray-50 bg-gray-50/50 px-4 py-2 text-sm">
                      {notificationTabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setCurrentNotifTab(tab)}
                          className={`pb-1 capitalize transition-all ${
                            currentNotifTab === tab
                              ? 'border-b-2 border-blue-600 font-medium text-blue-600'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="no-scrollbar flex max-h-80 flex-col overflow-y-auto">
                      {visibleNotifications.length > 0 ? (
                        visibleNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="group relative flex cursor-pointer items-start gap-3 border-b border-gray-50 bg-white p-3 transition-colors hover:bg-gray-50"
                            onClick={() => markAsRead(notif.id)}
                          >
                            <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notif.bgColor} ${notif.color}`}>
                              <Bell className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0 pr-10">
                              <div className="mb-0.5 flex flex-wrap items-center gap-2">
                                <p className="truncate text-sm font-semibold text-black">
                                  {notif.title}
                                </p>
                                {notif.isFollowing && (
                                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600 whitespace-nowrap">
                                    Following
                                  </span>
                                )}
                              </div>
                              <p className="line-clamp-2 text-sm leading-relaxed text-gray-800">
                                {notif.message}
                              </p>
                              <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
                                <Clock size={12} /> {notif.time}
                              </p>
                            </div>
                            {!notif.isRead && (
                              <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-blue-500"></div>
                            )}
                            <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 transition-all group-hover:opacity-100">
                              <button
                                onClick={(e) => toggleArchive(notif.id, e)}
                                className="rounded-md p-1 px-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                              >
                                {notif.isArchived ? (
                                  <ArchiveRestore size={16} />
                                ) : (
                                  <Archive size={16} />
                                )}
                              </button>
                              <button
                                onClick={(e) => removeNotification(notif.id, e)}
                                className="rounded-md p-1 px-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-slate-500">No notifications.</div>
                      )}
                    </div>

                    <div className="border-t border-gray-100 bg-gray-50/50 p-3">
                      <button className="w-full rounded-md py-2 text-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">
                        View all activity
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <button
                type="button"
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white  border border-blue-700 transition-colors hover:bg-blue-700"
                aria-label="User profile"
              >
                <span className="text-sm font-semibold">KS</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 " />
              </button>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-gray-800 transition-colors">Katie Smith</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-0">
          {children}
        </main>
      </div>

      <PreferenceModal isOpen={preferenceModalOpen} onClose={() => setPreferenceModalOpen(false)} />
    </div>
  )
}
