"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  X,
  Trash2,
  GraduationCap,
  Award,
  CalendarDays,
  CheckSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { apiService } from "@/services/api";
import { ErrorState } from "@/components/ui/ErrorState";
import { Toast } from "@/components/ui/Toast";

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type:
    | "admission"
    | "entrance"
    | "counselling"
    | "scholarship"
    | "events"
    | "tasks";
}

const HOUR_HEIGHT = 80;

const EVENT_THEMES = {
  admission: {
    bg: "bg-blue-100",
    border: "border-blue-300",
    text: "text-blue-800",
    label: "text-blue-700",
  },
  entrance: {
    bg: "bg-orange-100",
    border: "border-orange-300",
    text: "text-orange-800",
    label: "text-orange-700",
  },
  counselling: {
    bg: "bg-purple-100",
    border: "border-purple-300",
    text: "text-purple-800",
    label: "text-purple-700",
  },
  scholarship: {
    bg: "bg-green-100",
    border: "border-green-300",
    text: "text-green-800",
    label: "text-green-700",
  },
  events: {
    bg: "bg-pink-100",
    border: "border-pink-300",
    text: "text-pink-800",
    label: "text-pink-700",
  },
  tasks: {
    bg: "bg-slate-100",
    border: "border-slate-300",
    text: "text-slate-800",
    label: "text-slate-700",
  },
};

const TABS = [
  { id: "All", icon: CalendarDays, label: "All" },
  { id: "admission", icon: GraduationCap, label: "Admission" },
  { id: "entrance", icon: Award, label: "Entrance" },
  { id: "counselling", icon: CalendarDays, label: "Counselling" },
  { id: "scholarship", icon: Award, label: "Scholarship" },
  { id: "events", icon: CalendarDays, label: "Events" },
  { id: "tasks", icon: CheckSquare, label: "Tasks" },
];

export default function CalendarSection() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"Day" | "Week" | "Month">("Week");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "meeting",
    date: "",
    start: "",
    end: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchEvents = () => {
    apiService
      .getCalendarEvents()
      .then((res) => {
        const items = res.data || [];
        const mapped: CalendarEvent[] = items.map((ev) => ({
          id: ev.id,
          title: ev.title,
          start: new Date(ev.start_date),
          end: ev.end_date ? new Date(ev.end_date) : new Date(ev.start_date),
          type: (ev.type || "events") as CalendarEvent["type"],
        }));
        setEvents(mapped);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message);
        console.error("Failed to fetch calendar events:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getStartOfWeek = (date: Date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day + (day === 0 ? -6 : 1);
    result.setDate(diff);
    result.setHours(0, 0, 0, 0);
    return result;
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getFilteredEvents = () => {
    return events.filter((e) => {
      const matchesSearch = e.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "All" || activeTab === e.type;
      return matchesSearch && matchesTab;
    });
  };

  const handleSetActiveTab = (tabId: string) => {
    setActiveTab(tabId);
  };
  const handleSetView = (v: "Day" | "Week" | "Month") => {
    setView(v);
  };
  const setToday = () => {
    setCurrentDate(new Date());
  };

  const navigateDate = (dir: number) => {
    if (view === "Day") setCurrentDate(addDays(currentDate, dir));
    else if (view === "Week") setCurrentDate(addDays(currentDate, dir * 7));
    else {
      const d = new Date(currentDate);
      d.setMonth(d.getMonth() + dir);
      setCurrentDate(d);
    }
  };

  const openModal = (dateStr?: string, hour?: number) => {
    const now = new Date();
    const startObj = dateStr ? new Date(dateStr) : now;
    if (hour !== undefined) startObj.setHours(hour, 0, 0, 0);
    const endObj = new Date(startObj);
    endObj.setHours(endObj.getHours() + 1);

    setEditingEvent(null);
    setFormData({
      title: "",
      type: "meeting",
      date: startObj.toISOString().split("T")[0],
      start: startObj.toTimeString().slice(0, 5),
      end: endObj.toTimeString().slice(0, 5),
    });
    setShowModal(true);
  };

  const editEvent = (event: CalendarEvent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingEvent(event);
    setFormData({
      title: event.title,
      type: event.type,
      date: event.start.toISOString().split("T")[0],
      start: event.start.toTimeString().slice(0, 5),
      end: event.end.toTimeString().slice(0, 5),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setFormData({ title: "", type: "admission", date: "", start: "", end: "" });
  };

  const deleteEvent = async () => {
    if (editingEvent) {
      try {
        await apiService.deleteCalendarEvent(editingEvent.id);
        fetchEvents();
        closeModal();
        setToast({ message: "Event deleted", type: "success" });
        setTimeout(() => setToast(null), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete event");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const startDateStr = `${formData.date}T${formData.start}:00`;
    const endDateStr = `${formData.date}T${formData.end}:00`;

    try {
      if (editingEvent) {
        await apiService.updateCalendarEvent(editingEvent.id, {
          title: formData.title,
          type: formData.type,
          start_date: startDateStr,
          end_date: endDateStr,
        });
      } else {
        await apiService.createCalendarEvent({
          title: formData.title,
          type: formData.type,
          start_date: startDateStr,
          end_date: endDateStr,
        });
      }
      fetchEvents();
      closeModal();
      setToast({
        message: editingEvent ? "Event updated" : "Event created",
        type: "success",
      });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    }
  };

  const navigateFromMonthToDay = (dateStr: string) => {
    setCurrentDate(new Date(dateStr));
    setView("Day");
  };

  const renderWeekDayView = () => {
    const startOfWeek = getStartOfWeek(currentDate);
    const displayDays =
      view === "Day"
        ? [currentDate]
        : Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek, i));

    const filteredEvents = getFilteredEvents();

    const headersHtml = displayDays.map((day, i) => {
      const isToday = isSameDay(day, new Date());
      return (
        <div
          key={i}
          className={`text-center py-3 border-slate-200 relative ${i !== displayDays.length - 1 ? "border-r" : ""} ${isToday ? "bg-slate-50" : ""}`}
        >
          {isToday && (
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-blue"></div>
          )}
          <div
            className={`text-[10px] md:text-xs font-bold uppercase ${isToday ? "text-brand-blue" : "text-slate-400"}`}
          >
            {day.toLocaleDateString("en-US", { weekday: "short" })}{" "}
            {day.getDate()}
          </div>
        </div>
      );
    });

    const bgLines = Array.from({ length: 24 }).map((_, i) => (
      <div
        key={i}
        className="border-b border-slate-100"
        style={{ height: HOUR_HEIGHT }}
      ></div>
    ));

    const yAxis = Array.from({ length: 24 }).map((_, i) => (
      <div
        key={i}
        className="text-right pr-2 text-[10px] md:text-xs font-medium text-slate-400 relative"
        style={{ height: HOUR_HEIGHT, top: -8 }}
      >
        {i === 0
          ? ""
          : i < 12
            ? `${i} AM`
            : i === 12
              ? "12 PM"
              : `${i - 12} PM`}
      </div>
    ));

    const isTodayInView = displayDays.some((d) => isSameDay(d, currentTime));
    const timeLineHtml = isTodayInView ? (
      <div
        className="absolute left-0 right-0 z-30 pointer-events-none flex"
        style={{
          top:
            (currentTime.getHours() + currentTime.getMinutes() / 60) *
            HOUR_HEIGHT,
        }}
      >
        <div className="w-[60px] text-[10px] font-medium text-red-500 text-right pr-2 -mt-[7px] bg-white">
          {formatTime(currentTime)}
        </div>
        <div className="flex-grow border-t border-red-500 relative">
          <div className="absolute -left-[5px] top-[-4.5px] w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></div>
        </div>
      </div>
    ) : null;

    const columnsHtml = displayDays.map((day, dayIdx) => {
      const isToday = isSameDay(day, new Date());
      const dayStr = day.toISOString();

      const slotsHtml = Array.from({ length: 24 }).map((_, h) => (
        <div
          key={h}
          className="absolute w-full left-0 opacity-0 group-hover:opacity-100 hover:bg-slate-100/50 cursor-pointer transition-colors"
          style={{ top: h * HOUR_HEIGHT, height: HOUR_HEIGHT }}
          onClick={() => openModal(dayStr, h)}
        />
      ));

      const dayEventsHtml = filteredEvents
        .filter((e) => isSameDay(e.start, day))
        .map((event) => {
          const startMins =
            event.start.getHours() * 60 + event.start.getMinutes();
          const durationMins =
            (event.end.getTime() - event.start.getTime()) / 60000;
          const top = (startMins / 60) * HOUR_HEIGHT;
          const height = (durationMins / 60) * HOUR_HEIGHT;
          const theme = EVENT_THEMES[event.type];

          return (
            <div
              key={event.id}
              onClick={(e) => editEvent(event, e)}
              className={`absolute left-1 right-1 ${theme.bg} border-t-2 ${theme.border} rounded-md px-2 py-1.5 overflow-hidden transition-all hover:scale-[1.02] hover:z-30 cursor-pointer  hover:shadow`}
              style={{ top: top, height: height - 2 }}
            >
              <div
                className={`text-[9px] md:text-[10px] font-medium ${theme.label} mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis`}
              >
                {formatTime(event.start)} - {formatTime(event.end)}
              </div>
              <div
                className={`text-[10px] md:text-xs font-semibold ${theme.text} leading-tight`}
              >
                {event.title}
              </div>
            </div>
          );
        });

      return (
        <div
          key={dayIdx}
          className={`flex-1 border-slate-100 relative z-10 p-1 group ${dayIdx !== displayDays.length - 1 ? "border-r" : ""} ${isToday ? "bg-slate-50/30" : ""}`}
        >
          {slotsHtml}
          {dayEventsHtml}
        </div>
      );
    });

    return (
      <>
        <div
          className="grid border-b border-slate-200 bg-white shrink-0"
          style={{
            gridTemplateColumns: `60px repeat(${displayDays.length}, minmax(0, 1fr))`,
          }}
        >
          <div className="border-r border-slate-200 flex items-center justify-center bg-slate-50/30"></div>
          {headersHtml}
        </div>
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
          <div className="absolute inset-0 z-0 ml-[60px] pointer-events-none">
            {bgLines}
          </div>
          {timeLineHtml}
          <div className="flex absolute inset-0 min-h-[1920px]">
            <div className="w-[60px] flex-shrink-0 border-r border-slate-200 z-20 bg-white">
              {yAxis}
            </div>
            {columnsHtml}
          </div>
        </div>
      </>
    );
  };

  const renderMonthView = () => {
    const monthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const monthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    const startDate = getStartOfWeek(monthStart);
    const days: Date[] = [];
    let current = new Date(startDate);

    while (current <= monthEnd || current.getDay() !== 1) {
      days.push(new Date(current));
      current = addDays(current, 1);
      if (days.length > 42) break;
    }

    const filteredEvents = getFilteredEvents();

    const headerHtml = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
      (day) => (
        <div
          key={day}
          className="text-center py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-r-0"
        >
          {day}
        </div>
      ),
    );

    const gridHtml = days.map((day, i) => {
      const isCurrentMonth = day.getMonth() === currentDate.getMonth();
      const isToday = isSameDay(day, new Date());
      const dayEvents = filteredEvents.filter((e) => isSameDay(e.start, day));

      const eventsHtml = dayEvents.slice(0, 3).map((ev) => (
        <div
          key={ev.id}
          className={`text-[10px] truncate px-1.5 py-0.5 rounded ${EVENT_THEMES[ev.type].bg} ${EVENT_THEMES[ev.type].text}`}
        >
          {ev.title}
        </div>
      ));

      return (
        <div
          key={i}
          onClick={() => navigateFromMonthToDay(day.toISOString())}
          className={`min-h-[100px] border-r border-b border-slate-100 p-1 cursor-pointer hover:bg-slate-50 transition-colors ${!isCurrentMonth ? "bg-slate-50/50" : "bg-white"} ${(i + 1) % 7 === 0 ? "border-r-0" : ""}`}
        >
          <div
            className={`text-xs font-medium text-right p-1 ${isToday ? "text-white bg-brand-blue rounded-full w-6 h-6 flex items-center justify-center ml-auto" : isCurrentMonth ? "text-slate-700" : "text-slate-400"}`}
          >
            {day.getDate()}
          </div>
          <div className="mt-1 space-y-1">{eventsHtml}</div>
          {dayEvents.length > 3 && (
            <div className="text-[10px] text-slate-500 px-1">
              + {dayEvents.length - 3} more
            </div>
          )}
        </div>
      );
    });

    return (
      <>
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {headerHtml}
        </div>
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">{gridHtml}</div>
      </>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Calendar</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Calendar</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-md w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleSetActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-brand-blue "
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search.."
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 w-32 md:w-48 transition-all"
            />
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 bg-brand-blue text-white rounded-md text-sm font-medium hover:bg-brand-hover transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>
      </div>
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden flex flex-col min-h-[calc(100vh-12rem)]">
        {/* Loading State */}
        {loading && (
          <div className="p-6 space-y-2 animate-pulse">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 rounded" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, r) => (
              <div key={r} className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, c) => (
                  <div key={c} className="h-16 bg-slate-200 rounded" />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex-1 flex items-center justify-center">
            <ErrorState error={error} />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 flex-1 text-center px-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <CalendarDays className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No events scheduled
            </h3>
            <p className="text-sm text-slate-500 max-w-sm">
              Add your first event to get started.
            </p>
            <button
              onClick={() => openModal()}
              className="mt-6 flex items-center gap-1.5 px-4 py-2 bg-brand-blue text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="p-4 md:p-6 flex-1 flex flex-col min-h-0">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6 gap-4 shrink-0">
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                <h2 className="text-xl md:text-2xl font-semibold text-slate-900 w-48">
                  {currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={setToday}
                    className="px-3 py-1 border border-slate-200 rounded-md text-sm font-medium hover:bg-slate-50"
                  >
                    Today
                  </button>
                  <div className="flex items-center border border-slate-200 rounded-md">
                    <button
                      onClick={() => navigateDate(-1)}
                      className="p-1 border-r border-slate-200 hover:bg-slate-50 text-slate-600"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigateDate(1)}
                      className="p-1 hover:bg-slate-50 text-slate-600"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto">
                <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
                  {(["Day", "Week", "Month"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => handleSetView(v)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                        view === v
                          ? "bg-white text-slate-900 "
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-md overflow-hidden bg-white  flex-1 flex flex-col min-h-0">
              {view === "Month" ? renderMonthView() : renderWeekDayView()}
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-md  w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingEvent ? "Edit Event" : "New Event"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                    placeholder="Event title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                    >
                      <option value="admission">Admission</option>
                      <option value="entrance">Entrance</option>
                      <option value="counselling">Counselling</option>
                      <option value="scholarship">Scholarship</option>
                      <option value="events">Events</option>
                      <option value="tasks">Tasks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Date
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Start Time
                    </label>
                    <input
                      required
                      type="time"
                      value={formData.start}
                      onChange={(e) =>
                        setFormData({ ...formData, start: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      End Time
                    </label>
                    <input
                      required
                      type="time"
                      value={formData.end}
                      onChange={(e) =>
                        setFormData({ ...formData, end: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-3">
                  {editingEvent && (
                    <button
                      type="button"
                      onClick={deleteEvent}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <div></div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-blue-700 transition-colors "
                    >
                      Save Event
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {toast && <Toast message={toast.message} />}
      </div>
    </div>
  );
}
