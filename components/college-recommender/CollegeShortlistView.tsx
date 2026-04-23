"use client";

import { useState } from "react";
import { CollegeRecommendation } from "@/services/api";
import { Check, MapPin, Banknote, TrendingUp, Star, ChevronDown, ChevronLeft, Building2, ChevronRight } from "lucide-react";

interface CollegeShortlistViewProps {
  recommendedItems: CollegeRecommendation[];
  shortlistedIds: Set<number | string>;
  onToggleShortlist: (id: number | string) => void;
  onBack: () => void;
  onNavigate: (view: any, data?: any) => void;
}

export default function CollegeShortlistView({
  recommendedItems,
  shortlistedIds,
  onToggleShortlist,
  onNavigate,
}: CollegeShortlistViewProps) {
  const [activeTab, setActiveTab] = useState<"recommended" | "shortlisted">("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | string | null>(null);
  const [previewId, setPreviewId] = useState<number | string | null>(null);

  const filteredItems = recommendedItems.filter((item) => {
    if (activeTab === "shortlisted" && !shortlistedIds.has(item.id)) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const previewItem = recommendedItems.find((r) => r.id === previewId);

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased text-slate-800 font-sans max-w-350 mx-auto relative">
      {/* Backdrop */}
      {previewId && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-150"
          onClick={() => setPreviewId(null)}
        />
      )}
      
      {/* Side Preview Panel */}
      <aside
        className={`fixed top-0 right-0 h-screen w-100 bg-white border-l border-slate-200 z-200 overflow-y-auto transition-transform duration-400 ease-in-out ${
          previewId ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 pb-32">
          {!previewId ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
              <Building2 className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-medium text-slate-500">
                Select a college to see details
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div
                className="flex items-center gap-2 mb-8 cursor-pointer group"
                onClick={() => setPreviewId(null)}
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
                <span className="font-bold text-slate-900 text-lg">
                  Preview
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md border border-slate-100 bg-white flex items-center justify-center font-extrabold text-2xl text-slate-800 shrink-0  shadow-slate-100">
                    {previewItem?.name?.[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">
                      {previewItem?.name}
                    </h2>
                    <p className="text-slate-500 font-bold text-sm mt-0.5">
                      {previewItem?.location}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                   <button
                     onClick={() => previewItem && onToggleShortlist(previewItem.id)}
                     className={`w-10 h-10 rounded-md border-2 transition-all flex items-center justify-center ${
                       previewItem && shortlistedIds.has(previewItem.id)
                        ? "bg-brand-blue border-brand-blue text-white"
                        : "bg-white border-slate-200 text-transparent hover:border-brand-blue"
                    }`}
                  >
                    <Check className="w-6 h-6 stroke-[3px]" />
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-50 pt-8 grid grid-cols-2 gap-y-10 gap-x-6">
                <div>
                  <div className="flex items-center gap-2 text-slate-500 font-extrabold mb-2 text-[13px] uppercase tracking-wide">
                    <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Status
                  </div>
                  <div className="text-brand-blue font-bold text-[1.05rem]">
                    Target
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-500 font-extrabold mb-2 text-[13px] uppercase tracking-wide">
                    <Building2 className="w-4 h-4 text-slate-700" />
                    Institution type
                  </div>
                  <div className="font-bold text-slate-900 text-[1.05rem]">
                    University
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-500 font-extrabold mb-2 text-[13px] uppercase tracking-wide">
                    <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Application Fee
                  </div>
                  <div className="font-bold text-slate-900 text-[1.05rem]">
                    Rs. 1,000
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-500 font-extrabold mb-2 text-[13px] uppercase tracking-wide">
                    <Banknote className="w-4 h-4 text-slate-700" />
                    Tuition cost
                  </div>
                  <div className="font-bold text-slate-900 text-[1.05rem]">
                    Rs. {previewItem?.tuition}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-500 font-extrabold mb-2 text-[13px] uppercase tracking-wide">
                    <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Admission rate
                  </div>
                  <div className="font-bold text-slate-900 text-[1.05rem]">
                    45% admission rate
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-500 font-extrabold mb-2 text-[13px] uppercase tracking-wide">
                    <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Avg. cost after aid
                  </div>
                  <div className="font-bold text-slate-900 text-[1.05rem]">
                    Rs. 80,000/year
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 mt-10 pt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                  About
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed text-[15px]">
                  A dynamic university located in the scenic city of Pokhara offering diverse programs. It focuses on higher education and research, particularly in business, science, and technology. For more information, visit http://www.edu.np.
                </p>
              </div>

              <div className="pt-12">
                <button
                  onClick={() =>
                    onNavigate("collegeProfile", { id: previewItem?.id })
                  }
                  className="w-full rounded-md bg-brand-blue py-4 text-white font-bold hover:bg-brand-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/10 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  View Full Profile
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Top Header Tabs */}
      <nav className="border-b border-gray-200 mt-4 flex bg-white z-10 transition-all">
        <button
          onClick={() => setActiveTab("recommended")}
          className={`px-8 py-4 text-sm font-bold transition-all relative ${
            activeTab === "recommended" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Recommended Colleges
          {activeTab === "recommended" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("shortlisted")}
          className={`px-8 py-4 text-sm font-bold transition-all relative ${
            activeTab === "shortlisted" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Your Shortlist ({shortlistedIds.size})
          {activeTab === "shortlisted" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
          )}
        </button>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  placeholder="Search for colleges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-md py-3 pl-12 pr-6 text-[15px] focus:outline-none focus:ring-1 focus:ring-brand-blue transition-all"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="relative min-w-[200px]">
                <select className="w-full appearance-none bg-white border border-gray-200 rounded-md py-3 pl-6 pr-12 text-[15px] font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-blue cursor-pointer">
                  <option>Sort By: Match %</option>
                  <option>Tuition: Low to High</option>
                  <option>Tuition: High to Low</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Grid 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const isSelected = shortlistedIds.has(item.id);
                const isExpanded = expandedId === item.id;
                
                return (
                  <div 
                    key={item.id} 
                    onClick={() => setPreviewId(item.id)}
                    className="bg-white rounded-md border border-slate-200 overflow-hidden cursor-pointer flex flex-col transition-all duration-200 hover:border-brand-blue group"
                  >
                    <div className="p-6 grow">
                      <div className="flex justify-between items-start gap-4 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md bg-brand-blue/10 text-brand-blue flex items-center justify-center font-extrabold border border-brand-blue/20 shrink-0 text-xs tracking-tighter">
                            {item.name?.[0]}
                          </div>
                          <h3 className="font-bold text-slate-800 text-lg leading-tight tracking-tight">
                            {item.name}
                          </h3>
                        </div>
                        <div className="shrink-0 pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleShortlist(item.id);
                            }}
                            className={`p-1.5 rounded-full transition-colors shrink-0 ${
                              isSelected ? "text-brand-blue" : "text-slate-300 hover:text-slate-400"
                            }`}
                          >
                            <svg className="w-6 h-6" fill={isSelected ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-brand-blue" />
                          <span className="text-brand-blue font-bold">
                            {item.type || "Target"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 font-medium overflow-hidden">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate" title={item.location}>
                            {item.location}
                          </span>
                        </div>
                        <div className="col-span-2 my-1 border-t border-slate-100"></div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Banknote className="w-4 h-4 text-slate-400" />
                          <span className="font-bold text-slate-700">
                            Rs. {item.tuition}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Check className="w-4 h-4 text-brand-blue" />
                          <span className="font-bold text-slate-700">
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="px-6 py-4 border-t border-slate-50 bg-slate-50/50 flex flex-col hover:bg-slate-100/80 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(isExpanded ? null : item.id);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-brand-blue font-bold text-sm tracking-tight">
                          <Star className="w-5 h-5 fill-brand-blue/10 text-brand-blue" />
                          <span>
                            {Math.floor(item.match_score * 10)}% Overall match
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {isExpanded && (
                        <div className="pt-4 pb-1 space-y-3">
                          {item.reasons?.slice(0, 3).map((reason, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm font-medium text-slate-600">
                              <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-brand-blue" />
                                <span>{reason}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 pt-0 bg-slate-50/50">
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           onNavigate("collegeProfile", { id: item.id });
                         }}
                         className="w-full py-2 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-700 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all"
                       >
                         Full details
                       </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="mt-40 text-center">
                <div className="text-slate-300 mb-4 whitespace-pre-wrap">
                  <MapPin className="w-16 h-16 mx-auto mb-4 opacity-10" />
                  <p className="text-lg font-bold text-slate-400">No colleges matched</p>
                  <p className="text-[14px] text-slate-400 font-medium">Try adjusting your filters or search keywords</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
