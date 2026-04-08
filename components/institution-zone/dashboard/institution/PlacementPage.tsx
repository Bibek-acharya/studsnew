"use client";

import React from "react";
import { 
  Briefcase, TrendingUp, Users, Building, 
  ChevronRight, Award, Plus, Filter,
  ExternalLink, BarChart3, PieChart
} from "lucide-react";

const PlacementPage: React.FC = () => {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Placement & Careers</h1>
          <p className="text-slate-500 text-sm mt-1">Track student success and corporate partnerships.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
              <TrendingUp className="w-4 h-4" /> Reports
           </button>
           <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> Log Placement
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Placement Rate", value: "92%", color: "blue", icon: TrendingUp },
          { label: "Avg CTC", value: "रु. 45K", color: "emerald", icon: Briefcase },
          { label: "Active Recruiters", value: "84+", color: "amber", icon: Building },
          { label: "Placed Students", value: "1,240", color: "indigo", icon: Users },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-500/50 transition-all">
             <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                   <stat.icon className="w-5 h-5" />
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold">+12%</div>
             </div>
             <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
             <p className="text-xs text-slate-500 font-bold uppercase mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         {/* Main content - Recent placements */}
         <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-900">Corporate Partners</h3>
                  <button className="text-xs text-blue-600 font-bold">Manage All</button>
               </div>
               <div className="p-0 border-collapse">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                     {[
                        { name: "Deerwalk", logo: "DW", students: 45, salary: "रु. 60K" },
                        { name: "Leapfrog", logo: "LF", students: 32, salary: "रु. 55K" },
                        { name: "Fusemachines", logo: "FM", students: 28, salary: "रु. 70K" },
                        { name: "Cotiviti", logo: "CT", students: 20, salary: "रु. 65K" },
                     ].map((partner, i) => (
                        <div key={i} className="p-5 border-b border-slate-100 md:odd:border-r flex items-center gap-4 group hover:bg-slate-50 transition-all cursor-pointer">
                           <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-lg group-hover:bg-white transition-all shadow-sm">
                              {partner.logo}
                           </div>
                           <div className="flex-1">
                              <h4 className="font-bold text-slate-900">{partner.name}</h4>
                              <p className="text-xs text-slate-500">Placed {partner.students} students this year</p>
                           </div>
                           <div className="text-right">
                              <p className="text-xs font-bold text-slate-900">{partner.salary}</p>
                              <p className="text-[10px] text-slate-400 italic">Avg CTC</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 border-b-2 border-blue-500 pb-1 w-max">Placement Highlights</h3>
                    <button className="text-xs text-slate-400"><ExternalLink className="w-3.5 h-3.5 inline mr-1"/> External View</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-bold">
                    <div className="p-4 bg-blue-50 rounded-xl text-center border border-blue-100">
                        <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-blue-900">Highest Package</p>
                        <p className="text-lg text-blue-700">रु. 1.2M</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                        <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                        <p className="text-sm text-emerald-900">Selected Batches</p>
                        <p className="text-lg text-emerald-700">2023, 2024</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl text-center border border-amber-100">
                        <Building className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                        <p className="text-sm text-amber-900">Global Partners</p>
                        <p className="text-lg text-amber-700">12 MNCs</p>
                    </div>
                </div>
            </div>
         </div>

         {/* Sidebar - Quick Analytics */}
         <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
               <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-500" /> Top Recruiting Domains
               </h3>
               <div className="space-y-3">
                  {[
                     { domain: "Software Dev", share: 45, color: "blue" },
                     { domain: "Data Science", share: 22, color: "emerald" },
                     { domain: "Cybersecurity", share: 18, color: "amber" },
                     { domain: "Digital Marketing", share: 15, color: "rose" },
                  ].map((d, i) => (
                     <div key={i} className="space-y-1.5 group">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                           <span>{d.domain}</span>
                           <span>{d.share}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full bg-${d.color}-500 transition-all duration-1000 group-hover:bg-${d.color}-600`} style={{ width: `${d.share}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-xl shadow-slate-200/50">
                <div className="p-2 w-max bg-white/10 rounded-xl ring-1 ring-white/20">
                    <PieChart className="w-6 h-6 text-blue-400 stroke-[1.5px]" />
                </div>
                <div>
                   <h4 className="font-bold text-lg">Detailed Analytics</h4>
                   <p className="text-xs text-slate-400 mt-1 leading-relaxed">Upgrade to Institution-Pro to get granular student-wise placement performance & predictive hiring analytics.</p>
                </div>
                <button className="w-full py-2.5 bg-blue-600 text-sm font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                   View Detailed Reports
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PlacementPage;
