"use client";

import React, { useState } from "react";
import { 
  GraduationCap, Plus, Search, Filter, 
  ChevronDown, Calendar, Wallet, CheckCircle2,
  Clock, XCircle, MoreVertical, Edit2, Trash2
} from "lucide-react";

const ScholarshipPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Active");

  const scholarships = [
    { id: 1, title: "Merit Scholarship 2025", category: "Academic", amount: "100%", status: "Active", applicants: 45, deadline: "May 20, 2025" },
    { id: 2, title: "Entrance Topper Award", category: "Entrance", amount: "50%", status: "Active", applicants: 120, deadline: "June 15, 2025" },
    { id: 3, title: "Need-based Grant", category: "Social", amount: "रु. 50K", status: "Closed", applicants: 28, deadline: "Mar 10, 2025" },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Scholarship Management</h1>
          <p className="text-slate-500 text-sm mt-1">Create and track institutional financial aid programs.</p>
        </div>
        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
           <Plus className="w-4 h-4" /> Create New Program
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Cards */}
        {[
          { label: "Total Distributed", value: "रु. 1.2M", icon: Wallet, color: "blue" },
          { label: "Active Programs", value: "8", icon: CheckCircle2, color: "emerald" },
          { label: "Pending Reviews", value: "34", icon: Clock, color: "amber" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-500/30 transition-all">
             <div className={`p-3 rounded-xl bg-${kpi.color}-50 text-${kpi.color}-600`}>
                <kpi.icon className="w-6 h-6" />
             </div>
             <div>
                <p className="text-2xl font-black text-slate-900">{kpi.value}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight italic underline decoration-blue-500/30">{kpi.label}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/20 font-bold">
           <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-full md:w-max">
              {["Active", "Closed", "Draft"].map((tab) => (
                <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-4 py-1.5 rounded-lg text-xs transition-all ${
                     activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                   }`}
                >
                  {tab}
                </button>
              ))}
           </div>
           <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search programs..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <button className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200"><Filter className="w-4 h-4"/></button>
           </div>
        </div>

        {/* List */}
        <div className="p-5 space-y-4">
           {scholarships.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-md hover:shadow-blue-500/5 transition-all group flex flex-col md:flex-row items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-7 h-7 text-blue-600" />
                 </div>
                 <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                       <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic">{s.title}</h3>
                       <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase tracking-widest">{s.category}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                       <span className="flex items-center gap-1"><Wallet className="w-3.5 h-3.5" /> Amount: <span className="text-blue-600">{s.amount}</span></span>
                       <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Deadline: {s.deadline}</span>
                       <span className="flex items-center gap-1 italic"><Clock className="w-3.5 h-3.5" /> {s.applicants} Applied</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 text-right">
                       <span className={`px-3 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${
                          s.status === "Closed" ? "bg-rose-50 text-rose-500 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                       }`}>
                          {s.status}
                       </span>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4"/></button>
                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4"/></button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipPage;
