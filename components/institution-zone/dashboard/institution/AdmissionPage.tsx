"use client";

import React, { useState } from "react";
import { 
  Users, UserPlus, Filter, Search, Download, 
  CheckCircle2, Clock, AlertCircle, ChevronRight,
  Mail, Phone, Calendar, MoreVertical, FileText
} from "lucide-react";

interface Application {
  id: string;
  student: string;
  email: string;
  phone: string;
  program: string;
  status: "Pending" | "Under Review" | "Approved" | "Rejected";
  date: string;
  avatar: string;
}

const applications: Application[] = [
  {
    id: "APP-001",
    student: "Rahul Sharma",
    email: "rahul.s@example.com",
    phone: "+977 9841234567",
    program: "BSc CSIT",
    status: "Approved",
    date: "2026-03-05",
    avatar: "RS",
  },
  {
    id: "APP-002",
    student: "Priya Singh",
    email: "priya.singh@example.com",
    phone: "+977 9851098765",
    program: "BBA",
    status: "Under Review",
    date: "2026-03-04",
    avatar: "PS",
  },
  {
    id: "APP-003",
    student: "Amit Khadka",
    email: "amit.k@example.com",
    phone: "+977 9812345678",
    program: "Civil Engineering",
    status: "Pending",
    date: "2026-03-03",
    avatar: "AK",
  },
  {
    id: "APP-004",
    student: "Deepa Gurung",
    email: "deepa.g@example.com",
    phone: "+977 9801122334",
    program: "BIM",
    status: "Rejected",
    date: "2026-03-01",
    avatar: "DG",
  },
];

const AdmissionPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusStyle = (status: Application["status"]) => {
    switch (status) {
      case "Approved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Under Review": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Rejected": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admission Portal</h1>
          <p className="text-slate-500 text-sm mt-1">Review and manage student enrollment applications.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm">
            <UserPlus className="w-4 h-4" /> Offline Admission
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Apps</p>
            <h3 className="text-xl font-bold text-slate-900">1,248</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending</p>
            <h3 className="text-xl font-bold text-slate-900">84</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Approved</p>
            <h3 className="text-xl font-bold text-slate-900">956</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rejected</p>
            <h3 className="text-xl font-bold text-slate-900">208</h3>
          </div>
        </div>
      </div>

      {/* Main Content Table Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, ID or program..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-500/20 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none">
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Applicant</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Program</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Date Applied</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Contact</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm">
                        {app.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{app.student}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5 italic underline">{app.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-600">{app.program}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(app.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="p-2 bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-all"><Phone className="w-3.5 h-3.5" /></button>
                      <button className="p-2 bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-all"><Mail className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-2">
                      <button className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                        Review <ChevronRight className="w-4 h-4" />
                      </button>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <p>Showing 1 to 4 of 1,248 entries</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-md hover:bg-slate-50">1</button>
            <button className="px-3 py-1 hover:bg-slate-200 rounded-md transition-colors">2</button>
            <button className="px-3 py-1 hover:bg-slate-200 rounded-md transition-colors">3</button>
            <span className="px-2">...</span>
            <button className="px-3 py-1 hover:bg-slate-200 rounded-md transition-colors">125</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionPage;
