"use client";

import React, { useState, useEffect, memo, useCallback } from "react";
import {
  FileText,
  GraduationCap,
  FilePen,
  CheckCircle,
  Clock,
  Star,
  Home,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Calendar,
  Banknote,
  Bookmark,
  Calendar1,
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
import { toast } from "sonner";

interface DashboardOverviewProps {
  onNavigate?: (section: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = memo(({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [scholarships, setScholarships] = useState<ProviderScholarship[]>([]);
  const [notifications, setNotifications] = useState<ProviderNotification[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<ProviderCalendarEvent[]>([]);
  const [providerName, setProviderName] = useState("Hundred group");
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    checkProfile();
  }, []);

  async function checkProfile() {
    try {
      const profile = await scholarshipProviderApi.getProfile();
      if (profile.provider_name) {
        setProviderName(profile.provider_name);
      }
      if (!profile.provider_name || !profile.registration_number) {
        toast.error("Your profile is incomplete—please complete it to continue.", {
          duration: 5000,
        });
      }
    } catch (err) {
      console.error("Failed to check profile", err);
    }
  }

  const totalActive = scholarships.filter((s) => ["active", "published"].includes(s.status)).length;
  const totalDraft = scholarships.filter((s) => s.status === "draft").length;
  const shortlistedCount = analytics?.status_breakdown?.shortlisted || 0;
  const applicationTotal = stats?.total_applications ?? analytics?.total_applications ?? 0;
  const scholarshipTotal = stats?.total_scholarships ?? scholarships.length;
  const pendingApplications = stats?.pending_applications ?? 0;

  const statCards = [
    { label: "Total Applications", value: applicationTotal.toLocaleString(), icon: FileText, bgColor: "bg-blue-50", iconColor: "text-blue-500" },
    { label: "Total Scholarship", value: scholarshipTotal.toLocaleString(), icon: GraduationCap, bgColor: "bg-green-50", iconColor: "text-green-500" },
    { label: "Draft", value: totalDraft.toString(), icon: FilePen, bgColor: "bg-yellow-50", iconColor: "text-yellow-600" },
    { label: "Published", value: totalActive.toString(), icon: CheckCircle, bgColor: "bg-purple-50", iconColor: "text-purple-600" },
    { label: "Pending", value: pendingApplications.toLocaleString(), icon: Clock, bgColor: "bg-orange-50", iconColor: "text-orange-500" },
    { label: "Shortlisted", value: shortlistedCount.toString(), icon: Star, bgColor: "bg-pink-50", iconColor: "text-pink-500" },
  ];

  const activeScholarships = scholarships.filter((s) => ["active", "published"].includes(s.status)).slice(0, 3);

  const formatShortDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const formatShortTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const formatEndDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formattedDateTime = currentTime.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + " • " + currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Build activity feed from notifications (fallback to static if empty)
  const activities = notifications.length > 0
    ? notifications.map((n) => ({
        id: n.id,
        title: n.title,
        subtitle: n.message,
        icon: n.read ? CheckCircle : FileText,
        iconBg: n.read ? "bg-green-50" : "bg-blue-50",
        iconColor: n.read ? "text-green-600" : "text-blue-600",
      }))
    : [
        { id: 1, title: "New volunteer registered", subtitle: "Anjali Sharma • 2 hours ago", icon: FileText, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
        { id: 2, title: "Scholarship approved", subtitle: "#SCH-2026-045 • 5 hours ago", icon: CheckCircle, iconBg: "bg-green-50", iconColor: "text-green-600" },
        { id: 3, title: "New blog post published", subtitle: "Leadership Training • 1 day ago", icon: FileText, iconBg: "bg-purple-50", iconColor: "text-purple-600" },
        { id: 4, title: "User shortlisted", subtitle: "#SCH-2026-078 • 2 days ago", icon: CheckCircle, iconBg: "bg-yellow-50", iconColor: "text-yellow-600" },
        { id: 5, title: "Payment received", subtitle: "Rs 5,000 • 3 days ago", icon: CheckCircle, iconBg: "bg-red-50", iconColor: "text-red-600" },
      ];

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
          {/* Banner Card */}
   
          <div className="relative w-full h-[200px] bg-[#0000ff] rounded-xl overflow-hidden flex items-center">
            <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-white opacity-[0.04] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-white opacity-[0.05] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
            <div className="relative z-10 px-6 md:px-10 flex flex-col items-start w-full md:max-w-[55%]">
              <div className="flex items-center gap-2 text-white/70 text-xs font-medium mb-5 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                <Calendar1 className="w-3.5 h-3.5" />
                <span>{formattedDateTime}</span>
              </div>
              <h1 className="text-white text-xl md:text-2xl leading-tight font-bold tracking-wide mb-1">
                {getGreeting()}, {providerName} 👋 
              </h1>
              <p
                className="text-[#cbd0fa] text-sm md:text-md font-medium mb-4 cursor-pointer hover:text-white transition-colors"
              >
                Ready to reach more students today? Manage and publish your scholarships with StudSphere.
              </p>

            </div>
            <div className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/40 rounded-full pointer-events-none" />
            <div className="absolute right-4 bottom-0 w-[260px] h-[200px] pointer-events-none">
              <img src="/hello.svg" alt="" className="w-full h-full object-contain" />
            </div>
          </div>
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
                
              </div>
            ))}
          </div>

          {/* Active Scholarship Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Active Scholarship</h3>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeScholarships.length === 0 ? (
                <p className="text-sm text-gray-500 col-span-full">No active scholarships.</p>
              ) : (
                activeScholarships.map((scholarship) => (
                  <div key={scholarship.id} className="rounded-xl p-3 w-full border border-gray-100">
                    <div className="mb-3 rounded-lg overflow-hidden h-20 w-full">
                      <img
                        src={scholarship.image_url || scholarship.banner_image || "https://img.freepik.com/free-photo/closeup-shot-beautiful-butterfly-with-interesting-textures-orange-petaled-flower_181624-7640.jpg?semt=ais_hybrid&w=740&q=80"}
                        alt={scholarship.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase">
                        {scholarship.funding_type || "Full Funded"}
                      </span>
                      <span className="bg-orange-50 text-orange-500 px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-orange-500" /> {scholarship.status === "active" || scholarship.status === "published" ? "Open" : scholarship.status}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold text-gray-900 mb-1">{scholarship.title}</h2>
                    <div className="flex items-center text-gray-500 text-[11px] mb-2 font-medium">
                      <Building2 className="w-3 h-3 mr-1" />
                      {scholarship.provider}
                      <svg className="w-3 h-3 ml-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 mb-3 border border-gray-100">
                      <div className="grid grid-cols-[1fr_auto] gap-y-1.5 gap-x-2 text-[11px] text-gray-600">
                        <div className="flex items-center gap-1">
                          <Banknote className="w-3 h-3 text-gray-400" />
                          <span>{scholarship.coverage || scholarship.value || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{scholarship.location}</span>
                        </div>
                        <div className="flex items-center gap-1 col-span-2">
                          <GraduationCap className="w-3 h-3 text-gray-400" />
                          <span>{scholarship.degree_level || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1 col-span-2 text-red-500 font-medium">
                          <Calendar className="w-3 h-3" />
                          <span>Ends: {formatEndDate(scholarship.deadline || scholarship.application_end_date || "")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex-1 border border-gray-300 text-gray-700 font-semibold py-1.5 rounded-md hover:bg-gray-50 text-[11px]">
                        Details
                      </button>
                      <button className="flex-[1.2] bg-[#0014ff] text-white font-semibold py-1.5 rounded-md hover:bg-blue-800 text-[11px]">
                        Applicant
                      </button>
                      <button className="w-8 h-8 border border-gray-300 text-gray-400 hover:text-gray-600 rounded-md flex items-center justify-center shrink-0">
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
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
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center shrink-0`}>
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
                <div key={i} className={`text-center py-1 text-sm ${day ? (isToday(day) ? "bg-blue-600 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center mx-auto cursor-pointer" : "text-gray-700 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto cursor-pointer transition-colors") : ""}`}>
                  {day || ""}
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Today: <span className="font-medium text-gray-800">{todayStr}</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardOverview.displayName = "DashboardOverview";

export default DashboardOverview;
