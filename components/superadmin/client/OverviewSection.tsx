"use client";

import React from "react";
import {
  Users,
  Building2,
  HandHeart,
  FileText,
  GraduationCap,
  DollarSign,
  Calendar,
  MessageSquare,
  Bell,
  Settings,
  BarChart3,
  UserPlus,
  CheckCircle,
  CreditCard,
} from "lucide-react";

const platformStyles: Record<string, { bg: string; text: string }> = {
  Student: { bg: "bg-blue-100", text: "text-blue-700" },
  College: { bg: "bg-green-100", text: "text-green-700" },
  Provider: { bg: "bg-pink-100", text: "text-pink-700" },
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  Active: { bg: "bg-green-100", text: "text-green-700" },
  Healthy: { bg: "bg-green-100", text: "text-green-700" },
  Degraded: { bg: "bg-amber-100", text: "text-amber-700" },
};

export default function OverviewSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const activities = [
    { action: "New Application Submitted", platform: "Student", user: "Emily Johnson", time: "2 mins ago", icon: FileText, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
    { action: "Institution Admission Updated", platform: "College", user: "MIT Admissions", time: "15 mins ago", icon: Building2, iconBg: "bg-green-50", iconColor: "text-green-600" },
    { action: "Scholarship Created", platform: "Provider", user: "Sowers Action", time: "1 hour ago", icon: HandHeart, iconBg: "bg-purple-50", iconColor: "text-purple-600" },
    { action: "New User Registered", platform: "Student", user: "Anjali Sharma", time: "2 hours ago", icon: UserPlus, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { action: "Event Created", platform: "College", user: "Stanford University", time: "3 hours ago", icon: Calendar, iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
  ];

  const platforms = [
    { label: "Student Portal", status: "Active" as const },
    { label: "Institution Portal", status: "Active" as const },
    { label: "Provider Portal", status: "Active" as const },
    { label: "API Services", status: "Degraded" as const },
    { label: "Database", status: "Healthy" as const },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Super Admin Dashboard</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Overview</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3 xl:w-8/12 flex flex-col gap-6">
          <div className="relative w-full h-[240px] bg-[#0000ff] rounded-2xl overflow-hidden flex items-center">
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-white opacity-[0.04] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white opacity-[0.05] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[240px] w-[240px] bg-white opacity-[0.15] rounded-full translate-x-[35%] pointer-events-none" />
            <div className="relative z-10 px-6 md:px-10 flex flex-col items-start w-full md:max-w-[70%]">
              <div className="flex items-center gap-2 bg-white/20 text-white text-xs md:text-sm font-medium px-3 py-1.5 rounded-md mb-8 w-max shadow-sm">
                <Calendar size={14} />
                <span>May 08, 2026 11:25 am</span>
              </div>
              <h1 className="text-white text-2xl md:text-[28px] leading-tight font-bold tracking-wide mb-2">Welcome back, Super Admin 👋</h1>
              <p className="text-[#cbd0fa] text-sm md:text-[15px] font-medium">Monitor and control all platforms from one place</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
            <StatCard icon={<Users size={24} />} iconBg="bg-blue-50" iconColor="text-blue-600" value="12,847" label="Total Students" change="+15% this month" />
            <StatCard icon={<Building2 size={24} />} iconBg="bg-green-50" iconColor="text-green-600" value="248" label="Total Institutions" change="+5 this month" />
            <StatCard icon={<HandHeart size={24} />} iconBg="bg-purple-50" iconColor="text-purple-600" value="86" label="Total Providers" change="+3 this month" />
            <StatCard icon={<FileText size={24} />} iconBg="bg-amber-50" iconColor="text-amber-600" value="34,562" label="Total Applications" change="+12% this year" />
            <StatCard icon={<GraduationCap size={24} />} iconBg="bg-indigo-50" iconColor="text-indigo-600" value="156" label="Active Scholarships" change="Live on platform" />
            <StatCard icon={<DollarSign size={24} />} iconBg="bg-red-50" iconColor="text-red-600" value="$2.4M" label="Platform Revenue" change="+8% this month" />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Recent Platform Activities</h3>
              <button type="button" className="text-sm text-blue-600 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Platform</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activities.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center shrink-0 ${item.iconColor}`}>
                              <Icon size={14} />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{item.action}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <PlatformBadge label={item.platform} />
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">{item.user}</td>
                        <td className="px-5 py-3 text-sm text-gray-500">{item.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 xl:w-4/12 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Platform Status</h2>
                <p className="text-xs text-gray-500">Current system health</p>
              </div>
            </div>
            <div className="space-y-4">
              {platforms.map((p) => (
                <StatusRow key={p.label} label={p.label} status={p.status} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Quick Actions</h2>
                <p className="text-xs text-gray-500">Common admin tasks</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionButton icon={<Users size={24} />} iconClass="text-blue-600" label="Manage Users" />
              <QuickActionButton icon={<BarChart3 size={24} />} iconClass="text-green-600" label="Analytics" />
              <QuickActionButton icon={<MessageSquare size={24} />} iconClass="text-purple-600" label="Messages" />
              <QuickActionButton icon={<Settings size={24} />} iconClass="text-gray-600" label="Settings" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  iconBg,
  iconColor,
  value,
  label,
  change,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  change: string;
}) {
  const isPercent = change.startsWith("+");
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
          <h3 className="text-xl font-bold text-gray-800">{value}</h3>
        </div>
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
        {isPercent && <span className="text-green-500 font-medium bg-green-50 px-1.5 py-0.5 rounded">{change.split(" ")[0]}</span>}
        <span>{isPercent ? change.substring(change.indexOf(" ") + 1) : change}</span>
      </div>
    </div>
  );
}

function PlatformBadge({ label }: { label: string }) {
  const s = platformStyles[label] || { bg: "bg-gray-100", text: "text-gray-700" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {label}
    </span>
  );
}

function StatusRow({ label, status }: { label: string; status: string }) {
  const dotColor = status === "Active" || status === "Healthy" ? "bg-green-500" : "bg-yellow-500";
  const s = statusStyles[status] || { bg: "bg-gray-100", text: "text-gray-700" };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${dotColor}`} />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>{status}</span>
    </div>
  );
}

function QuickActionButton({ icon, iconClass, label }: { icon: React.ReactNode; iconClass: string; label: string }) {
  return (
    <button type="button" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
      <span className={`${iconClass}`}>{icon}</span>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </button>
  );
}
