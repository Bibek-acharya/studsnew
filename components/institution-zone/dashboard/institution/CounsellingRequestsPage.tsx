"use client";
import React, { useState, useEffect } from "react";
import { ChatsCircle, Clock, CheckCircle, MagnifyingGlass } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { institutionCounsellingApi, CounsellingBooking } from "@/services/institutionCounsellingApi";

const CounsellingRequestsPage = () => {
  const [bookings, setBookings] = useState<CounsellingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    institutionCounsellingApi.getBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id: number, status: string) => {
    try {
      await institutionCounsellingApi.updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (e) { console.error(e); }
  };

  const filtered = bookings.filter(b => {
    if (filterStatus !== "All" && b.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!String(b.user_id).includes(q) && !b.notes.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader title="Counselling Requests" breadcrumbItems={[
        { label: "Dashboard" }, { label: "Counselling", href: "/institution-zone/dashboard/counselling" }, { label: "Requests" },
      ]} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-wrap items-center gap-4">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none">
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400"><p className="text-sm">Loading...</p></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ChatsCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No counselling requests found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(b => (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {b.user_id}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">User #{b.user_id}</p>
                    <p className="text-xs text-gray-500">
                      {b.session?.title || "No session"} &middot; {b.notes ? b.notes.substring(0, 50) : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    b.status === "approved" ? "bg-green-100 text-green-700" :
                    b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    b.status === "completed" ? "bg-blue-100 text-blue-700" :
                    b.status === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{b.status}</span>
                  {b.status === "pending" && (
                    <div className="flex gap-1">
                      <button onClick={() => handleStatus(b.id, "approved")} className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                      <button onClick={() => handleStatus(b.id, "cancelled")} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Reject"><Clock className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CounsellingRequestsPage;
