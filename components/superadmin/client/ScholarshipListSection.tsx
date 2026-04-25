"use client";

import React from "react";
import { GraduationCap, Plus, Award, CheckCircle, FileText, X, Eye } from "lucide-react";

export default function ScholarshipListSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <GraduationCap size={24} className="text-blue-600" /> Manage Scholarship
          </h2>
          <button type="button" onClick={() => setActiveSection("create-scholarship")} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">
            <Plus size={18} /> Create Scholarship
          </button>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <SimpleStatCard icon={<Award size={20} />} value="24" label="Total Scholarships" bg="bg-blue-100" />
          <SimpleStatCard icon={<CheckCircle size={20} />} value="18" label="Active" bg="bg-green-100" />
          <SimpleStatCard icon={<FileText size={20} />} value="3" label="Draft" bg="bg-gray-100" />
          <SimpleStatCard icon={<X size={20} />} value="6" label="Closed" bg="bg-red-100" />
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-600">Scholarship Name</th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">Type</th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">Seats</th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">Deadline</th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">Status</th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">Merit Scholarship 2026</td>
                <td className="px-6 py-4 text-center">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">Merit</span>
                </td>
                <td className="px-6 py-4 text-center font-bold text-gray-500">50</td>
                <td className="px-6 py-4 text-center font-medium text-gray-400">May 15, 2026</td>
                <td className="px-6 py-4 text-center">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600">Active</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <ActionBtn icon={<Eye size={16} />} color="blue" />
                    <ActionBtn icon={<EditIcon />} color="blue" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SimpleStatCard({
  icon,
  value,
  label,
  bg,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>{icon}</div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
    </div>
  );
}

function ActionBtn({ icon, color }: { icon: React.ReactNode; color: "blue" | "green" | "purple" | "red" }) {
  const colors = {
    blue: "text-blue-600 hover:bg-blue-50",
    green: "text-green-600 hover:bg-green-50",
    purple: "text-purple-600 hover:bg-purple-50",
    red: "text-red-600 hover:bg-red-50",
  };
  return (
    <button type="button" className={`rounded-lg p-2 transition-all ${colors[color]}`}>
      {icon}
    </button>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
