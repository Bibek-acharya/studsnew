"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarBlank,
  Pencil,
  Trash,
  Spinner,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { Home, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  institutionEventsApi,
  InstitutionEvent,
} from "@/services/institutionEventsApi";

const TYPE_COLORS: Record<string, string> = {
  workshop: "bg-purple-100 text-purple-700",
  training: "bg-blue-100 text-blue-700",
  seminar: "bg-red-100 text-red-700",
  conference: "bg-cyan-100 text-cyan-700",
  program: "bg-orange-100 text-orange-700",
  ceremony: "bg-pink-100 text-pink-700",
  webinar: "bg-teal-100 text-teal-700",
  meeting: "bg-indigo-100 text-indigo-700",
};

const STATUS_COLORS: Record<string, string> = {
  upcoming: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700",
  draft: "bg-yellow-100 text-yellow-700",
  planned: "bg-blue-100 text-blue-700",
  scheduled: "bg-yellow-100 text-yellow-700",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&h=400";

const EventsDirectoryPage: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<InstitutionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    eventId: number | null;
    title: string;
  }>({
    isOpen: false,
    eventId: null,
    title: "",
  });
  const limit = 10;

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await institutionEventsApi.list(page, limit);
        setEvents(res.events || []);
        setTotal(res.meta?.total || 0);
      } catch {
        setEvents([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [page]);

  const filtered = useMemo(() => {
    if (!search) return events;
    return events.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [events, search]);

  const handleDelete = useCallback(
    (id: number) => {
      const target = events.find((item) => item.id === id);
      setDeleteModal({
        isOpen: true,
        eventId: id,
        title: target?.name || "this event",
      });
    },
    [events],
  );

  const confirmDeleteEvent = useCallback(async () => {
    if (!deleteModal.eventId) return;
    const eventId = deleteModal.eventId;
    setDeleteModal({ isOpen: false, eventId: null, title: "" });
    try {
      await institutionEventsApi.delete(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      toast.success("Event deleted successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete event",
      );
    }
  }, [deleteModal.eventId]);

  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Event
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete &ldquo;{deleteModal.title}&rdquo;?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, eventId: null, title: "" })
                }
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteEvent}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
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
            <CalendarBlank className="w-5 h-5 text-blue-600" /> Events
            Directory
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
              />
            </div>
            <button
              onClick={() =>
                router.push("/institution-zone/dashboard/events/create")
              }
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} /> Create Event
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-500">Loading events...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Image
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Event Title
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Date & Time
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Venue
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 text-center text-gray-500"
                      >
                        {search
                          ? "No events found matching your search."
                          : "No events yet. Create your first event!"}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <img
                            src={event.image_url || FALLBACK_IMAGE}
                            alt={event.name}
                            className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">
                            {event.name}
                          </p>
                          {event.short_desc && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {event.short_desc
                                .replace(/<[^>]*>/g, "")
                                .replace(/&nbsp;/g, " ")
                                .replace(/&amp;/g, "&")
                                .replace(/\s+/g, " ")
                                .trim()
                                .slice(0, 60)}
                            </p>
                          )}
                          {!event.short_desc && event.description && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {event.description
                                .replace(/<[^>]*>/g, "")
                                .replace(/&nbsp;/g, " ")
                                .replace(/&amp;/g, "&")
                                .replace(/\s+/g, " ")
                                .trim()
                                .slice(0, 60)}
                            </p>
                          )}
                        </td>
                        <td className="text-center py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${TYPE_COLORS[event.event_type] || "bg-gray-100 text-gray-700"}`}
                          >
                            {event.event_type
                              ? event.event_type.charAt(0).toUpperCase() +
                                event.event_type.slice(1)
                              : "N/A"}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <p className="font-medium text-gray-900">
                            {formatDate(event.start_date)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTime(event.start_date)} -{" "}
                            {formatTime(event.end_date)}
                          </p>
                        </td>
                        <td className="text-center py-3 px-4 text-gray-600">
                          {event.location || "N/A"}
                        </td>
                        <td className="text-center py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[event.status] || "bg-gray-100 text-gray-700"}`}
                          >
                            {event.status
                              ? event.status.charAt(0).toUpperCase() +
                                event.status.slice(1)
                              : "Draft"}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/institution-zone/dashboard/events/create?edit=${event.id}`,
                                )
                              }
                              className="p-1.5 hover:bg-green-50 rounded text-green-600"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="p-1.5 hover:bg-red-50 rounded text-red-600"
                              title="Delete"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium">
                    {(page - 1) * limit + 1}-{Math.min(page * limit, total)}
                  </span>{" "}
                  of <span className="font-medium">{total}</span> events
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                  >
                    <CaretLeft className="w-4 h-4" />
                  </button>
                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                          page === i + 1
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ),
                  )}
                  {totalPages > 5 && (
                    <span className="text-gray-400">...</span>
                  )}
                  {totalPages > 5 && (
                    <button
                      onClick={() => setPage(totalPages)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      {totalPages}
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                  >
                    <CaretRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsDirectoryPage;
