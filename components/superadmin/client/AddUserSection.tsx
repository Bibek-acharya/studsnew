"use client";

import React from "react";
import { UserPlus } from "lucide-react";

export default function AddUserSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="mb-8 flex items-center gap-3 text-xl font-extrabold text-gray-900">
          <UserPlus size={24} className="text-blue-600" /> Add New User
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput label="Full Name" placeholder="Enter full name" required />
          <FormInput label="Email" placeholder="email@example.com" required />
          <FormInput label="Password" type="password" placeholder="Enter password" required />
          <FormInput label="Role" type="select" options={["Administrator", "Editor", "Viewer"]} required />
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-50 pt-6">
          <button type="button" onClick={() => setActiveSection("user-management")} className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-bold text-white">
            Add User
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
