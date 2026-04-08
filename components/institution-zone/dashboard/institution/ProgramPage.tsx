"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Edit3,
  Eye,
  BookOpen,
  GraduationCap,
  Clock,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const PROGRAMS = [
  {
    id: 1,
    name: "BSc.CSIT",
    level: "Bachelor",
    duration: "4 Years",
    status: "Active",
    intake: "Nov 2024",
    seats: 48,
    fee: "NPR 1,250,000",
  },
  {
    id: 2,
    name: "BBA",
    level: "Bachelor",
    duration: "4 Years",
    status: "Active",
    intake: "Nov 2024",
    seats: 60,
    fee: "NPR 1,100,000",
  },
  {
    id: 3,
    name: "BCA",
    level: "Bachelor",
    duration: "4 Years",
    status: "Active",
    intake: "Nov 2024",
    seats: 35,
    fee: "NPR 950,000",
  },
  {
    id: 4,
    name: "MBA",
    level: "Master",
    duration: "2 Years",
    status: "Inactive",
    intake: "Closed",
    seats: 30,
    fee: "NPR 850,000",
  },
  {
    id: 5,
    name: "+2 Science",
    level: "+2 Level",
    duration: "2 Years",
    status: "Active",
    intake: "Aug 2024",
    seats: 120,
    fee: "NPR 250,000",
  },
];

const ProgramPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All Levels");

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Programs & Courses
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage all your academic offerings in one place
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
          <Plus size={18} />
          Add New Program
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-4">
        <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
          <AlertCircle size={20} />
        </div>
        <div>
          <p className="text-amber-900 text-sm font-bold">Important Notice</p>
          <p className="text-amber-700 text-[13px] font-medium mt-0.5">
            Some programs have missing admission details. Please update them to
            enable the "Apply Now" button for students.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 rounded-xl">
          {["All Levels", "Bachelor", "Master", "+2 Level"].map((level) => (
            <button
              key={level}
              onClick={() => setActiveFilter(level)}
              className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-all ${
                activeFilter === level
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="flex-1 relative w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search programs..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROGRAMS.map((program) => (
          <div
            key={program.id}
            className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group p-6 flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <BookOpen size={24} />
              </div>
              <div
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                  program.status === "Active"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {program.status}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                {program.name}
              </h3>
              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <GraduationCap size={14} />
                  {program.level}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Clock size={14} />
                  {program.duration}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-slate-50">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Next Intake
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {program.intake}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Total Seats
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {program.seats} Seats
                </span>
              </div>
              <div className="flex flex-col mt-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Tuition Fees
                </span>
                <span className="text-sm font-black text-blue-600">
                  {program.fee}
                </span>
              </div>
            </div>

            <div className="mt-auto flex items-center gap-2">
              <button className="flex-1 bg-slate-50 text-slate-600 py-3 rounded-xl font-bold text-[13px] hover:bg-slate-100 transition-all flex items-center justify-center gap-2 active:scale-95">
                <Edit3 size={14} />
                Edit
              </button>
              <button className="flex-1 bg-white border border-slate-200 text-slate-400 py-3 rounded-xl font-bold text-[13px] hover:text-blue-600 hover:border-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95">
                <Eye size={14} />
                View
              </button>
            </div>
          </div>
        ))}
        {/* Placeholder for adding more */}
        <button className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 h-full min-h-[300px] flex flex-col items-center justify-center group hover:bg-white hover:border-blue-200 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 shadow-sm transition-all duration-300">
            <Plus size={28} />
          </div>
          <p className="mt-4 text-slate-400 font-bold group-hover:text-blue-600 transition-colors">
            Add New Program
          </p>
        </button>
      </div>
    </div>
  );
};

export default ProgramPage;
