"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import AdmissionFilterSidebar from "@/components/admissions/AdmissionFilterSidebar";
import AdmissionGrid from "@/components/admissions/AdmissionGrid";
import { AdmissionFilters, DEFAULT_ADMISSION_FILTERS } from "./types";

export default function AdmissionsLevelPage({ params }: { params: Promise<{ level: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [filters, setFilters] = useState<AdmissionFilters>(DEFAULT_ADMISSION_FILTERS);

  const handleNavigate = (view: string, data?: any) => {
    if (view === "collegeDetails" && data?.id) {
      router.push(`/admissions/${resolvedParams.level}/${data.id}`);
    } else {
      console.log("Navigate to:", view, data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-[var(--font-plus-jakarta)] text-gray-800 md:p-6 lg:p-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 lg:flex-row lg:flex-nowrap lg:gap-8">
        <aside className="w-full shrink-0 lg:w-[300px]">
          <AdmissionFilterSidebar filters={filters} setFilters={setFilters} level={resolvedParams.level} />
        </aside>
        <main className="min-w-0 flex-1">
          <AdmissionGrid filters={filters} onNavigate={handleNavigate} setFilters={setFilters} level={resolvedParams.level} />
        </main>
      </div>
    </div>
  );
}
