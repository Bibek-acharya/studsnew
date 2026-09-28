"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGlobalCourses, searchGlobalCourses, fetchCourseFilterCounts, CourseFilterCountsResponse } from "@/services/course-api";
import type { GlobalCourse } from "@/types/course";
import CourseFilters from "./CourseFilters";
import {
  CourseFinderFilters,
  defaultCourseFinderFilters,
  defaultCourseFilterCounts,
  CourseFilterCounts,
} from "./types";
import { buildCourseFilterCounts, filterCourses } from "./filter-matching";
import CourseGrid from "./CourseGrid";

const COURSES_PER_PAGE = 18;

interface CourseFinderPageProps {
  onNavigate: (view: any, data?: any) => void;
  initialData?: {
    courses: GlobalCourse[];
    counts?: CourseFilterCountsResponse;
  };
}

const CourseFinderPage: React.FC<CourseFinderPageProps> = ({
  onNavigate,
  initialData,
}) => {
  // Filters, the applied search term and the page number live in one state
  // object, so every change that reshapes the result set resets to page 1 by
  // construction. Resetting from an effect left page 3 selected after a filter
  // narrowed the results to a single page, which rendered an empty grid.
  const [finder, setFinder] = useState<{
    filters: CourseFinderFilters;
    search: string;
    currentPage: number;
  }>({ filters: defaultCourseFinderFilters, search: "", currentPage: 1 });
  const { filters, search: debouncedSearch, currentPage } = finder;
  const [globalSearch, setGlobalSearch] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const setFilters = useCallback(
    (next: CourseFinderFilters) =>
      setFinder((prev) => ({ ...prev, filters: next, currentPage: 1 })),
    [],
  );
  const setCurrentPage = useCallback(
    (page: number) => setFinder((prev) => ({ ...prev, currentPage: page })),
    [],
  );

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(
      () => setFinder((prev) => ({ ...prev, search: globalSearch, currentPage: 1 })),
      300,
    );
    return () => clearTimeout(timer);
  }, [globalSearch]);

  // Fetch all courses (base data)
  const { data: allData, isLoading } = useQuery({
    queryKey: ["global-courses"],
    queryFn: () => fetchGlobalCourses(1, 100),
    initialData: initialData
      ? { courses: initialData.courses, meta: { total: initialData.courses.length } }
      : undefined,
  });

  // Fetch search results when search is active
  const { data: searchData, isFetching: isSearchFetching } = useQuery({
    queryKey: ["global-courses-search", debouncedSearch],
    queryFn: () => searchGlobalCourses(debouncedSearch),
    enabled: debouncedSearch.trim().length > 0,
  });

  // Kept for the server-rendered payload; facet counts themselves are derived
  // from the loaded courses because the API groups them by the raw stored
  // spelling, which never lines up with the grouped public filter options.
  useQuery({
    queryKey: ["course-filter-counts"],
    queryFn: fetchCourseFilterCounts,
    initialData: initialData?.counts,
  });

  const allCourses = useMemo(() => allData?.courses ?? [], [allData]);
  const isSearching = debouncedSearch.trim().length > 0;
  const baseCourses = useMemo(
    () => (isSearching ? (searchData ?? []) : allCourses),
    [isSearching, searchData, allCourses],
  );

  // Facet counts always reflect the unfiltered set so the sidebar stays stable
  // while the user toggles options.
  const filterCounts: CourseFilterCounts = useMemo(
    () => (allCourses.length > 0 ? buildCourseFilterCounts(allCourses) : defaultCourseFilterCounts),
    [allCourses],
  );

  const filteredCourses = useMemo(
    () => filterCourses(baseCourses, filters),
    [baseCourses, filters],
  );

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / COURSES_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const rangeStart = filteredCourses.length === 0 ? 0 : (activePage - 1) * COURSES_PER_PAGE + 1;
  const rangeEnd = Math.min(activePage * COURSES_PER_PAGE, filteredCourses.length);

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
                Showing {rangeStart}-{rangeEnd} of {filteredCourses.length}{" "}
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
            currentPage={activePage}
            onPageChange={setCurrentPage}
            onNavigate={onNavigate}
            filters={filters}
            onFiltersChange={setFilters}
            isLoading={isLoading || isSearchFetching}
          />
        </section>
      </main>
    </div>
  );
};

export default CourseFinderPage;
