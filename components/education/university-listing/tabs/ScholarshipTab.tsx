"use client";

import React, { useState } from "react";
import EmptyTabState from "@/app/find-college/[id]/components/EmptyTabState";

interface ScholarshipTabProps {
  scholarshipsList: any[];
}

export default function ScholarshipTab({ scholarshipsList }: ScholarshipTabProps) {
  const [scholarFilter, setScholarFilter] = useState("all");

  const filtered = scholarshipsList.filter(
    (s: any) => scholarFilter === "all" || s.level === scholarFilter,
  );

  return (
    <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f8fafc] px-4 sm:px-6 py-4">
        <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900">Scholarships</h3>
        <div className="flex gap-2 text-xs font-medium overflow-x-auto no-scrollbar">
          {["all", "Bachelor", "Master", "Master of Philosophy", "Doctorate", "Post graduate diploma"].map((level) => (
            <button
              key={level}
              onClick={() => setScholarFilter(level)}
              className={`rounded-md px-3 py-1.5 transition-colors whitespace-nowrap ${
                scholarFilter === level
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
        <EmptyTabState tabName="Scholarships" />
      ) : (
        <>
          {/* Desktop header */}
          <div className="hidden sm:grid sm:grid-cols-12 gap-4 border-b border-gray-100 bg-white px-6 py-5 items-center">
            <div className="sm:col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">PROGRAM</div>
            <div className="sm:col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">SCHOLARSHIP</div>
            <div className="sm:col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">BENEFIT</div>
            <div className="sm:col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">ELIGIBILITY</div>
          </div>
          {filtered.map((sch: any, i: number) => (
            <div key={i} className="border-b border-gray-100 px-4 sm:px-6 py-5 transition-colors hover:bg-gray-50/50">
              <div className="sm:hidden space-y-3">
                <h4 className="text-[15px] font-bold text-gray-900">{sch.name || sch.title || ""}</h4>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
                  {sch.program && (
                    <div>
                      <span className="text-gray-400">Program: </span>
                      <span className="font-semibold text-gray-900">{sch.program}</span>
                    </div>
                  )}
                  {sch.benefit && (
                    <div>
                      <span className="text-gray-400">Benefit: </span>
                      <span className="font-medium text-green-600">{sch.benefit}</span>
                    </div>
                  )}
                  {(sch.forWhom || sch.eligibility) && (
                    <div>
                      <span className="text-gray-400">For: </span>
                      <span className="text-gray-600">{sch.forWhom || sch.eligibility}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-3">
                  <h4 className="text-[14px] font-bold text-gray-900">{sch.program || ""}</h4>
                </div>
                <div className="sm:col-span-3">
                  <h4 className="text-[14px] font-bold text-gray-900">{sch.name || sch.title || ""}</h4>
                </div>
                <div className="sm:col-span-3">
                  <span className="text-[13px] font-medium text-green-600">{sch.benefit || ""}</span>
                </div>
                <div className="sm:col-span-3">
                  <span className="text-[13px] text-gray-600">{sch.forWhom || sch.eligibility || ""}</span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
