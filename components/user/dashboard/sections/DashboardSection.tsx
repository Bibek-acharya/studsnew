'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Bookmark,
  Mail,
  MessageCircle,
  Clock,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  GraduationCap,
  Loader2,
  AlertCircle,
  Activity,
} from 'lucide-react'
import {
  apiService,
  DashboardStats,
  RecentApplicationItem,
  CalendarEventItem,
  StudentNotificationItem,
} from '@/services/api'
import { useAuth } from '@/services/AuthContext'

export default function DashboardSection() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentApps, setRecentApps] = useState<RecentApplicationItem[]>([])
  const [events, setEvents] = useState<CalendarEventItem[]>([])
  const [activities, setActivities] = useState<StudentNotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes, eventsRes, notifRes] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getRecentApplications(),
          apiService.getCalendarEvents(),
          apiService.getStudentNotifications(1, 5),
        ])
        setStats(statsRes.data)
        setRecentApps(appsRes.data.applications)
        setEvents(eventsRes.data)
        setActivities(notifRes.data.notifications)
      } catch {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const eventDates = new Set(
    events.map((e) => {
      const d = new Date(e.start_date)
      return d.getDate()
    }),
  )

  const now = new Date()
  const currentMonth = now.toLocaleString('default', { month: 'long' })
  const currentYear = now.getFullYear()
  const startDay = now.getDay()
  const daysInMonth = new Date(currentYear, now.getMonth() + 1, 0).getDate()
  const daysInPrevMonth = new Date(currentYear, now.getMonth(), 0).getDate()

  const calendarDays: { day: number; isCurrentMonth: boolean; hasEvent: boolean; isToday: boolean }[] = []
  for (let i = startDay - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false, hasEvent: false, isToday: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      isCurrentMonth: true,
      hasEvent: eventDates.has(d),
      isToday: d === now.getDate(),
    })
  }
  while (calendarDays.length < 42) {
    const nextDay = calendarDays.length - (startDay + daysInMonth) + 1
    calendarDays.push({ day: nextDay, isCurrentMonth: false, hasEvent: false, isToday: false })
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const timeAgo = (dateStr: string) => {
    const now2 = new Date()
    const date = new Date(dateStr)
    const diffMs = now2.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hours ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase()
    if (s === 'accepted' || s === 'approved' || s === 'completed') return 'bg-green-100 text-green-700'
    if (s === 'pending') return 'bg-yellow-100 text-yellow-700'
    if (s === 'submitted') return 'bg-blue-100 text-blue-700'
    if (s === 'draft') return 'bg-orange-100 text-orange-700'
    if (s === 'rejected' || s === 'denied') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-600'
  }

  const getCollegeInitial = (name: string) => {
    if (!name) return '?'
    return name.charAt(0).toUpperCase()
  }

  const getInitialBg = (name: string) => {
    const colors = [
      'bg-indigo-100 text-indigo-600',
      'bg-red-100 text-red-600',
      'bg-purple-100 text-purple-600',
      'bg-green-100 text-green-600',
      'bg-blue-100 text-blue-600',
      'bg-orange-100 text-orange-600',
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application': return FileText
      case 'message': return MessageCircle
      case 'bookmark': return Bookmark
      case 'counselling': return CalendarCheck
      case 'scholarship': return GraduationCap
      default: return Activity
    }
  }

  const getActivityIconBg = (type: string) => {
    switch (type) {
      case 'application': return 'bg-blue-50 text-blue-600'
      case 'message': return 'bg-green-50 text-green-600'
      case 'bookmark': return 'bg-purple-50 text-purple-600'
      case 'counselling': return 'bg-yellow-50 text-yellow-600'
      case 'scholarship': return 'bg-red-50 text-red-600'
      default: return 'bg-gray-50 text-gray-500'
    }
  }

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

  const firstName = user?.first_name || 'Student'

  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Overview</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3 xl:w-8/12 flex flex-col gap-6">
          {/* Banner Card */}
          <div className="relative w-full h-[200px] bg-[#0000ff] rounded-xl overflow-hidden flex items-center">
            <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-white opacity-[0.04] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-white opacity-[0.05] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
            <div className="absolute -right-[100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/40 rounded-full pointer-events-none" />
            <div className="absolute right-4 bottom-0 w-[260px] h-[200px] pointer-events-none">
              <img src="/hello.svg" alt="" className="w-full h-full object-contain" />
            </div>
            <div className="relative z-10 px-6 md:px-10 flex flex-col items-start w-full md:max-w-[55%]">
              <div className="flex items-center gap-2 text-white/70 text-xs font-medium mb-5 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>{formattedDate} {formattedTime}</span>
              </div>
              <h1 className="text-white text-xl md:text-2xl leading-tight font-bold tracking-wide mb-1">
                {getGreeting()}, {firstName} 👋
              </h1>
              <p className="text-[#cbd0fa] text-sm md:text-md font-medium">
                Your journey to success starts here.
              </p>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
            {/* Active Applications */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Active Applications</p>
                  <h3 className="text-xl font-bold text-gray-800">{stats?.applications_submitted ?? 0}</h3>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                {stats?.applications_submitted ? (
                  <><span className="text-green-500 font-medium bg-green-50 px-1.5 py-0.5 rounded">+{stats.applications_submitted}</span> total</>
                ) : (
                  <span>No applications yet</span>
                )}
              </div>
            </div>

            {/* Saved Scholarships */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Saved Scholarships</p>
                  <h3 className="text-xl font-bold text-gray-800">{stats?.saved_scholarships ?? 0}</h3>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                {stats?.saved_scholarships ? (
                  <><span className="text-blue-600 font-medium">{stats.saved_scholarships}</span> bookmarked</>
                ) : (
                  <span>No saved scholarships</span>
                )}
              </div>
            </div>

            {/* Active Invities */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Active Invities</p>
                  <h3 className="text-xl font-bold text-gray-800">{stats?.active_invites ?? 0}</h3>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                {stats?.active_invites ? (
                  <><span className="text-purple-500 font-medium bg-purple-50 px-1.5 py-0.5 rounded">{stats.active_invites}</span> pending</>
                ) : (
                  <span>No active invites</span>
                )}
              </div>
            </div>

            {/* New Messages */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-0.5">New Messages</p>
                  <h3 className="text-xl font-bold text-gray-800">{stats?.unread_messages ?? 0}</h3>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                {stats?.unread_messages ? (
                  <><span className="text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded">{stats.unread_messages} unread</span></>
                ) : (
                  <span>No new messages</span>
                )}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Upcoming Deadlines</p>
                  <h3 className="text-xl font-bold text-gray-800">{stats?.upcoming_deadlines ?? 0}</h3>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                {stats?.upcoming_deadlines ? (
                  <><span className="text-red-500 font-medium">{stats.upcoming_deadlines}</span> upcoming</>
                ) : (
                  <span>No upcoming deadlines</span>
                )}
              </div>
            </div>

            {/* Bookmarked Colleges */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Bookmarked Colleges</p>
                  <h3 className="text-xl font-bold text-gray-800">{stats?.saved_colleges ?? 0}</h3>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                {stats?.saved_colleges ? (
                  <><span className="text-green-500 font-medium bg-green-50 px-1.5 py-0.5 rounded">{stats.saved_colleges}</span> bookmarked</>
                ) : (
                  <span>No bookmarked colleges</span>
                )}
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Recent Applications</h3>
              <Link href="/user/dashboard/applications" className="text-sm text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            {recentApps.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">College</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Program</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentApps.map((app, idx) => (
                      <tr key={app.id || idx} className="hover:bg-gray-50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${getInitialBg(app.institution)}`}>
                              {getCollegeInitial(app.institution)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{app.institution || 'Unknown College'}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">{app.program || 'N/A'}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">
                          {new Date(app.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-400">No applications yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/3 xl:w-4/12 flex flex-col gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Recent Activities</h2>
                <p className="text-xs text-gray-500">Latest updates and actions</p>
              </div>
            </div>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.slice(0, 5).map((a, idx) => {
                  const Icon = getActivityIcon(a.type)
                  return (
                    <div key={a.id || idx} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getActivityIconBg(a.type)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{a.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{a.message} • {timeAgo(a.created_at)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-400">No activities yet</p>
              </div>
            )}
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Calendar</h2>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold text-gray-700 w-32 text-center">{currentMonth} {currentYear}</span>
                <button className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((d, i) => (
                <div
                  key={i}
                  className={`text-center text-sm py-2 w-8 h-8 flex items-center justify-center rounded-full ${
                    d.isCurrentMonth
                      ? d.isToday
                        ? 'bg-blue-600 text-white font-semibold cursor-pointer'
                        : d.hasEvent
                          ? 'text-gray-700 hover:bg-blue-50 cursor-pointer font-semibold'
                          : 'text-gray-700 hover:bg-blue-50 cursor-pointer'
                      : 'text-gray-300'
                  }`}
                >
                  {d.day}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span>
                Today:{' '}
                <span className="font-medium text-gray-800">
                  {now.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
