"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AdmissionFilters } from "@/app/admissions/[level]/types";
import DirectAdmissionCard from "@/components/admissions/DirectAdmissionCard";
import CollegeCard from "@/components/admissions/CollegeCard";
import FeaturedAdmissionAd from "@/components/admissions/FeaturedAdmissionAd";
import DirectAdmissionAd from "@/components/admissions/DirectAdmissionAd";
import Pagination from "@/components/ui/Pagination";
import { sampleColleges, sampleFeaturedColleges, sampleDirectAdmissions, levelConfig } from "./data";

interface AdmissionGridProps {
  filters: AdmissionFilters;
  setFilters: React.Dispatch<React.SetStateAction<AdmissionFilters>>;
  onNavigate: (view: string, data?: any) => void;
  level: string;
}

const SEARCHABLE_FILTER_KEYS: Array<keyof AdmissionFilters> = [
  "academic",
  "program",
];

const AdmissionGrid: React.FC<AdmissionGridProps> = ({
  filters,
  setFilters,
  onNavigate,
  level,
}) => {
  const COLS_PER_ROW = 3;
  const ROWS_BEFORE_FEATURED = 3; // Adjusted to spread them out more if only 2 per page
  const ITEMS_PER_AD = COLS_PER_ROW * ROWS_BEFORE_FEATURED;
  const COLLEGES_PER_PAGE = 18;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const searchTerms = useMemo(
    () =>
      [
        filters.search,
        ...SEARCHABLE_FILTER_KEYS.flatMap((key) => filters[key] as string[]),
      ]
        .map((value) => (typeof value === "string" ? value.trim() : ""))
        .filter(Boolean),
    [filters],
  );

  const filteredColleges = useMemo(() => {
    // Merge colleges and direct admissions, marking direct ones
    let results = [
      ...sampleColleges.map(c => ({ ...c, isDirect: false })),
      ...sampleDirectAdmissions.map(d => ({ ...d, isDirect: true }))
    ];

    // When directAdmission filter is ON, only show direct ones
    if (filters.directAdmission) {
      results = results.filter(c => c.isDirect);
    }

    if (filters.academic.length > 0) {
      results = results.filter((c) => {
        if (c.isDirect) return true; // Keep direct ones for now or add specific logic
        const college = c as any;
        return college.programs.some((p: any) =>
          filters.academic.some((a) =>
            p.name.toLowerCase().includes(a.toLowerCase()),
          ),
        );
      });
    }

    if (filters.program.length > 0) {
      results = results.filter((c) => {
        if (c.isDirect) return true;
        const college = c as any;
        return college.programs.some((p: any) =>
          filters.program.some((pr) =>
            p.name.toLowerCase().includes(pr.toLowerCase()),
          ),
        );
      });
    }

    if (filters.province.length > 0) {
      results = results.filter((c) =>
        filters.province.some((p) =>
          c.location
            .toLowerCase()
            .includes(p.replace("prov_", "").toLowerCase()),
        ),
      );
    }

    if (filters.district.length > 0) {
      results = results.filter((c) =>
        filters.district.some((d) =>
          c.location.toLowerCase().includes(d.replace("d_", "").toLowerCase()),
        ),
      );
    }

    if (filters.type.length > 0) {
      const typeMap: Record<string, string> = {
        ct_private: "Private",
        ct_public: "Public",
        ct_community: "Community",
      };
      const allowedTypes = filters.type.map((t) => typeMap[t]).filter(Boolean);
      if (allowedTypes.length > 0) {
        results = results.filter((c) => allowedTypes.includes(c.type));
      }
    }

    if (searchTerms.length > 0) {
      const terms = searchTerms.map((t) => t.toLowerCase());
      results = results.filter(
        (c) =>
          terms.some((t) => c.collegeName.toLowerCase().includes(t)) ||
          terms.some((t) => c.location.toLowerCase().includes(t)) ||
          (!c.isDirect && terms.some((t) =>
            (c as any).programs.some((p: any) => p.name.toLowerCase().includes(t)),
          )),
      );
    }

    return results;
  }, [filters, searchTerms]);

  const filteredFeatured = useMemo(() => {
    let results = [...sampleFeaturedColleges];

    if (filters.academic.length > 0) {
      results = results.filter((c) =>
        c.programs.some((p) =>
          filters.academic.some((a) =>
            p.toLowerCase().includes(a.toLowerCase()),
          ),
        ),
      );
    }

    if (filters.province.length > 0) {
      results = results.filter((c) =>
        filters.province.some((p) =>
          c.location
            .toLowerCase()
            .includes(p.replace("prov_", "").toLowerCase()),
        ),
      );
    }

    if (filters.type.length > 0) {
      const typeMap: Record<string, string> = {
        ct_private: "Private",
        ct_public: "Public",
        ct_community: "Community",
      };
      const allowedTypes = filters.type.map((t) => typeMap[t]).filter(Boolean);
      if (allowedTypes.length > 0) {
        results = results.filter((c) => allowedTypes.includes(c.type));
      }
    }

    if (searchTerms.length > 0) {
      const terms = searchTerms.map((t) => t.toLowerCase());
      results = results.filter(
        (c) =>
          terms.some((t) => c.provider.toLowerCase().includes(t)) ||
          terms.some((t) => c.location.toLowerCase().includes(t)),
      );
    }

    return results;
  }, [filters, searchTerms]);

  const totalResults = filteredColleges.length;
  const totalPages = Math.ceil(totalResults / COLLEGES_PER_PAGE) || 1;
  const showingFrom = totalResults === 0 ? 0 : (currentPage - 1) * COLLEGES_PER_PAGE + 1;
  const showingTo = Math.min((currentPage - 1) * COLLEGES_PER_PAGE + COLLEGES_PER_PAGE, totalResults);

  const paginatedColleges = useMemo(() => {
    const start = (currentPage - 1) * COLLEGES_PER_PAGE;
    return filteredColleges.slice(start, start + COLLEGES_PER_PAGE);
  }, [filteredColleges, currentPage]);

  const getAdType = (index: number) => {
    // Show Featured Admission Ad at index 5 (end of 2nd row)
    if (index === 5) return "featured";
    
    // Show Direct Admission Ad at index 11 (end of 4th row)
    if (index === 11) return "direct";
    
    // Fallback for very few items on page 1
    if (currentPage === 1 && paginatedColleges.length < 6 && index === paginatedColleges.length - 1) {
      return "featured";
    }

    return null;
  };

  const config = levelConfig[level] || levelConfig["high-school"];

  return (
    <>
      {/* Header Bar */}
      <div className="mb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col justify-start">
            <h1 className="mb-3 text-base text-gray-900">
              Showing {showingFrom.toLocaleString()}-{showingTo.toLocaleString()} of {totalResults.toLocaleString()} <span className="font-bold">{config.title}</span>
            </h1>
          </div>

          <div className="mt-2 flex w-full shrink-0 flex-col gap-3 sm:mt-0 sm:w-[320px] sm:items-end">
            <div className="relative w-full">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
              <input
                type="text"
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }))
                }
                placeholder="Search colleges, locations, courses..."
                className="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm transition-all placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>
      </div>

      {/* All Colleges Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedColleges.map((college, index) => {
            const adType = getAdType(index);
            return (
              <React.Fragment key={index}>
                {college.isDirect ? (
                  <DirectAdmissionCard 
                    {...(college as any)} 
                  />
                ) : (
                  <CollegeCard
                    {...(college as any)}
                    onNavigate={() => onNavigate("collegeDetails", { id: college.collegeName })}
                  />
                )}
                
                {adType === "featured" && filteredFeatured.length > 0 && (
                  <FeaturedAdmissionAd colleges={filteredFeatured} />
                )}

                {adType === "direct" && sampleDirectAdmissions.length > 0 && (
                  <DirectAdmissionAd colleges={sampleDirectAdmissions} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {filteredColleges.length === 0 && (
            <div className="col-span-1 rounded-md border border-gray-100 bg-white py-16 text-center text-gray-500  md:col-span-2 xl:col-span-3">
              No colleges found matching your filters.
            </div>
          )}
      </section>

      {/* Always show pagination even if only one page */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default AdmissionGrid;
