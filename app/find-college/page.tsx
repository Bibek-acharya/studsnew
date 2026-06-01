"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FilterSidebar from "@/components/find-college/FilterSidebar";
import CollegeGrid from "@/components/find-college/CollegeGrid";
import { CollegeFilters, DEFAULT_COLLEGE_FILTERS } from "./types";

const FindCollegePage: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<CollegeFilters>(DEFAULT_COLLEGE_FILTERS);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleNavigate = (view: string, data?: any) => {
    if (view === "collegeDetails" && data?.id) {
      router.push(`/find-college/${data.id}`);
    } else {
      console.log("Navigate to:", view, data);
    }
  };

  return (
    <div className="min-h-screen p-4 text-gray-800 md:p-6 lg:p-8">
      <div className="mx-auto flex max-w-350 flex-col gap-6 lg:flex-row lg:flex-nowrap lg:gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-full shrink-0 lg:w-75">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </aside>

        {/* Mobile filter bottom drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-white rounded-t-2xl shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setShowMobileFilters(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <CollegeGrid
            filters={filters}
            onNavigate={handleNavigate}
            setFilters={setFilters}
            onMobileFilterClick={() => setShowMobileFilters(true)}
          />
        </main>
      </div>
    </div>
  );
};

export default FindCollegePage;
