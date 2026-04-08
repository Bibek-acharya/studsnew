"use client";

import React, { useState } from "react";
import { 
  BookOpen, Plus, Search, Filter, 
  ChevronRight, Edit2, Trash2, 
  CheckCircle2, AlertCircle, Clock
} from "lucide-react";

interface ProgramPageProps {
  onEdit?: (id: string) => void;
}

const ProgramPage: React.FC<ProgramPageProps> = ({ onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const programs = [
    { id: "1", name: "BE Computer Engineering", level: "Bachelor", sessions: "Ongoing", applicants: 124, status: "Published" },
    { id: "2", name: "BE IT Engineering", level: "Bachelor", sessions: "Completed", applicants: 89, status: "Published" },
    { id: "3", name: "BE Civil Engineering", level: "Bachelor", sessions: "Upcoming", applicants: 0, status: "Draft" },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Program Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all your academic programs and their details.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm font-bold">
           <Plus className="w-4 h-4" /> Add Program
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20 font-bold">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                 type="text" 
                 placeholder="Search programs..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
              />
           </div>
           <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 ml-2 shrink-0"><Filter className="w-4 h-4" /></button>
        </div>

        <div className="p-4 space-y-4">
           {programs.map((prog) => (
              <div key={prog.id} className="p-5 border border-slate-100 rounded-2xl hover:border-blue-500/30 transition-all group hover:shadow-md hover:shadow-blue-500/5">
                 <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 text-blue-600 font-bold italic">
                       {prog.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 space-y-1 font-bold">
                       <h3 className="text-lg text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic">{prog.name}</h3>
                       <div className="flex flex-wrap gap-4 text-xs text-slate-400 italic font-bold">
                          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {prog.level}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Session: {prog.sessions}</span>
                          <span className="flex items-center gap-1.5 font-bold underline decoration-blue-500/30">{prog.applicants} Aspirants</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                       <span className={`px-3 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${
                          prog.status === "Published" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-500 border border-slate-200"
                       }`}>
                          {prog.status}
                       </span>
                       <div className="flex gap-1">
                          <button 
                             onClick={() => onEdit?.(prog.id)}
                             title="Edit Details" 
                             className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100"
                          >
                             <Edit2 className="w-4 h-4" />
                          </button>
                          <button title="Delete" className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-100">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramPage;
