"use client";

import React, { useState } from "react";
import { 
  MessageSquare, User, Clock, 
  Trash2, Mail, ExternalLink, 
  Search, Filter, ChevronDown, CheckCircle2,
  AlertCircle, ArrowRight, CornerUpRight
} from "lucide-react";

interface Inquiry {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  timestamp: string;
  status: "New" | "Replied" | "Urgent";
  labels: string[];
}

const InquiryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");

  const inquiries: Inquiry[] = [
    { id: "1", senderName: "Abhishek Thapa", senderEmail: "abhi@gmail.com", subject: "BE Entrance Exam Date", message: "When will the BE entrance exam results be published? I haven't received any notification yet.", timestamp: "2 hours ago", status: "New", labels: ["Admission", "Entrance"] },
    { id: "2", senderName: "Ritika Shrestha", senderEmail: "ritika@test.com", subject: "Hostel Fee Structure", message: "Is the hostel fee included in the tuition fee for engineering students?", timestamp: "5 hours ago", status: "Urgent", labels: ["Finance", "Hostel"] },
    { id: "3", senderName: "Sunil Karki", senderEmail: "sunil@mail.com", subject: "Credit Transfer", message: "I want to transfer my credits from TU to NCIT. What is the process?", timestamp: "1 day ago", status: "Replied", labels: ["Academic"] },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">General Inquiries</h1>
          <p className="text-slate-500 text-sm mt-1">Manage public questions from prospective students and visitors.</p>
        </div>
        <div className="flex gap-2 font-bold uppercase text-[10px]">
           <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> 84% Response Rate</div>
           <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 2hr Avg Response</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/20 font-bold italic">
           <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
              {["all", "new", "unread", "replied"].map((t) => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-1.5 rounded-lg text-xs transition-all uppercase ${
                    activeTab === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
           </div>
           <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search message..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none shadow-sm" />
              </div>
              <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50"><Filter className="w-4 h-4" /></button>
           </div>
        </div>

        {/* Inbox Grid */}
        <div className="flex-1 overflow-y-auto">
           {inquiries.map((inq) => (
              <div key={inq.id} className="p-5 border-b border-slate-100 hover:bg-slate-50/80 transition-all cursor-pointer group font-bold">
                 <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                       inq.status === "Urgent" ? "bg-rose-50 border-rose-100 text-rose-500" :
                       inq.status === "New" ? "bg-blue-50 border-blue-100 text-blue-500" :
                       "bg-slate-50 border-slate-100 text-slate-400"
                    }`}>
                       <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                       <div className="flex items-center justify-between">
                          <h3 className="text-sm text-slate-900 flex items-center gap-2">
                             {inq.senderName} 
                             <span className="text-[10px] text-slate-400 font-medium italic">({inq.senderEmail})</span>
                          </h3>
                          <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{inq.timestamp}</span>
                       </div>
                       <p className="text-sm text-blue-600 leading-tight truncate uppercase tracking-widest">{inq.subject}</p>
                       <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed font-medium">
                          {inq.message}
                       </p>
                       
                       <div className="flex items-center gap-2 mt-3 overflow-hidden">
                          {inq.labels.map((l, i) => (
                             <span key={i} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200 uppercase">{l}</span>
                          ))}
                          {inq.status === "Urgent" && (
                            <span className="text-[9px] px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded flex items-center gap-1 uppercase italic underline"><AlertCircle className="w-2 h-2" /> Urgent Needs Attention</span>
                          )}
                       </div>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                       <button title="Quick Reply" className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:scale-110 active:scale-95 transition-all"><CornerUpRight className="w-4 h-4" /></button>
                       <button title="Mark Resolved" className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"><CheckCircle2 className="w-4 h-4" /></button>
                       <button title="Delete" className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                 </div>
              </div>
           ))}
           
           <div className="p-10 text-center space-y-2 opacity-40 italic">
              <p className="text-sm font-bold text-slate-400">Viewing last 24 hours of traffic.</p>
              <button className="text-xs text-blue-600 underline font-bold">Load Older Messages</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryPage;
