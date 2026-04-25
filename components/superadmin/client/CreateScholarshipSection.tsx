"use client";

import React from "react";
import { GraduationCap, Plus } from "lucide-react";

export default function CreateScholarshipSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="mb-8 flex items-center gap-3 text-xl font-extrabold text-gray-900">
          <Plus size={24} className="text-blue-600" /> Create New Scholarship
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput label="Scholarship Name" placeholder="e.g., Merit Scholarship 2026" required />
          <FormInput label="Type" type="select" options={["Merit Based", "Need Based", "Minority"]} required />
          <FormInput label="Total Seats" type="number" placeholder="Number of seats" required />
          <FormInput label="Amount per Student (Rs)" type="number" placeholder="Amount in NPR" required />
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-50 pt-6">
          <button type="button" onClick={() => setActiveSection("manage-scholarship")} className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-bold text-white">
            Create Scholarship
          </button>
        </div>
      </div>
    </div>
  );
}

function FormInput({
  label,
  type = "text",
  placeholder,
  options,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {type === "select" ? (
        <select className="input-field font-medium">
          <option value="">Select {label}</option>
          {(options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} className="input-field" placeholder={placeholder} />
      )}
    </div>
  );
}
