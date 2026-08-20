"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGlobalCourses, searchGlobalCourses, fetchCourseFilterCounts, CourseFilterCountsResponse } from "@/services/course-api";
import CourseFilters from "./CourseFilters";
import {
  CourseFinderFilters,
  defaultCourseFinderFilters,
  defaultCourseFilterCounts,
  CourseFilterCounts,
} from "./types";
import CourseGrid from "./CourseGrid";

interface CourseFinderPageProps {
  onNavigate: (view: any, data?: any) => void;
}

const CourseFinderPage: React.FC<CourseFinderPageProps> = ({ onNavigate }) => {
  const [filters, setFilters] = useState<CourseFinderFilters>(
    defaultCourseFinderFilters,
  );
  const [globalSearch, setGlobalSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(globalSearch), 300);
    return () => clearTimeout(timer);
  }, [globalSearch]);

  // Fetch all courses (base data)
  const { data: allData, isLoading } = useQuery({
    queryKey: ["global-courses"],
    queryFn: () => fetchGlobalCourses(1, 100),
  });

  // Fetch search results when search is active
  const { data: searchData } = useQuery({
    queryKey: ["global-courses-search", debouncedSearch],
    queryFn: () => searchGlobalCourses(debouncedSearch),
    enabled: debouncedSearch.trim().length > 0,
  });

  // Fetch filter counts from backend
  const { data: filterCountsData } = useQuery({
    queryKey: ["course-filter-counts"],
    queryFn: fetchCourseFilterCounts,
  });

  const allCourses = allData?.courses || [];
  const baseCourses = debouncedSearch.trim() ? (searchData || []) : allCourses;

  // Map backend filter counts to frontend format
  const filterCounts: CourseFilterCounts = useMemo(() => {
    if (!filterCountsData) return defaultCourseFilterCounts;
    return {
      byAcademic: filterCountsData.level_counts || {},
      byField: filterCountsData.field_counts || {},
      byUniversity: filterCountsData.affiliation_counts || {},
      byProvider: {},
      byDuration: {},
    };
  }, [filterCountsData]);

  const filteredCourses = useMemo(() => {
    return baseCourses.filter((course) => {
      // Academic Level Filter — match against full level string
      if (filters.academicLevels.length > 0) {
        const level = (course.level || "").toLowerCase();
        const matchesLevel = filters.academicLevels.some((l) => {
          const filterLabel = l.toLowerCase();
          return level.includes(filterLabel) || filterLabel.includes(level);
        });
        if (!matchesLevel) return false;
      }

      // Field of Study Filter — match against full field string
      if (filters.fields.length > 0) {
        const field = (course.fieldOfStudy || course.field || "").toLowerCase();
        const matchesField = filters.fields.some((f) => {
          const filterLabel = f.toLowerCase();
          return field.includes(filterLabel) || filterLabel.includes(field);
        });
        if (!matchesField) return false;
      }

      // University/Board Filter — match against affiliation name
      if (filters.universities.length > 0) {
        const affiliation = (course.affiliationName || "").toLowerCase();
        const matchesUni = filters.universities.some((u) => {
          const filterLabel = u.toLowerCase();
          return affiliation.includes(filterLabel) || filterLabel.includes(affiliation);
        });
        if (!matchesUni) return false;
      }

      return true;
    });
  }, [baseCourses, filters]);

  const hasActiveFilters =
    filters.academicLevels.length > 0 ||
    filters.fields.length > 0 ||
    filters.universities.length > 0 ||
    filters.entranceRequired !== "";
  const appliedCount =
    filters.academicLevels.length +
    filters.fields.length +
    filters.universities.length +
    (filters.entranceRequired ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-800 md:p-6 lg:p-8 pt-24">
      <main className="mx-auto flex w-full max-w-350 flex-col gap-6 lg:flex-row lg:flex-nowrap lg:gap-8 items-start">
        <aside className="hidden lg:block w-full shrink-0 lg:w-75 h-fit">
          <CourseFilters
            filters={filters}
            counts={filterCounts}
            onChange={setFilters}
          />
        </aside>

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-white rounded-t-2xl shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <CourseFilters
                filters={filters}
                counts={filterCounts}
                onChange={setFilters}
                onClose={() => setShowMobileFilters(false)}
              />
            </div>
          </div>
        )}

        <section className="flex-1 w-full min-w-0 flex flex-col">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div>
              <h1 className="text-base font-normal text-gray-900">
                Showing 1-{filteredCourses.length} of {filteredCourses.length}{" "}
                <span className="font-bold">courses</span>
              </h1>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80 shrink-0 min-w-0">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search programs, degrees..."
                  className="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm transition-all placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 shrink-0"
              >
                <i className="fa-solid fa-sliders text-sm"></i>
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {appliedCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <CourseGrid
            courses={filteredCourses}
            totalCourses={filteredCourses.length}
            onNavigate={onNavigate}
            filters={filters}
            onFiltersChange={setFilters}
            isLoading={isLoading}
          />
        </section>
      </main>
    </div>
  );
};

export default CourseFinderPage;
