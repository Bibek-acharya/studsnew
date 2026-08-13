"use client";

import React, { useMemo, useState, useEffect } from "react";
import { GlobalCourse } from "@/types/course";
import { fetchGlobalCourses } from "@/services/course-api";
import CourseFilters from "./CourseFilters";
import {
  CourseFinderFilters,
  defaultCourseFinderFilters,
  defaultCourseFilterCounts,
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [courses, setCourses] = useState<GlobalCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page] = useState(1);
  const [limit] = useState(100);

  useEffect(() => {
    setLoading(true);
    fetchGlobalCourses(page, limit)
      .then((res) => {
        setCourses(res.courses || []);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [page, limit]);

  const allCourses = courses;

  const filteredCourses = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();

    return allCourses.filter((course) => {
      // Basic Search
      if (q) {
        const hit =
          course.title?.toLowerCase().includes(q) ||
          course.field?.toLowerCase().includes(q) ||
          course.affiliationName?.toLowerCase().includes(q);
        if (!hit) return false;
      }

      // Academic Level Filter
      if (filters.academicLevels.length > 0) {
        const level = (course.level || "").toLowerCase();
        const matchesLevel = filters.academicLevels.some((l) => {
          if (l === "plus2")
            return (
              level.includes("+2") ||
              level.includes("higher") ||
              level.includes("intermediate")
            );
          if (l === "alevel") return level.includes("a level");
          if (l === "diploma")
            return level.includes("diploma") || level.includes("ctevt");
          if (l === "masters")
            return level.includes("masters") || level.includes("master");
          return false;
        });
        if (!matchesLevel) return false;
      }

      // Field of Study Filter
      if (filters.fields.length > 0) {
        const field = (course.field || "").toLowerCase();
        const matchesField = filters.fields.some((f) => {
          if (f === "p2_sci" && field.includes("science")) return true;
          if (f === "p2_mgmt" && field.includes("management")) return true;
          if (f === "p2_hum" && field.includes("humanities")) return true;
          if (f === "p2_edu" && field.includes("education")) return true;
          if (f === "p2_law" && field.includes("law")) return true;
          if (f === "d_eng" && field.includes("engineering")) return true;
          if (
            f === "d_med" &&
            (field.includes("medical") || field.includes("nursing"))
          )
            return true;
          if (
            f === "d_hm" &&
            (field.includes("hotel") || field.includes("tourism"))
          )
            return true;
          if (f === "d_agr" && field.includes("agriculture")) return true;
          if (
            f === "m_mgmt" &&
            (field.includes("management") ||
              field.includes("mba") ||
              field.includes("mbs"))
          )
            return true;
          if (
            f === "m_it" &&
            (field.includes("it") || field.includes("computer"))
          )
            return true;
          if (f === "m_edu" && field.includes("education")) return true;
          return false;
        });
        if (!matchesField) return false;
      }

      return true;
    });
  }, [allCourses, globalSearch, filters]);

  const hasActiveFilters = filters.academicLevels.length > 0 || filters.fields.length > 0;
  const appliedCount = filters.academicLevels.length + filters.fields.length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-800 md:p-6 lg:p-8 pt-24">
      <main className="mx-auto flex w-full max-w-350 flex-col gap-6 lg:flex-row lg:flex-nowrap lg:gap-8 items-start">
        <aside className="hidden lg:block w-full shrink-0 lg:w-75 h-fit sticky top-24">
          <CourseFilters
            filters={filters}
            counts={defaultCourseFilterCounts}
            onChange={setFilters}
          />
        </aside>

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-white rounded-t-2xl shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <CourseFilters
                filters={filters}
                counts={defaultCourseFilterCounts}
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
              <p className="mt-1 text-[13px] text-gray-500 font-medium">
                Tailored for your future.
              </p>
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
            isLoading={loading}
          />
        </section>
      </main>
    </div>
  );
};

export default CourseFinderPage;
