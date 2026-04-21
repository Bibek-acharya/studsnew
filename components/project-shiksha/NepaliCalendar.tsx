"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { nepaliMonths, nepaliMonthDays } from "./types";

// Simplified BS to AD conversion (approximate)
function bsToAd(bsYear: number, bsMonth: number, bsDay: number): Date {
  // Rough conversion: BS starts ~1943 AD
  const baseYear = 1943;
  const yearDiff = bsYear - 2000;
  const adYear = baseYear + yearDiff;
  
  // Approximate month conversion
  const monthStart = new Date(adYear, bsMonth - 1, 15);
  monthStart.setDate(15 + bsDay - 1);
  
  return monthStart;
}

function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

interface NepaliCalendarProps {
  value: string;
  onChange: (bsDate: string, adDate: string, age: string) => void;
  error?: string;
}

export default function NepaliCalendar({ value, onChange, error }: NepaliCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(2081);
  const [currentMonth, setCurrentMonth] = useState(0); // Baisakh = 0
  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number; day: number } | null>(null);

  const currentYearRange = 2082;
  const years = Array.from({ length: 20 }, (_, i) => currentYearRange - 10 + i);

  const daysInMonth = nepaliMonthDays[currentMonth];
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDateSelect = useCallback((day: number) => {
    const bsDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const adDate = bsToAd(currentYear, currentMonth + 1, day);
    const adDateStr = adDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const age = calculateAge(adDate);
    
    setSelectedDate({ year: currentYear, month: currentMonth, day });
    onChange(bsDateStr, adDateStr, age.toString());
    setIsOpen(false);
  }, [currentYear, currentMonth, onChange]);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".nepali-calendar-container")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const isSelected = (day: number) => {
    return selectedDate?.year === currentYear && 
           selectedDate?.month === currentMonth && 
           selectedDate?.day === day;
  };

  return (
    <div className="relative nepali-calendar-container">
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={value}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={() => false}
          className={`w-full border rounded-lg py-3 pl-10 pr-4 text-[15px] text-gray-800 outline-none focus:ring-0 transition-all bg-white cursor-pointer ${
            error ? "border-red-500" : "border-gray-300 focus:border-[#0000ff]"
          }`}
          placeholder="Select from Calendar"
        />
      </div>
      {error && <p className="text-red-500 text-[12px] mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute left-0 mt-2 z-[9999] bg-white rounded-xl p-6 shadow-2xl border border-gray-200 w-[340px]">
          <div className="flex justify-between items-center mb-6 px-1">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 font-semibold text-gray-900 text-[16px]">
              <span>{nepaliMonths[currentMonth]}</span>
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-2 py-0.5 text-[15px] focus:outline-none focus:border-[#0000ff] cursor-pointer bg-white"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={goToNextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-[13px] font-medium text-gray-500 h-9 flex items-center justify-center">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => (
              <div key={day} className="flex items-center justify-center h-10">
                <button
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-[14px] font-medium transition-all ${
                    isSelected(day)
                      ? "bg-[#0000ff] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {day}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
