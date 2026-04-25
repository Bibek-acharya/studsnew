"use client";

import React, { useState, useEffect, memo, useCallback } from "react";
import {
  FileText,
  CheckCircle,
  Star,
  DollarSign,
  UserX,
  GraduationCap,
  CircleCheck,
  FilePen,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Avatar from "./common/Avatar";
import Badge from "./common/Badge";
import { scholarshipProviderApi, DashboardStats, ProviderScholarship } from "@/services/scholarshipProviderApi";

interface DashboardOverviewProps {
  onNavigate?: (section: string) => void;
}

const RECENT_ACTIVITIES = [
  { icon: UserPlus, bgColor: "bg-blue-100", iconColor: "text-blue-600", title: "New volunteer registered", subtitle: "Anjali Sharma - 2h ago" },
  { icon: CheckCircle, bgColor: "bg-green-100", iconColor: "text-green-600", title: "Scholarship approved", subtitle: "#SCH-2026-045 - 5h ago" },
  { icon: FileText, bgColor: "bg-purple-100", iconColor: "text-purple-600", title: "New blog post published", subtitle: "Leadership Training - 1d ago" },
  { icon: Star, bgColor: "bg-yellow-100", iconColor: "text-yellow-600", title: "User shortlisted", subtitle: "#SCH-2026-078 - 2d ago" },
  { icon: DollarSign, bgColor: "bg-red-100", iconColor: "text-red-600", title: "Payment received", subtitle: "Rs 5,000 - 3d ago" },
];

const UPCOMING_EVENTS = [
  { time: "09:00 - 09:45", period: "AM", title: "Leadership Training Session", lead: "Robert Fox", color: "bg-purple-600" },
  { time: "11:15 - 12:00", period: "AM", title: "Scholarship Review Meeting", lead: "Leslie Alexander", color: "bg-orange-500" },
  { time: "02:00 - 03:00", period: "PM", title: "Payment Deadline Review", lead: "Courtney Henry", color: "bg-blue-500" },
];

const ACCESS_HOLDERS = [
  { name: "Admin User", email: "admin@sowersaction.org", role: "Administrator", roleVariant: "purple" as const, status: "Active", statusVariant: "green" as const, lastActive: "Now" },
  { name: "Editor User", email: "editor@sowersaction.org", role: "Editor", roleVariant: "blue" as const, status: "Active", statusVariant: "green" as const, lastActive: "2 hours ago" },
  { name: "Viewer User", email: "viewer@sowersaction.org", role: "Viewer", roleVariant: "gray" as const, status: "Inactive", statusVariant: "yellow" as const, lastActive: "3 days ago" },
  { name: "Scholarship Manager", email: "scholarship@sowersaction.org", role: "Scholarship Manager", roleVariant: "indigo" as const, status: "Active", statusVariant: "green" as const, lastActive: "1 hour ago" },
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

  const handleNavigate = useCallback(() => {
    onNavigate?.("sec-assign-access");
  }, [onNavigate]);

  const scholarshipStats = [
    { label: "Total Scholarships Listed", value: scholarships.length, icon: GraduationCap, bgColor: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Active Scholarships", value: scholarships.filter((s) => s.status === "active").length, icon: CircleCheck, bgColor: "bg-green-100", iconColor: "text-green-600" },
    { label: "Finished Scholarships", value: scholarships.filter((s) => s.status === "finished").length, icon: CircleCheck, bgColor: "bg-purple-100", iconColor: "text-purple-600" },
    { label: "Draft Scholarships", value: scholarships.filter((s) => s.status === "draft").length, icon: FilePen, bgColor: "bg-yellow-100", iconColor: "text-yellow-600" },
  ];

  const monthLabel = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const calendarDays = (() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  })();

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading dashboard...</div>;
  }

  const statCards = [
    { title: "Total Applications", value: stats?.total_applications?.toLocaleString() || "1,247", change: "+8.2% from last month", icon: FileText, gradient: "from-blue-500 to-blue-600" },
    { title: "Approved Users", value: "156", change: "12.5% approval rate", icon: CheckCircle, gradient: "from-green-500 to-green-600" },
    { title: "Shortlisted", value: "89", change: "+5.1% from last month", icon: Star, gradient: "from-purple-500 to-purple-600" },
    { title: "Paid Users", value: "892", change: "+15.3% from last month", icon: DollarSign, gradient: "from-orange-500 to-orange-600" },
    { title: "Unpaid Users", value: "355", change: "Pending payment", icon: UserX, gradient: "from-red-500 to-red-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <div key={stat.title} className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-5 text-white`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-6 h-6 opacity-75" />
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-sm opacity-90">{stat.title}</p>
            <p className="text-xs opacity-75 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[400px]">
        {/* Scholarship Stats (Vertical) */}
        <div className="lg:col-span-1 space-y-4 min-h-[400px]">
          {scholarshipStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 flex flex-col min-h-[400px]">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Activities</h3>
          <div className="space-y-2 overflow-y-auto pr-1 flex-1 pb-0">
            {RECENT_ACTIVITIES.map((activity) => (
              <div key={activity.title} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full ${activity.bgColor} flex items-center justify-center`}>
                  <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 truncate">{activity.title}</p>
                  <p className="text-[0.65rem] text-slate-500">{activity.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex-shrink-0">
            <h2 className="text-xl font-bold text-slate-800">Calendar</h2>
          </div>

          <div className="px-6 pt-6 pb-4 flex-shrink-0">
            <div className="bg-blue-50 rounded-full flex items-center justify-between p-2">
              <button onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-500 shadow-sm hover:text-blue-600 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-slate-600 text-sm tracking-wide">{monthLabel}</h3>
              <button onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-500 shadow-sm hover:text-blue-600 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 px-6 mb-2 text-center text-[0.85rem] font-semibold text-slate-500 flex-shrink-0">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2 gap-x-1 px-6 pb-4 text-center text-slate-600 place-items-center flex-shrink-0">
            {calendarDays.map((day, i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${day && isToday(day) ? "bg-blue-600 text-white font-bold" : day ? "hover:bg-slate-100 cursor-pointer" : ""}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Upcoming Events */}
          <div className="border-t border-slate-100 flex-1 overflow-y-auto">
            <div className="px-6 py-4">
              <h2 className="text-sm font-bold text-slate-800">Upcoming Events</h2>
            </div>
            <div className="px-6 pb-6 flex flex-col gap-4">
              {UPCOMING_EVENTS.map((event) => (
                <div key={event.title} className="flex gap-3">
                  <div className={`w-[3px] rounded-full ${event.color} shrink-0`} />
                  <div className="flex flex-col">
                    <div className="text-slate-800 font-medium text-xs">{event.time} <span className="text-xs text-slate-500 font-normal">{event.period}</span></div>
                    <div className="text-slate-500 text-xs mt-0.5">{event.title}</div>
                    <div className="text-slate-400 text-[0.7rem] mt-0.5">Lead by <span className="text-teal-500">{event.lead}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Current Access Holders */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" /> Current Access Holders
          </h3>
          <button onClick={handleNavigate} className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
            Manage Access <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Role</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ACCESS_HOLDERS.map((holder) => (
                <tr key={holder.email} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={holder.name} size="sm" />
                      <span className="font-medium text-slate-900">{holder.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{holder.email}</td>
                  <td className="text-center py-3 px-4"><Badge variant={holder.roleVariant}>{holder.role}</Badge></td>
                  <td className="text-center py-3 px-4"><Badge variant={holder.statusVariant}>{holder.status}</Badge></td>
                  <td className="text-center py-3 px-4 text-slate-500">{holder.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

DashboardOverview.displayName = "DashboardOverview";

export default DashboardOverview;
