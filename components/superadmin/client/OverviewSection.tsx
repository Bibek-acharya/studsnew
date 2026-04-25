"use client";

import React from "react";
import {
  Users,
  Building,
  BookOpen,
  CreditCard,
  CircleAlert,
  GraduationCap,
  ClipboardList,
  Newspaper,
  Calendar,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  CheckCircle,
  FileText,
  MessageSquare,
} from "lucide-react";

export default function OverviewSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const activities = [
    { title: "New student registered", meta: "Anjali Sharma - 2h ago", icon: <UserPlus className="h-4 w-4" />, tone: "blue" as const },
    { title: "College approved", meta: "Sowers College - 5h ago", icon: <CheckCircle className="h-4 w-4" />, tone: "green" as const },
    { title: "New course added", meta: "BBA Program - 1d ago", icon: <FileText className="h-4 w-4" />, tone: "purple" as const },
    { title: "Payment received", meta: "Rs 50,000 - 2d ago", icon: <CreditCard className="h-4 w-4" />, tone: "amber" as const },
    { title: "New inquiry received", meta: "Ramesh Magar - 3d ago", icon: <MessageSquare className="h-4 w-4" />, tone: "red" as const },
  ];

  const accessRows = [
    { initials: "AU", name: "Admin User", email: "admin@sowersaction.org", role: "Administrator", status: "Active", lastActive: "Now" },
    { initials: "EU", name: "Editor User", email: "editor@sowersaction.org", role: "Editor", status: "Active", lastActive: "2 hours ago" },
    { initials: "SM", name: "Scholarship Manager", email: "scholarship@sowersaction.org", role: "Scholarship Manager", status: "Active", lastActive: "1 hour ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <StatCard icon={<Users size={24} />} value="3,847" label="Total Users" change="+12.5% from last month" gradient="from-blue-500 to-blue-600" />
        <StatCard icon={<Building size={24} />} value="12" label="Total Colleges" change="+2 new this month" gradient="from-green-500 to-green-600" />
        <StatCard icon={<BookOpen size={24} />} value="48" label="Total Courses" change="Across all colleges" gradient="from-purple-500 to-purple-600" />
        <StatCard icon={<CreditCard size={24} />} value="Rs 892K" label="Total Revenue" change="+15.3% from last month" gradient="from-orange-500 to-orange-600" />
        <StatCard icon={<CircleAlert size={24} />} value="23" label="Pending Actions" change="Requires attention" gradient="from-red-500 to-red-600" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-1">
          <SimpleStatCard icon={<GraduationCap size={20} className="text-blue-600" />} value="24" label="Active Scholarships" bg="bg-blue-100" />
          <SimpleStatCard icon={<ClipboardList size={20} className="text-green-600" />} value="8" label="Entrance Exams" bg="bg-green-100" />
          <SimpleStatCard icon={<Newspaper size={20} className="text-purple-600" />} value="89" label="News Published" bg="bg-purple-100" />
          <SimpleStatCard icon={<Calendar size={20} className="text-yellow-600" />} value="45" label="Events Organized" bg="bg-yellow-100" />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-bold text-gray-900">Recent Activities</h3>
          <div className="space-y-3">
            {activities.map((item) => (
              <ActivityItem key={item.title} icon={item.icon} title={item.title} sub={item.meta} tone={item.tone} />
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-800">Calendar</h2>
            <div className="flex items-center gap-3 rounded-full bg-blue-50 px-3 py-1">
              <button type="button" className="text-gray-500 hover:text-blue-600">
                <ChevronRight size={16} className="rotate-180" />
              </button>
              <span className="text-xs font-bold text-gray-700">April 2026</span>
              <button type="button" className="text-gray-500 hover:text-blue-600">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400">
              {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }, (_, index) => index + 1).map((day) => (
                <div
                  key={day}
                  className={`flex aspect-square cursor-pointer items-center justify-center rounded-full text-xs transition-all ${
                    day === 24 ? "bg-blue-600 font-bold text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Upcoming Events</h4>
              <NextEventItem color="purple" time="09:00 - 09:45 AM" title="Leadership Training Session" />
              <NextEventItem color="orange" time="11:15 - 12:00 AM" title="Scholarship Review Meeting" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
            <ShieldCheck size={20} className="text-blue-600" /> Current Access Holders
          </h3>
          <button type="button" onClick={() => setActiveSection("access-control")} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
            Manage Access <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-600">User</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Email</th>
                <th className="px-4 py-3 text-center font-bold text-gray-600">Role</th>
                <th className="px-4 py-3 text-center font-bold text-gray-600">Status</th>
                <th className="px-4 py-3 text-center font-bold text-gray-600">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accessRows.map((row) => (
                <AccessRow key={row.email} {...row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  change,
  gradient,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  change: string;
  gradient: string;
}) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg transition-transform hover:-translate-y-1`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">{icon}</div>
        <span className="text-3xl font-extrabold">{value}</span>
      </div>
      <p className="text-sm font-bold opacity-90">{label}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide opacity-75">{change}</p>
    </div>
  );
}

function SimpleStatCard({
  icon,
  value,
  label,
  bg,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>{icon}</div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  tone: "blue" | "green" | "purple" | "amber" | "red";
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colors[tone]}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-gray-900">{title}</p>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{sub}</p>
      </div>
    </div>
  );
}

function NextEventItem({ color, time, title }: { color: "purple" | "orange" | "blue"; time: string; title: string }) {
  const colors = {
    purple: "bg-purple-600",
    orange: "bg-orange-500",
    blue: "bg-blue-500",
  };
  return (
    <div className="flex cursor-pointer gap-4 group">
      <div className={`w-[4px] shrink-0 rounded-full ${colors[color]} transition-all group-hover:scale-y-110`} />
      <div className="flex flex-col">
        <div className="text-[11px] font-bold tracking-tight text-gray-900">{time}</div>
        <div className="mt-0.5 text-xs font-medium text-gray-500 transition-colors group-hover:text-blue-600">{title}</div>
      </div>
    </div>
  );
}

function AccessRow({
  initials,
  name,
  email,
  role,
  status,
  lastActive,
}: {
  initials: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}) {
  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white shadow-sm">
            {initials}
          </div>
          <span className="font-bold text-gray-900">{name}</span>
        </div>
      </td>
      <td className="px-4 py-4 font-medium text-gray-500">{email}</td>
      <td className="px-4 py-4 text-center">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">{role}</span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600">{status}</span>
      </td>
      <td className="px-4 py-4 text-center text-xs font-semibold uppercase text-gray-400">{lastActive}</td>
    </tr>
  );
}
