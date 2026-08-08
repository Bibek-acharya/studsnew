"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import AdmissionFilterSidebar from "@/components/admissions/AdmissionFilterSidebar";
import AdmissionGrid from "@/components/admissions/AdmissionGrid";
import { AdmissionFilters, DEFAULT_ADMISSION_FILTERS } from "./types";

export default function AdmissionsLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [filters, setFilters] = useState<AdmissionFilters>(
    DEFAULT_ADMISSION_FILTERS,
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleNavigate = (view: string, data?: any) => {
    if (view === "collegeDetails" && data?.id) {
      router.push(`/find-college/${data.id}`);
    } else if (view === "admissionDetails" && data?.id) {
      const url = `/admissions/${resolvedParams.level}/${data.id}`;
      if (data.scrollTo) {
        router.push(`${url}?scrollTo=${data.scrollTo}`);
      } else {
        router.push(url);
      }
    } else {
      console.log("Navigate to:", view, data);
    }
  };

  return (
    <div className="min-h-screen p-4 text-gray-800 md:p-6 lg:p-8">
      <div className="mx-auto flex max-w-350 flex-col gap-6 lg:flex-row lg:flex-nowrap lg:gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-full shrink-0 lg:block lg:w-75">
          <AdmissionFilterSidebar
            filters={filters}
            setFilters={setFilters}
            level={resolvedParams.level}
          />
        </aside>

        {/* Mobile filter bottom drawer */}
        {showMobileFilters && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div
              className="absolute bottom-0 left-0 right-0 max-h-[70vh] rounded-t-2xl bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <AdmissionFilterSidebar
                filters={filters}
                setFilters={setFilters}
                level={resolvedParams.level}
                onClose={() => setShowMobileFilters(false)}
              />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <AdmissionGrid
            filters={filters}
            onNavigate={handleNavigate}
            setFilters={setFilters}
            level={resolvedParams.level}
            onMobileFilterClick={() => setShowMobileFilters(true)}
          />
        </main>
      </div>
    </div>
  );
}
