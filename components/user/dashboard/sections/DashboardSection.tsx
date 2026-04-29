'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Send, 
  Bookmark, 
  Award, 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Check, 
  X, 
  SkipForward, 
  PieChart,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { apiService, DashboardStats, RecentApplicationItem, CalendarEventItem } from '@/services/api'
import { useAuth } from '@/services/AuthContext'

export default function DashboardSection() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentApps, setRecentApps] = useState<RecentApplicationItem[]>([])
  const [events, setEvents] = useState<CalendarEventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes, eventsRes] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getRecentApplications(),
          apiService.getCalendarEvents(),
        ])
        setStats(statsRes.data)
        setRecentApps(appsRes.data.applications)
        setEvents(eventsRes.data)
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
  const rawDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay()
  const firstDay = rawDay === 0 ? 6 : rawDay - 1
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate()

  const calendarDays: { day: number; isCurrentMonth: boolean; hasEvent: boolean }[] = []
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false, hasEvent: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, isCurrentMonth: true, hasEvent: eventDates.has(d) })
  }
  while (calendarDays.length < 42) {
    const nextDay = calendarDays.length - (firstDay + daysInMonth) + 1
    calendarDays.push({ day: nextDay, isCurrentMonth: false, hasEvent: false })
  }

  if (loading) {
    return (
      <div id="view-dashboard" className="max-w-350 mx-auto mt-6 flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#0000ff]" />
      </div>
    )
  }

  if (error) {
    return (
      <div id="view-dashboard" className="max-w-350 mx-auto mt-6 flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div id="view-dashboard" className="max-w-350 mx-auto mt-6">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column (Main Content) */}
        <div className="flex-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-md p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-widest">Profile completion</p>
                <h2 className="text-xl font-bold text-slate-900 mt-2">{stats?.profile_completion ?? 85}% complete</h2>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/user/dashboard/profile" className="rounded-full bg-[#0000ff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0000e6] transition-colors">
                  Complete your profile
                </Link>
                <span className="text-sm text-slate-500">Add missing details to unlock personalized recommendations.</span>
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-full bg-slate-100 h-3">
              <div className="h-3 rounded-full bg-[#0000ff]" style={{ width: `${stats?.profile_completion ?? 85}%` }} />
            </div>
          </div>

          {/* Banner Section */}
          <div className="bg-[#4444ff] rounded-md overflow-hidden relative border border-[#0000ff]">
            <div className="p-8 md:p-10 lg:w-2/3 relative z-10">
              <h1 className="text-3xl font-bold text-white mb-4">Hello {user?.first_name || 'Katie'}!</h1>
              <p className="text-white/90 text-lg leading-relaxed mb-6 max-w-md">
                {stats ? `You have ${stats.applications_submitted} application${stats.applications_submitted !== 1 ? 's' : ''} submitted. Let's keep exploring!` : 'Explore colleges and scholarships that match your profile.'}
              </p>
              <Link href="/user/dashboard/applications" className="inline-block text-white border-b border-white hover:text-white/80 hover:border-white/80 transition-colors pb-0.5 font-medium">
                view applications
              </Link>
            </div>

            {/* SVG Illustration */}
            <div className="hidden lg:block absolute right-0 bottom-0 top-0 w-1/3 pointer-events-none">
              <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-8 bottom-0 h-[110%] object-contain origin-bottom object-bottom-right">
                {/* Girl's Body / Shirt */}
                <path d="M120 200 C120 120 160 80 220 80 C260 80 290 110 300 200 Z" fill="#FFE5EC" />
                {/* Neck */}
                <rect x="200" y="60" width="20" height="30" fill="#FFD1BA" />
                {/* Head */}
                <circle cx="210" cy="45" r="30" fill="#FFD1BA" />
                {/* Hair Back */}
                <path d="M180 45 C180 10 240 10 240 45 L250 80 C250 90 230 90 220 80 Z" fill="#2D3748" />
                {/* Hair Front/Bangs */}
                <path d="M175 40 Q210 10 245 40 Q210 25 175 40 Z" fill="#1A202C" />
                <circle cx="200" cy="40" r="2" fill="#1A202C" /> {/* Eye */}
                <path d="M215 50 Q220 55 225 50" stroke="#E2A082" strokeWidth="2" strokeLinecap="round" /> {/* Smile */}
                
                {/* Skirt */}
                <path d="M140 200 L280 200 L280 170 C280 170 210 160 140 170 Z" fill="#FF8FA3" />
                
                {/* Laptop Back (Screen) */}
                <rect x="30" y="50" width="110" height="75" rx="6" fill="#F8FAFC" transform="rotate(-15 30 50)" />
                {/* Laptop Screen Inner */}
                <rect x="38" y="58" width="94" height="59" rx="2" fill="#E2E8F0" transform="rotate(-15 30 50)" />
                {/* Laptop Logo */}
                <circle cx="95" cy="80" r="6" fill="white" />
                
                {/* Laptop Base */}
                <path d="M25 125 L145 93 L165 98 L45 130 Z" fill="#FFFFFF" />
                
                {/* Arm holding laptop */}
                <path d="M210 95 C180 120 150 140 120 130" stroke="#FFE5EC" strokeWidth="22" strokeLinecap="round" />
                <path d="M210 95 C180 120 150 140 120 130" stroke="#FFD1BA" strokeWidth="22" strokeLinecap="round" strokeDasharray="0 100" strokeDashoffset="-80" />
                
                {/* Hand on laptop base */}
                <circle cx="110" cy="125" r="12" fill="#FFD1BA" />
                
                {/* Other Arm (resting) */}
                <path d="M240 100 C260 140 250 170 210 160" stroke="#FFE5EC" strokeWidth="20" strokeLinecap="round" />
                <path d="M215 159 L210 160" stroke="#FFD1BA" strokeWidth="20" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-md flex items-center justify-center">
                  <Send className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Completed</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.applications_submitted ?? 5}</h3>
              <p className="text-gray-500 text-sm">Applications Submitted</p>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#0000ff]/10 text-[#0000ff] rounded-md flex items-center justify-center">
                  <Bookmark className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-[#0000ff] bg-[#0000ff]/10 px-2 py-1 rounded-md">Shortlisted</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.saved_colleges ?? 12}</h3>
              <p className="text-gray-500 text-sm">Saved Colleges</p>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-md flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">Active</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.scholarships_applied ?? 3}</h3>
              <p className="text-gray-500 text-sm">Scholarships Applied</p>
            </div>
          </div>

          {/* Recent Activity & Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Applications */}
            <div className="bg-white border border-gray-200 rounded-md flex flex-col">
              <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Recent Applications</h3>
                <button className="text-sm text-[#0000ff] hover:underline font-medium">View All</button>
              </div>
              <div className="p-0 flex-1">
                {recentApps.length > 0 ? recentApps.map((app, idx) => {
                  const statusColor = app.status === 'Submitted' || app.status === 'submitted'
                    ? 'bg-green-50 text-green-600'
                    : app.status === 'Draft' || app.status === 'draft'
                    ? 'bg-orange-50 text-orange-600'
                    : 'bg-blue-50 text-blue-600'
                  return (
                    <div key={app.id} className={`flex items-center justify-between p-5 ${idx < recentApps.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                      <div>
                        <p className="font-bold text-gray-800">{app.institution}</p>
                        <p className="text-xs text-gray-500 mt-1">{app.program}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${statusColor}`}>{app.status}</span>
                    </div>
                  )
                }) : (
                  <div className="p-5 text-sm text-gray-500">No recent applications.</div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column (Calendar Component) */}
        <div className="w-full xl:w-90 shrink-0 space-y-4">
          {/* Main Calendar Card */}
          <div className="bg-white border border-gray-200 rounded-md p-6">
            {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <button className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 font-bold text-gray-800 text-lg">
                  <CalendarIcon className="w-5 h-5" />
                  {currentMonth} {currentYear}
                </div>
                <button className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Days Row */}
              <div className="grid grid-cols-7 text-center mb-4">
                <span className="text-xs font-medium text-gray-400">Mon</span>
                <span className="text-xs font-medium text-gray-400">Tues</span>
                <span className="text-xs font-medium text-gray-400">Wed</span>
                <span className="text-xs font-medium text-gray-400">Thurs</span>
                <span className="text-xs font-medium text-gray-400">Fri</span>
                <span className="text-xs font-medium text-gray-400">Sat</span>
                <span className="text-xs font-medium text-gray-400">Sun</span>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-7 gap-y-3 text-sm">
                {calendarDays.map((d, i) => (
                  <div key={i} className="flex justify-center">
                    <span className={`w-8 h-8 flex items-center justify-center ${
                      d.isCurrentMonth
                        ? d.hasEvent
                          ? 'rounded-full bg-[#0000ff] text-white font-bold shadow-blue-500/30'
                          : 'text-gray-700'
                        : 'text-gray-300'
                    }`}>
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
          </div>

        </div>
      </div>
    </div>
  )
}
