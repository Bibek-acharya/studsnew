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
import { on } from "events";

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
  onRefine,
  tution
}: ResultsPageProps) {
  const selectedCount = selectedIds.size;
  const previewItem = results.find((r) => r.id === previewId) || results[0];

return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans overflow-x-hidden relative">
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
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div
                className="flex items-center gap-2 mb-6 cursor-pointer group"
                onClick={() => setPreviewId(null)}
              >
                <ChevronLeft className="w-4 h-4 text-slate-700 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-slate-700 text-base">
                  Close Preview
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg border border-slate-200 flex items-center justify-center font-extrabold text-xl bg-white text-slate-700 shrink-0">
                    {previewItem?.name?.[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                      {previewItem?.name}
                    </h2>
                    <p className="text-slate-500 font-bold text-sm mt-1">
                      {previewItem?.location}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="border-slate-200 my-5" />

              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold mb-1 text-xs">
                    <TrendingUp className="w-4 h-4 text-brand-blue" />
                    Status
                  </div>
                  <div className="text-brand-blue font-bold text-base">
                    Target
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold mb-1 text-xs">
                    <Building2 className="w-4 h-4 text-slate-700" />
                    Institution type
                  </div>
                  <div className="font-bold text-slate-900 text-base">
                    University
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold mb-1 text-xs">
                    <MapPin className="w-4 h-4 text-slate-700" />
                    Application Fee
                  </div>
                  <div className="font-bold text-slate-900 text-base">
                    Rs. 2,000/year
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold mb-1 text-xs">
                    <Banknote className="w-4 h-4 text-slate-700" />
                    Tuition cost
                  </div>
                  <div className="font-bold text-slate-900 text-base">
                    Rs. 3,80,000/year
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold mb-1 text-xs">
                    <TrendingUp className="w-4 h-4 text-slate-700" />
                    Admission rate
                  </div>
                  <div className="font-bold text-slate-900 text-base">
                    22% admission rate
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold mb-1 text-xs">
                    <Banknote className="w-4 h-4 text-slate-700" />
                    Avg. cost after aid
                  </div>
                  <div className="font-bold text-slate-900 text-base">
                    Rs. 1,50,000/year
                  </div>
                </div>
              </div>

              <hr className="border-slate-200 my-5" />

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  About
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed text-sm">
                  {previewItem?.name} is recognized for its commitment to
                  academic excellence and holistic student development in{" "}
                  {previewItem?.location}. It provides a modern learning
                  environment with focus on career readiness.
                </p>
              </div>

              <hr className="border-slate-200 my-5" />

              <div>
                <h3 className="text-lg font-bold mb-4 text-brand-blue">
                  Why it matches you
                </h3>
                  <div className="space-y-4">
                    {previewItem?.reasons?.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-brand-blue stroke-[3px]" />
                        </div>
                        <div className="font-bold text-slate-700 text-sm leading-relaxed">
                          {reason}
                        </div>
                      </div>
                    ))}
                  </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() =>
                    onNavigate("collegeProfile", { id: previewItem.id })
                  }
                  className="w-full rounded-lg bg-brand-blue py-4 text-white font-bold hover:bg-brand-hover transition-all flex items-center justify-center gap-2"
                >
                  View Full Profile
                  <ChevronRight className="w-4 h-4" />
                </button>
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all focus:outline-none"
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
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden cursor-pointer flex flex-col transition-all duration-200 hover:border-brand-blue"
                  onClick={() => setPreviewId(item.id)}
                >
                  <div className="p-6 grow">
                    <div className="flex justify-between items-start gap-4 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center font-extrabold border border-brand-blue/20 shrink-0 text-xs tracking-tighter">
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
            disabled={selectedCount === 0}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-white transition-all duration-300 ${
              selectedCount > 0
                ? "bg-brand-blue hover:bg-brand-hover cursor-pointer"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            Add to shortlist
          </button>
        </div>
      </div>

      {/* Refine Confirmation Modal */}
      {isRefineModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-210 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-lg border border-slate-200 w-full max-w-md overflow-hidden relative"
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
                  className='px-6 py-3 rounded-lg bg-slate-50 text-slate-900 font-semibold text-md hover:bg-blue-100 transition-all'
                >
                  Leave Page
                </button>
                <button
                  onClick={() => {
                    setIsRefineModalOpen(false);
                    
                  }}
                  className="px-6 py-3 rounded-lg bg-slate-50 text-slate-900 font-semibold text-md hover:bg-blue-100 transition-all"
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