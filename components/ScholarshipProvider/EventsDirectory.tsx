"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { Home, CalendarDays, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { scholarshipProviderApi, ProviderEvent } from "@/services/scholarshipProviderApi";

const FALLBACK_EVENTS: ProviderEvent[] = [
  { id: 1, provider_id: 1, name: "Leadership Training 2026", description: "3-day intensive leadership workshop", image_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&h=400", event_type: "Training", start_date: "2026-04-25T09:00:00", end_date: "2026-04-27T16:00:00", location: "Kathmandu", status: "upcoming", attendees: 0, created_at: "", updated_at: "" },
  { id: 2, provider_id: 1, name: "Storytelling Workshop", description: "Effective communication for leaders", image_url: "", event_type: "Workshop", start_date: "2025-09-17T10:00:00", end_date: "2025-09-17T15:00:00", location: "Pokhara", status: "completed", attendees: 0, created_at: "", updated_at: "" },
  { id: 3, provider_id: 1, name: "Children's Day Celebration 2025", description: "Annual celebration with community", image_url: "", event_type: "Program", start_date: "2025-09-17T11:00:00", end_date: "2025-09-17T17:00:00", location: "Kathmandu", status: "completed", attendees: 0, created_at: "", updated_at: "" },
  { id: 4, provider_id: 1, name: "Earthquake Preparedness Drill", description: "Community safety preparedness", image_url: "", event_type: "Seminar", start_date: "2026-04-12T08:00:00", end_date: "2026-04-12T12:00:00", location: "Lalitpur", status: "upcoming", attendees: 0, created_at: "", updated_at: "" },
  { id: 5, provider_id: 1, name: "Community Health Camp", description: "Free health check-ups for residents", image_url: "", event_type: "Program", start_date: "2026-05-05T07:00:00", end_date: "2026-05-05T14:00:00", location: "Bhaktapur", status: "upcoming", attendees: 0, created_at: "", updated_at: "" },
];

const TYPE_COLORS: Record<string, string> = {
  Training: "bg-blue-100 text-blue-700",
  Workshop: "bg-purple-100 text-purple-700",
  Program: "bg-orange-100 text-orange-700",
  Seminar: "bg-red-100 text-red-700",
  Meeting: "bg-indigo-100 text-indigo-700",
  Ceremony: "bg-pink-100 text-pink-700",
  Conference: "bg-cyan-100 text-cyan-700",
  Webinar: "bg-teal-100 text-teal-700",
};

const STATUS_COLORS: Record<string, string> = {
  upcoming: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700",
  draft: "bg-yellow-100 text-yellow-700",
  planned: "bg-blue-100 text-blue-700",
  scheduled: "bg-yellow-100 text-yellow-700",
};

const EventsDirectory: React.FC = memo(() => {
  const [events, setEvents] = useState<ProviderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await scholarshipProviderApi.getEvents(page, limit);
        setEvents(res.events.length > 0 ? res.events : FALLBACK_EVENTS);
        setTotal(res.meta.total);
      } catch {
        setEvents(FALLBACK_EVENTS);
        setTotal(FALLBACK_EVENTS.length);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [page]);

  const filtered = search
    ? events.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
    : events;

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Delete this event?")) return;
    try {
      await scholarshipProviderApi.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Failed to delete event");
    }
  }, []);

  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Events Directory</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Events Directory</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" /> Events Directory
          </h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input type="text" className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Event Title</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Venue</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-gray-500">No events found</td></tr>
              ) : filtered.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={event.image_url || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&h=400"}
                      alt={event.name}
                      className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{event.name}</p>
                    <p className="text-xs text-gray-500">{event.description?.slice(0, 60)}</p>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${TYPE_COLORS[event.event_type] || "bg-gray-100 text-gray-700"}`}>{event.event_type}</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <p className="font-medium text-gray-900">{formatDate(event.start_date)}</p>
                    <p className="text-xs text-gray-500">{formatTime(event.start_date)} - {formatTime(event.end_date)}</p>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-600">{event.location || "N/A"}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[event.status] || "bg-gray-100 text-gray-700"}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Edit"><Pencil className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Delete" onClick={() => handleDelete(event.id)}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">Showing <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span> of <span className="font-medium">{total}</span> events</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{i + 1}</button>
              ))}
              {totalPages > 5 && <span className="text-gray-400">...</span>}
              {totalPages > 5 && <button onClick={() => setPage(totalPages)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">{totalPages}</button>}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

EventsDirectory.displayName = "EventsDirectory";

export default EventsDirectory;
