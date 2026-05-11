"use client";
import React, { useEffect, useState } from "react";
import {
  MagnifyingGlass,
  CheckCircle,
  XCircle,
  Link as LinkIcon,
  Clock,
  Users,
  CalendarBlank,
  Plus,
  Trash,
  X,
  ChatsCircle,
} from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { apiService, InstitutionCounsellingBookingItem } from "@/services/api";

const breadcrumb = [
  { label: "Dashboard", href: "/institution-zone/dashboard" },
  { label: "Counselling" },
];

type RequestStatus = "pending" | "confirmed" | "cancelled" | "completed";

interface SlotItem {
  id: number;
  date: string;
  start: string;
  end: string;
  capacity: number;
  booked: number;
}

const DEFAULT_SLOTS: SlotItem[] = [
  { id: 1, date: "2024-03-20", start: "09:00", end: "12:00", capacity: 5, booked: 3 },
  { id: 2, date: "2024-03-22", start: "14:00", end: "17:00", capacity: 4, booked: 1 },
];

const statusColors: Record<RequestStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-gray-100 text-gray-700",
};

const CounsellingPage: React.FC = () => {
  const [tab, setTab] = useState<"requests" | "slots">("requests");
  const [bookings, setBookings] = useState<InstitutionCounsellingBookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [slots, setSlots] = useState(DEFAULT_SLOTS);

  /* filters */
  const [search, setSearch] = useState("");
  const [filterProgram, setFilterProgram] = useState("All");
  const [filterStatus, setFilterStatus] = useState<"All" | RequestStatus>("All");

  /* slot form */
  const [slotDate, setSlotDate] = useState("");
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const [slotCapacity, setSlotCapacity] = useState("5");

  /* meeting link modal */
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkTarget, setLinkTarget] = useState<number | null>(null);
  const [platform, setPlatform] = useState("Google Meet");
  const [meetUrl, setMeetUrl] = useState("");

  useEffect(() => {
    const loadCounsellingData = async () => {
      setIsLoading(true);
      setFetchError("");

      try {
        const bookingsResponse = await apiService.getInstitutionCounsellingBookings();
        setBookings(bookingsResponse.data || []);
      } catch (error) {
        setFetchError(error instanceof Error ? error.message : "Failed to load counselling data");
      } finally {
        setIsLoading(false);
      }
    };

    loadCounsellingData();
  }, []);

  const filtered = bookings.filter((booking) => {
    const title = booking.session?.title?.toLowerCase() || "";
    const notes = (booking.notes || "").toLowerCase();
    if (search && !title.includes(search.toLowerCase()) && !notes.includes(search.toLowerCase())) return false;
    if (filterProgram !== "All" && title !== filterProgram) return false;
    if (filterStatus !== "All" && booking.status !== filterStatus) return false;
    return true;
  });

  const programs = [
    "All",
    ...Array.from(new Set(bookings.map((booking) => booking.session?.title || "Untitled"))),
  ];

  const updateStatus = async (id: number, status: RequestStatus) => {
    try {
      await apiService.updateInstitutionBookingStatus(id, status);
      setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status } : booking)));
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

  const openLinkModal = (id: number) => { setLinkTarget(id); setMeetUrl(""); setShowLinkModal(true); };

  const provideLink = () => {
    if (linkTarget !== null) updateStatus(linkTarget, "confirmed");
    setShowLinkModal(false);
  };

  const addSlot = () => {
    if (!slotDate || !slotStart || !slotEnd) return;
    const newSlot: SlotItem = {
      id: Math.max(0, ...slots.map(s => s.id)) + 1,
      date: slotDate, start: slotStart, end: slotEnd,
      capacity: parseInt(slotCapacity) || 5, booked: 0,
    };
    setSlots(prev => [...prev, newSlot]);
    setSlotDate(""); setSlotStart(""); setSlotEnd(""); setSlotCapacity("5");
  };

  const totalStat = bookings.length;
  const pendingStat = bookings.filter((booking) => booking.status === "pending").length;
  const acceptedStat = bookings.filter((booking) => booking.status === "confirmed").length;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <SectionHeader title="Counselling Management" breadcrumbItems={breadcrumb} />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-md p-1 w-fit">
        {(["requests", "slots"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t === "requests" ? "Student Requests" : "Manage Slots"}
          </button>
        ))}
      </div>

      {tab === "requests" && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Requests", value: totalStat, icon: <Users className="w-5 h-5" />, color: "text-blue-600 bg-blue-50" },
              { label: "Pending", value: pendingStat, icon: <Clock className="w-5 h-5" />, color: "text-yellow-600 bg-yellow-50" },
              { label: "Accepted / Linked", value: acceptedStat, icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600 bg-green-50" },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${c.color}`}>{c.icon}</div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{c.label}</p>
                  <p className="text-xl font-bold text-gray-800">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search session or notes..." className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" />
              </div>
              <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:border-blue-600 outline-none">
                {programs.map(p => <option key={p}>{p}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)} className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:border-blue-600 outline-none">
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Booking", "Session", "Date", "Notes", "Status", "Actions"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-400 text-sm">No requests found.</td></tr>
                  ) : filtered.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-sm text-gray-600">#{booking.id}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{booking.session?.title || 'Untitled session'}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{booking.session?.scheduled_at ? new Date(booking.session.scheduled_at).toLocaleDateString() : '-'}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{booking.notes || '-'}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status as RequestStatus]}`}>{booking.status}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1.5 flex-wrap">
                          {booking.status === 'pending' && (
                            <button onClick={() => updateStatus(booking.id, 'confirmed')} className="h-8 px-3 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs font-medium flex items-center gap-1 transition-colors">
                              <CheckCircle className="w-3.5 h-3.5" /> Confirm
                            </button>
                          )}
                          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                            <button onClick={() => updateStatus(booking.id, 'cancelled')} className="h-8 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-xs font-medium flex items-center gap-1 transition-colors">
                              <XCircle className="w-3.5 h-3.5" /> Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "slots" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Create Slot Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4 h-fit">
            <h3 className="font-bold text-gray-800">Create New Slot</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" value={slotDate} onChange={e => setSlotDate(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input type="time" value={slotStart} onChange={e => setSlotStart(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input type="time" value={slotEnd} onChange={e => setSlotEnd(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
              <input type="number" min="1" max="50" value={slotCapacity} onChange={e => setSlotCapacity(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" />
            </div>
            <button onClick={addSlot} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Create Slot
            </button>
          </div>

          {/* Available Slots */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-bold text-gray-800">Current Availability</h3>
            {slots.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-gray-400 text-sm">
                No slots created yet.
              </div>
            ) : slots.map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <CalendarBlank className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{s.date}</p>
                    <p className="text-sm text-gray-500">{s.start} — {s.end}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">{s.booked}<span className="text-gray-400 font-normal text-sm">/{s.capacity}</span></p>
                  <p className="text-xs text-gray-400">Booked</p>
                </div>
                <div className="w-24">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${(s.booked / s.capacity) * 100}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">{s.capacity - s.booked} free</p>
                </div>
                <button onClick={() => setSlots(prev => prev.filter(x => x.id !== s.id))} className="text-gray-400 hover:text-red-500 p-1">
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meeting Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden m-4">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Provide Online Meeting Link</h3>
              <button onClick={() => setShowLinkModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-600 outline-none">
                  <option>Google Meet</option><option>Zoom</option><option>Microsoft Teams</option><option>Jitsi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting URL</label>
                <input value={meetUrl} onChange={e => setMeetUrl(e.target.value)} placeholder="https://meet.google.com/xxx" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => setShowLinkModal(false)} className="h-10 px-4 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={provideLink} className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" /> Send Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounsellingPage;
