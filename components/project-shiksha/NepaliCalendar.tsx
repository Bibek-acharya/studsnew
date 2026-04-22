"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import {
  bsToAd,
  formatEnglishDate,
  calculateAge,
  getNepaliMonths,
  getDaysInMonth,
  adToBs,
  formatNepaliDate,
} from "@/utils/nepali-date-converter";

interface NepaliCalendarProps {
  value: string;
  onChange: (bsDate: string, adDate: string, age: string) => void;
  error?: string;
  minAge?: number;
}

const nepaliMonths = getNepaliMonths();
const YEARS = Array.from({ length: 41 }, (_, i) => 2050 + i);

export default function NepaliCalendar({ value, onChange, error, minAge = 14 }: NepaliCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(2082);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [ageError, setAgeError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - minAge);

  const isDisabled = (day: number) => {
    const checkDate = bsToAd(currentYear, currentMonth, day);
    return checkDate > minAgeDate;
  };

  const handleDateSelect = useCallback((day: number) => {
    const bsDateStr = formatNepaliDate(currentYear, currentMonth, day);
    const adDate = bsToAd(currentYear, currentMonth, day);
    const age = calculateAge(adDate);
    
    const adDateStr = adDate.toISOString().split('T')[0];
    
    if (age < minAge) {
      setAgeError(`You must be at least ${minAge} years old to apply`);
    } else {
      setAgeError(null);
    }
    
    setSelectedDate({ year: currentYear, month: currentMonth, day });
    onChange(bsDateStr, adDateStr, age.toString());
    setIsOpen(false);
  }, [currentYear, currentMonth, onChange, minAge]);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      if (currentYear > 2050) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);
      }
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      if (currentYear < 2090) {
        setCurrentMonth(0);
        setCurrentYear((prev) => prev + 1);
      }
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        setSelectedDate({ year, month, day });
        setCurrentYear(year);
        setCurrentMonth(month);
        
        const adDate = bsToAd(year, month, day);
        const age = calculateAge(adDate);
        if (age < minAge) {
          setAgeError(`You must be at least ${minAge} years old to apply`);
        } else {
          setAgeError(null);
        }
      }
    }
  }, [value, minAge]);

  const isSelected = (day: number) => {
    return selectedDate?.year === currentYear && 
           selectedDate?.month === currentMonth && 
           selectedDate?.day === day;
  };

  const isToday = (day: number) => {
    const today = adToBs(new Date());
    return today.year === currentYear && today.month === currentMonth && today.day === day;
  };

  const canGoPrevious = currentYear > 2050 || currentMonth > 0;
  const canGoNext = currentYear < 2090 || currentMonth < 11;

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={value}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full border rounded-lg py-3 pl-10 pr-4 text-[15px] text-gray-800 outline-none focus:ring-0 transition-all bg-white cursor-pointer ${
            error || ageError ? "border-red-500" : "border-gray-300 focus:border-[#0000ff]"
          }`}
          placeholder="YYYY-MM-DD (BS)"
        />
      </div>
      {error && <p className="text-red-500 text-[12px] mt-1">{error}</p>}
      {ageError && <p className="text-red-500 text-[12px] mt-1">{ageError}</p>}

      {isOpen && (
        <div className="absolute left-0 mt-2 z-[99999] bg-white rounded-xl p-4 shadow-2xl border border-gray-200 w-[320px]">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={goToPreviousMonth}
              disabled={!canGoPrevious}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-[14px] focus:outline-none focus:border-[#0000ff] cursor-pointer bg-white font-semibold"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={goToNextMonth}
              disabled={!canGoNext}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-2">
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-[14px] focus:outline-none focus:border-[#0000ff] cursor-pointer bg-white font-medium"
            >
              {nepaliMonths.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-[11px] font-semibold text-gray-500 h-6 flex items-center justify-center">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-9" />
            ))}
            {days.map((day) => {
              const disabled = isDisabled(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => !disabled && handleDateSelect(day)}
                  disabled={disabled}
                  className={`h-9 w-9 flex items-center justify-center rounded-full text-[13px] font-medium transition-all ${
                    isSelected(day)
                      ? "bg-[#0000ff] text-white"
                      : isToday(day)
                      ? "bg-[#0000ff]/10 text-[#0000ff] font-bold border border-[#0000ff]"
                      : disabled
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-500">
              Minimum age: <span className="font-semibold text-[#0000ff]">{minAge} years</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
