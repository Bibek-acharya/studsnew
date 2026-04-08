"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
} from "lucide-react";

const LEADS = [
  {
    id: "L-1024",
    name: "Suman Giri",
    email: "suman.giri@gmail.com",
    phone: "9841234567",
    program: "BSc.CSIT",
    date: "2024-04-06",
    status: "Interested",
    source: "Website Search",
  },
  {
    id: "L-1023",
    name: "Anish Magar",
    email: "anish.m@outlook.com",
    phone: "9860112233",
    program: "BBA",
    date: "2024-04-05",
    status: "Waiting Call",
    source: "Facebook Ad",
  },
  {
    id: "L-1022",
    name: "Riya Shrestha",
    email: "riya.stha@info.com",
    phone: "9812345678",
    program: "BCA",
    date: "2024-04-05",
    status: "Applied",
    source: "Direct Visit",
  },
  {
    id: "L-1021",
    name: "Prabin Tamang",
    email: "prabin.t@gmail.com",
    phone: "9845678901",
    program: "BIM",
    date: "2024-04-04",
    status: "Interested",
    source: "College Fair",
  },
  {
    id: "L-1020",
    name: "Kusum Adhikari",
    email: "kusum.a@yahoo.com",
    phone: "9801234567",
    program: "BE Computer",
    date: "2024-04-04",
    status: "Interested",
    source: "Website Search",
  },
  {
    id: "L-1019",
    name: "Sabin Karki",
    email: "sabin.k@gmail.com",
    phone: "9849876543",
    program: "BBS",
    date: "2024-04-03",
    status: "Rejected",
    source: "Direct Visit",
  },
];

const AdmissionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "interested" | "pending" | "applied"
  >("all");

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Student Admission Leads
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage and track student inquiries for your programs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} />
            Export Leads
          </button>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 flex flex-col md:flex-row items-center gap-4">
        <div className="flex p-1 bg-slate-50 rounded-xl w-full md:w-auto">
          {(["all", "interested", "pending", "applied"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-4 py-2 text-sm font-bold rounded-lg capitalize transition-all ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1 md:flex none relative w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by student name, email, phone..."
            className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>
        <button className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900">
          <Filter size={20} />
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Student Info
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Goal Program
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Date Recieved
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Source
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {LEADS.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-slate-900">
                        {lead.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {lead.email}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {lead.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[12px] font-black tracking-tight">
                      {lead.program}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                      <Calendar size={14} className="text-slate-400" />
                      {lead.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tight ${
                        lead.status === "Applied"
                          ? "bg-emerald-50 text-emerald-600"
                          : lead.status === "Rejected"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {lead.status === "Applied" ? (
                        <CheckCircle2 size={12} />
                      ) : lead.status === "Rejected" ? (
                        <XCircle size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {lead.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-slate-500 font-medium">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button className="p-2 rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                        <Mail size={18} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white hover:text-emerald-500 transition-colors">
                        <Phone size={18} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white hover:text-slate-900 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-400">
            Showing <span className="text-slate-900">1 to 6</span> of{" "}
            <span className="text-slate-900">1,240</span> leads
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              <button className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20">
                1
              </button>
              <button className="w-10 h-10 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50">
                2
              </button>
              <button className="w-10 h-10 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50">
                3
              </button>
            </div>
            <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionPage;
