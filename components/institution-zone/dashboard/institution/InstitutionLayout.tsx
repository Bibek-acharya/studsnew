"use client";
import React, { useState } from "react";
import {
  LayoutDashboard, GraduationCap, HelpCircle, BookOpen, Award, Building2, Users, FileText,
  Megaphone, Calendar, Mail, Settings, LogOut, X, Menu, Search, Bell, ChevronDown, TrendingUp,
} from "lucide-react";

export type InstitutionPage =
  | "overview"
  | "admission"
  | "admissionManage"
  | "qms"
  | "program"
  | "scholarship"
  | "scholarshipManage"
  | "collegeProfile"
  | "counselling"
  | "counsellingSlots"
  | "entrance"
  | "newsNotice"
  | "events"
  | "settings";

interface Props {
  activePage: InstitutionPage;
  onNavigate: (page: InstitutionPage) => void;
  children: React.ReactNode;
}

const InstitutionLayout: React.FC<Props> = ({ activePage, onNavigate, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navItem = (
    page: InstitutionPage,
    icon: React.ReactNode,
    label: string,
    badge?: string
  ) => {
    const isActive = activePage === page;
    return (
      <button
        onClick={() => { onNavigate(page); setSidebarOpen(false); }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md font-medium transition-colors ${
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        {badge && (
          <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs font-bold">{badge}</span>
        )}
      </button>
    );
  };

  const dropdownSection = (
    key: string,
    icon: React.ReactNode,
    label: string,
    items: { page: InstitutionPage; label: string }[]
  ) => {
    const isOpen = openDropdowns[key] || items.some((i) => i.page === activePage);
    return (
      <div>
        <button
          onClick={() => toggleDropdown(key)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
        >
          <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <ul className="pl-11 pr-3 py-1 space-y-1">
            {items.map((item) => (
              <li key={item.page}>
                <button
                  onClick={() => { onNavigate(item.page); setSidebarOpen(false); }}
                  className={`w-full text-left block px-3 py-2 rounded-md text-sm transition-colors ${
                    activePage === item.page
                      ? "text-blue-600 bg-blue-50 font-semibold"
                      : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans h-screen flex overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 z-50 w-72 h-full bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Studsphere</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-500 hover:text-slate-700 p-1 rounded-md bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-2">
            Menu
          </div>

          {navItem("overview", <LayoutDashboard className="w-5 h-5" />, "Overview")}

          {dropdownSection("admission", <GraduationCap className="w-5 h-5" />, "Admission", [
            { page: "admission", label: "Overview" },
            { page: "admissionManage", label: "Manage Program" },
          ])}

          {navItem("qms", <HelpCircle className="w-5 h-5" />, "QMS")}
          {navItem("program", <BookOpen className="w-5 h-5" />, "Program")}

          {dropdownSection("scholarship", <Award className="w-5 h-5" />, "Scholarship", [
            { page: "scholarship", label: "Manage Students" },
            { page: "scholarshipManage", label: "Manage Scholarship" },
          ])}

          {navItem("collegeProfile", <Building2 className="w-5 h-5" />, "College Profile")}

          {dropdownSection("counselling", <Users className="w-5 h-5" />, "Counselling", [
            { page: "counselling", label: "Manage Students" },
            { page: "counsellingSlots", label: "Manage Slots" },
          ])}

          {dropdownSection("entrance", <FileText className="w-5 h-5" />, "Entrance / Exam", [
            { page: "entrance", label: "Add Entrance" },
          ])}

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-6">
            Updates &amp; Comms
          </div>
          {navItem("newsNotice", <Megaphone className="w-5 h-5" />, "News & Notice")}
          {navItem("events", <Calendar className="w-5 h-5" />, "Events")}

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-6">
            System
          </div>
          {navItem("settings", <Settings className="w-5 h-5" />, "Settings")}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => {
              localStorage.removeItem("institutionAuthToken");
              localStorage.removeItem("institutionAuthUser");
              window.location.href = "/institutionZone";
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
          <div className="flex items-center flex-1 gap-4 lg:gap-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 max-w-md hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search across all modules..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-md text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <div className="hidden sm:block w-px h-6 bg-slate-200 mx-2" />
            <button className="flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-bold text-slate-800 leading-none">Admin User</span>
                <span className="text-xs text-slate-500 mt-1">Super Admin</span>
              </div>
              <TrendingUp className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default InstitutionLayout;
