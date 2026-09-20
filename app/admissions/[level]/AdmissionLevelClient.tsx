"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdmissionFilterSidebar from "@/components/admissions/AdmissionFilterSidebar";
import AdmissionGrid from "@/components/admissions/AdmissionGrid";
import type { AdmissionCollegeItem, AdmissionPagination } from "@/services/admission.api";
import { AdmissionFilters, DEFAULT_ADMISSION_FILTERS } from "./types";

export interface AdmissionInitialData {
  colleges: AdmissionCollegeItem[];
  pagination: AdmissionPagination;
}

interface NavigationData {
  id?: string | number;
  courseId?: string;
  scrollTo?: string;
}

interface AdmissionLevelClientProps {
  level: string;
  initialData?: AdmissionInitialData;
}

export default function AdmissionLevelClient({
  level,
  initialData,
}: AdmissionLevelClientProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<AdmissionFilters>(
    DEFAULT_ADMISSION_FILTERS,
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleNavigate = (view: string, data?: NavigationData) => {
    if (view === "collegeDetails" && data?.id) {
      router.push(`/find-college/${data.id}`);
    } else if (view === "admissionDetails" && data?.id) {
      const url = `/admissions/${level}/${data.id}`;
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
            level={level}
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
                level={level}
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
            level={level}
            onMobileFilterClick={() => setShowMobileFilters(true)}
            initialData={
              initialData
                ? {
                    colleges: initialData.colleges,
                    pagination: initialData.pagination,
                  }
                : undefined
            }
          />
        </main>
      </div>
    </div>
  );
}
