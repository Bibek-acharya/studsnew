"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import EmptyTabState from "./EmptyTabState";

interface TabCoursesProps {
  courses: any[] | null;
}

const LEVEL_FILTERS = ["all", "Bachelor's", "Master", "Master of Philosophy", "Doctorate", "Post graduate diploma"];

const TabCourses: React.FC<TabCoursesProps> = ({ courses }) => {
  const [courseFilter, setCourseFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    if (!courses) return [];
    return courses.filter((c) => {
      if (courseFilter !== "all" && c.level !== courseFilter) return false;
      return true;
    });
  }, [courses, courseFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (!courses || courses.length === 0)
    return <EmptyTabState tabName="courses" />;

  return (
    <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
        <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900">
          Courses & fees
        </h3>
        <div className="flex gap-2 text-xs font-medium flex-wrap">
          {LEVEL_FILTERS.map((level) => (
            <button
              key={level}
              onClick={() => { setCourseFilter(level); setPage(1); }}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                courseFilter === level
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {level === "all" ? "All" : level}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-500 text-lg font-medium mb-4">No Courses Found</p>
          <p className="text-gray-400 text-sm mb-6">No {courseFilter === "all" ? "" : courseFilter} courses are currently available.</p>
          <Link
            href="/course-finder"
            className="bg-[#0000ff] hover:bg-[#0000cc] cursor-pointer text-white font-semibold py-2.5 px-6 rounded-md transition-colors text-sm inline-block"
          >
            View All Courses
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop header */}
          <div className="hidden sm:grid sm:grid-cols-12 gap-4 border-b border-gray-100 bg-white px-6 py-5 items-center">
            <div className="sm:col-span-4 text-[13px] font-bold uppercase tracking-wider text-gray-800">
              COURSES NAME
            </div>
            <div className="sm:col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">
              DURATION
            </div>
            <div className="sm:col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">
              FEES / YEAR
            </div>
            <div className="sm:col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">
              ELIGIBILITY & SEAT
            </div>
          </div>

          {paginated.map((course: any, i: number) => (
              <div
                key={i}
                className="border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50/50"
              >
                {/* Mobile card view */}
                <div className="sm:hidden space-y-3">
                  <h4 className="text-[15.5px] font-bold text-gray-900">
                    {course.name}
                  </h4>
                  {course.sub_description ? (
                    <p className="text-[12px] text-gray-500">
                      {course.sub_description}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
                    <div>
                      <span className="text-gray-400">
                        Duration:{" "}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {course.duration}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Fee: </span>
                      <span className="font-semibold text-[#2563eb]">
                        {course.fees}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">
                        Eligibility:{" "}
                      </span>
                      <span className="text-gray-600">
                        {course.eligibility}
                      </span>
                    </div>
                    {course.seats ? (
                      <div>
                        <span className="inline-block rounded bg-[#eafaef] px-2.5 py-1 text-[11px] font-bold text-[#16a34a]">
                          {course.seats}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
                {/* Desktop grid view */}
                <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-4 pr-4">
                    <h4 className="text-[15.5px] font-bold text-gray-900">
                      {course.name}
                    </h4>
                    <p className="mt-1 text-[12px] text-gray-500">
                      {course.sub_description || ""}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <h4 className="text-[15.5px] font-bold text-gray-900">
                      {course.duration}
                    </h4>
                    <p className="mt-1 text-[12px] text-gray-500">
                      {course.durationSub || ""}
                    </p>
                  </div>
                  <div className="sm:col-span-3">
                    <h4 className="text-[15.5px] font-bold text-[#2563eb]">
                      {course.fees}
                    </h4>
                    <p className="mt-1 text-[12px] text-gray-500"></p>
                  </div>
                  <div className="sm:col-span-3">
                    <p className="mb-2 text-[12.5px] font-medium text-gray-600">
                      {course.eligibility}
                    </p>
                    <span className="inline-block rounded bg-[#eafaef] px-2.5 py-1 text-[11px] font-bold text-[#16a34a]">
                      {course.seats}
                    </span>
                  </div>
                </div>
              </div>
            ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-4">
              <p className="text-sm text-gray-600">
                Showing {((page - 1) * PER_PAGE) + 1} to {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} courses
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TabCourses;
