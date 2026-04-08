"use client";

import React, { useState } from "react";
import { 
  Bell, Megaphone, Trash2, Edit2, Plus, 
  Search, Filter, ChevronRight, Eye, Tag,
  Calendar, CheckCircle2, MoreVertical
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  category: "Notice" | "Event" | "Admission" | "Result";
  status: "Draft" | "Published" | "Scheduled";
  date: string;
  views: number;
}

const newsList: NewsItem[] = [
  {
    id: "N-1001",
    title: "Mid-Term Exam Schedule Updated (Spring 2026)",
    category: "Notice",
    status: "Published",
    date: "2026-03-08",
    views: 1245,
  },
  {
    id: "N-1002",
    title: "Annual Sports Week - Registration Form",
    category: "Event",
    status: "Scheduled",
    date: "2026-03-12",
    views: 0,
  },
  {
    id: "N-1003",
    title: "Scholarship Results: Merit 2026 Batch",
    category: "Result",
    status: "Draft",
    date: "2026-03-05",
    views: 0,
  },
];

const NewsNoticePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusStyle = (status: NewsItem["status"]) => {
    switch (status) {
      case "Published": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Scheduled": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Draft": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">News & Notice Manager</h1>
          <p className="text-slate-500 text-sm mt-1">Create and manage internal announcements and news feed.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm w-max">
           <Megaphone className="w-4 h-4" /> Broadcast News
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Categories */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" /> Categories
            </h3>
            <div className="space-y-2">
              {[
                { name: "Total Notices", count: 45, color: "text-blue-600" },
                { name: "Events", count: 12, color: "text-emerald-600" },
                { name: "Results", count: 0, color: "text-indigo-600" },
                { name: "Admissions", count: 2, color: "text-rose-600" },
              ].map((cat, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <span className="text-sm text-slate-600 font-medium">{cat.name}</span>
                  <span className={`text-xs font-bold ${cat.color} bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full`}>{cat.count}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-1">
              <Plus className="w-3.5 h-3.5" /> New Category
            </button>
          </div>
        </div>

        {/* Main List Area */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search headlines..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-500/20 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 font-bold">
            {newsList.map((news) => (
              <div key={news.id} className="p-4 hover:bg-slate-50 transition-all flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                     <h3 className="font-bold text-slate-900 group-hover:text-blue-600 cursor-pointer truncate">{news.title}</h3>
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(news.status)}`}>
                        {news.status}
                     </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                     <span className="flex items-center gap-1 font-bold text-indigo-500 underline">{news.category}</span>
                     <span>•</span>
                     <span className="flex items-center gap-1 italic"><Calendar className="w-3.5 h-3.5" />{news.date}</span>
                     <span>•</span>
                     <span className="flex items-center gap-1 font-bold"><Eye className="w-3.5 h-3.5" />{news.views}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-1.5 hover:bg-white rounded-md text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                   <button className="p-1.5 hover:bg-white rounded-md text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50/30 border-t border-slate-100">
             <button className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                View Archive <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsNoticePage;
