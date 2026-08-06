"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import FilterPills from "./FilterPills";
import type { LevelFilter } from "../../types";
import EmptyTabState from "./EmptyTabState";

interface TabOfferedProps {
  programs: any[];
  filter: LevelFilter;
  onFilterChange: (f: LevelFilter) => void;
}

const TabOffered: React.FC<TabOfferedProps> = ({ programs, filter, onFilterChange }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    if (filter === "all") return programs;
    return programs.filter((p: any) => {
      const level = (p.level || "").toLowerCase();
      if (filter === "+2") return level.includes("+2") || level.includes("high school");
      if (filter === "Bachelor") return level.includes("bachelor");
      if (filter === "Master") return level.includes("master");
      return true;
    });
  }, [programs, filter]);

  if (programs.length === 0)
    return <EmptyTabState tabName="programs" />;

  if (filtered.length === 0)
    return (
      <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
          <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900">
            Offered Programs
          </h3>
          <FilterPills active={filter} onChange={(v) => { onFilterChange(v); setPage(1); }} />
        </div>
        <p className="text-sm text-gray-400 py-8 text-center">No programs found for this level.</p>
      </div>
    );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
        <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900">
          Offered Programs
        </h3>
        <FilterPills active={filter} onChange={(v) => { onFilterChange(v); setPage(1); }} />
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-12 gap-2 border-b border-gray-100 bg-white px-6 py-5">
            <div className="col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">PROGRAM NAME</div>
            <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">LEVEL</div>
            <div className="col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">AFFILIATION</div>
            <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">STATUS</div>
            <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">ACTION</div>
          </div>
          <div className="divide-y divide-gray-100">
            {paginated.map((program: any, i: number) => (
              <div key={program.name || program.courseId || i} className="grid grid-cols-12 gap-2 px-6 py-5 hover:bg-gray-50/50 items-center">
                <div className="col-span-3">
                  <h4 className="text-[15.5px] font-bold text-gray-900">{program.name}</h4>
                </div>
                <div className="col-span-2 text-[14px] text-gray-600">{program.level}</div>
                <div className="col-span-3 text-[14px] text-gray-600">{program.affiliation}</div>
                <div className="col-span-2">
                  <span className={`rounded-md px-3 py-1.5 text-[12px] font-bold ${program.status === "Ongoing" ? "bg-[#ecfdf5] text-[#10b981]" : "bg-[#fef2f2] text-[#ef4444]"}`}>
                    {program.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={() => program.courseId ? router.push(`/course-finder/${program.courseId}`) : undefined}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-4">
          <p className="text-sm text-gray-600">
            Showing {((page - 1) * PER_PAGE) + 1} to {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} programs
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
    </div>
  );
};

export default TabOffered;
