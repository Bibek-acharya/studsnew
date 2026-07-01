"use client";
import React, { useState, useEffect } from "react";
import {
  ChatsCircle,
  Clock,
  CheckCircle,
  MagnifyingGlass,
  CalendarPlus,
  X,
  Trash,
} from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import {
  institutionCounsellingApi,
  CounsellingBooking,
  CounsellingSession,
} from "@/services/institutionCounsellingApi";

const CounsellingRequestsPage = () => {
  const [bookings, setBookings] = useState<CounsellingBooking[]>([]);
  const [sessions, setSessions] = useState<CounsellingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [slotTitle, setSlotTitle] = useState("");
  const [slotCapacity, setSlotCapacity] = useState("10");
  const [slotSubmitting, setSlotSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    Promise.all([
      institutionCounsellingApi
        .getBookings()
        .then((res) => setBookings(Array.isArray(res) ? res : [])),
      institutionCounsellingApi
        .getSessions()
        .then((res) => setSessions(Array.isArray(res) ? res : [])),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id: number, status: string) => {
    setActionError("");
    try {
      await institutionCounsellingApi.updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b)),
      );
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Failed to update status",
      );
    }
  };

  const handleAddSlot = async () => {
    if (!slotDate || !slotTime) return;
    setSlotSubmitting(true);
    try {
      const session = await institutionCounsellingApi.createSession({
        title: slotTitle || "Counselling Session",
        description: "",
        scheduled_at: `${slotDate}T${slotTime}`,
        duration: 60,
        max_seats: parseInt(slotCapacity) || 10,
      });
      setSessions((prev) => [...prev, session]);
      setSlotDate("");
      setSlotTime("");
      setSlotTitle("");
      setSlotCapacity("10");
    } catch (e) {
      console.error(e);
    }
    setSlotSubmitting(false);
  };

  const handleDeleteSlot = async (id: number) => {
    try {
      await institutionCounsellingApi.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const formatSlotDate = (s: CounsellingSession) => {
    const d = new Date(s.scheduled_at);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatSlotTime = (s: CounsellingSession) => {
    const d = new Date(s.scheduled_at);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filtered = bookings.filter((b) => {
    if (filterStatus !== "All" && b.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !String(b.user_id).includes(q) &&
        !(b.student_name || "").toLowerCase().includes(q) &&
        !b.notes.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <SectionHeader
          title="Counselling Requests"
          breadcrumbItems={[
            { label: "Dashboard" },
            {
              label: "Counselling",
              href: "/institution-zone/dashboard/counselling",
            },
            { label: "Requests" },
          ]}
        />
        <button
          onClick={() => setShowSlotModal(true)}
          className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <CalendarPlus className="mr-2" size={18} /> Schedule Session
        </button>
      </div>

      {actionError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
          <X size={16} className="flex-shrink-0" />
          {actionError}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
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
            <ChatsCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No counselling requests found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((b) => (
              <div key={b.id} className="px-6 py-5 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                        {b.student_name
                          ? b.student_name.charAt(0).toUpperCase()
                          : b.user_id}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {b.student_name || `User #${b.user_id}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {b.student_phone} &middot; {b.student_email}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Session
                        </p>
                        <p className="font-medium text-gray-800">
                          {b.session?.title || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Program
                        </p>
                        <p className="font-medium text-gray-800">
                          {b.program_level || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Course
                        </p>
                        <p className="font-medium text-gray-800">
                          {b.interested_course || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Mode
                        </p>
                        <p className="font-medium text-gray-800">
                          {b.session_mode === "online" ? "Online" : "In Person"}
                        </p>
                      </div>
                      {b.session?.scheduled_at && (
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Date & Time
                          </p>
                          <p className="font-medium text-gray-800">
                            {new Date(
                              b.session.scheduled_at,
                            ).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                            &nbsp;
                            {new Date(
                              b.session.scheduled_at,
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}
                      {b.notes && (
                        <div className="col-span-2">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Notes
                          </p>
                          <p className="font-medium text-gray-800 truncate">
                            {b.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-medium ${
                        b.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : b.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : b.status === "completed"
                              ? "bg-blue-100 text-blue-700"
                              : b.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {b.status}
                    </span>
                    {b.status === "pending" && (
                      <div className="flex gap-1 mt-1">
                        <button
                          onClick={() => handleStatus(b.id, "confirmed")}
                          className="p-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                          title="Confirm"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleStatus(b.id, "cancelled")}
                          className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                          title="Reject"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSlotModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSlotModal(false);
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CalendarPlus className="text-blue-600" size={24} /> Schedule
                Session
              </h2>
              <button
                onClick={() => setShowSlotModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Booking Availability
                    </h3>
                    <p className="text-sm text-gray-500">
                      Control when students can book sessions.
                    </p>
                  </div>
                </div>

                <div className="p-6 flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/3">
                    <h4 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">
                      Add New Slot
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={slotTitle}
                          onChange={(e) => setSlotTitle(e.target.value)}
                          placeholder="e.g. Group Counselling"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={slotDate}
                          onChange={(e) => setSlotDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time
                        </label>
                        <input
                          type="time"
                          value={slotTime}
                          onChange={(e) => setSlotTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Students
                        </label>
                        <input
                          type="number"
                          value={slotCapacity}
                          onChange={(e) => setSlotCapacity(e.target.value)}
                          min={1}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddSlot}
                        disabled={slotSubmitting || !slotDate || !slotTime}
                        className="w-full bg-gray-800 text-white font-medium py-2 rounded-md hover:bg-gray-900 transition-colors shadow-sm text-sm disabled:opacity-50"
                      >
                        {slotSubmitting ? "Adding..." : "Add to Schedule"}
                      </button>
                    </div>
                  </div>

                  <div className="w-full md:w-2/3">
                    <h4 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">
                      Active Slots
                    </h4>
                    <div className="bg-gray-50 rounded-md border border-gray-200 p-2 h-64 overflow-y-auto">
                      {sessions.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">
                          No slots created yet.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {sessions.map((s) => (
                            <li
                              key={s.id}
                              className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded-md hover:border-gray-300 transition-colors"
                            >
                              <div className="flex items-center text-sm font-medium text-gray-700">
                                <div className="w-10 h-10 rounded bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center mr-3 leading-none">
                                  <span className="text-[10px] font-bold uppercase">
                                    {new Date(
                                      s.scheduled_at,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                    })}
                                  </span>
                                  <span className="text-sm font-black">
                                    {new Date(s.scheduled_at).getDate()}
                                  </span>
                                </div>
                                <div>
                                  <span className="block">
                                    {formatSlotDate(s)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatSlotTime(s)} &middot;{" "}
                                    {s.booked_seats}/{s.max_seats} booked
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteSlot(s.id)}
                                className="w-8 h-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                              >
                                <Trash size={16} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowSlotModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounsellingRequestsPage;
