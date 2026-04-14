"use client";

import React, { useState, useMemo } from "react";
import {
  CourseFinderFilters,
  CourseFilterCounts,
  defaultCourseFinderFilters,
} from "./types";
import { FaSliders } from "react-icons/fa6";
import GlobalFilterSection from "@/components/ui/GlobalFilterSection";

interface CourseFiltersProps {
  filters: CourseFinderFilters;
  counts: CourseFilterCounts;
  onChange: (next: CourseFinderFilters) => void;
}

type DistrictOption = {
  id: string;
  label: string;
};

type ProvinceOption = {
  id: string;
  label: string;
  districts: DistrictOption[];
};

type ProvinceName = keyof typeof NEPAL_DISTRICTS;

// ── Filter Data ────────────────────────────────────────────────────────────────

const ACADEMIC_LEVELS = [
  { id: "plus2", label: "+2 / Higher Secondary" },
  { id: "alevel", label: "A Level" },
  { id: "diploma", label: "Diploma / CTEVT" },
];

const FIELDS = [
  { id: "science", label: "Science" },
  { id: "management", label: "Management" },
  { id: "it", label: "IT / Computer Science" },
  { id: "engineering", label: "Engineering" },
  { id: "medical", label: "Medical" },
  { id: "law", label: "Law" },
  { id: "humanities", label: "Humanities" },
  { id: "education", label: "Education" },
];

const FEE_OPTIONS = [
  { id: "below1", label: "Below 1 Lakh" },
  { id: "1_3", label: "1-3 Lakhs" },
  { id: "3_6", label: "3-6 Lakhs" },
  { id: "6plus", label: "6+ Lakhs" },
];

const ADMISSION_OPTIONS = [
  { id: "open", label: "Admission Open" },
  { id: "ongoing", label: "Entrance Ongoing" },
  { id: "closed", label: "Closed" },
];


// ── Sub-Components ────────────────────────────────────────────────────────────

const CheckboxItem: React.FC<{
  id: string;
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}> = ({ id, label, count, checked, onChange }) => (
  <label
    htmlFor={id}
    className="group flex w-full cursor-pointer items-center justify-between"
  >
    <div className="flex items-center gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="custom-checkbox"
      />
      <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">
        {label}
      </span>
    </div>
    {count !== undefined && count > 0 && (
      <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[12px] font-medium text-slate-500">
        {count.toLocaleString()}
      </span>
    )}
  </label>
);


const Accordion: React.FC<{
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <GlobalFilterSection
      title={title}
      isOpen={open}
      onToggle={() => setOpen((o) => !o)}
    >
      {children}
    </GlobalFilterSection>
  );
};

const CourseFilters: React.FC<CourseFiltersProps> = ({
  filters,
  counts,
  onChange,
}) => {
  const [showAppliedDropdown, setShowAppliedDropdown] = useState(false);
  const [fieldSearch, setFieldSearch] = useState("");

  const availableFields = FIELDS;

  const toggleArray = (key: keyof CourseFinderFilters, value: string) => {
    const current = filters[key] as string[];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const hasActiveFilters =
    filters.academicLevels.length > 0 || filters.fields.length > 0;

  const appliedFilters = useMemo(() => {
    const tags: Array<{ key: string; value: string; label: string }> = [];

    const addTags = (
      key: keyof CourseFinderFilters,
      list: Array<{ id: string; label: string }>,
    ) => {
      const values = filters[key];
      if (Array.isArray(values)) {
        values.forEach((v) => {
          const label = list.find((item) => item.id === v)?.label || v;
          tags.push({ key, value: v, label });
        });
      }
    };

    addTags("academicLevels", ACADEMIC_LEVELS);
    addTags("fields", FIELDS);
    addTags("feeRanges", FEE_OPTIONS);
    addTags("admissionStatus", ADMISSION_OPTIONS);

    return tags;
  }, [filters]);

  const removeFilter = (key: string, value: string) => {
    toggleArray(key as keyof CourseFinderFilters, value);
  };

  return (
    <>
      <div className="relative w-full rounded-[20px] border border-gray-200 bg-white p-6 ">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaSliders size={18} className="text-black" />
            <h3 className="font-black text-xl text-slate-900 tracking-tight">
              Filters
            </h3>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => setShowAppliedDropdown((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-semibold text-blue-700 transition-colors"
            >
              Applied ({appliedFilters.length})
              <i className="fa-solid fa-chevron-down text-[10px] transition-transform"></i>
            </button>
          )}
        </div>

        {hasActiveFilters && showAppliedDropdown && (
          <div className="absolute right-6 top-16 z-30 w-[min(520px,calc(100%-3rem))] rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            <div className="flex flex-wrap gap-2 pb-3">
              {appliedFilters.map((tag, index) => (
                <button
                  key={tag.key + "-" + tag.value + "-" + index}
                  type="button"
                  onClick={() => removeFilter(tag.key, tag.value)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[12px] font-medium text-blue-700 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-700"
                >
                  {tag.label}
                  <i className="fa-solid fa-xmark text-[10px]"></i>
                </button>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-2">
              <button
                type="button"
                onClick={() => {
                  onChange(defaultCourseFinderFilters);
                  setShowAppliedDropdown(false);
                }}
                className="text-[12px] font-semibold text-red-600 transition-colors hover:text-red-700"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}


        <div className="space-y-4 pt-4">
          <Accordion title="Academic Level / Program" defaultOpen>
            <div className="flex flex-col gap-3.5 pt-1">
              {ACADEMIC_LEVELS.map((level) => (
                <CheckboxItem
                  key={level.id}
                  id={"acad-" + level.id}
                  label={level.label}
                  count={counts.byAcademic[level.id]}
                  checked={filters.academicLevels.includes(level.id)}
                  onChange={() => toggleArray("academicLevels", level.id)}
                />
              ))}
            </div>
          </Accordion>

          <Accordion title="Field of Study" defaultOpen>
            <div className="pt-1">
              <div className="relative mb-4 group">
                <input
                  type="text"
                  placeholder="Search fields..."
                  value={fieldSearch}
                  onChange={(e) => setFieldSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-900 outline-none transition group-focus-within:border-blue-500 group-focus-within:ring-1 group-focus-within:ring-blue-500"
                />
                <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]"></i>
              </div>
              <div className="flex flex-col gap-3.5 custom-scrollbar max-h-[280px] overflow-y-auto pr-1">
                {FIELDS.filter((f) =>
                  f.label.toLowerCase().includes(fieldSearch.toLowerCase()),
                ).map((field) => (
                  <CheckboxItem
                    key={field.id}
                    id={"field-" + field.id}
                    label={field.label}
                    count={counts.byField[field.id]}
                    checked={filters.fields.includes(field.id)}
                    onChange={() => toggleArray("fields", field.id)}
                  />
                ))}
              </div>
            </div>
          </Accordion>

          <Accordion title="Fee Range" defaultOpen>
            <div className="pt-2">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[13px] font-bold text-slate-500">
                    Max Fee
                  </span>
                  <span className="text-[14px] font-black text-blue-600">
                    {(filters.maxFee / 100000).toFixed(1)} Lakhs
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="50000"
                  value={filters.maxFee}
                  onChange={(e) =>
                    onChange({ ...filters, maxFee: Number(e.target.value) })
                  }
                  style={{
                    background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((filters.maxFee - 50000) / (2000000 - 50000)) * 100}%, #f1f5f9 ${((filters.maxFee - 50000) / (2000000 - 50000)) * 100}%, #f1f5f9 100%)`,
                  }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all"
                />
              </div>

              <div className="flex flex-col gap-3.5">
                {FEE_OPTIONS.map((opt) => (
                  <CheckboxItem
                    key={opt.id}
                    id={"fee-" + opt.id}
                    label={opt.label}
                    checked={filters.feeRanges.includes(opt.id)}
                    onChange={() => toggleArray("feeRanges", opt.id)}
                  />
                ))}
              </div>
            </div>
          </Accordion>

          <Accordion title="Admission Status" defaultOpen>
            <div className="flex flex-col gap-3.5 pt-1">
              {ADMISSION_OPTIONS.map((opt) => (
                <CheckboxItem
                  key={opt.id}
                  id={"adm-" + opt.id}
                  label={opt.label}
                  checked={filters.admissionStatus.includes(opt.id)}
                  onChange={() => toggleArray("admissionStatus", opt.id)}
                />
              ))}
            </div>
          </Accordion>
        </div>
      </div>

      <style>
        {
          '\
        .custom-checkbox { appearance: none; background-color: #fff; margin: 0; width: 1.15em; height: 1.15em; border: 1px solid #94a3b8; border-radius: 0.25em; display: grid; place-content: center; cursor: pointer; transition: all 0.2s ease-in-out; flex-shrink: 0; }\
        .custom-checkbox::before { content: ""; width: 0.65em; height: 0.65em; transform: scale(0); transition: 120ms transform ease-in-out; box-shadow: inset 1em 1em white; clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%); }\
        .custom-checkbox:checked { background-color: #2563eb; border-color: #2563eb; }\
        .custom-checkbox:checked::before { transform: scale(1); }\
        .custom-checkbox:hover { border-color: #64748b; }\
        .custom-radio { appearance: none; background-color: #fff; margin: 0; width: 1.15em; height: 1.15em; border: 1px solid #94a3b8; border-radius: 50%; display: grid; place-content: center; cursor: pointer; transition: all 0.2s ease-in-out; flex-shrink: 0; }\
        .custom-radio::before { content: ""; width: 0.5em; height: 0.5em; border-radius: 50%; transform: scale(0); transition: 120ms transform ease-in-out; background-color: white; }\
        .custom-radio:checked { background-color: #2563eb; border-color: #2563eb; }\
        .custom-radio:checked::before { transform: scale(1); }\
        .custom-radio:hover { border-color: #64748b; }\
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }\
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }\
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }\
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }\
      '
        }
      </style>
    </>
  );
};

export default CourseFilters;
