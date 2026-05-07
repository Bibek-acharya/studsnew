"use client";
import React, { useState, useMemo } from "react";
import { CaretLeft, CaretRight, CalendarDots } from "@phosphor-icons/react";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface CalendarWidgetProps {
  eventDays?: number[];
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ eventDays = [] }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const activeDay = today.getDate();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDayOfWeek, daysInMonth]);

  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Calendar</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-colors"
          >
            <CaretLeft weight="bold" className="text-sm" />
          </button>
          <span className="text-sm font-semibold text-gray-700 w-32 text-center">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-colors"
          >
            <CaretRight weight="bold" className="text-sm" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          if (day === null) return <div key={i} />;
          const isActive = isCurrentMonth && day === activeDay;
          const hasEvent = eventDays.includes(day);

          return (
            <div
              key={i}
              className={`text-center text-sm py-2 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
                isActive
                  ? "bg-brand-600 text-white font-semibold"
                  : hasEvent
                    ? "text-brand-600 font-semibold hover:bg-brand-50"
                    : "text-gray-700 hover:bg-brand-50"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
        <CalendarDots weight="fill" className="text-blue-600" />
        <span>
          Today: <span className="font-medium text-gray-800">{formatDate()}</span>
        </span>
      </div>
    </div>
  );
};

export default CalendarWidget;
