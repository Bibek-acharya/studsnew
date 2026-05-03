"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  addMonths,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isValid,
  setMonth,
  setYear,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  id?: string;
  required?: boolean;
  minDate?: string;
  maxDate?: string;
  error?: string;
}

const toDateString = (date: Date) => format(date, "yyyy-MM-dd");

const parseDateValue = (value: string) => {
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
};

const isOutOfRange = (date: Date, minDate?: Date | null, maxDate?: Date | null) => {
  if (minDate && isBefore(date, minDate)) return true;
  if (maxDate && isAfter(date, maxDate)) return true;
  return false;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const toDropdownOptions = (arr: string[]) => arr.map(v => ({ value: v, label: v }));

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder,
  label,
  id,
  required,
  minDate,
  maxDate,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = useMemo(() => parseDateValue(value), [value]);
  const minDateObj = useMemo(() => (minDate ? parseDateValue(minDate) : null), [minDate]);
  const maxDateObj = useMemo(() => (maxDate ? parseDateValue(maxDate) : null), [maxDate]);
  const initialMonth = selectedDate ?? minDateObj ?? new Date();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(initialMonth));
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();

  const updatePopoverPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopoverPosition({
        top: rect.bottom + 10,
        left: rect.left,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePopoverPosition();
    }
  }, [isOpen]);

  const availableYears = useMemo(() => {
    const now = new Date();
    const startYear = minDateObj ? minDateObj.getFullYear() : now.getFullYear() - 1;
    const endYear = maxDateObj ? maxDateObj.getFullYear() : now.getFullYear() + 10;
    const years: number[] = [];
    for (let year = startYear; year <= endYear; year += 1) {
      years.push(year);
    }
    return years;
  }, [maxDateObj, minDateObj]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popoverRef.current?.contains(target) || buttonRef.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfMonth(currentMonth);
    const endBoundary = startOfWeek(end, { weekStartsOn: 0 });
    const days: Date[] = [];
    let cursor = start;
    while (days.length < 42) {
      days.push(cursor);
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() + 1);
      if (days.length > 35 && isSameMonth(cursor, endBoundary) && cursor.getDay() === 0) {
        break;
      }
    }
    while (days.length < 42) {
      days.push(cursor);
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  const handleSelect = (date: Date) => {
    if (isOutOfRange(date, minDateObj, maxDateObj)) return;
    onChange(toDateString(date));
    setCurrentMonth(startOfMonth(date));
    setIsOpen(false);
  };

  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth((month) => {
      const next = startOfMonth(setMonth(month, monthIndex));
      if (minDateObj && isBefore(endOfMonth(next), minDateObj)) return startOfMonth(minDateObj);
      if (maxDateObj && isAfter(next, startOfMonth(maxDateObj))) return startOfMonth(maxDateObj);
      return next;
    });
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth((month) => {
      const next = startOfMonth(setYear(month, year));
      if (minDateObj && isBefore(endOfMonth(next), minDateObj)) return startOfMonth(minDateObj);
      if (maxDateObj && isAfter(next, startOfMonth(maxDateObj))) return startOfMonth(maxDateObj);
      return next;
    });
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          ref={buttonRef}
          id={id}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`input-field flex items-center justify-between gap-3 text-left ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""
          }`}
        >
          <span className={value ? "text-slate-900" : "text-slate-400"}>
            {selectedDate ? format(selectedDate, "dd MMM, yyyy") : placeholder}
          </span>
          <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
        )}
        {isOpen && (
          <div
            ref={popoverRef}
            className="fixed z-50 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
            style={{
              top: popoverPosition.top,
              left: popoverPosition.left,
              width: buttonRef.current ? buttonRef.current.offsetWidth : '100%',
              maxWidth: '360px',
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex-1 text-center font-semibold text-slate-700">
                {MONTHS[currentMonthIndex]} {currentYear}
              </div>

              <button
                type="button"
                onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {weeks.map((day) => {
                const disabled = isOutOfRange(day, minDateObj, maxDateObj);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => handleSelect(day)}
                    disabled={disabled}
                    className={`aspect-square rounded-full text-sm transition ${
                      isSelected
                        ? "bg-blue-600 font-semibold text-white"
                        : disabled
                          ? "cursor-not-allowed text-slate-300"
                          : "text-slate-900 hover:bg-slate-100"
                    } ${isCurrentMonth ? "" : "text-slate-300"}`}
                    aria-pressed={isSelected}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DatePicker;
