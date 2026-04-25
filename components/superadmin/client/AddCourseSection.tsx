"use client";

import React from "react";
import { BookOpen, Plus } from "lucide-react";

export default function AddCourseSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="mb-8 flex items-center gap-3 text-xl font-extrabold text-gray-900">
          <Plus size={24} className="text-blue-600" /> Add New Course
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput label="Course Name" placeholder="e.g., BBA" required />
          <FormInput label="College" type="select" options={["Sowers College"]} required />
          <FormInput label="Duration" type="select" options={["4 Years", "3 Years", "2 Years"]} required />
          <FormInput label="Semester" type="select" options={["8 Semester", "6 Semester", "4 Semester"]} required />
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-50 pt-6">
          <button type="button" onClick={() => setActiveSection("manage-course")} className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-bold text-white">
            Add Course
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
