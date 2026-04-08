"use client";

import React, { useState } from "react";
import { 
  HelpCircle, MessageCircle, Clock, CheckCircle2, 
  AlertCircle, Search, Filter, MoreVertical, 
  ChevronRight, User, Send, Paperclip
} from "lucide-react";

interface Query {
  id: string;
  student: string;
  subject: string;
  category: "Admission" | "Scholarship" | "Technical" | "General";
  status: "Open" | "In Progress" | "Resolved" | "Urgent";
  date: string;
  lastMessage: string;
}

const queries: Query[] = [
  {
    id: "Q-842",
    student: "Aayush Sharma",
    subject: "Eligibility for BSc CSIT",
    category: "Admission",
    status: "Urgent",
    date: "2026-03-08",
    lastMessage: "I haven't received my entrance admit card yet.",
  },
  {
    id: "Q-841",
    student: "Sita Thapa",
    subject: "Scholarship Deadline",
    category: "Scholarship",
    status: "In Progress",
    date: "2026-03-08",
    lastMessage: "Can I apply for multiple scholarships?",
  },
  {
    id: "Q-840",
    student: "Binod Rai",
    subject: "Login Issue",
    category: "Technical",
    status: "Resolved",
    date: "2026-03-07",
    lastMessage: "Thank you for the quick fix!",
  },
  {
    id: "Q-839",
    student: "Riya KC",
    subject: "Course Duration",
    category: "General",
    status: "Open",
    date: "2026-03-07",
    lastMessage: "Is there a fast-track option for BBA?",
  },
];

const QMSPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusStyle = (status: Query["status"]) => {
    switch (status) {
      case "Urgent": return "bg-rose-100 text-rose-700 border-rose-200";
      case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Resolved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Open": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Query Management System (QMS)</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and respond to student inquiries in real-time.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm w-max">
          <MessageCircle className="w-4 h-4" /> Resolve All
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">New Queries</p>
            <h3 className="text-xl font-bold text-slate-900">12</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Urgent</p>
            <h3 className="text-xl font-bold text-slate-900">03</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">In Progress</p>
            <h3 className="text-xl font-bold text-slate-900">08</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Resolved</p>
            <h3 className="text-xl font-bold text-slate-900">145</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Queries List */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search queries..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-500/20 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none">
                <option>All Categories</option>
                <option>Admission</option>
                <option>Scholarship</option>
                <option>Technical</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {queries.map((q) => (
              <div key={q.id} className="p-4 hover:bg-slate-50 cursor-pointer transition-all flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900 truncate">{q.subject}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(q.status)}`}>
                      {q.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-blue-600">{q.student}</span>
                    <span>•</span>
                    <span>{q.category}</span>
                    <span>•</span>
                    <span>{q.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 truncate italic">"{q.lastMessage}"</p>
                </div>
                <button className="mt-1 p-1 hover:bg-white rounded-md text-slate-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <p className="text-xs text-slate-500 font-medium font-bold">Showing 4 of 12 active queries</p>
            <div className="flex items-center gap-1">
               <button className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-semibold">Previous</button>
               <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-semibold">Next</button>
            </div>
          </div>
        </div>

        {/* Quick Conversation Preview / Action */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col h-full">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-600" /> Subject: Q-842
          </h3>
          <div className="flex-1 space-y-4 mb-4">
             <div className="bg-slate-50 p-3 rounded-xl rounded-tl-none border border-slate-100">
                <p className="text-xs font-bold text-blue-600 mb-1">Aayush Sharma</p>
                <p className="text-sm text-slate-700">I haven't received my entrance admit card yet. The exam is in 3 days. Please help.</p>
                <p className="text-[10px] text-slate-400 mt-2 text-right">09:30 AM</p>
             </div>
             <div className="bg-blue-50 p-3 rounded-xl rounded-tr-none border border-blue-100 ml-4">
                <p className="text-xs font-bold text-blue-700 mb-1">You (Admin)</p>
                <p className="text-sm text-slate-700">Hello Aayush, checking your application right now. Standby.</p>
                <p className="text-[10px] text-blue-400 mt-2 text-right">09:45 AM</p>
             </div>
          </div>
          <div className="space-y-3">
            <textarea 
              rows={3}
              placeholder="Type your response..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="flex items-center justify-between">
              <button className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-sm transition-all">
                Send Reply <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QMSPage;
