"use client";

import React, { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import EmptyTabState from "@/app/find-college/[id]/components/EmptyTabState";

interface CoursesTabProps {
  universityId: number;
}

export default function CoursesTab({ universityId }: CoursesTabProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [coursesPage, setCoursesPage] = useState(1);
  const [coursesTotal, setCoursesTotal] = useState(0);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [courseFilter, setCourseFilter] = useState("all");

  useEffect(() => {
    if (!universityId) return;
    setCoursesLoading(true);
    apiService
      .getUniversityCourses(universityId, coursesPage, 10, courseFilter)
      .then((res) => {
        setCourses(res.data.courses || []);
        setCoursesTotal(res.data.total || 0);
      })
      .catch(() => setCourses([]))
      .finally(() => setCoursesLoading(false));
  }, [universityId, coursesPage, courseFilter]);

  const filtered = courses.filter(
    (c: any) => courseFilter === "all" || c.level === courseFilter,
  );

  return (
    <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f8fafc] px-4 sm:px-6 py-4">
        <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900">
          Courses & fees
        </h3>
        <div className="flex gap-2 text-xs font-medium overflow-x-auto no-scrollbar">
          {["all", "Bachelor's", "Master", "Master of Philosophy", "Doctorate", "Post graduate diploma"].map((level) => (
            <button
              key={level}
              onClick={() => {
                setCourseFilter(level);
                setCoursesPage(1);
              }}
              className={`rounded-md px-3 py-1.5 transition-colors whitespace-nowrap ${
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
      {coursesLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filtered.length > 0 ? (
        <>
          {/* Mobile card view */}
          <div className="sm:hidden">
            {filtered.map((course: any, i: number) => (
              <div key={i} className="border-b border-gray-100 px-4 py-5 space-y-3">
                <h4 className="text-[15.5px] font-bold text-gray-900">
                  {course.name}
                </h4>
                {course.sub_description && (
                  <p className="text-[12px] text-gray-500">{course.sub_description}</p>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
                  <div>
                    <span className="text-gray-400">Duration: </span>
                    <span className="font-semibold text-gray-900">{course.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Fee: </span>
                    <span className="font-semibold text-[#2563eb]">{course.fees}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Eligibility: </span>
                    <span className="text-gray-600">{course.eligibility}</span>
                  </div>
                  {course.seats && (
                    <div>
                      <span className="inline-block rounded bg-[#eafaef] px-2.5 py-1 text-[11px] font-bold text-[#16a34a]">
                        {course.seats}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Desktop grid view */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-white px-6 py-5 items-center">
              <div className="sm:col-span-4 text-[13px] font-bold uppercase tracking-wider text-gray-800">COURSES NAME</div>
              <div className="sm:col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">DURATION</div>
              <div className="sm:col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">FEES / YEAR</div>
              <div className="sm:col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">ELIGIBILITY & SEAT</div>
            </div>
            {filtered.map((course: any, i: number) => (
              <div key={i} className="border-b border-gray-100 px-6 py-5 hover:bg-gray-50/50">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-4 pr-4">
                    <h4 className="text-[15.5px] font-bold text-gray-900">{course.name}</h4>
                    <p className="mt-1 text-[12px] text-gray-500">{course.sub_description || ""}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <h4 className="text-[15.5px] font-bold text-gray-900">{course.duration}</h4>
                    <p className="mt-1 text-[12px] text-gray-500">{course.durationSub || ""}</p>
                  </div>
                  <div className="sm:col-span-3">
                    <h4 className="text-[15.5px] font-bold text-[#2563eb]">{course.fees}</h4>
                  </div>
                  <div className="sm:col-span-3">
                    <p className="mb-2 text-[12.5px] font-medium text-gray-600">{course.eligibility}</p>
                    <span className="inline-block rounded bg-[#eafaef] px-2.5 py-1 text-[11px] font-bold text-[#16a34a]">{course.seats}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyTabState tabName="Courses" />
      )}
      {coursesTotal > 10 && (
        <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 sm:px-6 py-4">
          <p className="text-sm text-gray-600">
            Showing {((coursesPage - 1) * 10) + 1} to {Math.min(coursesPage * 10, coursesTotal)} of {coursesTotal} courses
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCoursesPage(p => Math.max(1, p - 1))}
              disabled={coursesPage === 1}
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCoursesPage(p => p + 1)}
              disabled={coursesPage * 10 >= coursesTotal}
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
