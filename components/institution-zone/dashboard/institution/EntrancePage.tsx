"use client";

import React, { useState } from "react";
import { 
  FileText, ClipboardCheck, Clock, Users, 
  Search, Filter, Plus, ChevronRight,
  MoreVertical, Calendar, Download, Eye, Edit2
} from "lucide-react";

interface Exam {
  id: string;
  name: string;
  date: string;
  time: string;
  status: "Scheduling" | "Ongoing" | "Grading" | "Published";
  applicants: number;
}

const exams: Exam[] = [
  {
    id: "ENT-2026-01",
    name: "BSc CSIT Entrance 2026",
    date: "2026-03-15",
    time: "10:00 AM",
    status: "Scheduling",
    applicants: 452,
  },
  {
    id: "ENT-2026-02",
    name: "CUMAT (Management) Exam",
    date: "2026-03-20",
    time: "11:30 AM",
    status: "Published",
    applicants: 1205,
  },
  {
    id: "ENT-2026-03",
    name: "Engineering Aptitude Test",
    date: "2026-03-08",
    time: "09:00 AM",
    status: "Grading",
    applicants: 215,
  },
];

const EntrancePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusStyle = (status: Exam["status"]) => {
    switch (status) {
      case "Scheduling": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Ongoing": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Grading": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Published": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Entrance Exam Portal</h1>
          <p className="text-slate-500 text-sm mt-1">Schedule exams, manage results, and monitor applicants.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Download All
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Create Exam
          </button>
        </div>
      </div>

      {/* Stats Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Upcoming Exams</p>
            <h3 className="text-xl font-bold text-slate-900">03</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Under Grading</p>
            <h3 className="text-xl font-bold text-slate-900">01</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Applicants</p>
            <h3 className="text-xl font-bold text-slate-900">1,872</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg. Score</p>
            <h3 className="text-xl font-bold text-slate-900">68%</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search exams..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Exam Information</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Schedule</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Applicants</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {exams.map((exam) => (
              <tr key={exam.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{exam.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono italic underline">{exam.id}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {exam.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-5">
                      {exam.time}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-bold text-slate-700">{exam.applicants}</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Enrolled</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(exam.status)}`}>
                    {exam.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end items-center gap-2">
                    <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-amber-600"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-white rounded-md text-slate-400"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntrancePage;
