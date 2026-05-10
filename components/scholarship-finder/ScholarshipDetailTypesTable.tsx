"use client";

import { ExternalLink } from "lucide-react";

interface TypesTableRow {
  type: string;
  seats: string;
  coverage: string;
  eligibility: string;
}

interface TypesTableProps {
  types: TypesTableRow[];
  applyLink?: string;
}

export default function ScholarshipDetailTypesTable({ types, applyLink }: TypesTableProps) {
  return (
    <>
      {/* Desktop: grid table — visible on md+ */}
      <div className="hidden md:block w-full overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-white px-6 py-4 items-center">
            <div className="col-span-3 text-[12px] font-bold uppercase tracking-wider text-gray-500">TYPE</div>
            <div className="col-span-3 text-[12px] font-bold uppercase tracking-wider text-gray-500">SEATS</div>
            <div className="col-span-2 text-[12px] font-bold uppercase tracking-wider text-gray-500">COVERAGE</div>
            <div className="col-span-2 text-[12px] font-bold uppercase tracking-wider text-gray-500">ELIGIBILITY</div>
            <div className="col-span-2 text-right text-[12px] font-bold uppercase tracking-wider text-gray-500">ACTION</div>
          </div>
          {types.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 border-b border-gray-100 px-6 py-4 items-center hover:bg-gray-50 transition">
              <div className="col-span-3"><h4 className="text-[14px] font-bold text-gray-900">{row.type}</h4></div>
              <div className="col-span-3 text-[14px] text-gray-700">{row.seats}</div>
              <div className="col-span-2"><span className={`rounded-md px-2.5 py-1 text-[12px] font-bold ${row.coverage === "Full Support" ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"}`}>{row.coverage}</span></div>
              <div className="col-span-2 text-[13px] text-gray-600">{row.eligibility}</div>
              <div className="col-span-2 text-right">
                <a href={applyLink || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700 shadow-sm">
                  <ExternalLink size={12} /> Apply
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: stacked cards — visible below md */}
      <div className="block md:hidden space-y-3">
        {types.map((row, i) => (
          <div key={i} className="rounded-md border border-gray-100 bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[14px] font-bold text-gray-900">{row.type}</h4>
              <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${row.coverage === "Full Support" ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"}`}>{row.coverage}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">Seats</span>
              <span className="font-medium text-gray-900">{row.seats}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">Eligibility</span>
              <span className="font-medium text-gray-900 text-right max-w-[60%]">{row.eligibility}</span>
            </div>
            <a href={applyLink || "#"} target="_blank" rel="noopener noreferrer" className="mt-2 flex w-full items-center justify-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700 shadow-sm">
              <ExternalLink size={12} /> Apply Now
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
