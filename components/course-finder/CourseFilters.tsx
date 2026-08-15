"use client";

import React, { useState, useMemo } from "react";
import {
  CourseFinderFilters,
  CourseFilterCounts,
  defaultCourseFinderFilters,
} from "./types";

import { FaSliders } from "react-icons/fa6";
import GlobalFilterSection from "@/components/ui/GlobalFilterSection";
import { NEPAL_DISTRICTS } from "@/lib/location-data";

interface CourseFiltersProps {
  filters: CourseFinderFilters;
  counts: CourseFilterCounts;
  onChange: (next: CourseFinderFilters) => void;
  onClose?: () => void;
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
  { id: "Higher Secondary (+2)", label: "Higher Secondary (+2)" },
  { id: "A Levels", label: "A Levels" },
  { id: "Pre-Diploma / TSLC", label: "Pre-Diploma / TSLC" },
  { id: "Diploma / PCL", label: "Diploma / PCL" },
  { id: "Bachelor's Degree", label: "Bachelor's Degree" },
  { id: "Postgraduate Diploma", label: "Postgraduate Diploma" },
  { id: "Master's Degree", label: "Master's Degree" },
  { id: "M.Phil.", label: "M.Phil." },
  { id: "PhD / Doctorate", label: "PhD / Doctorate" },
  { id: "Professional Qualifications", label: "Professional Qualifications" },
  { id: "Certificate Courses", label: "Certificate Courses" },
  { id: "Short-Term Courses", label: "Short-Term Courses" },
  { id: "Vocational / Technical Training", label: "Vocational / Technical Training" },
  { id: "Skill Development Programs", label: "Skill Development Programs" },
  { id: "Entrance Preparation", label: "Entrance Preparation" },
  { id: "Language & Test Preparation", label: "Language & Test Preparation" },
  { id: "Continuing / Lifelong Education", label: "Continuing / Lifelong Education" },
];

const FIELDS = [
  { id: "Management & Business", label: "Management & Business" },
  { id: "Accounting & Finance", label: "Accounting & Finance" },
  { id: "Computer Science & Information Technology", label: "Computer Science & Information Technology" },
  { id: "Engineering", label: "Engineering" },
  { id: "Science & Mathematics", label: "Science & Mathematics" },
  { id: "Medicine & Health Sciences", label: "Medicine & Health Sciences" },
  { id: "Nursing", label: "Nursing" },
  { id: "Pharmacy", label: "Pharmacy" },
  { id: "Dentistry", label: "Dentistry" },
  { id: "Ayurveda & Alternative Medicine", label: "Ayurveda & Alternative Medicine" },
  { id: "Agriculture", label: "Agriculture" },
  { id: "Veterinary & Animal Science", label: "Veterinary & Animal Science" },
  { id: "Forestry & Environmental Studies", label: "Forestry & Environmental Studies" },
  { id: "Education & Teaching", label: "Education & Teaching" },
  { id: "Humanities", label: "Humanities" },
  { id: "Social Sciences", label: "Social Sciences" },
  { id: "Law & Legal Studies", label: "Law & Legal Studies" },
  { id: "Economics", label: "Economics" },
  { id: "Hospitality & Hotel Management", label: "Hospitality & Hotel Management" },
  { id: "Travel & Tourism", label: "Travel & Tourism" },
  { id: "Architecture, Design & Planning", label: "Architecture, Design & Planning" },
  { id: "Media & Communication", label: "Media & Communication" },
  { id: "Arts & Fine Arts", label: "Arts & Fine Arts" },
  { id: "Fashion & Textile", label: "Fashion & Textile" },
  { id: "Aviation", label: "Aviation" },
  { id: "Sports & Physical Education", label: "Sports & Physical Education" },
  { id: "Library & Information Science", label: "Library & Information Science" },
  { id: "Languages & Literature", label: "Languages & Literature" },
  { id: "Public Administration & Governance", label: "Public Administration & Governance" },
  { id: "Development Studies", label: "Development Studies" },
  { id: "Disaster & Risk Management", label: "Disaster & Risk Management" },
  { id: "Maritime / Marine Studies", label: "Maritime / Marine Studies" },
  { id: "Food & Nutrition", label: "Food & Nutrition" },
  { id: "Religious & Cultural Studies", label: "Religious & Cultural Studies" },
  { id: "Security & Defence Studies", label: "Security & Defence Studies" },
  { id: "Technical & Vocational", label: "Technical & Vocational" },
  { id: "Professional Studies", label: "Professional Studies" },
  { id: "Language & Test Preparation", label: "Language & Test Preparation" },
  { id: "Skill & Short-Term Courses", label: "Skill & Short-Term Courses" },
  { id: "Other / Interdisciplinary", label: "Other / Interdisciplinary" },
];

const UNIVERSITIES = [
  { id: "Tribhuvan University (TU)", label: "Tribhuvan University (TU)" },
  { id: "Kathmandu University (KU)", label: "Kathmandu University (KU)" },
  { id: "Pokhara University (PU)", label: "Pokhara University (PU)" },
  { id: "Purbanchal University (PoU)", label: "Purbanchal University (PoU)" },
  { id: "Nepal Sanskrit University (NSU)", label: "Nepal Sanskrit University (NSU)" },
  { id: "Lumbini Buddhist University (LBU)", label: "Lumbini Buddhist University (LBU)" },
  { id: "Mid-West University (MU)", label: "Mid-West University (MU)" },
  { id: "Far Western University (FWU)", label: "Far Western University (FWU)" },
  { id: "Agriculture and Forestry University (AFU)", label: "Agriculture and Forestry University (AFU)" },
  { id: "Nepal Open University (NOU)", label: "Nepal Open University (NOU)" },
  { id: "Rajarshi Janak University (RJU)", label: "Rajarshi Janak University (RJU)" },
  { id: "Manmohan Technical University (MTU)", label: "Manmohan Technical University (MTU)" },
  { id: "Gandaki University (GU)", label: "Gandaki University (GU)" },
  { id: "Lumbini Technological University (LTU)", label: "Lumbini Technological University (LTU)" },
  { id: "Madhesh University (MU)", label: "Madhesh University (MU)" },
  { id: "University of Nepal", label: "University of Nepal" },
  { id: "Madan Bhandari University of Science and Technology (MBUST)", label: "Madan Bhandari University of Science and Technology (MBUST)" },
  { id: "Vidushi Yogmaya Himalayan Ayurveda University", label: "Vidushi Yogmaya Himalayan Ayurveda University" },
  { id: "Shahid Dasharath Chand Health Sciences University", label: "Shahid Dasharath Chand Health Sciences University" },
  { id: "National Examinations Board (NEB)", label: "National Examinations Board (NEB)" },
  { id: "Council for Technical Education and Vocational Training (CTEVT)", label: "Council for Technical Education and Vocational Training (CTEVT)" },
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
  hideDivider?: boolean;
  children: React.ReactNode;
}> = ({ title, defaultOpen = false, hideDivider = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <GlobalFilterSection
      title={title}
      isOpen={open}
      onToggle={() => setOpen((o) => !o)}
      hideDivider={hideDivider}
    >
      {children}
    </GlobalFilterSection>
  );
};

const CourseFilters: React.FC<CourseFiltersProps> = ({
  filters,
  counts,
  onChange,
  onClose,
}) => {
  const [showAppliedDropdown, setShowAppliedDropdown] = useState(false);
  const [academicSearch, setAcademicSearch] = useState("");
  const [fieldSearch, setFieldSearch] = useState("");
  const [universitySearch, setUniversitySearch] = useState("");

  const toggleArray = (key: keyof CourseFinderFilters, value: string) => {
    const current = filters[key] as string[];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const hasActiveFilters =
    filters.academicLevels.length > 0 || filters.fields.length > 0 || filters.universities.length > 0 || filters.entranceRequired !== "";

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
    addTags("universities", UNIVERSITIES);

    if (filters.entranceRequired !== "") {
      tags.push({ key: "entranceRequired", value: filters.entranceRequired, label: `Entrance: ${filters.entranceRequired}` });
    }

    return tags;
  }, [filters]);

  const removeFilter = (key: string, value: string) => {
    if (key === "entranceRequired") {
      onChange({ ...filters, entranceRequired: "" });
    } else {
      toggleArray(key as keyof CourseFinderFilters, value);
    }
  };

  return (
    <>
      <div className="relative w-full rounded-md border border-gray-200 bg-white p-6">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 lg:hidden"
            aria-label="Close filters"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}

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
          <div className="absolute right-6 top-16 z-30 w-[min(520px,calc(100%-3rem))] rounded-md border border-gray-200 bg-white p-3 shadow-lg">
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
          <Accordion title="Academic Level / Program">
            <div className="pt-1">
              <div className="relative mb-4 group">
                <input
                  type="text"
                  placeholder="Search academic levels..."
                  value={academicSearch}
                  onChange={(e) => setAcademicSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[13px] text-slate-900 outline-none transition group-focus-within:border-blue-500 group-focus-within:ring-1 group-focus-within:ring-blue-500"
                />
                <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]"></i>
              </div>
              <div className="flex flex-col gap-3.5 custom-scrollbar max-h-[280px] overflow-y-auto pr-1">
                {ACADEMIC_LEVELS.filter((l) =>
                  l.label.toLowerCase().includes(academicSearch.toLowerCase()),
                ).map((level) => (
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
            </div>
          </Accordion>

          <Accordion title="Field of Study">
            <div className="pt-1">
              <div className="relative mb-4 group">
                <input
                  type="text"
                  placeholder="Search fields..."
                  value={fieldSearch}
                  onChange={(e) => setFieldSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[13px] text-slate-900 outline-none transition group-focus-within:border-blue-500 group-focus-within:ring-1 group-focus-within:ring-blue-500"
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

          <Accordion title="University / Board">
            <div className="pt-1">
              <div className="relative mb-4 group">
                <input
                  type="text"
                  placeholder="Search universities..."
                  value={universitySearch}
                  onChange={(e) => setUniversitySearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-[13px] text-slate-900 outline-none transition group-focus-within:border-blue-500 group-focus-within:ring-1 group-focus-within:ring-blue-500"
                />
                <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]"></i>
              </div>
              <div className="flex flex-col gap-3.5 custom-scrollbar max-h-[280px] overflow-y-auto pr-1">
                {UNIVERSITIES.filter((u) =>
                  u.label.toLowerCase().includes(universitySearch.toLowerCase()),
                ).map((uni) => (
                  <CheckboxItem
                    key={uni.id}
                    id={"uni-" + uni.id}
                    label={uni.label}
                    count={counts.byUniversity[uni.id]}
                    checked={filters.universities.includes(uni.id)}
                    onChange={() => toggleArray("universities", uni.id)}
                  />
                ))}
              </div>
            </div>
          </Accordion>

          <Accordion title="Entrance Required" hideDivider>
            <div className="pt-1 flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="entranceRequired"
                  value="Yes"
                  checked={filters.entranceRequired === "Yes"}
                  onChange={() =>
                    onChange({ ...filters, entranceRequired: filters.entranceRequired === "Yes" ? "" : "Yes" })
                  }
                  className="custom-radio"
                />
                <span className="text-[14.5px] text-[#475569]">Yes</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="entranceRequired"
                  value="No"
                  checked={filters.entranceRequired === "No"}
                  onChange={() =>
                    onChange({ ...filters, entranceRequired: filters.entranceRequired === "No" ? "" : "No" })
                  }
                  className="custom-radio"
                />
                <span className="text-[14.5px] text-[#475569]">No</span>
              </label>
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
