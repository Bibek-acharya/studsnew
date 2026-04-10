"use client";
import React, { useState } from "react";
import { Search, Filter, CheckCircle, XCircle, Link2, Clock, Users, CalendarDays, Plus, Trash2, X } from "lucide-react";

type RequestStatus = "Pending" | "Accepted" | "Link Sent" | "Rejected";
type CounsellingMode = "Online" | "In-Person" | "Phone";

interface CounsellingRequest {
  id: number;
  name: string;
  program: string;
  subject: string;
  mode: CounsellingMode;
  date: string;
  status: RequestStatus;
  urgent: boolean;
}

interface SlotItem {
  id: number;
  date: string;
  start: string;
  end: string;
  capacity: number;
  booked: number;
}

const REQUESTS: CounsellingRequest[] = [
  { id: 1, name: "Rahul Sharma", program: "BSc CSIT", subject: "Admission Guidance", mode: "Online", date: "2024-03-12", status: "Pending", urgent: false },
  { id: 2, name: "Priya Patel", program: "BBA", subject: "Scholarship Query", mode: "In-Person", date: "2024-03-14", status: "Accepted", urgent: false },
  { id: 3, name: "Bikash Thapa", program: "+2 Science", subject: "Career Options", mode: "Online", date: "2024-03-15", status: "Link Sent", urgent: true },
  { id: 4, name: "Sita Gurung", program: "MBA", subject: "Fee Structure", mode: "Phone", date: "2024-03-16", status: "Pending", urgent: false },
  { id: 5, name: "Anita KC", program: "Diploma IT", subject: "Hostel Inquiry", mode: "Online", date: "2024-03-17", status: "Rejected", urgent: false },
];

const DEFAULT_SLOTS: SlotItem[] = [
  { id: 1, date: "2024-03-20", start: "09:00", end: "12:00", capacity: 5, booked: 3 },
  { id: 2, date: "2024-03-22", start: "14:00", end: "17:00", capacity: 4, booked: 1 },
];

const statusColors: Record<RequestStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Accepted: "bg-green-100 text-green-700",
  "Link Sent": "bg-blue-100 text-blue-700",
  Rejected: "bg-red-100 text-red-700",
};

const CounsellingPage: React.FC = () => {
  const [tab, setTab] = useState<"requests" | "slots">("requests");
  const [requests, setRequests] = useState(REQUESTS);
  const [slots, setSlots] = useState(DEFAULT_SLOTS);

  /* filters */
  const [search, setSearch] = useState("");
  const [filterProgram, setFilterProgram] = useState("All");
  const [filterMode, setFilterMode] = useState<"All" | CounsellingMode>("All");
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

  const filtered = requests.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.subject.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterProgram !== "All" && r.program !== filterProgram) return false;
    if (filterMode !== "All" && r.mode !== filterMode) return false;
    if (filterStatus !== "All" && r.status !== filterStatus) return false;
    return true;
  });

  const programs = ["All", ...Array.from(new Set(REQUESTS.map(r => r.program)))];

  const updateStatus = (id: number, status: RequestStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const openLinkModal = (id: number) => { setLinkTarget(id); setMeetUrl(""); setShowLinkModal(true); };

  const provideLink = () => {
    if (linkTarget !== null) updateStatus(linkTarget, "Link Sent");
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

  const totalStat = REQUESTS.length;
  const pendingStat = REQUESTS.filter(r => r.status === "Pending").length;
  const acceptedStat = REQUESTS.filter(r => r.status === "Accepted" || r.status === "Link Sent").length;

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Counselling Management</h1>
        <p className="text-slate-500 text-sm mt-1">Manage student counselling requests and available time slots.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(["requests", "slots"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {t === "requests" ? "Student Requests" : "Manage Slots"}
          </button>
        ))}
      </div>

      {tab === "requests" && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            {[
              { label: "Total Requests", value: totalStat, icon: <Users className="w-5 h-5" />, color: "text-blue-600 bg-blue-50" },
              { label: "Pending", value: pendingStat, icon: <Clock className="w-5 h-5" />, color: "text-yellow-600 bg-yellow-50" },
              { label: "Accepted / Linked", value: acceptedStat, icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600 bg-green-50" },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${c.color}`}>{c.icon}</div>
                <div>
                  <p className="text-xs text-slate-500">{c.label}</p>
                  <p className="text-xl font-bold text-slate-900">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or subject..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                {programs.map(p => <option key={p}>{p}</option>)}
              </select>
              <select value={filterMode} onChange={e => setFilterMode(e.target.value as typeof filterMode)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="All">All Modes</option>
                <option>Online</option><option>In-Person</option><option>Phone</option>
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="All">All Status</option>
                <option>Pending</option><option>Accepted</option><option>Link Sent</option><option>Rejected</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-100">
                  <tr>
                    {["Student", "Program", "Subject", "Mode", "Date", "Status", "Actions"].map(h => (
                      <th key={h} className="p-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-slate-400 text-sm">No requests found.</td></tr>
                  ) : filtered.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {r.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{r.name}</p>
                            {r.urgent && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">Urgent</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-slate-600">{r.program}</td>
                      <td className="p-3 text-sm text-slate-600">{r.subject}</td>
                      <td className="p-3 text-sm text-slate-600">{r.mode}</td>
                      <td className="p-3 text-sm text-slate-600">{r.date}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[r.status]}`}>{r.status}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1.5 flex-wrap">
                          {r.status === "Pending" && (
                            <button onClick={() => updateStatus(r.id, "Accepted")} className="px-2.5 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors">
                              <CheckCircle className="w-3.5 h-3.5" /> Accept
                            </button>
                          )}
                          {(r.status === "Pending" || r.status === "Accepted") && r.mode === "Online" && (
                            <button onClick={() => openLinkModal(r.id)} className="px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors">
                              <Link2 className="w-3.5 h-3.5" /> Link
                            </button>
                          )}
                          {r.status !== "Rejected" && (
                            <button onClick={() => updateStatus(r.id, "Rejected")} className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors">
                              <XCircle className="w-3.5 h-3.5" /> Reject
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
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 h-fit">
            <h3 className="font-bold text-slate-800">Create New Slot</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input type="date" value={slotDate} onChange={e => setSlotDate(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                <input type="time" value={slotStart} onChange={e => setSlotStart(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                <input type="time" value={slotEnd} onChange={e => setSlotEnd(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Capacity</label>
              <input type="number" min="1" max="50" value={slotCapacity} onChange={e => setSlotCapacity(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button onClick={addSlot} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Create Slot
            </button>
          </div>

          {/* Available Slots */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-bold text-slate-800">Current Availability</h3>
            {slots.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
                No slots created yet.
              </div>
            ) : slots.map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{s.date}</p>
                    <p className="text-sm text-slate-500">{s.start} — {s.end}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900">{s.booked}<span className="text-slate-400 font-normal text-sm">/{s.capacity}</span></p>
                  <p className="text-xs text-slate-400">Booked</p>
                </div>
                <div className="w-24">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${(s.booked / s.capacity) * 100}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 text-right">{s.capacity - s.booked} free</p>
                </div>
                <button onClick={() => setSlots(prev => prev.filter(x => x.id !== s.id))} className="text-slate-400 hover:text-red-500 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meeting Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden m-4">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Provide Online Meeting Link</h3>
              <button onClick={() => setShowLinkModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Google Meet</option><option>Zoom</option><option>Microsoft Teams</option><option>Jitsi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meeting URL</label>
                <input value={meetUrl} onChange={e => setMeetUrl(e.target.value)} placeholder="https://meet.google.com/xxx" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => setShowLinkModal(false)} className="px-4 py-2 border rounded-lg text-slate-600 text-sm">Cancel</button>
                <button onClick={provideLink} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2">
                  <Link2 className="w-4 h-4" /> Send Link
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
