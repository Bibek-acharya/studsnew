"use client";

import React from "react";
import { 
  FileDown, TrendingUp, Users, 
  MapPin, CheckCircle2, ChevronRight,
  TrendingDown, PieChart, Activity,
  Info, ArrowRight, Download
} from "lucide-react";

const ExportReportPage: React.FC = () => {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Institutional Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Generate comprehensive PDF reports & data exports.</p>
        </div>
        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
           <Download className="w-4 h-4" /> Full Archive Export
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 font-bold">
        {/* Left Stats Column */}
        <div className="xl:col-span-1 space-y-6 shrink-0">
          {[
            { label: "Data Integrity", value: "98.4%", icon: Activity, color: "blue" },
            { label: "Growth Trend", value: "+14.2%", icon: TrendingUp, color: "emerald" },
          ].map((s, i) => (
             <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative group overflow-hidden">
                <div className={`p-3 w-max rounded-2xl bg-${s.color}-50 text-${s.color}-600 mb-6 group-hover:scale-110 transition-transform`}><s.icon className="w-6 h-6" /></div>
                <p className="text-3xl font-black text-slate-900 leading-none">{s.value}</p>
                <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">{s.label}</p>
             </div>
          ))}

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-5 text-white shadow-xl shadow-slate-200/50 space-y-4">
             <div className="p-2 w-max bg-white/10 rounded-xl ring-1 ring-white/20"><PieChart className="w-5 h-5 text-blue-400" /></div>
             <p className="text-sm">Advanced Data Mining is currently active for your institution.</p>
             <button className="w-full py-2 bg-blue-600 rounded-lg text-xs font-bold transition-all hover:bg-blue-500">View Pro Dash</button>
          </div>
        </div>

        {/* Right Report Grid */}
        <div className="xl:col-span-3 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Admission Summary 2024", size: "2.4MB", type: "PDF", desc: "Detailed breakdown of applicants, levels & scholarship distribution." },
                { title: "Placement Performance (H1)", size: "4.1MB", type: "XLSX", desc: "Raw data of corporate hires and salary packages for recent batches." },
                { title: "Institutional SEO Audit", size: "1.2MB", type: "PDF", desc: "Insight on your college's search rankings and public engagement." },
                { title: "Faculty Workload Analysis", size: "840KB", type: "PDF", desc: "Aggregated teaching hours and department efficiency metrics." },
              ].map((report, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer group">
                   <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-${report.type === "PDF" ? "rose" : "emerald"}-50 text-${report.type === "PDF" ? "rose" : "emerald"}-600 flex items-center justify-center font-black italic`}>
                         {report.type}
                      </div>
                      <div className="flex-1">
                         <h3 className="text-sm text-slate-900 uppercase italic group-hover:text-blue-600 transition-colors">{report.title}</h3>
                         <p className="text-[10px] text-slate-400 font-bold">{report.size} • Generated 2 days ago</p>
                      </div>
                      <FileDown className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:scale-125 transition-all" />
                   </div>
                   <p className="text-xs text-slate-500 font-medium italic italic leading-relaxed">{report.desc}</p>
                   <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                      <button className="text-[9px] text-blue-600 font-black uppercase hover:underline">Re-generate Now</button>
                      <button className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 italic">Preview Mode</button>
                   </div>
                </div>
              ))}
           </div>

           <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-blue-600 shrink-0"><Activity className="w-8 h-8 opacity-40 animate-pulse" /></div>
              <div className="flex-1 font-bold">
                 <h4 className="text-sm text-blue-900 uppercase">Live Traffic Monitoring</h4>
                 <p className="text-xs text-blue-600/70 mt-1 italic">Real-time engagement tracking (RTET) is capturing data from 2,341 active sessions across your portal pages.</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95">Go Live</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExportReportPage;
