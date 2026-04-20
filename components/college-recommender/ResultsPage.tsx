"use client";

import React from "react";
import {
  Check,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Star,
  MapPin,
  Banknote,
  TrendingUp,
  Building2,
  X,
  Filter,
} from "lucide-react";
import { CollegeRecommendation } from "@/services/api";

interface ResultsPageProps {
  results: CollegeRecommendation[];
  previewId: number | string | null;
  setPreviewId: (id: number | string | null) => void;
  selectedIds: Set<number | string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<number | string>>>;
  expandedMatchId: number | string | null;
  setExpandedMatchId: (id: number | string | null) => void;
  isRefineModalOpen: boolean;
  setIsRefineModalOpen: (open: boolean) => void;
  toggleSelection: (id: number | string) => void;
  onNavigate: (view: any, data?: any) => void;
  onRefine: () => void;
  onShortlist?: () => void;
  tution: string;
}

export default function ResultsPage({
  results,
  previewId,
  setPreviewId,
  selectedIds,
  setSelectedIds,
  expandedMatchId,
  setExpandedMatchId,
  isRefineModalOpen,
  setIsRefineModalOpen,
  toggleSelection,
  onNavigate,
  onShortlist}: ResultsPageProps) {
  const selectedCount = selectedIds.size;
  const previewItem = results.find((r) => r.id === previewId) || results[0];

return (
    <div className="min-h-screen bg-white text-slate-800 antialiased font-sans overflow-x-hidden relative">
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
                    Rs. 1,000/year
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
            </div>
          )}
        </div>
      </aside>

{/* Main Content Wrapper */}
      <div
        className='transition-all duration-400'
      >
        <header className="max-w-350 mx-auto px-4 pt-12 pb-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Colleges that fit you best
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mb-6 font-medium">
            Based on your preferences in Nepal, here are your best college
            matches. Review them to create your shortlist!
          </p>

          <button
            onClick={() => setIsRefineModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all focus:outline-none"
          >
            <Filter className="w-4 h-4" />
            Refine your answers
          </button>
        </header>

        <main className="max-w-350 mx-auto px-4 mt-4 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => {
              const isSelected = selectedIds.has(item.id);
              const isExpanded = expandedMatchId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-md border border-slate-200 overflow-hidden cursor-pointer flex flex-col transition-all duration-200 hover:border-brand-blue"
                  onClick={() => setPreviewId(item.id)}
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
                            toggleSelection(item.id);
                          }}
                          className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                            isSelected
                              ? "bg-brand-blue border-brand-blue text-white"
                              : "bg-white border-slate-300 text-transparent hover:border-brand-blue"
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3px]" />
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
                          Rs. {item.tuition || "1,50,000"}
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
                      setExpandedMatchId(isExpanded ? null : item.id);
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
                        <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>Location preference match</span>
                          </div>
                          <span className="font-bold text-slate-800">100%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                          <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-slate-400" />
                            <span>Good financial fit</span>
                          </div>
                          <span className="font-bold text-slate-800">85%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-slate-400" />
                            <span>Strong academic fit</span>
                          </div>
                          <span className="font-bold text-slate-800">92%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Global Select & Shortlist Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 transition-all duration-400 flex-row"
      >
        <div className="max-w-350 mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-800">
              Select All
            </span>
            <button
              onClick={() => {
                if (selectedCount === results.length)
                  setSelectedIds(new Set());
                else setSelectedIds(new Set(results.map((r) => r.id)));
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                selectedCount === results.length
                  ? "bg-brand-blue"
                  : "bg-slate-300"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white ring-0 transition duration-200 ease-in-out ${
                  selectedCount === results.length
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-sm font-bold ${selectedCount > 0 ? "text-brand-blue" : "text-slate-500"}`}
            >
              ({selectedCount}/{results.length} Selected)
            </span>
          </div>
          <button
            onClick={onShortlist}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-md font-bold text-white transition-all duration-300 bg-brand-blue hover:bg-brand-hover cursor-pointer`}
          >
            {selectedCount > 0 ? `Add to shortlist (${selectedCount})` : "View Shortlist"}
          </button>
        </div>
      </div>

      {/* Refine Confirmation Modal */}
      {isRefineModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-210 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-md border border-slate-200 w-full max-w-md overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <button
                onClick={() => setIsRefineModalOpen(false)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Are you sure?
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-10 font-medium">
                Changing preferences will result in your current recommendations being lost
              </p>
              <div className="flex items-center justify-end gap-6">
<button
                  onClick={() => {
                    setIsRefineModalOpen(false);
                    onNavigate(1);
                  }}
                  className='px-6 py-3 rounded-md bg-slate-50 text-slate-900 font-semibold text-md hover:bg-blue-100 transition-all'
                >
                  Leave Page
                </button>
                <button
                  onClick={() => {
                    setIsRefineModalOpen(false);
                    
                  }}
                  className="px-6 py-3 rounded-md bg-slate-50 text-slate-900 font-semibold text-md hover:bg-blue-100 transition-all"
                >
                  Back to Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}