"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  ExternalLink,
  ClipboardList,
  Calendar,
  Clock,
  Briefcase,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const EXAMS = [
  {
    id: 1,
    title: "Sagarmatha Entrance Exam (SEE) 2026",
    program: "BSc.CSIT / BCA",
    date: "2024-05-15",
    time: "11:00 AM",
    status: "Active",
    applicants: 480,
  },
  {
    id: 2,
    title: "Scholarship Qualifier Test",
    program: "All Bachelor",
    date: "2024-05-20",
    time: "10:00 AM",
    status: "Active",
    applicants: 1200,
  },
  {
    id: 3,
    title: "Management Aptitude Test",
    program: "BBA / BBM",
    date: "2024-04-30",
    time: "01:00 PM",
    status: "Expired",
    applicants: 350,
  },
];

const EntrancePage: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Entrance Exams
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage institutional entrance exams, notices and past papers
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg active:scale-95">
          <Plus size={18} />
          Create Exam Notice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Section List */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Active Entrance Notices
              </h2>
              <div className="flex items-center gap-2">
                <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                  <Filter size={18} />
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {EXAMS.map((exam) => (
                <div
                  key={exam.id}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        exam.status === "Active"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <ClipboardList size={24} />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                        {exam.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">
                          {exam.program}
                        </span>
                        <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                          <Calendar size={14} />
                          {exam.date}
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                          <Clock size={14} />
                          {exam.time}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-8 bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl">
                    <div className="flex flex-col text-center">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Applicants
                      </span>
                      <span className="text-base font-black text-slate-900">
                        {exam.applicants}
                      </span>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Archive Row */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase">
                  Model Question Archive
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  Upload and manage entrance preparation materials
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
              Review Repository
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-base font-black text-amber-900 tracking-tighter italic uppercase">
                Entrance Guide
              </h3>
            </div>
            <p className="text-amber-700/80 text-[13px] font-medium leading-relaxed">
              Sharing past entrance questions increases leads by up to 40%.
              Upload last year&apos;s papers to the repository.
            </p>
            <button className="w-full mt-6 py-3 bg-white border border-amber-200 text-amber-700 rounded-xl font-bold text-sm hover:bg-amber-100 transition-all active:scale-95 flex items-center justify-center gap-2">
              <Plus size={14} />
              Upload Past Papers
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="text-[14px] font-black uppercase text-slate-900 tracking-wider mb-6 pb-3 border-b border-slate-50">
              Quick Actions
            </h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
                <span className="text-[13px] font-bold text-slate-700">
                  Exam Admit Cards
                </span>
                <ExternalLink
                  size={16}
                  className="text-slate-300 group-hover:text-blue-500 transition-colors"
                />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
                <span className="text-[13px] font-bold text-slate-700">
                  Publish Exam Result
                </span>
                <CheckCircle2
                  size={16}
                  className="text-slate-300 group-hover:text-emerald-500 transition-colors"
                />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
                <span className="text-[13px] font-bold text-slate-700">
                  Online Exams Portal
                </span>
                <ExternalLink
                  size={16}
                  className="text-slate-300 group-hover:text-blue-500 transition-colors"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrancePage;
