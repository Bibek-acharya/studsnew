"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  MessageSquare,
  GraduationCap,
  ClipboardList,
  BookOpen,
  Building2,
  Stethoscope,
  Calendar,
  Newspaper,
  LayoutDashboard,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";

export type InstitutionPage =
  | "overview"
  | "admission"
  | "admissionManage"
  | "program"
  | "collegeProfile"
  | "counselling"
  | "entrance"
  | "events"
  | "newsNotice"
  | "qms"
  | "scholarship"
  | "scholarshipManage"
  | "message"
  | "settings";

interface NavItem {
  id: InstitutionPage;
  label: string;
  icon: React.ElementType;
  category?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
  { id: "collegeProfile", label: "College Profile", icon: Building2 },
  { id: "program", label: "Programs & Courses", icon: BookOpen },
  {
    id: "admission",
    label: "Admission Leads",
    icon: Users,
    category: "Admissions",
  },
  {
    id: "admissionManage",
    label: "Manage Admissions",
    icon: GraduationCap,
    category: "Admissions",
  },
  {
    id: "scholarship",
    label: "Scholarship Apps",
    icon: FileText,
    category: "Admissions",
  },
  {
    id: "scholarshipManage",
    label: "Manage Scholarships",
    icon: BarChart3,
    category: "Admissions",
  },
  {
    id: "entrance",
    label: "Entrance Exams",
    icon: ClipboardList,
    category: "Tools",
  },
  {
    id: "counselling",
    label: "Online Counselling",
    icon: Stethoscope,
    category: "Tools",
  },
  {
    id: "qms",
    label: "Query Management",
    icon: MessageSquare,
    category: "Engagement",
  },
  {
    id: "events",
    label: "Events & Activities",
    icon: Calendar,
    category: "Engagement",
  },
  {
    id: "newsNotice",
    label: "News & Notices",
    icon: Newspaper,
    category: "Engagement",
  },
  { id: "message", label: "Messages", icon: MessageSquare, category: "System" },
  { id: "settings", label: "Settings", icon: Settings, category: "System" },
];

interface InstitutionLayoutProps {
  children: React.ReactNode;
  activePage: InstitutionPage;
  onNavigate: (page: InstitutionPage) => void;
}

const InstitutionLayout: React.FC<InstitutionLayoutProps> = ({
  children,
  activePage,
  onNavigate,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const groupedNavItems = NAV_ITEMS.reduce(
    (acc, item) => {
      const category = item.category || "Main";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, NavItem[]>,
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } transition-all duration-300 bg-white border-r border-slate-200 flex flex-col z-50`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <span className="text-xl font-bold text-blue-600 tracking-tight">
              StudSphere{" "}
              <span className="text-slate-400 font-medium text-sm">Inst.</span>
            </span>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold ml-1">
              S
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          {Object.entries(groupedNavItems).map(([category, items]) => (
            <div key={category} className="space-y-1">
              {isSidebarOpen && (
                <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {category}
                </h3>
              )}
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    activePage === item.id
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon
                    size={20}
                    className={
                      activePage === item.id
                        ? "text-blue-600"
                        : "text-slate-400"
                    }
                  />
                  {isSidebarOpen && (
                    <span className="text-[14px] truncate">{item.label}</span>
                  )}
                  {isSidebarOpen && activePage === item.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div
            className={`flex items-center gap-3 ${isSidebarOpen ? "px-2" : "justify-center"}`}
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200 overflow-hidden">
              <Building2 size={24} />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-900 truncate">
                  Sagarmatha College
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Premium Member
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search leads, applications..."
                className="w-full bg-slate-50 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-slate-50 text-slate-500">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1" />
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium text-slate-700">
                Live Website
              </span>
              <ChevronRight size={14} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
};

export default InstitutionLayout;
