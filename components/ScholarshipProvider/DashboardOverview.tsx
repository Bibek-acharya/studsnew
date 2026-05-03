"use client";

import React, { useState, useEffect, memo, useCallback } from "react";
import {
  FileText,
  GraduationCap,
  FilePen,
  CheckCircle,
  Clock,
  Star,
  UserPlus,
  UserCheck,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  scholarshipProviderApi,
  getCalendarEvents,
  DashboardStats,
  AnalyticsData,
  ProviderScholarship,
  ProviderNotification,
  ProviderCalendarEvent,
} from "@/services/scholarshipProviderApi";

interface DashboardOverviewProps {
  onNavigate?: (section: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = memo(({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [scholarships, setScholarships] = useState<ProviderScholarship[]>([]);
  const [notifications, setNotifications] = useState<ProviderNotification[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<ProviderCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashboardRes, schRes, analyticsRes, notificationsRes, calendarRes] = await Promise.all([
          scholarshipProviderApi.getDashboard(),
          scholarshipProviderApi.getScholarships(1, 50),
          scholarshipProviderApi.getAnalytics(),
          scholarshipProviderApi.getNotifications(1, 5),
          getCalendarEvents(),
        ]);
        setStats(dashboardRes);
        setScholarships(schRes.scholarships);
        setAnalytics(analyticsRes);
        setNotifications(notificationsRes.notifications || []);
        setCalendarEvents(calendarRes || []);
      } catch {
        setStats(null);
        setScholarships([]);
        setAnalytics(null);
        setNotifications([]);
        setCalendarEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalActive = scholarships.filter((s) => ["active", "published"].includes(s.status)).length;
  const totalDraft = scholarships.filter((s) => s.status === "draft").length;
  const shortlistedCount = analytics?.status_breakdown?.shortlisted || 0;
  const unreadMessages = stats?.unread_messages ?? notifications.filter((item) => !item.read).length;
  const applicationTotal = stats?.total_applications ?? analytics?.total_applications ?? 0;
  const scholarshipTotal = stats?.total_scholarships ?? scholarships.length;
  const pendingApplications = stats?.pending_applications ?? 0;
  const interviewsTotal = stats?.total_interviews ?? 0;

  const statCards = [
    { label: "Total Applications", value: applicationTotal.toLocaleString(), icon: FileText, bgColor: "bg-blue-50", iconColor: "text-blue-500", badgePrefix: "Live application data", badgeHighlight: null as string | null, badgeSuffix: "" },
    { label: "Total Scholarships", value: scholarshipTotal.toLocaleString(), icon: GraduationCap, bgColor: "bg-green-50", iconColor: "text-green-500", badgePrefix: `${totalActive} active scholarships`, badgeHighlight: null as string | null, badgeSuffix: "" },
    { label: "Draft", value: totalDraft.toString(), icon: FilePen, bgColor: "bg-yellow-50", iconColor: "text-yellow-600", badgePrefix: "Saved scholarship drafts", badgeHighlight: null, badgeSuffix: "" },
    { label: "Published", value: totalActive.toString(), icon: CheckCircle, bgColor: "bg-purple-50", iconColor: "text-purple-600", badgePrefix: "Live and accepting applications", badgeHighlight: null, badgeSuffix: "" },
    { label: "Pending", value: pendingApplications.toLocaleString(), icon: Clock, bgColor: "bg-orange-50", iconColor: "text-orange-500", badgePrefix: "Awaiting review", badgeHighlight: null, badgeSuffix: "" },
    { label: "Shortlisted", value: shortlistedCount.toString(), icon: Star, bgColor: "bg-pink-50", iconColor: "text-pink-500", badgePrefix: "Shortlisted applications", badgeHighlight: null, badgeSuffix: "" },
    { label: "Interviews", value: interviewsTotal.toString(), icon: UserCheck, bgColor: "bg-slate-50", iconColor: "text-slate-600", badgePrefix: "Scheduled interviews", badgeHighlight: null, badgeSuffix: "" },
    { label: "Unread Messages", value: unreadMessages.toString(), icon: FileText, bgColor: "bg-red-50", iconColor: "text-red-600", badgePrefix: "Inbox activity", badgeHighlight: null, badgeSuffix: "" },
  ];

  const monthLabel = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const calendarDays = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [currentMonth]);

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();
  };

  const prevMonth = () => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const days = calendarDays();
  const sortedCalendarEvents = [...calendarEvents].sort(
    (left, right) => new Date(left.start_date).getTime() - new Date(right.start_date).getTime(),
  );

  const formatShortDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const formatShortTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Overview</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Overview</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column (66%) */}
        <div className="w-full lg:w-2/3 xl:w-8/12 flex flex-col gap-6">
          {/* 6 Mini Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
            {statCards.map((card) => (
              <div key={card.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${card.bgColor} ${card.iconColor} flex items-center justify-center shrink-0`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">{card.label}</p>
                    <h3 className="text-xl font-bold text-gray-800">{card.value}</h3>
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                  {card.badgePrefix}
                  {card.badgeHighlight && (
                    <span className="text-green-500 font-medium bg-green-50 px-1.5 py-0.5 rounded">{card.badgeHighlight}</span>
                  )}
                  {card.badgeSuffix}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (33%) */}
        <div className="w-full lg:w-1/3 xl:w-4/12 flex flex-col gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Recent Notifications</h2>
                <p className="text-xs text-gray-500">Latest provider updates from the backend</p>
              </div>
            </div>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No notifications available.</p>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notification.read ? "bg-gray-100" : "bg-blue-50"}`}>
                      <UserPlus className={`w-4 h-4 ${notification.read ? "text-gray-500" : "text-blue-600"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Calendar</h2>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold text-gray-700 w-32 text-center">{monthLabel}</span>
                <button onClick={nextMonth} className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">{day}</div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => (
                <div key={i} className={`text-center py-1 text-sm ${day ? (isToday(day) ? "bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto" : "text-gray-700 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto cursor-pointer") : ""}`}>
                  {day || ""}
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Upcoming Events</h3>
              <div className="space-y-3">
                {sortedCalendarEvents.length === 0 ? (
                  <p className="text-sm text-gray-500">No calendar events available.</p>
                ) : (
                  sortedCalendarEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="w-1 rounded-full bg-blue-500 shrink-0" />
                      <div className="flex flex-col">
                        <div className="text-gray-800 font-medium text-xs">
                          {formatShortDate(event.start_date)} {formatShortTime(event.start_date)} - {formatShortTime(event.end_date)}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">{event.title}</div>
                        <div className="text-gray-400 text-[0.65rem] mt-0.5">{event.description || "Backend calendar event"}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardOverview.displayName = "DashboardOverview";

export default DashboardOverview;
