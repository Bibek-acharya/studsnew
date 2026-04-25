"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Edit2,
  Trash2,
  X,
  Clock,
  Users,
  MapPin,
  AlignLeft,
  GripHorizontal,
  Info,
  Tag,
} from "lucide-react";
import SectionCard from "./common/SectionCard";
import Button from "./common/Button";
import { scholarshipProviderApi, ProviderCalendarEvent } from "@/services/scholarshipProviderApi";

const FILTERS = [
  { key: "all", label: "All", color: "bg-slate-500" },
  { key: "meeting", label: "Meeting", color: "bg-green-500" },
  { key: "deadline", label: "Deadline", color: "bg-red-500" },
  { key: "event", label: "Event", color: "bg-purple-500" },
];

const COLOR_MAP: Record<string, string> = {
  "#3b82f6": "bg-blue-600",
  "#22c55e": "bg-green-600",
  "#ef4444": "bg-red-500",
  "#a855f7": "bg-purple-600",
  "#f97316": "bg-orange-500",
  "#6b7280": "bg-slate-500",
};

const Calendar: React.FC = memo(() => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ProviderCalendarEvent | null>(null);
  const [events, setEvents] = useState<ProviderCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", startTime: "10:00", endTime: "11:00", description: "", color: "#3b82f6" });

  useEffect(() => {
    async function fetchEvents() {
      setLoading(false);
      try {
        const res = await scholarshipProviderApi.getCalendarEvents();
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

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [year, month]);

  const filteredEvents = useMemo(() => {
    return events;
  }, [events]);

  const getEventsForDay = useCallback(
    (day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return filteredEvents.filter((e) => e.start_date.startsWith(dateStr));
    },
    [year, month, filteredEvents]
  );

  const navigateMonth = useCallback((dir: number) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + dir, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const openAddModal = useCallback(() => setShowAddModal(true), []);
  const closeAddModal = useCallback(() => setShowAddModal(false), []);
  const openDetailModal = useCallback((event: ProviderCalendarEvent) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  }, []);
  const closeDetailModal = useCallback(() => setShowDetailModal(false), []);

  const saveNewItem = useCallback(async () => {
    if (!newEvent.title || !newEvent.date) return;
    try {
      const startDateTime = `${newEvent.date}T${newEvent.startTime}:00`;
      const endDateTime = `${newEvent.date}T${newEvent.endTime}:00`;
      const created = await scholarshipProviderApi.createCalendarEvent({
        title: newEvent.title,
        description: newEvent.description,
        start_date: startDateTime,
        end_date: endDateTime,
        color: newEvent.color,
      });
      setEvents((prev) => [...prev, created]);
      setShowAddModal(false);
      setNewEvent({ title: "", date: "", startTime: "10:00", endTime: "11:00", description: "", color: "#3b82f6" });
    } catch {
      alert("Failed to create event");
    }
  }, [newEvent]);

  const deleteEvent = useCallback(async (id: number) => {
    try {
      await scholarshipProviderApi.deleteCalendarEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setShowDetailModal(false);
    } catch {
      alert("Failed to delete event");
    }
  }, []);

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 flex-shrink-0 z-20">
        <div className="h-14 flex items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-900">Calendar</h1>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <div className="flex gap-1.5 overflow-x-auto">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                      activeFilter === f.key ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${activeFilter === f.key ? "bg-white" : f.color}`} />
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex-shrink-0 shadow-sm">
            <Plus className="w-4 h-4" /> <span>Create</span>
          </button>
        </div>

        <div className="h-12 flex items-center justify-between px-5">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-800 min-w-[120px]">{monthLabel}</h2>
            <div className="flex items-center gap-1">
              <button onClick={() => navigateMonth(-1)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={goToToday} className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 mx-2">Today</button>
              <button onClick={() => navigateMonth(1)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-0.5 rounded-lg flex space-x-0.5">
              {(["month", "week", "day"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${view === v ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto p-4 bg-white border-t border-slate-200">
        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading calendar...</div>
        ) : (
          <div className="border border-slate-200 rounded-lg overflow-hidden h-full flex flex-col min-w-[700px]">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-white">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="py-2.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 flex-1 grid-rows-6">
              {calendarDays.map((day, i) => {
                const dayEvents = day ? getEventsForDay(day) : [];
                return (
                  <div key={i} className={`border-b border-r border-slate-100 p-1 min-h-[80px] ${!day ? "bg-slate-50" : "hover:bg-slate-50 cursor-pointer"}`}>
                    {day && (
                      <>
                        <span className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday(day) ? "bg-blue-600 text-white" : "text-slate-700"}`}>{day}</span>
                        <div className="mt-1 space-y-0.5">
                          {dayEvents.slice(0, 2).map((ev) => (
                            <div
                              key={ev.id}
                              onClick={() => openDetailModal(ev)}
                              className={`${COLOR_MAP[ev.color] || "bg-blue-600"} text-white text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80`}
                            >
                              {ev.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-[10px] text-slate-500 pl-1">+{dayEvents.length - 2} more</div>
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4" onClick={closeAddModal}>
          <div className="bg-white rounded-xl w-full max-w-[500px] shadow-2xl flex flex-col relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
              <GripHorizontal className="w-5 h-5 text-slate-300 cursor-grab" />
              <button onClick={closeAddModal} className="p-2 text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 pt-4 pb-6 overflow-y-auto">
              <div className="pl-12 mb-6">
                <input
                  type="text"
                  placeholder="Add title"
                  className="w-full text-2xl text-slate-800 placeholder-slate-400 outline-none bg-transparent border-b-2 border-blue-600 focus:border-blue-700 pb-1 mb-3 transition-colors font-medium"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-slate-400 mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-x-1 gap-y-2 text-sm text-slate-700">
                      <input type="date" className="hover:bg-slate-100 focus:bg-slate-100 px-2 py-1.5 rounded-lg outline-none cursor-pointer transition-colors" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                      <span className="text-slate-400">-</span>
                      <input type="time" className="hover:bg-slate-100 focus:bg-slate-100 px-2 py-1.5 rounded-lg outline-none cursor-pointer transition-colors" value={newEvent.startTime} onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })} />
                      <span className="text-slate-400">-</span>
                      <input type="time" className="hover:bg-slate-100 focus:bg-slate-100 px-2 py-1.5 rounded-lg outline-none cursor-pointer transition-colors" value={newEvent.endTime} onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <AlignLeft className="w-5 h-5 text-slate-400 mt-2 flex-shrink-0" />
                  <textarea placeholder="Add description" className="flex-1 text-sm text-slate-700 placeholder-slate-500 bg-slate-50 hover:bg-slate-100 focus:bg-slate-100 px-3 py-2 rounded-lg outline-none resize-none min-h-[80px] transition-colors" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100">
              <button onClick={closeAddModal} className="text-sm font-medium text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors">Cancel</button>
              <button onClick={saveNewItem} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4" onClick={closeDetailModal}>
          <div className="bg-white rounded-xl w-full max-w-[440px] shadow-2xl flex flex-col relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-end px-4 py-3 bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-1">
                <button className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" onClick={() => deleteEvent(selectedEvent.id)}><Trash2 className="w-[18px] h-[18px]" /></button>
                <button onClick={closeDetailModal} className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors ml-1"><X className="w-[20px] h-[20px]" /></button>
              </div>
            </div>
            <div className="px-6 pb-6 pt-4 overflow-y-auto flex-1">
              <div className="flex items-start gap-4 mb-5">
                <div className={`mt-1 w-3.5 h-3.5 rounded shadow-sm flex-shrink-0 ${COLOR_MAP[selectedEvent.color] || "bg-blue-600"}`} />
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 leading-tight mb-1.5">{selectedEvent.title}</h3>
                  <p className="text-sm text-slate-600">{new Date(selectedEvent.start_date).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{new Date(selectedEvent.start_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {new Date(selectedEvent.end_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
              {selectedEvent.description && (
                <div className="flex items-start gap-4">
                  <AlignLeft className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Description</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{selectedEvent.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Calendar.displayName = "Calendar";

export default Calendar;
