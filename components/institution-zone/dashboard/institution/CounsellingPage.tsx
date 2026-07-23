"use client";
import React, { useEffect, useState, useCallback } from "react";
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
  Pencil,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import {
  apiService,
  InstitutionCounsellingBookingItem,
  PaginationMeta,
} from "@/services/api";
import {
  institutionCounsellingApi,
  CounsellingSession,
} from "@/services/institutionCounsellingApi";

const breadcrumb = [
  { label: "Dashboard", href: "/institution-zone/dashboard" },
  { label: "Counselling" },
];

type RequestStatus = "pending" | "confirmed" | "cancelled" | "completed";
type SlotCategory = "upcoming" | "ongoing" | "completed" | "cancelled";

interface SlotItem {
  id: number;
  sessionId: number;
  date: string;
  start: string;
  end: string;
  capacity: number;
  booked: number;
  title: string;
  description: string;
  actualStatus: SlotCategory;
  scheduledAt: string;
  duration: number;
}

const statusColors: Record<RequestStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-gray-100 text-gray-700",
};

const slotCategoryLabels: Record<SlotCategory, string> = {
  upcoming: "Upcoming Sessions",
  ongoing: "Ongoing Sessions",
  completed: "Completed Sessions",
  cancelled: "Cancelled",
};

const slotCategoryColors: Record<SlotCategory, string> = {
  upcoming: "bg-blue-50 text-blue-700",
  ongoing: "bg-green-50 text-green-700",
  completed: "bg-gray-50 text-gray-500",
  cancelled: "bg-red-50 text-red-500",
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function computeEnd(startIso: string, durationMin: number): string {
  const d = new Date(startIso);
  d.setMinutes(d.getMinutes() + durationMin);
  return d.toTimeString().slice(0, 5);
}

const CounsellingPage: React.FC = () => {
  const [tab, setTab] = useState<"requests" | "slots">("requests");
  const [bookings, setBookings] = useState<InstitutionCounsellingBookingItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);

  /* filters */
  const [search, setSearch] = useState("");
  const [filterProgram, setFilterProgram] = useState("All");
  const [filterStatus, setFilterStatus] = useState<"All" | RequestStatus>(
    "All",
  );

  /* pagination */
  const [page, setPage] = useState(1);
  const [pageMeta, setPageMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 20,
  });
  const pageSize = 20;

  /* slot form */
  const [editSlotId, setEditSlotId] = useState<number | null>(null);
  const [slotDate, setSlotDate] = useState("");
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const [slotCapacity, setSlotCapacity] = useState("5");
  const [slotTitle, setSlotTitle] = useState("");
  const [slotDesc, setSlotDesc] = useState("");
  const [slotSubmitting, setSlotSubmitting] = useState(false);

  /* meeting link modal */
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkTarget, setLinkTarget] = useState<number | null>(null);
  const [platform, setPlatform] = useState("Google Meet");
  const [meetUrl, setMeetUrl] = useState("");

  /* detail modal */
  const [detailBooking, setDetailBooking] =
    useState<InstitutionCounsellingBookingItem | null>(null);

  /* delete confirm */
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const loadCounsellingData = useCallback(async () => {
    setIsLoading(true);
    setFetchError("");

    try {
      const [bookingsRes, sessionsRes] = await Promise.all([
        apiService.getInstitutionCounsellingBookings(page, pageSize),
        institutionCounsellingApi.getSessions(1, 100),
      ]);
      setBookings(bookingsRes.data?.bookings || []);
      setPageMeta(bookingsRes.data?.meta || { total: 0, page: 1, limit: 20 });

      const mapped: SlotItem[] = (sessionsRes.sessions || []).map(
        (s: CounsellingSession) => ({
          id: s.id,
          sessionId: s.id,
          date: formatDate(s.scheduled_at),
          start: formatTime(s.scheduled_at),
          end: computeEnd(s.scheduled_at, s.duration),
          capacity: s.max_seats,
          booked: s.booked_seats,
          title: s.title,
          description: s.description || "",
          actualStatus: (s.actual_status || "upcoming") as SlotCategory,
          scheduledAt: s.scheduled_at,
          duration: s.duration,
        }),
      );
      setSlots(mapped);
    } catch (error) {
      setFetchError(
        error instanceof Error
          ? error.message
          : "Failed to load counselling data",
      );
      toast.error("Failed to load counselling data");
    } finally {
      setIsLoading(false);
      setSlotsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadCounsellingData();
  }, [loadCounsellingData]);

  const filtered = bookings.filter((booking) => {
    const title = booking.session?.title?.toLowerCase() || "";
    const notes = (booking.notes || "").toLowerCase();
    if (
      search &&
      !title.includes(search.toLowerCase()) &&
      !notes.includes(search.toLowerCase())
    )
      return false;
    if (filterProgram !== "All" && title !== filterProgram) return false;
    if (filterStatus !== "All" && booking.status !== filterStatus) return false;
    return true;
  });

  const programs = [
    "All",
    ...Array.from(
      new Set(bookings.map((booking) => booking.session?.title || "Untitled")),
    ),
  ];

  const updateStatus = async (
    id: number,
    status: RequestStatus,
    meetingLink?: string,
    meetingPlatform?: string,
  ) => {
    try {
      await apiService.updateInstitutionBookingStatus(
        id,
        status,
        meetingLink,
        meetingPlatform,
      );
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status,
                meeting_link: meetingLink || booking.meeting_link,
                meeting_platform: meetingPlatform || booking.meeting_platform,
              }
            : booking,
        ),
      );
      toast.success(
        status === "confirmed"
          ? "Booking confirmed"
          : status === "cancelled"
            ? "Booking cancelled"
            : "Status updated",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status",
      );
    }
  };

  const openLinkModal = (id: number) => {
    setLinkTarget(id);
    setMeetUrl("");
    setPlatform("Google Meet");
    setShowLinkModal(true);
  };

  const provideLink = () => {
    if (linkTarget === null) return;
    updateStatus(linkTarget, "confirmed", meetUrl || undefined, platform);
    setShowLinkModal(false);
  };

  const resetSlotForm = () => {
    setEditSlotId(null);
    setSlotDate("");
    setSlotStart("");
    setSlotEnd("");
    setSlotCapacity("5");
    setSlotTitle("");
    setSlotDesc("");
  };

  const openEditSlot = (slot: SlotItem) => {
    setEditSlotId(slot.sessionId);
    setSlotDate(slot.scheduledAt.slice(0, 10));
    setSlotStart(slot.start);
    setSlotEnd(slot.end);
    setSlotCapacity(String(slot.capacity));
    setSlotTitle(slot.title);
    setSlotDesc(slot.description);
  };

  const saveSlot = async () => {
    if (!slotDate || !slotStart || !slotEnd) return;
    setSlotSubmitting(true);
    try {
      const startMinutes =
        parseInt(slotStart.split(":")[0]) * 60 +
        parseInt(slotStart.split(":")[1]);
      const endMinutes =
        parseInt(slotEnd.split(":")[0]) * 60 + parseInt(slotEnd.split(":")[1]);
      const duration =
        endMinutes > startMinutes ? endMinutes - startMinutes : 60;

      if (editSlotId !== null) {
        await institutionCounsellingApi.updateSession(editSlotId, {
          title: slotTitle || "Counselling Session",
          description: slotDesc,
          scheduled_at: `${slotDate}T${slotStart}`,
          duration,
          max_seats: parseInt(slotCapacity) || 10,
        });
        toast.success("Session updated");
      } else {
        await institutionCounsellingApi.createSession({
          title: slotTitle || "Counselling Session",
          description: slotDesc,
          scheduled_at: `${slotDate}T${slotStart}`,
          duration,
          max_seats: parseInt(slotCapacity) || 10,
        });
        toast.success("Session created");
      }
      resetSlotForm();
      loadCounsellingData();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${editSlotId ? "update" : "create"} session`,
      );
    }
    setSlotSubmitting(false);
  };

  const handleDeleteSlot = async (id: number) => {
    try {
      await institutionCounsellingApi.deleteSession(id);
      setSlots((prev) => prev.filter((s) => s.id !== id));
      toast.success("Session deleted");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete session",
      );
    }
  };

  const totalStat = bookings.length;
  const pendingStat = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;
  const acceptedStat = bookings.filter(
    (booking) => booking.status === "confirmed",
  ).length;

  const totalPages = Math.ceil(pageMeta.total / pageSize);

  const categorizedSlots = {
    upcoming: slots.filter((s) => s.actualStatus === "upcoming"),
    ongoing: slots.filter((s) => s.actualStatus === "ongoing"),
    completed: slots.filter(
      (s) => s.actualStatus === "completed" || s.actualStatus === "cancelled",
    ),
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <SectionHeader
        title="Counselling Management"
        breadcrumbItems={breadcrumb}
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-md p-1 w-fit">
        {(["requests", "slots"] as const).map((t) => (
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
              {
                label: "Total Requests",
                value: totalStat,
                icon: <Users className="w-5 h-5" />,
                color: "text-blue-600 bg-blue-50",
              },
              {
                label: "Pending",
                value: pendingStat,
                icon: <Clock className="w-5 h-5" />,
                color: "text-yellow-600 bg-yellow-50",
              },
              {
                label: "Accepted",
                value: acceptedStat,
                icon: <CheckCircle className="w-5 h-5" />,
                color: "text-green-600 bg-green-50",
              },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-white rounded-xl p-5 border border-gray-100 flex items-center gap-3"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${c.color}`}
                >
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{c.label}</p>
                  <p className="text-xl font-bold text-gray-800">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search session or notes..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                />
              </div>
              <select
                value={filterProgram}
                onChange={(e) => setFilterProgram(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:border-blue-600 outline-none"
              >
                {programs.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as typeof filterStatus)
                }
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:border-blue-600 outline-none"
              >
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
                    {[
                      "Student",
                      "Session",
                      "Date",
                      "Notes",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-8 text-center text-gray-400 text-sm"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-8 text-center text-gray-400 text-sm"
                      >
                        No requests found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3 text-sm text-gray-600 font-medium">
                          {booking.student_name || `User #${booking.user_id}`}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                          {booking.session?.title || "Untitled session"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                          {booking.session?.scheduled_at
                            ? formatDate(booking.session.scheduled_at)
                            : "-"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                          {booking.notes || "-"}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status as RequestStatus] || "bg-gray-100 text-gray-700"}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-1.5 flex-wrap">
                            <button
                              onClick={() => setDetailBooking(booking)}
                              className="h-8 px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-md text-xs font-medium flex items-center gap-1 transition-colors"
                            >
                              View Details
                            </button>
                            {booking.status === "pending" && (
                              <>
                                {booking.session_mode === "online" ? (
                                  <button
                                    onClick={() => openLinkModal(booking.id)}
                                    className="h-8 px-3 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs font-medium flex items-center gap-1 transition-colors"
                                  >
                                    <LinkIcon className="w-3.5 h-3.5" /> Confirm
                                    & Link
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      updateStatus(booking.id, "confirmed")
                                    }
                                    className="h-8 px-3 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs font-medium flex items-center gap-1 transition-colors"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />{" "}
                                    Confirm
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    updateStatus(booking.id, "cancelled")
                                  }
                                  className="h-8 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-xs font-medium flex items-center gap-1 transition-colors"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                <span className="text-sm text-gray-500">
                  Page {pageMeta.page} of {totalPages} ({pageMeta.total} total)
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const start = Math.max(
                      1,
                      Math.min(page - 2, totalPages - 4),
                    );
                    const p = start + i;
                    if (p > totalPages) return null;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1.5 text-sm border border-gray-300 rounded-md ${p === page ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {tab === "slots" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Slot Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 space-y-4 h-fit">
            <h3 className="font-bold text-gray-800">
              {editSlotId !== null ? "Edit Session" : "Create New Session"}
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={slotTitle}
                onChange={(e) => setSlotTitle(e.target.value)}
                placeholder="Counselling Session"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={slotDesc}
                onChange={(e) => setSlotDesc(e.target.value)}
                placeholder="Session description..."
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none resize-none"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={slotStart}
                  onChange={(e) => setSlotStart(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={slotEnd}
                  onChange={(e) => setSlotEnd(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Capacity
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={slotCapacity}
                onChange={(e) => setSlotCapacity(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveSlot}
                disabled={slotSubmitting || !slotDate || !slotStart || !slotEnd}
                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />{" "}
                {slotSubmitting
                  ? "Saving..."
                  : editSlotId !== null
                    ? "Update Session"
                    : "Create Session"}
              </button>
              {editSlotId !== null && (
                <button
                  onClick={resetSlotForm}
                  className="h-11 px-4 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Slots List by Category */}
          <div className="lg:col-span-3 space-y-6">
            {(["upcoming", "ongoing", "completed"] as const).map((cat) => {
              const items = categorizedSlots[cat];
              if (items.length === 0) return null;
              return (
                <div key={cat}>
                  <h3
                    className={`font-bold text-sm px-1 mb-2 ${cat === "upcoming" ? "text-blue-700" : cat === "ongoing" ? "text-green-700" : "text-gray-500"}`}
                  >
                    {slotCategoryLabels[cat]} ({items.length})
                  </h3>
                  <div className="space-y-2">
                    {items.map((s) => (
                      <div
                        key={s.id}
                        className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cat === "upcoming" ? "bg-blue-50 text-blue-600" : cat === "ongoing" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}
                          >
                            <CalendarBlank className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 truncate">
                              {s.title || s.date}
                            </p>
                            <p className="text-xs text-gray-500">
                              {s.date} &middot; {s.start}&ndash;{s.end}
                            </p>
                            {s.description && (
                              <p className="text-xs text-gray-400 truncate mt-0.5">
                                {s.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-center flex-shrink-0">
                          <p className="text-lg font-bold text-gray-800">
                            {s.booked}
                            <span className="text-gray-400 font-normal text-sm">
                              /{s.capacity}
                            </span>
                          </p>
                          <p className="text-xs text-gray-400">Booked</p>
                        </div>
                        <div className="w-20 flex-shrink-0">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-2 bg-blue-500 rounded-full"
                              style={{
                                width: `${(s.booked / s.capacity) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1 text-right">
                            {s.capacity - s.booked} free
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {(cat === "upcoming" || cat === "ongoing") && (
                            <button
                              onClick={() => openEditSlot(s)}
                              className="text-gray-400 hover:text-blue-500 p-1.5 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteTarget(s.sessionId)}
                            className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {slots.length === 0 && !slotsLoading && (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
                No sessions created yet.
              </div>
            )}
            {slotsLoading && (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
                Loading sessions...
              </div>
            )}
          </div>
        </div>
      )}

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
              Are you sure you want to delete this session? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="h-10 px-4 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSlot(deleteTarget)}
                className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden m-4">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                Provide Online Meeting Link
              </h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-600 outline-none"
                >
                  <option>Google Meet</option>
                  <option>Zoom</option>
                  <option>Microsoft Teams</option>
                  <option>Jitsi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting URL
                </label>
                <input
                  value={meetUrl}
                  onChange={(e) => setMeetUrl(e.target.value)}
                  placeholder="https://meet.google.com/xxx"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="h-10 px-4 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={provideLink}
                  className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" /> Send Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {detailBooking && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setDetailBooking(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-xl overflow-hidden m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Booking Details</h3>
              <button
                onClick={() => setDetailBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Student Name
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {detailBooking.student_name ||
                      `User #${detailBooking.user_id}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </p>
                  <p className="text-sm text-gray-800">
                    {detailBooking.student_phone || "-"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Email
                  </p>
                  <p className="text-sm text-gray-800">
                    {detailBooking.student_email || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Session
                  </p>
                  <p className="text-sm text-gray-800">
                    {detailBooking.session?.title || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Session Date
                  </p>
                  <p className="text-sm text-gray-800">
                    {detailBooking.session?.scheduled_at
                      ? formatDate(detailBooking.session.scheduled_at)
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Status
                  </p>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${statusColors[detailBooking.status as RequestStatus] || "bg-gray-100 text-gray-700"}`}
                  >
                    {detailBooking.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Session Mode
                  </p>
                  <p className="text-sm text-gray-800 capitalize">
                    {detailBooking.session_mode || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Program Level
                  </p>
                  <p className="text-sm text-gray-800">
                    {detailBooking.program_level || "-"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Interested Course
                  </p>
                  <p className="text-sm text-gray-800">
                    {detailBooking.interested_course || "-"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Notes
                  </p>
                  <p className="text-sm text-gray-800">
                    {detailBooking.notes || "-"}
                  </p>
                </div>
                {detailBooking.meeting_link && (
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Meeting Link
                    </p>
                    <a
                      href={detailBooking.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {detailBooking.meeting_link}{" "}
                      {detailBooking.meeting_platform
                        ? `(${detailBooking.meeting_platform})`
                        : ""}
                    </a>
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
                <button
                  onClick={() => setDetailBooking(null)}
                  className="h-10 px-4 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50"
                >
                  Close
                </button>
                {detailBooking.status === "pending" && (
                  <>
                    {detailBooking.session_mode === "online" ? (
                      <button
                        onClick={() => {
                          openLinkModal(detailBooking.id);
                          setDetailBooking(null);
                        }}
                        className="h-10 px-5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
                      >
                        <LinkIcon className="w-4 h-4" /> Confirm & Link
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          updateStatus(detailBooking.id, "confirmed");
                          setDetailBooking(null);
                        }}
                        className="h-10 px-5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold"
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      onClick={() => {
                        updateStatus(detailBooking.id, "cancelled");
                        setDetailBooking(null);
                      }}
                      className="h-10 px-5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounsellingPage;
