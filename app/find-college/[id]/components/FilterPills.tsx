"use client";

import React from "react";

type LevelFilter = "all" | "+2" | "Bachelor" | "Master";

const FilterPills: React.FC<{
  active: LevelFilter;
  onChange: (value: LevelFilter) => void;
}> = ({ active, onChange }) => {
  const levels: LevelFilter[] = ["all", "+2", "Bachelor", "Master"];
  return (
    <div className="flex gap-2 text-xs font-medium">
      {levels.map((level) => {
        const selected = active === level;
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`rounded-full px-4 py-1.5 ${selected ? "bg-brand-blue text-white " : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            {level === "all" ? "All" : level}
          </button>
        );
      })}
    </div>
  );
};

export default FilterPills;
export type { LevelFilter };