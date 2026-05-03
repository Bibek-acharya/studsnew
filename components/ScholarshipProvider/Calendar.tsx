"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  UserPlus,
  AlignLeft,
  Link2,
  X,
  Trash2,
  SlidersHorizontal,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";
import { getCalendarEvents, createCalendarEvent, deleteCalendarEvent, ProviderCalendarEvent } from "@/services/scholarshipProviderApi";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("month");
  const [selectedEvent, setSelectedEvent] = useState<ProviderCalendarEvent | null>(null);
  const [events, setEvents] = useState<ProviderCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    description: "",
    participants: "",
    link: "",
    color: "#a855f7",
  });

  const COLORS = ["#f472b6", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#a855f7", "#6b7280"];

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await getCalendarEvents();
        setEvents(res);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthLabel = useMemo(() => {
    return currentDate.toLocaleString("default", { month: "long", year: "numeric" });
  }, [currentDate]);

  const miniMonthLabel = useMemo(() => {
    return currentDate.toLocaleString("default", { month: "short", year: "numeric" });
  }, [currentDate]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [year, month]);

  const miniCalendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) days.push(prevMonthDays - i);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push(i);
    return days;
  }, [year, month]);

  const getEventsForDay = useCallback(
    (day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return events.filter((e) => e.start_date.startsWith(dateStr));
    },
    [year, month, events]
  );

  const navigateMonth = useCallback((dir: number) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + dir, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleSaveEvent = useCallback(async () => {
    if (!newEvent.title || !newEvent.date) return;
    try {
      const startDateTime = `${newEvent.date}T${newEvent.startTime}:00`;
      const endDateTime = `${newEvent.date}T${newEvent.endTime}:00`;
      const created = await createCalendarEvent({
        title: newEvent.title,
        description: newEvent.description,
        start_date: startDateTime,
        end_date: endDateTime,
        color: newEvent.color,
      });
      setEvents((prev) => [...prev, created]);
      toast.success("A new task has been added.");
      setShowEventForm(false);
      setNewEvent({
        title: "",
        date: "",
        startTime: "09:00",
        endTime: "10:00",
        description: "",
        participants: "",
        link: "",
        color: "#a855f7",
      });
    } catch {
      toast.error("Failed to create event");
    }
  }, [newEvent]);

  const handleDeleteEvent = useCallback(async (id: number) => {
    try {
      await deleteCalendarEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event deleted successfully");
      setSelectedEvent(null);
    } catch {
      toast.error("Failed to delete event");
    }
  }, []);

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const formatSelectedDate = () => {
    if (!selectedEvent) return "";
    const date = new Date(selectedEvent.start_date);
    return date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="h-14 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-medium w-36">{monthLabel}</h2>
            <button onClick={goToToday} className="px-4 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium">
              Today
            </button>
            <div className="flex items-center gap-1">
              <button onClick={() => navigateMonth(-1)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => navigateMonth(1)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <div className="bg-gray-100 rounded-md p-1 flex items-center text-sm font-medium">
              <button
                className={`view-btn px-4 py-1 rounded-md text-gray-600 hover:text-gray-900 transition-colors ${view === "day" ? "bg-white shadow-sm text-gray-900" : ""}`}
                onClick={() => setView("day")}
              >
                Day
              </button>
              <button
                className={`view-btn px-4 py-1 rounded-md text-gray-600 hover:text-gray-900 transition-colors ${view === "week" ? "bg-white shadow-sm text-gray-900" : ""}`}
                onClick={() => setView("week")}
              >
                Week
              </button>
              <button
                className={`view-btn px-4 py-1 rounded-md text-gray-600 hover:text-gray-900 transition-colors ${view === "month" ? "bg-white shadow-sm text-gray-900" : ""}`}
                onClick={() => setView("month")}
              >
                Month
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar Grid */}
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-auto">
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading calendar...</div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="grid grid-cols-7 border-b border-gray-200 bg-white flex-shrink-0">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 flex-1 grid-rows-6">
                  {calendarDays.map((day, i) => {
                    const dayEvents = day ? getEventsForDay(day) : [];
                    return (
                      <div
                        key={i}
                        className={`border-b border-r border-gray-100 p-2 min-h-[100px] ${!day ? "bg-gray-50" : "hover:bg-gray-50 cursor-pointer"}`}
                        onClick={() => {
                          if (day) {
                            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                            setNewEvent((prev) => ({ ...prev, date: dateStr }));
                            setShowEventForm(true);
                          }
                        }}
                      >
                        {day && (
                          <>
                            <span
                              className={`text-sm font-medium inline-flex items-center justify-center w-7 h-7 rounded-full ${
                                isToday(day) ? "bg-blue-600 text-white" : "text-gray-700"
                              }`}
                            >
                              {day}
                            </span>
                            <div className="mt-1 space-y-1">
                              {dayEvents.slice(0, 2).map((ev) => (
                                <div
                                  key={ev.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(ev);
                                  }}
                                  className={`text-xs px-2 py-1 rounded truncate cursor-pointer text-white ${
                                    ev.color === "#a855f7"
                                      ? "bg-purple-600"
                                      : ev.color === "#f472b6"
                                      ? "bg-pink-500"
                                      : ev.color === "#fb923c"
                                      ? "bg-orange-500"
                                      : ev.color === "#facc15"
                                      ? "bg-yellow-500"
                                      : ev.color === "#4ade80"
                                      ? "bg-green-500"
                                      : ev.color === "#60a5fa"
                                      ? "bg-blue-500"
                                      : "bg-gray-500"
                                  }`}
                                >
                                  {ev.title}
                                </div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="text-xs text-gray-500 pl-1">+{dayEvents.length - 2} more</div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col overflow-y-auto shrink-0">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => navigateMonth(-1)} className="p-1 rounded-full hover:bg-gray-100 text-gray-600">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-medium text-sm">{miniMonthLabel}</span>
              <button onClick={() => navigateMonth(1)} className="p-1 rounded-full hover:bg-gray-100 text-gray-600">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
              <div>Su</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {miniCalendarDays.map((day, i) => {
                const isCurrentMonth = day && day <= 31 && i < 7 ? (i >= new Date(year, month, 1).getDay()) : day && i >= 7 && i < 38 ? true : day && day > 31;
                const adjustedDay = day && day > 31 ? day - 31 : day && day <= (new Date(year, month, 1).getDay() - 1 || 7) ? (new Date(year, month + 1, 0).getDate() - ((new Date(year, month, 1).getDay() - 1 || 7) - day)) : day;
                const isTodayMini = day && isToday(day > 31 ? day - 31 : day);
                return (
                  <div
                    key={i}
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                      isCurrentMonth ? (isTodayMini ? "bg-blue-600 text-white" : "text-gray-700") : "text-gray-300"
                    }`}
                  >
                    {adjustedDay}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-5 flex-1">
            {showEventForm && (
              <div className="mb-5">
                <p className="text-sm text-gray-500 mb-1">Live event</p>
                <div className="flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  {newEvent.title || "New Event"}
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div className="flex items-center gap-3 border border-gray-200 rounded-md p-3">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">
                  {selectedEvent ? formatSelectedDate() : newEvent.date || "Select date"}
                </span>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-3 border border-gray-200 rounded-md p-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <input
                    type="time"
                    className="text-sm outline-none w-full bg-transparent"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  />
                </div>
                <div className="flex-1 flex items-center gap-3 border border-gray-200 rounded-md p-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <input
                    type="time"
                    className="text-sm outline-none w-full bg-transparent"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 border border-gray-200 rounded-md p-3">
                <UserPlus className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Add participants"
                  className="text-sm outline-none w-full bg-transparent placeholder-gray-500"
                  value={newEvent.participants}
                  onChange={(e) => setNewEvent({ ...newEvent, participants: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3 border border-gray-200 rounded-md p-3">
                <AlignLeft className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Add description"
                  className="text-sm outline-none w-full bg-transparent placeholder-gray-500"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3 border border-gray-200 rounded-md p-3">
                <Link2 className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Add link"
                  className="text-sm outline-none w-full bg-transparent text-blue-600"
                  value={newEvent.link}
                  onChange={(e) => setNewEvent({ ...newEvent, link: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3 py-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewEvent({ ...newEvent, color })}
                    className={`w-5 h-5 rounded-full ${
                      newEvent.color === color ? "ring-2 ring-offset-2 ring-gray-400" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  setShowEventForm(false);
                  setSelectedEvent(null);
                }}
                className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && !showEventForm && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-start gap-4">
              <div
                className={`w-4 h-4 rounded-full mt-1.5 shrink-0 ${
                  selectedEvent.color === "#a855f7"
                    ? "bg-purple-600"
                    : selectedEvent.color === "#f472b6"
                    ? "bg-pink-500"
                    : selectedEvent.color === "#fb923c"
                    ? "bg-orange-500"
                    : selectedEvent.color === "#facc15"
                    ? "bg-yellow-500"
                    : selectedEvent.color === "#4ade80"
                    ? "bg-green-500"
                    : selectedEvent.color === "#60a5fa"
                    ? "bg-blue-500"
                    : "bg-gray-500"
                }`}
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 leading-tight mb-3 pr-6">
                  {selectedEvent.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <CalendarIcon className="w-4 h-4 shrink-0" />
                  <span>{new Date(selectedEvent.start_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlignLeft className="w-4 h-4 shrink-0" />
                  <span>{selectedEvent.description || "No description provided"}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => handleDeleteEvent(selectedEvent.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;