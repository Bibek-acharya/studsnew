"use client";

import React, { useState } from "react";
import { FaSliders, FaStar } from "react-icons/fa6";
import Accordion from "./Accordion";
import CheckboxItem from "./CheckboxItem";
import RadioItem from "./RadioItem";
import { FilterKey, FiltersState } from "./types";
import { ACADEMIC_LEVELS, UNIVERSITY_TYPES, SORT_OPTIONS } from "./constants";

interface FilterSidebarProps {
  filters: FiltersState;
  onToggle: (key: FilterKey, value: string) => void;
  onSortBy: (value: string) => void;
  sortBy: string;
  onClearAll: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onToggle,
  onSortBy,
  sortBy,
  onClearAll,
}) => {
  const [showAppliedDropdown, setShowAppliedDropdown] = useState(false);

  const appliedFilters: Array<{ key: FilterKey; value: string; label: string }> = [];

  filters.academic.forEach((v) => {
    const found = ACADEMIC_LEVELS.find((a) => a.id === v);
    appliedFilters.push({ key: "academic", value: v, label: found?.label || v });
  });
  filters.type.forEach((v) => {
    const found = UNIVERSITY_TYPES.find((t) => t.id === v);
    appliedFilters.push({ key: "type", value: v, label: found?.label || v });
  });
  filters.rating.forEach((v) => {
    appliedFilters.push({ key: "rating", value: v, label: `${v} & above` });
  });

  const hasActiveFilters = appliedFilters.length > 0;

  const removeFilter = (key: FilterKey, value: string) => {
    onToggle(key, value);
  };

  return (
    <div className="relative w-full rounded-[20px] border border-gray-200 bg-white p-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaSliders size={18} className="text-black" />
          <h3 className="text-xl font-black tracking-tight text-slate-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => setShowAppliedDropdown((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-semibold text-blue-700 transition-colors"
          >
            Applied ({appliedFilters.length})
            <i
              className={`fa-solid fa-chevron-down text-[10px] transition-transform ${showAppliedDropdown ? "rotate-180" : ""}`}
            ></i>
          </button>
        )}
      </div>

      {hasActiveFilters && showAppliedDropdown && (
        <div className="absolute right-6 top-16 z-30 w-[min(520px,calc(100%-3rem))] rounded-md border border-gray-200 bg-white p-3 shadow-lg">
          <div className="flex flex-wrap gap-2 pb-3">
            {appliedFilters.map((tag, index) => (
              <button
                key={`${tag.key}-${tag.value}-${index}`}
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
                onClearAll();
                setShowAppliedDropdown(false);
              }}
              className="text-[12px] font-semibold text-red-600 transition-colors hover:text-red-700"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <Accordion title="Academic Level" defaultOpen>
        <div className="flex flex-col gap-3.5 pt-1">
          {ACADEMIC_LEVELS.map((item) => (
            <CheckboxItem
              key={item.id}
              id={`acad-${item.id}`}
              label={item.label}
              count={item.count}
              checked={filters.academic.includes(item.id)}
              onChange={() => onToggle("academic", item.id)}
            />
          ))}
        </div>
      </Accordion>

      <Accordion title="University Type">
        <div className="flex flex-col gap-3.5 pt-1">
          {UNIVERSITY_TYPES.map((item) => (
            <CheckboxItem
              key={item.id}
              id={`type-${item.id}`}
              label={item.label}
              count={item.count}
              checked={filters.type.includes(item.id)}
              onChange={() => onToggle("type", item.id)}
            />
          ))}
        </div>
      </Accordion>

      <Accordion title="Rating">
        <div className="flex flex-col gap-3.5 pt-1">
          <CheckboxItem
            id="rating-4.5"
            label={<><FaStar className="inline text-yellow-500" /> 4.5 & above (Top Rated)</>}
            checked={filters.rating.includes("4.5")}
            onChange={() => onToggle("rating", "4.5")}
          />
          <CheckboxItem
            id="rating-4.0"
            label={<><FaStar className="inline text-yellow-500" /> 4.0 & above</>}
            checked={filters.rating.includes("4.0")}
            onChange={() => onToggle("rating", "4.0")}
          />
          <CheckboxItem
            id="rating-3.5"
            label={<><FaStar className="inline text-yellow-500" /> 3.5 & above</>}
            checked={filters.rating.includes("3.5")}
            onChange={() => onToggle("rating", "3.5")}
          />
          <CheckboxItem
            id="rating-3.0"
            label={<><FaStar className="inline text-yellow-500" /> 3.0 & above</>}
            checked={filters.rating.includes("3.0")}
            onChange={() => onToggle("rating", "3.0")}
          />
        </div>
      </Accordion>

      <Accordion title="Sort By" defaultOpen hideDivider>
        <div className="flex flex-col gap-3.5">
          {SORT_OPTIONS.map((opt) => (
            <RadioItem
              key={opt.id}
              id={`sort-${opt.id}`}
              name="sort"
              label={opt.label}
              checked={sortBy === opt.id}
              onChange={() => onSortBy(opt.id)}
            />
          ))}
        </div>
      </Accordion>
    </div>
  );
};

export default FilterSidebar;
