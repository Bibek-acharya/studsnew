"use client";
import React, { useState, useEffect } from "react";
import { MagnifyingGlass, CalendarCheck, Trash } from "@phosphor-icons/react";
import { toast } from "sonner";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import {
  institutionCounsellingApi,
  CounsellingSession,
} from "@/services/institutionCounsellingApi";

type HistFilter = "All" | "upcoming" | "ongoing" | "completed" | "cancelled";

const statusStyle: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-700",
  ongoing: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
};

const CounsellingHistoryPage = () => {
  const [sessions, setSessions] = useState<CounsellingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<HistFilter>("All");
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const loadSessions = () => {
    setLoading(true);
    institutionCounsellingApi
      .getSessions(1, 100)
      .then((res) =>
        setSessions(Array.isArray(res.sessions) ? res.sessions : []),
      )
      .catch(() => {
        setSessions([]);
        toast.error("Failed to load session history");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await institutionCounsellingApi.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast.success("Session deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete session");
    }
  };

  const filtered = sessions.filter((s) => {
    const actual = s.actual_status || "upcoming";
    if (filterStatus !== "All" && actual !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!s.title.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Session History"
        breadcrumbItems={[
          { label: "Dashboard" },
          {
            label: "Counselling",
            href: "/institution-zone/dashboard/counselling",
          },
          { label: "Session History" },
        ]}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-wrap items-center gap-4">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sessions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as HistFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          >
            <option value="All">All Sessions</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No session history found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <CalendarCheck className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{s.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(s.scheduled_at).toLocaleDateString()} &middot;{" "}
                      {s.duration}min &middot; {s.booked_seats}/{s.max_seats}{" "}
                      seats
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${statusStyle[s.actual_status || "upcoming"] || "bg-gray-100 text-gray-700"}`}
                  >
                    {s.actual_status || "upcoming"}
                  </span>
                  <button
                    onClick={() => setDeleteTarget(s.id)}
                    className="w-8 h-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                    title="Delete"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget !== null && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-xl m-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-gray-800 mb-2">Delete Session</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="h-10 px-4 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounsellingHistoryPage;
