"use client";

import { useState, useMemo } from "react";
import GlobalFilterSection from "@/components/ui/GlobalFilterSection";
import Dropdown from "@/components/college-recommender/Dropdown";
import { NEPAL_PROVINCES, NEPAL_DISTRICTS } from "@/lib/location-data";

export interface VolunteerFilters {
  search: string;
  type: string;
  province: string;
  district: string;
  sortBy: string;
}

export const DEFAULT_VOLUNTEER_FILTERS: VolunteerFilters = {
  search: "",
  type: "",
  province: "",
  district: "",
  sortBy: "newest",
};

interface VolunteerFilterProps {
  filters: VolunteerFilters;
  setFilters: React.Dispatch<React.SetStateAction<VolunteerFilters>>;
}

const PROVINCE_OPTIONS = [
  { value: "", label: "All Provinces" },
  ...NEPAL_PROVINCES.map((p) => ({ value: p, label: p })),
];

const SORT_OPTIONS = [
  { value: "deadline", label: "Deadline (Earliest)" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

const RadioItem: React.FC<{
  id: string;
  label: string;
  name: string;
  checked: boolean;
  onChange: () => void;
}> = ({ id, label, name, checked, onChange }) => (
  <label htmlFor={id} className="group flex cursor-pointer items-center gap-3">
    <input
      id={id}
      type="radio"
      name={name}
      checked={checked}
      onChange={onChange}
      className="custom-radio"
    />
    <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">
      {label}
    </span>
  </label>
);

const filterLabelMap: Record<string, string> = {
  "": "All Types",
  "Unpaid Volunteer": "Unpaid Volunteer",
  "Paid Volunteer": "Paid Volunteer",
};

export default function VolunteerFilter({ filters, setFilters, onClose }: VolunteerFilterProps & { onClose?: () => void }) {
  const [openSections, setOpenSections] = useState({
    type: true,
    location: true,
    sort: true,
  });

  const [showAppliedDropdown, setShowAppliedDropdown] = useState(false);

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const districtOptions = useMemo(() => {
    if (!filters.province) return [{ value: "", label: "All Districts" }];
    const districts = NEPAL_DISTRICTS[filters.province as keyof typeof NEPAL_DISTRICTS] || [];
    return [{ value: "", label: "All Districts" }, ...districts.map((d) => ({ value: d, label: d }))];
  }, [filters.province]);

  const appliedFilters: { key: keyof VolunteerFilters; value: string; label: string }[] = useMemo(() => {
    const tags: { key: keyof VolunteerFilters; value: string; label: string }[] = [];
    if (filters.type) tags.push({ key: "type", value: filters.type, label: filterLabelMap[filters.type] || filters.type });
    if (filters.province) tags.push({ key: "province", value: filters.province, label: filters.province });
    if (filters.district) tags.push({ key: "district", value: filters.district, label: filters.district });
    if (filters.sortBy !== "newest") tags.push({ key: "sortBy", value: filters.sortBy, label: `Sort: ${SORT_OPTIONS.find(o => o.value === filters.sortBy)?.label || filters.sortBy}` });
    return tags;
  }, [filters]);

  const hasActiveFilters = appliedFilters.length > 0;

  const clearAll = () => {
    setFilters(DEFAULT_VOLUNTEER_FILTERS);
    setShowAppliedDropdown(false);
  };

  const removeFilter = (key: keyof VolunteerFilters) => {
    setFilters((prev) => ({ ...prev, [key]: DEFAULT_VOLUNTEER_FILTERS[key] }));
  };

  return (
    <>
      <div className="relative w-full rounded-[20px] border border-gray-200 bg-white p-6">
          <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-sliders text-black text-[18px]"></i>
            <h3 className="font-black text-xl text-slate-900 tracking-tight">
              Filters
            </h3>
          </div>
          <div className="flex items-center gap-2">
          {onClose && (
            <button type="button" onClick={onClose} className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => setShowAppliedDropdown((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-semibold text-blue-700 transition-colors"
            >
              Applied ({appliedFilters.length})
              <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${showAppliedDropdown ? "rotate-180" : ""}`}></i>
            </button>
          )}
          </div>
        </div>

        {hasActiveFilters && showAppliedDropdown && (
          <div className="absolute right-6 top-16 z-30 w-[min(520px,calc(100%-3rem))] rounded-md border border-gray-200 bg-white p-3 shadow-lg">
            <div className="flex flex-wrap gap-2 pb-3">
              {appliedFilters.map((tag, index) => (
                <button
                  key={`${tag.key}-${tag.value}-${index}`}
                  type="button"
                  onClick={() => removeFilter(tag.key)}
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
                onClick={clearAll}
                className="text-[12px] font-semibold text-red-600 transition-colors hover:text-red-700"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        <GlobalFilterSection
          title="Volunteer Type"
          isOpen={openSections.type}
          onToggle={() => toggleSection("type")}
        >
          <div className="flex flex-col gap-3.5 pt-1">
            {[
              { id: "vol-type-all", value: "", label: "All Types" },
              { id: "vol-type-unpaid", value: "Unpaid Volunteer", label: "Unpaid Volunteer" },
              { id: "vol-type-paid", value: "Paid Volunteer", label: "Paid Volunteer" },
            ].map((opt) => (
              <RadioItem
                key={opt.id}
                id={opt.id}
                name="volunteerType"
                label={opt.label}
                checked={filters.type === opt.value}
                onChange={() => setFilters((prev) => ({ ...prev, type: opt.value }))}
              />
            ))}
          </div>
        </GlobalFilterSection>

        <GlobalFilterSection
          title="Location"
          isOpen={openSections.location}
          onToggle={() => toggleSection("location")}
        >
          <div className="flex flex-col gap-2 pt-1">
            <Dropdown
              value={filters.province}
              onChange={(val) => setFilters((prev) => ({ ...prev, province: val, district: "" }))}
              options={PROVINCE_OPTIONS}
              placeholder="All Provinces"
              size="sm"
            />
            <Dropdown
              value={filters.district}
              onChange={(val) => setFilters((prev) => ({ ...prev, district: val }))}
              options={districtOptions}
              placeholder="All Districts"
              size="sm"
            />
          </div>
        </GlobalFilterSection>

        <GlobalFilterSection
          title="Sort By"
          isOpen={openSections.sort}
          onToggle={() => toggleSection("sort")}
          hideDivider
        >
          <div className="flex flex-col gap-3.5 pt-1">
            {SORT_OPTIONS.map((opt) => (
              <RadioItem
                key={opt.value}
                id={`sort-${opt.value}`}
                name="sort"
                label={opt.label}
                checked={filters.sortBy === opt.value}
                onChange={() => setFilters((prev) => ({ ...prev, sortBy: opt.value }))}
              />
            ))}
          </div>
        </GlobalFilterSection>
      </div>

      <style>{`
        .custom-radio {
          appearance: none;
          background-color: #fff;
          margin: 0;
          width: 1.15em;
          height: 1.15em;
          border: 1px solid #94a3b8;
          border-radius: 50%;
          display: grid;
          place-content: center;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          flex-shrink: 0;
        }
        .custom-radio::before {
          content: "";
          width: 0.5em;
          height: 0.5em;
          border-radius: 50%;
          transform: scale(0);
          transition: 120ms transform ease-in-out;
          background-color: white;
        }
        .custom-radio:checked { background-color: #2563eb; border-color: #2563eb; }
        .custom-radio:checked::before { transform: scale(1); }
        .custom-radio:hover { border-color: #64748b; }
      `}</style>
    </>
  );
}
