"use client";

import React, { useState } from "react";
import { 
  Users, 
  Settings, 
  LayoutDashboard, 
  Search, 
  Bell, 
  LogOut, 
  ChevronRight,
  TrendingUp,
  Activity,
  ShieldCheck,
  Menu,
  X,
  FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSuperadminAuth } from "@/services/SuperadminAuthContext";

const SuperadminDashboard = () => {
  const router = useRouter();
  const { admin, logout } = useSuperadminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    router.push("/superadmin/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", active: true, path: "/superadmin" },
    { icon: FileText, label: "News & Blogs", active: false, path: "/superadmin/blogs" },
    { icon: Users, label: "Affiliates", active: false, path: "/superadmin/affiliates" },
    { icon: Search, label: "Global Search", active: false, path: "/superadmin/search" },
    { icon: Activity, label: "System Logs", active: false, path: "/superadmin/logs" },
    { icon: Settings, label: "Control Panel", active: false, path: "/superadmin/settings" },
  ];

  const stats = [
    { label: "Active Nodes", value: "1,284", change: "+12.5%", icon: Activity, color: "text-emerald-500" },
    { label: "Admin Traffic", value: "24.5k", change: "+8.2%", icon: TrendingUp, color: "text-blue-500" },
    { label: "Security Level", value: "Level 4", change: "Stable", icon: ShieldCheck, color: "text-amber-500" },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center shadow-lg shadow-blue-900/40">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">StudSphere</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {menuItems.map((item, id) => (
              <button
                key={id}
                onClick={() => item.path && router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                  item.active 
                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.active && <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
              </button>
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <div className="bg-slate-800/40 rounded-md p-4 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-700 rounded-full ring-2 ring-slate-800 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate">{admin?.first_name || "Superadmin"}</p>
                  <p className="text-xs text-slate-500 truncate">System Overseer</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout Session
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-white">Dashboard Overview</h2>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-full py-2 px-4 w-64">
              <Search className="w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search parameters..." className="bg-transparent border-none outline-none text-xs w-full text-slate-300" />
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 rounded-md border border-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-slate-900" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Welcome Card */}
          <div className="relative group overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[2rem] p-8 md:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <span className="px-3 py-1 bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-md border border-white/5">
                  Secure Access Granted
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
                  Welcome back, <br className="hidden sm:block" /> Administrator.
                </h1>
                <p className="text-blue-100/70 max-w-md">
                  Everything is under control. We&apos;ve processed 14,203 new requests since your last synchronization.
                </p>
              </div>
              <button className="px-8 py-4 bg-white text-blue-900 font-bold rounded-md hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 flex items-center gap-2 shrink-0">
                View Reports
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, id) => (
              <div key={id} className="bg-slate-900/50 border border-slate-800 rounded-md p-6 hover:border-slate-700 transition-all group ">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-md bg-slate-800 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.change.includes('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div 
              onClick={() => router.push("/superadmin/blogs")}
              className="bg-slate-900/50 border border-slate-800 rounded-md p-8 hover:border-blue-500/30 transition-all group cursor-pointer relative overflow-hidden shrink-0"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors" />
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 rounded-md bg-blue-600/10 text-blue-500 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" />
                </div>
                <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Editorial Console</h3>
              <p className="text-slate-500 text-sm">Post news, edit blogs, and manage campus announcements across the platform.</p>
              <div className="mt-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active System</span>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-md p-8 hover:border-blue-500/30 transition-all group cursor-pointer relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-600/10 transition-colors" />
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 rounded-md bg-orange-600/10 text-orange-500 group-hover:scale-110 transition-transform">
                  <Activity className="w-8 h-8" />
                </div>
                <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-amber-500 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Security Hub</h3>
              <p className="text-slate-500 text-sm">Monitor system logs, manage administrator permissions, and review security entries.</p>
              <div className="mt-6 flex items-center gap-2 text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-widest">Clearance Required</span>
              </div>
            </div>
          </div>

          {/* Table/List Section Placeholder */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-md overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white">Recent Admin Activities</h3>
              <button className="text-sm font-semibold text-blue-500 hover:text-blue-400">View All</button>
            </div>
            <div className="p-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-800/30 transition-colors border-b border-slate-800 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                    {i}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">System configuration updated by node_0{i}</p>
                    <p className="text-xs text-slate-500">24 Oct, 2026 &bull; 14:0{i} PM</p>
                  </div>
                  <div className="hidden sm:block">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase rounded-full border border-emerald-500/20">
                      success
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperadminDashboard;
