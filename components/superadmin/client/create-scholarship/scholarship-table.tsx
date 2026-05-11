"use client";

import React, { useState } from "react";
import { Table, ListChecks } from "lucide-react";
import { FormCard } from "../add-college/FormCard";
import { generateId } from "@/lib/superadmin/constants";

export function ScholarshipTypesCard()  {
  const [rows, setRows] = useState([
    { id: generateId(), type: "Fully Funded", seats: "60 Seats (30 Boys & 30 Girls)", coverage: "Full Support", eligibility: "Financial Need + Merit", applyUrl: "https://projectshiksha.hundredgroupnepal.org/" },
    { id: generateId(), type: "Partially Funded", seats: "50 Seats", coverage: "Tuition Only", eligibility: "Merit Based", applyUrl: "https://projectshiksha.hundredgroupnepal.org/" },
  ]);

  return (
    <FormCard icon={<Table size={24} className="text-blue-600" />} title="Scholarship Types" sub="Table of scholarship categories (shown in Scholarship tab with Apply buttons)" action={
      <button type="button" onClick={() => setRows((prev) => [...prev, { id: generateId(), type: "", seats: "", coverage: "", eligibility: "", applyUrl: "" }])} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add Row
      </button>
    }>
      <div className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Type</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Seats</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Coverage</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Eligibility</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><input type="text" className="w-full bg-transparent text-sm font-semibold text-gray-900 outline-none" placeholder="e.g., Fully Funded" defaultValue={r.type} /></td>
                  <td className="px-4 py-3"><input type="text" className="w-full bg-transparent text-sm text-gray-700 outline-none" placeholder="e.g., 60 Seats" defaultValue={r.seats} /></td>
                  <td className="px-4 py-3"><input type="text" className="w-full bg-transparent text-sm text-gray-700 outline-none" placeholder="e.g., Full Support" defaultValue={r.coverage} /></td>
                  <td className="px-4 py-3"><input type="text" className="w-full bg-transparent text-sm text-gray-700 outline-none" placeholder="e.g., Merit Based" defaultValue={r.eligibility} /></td>
                  <td className="px-4 py-3 text-center">
                    <button type="button" onClick={() => setRows((prev) => prev.filter((x) => x.id !== r.id))} className="rounded p-1 text-red-500 transition-colors hover:bg-red-50">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600">Apply URL (per type, one per line matching row order)</label>
          {rows.map((r, i) => (
            <div key={r.id} className="flex items-center gap-2">
              <span className="w-32 shrink-0 text-xs font-medium text-gray-500">{r.type || `Row ${i + 1}`}</span>
              <input type="url" className="input-field flex-1 text-sm" placeholder="https://..." defaultValue={r.applyUrl} />
            </div>
          ))}
        </div>
      </div>
    </FormCard>
  );
}

export function SelectionRubricCard()  {
  const [rows, setRows] = useState([
    { id: generateId(), criteria: "Written Examination", desc: "English, Math, Science, Social Studies", weight: "60%", marks: "60", passMark: "24" },
    { id: generateId(), criteria: "Personal Interview", desc: "Communication, Confidence, Goals", weight: "25%", marks: "25", passMark: "10" },
    { id: generateId(), criteria: "Academic Record", desc: "SEE GPA & Previous Performance", weight: "10%", marks: "10", passMark: "4" },
    { id: generateId(), criteria: "Financial Need Assessment", desc: "Family Income, Economic Background", weight: "5%", marks: "5", passMark: "2" },
  ]);

  const totals = rows.reduce((acc, r) => ({
    weight: acc.weight + (parseFloat(r.weight) || 0),
    marks: acc.marks + (parseInt(r.marks) || 0),
    passMark: acc.passMark + (parseInt(r.passMark) || 0),
  }), { weight: 0, marks: 0, passMark: 0 });

  return (
    <FormCard icon={<ListChecks size={24} className="text-green-600" />} title="Selection Rubric" sub="Scoring criteria table shown in the Scholarship tab" action={
      <button type="button" onClick={() => setRows((prev) => [...prev, { id: generateId(), criteria: "", desc: "", weight: "", marks: "", passMark: "" }])} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add Row
      </button>
    }>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Criteria</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Description</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Weight</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Marks</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Pass Mark</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><input type="text" className="w-full bg-transparent text-sm font-semibold text-gray-900 outline-none" placeholder="e.g., Written Examination" defaultValue={r.criteria} /></td>
                <td className="px-4 py-3"><input type="text" className="w-full bg-transparent text-sm text-gray-600 outline-none" placeholder="e.g., Subjects covered" defaultValue={r.desc} /></td>
                <td className="px-4 py-3"><input type="text" className="w-16 bg-transparent text-sm text-gray-600 outline-none" placeholder="60%" defaultValue={r.weight} /></td>
                <td className="px-4 py-3"><input type="number" className="w-16 bg-transparent text-sm font-semibold text-gray-900 outline-none" placeholder="60" defaultValue={r.marks} /></td>
                <td className="px-4 py-3"><input type="number" className="w-16 bg-transparent text-sm font-semibold text-green-600 outline-none" placeholder="24" defaultValue={r.passMark} /></td>
                <td className="px-4 py-3 text-center">
                  <button type="button" onClick={() => setRows((prev) => prev.filter((x) => x.id !== r.id))} className="rounded p-1 text-red-500 transition-colors hover:bg-red-50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-blue-50 font-bold">
              <td className="px-4 py-3 text-sm text-gray-900">Total</td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-sm text-gray-900">{totals.weight}%</td>
              <td className="px-4 py-3 text-sm text-gray-900">{totals.marks} Marks</td>
              <td className="px-4 py-3 text-sm text-green-600">{totals.passMark} Marks</td>
              <td className="px-4 py-3" />
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-400">Auto-calculated totals shown at bottom</p>
    </FormCard>
  );
}
