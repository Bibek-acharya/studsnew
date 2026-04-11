"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FilterSidebar from "@/components/find-college/FilterSidebar";
import CollegeGrid from "@/components/find-college/CollegeGrid";
import { CollegeFilters, DEFAULT_COLLEGE_FILTERS } from "./types";

const FindCollegePage: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<CollegeFilters>(DEFAULT_COLLEGE_FILTERS);
  const handleNavigate = (view: string, data?: any) => {
    if (view === "collegeDetails" && data?.id) {
      router.push(`/find-college/${data.id}`);
    } else {
      console.log("Navigate to:", view, data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-[Inter,sans-serif] text-gray-800 md:p-6 lg:p-8">
      <div className="mx-auto flex max-w-350 flex-col gap-6 lg:flex-row lg:flex-nowrap lg:gap-8">
        <aside className="w-full shrink-0 lg:w-75">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </aside>
        <main className="min-w-0 flex-1">
          <CollegeGrid filters={filters} onNavigate={handleNavigate} setFilters={setFilters} />
        </main>
      </div>
    </div>
  );
};

export default FindCollegePage;
