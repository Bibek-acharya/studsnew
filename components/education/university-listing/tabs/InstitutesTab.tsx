"use client";

import React from "react";
import { Building2 } from "lucide-react";
import EmptyTabState from "@/app/find-college/[id]/components/EmptyTabState";

interface InstitutesTabProps {
  institutesList: any[];
  openDropdowns: Record<string, boolean>;
  toggleDropdown: (id: string) => void;
}

export default function InstitutesTab({
  institutesList,
  openDropdowns,
  toggleDropdown,
}: InstitutesTabProps) {
  return (
    <div className="space-y-8 px-4 sm:px-0">
      <div>
        <h3 className="text-[20px] font-bold text-gray-900">Institutes & Faculties</h3>
        <p className="mt-1 text-[13px] text-gray-500">Constituent and affiliated campuses</p>
      </div>
      {institutesList.length > 0 ? (
        <div className="space-y-8">
          {institutesList.map((fac: any, idx: number) => (
            <div key={idx} className="overflow-hidden rounded-md border border-gray-100 bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
                <h4 className="text-[16px] font-bold text-gray-900">{fac.name || `Faculty ${idx + 1}`}</h4>
                {(fac.colleges && fac.colleges.length > 0) && (
                  <button
                    onClick={() => toggleDropdown(`fac-colleges-${idx}`)}
                    className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    View Colleges ({fac.colleges.length})
                  </button>
                )}
              </div>
              {openDropdowns[`fac-colleges-${idx}`] && (
                <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-3 py-2 text-left text-[12px] font-bold uppercase text-gray-600 w-10">SN</th>
                          <th className="px-3 py-2 text-left text-[12px] font-bold uppercase text-gray-600">College Name</th>
                          <th className="px-3 py-2 text-left text-[12px] font-bold uppercase text-gray-600">Location</th>
                          <th className="px-3 py-2 text-left text-[12px] font-bold uppercase text-gray-600">Programs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {fac.colleges.map((c: any, ci: number) => (
                          <tr key={c.id || ci}>
                            <td className="px-3 py-2.5 text-[13px] text-gray-500">{ci + 1}</td>
                            <td className="px-3 py-2.5 text-[13px] font-medium text-gray-900">{c.name}</td>
                            <td className="px-3 py-2.5 text-[13px] text-gray-600">{c.location || "-"}</td>
                            <td className="px-3 py-2.5 text-[13px] text-gray-600">{c.programs || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {fac.programs && fac.programs.length > 0 && (
                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    <div className="grid grid-cols-12 gap-2 border-b border-gray-100 bg-white px-6 py-3">
                      <div className="col-span-1 text-[12px] font-bold uppercase tracking-wider text-gray-600">SN</div>
                      <div className="col-span-5 text-[12px] font-bold uppercase tracking-wider text-gray-600">PROGRAM</div>
                      <div className="col-span-3 text-[12px] font-bold uppercase tracking-wider text-gray-600">DURATION</div>
                      <div className="col-span-3 text-[12px] font-bold uppercase tracking-wider text-gray-600">FEE TYPE</div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {fac.programs.map((p: any, pi: number) => (
                        <div key={p.id || pi} className="grid grid-cols-12 gap-2 px-6 py-3 hover:bg-gray-50/50 items-center">
                          <div className="col-span-1 text-[13px] text-gray-500">{pi + 1}</div>
                          <div className="col-span-5 text-[14px] font-medium text-gray-900">{p.name}</div>
                          <div className="col-span-3 text-[13px] text-gray-600">{p.duration || "-"}</div>
                          <div className="col-span-3 text-[13px] text-gray-600">{p.fee || "-"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {(!fac.programs || fac.programs.length === 0) && (!fac.colleges || fac.colleges.length === 0) && (
                <div className="px-6 py-4 text-sm text-gray-400">No programs or colleges added for this faculty.</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyTabState tabName="Institutes" />
      )}
    </div>
  );
}
