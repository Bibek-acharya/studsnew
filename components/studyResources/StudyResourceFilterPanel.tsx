"use client";

import React, { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import GlobalFilterSection from "@/components/ui/GlobalFilterSection";
import CourseCombobox from "./CourseCombobox";

/**
 * The sidebar input treatment, matching the Find College filter card: neutral
 * slate fill, hairline border, and a focus ring in the page's brand blue.
 */
export const FILTER_INPUT_CLASS =
  "w-full rounded-md border border-gray-200 bg-[#f8fafc] px-3 py-2 text-[13.5px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue";

interface StudyResourceFilterPanelProps {
  courseFilter: string;
  onCourseChange: (value: string) => void;
  yearFilter: string;
  onYearChange: (value: string) => void;
  yearOptions: string[];
  onReset: () => void;
  /** Passed inside the mobile drawer only, to render the close button. */
  onClose?: () => void;
}

/**
 * Every collection filter, stacked vertically in the same card the Find College
 * sidebar uses. The desktop page shows it in the left column; the mobile drawer
 * shows the very same panel, so there is only one filter markup to maintain.
 *
 * There is no resource-type control: a category page is already pinned to one
 * type by its route, and the unfiltered catalog is a single mixed listing, so
 * a type selector would either be inert or meaningless. Only course and year
 * narrow a collection.
 */
export default function StudyResourceFilterPanel({
  courseFilter,
  onCourseChange,
  yearFilter,
  onYearChange,
  yearOptions,
  onReset,
  onClose,
}: StudyResourceFilterPanelProps) {
  return (
    <div className="relative w-full rounded-md border border-gray-200 bg-white p-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={18} className="text-black" aria-hidden="true" />
          <h2 className="text-xl font-black tracking-tight text-slate-900">
            Filters
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue lg:hidden"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={onReset}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-[13px] font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          >
            Reset
          </button>
        </div>
      </div>

      <FilterSection title="Course">
        <CourseCombobox
          value={courseFilter}
          onChange={onCourseChange}
          allowEmpty
          emptyLabel="All courses"
          placeholder="All courses"
          inputClassName={FILTER_INPUT_CLASS}
        />
      </FilterSection>

      <FilterSection title="Year" hideDivider>
        <select
          value={yearFilter}
          onChange={(e) => onYearChange(e.target.value)}
          aria-label="Filter by year"
          className={FILTER_INPUT_CLASS}
        >
          <option value="">All years</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </FilterSection>
    </div>
  );
}

/** One collapsible group, built on the shared filter section. Open by default
 *  because the catalog has only two of them and neither is long. */
function FilterSection({
  title,
  children,
  hideDivider = false,
}: {
  title: string;
  children: React.ReactNode;
  hideDivider?: boolean;
}) {
  const [open, setOpen] = useState(true);

  return (
    <GlobalFilterSection
      title={title}
      isOpen={open}
      onToggle={() => setOpen((previous) => !previous)}
      hideDivider={hideDivider}
    >
      {children}
    </GlobalFilterSection>
  );
}
