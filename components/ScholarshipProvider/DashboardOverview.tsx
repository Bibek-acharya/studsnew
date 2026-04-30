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
  DollarSign,
  UserCheck,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { scholarshipProviderApi, DashboardStats, ProviderScholarship } from "@/services/scholarshipProviderApi";

interface DashboardOverviewProps {
  onNavigate?: (section: string) => void;
}

const RECENT_ACTIVITIES = [
  { icon: UserPlus, bgColor: "bg-blue-50", iconColor: "text-blue-600", title: "New volunteer registered", subtitle: "Anjali Sharma \u2022 2 hours ago" },
  { icon: CheckCircle, bgColor: "bg-green-50", iconColor: "text-green-600", title: "Scholarship approved", subtitle: "#SCH-2026-045 \u2022 5 hours ago" },
  { icon: FileText, bgColor: "bg-purple-50", iconColor: "text-purple-600", title: "New blog post published", subtitle: "Leadership Training \u2022 1 day ago" },
  { icon: UserCheck, bgColor: "bg-yellow-50", iconColor: "text-yellow-600", title: "User shortlisted", subtitle: "#SCH-2026-078 \u2022 2 days ago" },
  { icon: DollarSign, bgColor: "bg-red-50", iconColor: "text-red-600", title: "Payment received", subtitle: "Rs 5,000 \u2022 3 days ago" },
];

const UPCOMING_EVENTS = [
  { time: "09:00 - 09:45 AM", title: "Leadership Training Session", lead: "Robert Fox", color: "bg-purple-600" },
  { time: "11:15 - 12:00 AM", title: "Scholarship Review Meeting", lead: "Leslie Alexander", color: "bg-orange-500" },
  { time: "02:00 - 03:00 PM", title: "Payment Deadline Review", lead: "Courtney Henry", color: "bg-blue-500" },
];

const DashboardOverview: React.FC<DashboardOverviewProps> = memo(({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scholarships, setScholarships] = useState<ProviderScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashboardRes, schRes] = await Promise.all([
          scholarshipProviderApi.getDashboard(),
          scholarshipProviderApi.getScholarships(1, 50),
        ]);
        setStats(dashboardRes);
        setScholarships(schRes.scholarships);
      } catch {
        setStats(null);
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalActive = scholarships.filter((s) => s.status === "active").length;

  const statCards = [
    { label: "Total Applications", value: stats?.total_applications?.toLocaleString() || "1,247", icon: FileText, bgColor: "bg-blue-50", iconColor: "text-blue-500", badgePrefix: "Increase by ", badgeHighlight: "+8.2%", badgeSuffix: " this month" },
    { label: "Total Scholarship", value: (scholarships.length || 24).toString(), icon: GraduationCap, bgColor: "bg-green-50", iconColor: "text-green-500", badgePrefix: `${totalActive} active scholarships`, badgeHighlight: null as string | null, badgeSuffix: "" },
    { label: "Draft", value: scholarships.filter((s) => s.status === "draft").length.toString() || "3", icon: FilePen, bgColor: "bg-yellow-50", iconColor: "text-yellow-600", badgePrefix: "Pending review", badgeHighlight: null, badgeSuffix: "" },
    { label: "Published", value: totalActive.toString() || "18", icon: CheckCircle, bgColor: "bg-purple-50", iconColor: "text-purple-600", badgePrefix: "Live and accepting applications", badgeHighlight: null, badgeSuffix: "" },
    { label: "Pending", value: stats?.pending_applications?.toLocaleString() || "156", icon: Clock, bgColor: "bg-orange-50", iconColor: "text-orange-500", badgePrefix: "Awaiting review", badgeHighlight: null, badgeSuffix: "" },
    { label: "Shortlisted", value: "89", icon: Star, bgColor: "bg-pink-50", iconColor: "text-pink-500", badgePrefix: "Increase by ", badgeHighlight: "+5.1%", badgeSuffix: " this month" },
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

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Overview</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column (66%) */}
        <div className="w-full lg:w-2/3 xl:w-8/12 flex flex-col gap-6">
          {/* 6 Mini Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
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
                <h2 className="text-lg font-bold text-gray-800">Recent Activities</h2>
                <p className="text-xs text-gray-500">Latest updates and actions</p>
              </div>
            </div>
            <div className="space-y-4">
              {RECENT_ACTIVITIES.map((activity) => (
                <div key={activity.title} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full ${activity.bgColor} flex items-center justify-center shrink-0`}>
                    <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.subtitle}</p>
                  </div>
                </div>
              ))}
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

            {/* Upcoming Events */}
            <div className="border-t border-gray-100 mt-4 pt-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Upcoming Events</h3>
              <div className="space-y-3">
                {UPCOMING_EVENTS.map((event) => (
                  <div key={event.title} className="flex gap-3">
                    <div className={`w-1 rounded-full ${event.color} shrink-0`} />
                    <div className="flex flex-col">
                      <div className="text-gray-800 font-medium text-xs">{event.time}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{event.title}</div>
                      <div className="text-gray-400 text-[0.65rem] mt-0.5">Lead by {event.lead}</div>
                    </div>
                  </div>
                ))}
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
