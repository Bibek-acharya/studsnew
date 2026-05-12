"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Home, CalendarDays, Search, Pencil, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { adminEventApi, AdminEvent } from "@/services/eventApi";

const CATEGORY_COLORS: Record<string, string> = {
  workshop: "bg-purple-100 text-purple-700",
  seminar: "bg-red-100 text-red-700",
  conference: "bg-cyan-100 text-cyan-700",
  webinar: "bg-teal-100 text-teal-700",
  training: "bg-blue-100 text-blue-700",
  program: "bg-orange-100 text-orange-700",
  ceremony: "bg-pink-100 text-pink-700",
  meeting: "bg-indigo-100 text-indigo-700",
  competition: "bg-yellow-100 text-yellow-700",
  other: "bg-gray-100 text-gray-700",
};

const CATEGORY_LABELS: Record<string, string> = {
  workshop: "Workshop",
  seminar: "Seminar",
  conference: "Conference",
  webinar: "Webinar",
  training: "Training",
  program: "Program",
  ceremony: "Ceremony",
  meeting: "Meeting",
  competition: "Competition",
  other: "Other",
};

interface DeleteModalState {
  isOpen: boolean;
  eventId: number | null;
  title: string;
}

export default function EventListSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({ isOpen: false, eventId: null, title: "" });
  const limit = 10;

  const fetchEvents = useCallback(async (p: number, s: string) => {
    setLoading(true);
    try {
      const res = await adminEventApi.list({ page: p, limit, search: s || undefined });
      setEvents(res.events || []);
      setTotal(res.meta?.total || 0);
    } catch {
      setEvents([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(page, search); }, [page, fetchEvents]);

  const handleSearch = useCallback(() => {
    setPage(1);
    fetchEvents(1, search);
  }, [search, fetchEvents]);

  const handleDelete = useCallback((id: number) => {
    const target = events.find((e) => e.id === id);
    setDeleteModal({ isOpen: true, eventId: id, title: target?.title || "this event" });
  }, [events]);

  const confirmDelete = useCallback(async () => {
    if (!deleteModal.eventId) return;
    const id = deleteModal.eventId;
    setDeleteModal({ isOpen: false, eventId: null, title: "" });
    try {
      await adminEventApi.delete(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event deleted successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete event");
    }
  }, [deleteModal.eventId]);

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Event</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete &ldquo;{deleteModal.title}&rdquo;? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModal({ isOpen: false, eventId: null, title: "" })} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

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
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button type="button" onClick={() => setActiveSection("create-event")} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              <Plus size={16} /> Create Event
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Location</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Featured</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-gray-500">No events found</td></tr>
              ) : events.map((item) => {
                const catLabel = CATEGORY_LABELS[item.category] || item.category;
                const catColor = CATEGORY_COLORS[item.category] || "bg-gray-100 text-gray-700";
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&h=400"}
                        alt={item.title}
                        className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      {item.excerpt && (
                        <p className="text-xs text-gray-500">{item.excerpt.replace(/<[^>]*>/g, "").slice(0, 60)}</p>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${catColor}`}>{catLabel}</span>
                    </td>
                    <td className="text-center py-3 px-4 text-gray-500">
                      {item.date ? new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                    </td>
                    <td className="text-center py-3 px-4 text-gray-600">{item.location || "-"}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold uppercase ${item.featured ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                        {item.featured ? "Featured" : "Regular"}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Edit" onClick={() => setActiveSection(`edit-event-${item.id}`)}><Pencil className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Delete" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span> of <span className="font-medium">{total}</span> events
            </p>
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
}
