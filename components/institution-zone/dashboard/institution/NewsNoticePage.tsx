"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Newspaper,
  Trash2,
  Edit3,
  Eye,
  Bell,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  MoreVertical,
} from "lucide-react";

const NEWS = [
  {
    id: 1,
    title:
      "Sagarmatha College of Engineering announces 100% Scholarship for top students",
    date: "2024-04-01",
    views: 2500,
    status: "Published",
    type: "Announcement",
  },
  {
    id: 2,
    title: "Upcoming Seminar on AI & Data Science",
    date: "2024-04-05",
    views: 1200,
    status: "Published",
    type: "News",
  },
  {
    id: 3,
    title: "Admission Open for BCA and BSc.CSIT for the batch of 2026",
    date: "2024-03-20",
    views: 8000,
    status: "Flash News",
    type: "Notice",
  },
];

const NewsNoticePage: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            News & Notices
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Publish news, announcements and official notices for students
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg active:scale-95">
          <Plus size={18} />
          Create New Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Recent Publications
              </h2>
              <div className="flex items-center gap-2">
                <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                  <Filter size={18} />
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {NEWS.map((item) => (
                <div
                  key={item.id}
                  className="p-6 hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          item.status === "Flash News"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        <Newspaper size={24} />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase leading-tight tracking-tight">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                              item.type === "Notice"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-slate-50 text-slate-500"
                            }`}
                          >
                            {item.type}
                          </span>
                          <span className="text-[12px] text-slate-400 font-bold">
                            {item.date}
                          </span>
                          <div className="flex items-center gap-1.5 text-[12px] text-slate-400 font-bold">
                            <Eye size={14} />
                            {item.views} Views
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-[#2D68FE] p-8 rounded-3xl text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Bell size={24} />
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter mb-2">
                Publish Flash News
              </h3>
              <p className="text-white/70 text-sm font-medium leading-relaxed">
                Looking for quick engagement? Flash news appear at the top of
                the homepage for 24 hours.
              </p>
              <button className="w-full mt-6 py-3 bg-white text-[#2D68FE] rounded-xl font-bold text-sm shadow-xl shadow-black/10 transition-transform active:scale-95">
                Post Flash News
              </button>
            </div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-[14px] font-black uppercase text-slate-900 tracking-wider mb-6 pb-3 border-b border-slate-50">
              Content Analytics
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    Total Read time
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    48.2 Hours
                  </span>
                </div>
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <ArrowUpRight size={20} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Profile Interest</span>
                  <span className="text-blue-600">+12%</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsNoticePage;
