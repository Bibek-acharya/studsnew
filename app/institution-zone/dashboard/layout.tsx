"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  Building2,
  Calendar,
  Bell,
  LineChart,
  Settings,
  MessageSquare,
  Users,
  FileText,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/institution-zone/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/institution-zone/dashboard/admission", label: "Admission Overview", icon: GraduationCap },
  { href: "/institution-zone/dashboard/admission-manage", label: "Manage Program", icon: GraduationCap },
  { href: "/institution-zone/dashboard/program", label: "Programs", icon: FileText },
  { href: "/institution-zone/dashboard/scholarship", label: "Scholarships", icon: Award },
  { href: "/institution-zone/dashboard/college-profile", label: "College Profile", icon: Building2 },
  { href: "/institution-zone/dashboard/counselling", label: "Counselling", icon: Users },
  { href: "/institution-zone/dashboard/entrance", label: "Entrance/Exam", icon: FileText },
  { href: "/institution-zone/dashboard/events", label: "Events", icon: Calendar },
  { href: "/institution-zone/dashboard/news-notice", label: "News & Notices", icon: Bell },
  { href: "/institution-zone/dashboard/qms", label: "QMS", icon: LineChart },
  { href: "/institution-zone/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentTitle = navItems.find(item => item.href === pathname)?.label || "Dashboard";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-inter">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-slate-200 flex flex-col flex-shrink-0 transition-all duration-300`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
            S
          </div>
          {sidebarOpen && (
            <span className="text-xl font-bold text-slate-900 tracking-tight">Studsphere</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => {
              localStorage.removeItem("institutionAuthToken");
              router.push("/institution-zone");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Dashboard</span>
              <span className="text-slate-300 text-xs">/</span>
              <h1 className="text-sm font-semibold text-slate-800">
                {currentTitle}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

import { ChevronLeft } from "lucide-react";