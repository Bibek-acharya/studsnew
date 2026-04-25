"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Calendar, Search, Edit, Trash2, Eye, MapPin } from "lucide-react";
import SectionCard from "./common/SectionCard";
import { scholarshipProviderApi, ProviderEvent } from "@/services/scholarshipProviderApi";

const EventsDirectory: React.FC = memo(() => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [events, setEvents] = useState<ProviderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await scholarshipProviderApi.getEvents(page, limit);
        setEvents(res.events);
        setTotal(res.meta.total);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [page]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || e.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [events, search, statusFilter]);

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

  return (
    <div className="space-y-6">
      <SectionCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Events Directory
          </h2>
          <span className="text-sm text-slate-500">Showing {filtered.length} of {total} events</span>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 flex items-center border border-slate-200 rounded-lg px-3 py-2 focus-within:border-blue-600">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search events..." className="bg-transparent border-none outline-none text-sm ml-2 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading events...</div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Event</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Type</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Date & Time</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Location</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-500">No events found</td></tr>
                ) : filtered.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {event.image_url && <img src={event.image_url} alt={event.name} className="w-16 h-12 object-cover rounded-lg" />}
                        <span className="font-medium text-slate-900">{event.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{event.event_type}</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div>
                        <p className="font-medium text-slate-900">{new Date(event.start_date).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-500">{new Date(event.start_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="flex items-center justify-center gap-1 text-slate-600"><MapPin className="w-3 h-3" />{event.location || "N/A"}</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.status === "upcoming" ? "bg-blue-100 text-blue-700" :
                        event.status === "completed" ? "bg-green-100 text-green-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>{event.status}</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Delete" onClick={() => handleDelete(event.id)}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
                <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
                  <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
                </div>
              </div>
            )}
          </div>
        )}
      </SectionCard>
    </div>
  );
});

EventsDirectory.displayName = "EventsDirectory";

export default EventsDirectory;
