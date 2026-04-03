"use client";

import React, { useState } from "react";

interface ForumNavbarProps {
  onNavigate?: (view: any) => void;
  user?: { name: string; email: string; role: string } | null;
}

const ForumNavbar: React.FC<ForumNavbarProps> = ({ onNavigate, user }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-[150] shadow-sm font-sans">
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate?.("educationPage")}
            className="flex items-center gap-2 focus:outline-none transition-transform hover:scale-105"
          >
            <img
              src="/logo-blue.png"
              alt="StudSphere Logo"
              className="h-10 w-auto"
            />
          </button>
        </div>

        {/* Desktop Central Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-12 relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-slate-300 group-focus-within:text-blue-600 transition-colors"></i>
          </div>
          <input
            type="text"
            placeholder="Search TU, KU, Lok Sewa, or courses..."
            className="w-full pl-12 pr-20 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm transition-all shadow-inner outline-none font-bold placeholder:text-slate-300"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-[10px] font-black text-slate-300 bg-white border border-slate-100 rounded-lg px-2 py-1 shadow-sm hidden lg:block uppercase tracking-widest">
              Ctrl + K
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button className="hidden sm:flex items-center gap-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 border border-transparent hover:border-blue-100">
            <i className="fa-solid fa-pen-nib text-sm"></i>
            <span>Ask/Share</span>
          </button>

          <div className="w-px h-8 bg-slate-100 mx-1 hidden sm:block"></div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative w-11 h-11 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-2xl transition-all active:scale-90"
            >
              <i className="fa-regular fa-bell text-xl"></i>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fadeInDown origin-top-right z-[160]">
                <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                  <span className="font-black text-xs uppercase tracking-widest text-slate-900">
                    Notifications
                  </span>
                  <button className="text-[9px] text-blue-600 font-black hover:underline uppercase tracking-widest">
                    Mark read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto no-scrollbar">
                  <NotificationItem
                    title="Aastha replied"
                    desc="Check her answer on Data Structures"
                    time="2m ago"
                    unread
                  />
                  <NotificationItem
                    title="Massive Upvote!"
                    desc="Your post reached 100 upvotes"
                    time="1h ago"
                  />
                  <NotificationItem
                    title="New Notice"
                    desc="TU published BBA results"
                    time="3h ago"
                  />
                </div>
                <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors">
                  See all alerts
                </button>
              </div>
            )}
          </div>

          {/* User Profile */}
          <button className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-white transition-all bg-slate-50 ml-2 active:scale-95 group">
            <img
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || "Felix"}`}
              alt="User"
              className="w-8 h-8 rounded-xl bg-white shadow-sm"
            />
            <i className="fa-solid fa-chevron-down text-[10px] text-slate-300 group-hover:text-slate-500 transition-colors"></i>
          </button>
        </div>
      </div>

      {/* Mobile Search - Visible only on small screens */}
      <div className="md:hidden px-4 pb-4 animate-fadeIn">
        <div className="relative">
          <input
            type="text"
            placeholder="Search TU, KU, Lok Sewa..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none font-bold"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
        </div>
      </div>
    </header>
  );
};

const NotificationItem: React.FC<{
  title: string;
  desc: string;
  time: string;
  unread?: boolean;
}> = ({ title, desc, time, unread }) => (
  <div
    className={`p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 flex items-start gap-4 transition-colors ${unread ? "bg-blue-50/20" : ""}`}
  >
    <div
      className={`w-2 h-2 rounded-full mt-2 shrink-0 ${unread ? "bg-blue-600 animate-pulse" : "bg-transparent"}`}
    ></div>
    <div className="flex-1">
      <p className="text-xs text-slate-900 font-black tracking-tight">
        {title}
      </p>
      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
        {desc}
      </p>
      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1 block">
        {time}
      </span>
    </div>
  </div>
);

export default ForumNavbar;
