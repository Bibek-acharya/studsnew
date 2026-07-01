"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiService, CounsellingBookingItem } from "@/services/api";

export default function CounsellingSection() {
  const router = useRouter();
  const [counsellingTab, setCounsellingTab] = useState("upcoming");
  const [bookings, setBookings] = useState<CounsellingBookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true);
      setFetchError("");
      try {
        const response = await apiService.getMyCounsellingBookings();
        setBookings(response.data.bookings || []);
      } catch (error) {
        setFetchError(
          error instanceof Error
            ? error.message
            : "Failed to load counselling bookings",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  const upcomingSessions = bookings.filter((booking) => {
    const status = booking.status.toLowerCase();
    return status !== "completed" && status !== "cancelled";
  });

  const pastSessions = bookings.filter((booking) => {
    const status = booking.status.toLowerCase();
    return status === "completed" || status === "cancelled";
  });

  return (
    <div>
      <div className="flex gap-1 bg-slate-100 p-1 rounded-md mb-6 w-fit">
        {["Upcoming Sessions", "Past Sessions"].map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setCounsellingTab(idx === 0 ? "upcoming" : "past")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              counsellingTab === (idx === 0 ? "upcoming" : "past")
                ? "bg-white text-primary"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {counsellingTab === "upcoming" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full rounded-md border border-slate-200 bg-white p-8 text-center text-slate-500">
              Loading counselling bookings...
            </div>
          ) : upcomingSessions.length === 0 ? (
            <div className="col-span-full rounded-md border border-slate-200 bg-white p-8 text-center text-slate-500">
              No upcoming counselling sessions found.
            </div>
          ) : (
            upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-md border border-slate-200 p-5  hover: transition-all flex flex-col justify-between h-full relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {session.college}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {session.program_level}
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    {session.status}
                  </span>
                </div>
                <div className="mb-5 relative z-10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Session
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {session.interested_course}
                  </p>
                  <p className="text-xs text-slate-500">
                    {session.session_mode === "online" ? "Online" : "In person"}
                  </p>
                </div>
                <div className="mb-3 relative z-10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Student
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {session.student_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {session.student_phone} &middot; {session.student_email}
                  </p>
                </div>
                <div className="mb-3 relative z-10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Date & Time
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {session.session_date}
                  </p>
                  <p className="text-xs text-slate-500">
                    {session.session_time}
                  </p>
                </div>
                <div className="truncate text-sm text-slate-500 mb-4">
                  {session.student_notes || "No additional notes provided."}
                </div>
                <button
                  onClick={() => router.push("/counseling")}
                  className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 relative z-10"
                >
                  <i className="fas fa-calendar-day"></i> View Booking
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {counsellingTab === "past" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full rounded-md border border-slate-200 bg-white p-8 text-center text-slate-500">
              Loading past sessions...
            </div>
          ) : pastSessions.length === 0 ? (
            <div className="col-span-full rounded-md border border-slate-200 bg-white p-8 text-center text-slate-500">
              No past sessions available.
            </div>
          ) : (
            pastSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-md border border-slate-200 p-5  hover: transition-all flex flex-col justify-between h-full relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {session.college}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {session.program_level}
                    </p>
                  </div>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    {session.status}
                  </span>
                </div>
                <div className="mb-5 relative z-10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Session
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {session.interested_course}
                  </p>
                  <p className="text-xs text-slate-500">
                    {session.session_mode === "online" ? "Online" : "In person"}
                  </p>
                </div>
                <div className="mb-3 relative z-10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Student
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {session.student_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {session.student_phone} &middot; {session.student_email}
                  </p>
                </div>
                <div className="mb-3 relative z-10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Date & Time
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {session.session_date}
                  </p>
                  <p className="text-xs text-slate-500">
                    {session.session_time}
                  </p>
                </div>
                <div className="truncate text-sm text-slate-500 mb-4">
                  {session.student_notes || "No additional notes provided."}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
