"use client";

import React from "react";
import { ClipboardList, Plus, Eye, Edit3 } from "lucide-react";

const entries = [
  { name: "CMAT Entrance 2026", college: "Sowers College", date: "May 20, 2026", apps: 245, status: "Upcoming" },
];

export default function EntranceListSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <ClipboardList size={20} className="text-blue-600" /> Manage Entrance
        </h2>
        <button
          type="button"
          onClick={() => setActiveSection("add-entrance")}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={16} /> Add Entrance
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Exam Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">College</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Exam Date</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Applications</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((e) => (
              <tr key={e.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{e.name}</td>
                <td className="px-4 py-3 text-gray-600">{e.college}</td>
                <td className="px-4 py-3 text-center text-gray-600">{e.date}</td>
                <td className="px-4 py-3 text-center text-gray-600">{e.apps}</td>
                <td className="px-4 py-3 text-center">
                  <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">{e.status}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button type="button" className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50"><Eye size={16} /></button>
                    <button type="button" className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50"><Edit3 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
