"use client";

import { useState } from "react";
import { ScholarshipCardItem } from "./types";

interface ShortlistViewProps {
  recommendedItems: ScholarshipCardItem[];
  shortlistedIds: number[];
  onToggleShortlist: (id: number) => void;
  onBack: () => void;
}

export default function ShortlistView({
  recommendedItems,
  shortlistedIds,
  onToggleShortlist,
  onBack,
}: ShortlistViewProps) {
  const [activeTab, setActiveTab] = useState<"recommended" | "shortlisted">("recommended");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = recommendedItems.filter((item) => {
    if (activeTab === "shortlisted" && !shortlistedIds.includes(item.id)) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen max-w-350 mx-auto bg-white flex flex-col antialiased text-gray-900 font-sans">
      {/* Top Header Tabs */}
      <nav className="border-b border-gray-200 mt-4 flex bg-white z-10">
        <button
          onClick={() => setActiveTab("recommended")}
          className={`px-4 py-4 text-sm font-bold transition-all relative ${activeTab === "recommended" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
        >
          Recommended
          {activeTab === "recommended" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("shortlisted")}
          className={`px-4 py-4 text-sm font-bold transition-all relative ${activeTab === "shortlisted" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
        >
          Your List
          {activeTab === "shortlisted" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
          )}
        </button>
      </nav>

      <div className="flex flex-1 overflow-hidden">


        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  placeholder="Search for scholarships"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-md py-3 pl-6 pr-12 text-[15px] focus:outline-none focus:ring-1 focus:ring-brand-blue transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="relative min-w-[240px]">
                <select className="w-full appearance-none bg-white border border-gray-200 rounded-md py-3 pl-6 pr-12 text-[15px] font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-blue cursor-pointer">
                  <option>Deadline (Nearest)</option>
                  <option>Amount (Highest)</option>
                  <option>Amount (Lowest)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="absolute -bottom-6 left-2 text-[11px] font-medium text-gray-400">
                  Closest upcoming deadlines first
                </div>
              </div>
            </div>

            {/* Grid 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-10">
              {filteredItems.map((item) => {
                const isShortlisted = shortlistedIds.includes(item.id);

                return (
                  <article
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-md p-5 transition-all flex flex-col h-full relative group hover:border-gray-300"
                  >
                    <div className="flex justify-between items-start mb-3 gap-3">
                      <h3 className="font-bold text-gray-900 text-[1.05rem] leading-snug group-hover:text-brand-blue transition-colors truncate" title={item.title}>
                        {item.title}
                      </h3>
                      <button
                        onClick={() => onToggleShortlist(item.id)}
                        className={`p-1.5 rounded-full transition-colors ${
                          isShortlisted ? "text-brand-blue" : "text-gray-300 hover:text-gray-400"
                        }`}
                      >
                        <svg className="w-6 h-6" fill={isShortlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`${item.tagColorClass} text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>
                        {item.providerType}
                      </span>
                      <span className="bg-blue-50 text-brand-blue border border-blue-100 text-[0.65rem] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {item.coverage}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-5 grow line-clamp-3">{item.description}</p>

                    <div className="pt-4 border-t border-gray-100 flex items-end justify-between mt-auto">
                      <div>
                        <span className="block text-[0.7rem] text-gray-400 font-bold uppercase tracking-wider mb-1">Deadline</span>
                        <span className="text-brand-blue font-bold text-[0.95rem]">{item.deadline}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-brand-blue hover:bg-brand-hover text-white px-3.5 py-1.5 rounded-md text-sm font-semibold transition-colors ">
                          Apply
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="mt-20 text-center">
                <div className="text-gray-400 mb-4 whitespace-pre-wrap">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-bold text-gray-500">No scholarships found</p>
                  <p className="text-[14px] text-gray-400">Try adjusting your search or filters</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>


    </div>
  );
}
