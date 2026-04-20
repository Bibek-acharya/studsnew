'use client'

import React, { useState } from 'react'
import { GraduationCap, CalendarCheck, Sparkle, Banknote, ChartBar, CheckCircle, Moon, Bell, Archive, Trash2, X, BellOff, Inbox, ArchiveRestore } from 'lucide-react'

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

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Application Status Update",
    category: "following",
    message: "Stanford University has updated your application status. View portal for details.",
    time: "10m ago",
    unread: true,
    archived: false,
    icon: "ph-graduation-cap"
  },
  {
    id: 2,
    title: "Midterm Exam Reminder",
    category: "following",
    message: "AP Physics 1 regular exam is in 3 days. Make sure you are prepared!",
    time: "1h ago",
    unread: true,
    archived: false,
    icon: "ph-calendar-check"
  },
  {
    id: 3,
    title: "New College Match!",
    category: "match",
    message: "Based on your profile, you are a 95% match for Cornell University.",
    time: "3h ago",
    unread: false,
    archived: false,
    icon: "ph-sparkle"
  },
  {
    id: 4,
    title: "Scholarship Match!",
    category: "match",
    message: "You match the criteria for the National Merit Scholarship program.",
    time: "Yesterday",
    unread: false,
    archived: false,
    icon: "ph-money"
  },
  {
    id: 5,
    title: "New Poll in Student Hub",
    category: "following",
    message: "Vote for the next virtual campus tour destination.",
    time: "2 days ago",
    unread: false,
    archived: false,
    icon: "ph-chart-bar"
  },
  {
    id: 6,
    title: "Configuration Complete",
    category: "system",
    message: "Congratulations! You have successfully created your Studsphere account.",
    time: "3 days ago",
    unread: false,
    archived: false,
    icon: "ph-check-circle"
  },
  {
    id: 7,
    title: "New Feature Added",
    category: "system",
    message: "Dark mode is now available. Check your settings to toggle your theme.",
    time: "4 days ago",
    unread: false,
    archived: false,
    icon: "ph-moon-stars"
  }
]

function getIconComponent(iconName: string) {
  const icons: Record<string, React.ReactElement> = {
    'ph-graduation-cap': <GraduationCap className="w-5 h-5" />,
    'ph-calendar-check': <CalendarCheck className="w-5 h-5" />,
    'ph-sparkle': <Sparkle className="w-5 h-5" />,
    'ph-money': <Banknote className="w-5 h-5" />,
    'ph-chart-bar': <ChartBar className="w-5 h-5" />,
    'ph-check-circle': <CheckCircle className="w-5 h-5" />,
    'ph-moon-stars': <Moon className="w-5 h-5" />,
  }
  return icons[iconName] || <Bell className="w-5 h-5" />
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

export default function NotificationsSection() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [currentTab, setCurrentTab] = useState<TabType>('all')

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ))
  }

  const toggleArchive = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, archived: !n.archived } : n
    ))
  }

  const deleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markAllAsRead = () => {
    const currentNotifications = getFilteredNotifications()
    setNotifications(prev => prev.map(n => {
      if (currentNotifications.some(cn => cn.id === n.id)) {
        return { ...n, unread: false }
      }
      return n
    }))
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
            <h3 className="text-lg font-semibold text-slate-800 mb-2">All caught up!</h3>
            <p className="text-sm text-slate-500 max-w-[260px]">
              There are no {currentTab === 'archive' ? 'archived' : 'new'} notifications for you to review right now.
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
                  
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconStyles.bg} ${iconStyles.text}`}>
                    {getIconComponent(notif.icon)}
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
                      className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 flex items-center justify-center transition-all shadow-sm"
                      title={notif.archived ? "Unarchive" : "Archive"}
                    >
                      {notif.archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => deleteNotification(notif.id, e)}
                      className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-300 flex items-center justify-center transition-all shadow-sm"
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