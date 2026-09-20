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
  RefreshCw,
} from "lucide-react";
import { apiService } from "@/services/api";
import { superadminAnalyticsApi, UsersAnalytics, SeriesPoint } from "@/services/superadminAnalyticsApi";

type RangeKey = "24h" | "7d" | "30d";

const RANGE_TABS: { key: RangeKey; label: string; daysBack: number }[] = [
  { key: "24h", label: "24h", daysBack: 0 },
  { key: "7d", label: "7d", daysBack: 6 },
  { key: "30d", label: "30d", daysBack: 29 },
];

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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

          <UserAnalyticsCard />
        </div>

        <div className="w-full lg:w-1/3 xl:w-4/12 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Quick Actions</h2>
                <p className="text-xs text-gray-500">Common admin tasks</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionButton icon={<Users size={24} />} iconClass="text-blue-600" label="Manage Users" onClick={() => setActiveSection("user-management")} />
              <QuickActionButton icon={<BarChart3 size={24} />} iconClass="text-green-600" label="Analytics" onClick={() => setActiveSection("analytics")} />
              <QuickActionButton icon={<MessageSquare size={24} />} iconClass="text-purple-600" label="Messages" onClick={() => setActiveSection("message-inquiry")} />
              <QuickActionButton icon={<Settings size={24} />} iconClass="text-gray-600" label="Settings" onClick={() => setActiveSection("settings")} />
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

function QuickActionButton({
  icon,
  iconClass,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 active:bg-blue-100 active:scale-[0.97] cursor-pointer transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
    >
      <span className={`${iconClass}`}>{icon}</span>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </button>
  );
}

function UserAnalyticsCard() {
  const [range, setRange] = useState<RangeKey>("7d");
  const [attempt, setAttempt] = useState(0);
  const [data, setData] = useState<UsersAnalytics | null>(null);
  const [error, setError] = useState(false);
  const [loadedRange, setLoadedRange] = useState<RangeKey | null>(null);

  useEffect(() => {
    let active = true;
    const tab = RANGE_TABS.find((t) => t.key === range) ?? RANGE_TABS[1];
    const today = new Date();
    const from = new Date(today);
    from.setDate(from.getDate() - tab.daysBack);
    superadminAnalyticsApi.getUsers(toISODate(from), toISODate(today))
      .then((res) => {
        if (!active) return;
        setData(res?.data ?? null);
        setError(false);
      })
      .catch(() => {
        if (!active) return;
        setData(null);
        setError(true);
      })
      .finally(() => {
        if (active) setLoadedRange(range);
      });
    return () => {
      active = false;
    };
  }, [range, attempt]);

  const loading = loadedRange !== range;

  const series: SeriesPoint[] = data?.series ?? [];
  const sumValues = (key: string) => series.reduce((acc, p) => acc + (p.values?.[key] ?? 0), 0);

  const newStudents = sumValues("students");
  const newInstitutions = sumValues("institutions");
  const newProviders = sumValues("providers");
  const active7d = data?.totals?.active_7d ?? 0;
  const activationPct = data?.totals?.activation_pct ?? 0;

  const buckets = series.map((p) => ({
    label: p.bucket,
    total: (p.values?.students ?? 0) + (p.values?.institutions ?? 0) + (p.values?.providers ?? 0),
    students: p.values?.students ?? 0,
    institutions: p.values?.institutions ?? 0,
    providers: p.values?.providers ?? 0,
  }));
  const maxTotal = Math.max(...buckets.map((b) => b.total), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">User Analytics</h3>
          <p className="text-xs text-gray-500">New signups and activation</p>
        </div>
        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100 w-max">
          {RANGE_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setRange(t.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                range === t.key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-5 space-y-4 animate-pulse">
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 bg-gray-50 rounded-lg" />
            ))}
          </div>
          <div className="h-20 bg-gray-50 rounded-lg" />
        </div>
      ) : error ? (
        <div className="p-8 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-gray-500">Failed to load user analytics.</p>
          <button
            type="button"
            onClick={() => {
              setAttempt((a) => a + 1);
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : (
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <RangeStat icon={<Users size={16} />} color="text-blue-600" bg="bg-blue-50" label="New Students" value={newStudents} />
            <RangeStat icon={<Building2 size={16} />} color="text-green-600" bg="bg-green-50" label="New Institutions" value={newInstitutions} />
            <RangeStat icon={<HandHeart size={16} />} color="text-purple-600" bg="bg-purple-50" label="New Providers" value={newProviders} />
          </div>

          {buckets.length > 0 ? (
            <div className="flex items-end gap-1 h-20" role="img" aria-label={`New signups per day over ${range}`}>
              {buckets.map((b, i) => (
                <div
                  key={b.label ?? i}
                  title={`${b.label}: ${b.students} students, ${b.institutions} institutions, ${b.providers} providers`}
                  className="flex-1 flex flex-col justify-end items-stretch min-w-[4px] group"
                >
                  <div
                    className="w-full rounded-t-sm bg-blue-500/80 group-hover:bg-blue-600 transition-colors"
                    style={{ height: `${Math.max((b.total / maxTotal) * 100, b.total > 0 ? 6 : 2)}%` }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-20 flex items-center justify-center text-sm text-gray-400">No signup activity in this period.</div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-xs font-medium text-gray-500">Active (7d)</span>
              <span className="text-sm font-bold text-gray-800">{active7d.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-xs font-medium text-gray-500">Activation</span>
              <span className="text-sm font-bold text-gray-800">{activationPct}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RangeStat({
  icon,
  color,
  bg,
  label,
  value,
}: {
  icon: React.ReactNode;
  color: string;
  bg: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-full ${bg} ${color} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
        <h4 className="text-lg font-bold text-gray-800">{value.toLocaleString()}</h4>
      </div>
    </div>
  );
}
