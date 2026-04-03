"use client";

import React, { useState } from "react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = false }) => {
  return (
    <details className="group border-b border-slate-100 last:border-0" open={defaultOpen}>
      <summary className="flex items-center justify-between py-4 cursor-pointer list-none">
        <span className="text-sm font-black uppercase tracking-widest text-slate-700">{title}</span>
        <i className="fa-solid fa-chevron-down text-[10px] text-slate-300 group-open:rotate-180 transition-transform"></i>
      </summary>
      <div className="pb-6 space-y-3">{children}</div>
    </details>
  );
};

const ScholarshipFilters: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({
    category: [],
    level: [],
  });

  const toggleFilter = (key: string, val: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val]
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm sticky top-28 font-sans">
      <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/30">
        <h2 className="font-black text-xl text-slate-900 tracking-tight">Filters</h2>
      </div>
      <div className="p-6">
        <FilterSection title="Category" defaultOpen>
          {["Merit-based", "Need-based", "Talent-based"].map(cat => (
            <CheckboxLabel key={cat} label={cat} checked={filters.category.includes(cat)} onChange={() => toggleFilter("category", cat)} />
          ))}
        </FilterSection>
        <FilterSection title="Level">
          {["+2 / High School", "Bachelor", "Master"].map(level => (
            <CheckboxLabel key={level} label={level} checked={filters.level.includes(level)} onChange={() => toggleFilter("level", level)} />
          ))}
        </FilterSection>
      </div>
    </div>
  );
};

const CheckboxLabel: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <input type="checkbox" checked={checked} onChange={onChange} className="w-5 h-5 border-2 rounded-lg cursor-pointer" />
    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-wide">{label}</span>
  </label>
);

export default ScholarshipFilters;
