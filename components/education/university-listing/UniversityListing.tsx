"use client";

import React, { useState, useMemo } from "react";
import FilterSidebar from "./FilterSidebar";
import UniversityCard from "./UniversityCard";
import Pagination from "@/components/ui/Pagination";
import { UniversityData, FilterKey, FiltersState, ITEMS_PER_PAGE } from "./types";
import { UNIVERSITY_TYPES } from "./constants";

interface UniversityListingProps {
  universities: UniversityData[];
  type: "nepali" | "foreign";
}

const UniversityListing: React.FC<UniversityListingProps> = ({
  universities: allUniversities,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("popularity");

  const [filters, setFilters] = useState<FiltersState>({
    academic: [],
    type: [],
    rating: [],
  });

  const toggle = (key: FilterKey, value: string) => {
    setFilters((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
    setCurrentPage(1);
  };

  const clearAll = () => {
    setFilters({ academic: [], type: [], rating: [] });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...allUniversities];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (uni) =>
          uni.name.toLowerCase().includes(q) ||
          uni.location.toLowerCase().includes(q) ||
          uni.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    if (filters.type.length > 0) {
      result = result.filter((uni) => {
        const typeMap: Record<string, string> = {
          ut_private: "Private",
          ut_public: "Public",
        };
        return filters.type.some((ft) => typeMap[ft] === uni.type);
      });
    }

    if (filters.rating.length > 0) {
      const maxThreshold = Math.max(...filters.rating.map(Number));
      result = result.filter((uni) => parseFloat(uni.rating) >= maxThreshold);
    }

    if (sortBy === "rating") {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [allUniversities, searchQuery, filters, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className="w-full shrink-0 lg:w-[300px]">
            <FilterSidebar
              filters={filters}
              onToggle={toggle}
              onSortBy={(v) => { setSortBy(v); setCurrentPage(1); }}
              sortBy={sortBy}
              onClearAll={clearAll}
            />
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-6 mt-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="text-[14px] text-gray-800">
                <h1 className="text-base text-gray-900">
                  Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} <span className="font-bold">Universities</span>
                </h1>
              </div>

              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search universities..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-[14px] font-medium text-gray-800 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] transition-all placeholder-gray-400 focus:border-[#2563eb] focus:outline-none focus:ring-4 focus:ring-blue-500/10 sm:w-[320px]"
                />
                <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {currentItems.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white py-12 text-center shadow-sm">
                <svg className="mx-auto mb-3 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-900">No universities found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {currentItems.map((uni) => (
                  <UniversityCard key={uni.name} university={uni} />
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default UniversityListing;
