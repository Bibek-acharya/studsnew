"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface VolunteerNepaliCalendarProps {
  availableDates: string[];
  selectedDays: string[];
  onDaysChange: (days: string[]) => void;
}

function parseFirstDate(dates: string[]): { year: number; month: number } | null {
  if (dates.length === 0) return null;
  const sorted = [...dates].sort();
  const [y, m] = sorted[0].split("-").map(Number);
  return { year: y, month: m - 1 };
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export default function VolunteerNepaliCalendar({ availableDates, selectedDays, onDaysChange }: VolunteerNepaliCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openDropdown = useCallback(() => {
    const first = parseFirstDate(availableDates);
    if (first) {
      setCurrentYear(first.year);
      setCurrentMonth(first.month);
    }
    setIsOpen(true);
  }, [availableDates]);

  const availableSet = new Set(availableDates);

  const isAvailable = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return availableSet.has(dateStr);
  };

  const isSelected = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return selectedDays.includes(dateStr);
  };

  const toggleDay = (day: number) => {
    if (!isAvailable(day)) return;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onDaysChange(
      selectedDays.includes(dateStr)
        ? selectedDays.filter((d) => d !== dateStr)
        : [...selectedDays, dateStr]
    );
  };

  const removeDay = (dateStr: string) => {
    onDaysChange(selectedDays.filter((d) => d !== dateStr));
  };

  const formatDate = (dateStr: string) => {
    const [, m, d] = dateStr.split("-");
    return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}`;
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  return (
    <div ref={containerRef} className="relative">
      <div
        className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 bg-white cursor-pointer flex justify-between items-center transition-all focus:border-[#0000ff]"
        onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
      >
        <Calendar className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
        <span className={selectedDays.length > 0 ? "text-gray-800 flex-1" : "text-gray-400 flex-1"}>
          {selectedDays.length > 0
            ? `${selectedDays.length} day(s) selected`
            : "Select available days"}
        </span>
        {selectedDays.length > 0 && (
          <span className="bg-[#0000ff] text-white text-xs font-bold px-2 py-0.5 rounded-full mr-2">
            {selectedDays.length}
          </span>
        )}
        <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-90" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[9999] w-full mt-1" style={{ overflow: "visible" }}>
          <div className="border-2 border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
              <button type="button" onClick={() => {
                let m = currentMonth - 1;
                let y = currentYear;
                if (m < 0) { m = 11; y--; }
                setCurrentMonth(m);
                setCurrentYear(y);
              }} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-gray-900 text-[15px]">{MONTHS[currentMonth]} {currentYear}</span>
              <button type="button" onClick={() => {
                let m = currentMonth + 1;
                let y = currentYear;
                if (m > 11) { m = 0; y++; }
                setCurrentMonth(m);
                setCurrentYear(y);
              }} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0.5 p-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[11px] font-semibold text-gray-400 py-1">{d}</div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map((day) => {
                const avail = isAvailable(day);
                const sel = isSelected(day);
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const rangeHighlight = availableSet.has(dateStr);
                return (
                  <div
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`text-center text-[13px] font-medium w-[34px] h-[34px] flex items-center justify-center rounded-full mx-auto transition-all ${
                      sel
                        ? "bg-[#0000ff] text-white"
                        : rangeHighlight
                        ? "bg-amber-100 text-amber-800 font-bold cursor-pointer hover:bg-amber-200"
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {selectedDays.length > 0 && (
              <div className="px-4 pb-3">
                <div className="flex flex-wrap gap-2">
                  {[...selectedDays].sort().slice(0, 2).map((dateStr) => (
                    <span key={dateStr} className="bg-blue-50 text-[#0000ff] border border-[#0000ff] px-3 py-1 rounded-full text-[13px] font-semibold flex items-center gap-1.5">
                      <span>{formatDate(dateStr)}</span>
                      <button type="button" onClick={() => removeDay(dateStr)} className="text-[#0000ff] hover:text-[#0000cc] text-base leading-none">&times;</button>
                    </span>
                  ))}
                  {selectedDays.length > 2 && (
                    <span className="bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1 rounded-full text-[13px] font-semibold">
                      +{selectedDays.length - 2} more
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onDaysChange(availableDates)}
                    className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => onDaysChange([])}
                    className="text-[12px] font-semibold text-red-600 hover:text-red-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
