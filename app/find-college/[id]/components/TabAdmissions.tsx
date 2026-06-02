"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FilterPills, ProgTh } from "./index";
import type { LevelFilter } from "../../types";
import EmptyTabState from "./EmptyTabState";

interface TabAdmissionsProps {
  admissions: any[] | null;
  filter: LevelFilter;
  onFilterChange: (f: LevelFilter) => void;
  collegeId: number | null;
  hasApiData: boolean;
}

const TabAdmissions: React.FC<TabAdmissionsProps> = ({ admissions, filter, onFilterChange, collegeId, hasApiData }) => {
  const router = useRouter();

  if (!admissions || admissions.length === 0) return <EmptyTabState tabName="admission notices" />;

  return (
    <div className="rounded-[20px] border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
        <p className="text-[14px] font-semibold text-brand-blue">Admission notices – filter by level</p>
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
          {admissions.map((admission: any, i: number) => (
            <div key={admission.title || i} className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 px-6 py-5 hover:bg-gray-50/50">
              <div className="col-span-3"><h4 className="text-[15.5px] font-bold text-gray-900">{admission.title}</h4></div>
              <div className="col-span-2"><span className="text-[14px] text-gray-600">{admission.level}</span></div>
              <div className="col-span-3"><span className="text-[13px] text-gray-600">{admission.affiliation}</span></div>
              <div className="col-span-2">
                <span className={`rounded-md px-3 py-1.5 text-[12px] font-bold ${admission.status === "Ongoing" ? "bg-[#ecfdf5] text-[#10b981]" : "bg-[#fef2f2] text-[#ef4444]"}`}>{admission.status}</span>
              </div>
              <div className="col-span-2">
                <button onClick={() => router.push(`/admissions/${encodeURIComponent(admission.level)}/${collegeId}`)} className="rounded-md bg-brand-blue/5 px-4 py-2 text-xs font-bold text-brand-blue hover:bg-brand-blue/10">Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabAdmissions;
