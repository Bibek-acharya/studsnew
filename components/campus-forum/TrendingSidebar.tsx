"use client";

import React from "react";

const TrendingSidebar: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Latest University Notices */}
      <div className="bg-white rounded-[1.5rem]  border border-slate-100 overflow-hidden group hover:shadow-lg transition-all duration-500 pb-4">
        <div className="bg-white p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-xl tracking-tight">
            Latest University Notice
          </h3>
          <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
        </div>
        <div className="space-y-0 px-2">
          {[
            { id: 1, category: "Scholarship", time: "8m ago", title: "TU B.Sc CSIT Entrance Exam Notice 2026" },
            { id: 2, category: "Exam", time: "2h ago", title: "KU Medical School Results Out" },
            { id: 3, category: "Notice", time: "5h ago", title: "PU 2nd Semester Exam Form Open" },
          ].map((item) => (
            <div
              key={item.id}
              className="p-4 transition-colors border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer rounded-md mx-2"
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${item.category === 'Scholarship' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                  {item.category}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.time}</span>
              </div>
              <p className="font-bold text-slate-900 text-sm leading-tight line-clamp-2">
                {item.title}
              </p>
            </div>
          ))}
        </div>
        <div className="px-6 mt-4">
          <button className="w-full py-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md font-black text-[10px] uppercase tracking-widest transition-all">
            See all notices
          </button>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-[1.5rem]  border border-slate-100 p-6">
        <h3 className="font-black text-slate-900 text-lg tracking-tight mb-4">
          Trending Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {["#CSIT", "#Scholarship2026", "#CEE_Preparation", "#TU_Notices", "#Engineering", "#BCA", "#LokSewa"].map((tag) => (
            <button key={tag} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-md text-xs font-bold text-slate-600 hover:bg-white hover:border-blue-200 hover:text-blue-600 transition-all">
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSidebar;
