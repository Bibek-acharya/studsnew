"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/services/AuthContext";
import { apiService, College } from "@/services/api";

interface BookCounsellingPageProps {
  onNavigate?: (view: any, data?: any) => void;
}

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

const BookCounsellingPage: React.FC<BookCounsellingPageProps> = () => {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();

  const [collegeInput, setCollegeInput] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(
    null,
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [colleges, setColleges] = useState<College[]>([]);
  const [collegesLoading, setCollegesLoading] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);

  const [sessions, setSessions] = useState<CounsellingSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] =
    useState<CounsellingSession | null>(null);

  const [program, setProgram] = useState("");
  const [course, setCourse] = useState("");
  const [isOnline, setIsOnline] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("+977-");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentNotes, setStudentNotes] = useState("");

  const [isBooking, setIsBooking] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Pre-fill college from URL params and load sessions
  useEffect(() => {
    const name = searchParams.get("collegeName");
    const id = searchParams.get("collegeId");
    if (name) {
      setCollegeInput(name);
      if (id) {
        const parsed = Number(id);
        setSelectedCollegeId(parsed);
        fetchSessions(parsed);
      }
    }
  }, [searchParams]);

  const fetchSessions = async (institutionId: number) => {
    setSessionsLoading(true);
    try {
      const res = await apiService.getPublicCounsellingSessions(institutionId);
      const data = res?.data || res || [];
      setSessions(Array.isArray(data) ? data : []);
    } catch {
      setSessions([]);
    }
    setSessionsLoading(false);
  };

  // Fetch colleges with debounce
  const fetchColleges = useCallback(async (query: string) => {
    if (!query.trim()) {
      setColleges([]);
      return;
    }
    setCollegesLoading(true);
    try {
      const [collegeRes, instRes] = await Promise.all([
        apiService.getColleges({ search: query, limit: 10, page: 1 }),
        apiService.getPublicInstitutions({ search: query, limit: 10 }),
      ]);

      const tableColleges = (collegeRes as any)?.data?.colleges || [];

      const instColleges = ((instRes as any)?.data?.institutions || [])
        .map((inst: any) => ({
          id: inst.id,
          name: inst.institution_name,
          location: inst.district || "",
          type: inst.type || inst.institution_type || "College",
        }));

      const claimedCollegeIds = new Set(
        ((instRes as any)?.data?.institutions || [])
          .filter((inst: any) => inst.college_id > 0)
          .map((inst: any) => inst.college_id),
      );

      const unclaimed = tableColleges.filter((c: any) => !claimedCollegeIds.has(c.id));

      setColleges([...instColleges, ...unclaimed] as College[]);
    } catch {
      setColleges([]);
    }
    setCollegesLoading(false);
  }, []);

  const handleInputChange = (value: string) => {
    setCollegeInput(value);
    setSelectedCollegeId(null);
    setSessions([]);
    setSelectedDate(null);
    setSelectedSession(null);
    setShowSuggestions(true);
    setHighlightedIdx(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchColleges(value), 250);
  };

  const selectCollege = (college: College) => {
    setCollegeInput(college.name);
    setSelectedCollegeId(college.id);
    setShowSuggestions(false);
    setHighlightedIdx(-1);
    fetchSessions(college.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || colleges.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIdx((prev) =>
          prev < colleges.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIdx((prev) =>
          prev > 0 ? prev - 1 : colleges.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIdx >= 0 && highlightedIdx < colleges.length)
          selectCollege(colleges[highlightedIdx]);
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIdx(-1);
        break;
    }
  };

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Sessions grouped by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, CounsellingSession[]> = {};
    sessions.forEach((session) => {
      const d = new Date(session.scheduled_at);
      const key = d.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      if (!groups[key]) groups[key] = [];
      groups[key].push(session);
    });
    return groups;
  }, [sessions]);

  const dates = useMemo(
    () => Object.keys(groupedByDate).sort(),
    [groupedByDate],
  );

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

  const hasInstitutionSessions = selectedCollegeId && sessions.length > 0;
  const showFreeForm = selectedCollegeId === null;
  const noActiveSessions =
    selectedCollegeId !== null && !sessionsLoading && sessions.length === 0;

  const isFormValid = hasInstitutionSessions
    ? !!collegeInput &&
      !!selectedSession &&
      !!studentName.trim() &&
      !!studentEmail.trim() &&
      !!studentPhone.trim() &&
      studentPhone.trim().length > 6
    : showFreeForm
      ? !!collegeInput &&
        !!program &&
        !!course &&
        !!selectedDate &&
        !!selectedSession &&
        !!studentName.trim() &&
        !!studentEmail.trim() &&
        !!studentPhone.trim() &&
        studentPhone.trim().length > 6
      : false;

  const handleConfirmBooking = async () => {
    if (!isFormValid || isBooking) return;
    if (!isAuthenticated) {
      setSubmitError("Please login to book counselling.");
      return;
    }

    setSubmitError("");
    setIsBooking(true);

    try {
      if (hasInstitutionSessions && selectedSession) {
        await apiService.createPublicCounsellingBooking({
          session_id: selectedSession.id,
          program_level: program || "Not specified",
          interested_course: course || "Not specified",
          session_mode: isOnline ? "online" : "in_person",
          student_name: studentName,
          student_phone: studentPhone,
          student_email: studentEmail,
          student_notes: studentNotes,
        });
      } else {
        await apiService.createCounsellingBooking("", {
          college: collegeInput,
          program_level: program,
          interested_course: course,
          session_mode: isOnline ? "online" : "in_person",
          session_date: selectedDate || "",
          session_time: selectedSession?.scheduled_at || "",
          student_name: studentName,
          student_phone: studentPhone,
          student_email: studentEmail,
          student_notes: studentNotes,
        });
      }

      setIsBooking(false);
      setIsConfirmed(true);
      setTimeout(() => {
        setIsConfirmed(false);
        window.alert(
          "Counseling session booked successfully! A confirmation email will be sent shortly.",
        );
      }, 3000);
    } catch (error) {
      setIsBooking(false);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to book counselling session",
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-gray-800 overflow-x-hidden pt-6">

      <div className="relative z-10 mx-auto max-w-350 py-8 md:py-12">
        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <div className="w-full overflow-hidden rounded-md border border-gray-100 bg-white lg:w-2/3">
            <div className="border-b border-gray-100 p-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Book Counseling Session
              </h1>
            </div>

            <div className="space-y-8 p-6">
              {/* College Select */}
              <div className="space-y-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                  Select College
                </h2>
                <div className="relative">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    College <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search and select your college..."
                      value={collegeInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onFocus={() => {
                        if (colleges.length > 0 || collegeInput.trim())
                          setShowSuggestions(true);
                      }}
                      onKeyDown={handleKeyDown}
                      className="w-full rounded-md border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {collegesLoading && (
                      <i className="fa-solid fa-spinner animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
                    )}
                  </div>
                  {showSuggestions && (
                    <div
                      ref={suggestionRef}
                      className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-56 overflow-y-auto"
                    >
                      {colleges.length === 0 &&
                        !collegesLoading &&
                        collegeInput.trim() && (
                          <div className="px-4 py-3 text-sm text-gray-400">
                            No colleges found.
                          </div>
                        )}
                      {colleges.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectCollege(item);
                          }}
                          onMouseEnter={() => setHighlightedIdx(idx)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                            idx === highlightedIdx
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <i className="fa-solid fa-building-columns text-gray-300 w-4"></i>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{item.name}</p>
                            {item.location && (
                              <p className="text-xs text-gray-400 truncate">
                                {item.location}
                              </p>
                            )}
                          </div>
                          {selectedCollegeId === item.id && (
                            <i className="fa-solid fa-check text-blue-500"></i>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Institution Sessions */}
              {selectedCollegeId && (
                <div className="space-y-5">
                  <hr className="border-gray-100" />
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                    Available Sessions <span className="text-red-500">*</span>
                  </h2>

                  {sessionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <i className="fa-solid fa-spinner animate-spin text-gray-400 text-lg"></i>
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                      <p className="font-medium">
                        No active sessions available
                      </p>
                      <p className="mt-1 text-yellow-700">
                        This college does not have any counselling sessions
                        available for booking at the moment. Please check back
                        later.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Date Selection */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Select Date
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {dates.map((date) => (
                            <button
                              key={date}
                              onClick={() => {
                                setSelectedDate(date);
                                setSelectedSession(null);
                              }}
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

                      {/* Time Slot Selection */}
                      {selectedDate && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Select Time Slot
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
                                <span className="font-semibold">
                                  {formatTime(session.scheduled_at)}
                                </span>
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
                    </>
                  )}
                </div>
              )}

              {/* Free-form booking fields (shown only when no college selected) */}
              {showFreeForm && (
                <>
                  <hr className="border-gray-100" />
                  <div className="space-y-5">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                      Academic Details
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="relative">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Program Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={program}
                          onChange={(e) => setProgram(e.target.value)}
                          className="w-full appearance-none rounded-md border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="" disabled>
                            Select Program
                          </option>
                          <option value="Undergraduate">
                            Undergraduate (Bachelors)
                          </option>
                          <option value="Postgraduate">
                            Postgraduate (Masters)
                          </option>
                          <option value="Diploma">Diploma / Certificate</option>
                        </select>
                        <i className="fa-solid fa-chevron-down absolute right-3 bottom-3.5 text-gray-400 pointer-events-none text-[12px]"></i>
                      </div>
                      <div className="relative">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Interested Course{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={course}
                          onChange={(e) => setCourse(e.target.value)}
                          className="w-full appearance-none rounded-md border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="" disabled>
                            Select Course
                          </option>
                          <option value="Computer Science & IT">
                            Computer Science & IT
                          </option>
                          <option value="Business Administration">
                            Business Administration
                          </option>
                          <option value="Engineering">Engineering</option>
                          <option value="Arts & Humanities">
                            Arts & Humanities
                          </option>
                          <option value="Medicine & Health">
                            Medicine & Health
                          </option>
                        </select>
                        <i className="fa-solid fa-chevron-down absolute right-3 bottom-3.5 text-gray-400 pointer-events-none text-[12px]"></i>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate || ""}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        value={
                          selectedSession?.scheduled_at
                            ? formatTime(selectedSession.scheduled_at)
                            : ""
                        }
                        onChange={(e) =>
                          setSelectedSession({
                            id: 0,
                            scheduled_at: e.target.value,
                          } as any)
                        }
                        className="w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* When institution sessions available, show program/course after session selection */}
              {hasInstitutionSessions && selectedSession && (
                <>
                  <hr className="border-gray-100" />
                  <div className="space-y-5">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                      Your Details
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="relative">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Program Level
                        </label>
                        <select
                          value={program}
                          onChange={(e) => setProgram(e.target.value)}
                          className="w-full appearance-none rounded-md border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="+2">+2</option>
                          <option value="Bachelor">Bachelor</option>
                          <option value="Master">Master</option>
                          <option value="PhD">PhD</option>
                        </select>
                      </div>
                      <div className="relative">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Interested Course
                        </label>
                        <input
                          type="text"
                          value={course}
                          onChange={(e) => setCourse(e.target.value)}
                          placeholder="e.g. Computer Science"
                          className="w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <hr className="border-gray-100" />

              {/* Session Mode Toggle */}
              <div
                className={`flex items-start gap-4 rounded-md border transition-all p-4 cursor-pointer ${isOnline ? "border-purple-200 bg-purple-50/50" : "border-blue-100 bg-blue-50/50"}`}
                onClick={() => setIsOnline(!isOnline)}
              >
                <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isOnline}
                    onChange={(e) => setIsOnline(e.target.checked)}
                    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-[#0000FF] focus:ring-[#0000FF]"
                  />
                </div>
                <div>
                  <label className="cursor-pointer font-medium text-gray-900">
                    Request Online Session
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Conduct the counseling session via Google Meet/Zoom instead
                    of in-person.
                  </p>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Student Details */}
              <div className="space-y-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                  Student Details
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <i className="fa-regular fa-user absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full rounded-md border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0000FF] transition-all focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <i className="fa-solid fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
                      <input
                        type="tel"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="e.g. +977-98XXXXXXXX"
                        className="w-full rounded-md border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0000FF] transition-all focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <i className="fa-regular fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
                      <input
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="e.g. student@college.edu"
                        className="w-full rounded-md border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0000FF] transition-all focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Notes
                    </label>
                    <div className="relative">
                      <i className="fa-regular fa-file-lines absolute left-3 top-3 text-sm text-gray-400"></i>
                      <textarea
                        rows={3}
                        value={studentNotes}
                        onChange={(e) => setStudentNotes(e.target.value)}
                        placeholder="Any specific notes or questions for the counselor? (Optional)"
                        className="w-full resize-none rounded-md border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0000FF] transition-all focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="sticky top-28 w-full space-y-6 lg:w-1/3">
            <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
              <div className="border-b border-gray-100 bg-gray-50/50 p-5">
                <h2 className="font-bold text-gray-900">Booking Details</h2>
              </div>
              <div className="space-y-4 p-5">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="text-sm">
                      <p className="mb-0.5 text-gray-500">College</p>
                      <p className="font-medium text-gray-800">
                        {collegeInput || "Not selected"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.focus()}
                      className="text-xs font-medium text-[#0000FF] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  {selectedSession && hasInstitutionSessions && (
                    <div className="flex items-start justify-between">
                      <div className="text-sm">
                        <p className="mb-0.5 text-gray-500">Session</p>
                        <p className="font-medium text-gray-800">
                          {selectedSession.title} &middot;{" "}
                          {formatTime(selectedSession.scheduled_at)}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div className="text-sm">
                      <p className="mb-0.5 text-gray-500">Session Mode</p>
                      <span
                        className={`mt-1 inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${isOnline ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}
                      >
                        <i
                          className={`fa-solid ${isOnline ? "fa-video" : "fa-circle-check"} text-[10px]`}
                        ></i>
                        {isOnline ? "Online Session" : "In-Person"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    disabled={!isFormValid || isBooking || isConfirmed}
                    onClick={handleConfirmBooking}
                    className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-3.5 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      isConfirmed
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-brand-blue hover:bg-[#0000CC]"
                    }`}
                  >
                    {isBooking ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>{" "}
                        Booking...
                      </>
                    ) : isConfirmed ? (
                      <>
                        <i className="fa-solid fa-check"></i> Booking Confirmed!
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                  {submitError ? (
                    <p className="mt-2 text-center text-xs text-red-500 font-medium">
                      {submitError}
                    </p>
                  ) : !isFormValid ? (
                    <p className="mt-2 text-center text-xs text-gray-400 italic">
                      Please complete all required fields.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-md border border-gray-100 bg-white p-5">
              <div className="mt-1 flex-shrink-0 rounded-full bg-blue-50 p-2">
                <i className="fa-solid fa-headset text-[#0000FF]"></i>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  We can help you
                </h3>
                <p className="mb-3 mt-1 text-xs leading-relaxed text-gray-500">
                  Call us +977-9712006863 or chat with our student support team
                  for guidance.
                </p>
                <a
                  href="/contact-us"
                  className="inline-block rounded border border-[#0000FF] px-3 py-1.5 text-xs font-medium text-[#0000FF] transition-colors hover:bg-blue-50"
                >
                  Chat with us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCounsellingPage;
