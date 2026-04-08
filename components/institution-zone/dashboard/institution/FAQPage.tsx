"use client";

import React, { useState } from "react";
import { 
  HelpCircle, Search, Plus, Filter, 
  MessageSquare, ChevronRight, Edit3, 
  Trash2, BookOpen, Globe, Lock, Clock
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "Admission" | "Academic" | "Hostel" | "General";
  status: "Published" | "Hidden";
  likes: number;
}

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const faqs: FAQ[] = [
    { id: "1", question: "What is the minimum GPA for BE entrance?", answer: "Candidates must have at least 2.2 GPA in aggregate in Class 11 and 12 (Science) with physics and mathematics.", category: "Admission", status: "Published", likes: 245 },
    { id: "2", question: "Are hostel facilities available for foreigners?", answer: "Yes, we have 2 separate international hostels with mess facility and 24/7 security reporting to campus head.", category: "Hostel", status: "Published", likes: 89 },
    { id: "3", question: "How to apply for merit-based scholarships?", answer: "Students must fill the scholarship form available at the administration desk after publishing of 1st semester results.", category: "Admission", status: "Hidden", likes: 12 },
  ];

  const categories = ["All", "Admission", "Academic", "Hostel", "General"];

  const filteredFaqs = faqs.filter(f => 
    (selectedCategory === "All" || f.category === selectedCategory) &&
    (f.question.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FAQ Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage frequently asked questions and automated response bots.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm font-bold">
           <Plus className="w-4 h-4 shadow-xl" /> Create New MCQ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 uppercase text-xs italic">
                 <Filter className="w-4 h-4 text-blue-600" /> Categories
              </h3>
              <div className="space-y-1">
                 {categories.map((cat) => (
                    <button 
                       key={cat}
                       onClick={() => setSelectedCategory(cat)}
                       className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all flex justify-between items-center group ${
                          selectedCategory === cat ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"
                       }`}
                    >
                       {cat}
                       <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all ${selectedCategory === cat ? "opacity-100" : ""}`} />
                    </button>
                 ))}
              </div>
           </div>

           <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 text-white shadow-xl shadow-blue-500/10">
              <HelpCircle className="w-8 h-8 opacity-20 mb-3" />
              <p className="text-sm font-bold">AI Chatbot Training</p>
              <p className="text-[11px] opacity-80 mt-1 leading-relaxed">Your FAQs are automatically used to train the institutional AI assistant. Keep them updated!</p>
              <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
                 <RefreshCw className="w-3.5 h-3.5" /> Force Sync
              </button>
           </div>
        </div>

        {/* Main List */}
        <div className="lg:col-span-3 space-y-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                 type="text" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search by question keywords..." 
                 className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm font-bold"
              />
           </div>

           <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                 <div key={faq.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 group hover:border-blue-300 transition-all cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                             <MessageSquare className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{faq.question}</h4>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase">{faq.category}</span>
                                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                <span className={`text-[10px] font-bold ${faq.status === "Published" ? "text-emerald-500" : "text-amber-500"} flex items-center gap-1`}>
                                   {faq.status === "Published" ? <Globe className="w-3 h-3"/> : <Lock className="w-3 h-3"/>}
                                   {faq.status}
                                </span>
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm"><Edit3 className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-rose-600 border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                       {faq.answer}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase italic mt-2">
                       <span className="flex items-center gap-1 transition-colors hover:text-slate-600">👍 {faq.likes} Helpful</span>
                       <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last Edit: 2 days ago</span>
                    </div>
                 </div>
              ))}
              
              {filteredFaqs.length === 0 && (
                 <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="font-bold text-slate-400">No FAQs found for this filter.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

const RefreshCw: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);

export default FAQPage;
