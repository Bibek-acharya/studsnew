"use client";

import React, { useState, useMemo } from "react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar as CalendarIcon, 
  Mail, 
  UserCircle, 
  UserCheck, 
  Bookmark, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Plus,
  Video,
  Target,
  HelpCircle,
  Briefcase,
  Check,
  Search,
  Star
} from "lucide-react";

// --- Configuration & Data for Calendar ---
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const EVENT_TYPES = {
  exam: {
    label: "Exams",
    color: "#fca5a5",
    bg: "bg-red-100",
    text: "text-red-700",
  },
  deadline: {
    label: "Deadlines",
    color: "#fdba74",
    bg: "bg-orange-100",
    text: "text-orange-700",
  },
  assignment: {
    label: "Assignments",
    color: "#86efac",
    bg: "bg-green-100",
    text: "text-green-700",
  },
  interview: {
    label: "Interviews",
    color: "#d8b4fe",
    bg: "bg-purple-100",
    text: "text-purple-700",
  },
  fee: {
    label: "Fees",
    color: "#fde047",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
  },
};

const INITIAL_EVENTS = [
  {
    id: 1,
    title: "TU Entrance",
    date: new Date(new Date().setDate(new Date().getDate() + 2))
      .toISOString()
      .split("T")[0],
    type: "exam" as keyof typeof EVENT_TYPES,
    time: "10:00 - 12:00",
  },
  {
    id: 2,
    title: "Scholarship Form",
    date: new Date(new Date().setDate(new Date().getDate() + 5))
      .toISOString()
      .split("T")[0],
    type: "deadline" as keyof typeof EVENT_TYPES,
    time: "All Day",
  },
  {
    id: 3,
    title: "Physics Report",
    date: new Date(new Date().setDate(new Date().getDate() + 8))
      .toISOString()
      .split("T")[0],
    type: "assignment" as keyof typeof EVENT_TYPES,
    time: "14:00",
  },
  {
    id: 4,
    title: "Semester Fee",
    date: new Date(new Date().setDate(new Date().getDate() + 12))
      .toISOString()
      .split("T")[0],
    type: "fee" as keyof typeof EVENT_TYPES,
    time: "Before 5PM",
  },
];

const INITIAL_CHECKLIST = [
  { id: 1, text: "Citizenship Copy", checked: true },
  { id: 2, text: "SEE Marksheet", checked: true },
  { id: 3, text: "+2 Transcript", checked: false },
  { id: 4, text: "Photos (PP Size)", checked: false },
];

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Profile/Settings/Other states
  const [profileTab, setProfileTab] = useState("personal");
  const [settingsTab, setSettingsTab] = useState("password");
  const [counsellingTab, setCounsellingTab] = useState("upcoming");
  const [bookmarkFilter, setBookmarkFilter] = useState("all");
  const [inviteFilter, setInviteFilter] = useState("all");

  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [activeFilters, setActiveFilters] = useState(Object.keys(EVENT_TYPES));
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");

  // Invitation state
  const [invites, setInvites] = useState([
    {
      id: 1,
      college: "Tribhuvan University",
      logo: "TU",
      type: "scholarship",
      title: "Merit Based Scholarship 2026",
      description: "Full tuition waiver for top 5% scorers in entrance examination.",
      amount: "100% Waiver",
      deadline: "2026-03-15",
      location: "Kirtipur, Kathmandu",
      tags: ["High Priority", "Merit"],
      priority: true,
      status: "sent",
    },
    {
      id: 2,
      college: "Kathmandu University",
      logo: "KU",
      type: "admission",
      title: "B.Sc. Computer Science Admission",
      description: "Admissions open for the upcoming intake.",
      amount: null,
      deadline: "2026-04-01",
      location: "Dhulikhel",
      tags: ["Direct Interview"],
      priority: false,
      status: "saved",
    },
  ]);

  const filteredEvents = useMemo(() => {
    return events.filter((e: any) => activeFilters.includes(e.type));
  }, [events, activeFilters]);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (calendarView === "month") newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (calendarView === "month") newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const toggleFilter = (type: string) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "chat", icon: MessageSquare, label: "Messages" },
    { id: "calendar", icon: CalendarIcon, label: "My Calendar" },
    { id: "sphereinvites", icon: Mail, label: "SphereInvites" },
    { id: "counselling", icon: UserCheck, label: "Counselling" },
    { id: "profile", icon: UserCircle, label: "My Profile" },
    { id: "bookmarks", icon: Bookmark, label: "Bookmarks" },
    { id: "notifications", icon: Bell, label: "Notifications", badge: true },
  ];

  return (
    <div className="bg-slate-50 text-slate-800 antialiased font-sans h-screen flex overflow-hidden w-full fixed inset-0 z-[200]">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white z-[60] shadow-sm h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="font-bold text-lg text-slate-800">StudSphere</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-[70] md:hidden backdrop-blur-sm"></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-[80] w-64 bg-white border-r border-slate-200 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 flex flex-col h-full shadow-xl md:shadow-none`}>
        <div className="h-20 items-center px-8 border-b border-slate-100 hidden md:flex">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3 shadow-lg shadow-blue-500/30">S</div>
            <span className="font-bold text-xl tracking-tight text-slate-800">StudSphere</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 mt-16 md:mt-0">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors w-full text-left ${activeTab === item.id ? "bg-blue-100 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <item.icon size={20} className="mr-3" />
              <span className="flex-1">{item.label}</span>
              {item.badge && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 mt-4">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Settings</p>
            <button
              onClick={() => { setActiveTab("settings"); setIsSidebarOpen(false); }}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full ${activeTab === "settings" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <Settings size={20} className="mr-3" />
              Settings & Privacy
            </button>
            <button onClick={() => setIsLogoutModalOpen(true)} className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-500 hover:bg-red-50 w-full">
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" className="w-10 h-10 rounded-full bg-white shadow-sm" />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-700 truncate">Alex Student</p>
              <p className="text-xs text-slate-500 truncate">alex@university.edu</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-full pt-16 md:pt-0 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* DASHBOARD SECTION */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Welcome back, Alex! 👋</h1>
                  <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your applications today.</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3 min-w-[220px]">
                   <div className="relative w-12 h-12">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125.6" strokeDashoffset="25" className="text-emerald-500" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">80%</div>
                   </div>
                   <div>
                     <p className="text-sm font-bold">Alex Student</p>
                     <p className="text-xs text-slate-500">alex@university.edu</p>
                   </div>
                </div>
              </div>

              {/* Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-4 text-white shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Video size={20} /></div>
                  <div>
                    <h4 className="font-bold text-sm">Upcoming Session: Dr. Emily Smith</h4>
                    <p className="text-xs text-blue-100">Starts in 15 minutes • Career Guidance</p>
                  </div>
                </div>
                <button className="bg-white text-blue-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-50">Join Now</button>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group hover:shadow-xl transition-all cursor-pointer">
                  <div className="absolute -right-6 -bottom-6 opacity-10 scale-150 transform rotate-12 transition-transform group-hover:scale-175"><HelpCircle size={100} /></div>
                  <h3 className="text-xl font-bold relative z-10">Review Your Colleges</h3>
                  <p className="text-purple-100 text-sm mt-2 relative z-10 max-w-[80%]">Share your campus experience and help juniors make better decisions.</p>
                  <button className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg text-xs font-bold uppercase relative z-10">Write a Review</button>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group hover:shadow-xl transition-all cursor-pointer">
                  <div className="absolute -right-6 -bottom-6 opacity-10 scale-150 transform rotate-12 transition-transform group-hover:scale-175"><Target size={100} /></div>
                  <h3 className="text-xl font-bold relative z-10">Ask Your Doubts</h3>
                  <p className="text-orange-100 text-sm mt-2 relative z-10 max-w-[80%]">Stuck on a problem? Connect with experts and get answers instantly.</p>
                  <button className="mt-4 bg-white text-orange-600 px-4 py-2 rounded-lg text-xs font-bold uppercase relative z-10">Ask Now</button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { label: "Active Applications", val: "4", icon: Mail, color: "blue", trend: "+ 1 this week" },
                   { label: "Upcoming Deadlines", val: "2", icon: CalendarIcon, color: "orange", trend: "Urgent: Scholarship (2d)" },
                   { label: "Saved Colleges", val: "12", icon: Bookmark, color: "purple", trend: "New admissions open" },
                 ].map((stat, i) => (
                   <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                     <div className="flex justify-between items-start">
                       <div>
                         <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                         <h3 className="text-3xl font-bold mt-2">{stat.val}</h3>
                       </div>
                       <div className={`p-2 rounded-lg flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
                         <stat.icon size={24} />
                       </div>
                     </div>
                     <p className="text-xs text-slate-400 mt-4 font-medium">{stat.trend}</p>
                   </div>
                 ))}
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Compare Colleges", icon: Target, color: "indigo" },
                    { label: "Course Finder", icon: Search, color: "green" },
                    { label: "Scholarships", icon: Briefcase, color: "yellow" },
                    { label: "College Predictor", icon: Star, color: "pink" },
                  ].map((act, i) => (
                    <button key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-blue-500 transition-all text-center group">
                      <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 bg-${act.color}-50 text-${act.color}-600 group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
                        <act.icon size={20} />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{act.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CALENDAR SECTION */}
          {activeTab === "calendar" && (
            <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="w-full md:w-80 border-r border-slate-100 p-6 flex flex-col gap-6">
                 <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                   <Plus size={18} /> Add Note
                 </button>
                 <div className="space-y-6 overflow-y-auto">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">My Calendars</p>
                      <div className="space-y-3">
                        {Object.entries(EVENT_TYPES).map(([key, val]) => (
                          <label key={key} className="flex items-center gap-3 cursor-pointer">
                             <div className={`w-5 h-5 rounded border border-slate-200 flex items-center justify-center transition-all ${activeFilters.includes(key) ? "bg-current border-transparent" : "bg-white"}`} style={{ color: val.color }}>
                               {activeFilters.includes(key) && <Check size={12} className="text-white" />}
                             </div>
                             <input type="checkbox" className="hidden" checked={activeFilters.includes(key)} onChange={() => toggleFilter(key)} />
                             <span className={`text-sm font-medium ${activeFilters.includes(key) ? "text-slate-700" : "text-slate-400"}`}>{val.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="h-px bg-slate-100"></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Checklist</p>
                      <div className="space-y-2">
                        {checklist.map(item => (
                          <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${item.checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"}`}>
                              {item.checked && <Check size={10} />}
                            </div>
                            <span className={`text-sm ${item.checked ? "text-slate-400 line-through" : "text-slate-600"}`}>{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
               </div>

               <div className="flex-1 flex flex-col overflow-hidden">
                 <header className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-bold">{MONTHS[currentDate.getMonth()]} <span className="text-slate-300">{currentDate.getFullYear()}</span></h2>
                      <div className="flex bg-slate-50 rounded-lg p-1">
                        <button onClick={handlePrev} className="p-1 hover:bg-white rounded"><ChevronLeft size={20} /></button>
                        <button onClick={handleNext} className="p-1 hover:bg-white rounded"><ChevronRight size={20} /></button>
                      </div>
                    </div>
                    <div className="hidden sm:flex bg-slate-100 p-1 rounded-lg">
                      {["month", "week", "day"].map(v => (
                        <button key={v} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${calendarView === v ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`} onClick={() => setCalendarView(v as any)}>{v.toUpperCase()}</button>
                      ))}
                    </div>
                 </header>
                 <div className="flex-1 overflow-auto">
                    <div className="grid grid-cols-7 border-b border-slate-100 sticky top-0 bg-white z-10">
                      {DAYS.map(d => <div key={d} className="py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 border-l border-slate-50 min-h-full">
                       {/* Simplified calendar grid logic */}
                       {Array.from({ length: 35 }).map((_, i) => (
                         <div key={i} className="border-r border-b border-slate-50 min-h-[100px] p-2 hover:bg-slate-50 transition-colors cursor-pointer group">
                           <span className="text-sm font-semibold text-slate-400 group-hover:text-blue-600">{i - 2 > 0 && i - 2 <= 30 ? i - 2 : ""}</span>
                           {/* Render dots or mini labels for events here if needed */}
                         </div>
                       ))}
                    </div>
                 </div>
               </div>
            </div>
          )}

          {/* SPHEREINVITES SECTION */}
          {activeTab === "sphereinvites" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2"><Mail className="text-blue-600" /> SphereInvites</h2>
                <p className="text-sm text-slate-500 mt-1">Exclusive opportunities matched to your profile.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {[
                   { label: "Total Invites", val: "12", icon: Mail, color: "blue" },
                   { label: "Accepted", val: "2", icon: UserCheck, color: "green" },
                   { label: "Saved", val: "5", icon: Bookmark, color: "purple" },
                   { label: "Match Score", val: "85%", icon: Target, color: "indigo" },
                 ].map((stat, i) => (
                   <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                     <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                       <stat.icon size={20} />
                     </div>
                     <div>
                       <p className="text-xl font-bold">{stat.val}</p>
                       <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{stat.label}</p>
                     </div>
                   </div>
                 ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {invites.map(inv => (
                  <div key={inv.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all relative">
                    {inv.priority && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">URGENT</div>}
                    <div className="p-5 flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-slate-50 border rounded-lg flex items-center justify-center font-bold text-slate-700">{inv.logo}</div>
                        <div>
                          <p className="text-sm font-bold truncate max-w-[150px]">{inv.college}</p>
                          <p className="text-[10px] text-slate-400">{inv.location}</p>
                        </div>
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 mb-2">{inv.type}</span>
                      <h4 className="font-bold text-slate-800 leading-snug mb-2">{inv.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{inv.description}</p>
                      {inv.amount && <div className="bg-slate-50 p-2 rounded-lg text-xs font-bold flex items-center gap-2 border border-slate-100"><Star size={12} className="text-amber-400" /> {inv.amount}</div>}
                    </div>
                    <div className="p-4 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-3">
                      <button className="py-2 text-slate-600 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100">Decline</button>
                      <button className="py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">Accept</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OTHER SECTIONS Placeholder */}
          {!["dashboard", "calendar", "sphereinvites"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
               <span className="p-4 rounded-full bg-slate-100 mb-4"><Menu size={32} /></span>
               <p className="text-sm font-medium capitalize">{activeTab} section coming soon...</p>
            </div>
          )}

        </div>
      </main>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsLogoutModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative z-[301] text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner"><LogOut size={28} /></div>
            <h3 className="text-xl font-bold mb-2">Logging Out?</h3>
            <p className="text-slate-500 text-sm mb-8">Are you sure you want to end your current session?</p>
            <div className="flex gap-4">
              <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 py-3 font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">Cancel</button>
              <button onClick={() => { setIsLogoutModalOpen(false); /* Add logout logic */ }} className="flex-1 py-3 font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
