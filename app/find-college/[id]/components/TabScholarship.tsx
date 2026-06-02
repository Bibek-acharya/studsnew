"use client";

import React from "react";
import { FilterPills, ProgTh } from "./index";
import type { LevelFilter } from "../../types";
import EmptyTabState from "./EmptyTabState";

interface TabScholarshipProps {
  scholarships: any[];
  filter: LevelFilter;
  onFilterChange: (f: LevelFilter) => void;
  hasApiData: boolean;
}

const TabScholarship: React.FC<TabScholarshipProps> = ({ scholarships, filter, onFilterChange, hasApiData }) => {
  if (scholarships.length === 0) return <EmptyTabState tabName="scholarships" />;

  return (
    <div className="overflow-hidden rounded-[20px] border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
        <p className="text-[14px] font-semibold text-brand-blue">Scholarship opportunities – filter by level</p>
        {!hasApiData && <FilterPills active={filter} onChange={onFilterChange} />}
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 bg-white px-6 py-5">
            <ProgTh className="col-span-2">PROGRAM</ProgTh>
            <ProgTh className="col-span-2">SCHOLARSHIP</ProgTh>
            <ProgTh className="col-span-2">BENEFIT</ProgTh>
            <ProgTh className="col-span-3">FOR WHOM</ProgTh>
            <ProgTh className="col-span-3"></ProgTh>
          </div>
          {scholarships.map((scholarship) => (
            <div key={`${scholarship.program}-${scholarship.scholarship}`} className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 px-6 py-5 hover:bg-gray-50/50">
              <div className="col-span-2"><h4 className="text-[14px] font-bold text-gray-900">{scholarship.program}</h4></div>
              <div className="col-span-2">{scholarship.scholarship}</div>
              <div className="col-span-2"><span className="text-[13px] font-medium text-green-600">{scholarship.benefit}</span></div>
              <div className="col-span-3">{scholarship.audience}</div>
              <div className="col-span-3"><button className="rounded-md bg-brand-blue px-5 py-2 text-xs font-bold text-white hover:bg-brand-hover">Get Scholarship</button></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabScholarship;
