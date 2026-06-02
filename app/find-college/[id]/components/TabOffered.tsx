"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FilterPills, ProgTh } from "./index";
import type { LevelFilter } from "../../types";
import EmptyTabState from "./EmptyTabState";

interface TabOfferedProps {
  programs: any[];
  filter: LevelFilter;
  onFilterChange: (f: LevelFilter) => void;
  hasApiData: boolean;
}

const TabOffered: React.FC<TabOfferedProps> = ({ programs, filter, onFilterChange, hasApiData }) => {
  const router = useRouter();

  if (programs.length === 0) return <EmptyTabState tabName="programs" />;

  return (
    <div className="overflow-hidden rounded-[20px] border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
        <p className="text-[14px] font-semibold text-brand-blue">Programs offered – filter by level</p>
        {!hasApiData && <FilterPills active={filter} onChange={onFilterChange} />}
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 bg-white px-6 py-5">
            <ProgTh className="col-span-3">PROGRAM NAME</ProgTh>
            <ProgTh className="col-span-2">LEVEL</ProgTh>
            <ProgTh className="col-span-3">AFFILIATION</ProgTh>
            <ProgTh className="col-span-2">STATUS</ProgTh>
            <ProgTh className="col-span-2">ACTION</ProgTh>
          </div>
          {programs.map((program: any, i: number) => (
            <div key={program.name || program.courseId || i} className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 px-6 py-5 hover:bg-gray-50/50">
              <div className="col-span-3"><h4 className="text-[15.5px] font-bold text-gray-900">{program.name}</h4></div>
              <div className="col-span-2"><span className="text-[14px] text-gray-600">{program.level}</span></div>
              <div className="col-span-3"><span className="text-[13px] text-gray-600">{program.affiliation}</span></div>
              <div className="col-span-2">
                <span className={`rounded-md px-3 py-1.5 text-[12px] font-bold ${program.status === "Ongoing" ? "bg-[#ecfdf5] text-[#10b981]" : "bg-[#fef2f2] text-[#ef4444]"}`}>{program.status}</span>
              </div>
              <div className="col-span-2">
                <button onClick={() => program.courseId ? router.push(`/course-finder/${program.courseId}`) : undefined} className="rounded-md bg-brand-blue/5 px-4 py-2 text-xs font-bold text-brand-blue hover:bg-brand-blue/10">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabOffered;
