"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Plus, Star, StarOff, Trash } from "lucide-react";

interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  image: string;
  featured: boolean;
}

interface ConfirmModalProps {
  event: EventItem;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function ConfirmModal({ event, onConfirm, onCancel, loading }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {event.featured ? "Unfeature Event" : "Feature Event"}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to {event.featured ? "unfeature" : "feature"} <strong>{event.title}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventListSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmEvent, setConfirmEvent] = useState<EventItem | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const token = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const resolveImage = (url: string) =>
    url?.startsWith("/uploads") ? `${API_BASE}${url}` : url || "";

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/events?page=1&limit=50`, { headers });
      const json = await res.json();
      if (json.success) {
        setEvents((json.data?.events || []).map((e: any) => ({
          id: e.id,
          title: e.title,
          date: e.date || "-",
          location: e.location || "-",
          category: e.category || "",
          image: e.image || "",
          featured: e.featured,
        })));
      } else {
        setError(json.error || "Failed to fetch events");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleToggleFeatured = async () => {
    if (!confirmEvent) return;
    setTogglingId(confirmEvent.id);
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/events/${confirmEvent.id}/feature`, {
        method: "PUT",
        headers,
      });
      const json = await res.json();
      if (json.success) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === confirmEvent.id ? { ...e, featured: !e.featured } : e
          )
        );
      }
    } catch {}
    setTogglingId(null);
    setConfirmEvent(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/events/${id}`, {
        method: "DELETE",
        headers,
      });
      const json = await res.json();
      if (json.success) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {}
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Calendar size={20} className="text-blue-600" /> Manage Events
        </h2>
        <button
          type="button"
          onClick={() => setActiveSection("create-event")}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={16} /> Create Event
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Image</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Title</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Location</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Featured</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No events found.</td>
              </tr>
            )}
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {event.image ? (
                    <img src={resolveImage(event.image)} alt="" className="w-16 h-10 object-cover rounded border" />
                  ) : (
                    <div className="w-16 h-10 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">No img</div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 max-w-[250px] truncate">{event.title}</td>
                <td className="px-4 py-3 text-center text-gray-600">{event.date}</td>
                <td className="px-4 py-3 text-center text-gray-600">{event.location}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold uppercase ${
                    event.featured ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    <Star size={12} className={event.featured ? "fill-yellow-500" : ""} />
                    {event.featured ? "Featured" : "Regular"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => setConfirmEvent(event)}
                      className={`rounded-md p-1.5 ${event.featured ? "text-orange-600 hover:bg-orange-50" : "text-blue-600 hover:bg-blue-50"}`}
                      title={event.featured ? "Unfeature" : "Feature"}
                    >
                      {event.featured ? <StarOff size={16} /> : <Star size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(event.id)}
                      className="rounded-md p-1.5 text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmEvent && (
        <ConfirmModal
          event={confirmEvent}
          onConfirm={handleToggleFeatured}
          onCancel={() => setConfirmEvent(null)}
          loading={togglingId === confirmEvent.id}
        />
      )}
    </div>
  );
}
