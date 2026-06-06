"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Building2,
  HandHeart,
  Clock,
  BarChart3,
  MessageSquare,
  Settings,
} from "lucide-react";
import { apiService } from "@/services/api";

export default function OverviewSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const [stats, setStats] = useState({ total_students: 0, total_institutions: 0, total_providers: 0, pending_institutions: 0, pending_providers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getSuperadminDashboardStats()
      .then((res) => {
        if (res?.data) setStats(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => n.toLocaleString();

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

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
                <span>{dateStr} {timeStr}</span>
              </div>
              <h1 className="text-white text-2xl md:text-[28px] leading-tight font-bold tracking-wide mb-2">Welcome back, Super Admin 👋</h1>
              <p className="text-[#cbd0fa] text-sm md:text-[15px] font-medium">Monitor and control all platforms from one place</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
            <StatCard icon={<Users size={24} />} iconBg="bg-blue-50" iconColor="text-blue-600" value={loading ? "..." : fmt(stats.total_students)} label="Total Students" />
            <StatCard icon={<Building2 size={24} />} iconBg="bg-green-50" iconColor="text-green-600" value={loading ? "..." : fmt(stats.total_institutions)} label="Total Institutions" />
            <StatCard icon={<HandHeart size={24} />} iconBg="bg-purple-50" iconColor="text-purple-600" value={loading ? "..." : fmt(stats.total_providers)} label="Total Providers" />
            <StatCard icon={<Clock size={24} />} iconBg="bg-amber-50" iconColor="text-amber-600" value={loading ? "..." : fmt(stats.pending_institutions)} label="Pending Institutions" />
            <StatCard icon={<Clock size={24} />} iconBg="bg-indigo-50" iconColor="text-indigo-600" value={loading ? "..." : fmt(stats.pending_providers)} label="Pending Providers" />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Pending Approvals</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Institutions</span>
                <span className="text-sm font-bold text-amber-600">{loading ? "..." : stats.pending_institutions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Providers</span>
                <span className="text-sm font-bold text-amber-600">{loading ? "..." : stats.pending_providers}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 xl:w-4/12 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Platform Status</h2>
                <p className="text-xs text-gray-500">All systems operational</p>
              </div>
            </div>
            <div className="space-y-4">
              {["Student Portal", "Institution Portal", "Provider Portal", "API Services", "Database"].map((p) => (
                <StatusRow key={p} label={p} status="Operational" />
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
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
          <h3 className="text-xl font-bold text-gray-800">{value}</h3>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{status}</span>
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
