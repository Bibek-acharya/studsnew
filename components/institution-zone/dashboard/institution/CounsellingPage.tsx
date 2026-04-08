"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  X,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  Video,
  MoreVertical,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

const COUNSELLING_SESSIONS = [
  {
    id: 1,
    student: "Ankit Thapa",
    date: "2024-04-10",
    time: "10:00 AM",
    mode: "Video Call",
    status: "Upcoming",
    interest: "BSc.CSIT",
  },
  {
    id: 2,
    student: "Sita Magar",
    date: "2024-04-10",
    time: "11:30 AM",
    mode: "In-Person",
    status: "Upcoming",
    interest: "BBA",
  },
  {
    id: 3,
    student: "Rohan Gurung",
    date: "2024-04-09",
    time: "02:00 PM",
    mode: "Video Call",
    status: "Completed",
    interest: "BCA",
  },
  {
    id: 4,
    student: "Priya Rai",
    date: "2024-04-11",
    time: "09:00 AM",
    mode: "Video Call",
    status: "Upcoming",
    interest: "BIM",
  },
];

const CounsellingPage: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Online Counselling
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage student counselling requests and schedules
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg active:scale-95">
          <Plus size={18} />
          Schedule Manual Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Schedule List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Today's Sessions
                </span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  08
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Calendar size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Pending Requests
                </span>
                <div className="text-3xl font-black text-amber-500 mt-1">
                  14
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                <Clock size={24} />
              </div>
            </div>
          </div>

          {/* Sessions Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Upcoming Schedule
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-slate-50 border-none rounded-lg py-2 pl-9 pr-3 text-xs focus:ring-1 focus:ring-blue-500/20 w-40 outline-none"
                  />
                </div>
                <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                  <Filter size={16} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Student
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Mode
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Interest
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/50">
                  {COUNSELLING_SESSIONS.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                            {session.student.charAt(0)}
                          </div>
                          <span className="text-[14px] font-bold text-slate-700">
                            {session.student}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-slate-900">
                            {session.time}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {session.date}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                          {session.mode === "Video Call" ? (
                            <Video size={14} className="text-blue-500" />
                          ) : (
                            <User size={14} className="text-slate-400" />
                          )}
                          {session.mode}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[12px] font-black text-blue-600/70">
                          {session.interest}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                            session.status === "Upcoming"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 text-slate-400 hover:text-slate-900">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="text-[14px] font-black uppercase text-slate-900 tracking-wider mb-6">
              Counselling Settings
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">
                  Allow Online Booking
                </span>
                <button className="w-10 h-6 bg-emerald-500 rounded-full relative p-1 shadow-inner shadow-black/10">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">
                  Video Call Support
                </span>
                <button className="w-10 h-6 bg-blue-500 rounded-full relative p-1">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
              <div className="space-y-3 pt-4 border-t border-slate-50">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Consultant Profile
                </span>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 border-2 border-white shadow-sm" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-900">
                      Dr. Rajesh Adhikari
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Head of Admissions
                    </span>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all uppercase">
                  Update Profile
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#2D68FE] p-8 rounded-3xl text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter mb-2">
                Student Feedback
              </h3>
              <p className="text-white/70 text-sm font-medium leading-relaxed">
                98% of students found the counselling session helpful. High
                satisfaction increases enrollment rates!
              </p>
              <button className="w-full mt-6 py-3 bg-white text-[#2D68FE] rounded-xl font-bold text-sm shadow-xl shadow-black/10">
                View Reviews
              </button>
            </div>
            {/* Blobs */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellingPage;
