"use client";

import React, { useMemo } from "react";
import { ProgTh } from "./index";
import EmptyTabState from "./EmptyTabState";

interface TabCoursesProps {
  courses: any[] | null;
}

function getUniqueValues(courses: any[] | null, field: string): string[] {
  if (!courses) return [];
  const vals = new Set<string>();
  courses.forEach((c) => {
    const v = c[field];
    if (v && typeof v === "string") vals.add(v);
  });
  return Array.from(vals).sort();
}

const TabCourses: React.FC<TabCoursesProps> = ({ courses }) => {
  const [levelFilter, setLevelFilter] = React.useState("all");
  const [durationFilter, setDurationFilter] = React.useState("all");

  const levels = useMemo(() => getUniqueValues(courses, "type"), [courses]);
  const durations = useMemo(
    () => getUniqueValues(courses, "duration"),
    [courses],
  );

  const filtered = useMemo(() => {
    if (!courses) return [];
    return courses.filter((c) => {
      if (levelFilter !== "all" && c.type !== levelFilter) return false;
      if (durationFilter !== "all" && c.duration !== durationFilter)
        return false;
      return true;
    });
  }, [courses, levelFilter, durationFilter]);

  if (!courses || courses.length === 0)
    return <EmptyTabState tabName="courses" />;

  return (
    <div className="overflow-hidden rounded-[20px] border border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
        <p className="text-[14px] font-semibold text-brand-blue">
          Fees in NPR/year
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            <option value="all">All Levels</option>
            {levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            <option value="all">All Durations</option>
            {durations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-175">
          <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-200 px-6 py-5">
            <ProgTh className="col-span-4">COURSES NAME</ProgTh>
            <ProgTh className="col-span-2">DURATION</ProgTh>
            <ProgTh className="col-span-3">FEES / YEAR</ProgTh>
            <ProgTh className="col-span-3">ELIGIBILITY &amp; SEAT</ProgTh>
          </div>
          {filtered.map((course: any, i: number) => (
            <div
              key={course.name || i}
              className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 px-6 py-5 hover:bg-gray-50/50"
            >
              <div className="col-span-4">
                <h4 className="text-[15.5px] font-bold text-gray-900">
                  {course.name}
                </h4>
                <p className="text-[12px] text-gray-500">
                  {course.specialization || course.sub_description || ""}
                </p>
              </div>
              <div className="col-span-2">
                <h4 className="text-[15.5px] font-bold text-gray-900">
                  {course.duration}
                </h4>
                <p className="text-[12px] text-gray-500">
                  {course.type || course.study_mode || ""}
                </p>
              </div>
              <div className="col-span-3">
                <h4 className="text-[15.5px] font-bold text-brand-blue">
                  {course.fees}
                </h4>
                <p className="text-[12px] text-gray-500">
                  {course.fee_note || "/ Year"}
                </p>
              </div>
              <div className="col-span-3">
                <p className="mb-2 text-[12.5px] font-medium text-gray-600">
                  {course.eligibility}
                </p>
                <span className="inline-block rounded bg-[#eafaef] px-2.5 py-1 text-[11px] font-bold text-[#16a34a]">
                  {course.seats || ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabCourses;
