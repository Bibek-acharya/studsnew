"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

interface BookCounsellingPageProps {
  onNavigate?: (view: any, data?: any) => void;
}

type DateSlot = {
  day: string;
  date: string;
  slots: string;
  available: boolean;
};

const mockColleges = [
  "KIST College",
  "Kathmandu University",
  "Tribhuvan University",
  "Pokhara University",
  "Patan Multiple Campus",
  "Islington College",
  "Softwarica College",
  "Deerwalk Institute of Technology",
  "NCIT College",
  "St. Xavier's College",
  "Global College of Management",
  "NAMI College",
  "Texas International College",
];

const dates: DateSlot[] = [
  { day: "MON", date: "06", slots: "2 Slots", available: true },
  { day: "TUE", date: "07", slots: "5 Slots", available: true },
  { day: "WED", date: "08", slots: "Booked", available: false },
  { day: "THR", date: "09", slots: "1 Slot", available: true },
  { day: "FRI", date: "10", slots: "3 Slots", available: true },
  { day: "SAT", date: "11", slots: "Closed", available: false },
];

const times = [
  "09:00 - 10:00 AM",
  "10:30 - 11:30 AM",
  "01:00 - 02:00 PM",
  "02:30 - 03:30 PM",
  "04:00 - 05:00 PM",
];

const BookCounsellingPage: React.FC<BookCounsellingPageProps> = ({ onNavigate }) => {
  const [collegeInput, setCollegeInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [program, setProgram] = useState("");
  const [course, setCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState<DateSlot | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("+977-");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentNotes, setStudentNotes] = useState("");

  const [isBooking, setIsBooking] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!suggestionRef.current?.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const filteredColleges = useMemo(() => {
    if (!collegeInput.trim()) return [];
    return mockColleges.filter((item) =>
      item.toLowerCase().includes(collegeInput.toLowerCase()),
    );
  }, [collegeInput]);

  const selectedDateText = selectedDate
    ? `${selectedDate.day}, ${selectedDate.date} Nov`
    : "";

  const summaryCourse =
    program && course ? `${program} in ${course}` : course || "Not selected";

  const summaryDateTime =
    selectedDate && selectedTime
      ? `${selectedTime}, ${selectedDateText} 2023`
      : selectedDate
        ? `${selectedDateText} 2023 (Select time)`
        : "Select a slot";

  const isFormValid =
    !!collegeInput &&
    !!program &&
    !!course &&
    !!selectedDate &&
    !!selectedTime &&
    !!studentName.trim() &&
    !!studentEmail.trim() &&
    !!studentPhone.trim() &&
    studentPhone.trim().length > 6;

  const handleConfirmBooking = async () => {
    if (!isFormValid || isBooking) return;

    setSubmitError("");
    setIsBooking(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
        error instanceof Error ? error.message : "Failed to book counselling session",
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-gray-800 overflow-x-hidden">
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-indigo-100/80 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-pink-100/80 blur-3xl" />
      <div className="absolute top-[40%] right-[8%] h-64 w-64 rounded-full bg-sky-100/80 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:w-2/3">
            <div className="border-b border-gray-100 p-6">
              <h1 className="text-2xl font-bold text-gray-900">Book Counseling Session</h1>
            </div>

            <div className="space-y-8 p-6">
              <div className="space-y-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Academic Details</h2>

                <div ref={suggestionRef} className="relative">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Select College <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="Search and select your college..."
                      value={collegeInput}
                      onChange={(event) => {
                        setCollegeInput(event.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {showSuggestions && filteredColleges.length > 0 && (
                      <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                        {filteredColleges.map((item) => (
                          <li key={item}>
                            <button
                              type="button"
                              className="w-full border-b border-gray-50 px-4 py-2 text-left text-sm text-gray-700 transition-colors last:border-none hover:bg-blue-50"
                              onMouseDown={(event) => {
                                event.preventDefault();
                                setCollegeInput(item);
                                setShowSuggestions(false);
                              }}
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Program Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={program}
                      onChange={(event) => setProgram(event.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>
                        Select Program
                      </option>
                      <option value="Undergraduate">Undergraduate (Bachelors)</option>
                      <option value="Postgraduate">Postgraduate (Masters)</option>
                      <option value="Diploma">Diploma / Certificate</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Interested Course <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={course}
                      onChange={(event) => setCourse(event.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>
                        Select Course
                      </option>
                      <option value="Computer Science & IT">Computer Science & IT</option>
                      <option value="Business Administration">Business Administration</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Arts & Humanities">Arts & Humanities</option>
                      <option value="Medicine & Health">Medicine & Health</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-5">
                <div className="flex items-end justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                    Select a Slot <span className="text-red-500">*</span>
                  </h2>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">November 2023</span>
                </div>

                <div>
                  <p className="mb-3 text-sm text-gray-600">Available Dates (Assigned by College)</p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {dates.map((item) => {
                      const isSelected = selectedDate?.date === item.date;
                      const isDisabled = !item.available;

                      return (
                        <button
                          key={`${item.day}-${item.date}`}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => setSelectedDate(item)}
                          className={`w-18 shrink-0 rounded-xl border p-3 transition-all ${
                            isDisabled
                              ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-60"
                              : isSelected
                                ? "border-blue-600 bg-blue-600 shadow-md"
                                : "border-gray-200 bg-white hover:border-blue-400"
                          }`}
                        >
                          <div className={`mb-1 text-xs font-medium ${isSelected ? "text-blue-100" : "text-gray-500"}`}>
                            {item.day}
                          </div>
                          <div className={`mb-1 text-xl font-bold ${isSelected ? "text-white" : "text-gray-800"}`}>
                            {item.date}
                          </div>
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${
                              isSelected
                                ? "bg-blue-500 text-white"
                                : item.slots === "Booked"
                                  ? "bg-red-50 text-red-500"
                                  : item.slots === "Closed"
                                    ? "bg-gray-200 text-gray-500"
                                    : "bg-green-50 text-green-600"
                            }`}
                          >
                            {item.slots}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm text-gray-600">Available Times</p>
                  <div className="flex flex-wrap gap-3">
                    {times.map((item) => {
                      const isSelected = selectedTime === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setSelectedTime(item)}
                          className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                            isSelected
                              ? "border-blue-600 bg-blue-600 text-white shadow-md"
                              : "border-gray-200 bg-white text-gray-700 hover:border-blue-400"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="flex items-start gap-4 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={isOnline}
                    onChange={(event) => setIsOnline(event.target.checked)}
                    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="cursor-pointer font-medium text-gray-900">Request Online Session</label>
                  <p className="mt-1 text-xs text-gray-500">
                    Conduct the counseling session via Google Meet/Zoom instead of in-person.
                  </p>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Student Details</h2>

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
                        onChange={(event) => setStudentName(event.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        onChange={(event) => setStudentPhone(event.target.value)}
                        placeholder="e.g. +977-98XXXXXXXX"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <i className="fa-regular fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
                      <input
                        type="email"
                        value={studentEmail}
                        onChange={(event) => setStudentEmail(event.target.value)}
                        placeholder="e.g. student@college.edu"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                    <div className="relative">
                      <i className="fa-regular fa-file-lines absolute left-3 top-3 text-sm text-gray-400"></i>
                      <textarea
                        rows={3}
                        value={studentNotes}
                        onChange={(event) => setStudentNotes(event.target.value)}
                        placeholder="Any specific notes or questions for the counselor? (Optional)"
                        className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky top-8 w-full space-y-6 lg:w-1/3">
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50/50 p-5">
                <h2 className="font-bold text-gray-900">Booking Details</h2>
              </div>

              <div className="space-y-4 p-5">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="text-sm">
                      <p className="mb-0.5 text-gray-500">College</p>
                      <p className="font-medium text-gray-800">{collegeInput || "Not selected"}</p>
                    </div>
                    <button type="button" className="text-xs font-medium text-blue-600 hover:underline">
                      Edit
                    </button>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="text-sm">
                      <p className="mb-0.5 text-gray-500">Program & Course</p>
                      <p className="font-medium text-gray-800">{summaryCourse}</p>
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="text-sm">
                      <p className="mb-0.5 text-gray-500">Session Mode</p>
                      <span
                        className={`mt-1 inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
                          isOnline
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        <i className={`fa-solid ${isOnline ? "fa-video" : "fa-circle-check"} text-[10px]`}></i>
                        {isOnline ? "Online Session (Meet/Zoom)" : "In-Person Campus Visit"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between border-t border-gray-100 pt-2">
                    <div className="text-sm">
                      <p className="mb-1 text-gray-500">Date & Time</p>
                      <div className="flex items-center gap-2 font-medium text-gray-800">
                        <i className="fa-regular fa-calendar text-blue-600"></i>
                        <span>{summaryDateTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Session Fee</span>
                    <span className="text-xl font-bold text-gray-900">Free</span>
                  </div>

                  <button
                    type="button"
                    disabled={!isFormValid || isBooking || isConfirmed}
                    onClick={handleConfirmBooking}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3.5 font-medium text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      isConfirmed
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isBooking ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                      </>
                    ) : isConfirmed ? (
                      <>
                        <i className="fa-solid fa-check"></i>
                        Booking Confirmed!
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>

                  {submitError ? (
                    <p className="mt-2 text-center text-xs text-red-500">{submitError}</p>
                  ) : (
                    !isFormValid && (
                      <p className="mt-2 text-center text-xs text-red-500">
                        Please complete all required fields.
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mt-1 shrink-0 rounded-full bg-blue-50 p-2">
                <i className="fa-solid fa-headset text-blue-600"></i>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">We can help you</h3>
                <p className="mb-3 mt-1 text-xs leading-relaxed text-gray-500">
                  Call us +1 888-678-3546 or chat with our student support team for guidance.
                </p>
                <button
                  type="button"
                  className="rounded border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                >
                  Chat with us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCounsellingPage;
