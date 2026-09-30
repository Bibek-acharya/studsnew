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
  /**
   * The "Can unlock now" filter, which is `?affordable=1`.
   *
   * `checked` is read from the URL and the press is reported upward; the panel
   * holds no state of its own, so a reload, a shared link and this checkbox
   * cannot disagree. Omit both and the control is not drawn at all.
   */
  affordableOnly?: boolean;
  onAffordableChange?: (next: boolean) => void;
  /**
   * Hidden while the coin gate is off, which is how this panel already treats a
   * control that cannot narrow anything: there is no resource-type selector
   * here either, for the same reason. A checkbox that provably removes nothing
   * is not a control, it is a promise the page cannot keep.
   */
  affordableAvailable?: boolean;
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
 * a type selector would either be inert or meaningless. Course and year narrow
 * a collection, and so does "Can unlock now" — which is drawn only while the
 * coin gate is on, for the same reason the type selector is absent.
 */
export default function StudyResourceFilterPanel({
  courseFilter,
  onCourseChange,
  yearFilter,
  onYearChange,
  yearOptions,
  onReset,
  affordableOnly = false,
  onAffordableChange,
  affordableAvailable = false,
  onClose,
}: StudyResourceFilterPanelProps) {
  // Both, or neither: a checkbox with no handler would be a control that lies.
  const showAffordable =
    affordableAvailable && typeof onAffordableChange === "function";

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

      {/*
        The third filter, in the panel's own `pb-4` closing rhythm so the card
        reads as one list rather than a form with something bolted on the end.
        The label wraps the input, which gives the checkbox its accessible name
        without an `id` — and the panel renders twice on a page (sidebar and
        drawer), so a fixed id would be duplicated in the document.

        The box is the house `.custom-checkbox`, the same one the Find College
        filter card this panel copies uses: slate hairline, blue when checked.
        No new colour, and nothing else in the panel shifts.
      */}
      {showAffordable && (
        <div className="pb-4">
          <label className="group flex w-full cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={affordableOnly}
              onChange={(event) => onAffordableChange?.(event.target.checked)}
              className="custom-checkbox"
            />
            <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">
              Can unlock now
            </span>
          </label>
        </div>
      )}
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
