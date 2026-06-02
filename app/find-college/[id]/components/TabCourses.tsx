"use client";

import React from "react";
import { FilterPills, ProgTh } from "./index";
import type { LevelFilter } from "../../types";
import EmptyTabState from "./EmptyTabState";

interface TabCoursesProps {
  courses: any[] | null;
  filter: LevelFilter;
  onFilterChange: (f: LevelFilter) => void;
  hasApiData: boolean;
}

const TabCourses: React.FC<TabCoursesProps> = ({ courses, filter, onFilterChange, hasApiData }) => {
  if (!courses || courses.length === 0) return <EmptyTabState tabName="courses" />;

  return (
    <div className="overflow-hidden rounded-[20px] border border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
        <p className="text-[14px] font-semibold text-brand-blue">Fees in NPR/year – filter by level</p>
        {!hasApiData && <FilterPills active={filter} onChange={onFilterChange} />}
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-175">
          <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-200 px-6 py-5">
            <ProgTh className="col-span-4">COURSES NAME</ProgTh>
            <ProgTh className="col-span-2">DURATION</ProgTh>
            <ProgTh className="col-span-3">FEES / YEAR</ProgTh>
            <ProgTh className="col-span-3">ELIGIBILITY &amp; SEAT</ProgTh>
          </div>
          {courses.map((course: any, i: number) => (
            <div key={course.name || i} className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 px-6 py-5 hover:bg-gray-50/50">
              <div className="col-span-4">
                <h4 className="text-[15.5px] font-bold text-gray-900">{course.name}</h4>
                <p className="text-[12px] text-gray-500">{course.specialization || ""}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-[15.5px] font-bold text-gray-900">{course.duration}</h4>
                <p className="text-[12px] text-gray-500">{course.type || ""}</p>
              </div>
              <div className="col-span-3">
                <h4 className="text-[15.5px] font-bold text-brand-blue">{course.fees}</h4>
                <p className="text-[12px] text-gray-500">/ Year</p>
              </div>
              <div className="col-span-3">
                <p className="mb-2 text-[12.5px] font-medium text-gray-600">{course.eligibility}</p>
                <span className="inline-block rounded bg-[#eafaef] px-2.5 py-1 text-[11px] font-bold text-[#16a34a]">{course.seats || ""}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabCourses;
