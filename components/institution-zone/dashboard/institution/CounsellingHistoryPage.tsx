"use client";
import React, { useState, useEffect } from "react";
import { MagnifyingGlass, CalendarCheck, Clock } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { institutionCounsellingApi, CounsellingSession } from "@/services/institutionCounsellingApi";

const CounsellingHistoryPage = () => {
  const [sessions, setSessions] = useState<CounsellingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    institutionCounsellingApi.getSessions()
      .then(res => setSessions(Array.isArray(res) ? res : []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = sessions.filter(s => {
    if (filterStatus !== "All" && s.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!s.title.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader title="Session History" breadcrumbItems={[
        { label: "Dashboard" }, { label: "Counselling", href: "/institution-zone/dashboard/counselling" }, { label: "Session History" },
      ]} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-wrap items-center gap-4">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sessions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none">
            <option value="All">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400"><p className="text-sm">Loading...</p></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No session history found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(s => (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <CalendarCheck className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{s.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(s.scheduled_at).toLocaleDateString()} &middot; {s.duration}min &middot; {s.booked_seats}/{s.max_seats} seats
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  s.status === "completed" ? "bg-green-100 text-green-700" :
                  s.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                  s.status === "cancelled" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-700"
                }`}>{s.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CounsellingHistoryPage;
