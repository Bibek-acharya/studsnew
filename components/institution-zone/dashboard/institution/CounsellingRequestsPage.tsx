"use client";
import React, { useState } from "react";
import {
  ChatsCircle,
  Clock,
  CheckCircle,
  ClipboardText,
  CalendarBlank,
  CalendarPlus,
  MagnifyingGlass,
  X,
  Trash,
  Link as LinkIcon,
  PaperPlaneRight,
  VideoCamera,
  Buildings,
  Envelope,
  WhatsappLogo,
} from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import StatCard from "@/components/institution-zone/dashboard/shared/StatCard";

const breadcrumb = [
  { label: "Dashboard", href: "/institution-zone/dashboard" },
  { label: "Counselling", href: "/institution-zone/dashboard/counselling" },
  { label: "Requests" },
];

interface SlotItem {
  id: number;
  date: string;
  time: string;
}

interface RequestItem {
  id: number;
  name: string;
  email: string;
  initials: string;
  avatarBg: string;
  program: string;
  level: string;
  date: string;
  time: string;
  mode: "online" | "in-person";
  status: "pending" | "assigned";
}

const avatarColors = [
  "bg-indigo-100 text-indigo-600",
  "bg-green-100 text-green-600",
  "bg-pink-100 text-pink-600",
  "bg-amber-100 text-amber-600",
  "bg-cyan-100 text-cyan-600",
  "bg-purple-100 text-purple-600",
];

const initialRequests: RequestItem[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", initials: "AJ", avatarBg: avatarColors[0], program: "Data Science", level: "Postgraduate", date: "Mon, May 5", time: "10:00 AM", mode: "online", status: "pending" },
  { id: 2, name: "Michael Smith", email: "michael@example.com", initials: "MS", avatarBg: avatarColors[1], program: "Business Admin", level: "Undergraduate", date: "Tue, May 6", time: "11:30 AM", mode: "in-person", status: "assigned" },
  { id: 3, name: "Emma Wilson", email: "emma@example.com", initials: "EW", avatarBg: avatarColors[2], program: "Computer Science", level: "Undergraduate", date: "Wed, May 7", time: "03:00 PM", mode: "online", status: "pending" },
  { id: 4, name: "Rohan Thapa", email: "rohan@email.com", initials: "RT", avatarBg: avatarColors[3], program: "BE Civil Engineering", level: "Undergraduate", date: "Thu, May 8", time: "09:00 AM", mode: "in-person", status: "pending" },
  { id: 5, name: "Priya Patel", email: "priya@email.com", initials: "PP", avatarBg: avatarColors[4], program: "MBA", level: "Postgraduate", date: "Fri, May 9", time: "02:00 PM", mode: "online", status: "assigned" },
];

const CounsellingRequestsPage = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [filterProgram, setFilterProgram] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");

  // Schedule Session Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [acceptingRequests, setAcceptingRequests] = useState(true);
  const [slots, setSlots] = useState<SlotItem[]>([
    { id: 1, date: "Mon, May 15, 2026", time: "10:00 AM" },
    { id: 2, date: "Mon, May 15, 2026", time: "02:00 PM" },
    { id: 3, date: "Tue, May 16, 2026", time: "11:30 AM" },
    { id: 4, date: "Thu, May 18, 2026", time: "03:00 PM" },
  ]);
  const [newSlotDate, setNewSlotDate] = useState("");
  const [newSlotTime, setNewSlotTime] = useState("");

  // Assign Link Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState<RequestItem | null>(null);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [meetingAgenda, setMeetingAgenda] = useState("");

  const filtered = requests.filter((r) => {
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    const matchProgram = filterProgram === "All" || r.program === filterProgram;
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.program.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchProgram && matchSearch;
  });

  const statusCounts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    assigned: requests.filter((r) => r.status === "assigned").length,
  };

  const stats = [
    { icon: <ChatsCircle />, iconBg: "bg-blue-100", iconColor: "text-blue-600", label: "Total", value: String(statusCounts.total) },
    { icon: <Clock />, iconBg: "bg-yellow-100", iconColor: "text-yellow-600", label: "Pending", value: String(statusCounts.pending) },
    { icon: <CheckCircle />, iconBg: "bg-green-100", iconColor: "text-green-600", label: "Assigned", value: String(statusCounts.assigned) },
    { icon: <ClipboardText />, iconBg: "bg-purple-100", iconColor: "text-purple-600", label: "Completed", value: "0" },
  ];

  const addSlot = () => {
    if (!newSlotDate || !newSlotTime) return;
    const dateObj = new Date(newSlotDate);
    const formattedDate = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    const newSlot: SlotItem = { id: Math.max(0, ...slots.map(s => s.id)) + 1, date: formattedDate, time: newSlotTime };
    setSlots(prev => [...prev, newSlot]);
    setNewSlotDate("");
    setNewSlotTime("");
  };

  const programs = [...new Set(requests.map((r) => r.program))];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <SectionHeader title="Counselling Requests" breadcrumbItems={breadcrumb} />
        <button
          onClick={() => setShowScheduleModal(true)}
          className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <CalendarPlus className="w-4 h-4 mr-2" /> Schedule Session
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ChatsCircle className="text-blue-600" /> Student Requests
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student or program..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            >
              <option value="All">All Programs</option>
              {programs.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Student Info</th>
                <th className="px-6 py-4 font-semibold">Academic Interest</th>
                <th className="px-6 py-4 font-semibold">Schedule & Mode</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full ${r.avatarBg} flex items-center justify-center font-bold text-xs mr-3 shrink-0`}>
                        {r.initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{r.name}</div>
                        <div className="text-xs text-gray-500">{r.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">{r.program}</div>
                    <div className="text-xs text-gray-500">{r.level}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900"><CalendarBlank className="inline mr-1 text-gray-400" /> {r.date}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <Clock className="inline mr-1 text-gray-400" /> {r.time}
                      <span className={`ml-2 ${r.mode === "online" ? "text-indigo-500" : "text-gray-500"}`}>
                        {r.mode === "online" ? <VideoCamera className="inline" /> : <Buildings className="inline" />}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      r.status === "assigned" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${r.status === "assigned" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {r.status === "pending" ? (
                      <button
                        onClick={() => { setAssignTarget(r); setMeetingUrl(""); setMeetingAgenda(""); setShowAssignModal(true); }}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-indigo-200"
                      >
                        Assign Link
                      </button>
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        <a href="#" className="text-green-500 hover:text-green-700 transition-colors" title="WhatsApp"><WhatsappLogo className="text-lg" /></a>
                        <a href="#" className="text-indigo-500 hover:text-indigo-700 transition-colors" title="Email"><Envelope className="text-lg" /></a>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing <span className="font-medium">1-{filtered.length}</span> of <span className="font-medium">{requests.length}</span> requests</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 cursor-not-allowed"><span className="text-sm">&#8249;</span></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white text-sm font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"><span className="text-sm">&#8250;</span></button>
          </div>
        </div>
      </div>

      {/* Schedule Session Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CalendarBlank className="text-blue-600" /> Schedule Session
              </h2>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="text-2xl" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Booking Availability</h3>
                    <p className="text-sm text-gray-500">Control when students can book sessions.</p>
                  </div>
                  <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm">
                    <span className="text-sm font-medium text-gray-700">Accepting Requests:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={acceptingRequests} onChange={() => setAcceptingRequests(!acceptingRequests)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                <div className="p-6 flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/3">
                    <h4 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">Add New Slot</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" value={newSlotDate} onChange={(e) => setNewSlotDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input type="time" value={newSlotTime} onChange={(e) => setNewSlotTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <button onClick={addSlot} className="w-full bg-gray-800 text-white font-medium py-2 rounded-md hover:bg-gray-900 transition-colors shadow-sm text-sm flex items-center justify-center gap-1">
                        <span className="text-lg leading-none">+</span> Add to Schedule
                      </button>
                    </div>
                  </div>

                  <div className="w-full md:w-2/3">
                    <h4 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">Active Slots</h4>
                    <div className="bg-gray-50 rounded-md border border-gray-200 p-2 h-64 overflow-y-auto">
                      {slots.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-8">No slots created yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {slots.map((slot) => (
                            <li key={slot.id} className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded-md hover:border-gray-300 transition-colors">
                              <div className="flex items-center text-sm font-medium text-gray-700">
                                <div className="w-10 h-10 rounded bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center mr-3 leading-none">
                                  <span className="text-[10px] font-bold uppercase">{slot.date.split(",")[0]}</span>
                                  <span className="text-sm font-black">{slot.date.match(/\d+/)?.[0]}</span>
                                </div>
                                <div>
                                  <span className="block">{slot.date}</span>
                                  <span className="text-xs text-gray-500"><Clock className="inline w-3 h-3" /> {slot.time}</span>
                                </div>
                              </div>
                              <button onClick={() => setSlots(prev => prev.filter(s => s.id !== slot.id))} className="w-8 h-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors">
                                <Trash className="w-4 h-4" />
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
              <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium text-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Link Modal */}
      {showAssignModal && assignTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <LinkIcon className="text-blue-600" /> Assign Online Meeting
              </h2>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="text-2xl" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Student: <span className="font-semibold text-gray-900">{assignTarget.name}</span></p>
                <p className="text-sm text-gray-600 mt-1">Schedule: <span className="font-medium text-blue-600">{assignTarget.date} at {assignTarget.time}</span></p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Meeting URL (Zoom)</label>
                <input
                  type="url"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Agenda</label>
                <textarea
                  value={meetingAgenda}
                  onChange={(e) => setMeetingAgenda(e.target.value)}
                  rows={3}
                  placeholder="Discuss course details, admission process, scholarship options..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowAssignModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">Cancel</button>
                <button onClick={() => { setShowAssignModal(false); }} className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2">
                  <PaperPlaneRight className="w-4 h-4" /> Save & Notify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounsellingRequestsPage;
