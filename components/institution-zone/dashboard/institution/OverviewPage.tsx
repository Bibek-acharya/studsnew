"use client";

import React from "react";
import {
  Users,
  Eye,
  MousePointer2,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Calendar,
  Filter,
} from "lucide-react";

const STATS = [
  {
    label: "Total Profile Views",
    value: "12.8k",
    change: "+14.2%",
    positive: true,
    icon: Eye,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Active Leads",
    value: "842",
    change: "+5.1%",
    positive: true,
    icon: Users,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Lead Conversion Rate",
    value: "12.4%",
    change: "-2.4%",
    positive: false,
    icon: MousePointer2,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Pending Queries",
    value: "48",
    change: "+12",
    positive: true,
    icon: MessageSquare,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const RECENT_LEADS = [
  {
    id: 1,
    name: "Prabin Shrestha",
    program: "BSc.CSIT",
    date: "2 mins ago",
    status: "Interested",
    score: 92,
  },
  {
    id: 2,
    name: "Anita Magar",
    program: "BBA",
    date: "15 mins ago",
    status: "Waiting Call",
    score: 85,
  },
  {
    id: 3,
    name: "Rishav Thapa",
    program: "BCA",
    date: "1 hour ago",
    status: "Applied",
    score: 98,
  },
  {
    id: 4,
    name: "Kusum Adhikari",
    program: "BIM",
    date: "3 hours ago",
    status: "Interested",
    score: 76,
  },
  {
    id: 5,
    name: "Suman Giri",
    program: "BBS",
    date: "Yesterday",
    status: "Interested",
    score: 64,
  },
];

const OverviewPage: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Overview Dashboard
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Real-time performance metrics and recent student activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar size={16} />
            Past 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            <Filter size={16} />
            Custom View
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div
                className={`${stat.bg} ${stat.color} p-3 rounded-xl transition-transform group-hover:scale-110`}
              >
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
              <div
                className={`flex items-center gap-1 text-[13px] font-bold ${stat.positive ? "text-emerald-500" : "text-rose-500"}`}
              >
                {stat.positive ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-slate-500 text-[13px] font-bold uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Student Leads
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-tight">
                Real-time update stream
              </p>
            </div>
            <button className="text-blue-600 text-sm font-bold hover:underline">
              View All Leads
            </button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Student
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Program
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Engagement Score
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {RECENT_LEADS.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-slate-700">
                          {lead.name}
                        </span>
                        <span className="text-[12px] text-slate-400 font-medium">
                          {lead.date}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[12px] font-bold">
                        {lead.program}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {lead.status === "Applied" ? (
                          <CheckCircle2
                            size={14}
                            className="text-emerald-500"
                          />
                        ) : (
                          <Clock size={14} className="text-amber-500" />
                        )}
                        <span
                          className={`text-[13px] font-bold ${lead.status === "Applied" ? "text-emerald-600" : "text-slate-600"}`}
                        >
                          {lead.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[80px]">
                          <div
                            className={`h-full rounded-full ${lead.score > 80 ? "bg-emerald-500" : lead.score > 50 ? "bg-amber-500" : "bg-rose-500"}`}
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-[12px] font-black text-slate-900">
                          {lead.score}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-1.5 rounded-lg hover:bg-white text-slate-400 group-hover:text-slate-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Center / Quick Links */}
        <div className="space-y-6">
          <div className="bg-[#2D68FE] p-8 rounded-3xl text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <TrendingUp size={40} className="mb-4 text-white/40" />
              <h3 className="text-xl font-black italic tracking-tighter uppercase mb-2">
                Grow Your Presence
              </h3>
              <p className="text-white/80 text-sm font-medium leading-relaxed mb-6">
                Your profile completion is 65%. Add campus tour videos to
                attract 2x more leads.
              </p>
              <button className="w-full bg-white text-[#2D68FE] py-3 rounded-xl font-bold text-sm shadow-xl shadow-black/10 active:scale-95 transition-all">
                Complete Profile
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-[14px] font-black uppercase text-slate-900 tracking-wider mb-4 border-b border-slate-50 pb-3">
              Upcoming Events
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-600">
                  <span className="text-[10px] font-black uppercase leading-none">
                    Apr
                  </span>
                  <span className="text-base font-black leading-none">12</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-slate-700">
                    Open House 2026
                  </span>
                  <span className="text-[12px] text-slate-400 font-medium">
                    10:00 AM — Campus Hall
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-4 opacity-50">
                <div className="w-10 h-10 shrink-0 bg-slate-50 rounded-xl flex flex-col items-center justify-center text-slate-400">
                  <span className="text-[10px] font-black uppercase leading-none">
                    Apr
                  </span>
                  <span className="text-base font-black leading-none">20</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-slate-700 italic">
                    No events scheduled
                  </span>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-100 rounded-xl text-slate-300 font-bold text-sm hover:border-blue-100 hover:text-blue-300 transition-all">
              + Create New Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
