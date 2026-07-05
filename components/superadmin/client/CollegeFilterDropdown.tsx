"use client";

import React from "react";

interface CollegeFilterDropdownProps {
  institutions: Array<{ id: number; institution_name: string }>;
  value: number | null;
  onChange: (id: number | null) => void;
}

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm";

export default function CollegeFilterDropdown({
  institutions,
  value,
  onChange,
}: CollegeFilterDropdownProps) {
  const sorted = [...institutions].sort((a, b) =>
    a.institution_name.localeCompare(b.institution_name),
  );

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      className={inputClass}
      style={{ width: "auto", minWidth: "200px" }}
    >
      <option value="">All Institutions</option>
      {sorted.map((inst) => (
        <option key={inst.id} value={inst.id}>
          {inst.institution_name}
        </option>
      ))}
    </select>
  );
}
