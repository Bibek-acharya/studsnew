"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/services/AuthContext";
import { apiService } from "@/services/api";
import { useRouter } from "next/navigation";
import { X, Loader2, Calendar, Clock, CheckCircle } from "lucide-react";

interface CounsellingSession {
  id: number;
  title: string;
  description: string;
  scheduled_at: string;
  duration: number;
  max_seats: number;
  booked_seats: number;
  available_seats: number;
  status: string;
}

interface OpenCounsellingModalProps {
  isOpen: boolean;
  onClose: () => void;
  institutionId: number;
  collegeName: string;
}

const OpenCounsellingModal: React.FC<OpenCounsellingModalProps> = ({
  isOpen,
  onClose,
  institutionId,
  collegeName,
}) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [sessions, setSessions] = useState<CounsellingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<CounsellingSession | null>(null);

  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [programLevel, setProgramLevel] = useState("");
  const [interestedCourse, setInterestedCourse] = useState("");
  const [sessionMode, setSessionMode] = useState<"online" | "in_person">("in_person");
  const [studentNotes, setStudentNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setStudentName(`${user.first_name} ${user.last_name}`.trim());
      setStudentPhone(user.phone || "");
      setStudentEmail(user.email || "");
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setError("");
    setSelectedDate("");
    setSelectedSession(null);
    setSubmitError("");
    setIsConfirmed(false);

    apiService
      .getPublicCounsellingSessions(institutionId)
      .then((res: any) => {
        const data = res?.data || res || [];
        setSessions(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message || "Failed to load counselling sessions");
        setLoading(false);
      });
  }, [isOpen, institutionId]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, CounsellingSession[]> = {};
    sessions.forEach((session) => {
      const date = new Date(session.scheduled_at).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(session);
    });
    return groups;
  }, [sessions]);

  const dates = useMemo(() => Object.keys(groupedByDate).sort(), [groupedByDate]);

  const filteredSessions = useMemo(() => {
    if (!selectedDate) return [];
    return groupedByDate[selectedDate] || [];
  }, [groupedByDate, selectedDate]);

  const formatTime = (scheduledAt: string) => {
    const d = new Date(scheduledAt);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBook = async () => {
    if (!selectedSession || !studentName.trim() || !studentEmail.trim() || !studentPhone.trim()) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      await apiService.createPublicCounsellingBooking({
        session_id: selectedSession.id,
        program_level: programLevel || "Not specified",
        interested_course: interestedCourse || "Not specified",
        session_mode: sessionMode,
        student_name: studentName,
        student_phone: studentPhone,
        student_email: studentEmail,
        student_notes: studentNotes,
      });

      setIsConfirmed(true);
      setSubmitting(false);

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to book counselling session");
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Book Counselling</h2>
            <p className="text-sm text-gray-500">{collegeName}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!isAuthenticated ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Please log in to book a counselling session.</p>
              <button
                onClick={() => router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)}
                className="rounded-md bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
              >
                Log In
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={() => { setLoading(true); setError(""); apiService.getPublicCounsellingSessions(institutionId).then((res: any) => { setSessions(res?.data || res || []); setLoading(false); }).catch((e: Error) => { setError(e.message); setLoading(false); }); }}
                className="text-sm text-brand-blue hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : isConfirmed ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Booking Confirmed!</h3>
              <p className="text-sm text-gray-500">Your counselling session has been booked successfully.</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No counselling sessions available at the moment.</p>
              <p className="text-sm text-gray-400 mt-1">Please check back later.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Step 1: Select Date */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Select Date <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {dates.map((date) => (
                    <button
                      key={date}
                      onClick={() => { setSelectedDate(date); setSelectedSession(null); }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                        selectedDate === date
                          ? "bg-brand-blue text-white border-brand-blue"
                          : "bg-white text-gray-700 border-gray-200 hover:border-brand-blue"
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Time Slot */}
              {selectedDate && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Select Time Slot <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {filteredSessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => setSelectedSession(session)}
                        disabled={session.available_seats <= 0}
                        className={`flex flex-col items-center p-3 rounded-lg border text-sm transition ${
                          selectedSession?.id === session.id
                            ? "bg-brand-blue text-white border-brand-blue"
                            : session.available_seats > 0
                              ? "bg-white text-gray-700 border-gray-200 hover:border-brand-blue"
                              : "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                        }`}
                      >
                        <Clock className="h-4 w-4 mb-1" />
                        <span className="font-semibold">{formatTime(session.scheduled_at)}</span>
                        <span className="text-xs mt-0.5 opacity-75">
                          {session.available_seats > 0
                            ? `${session.available_seats} seat${session.available_seats > 1 ? "s" : ""} left`
                            : "Full"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Fill Details */}
              {selectedSession && (
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <label className="text-sm font-semibold text-gray-700 block">
                    Your Details
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name *</label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Phone *</label>
                      <input
                        type="tel"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Email *</label>
                      <input
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Program Level</label>
                      <select
                        value={programLevel}
                        onChange={(e) => setProgramLevel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm bg-white"
                      >
                        <option value="">Select</option>
                        <option value="+2">+2</option>
                        <option value="Bachelor">Bachelor</option>
                        <option value="Master">Master</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Interested Course</label>
                      <input
                        type="text"
                        value={interestedCourse}
                        onChange={(e) => setInterestedCourse(e.target.value)}
                        placeholder="e.g., Computer Science"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Session Mode</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSessionMode("in_person")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                          sessionMode === "in_person"
                            ? "bg-brand-blue text-white border-brand-blue"
                            : "bg-white text-gray-700 border-gray-200"
                        }`}
                      >
                        In Person
                      </button>
                      <button
                        onClick={() => setSessionMode("online")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                          sessionMode === "online"
                            ? "bg-brand-blue text-white border-brand-blue"
                            : "bg-white text-gray-700 border-gray-200"
                        }`}
                      >
                        Online
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Notes (Optional)</label>
                    <textarea
                      value={studentNotes}
                      onChange={(e) => setStudentNotes(e.target.value)}
                      rows={3}
                      placeholder="Any questions or special requirements?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm resize-none"
                    />
                  </div>

                  {submitError && (
                    <p className="text-sm text-red-500">{submitError}</p>
                  )}

                  <button
                    onClick={handleBook}
                    disabled={submitting}
                    className="w-full rounded-md bg-brand-blue px-6 py-3 text-sm font-bold text-white hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {submitting ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenCounsellingModal;
