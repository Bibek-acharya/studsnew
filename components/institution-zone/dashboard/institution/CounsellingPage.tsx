"use client";

import React, { useState } from "react";
import { 
  Search, Filter, CheckCircle, XCircle, Link2, 
  Clock, Users, CalendarDays, Plus, Trash2, X,
  ArrowUpRight, Video, UserPlus, Calendar,
  LayoutDashboard
} from "lucide-react";

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
  Pending: "bg-amber-50 text-amber-600 border-amber-100",
  Accepted: "bg-emerald-50 text-emerald-600 border-emerald-100",
  "Link Sent": "bg-indigo-50 text-indigo-600 border-indigo-100",
  Rejected: "bg-rose-50 text-rose-600 border-rose-100",
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

  const totalStat = requests.length;
  const pendingStat = requests.filter(r => r.status === "Pending").length;
  const acceptedStat = requests.filter(r => r.status === "Accepted" || r.status === "Link Sent").length;

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto font-bold italic">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Counselling Hub</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Manage academic guidance & session scheduling</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          {(["requests", "slots"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase italic transition-all ${
                tab === t 
                ? "bg-white text-indigo-600 shadow-md scale-[1.02]" 
                : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t === "requests" ? "Student Intake" : "Availability Blocks"}
            </button>
          ))}
        </div>
      </div>

      {tab === "requests" && (
        <>
          {/* High Fidelity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Total Requests", value: totalStat, icon: <Users size={20} />, color: "indigo" },
              { label: "Pending Review", value: pendingStat, icon: <Clock size={20} />, color: "amber" },
              { label: "Approved Sessions", value: acceptedStat, icon: <CheckCircle size={20} />, color: "emerald" },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between shadow-sm relative overflow-hidden group">
                 <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${c.color}-50 rounded-full group-hover:scale-110 transition-transform`}></div>
                 <div className="relative">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{c.label}</p>
                    <p className={`text-4xl font-black text-${c.color}-600 italic tracking-tighter`}>{c.value}</p>
                 </div>
                 <div className={`w-12 h-12 rounded-2xl bg-${c.color}-50 text-${c.color}-600 flex items-center justify-center relative shadow-sm`}>{c.icon}</div>
              </div>
            ))}
          </div>

          {/* Filtering Engine */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[280px] group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  placeholder="Search student, program or subject..." 
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold uppercase italic focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm" 
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)} className="border border-slate-200 rounded-2xl px-4 py-3 text-[10px] font-black uppercase italic bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none shadow-sm cursor-pointer">
                  {programs.map(p => <option key={p} value={p}>{p === "All" ? "All Programs" : p}</option>)}
                </select>
                <select value={filterMode} onChange={e => setFilterMode(e.target.value as any)} className="border border-slate-200 rounded-2xl px-4 py-3 text-[10px] font-black uppercase italic bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none shadow-sm cursor-pointer">
                  <option value="All">All Modes</option>
                  <option>Online</option><option>In-Person</option><option>Phone</option>
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="border border-slate-200 rounded-2xl px-4 py-3 text-[10px] font-black uppercase italic bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none shadow-sm cursor-pointer">
                  <option value="All">All Status</option>
                  <option>Pending</option><option>Accepted</option><option>Link Sent</option><option>Rejected</option>
                </select>
              </div>
            </div>

            {/* Premium Table Structure */}
            <div className="overflow-x-auto font-bold italic">
              <table className="w-full min-w-[1000px] text-left border-collapse">
                <thead className="bg-slate-50/80 text-[10px] uppercase text-slate-400 tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="p-5 font-black">Student Profile</th>
                    <th className="p-5 font-black">Academic Path</th>
                    <th className="p-5 font-black">Session Topic</th>
                    <th className="p-5 font-black">Medium</th>
                    <th className="p-5 font-black text-center">Date</th>
                    <th className="p-5 font-black text-center">Status</th>
                    <th className="p-5 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="p-20 text-center text-slate-400 text-sm uppercase font-black">Archive Empty / No Records Matching Filters</td></tr>
                  ) : filtered.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm italic shadow-lg shadow-indigo-200">
                            {r.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 uppercase italic">{r.name}</p>
                            {r.urgent && <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider mt-1 inline-block animate-pulse">Urgent</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-xs text-slate-600 py-2 bg-slate-50/30 rounded-lg">{r.program}</td>
                      <td className="p-5 text-xs text-slate-500 max-w-xs truncate">{r.subject}</td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-xs text-slate-900 uppercase font-black italic">
                          {r.mode === "Online" ? <Video size={14} className="text-indigo-500" /> : r.mode === "Phone" ? <Clock size={14} className="text-amber-500" /> : <Users size={14} className="text-emerald-500" />}
                          {r.mode}
                        </div>
                      </td>
                      <td className="p-5 text-xs text-slate-400 text-center font-medium italic">{r.date}</td>
                      <td className="p-5">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-transparent shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] ${statusColors[r.status]}`}>{r.status}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex gap-2 justify-end">
                          {r.status === "Pending" && (
                            <button onClick={() => updateStatus(r.id, "Accepted")} className="w-8 h-8 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all shadow-md shadow-emerald-200">
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {(r.status === "Pending" || r.status === "Accepted") && r.mode === "Online" && (
                            <button onClick={() => openLinkModal(r.id)} className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
                              <Link2 size={16} />
                            </button>
                          )}
                          {r.status !== "Rejected" && (
                            <button onClick={() => updateStatus(r.id, "Rejected")} className="w-8 h-8 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                              <XCircle size={16} />
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Slot Form */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
               <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Calendar size={20} /></div>
               <h3 className="font-black text-slate-900 uppercase italic tracking-wider">Configure Availability</h3>
            </div>
            
            <div className="space-y-4 font-bold italic">
               <div>
                 <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Select Date</label>
                 <input type="date" value={slotDate} onChange={e => setSlotDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Starts At</label>
                   <input type="time" value={slotStart} onChange={e => setSlotStart(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Ends At</label>
                   <input type="time" value={slotEnd} onChange={e => setSlotEnd(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner" />
                 </div>
               </div>
               <div>
                 <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Max Intake Capacity</label>
                 <input type="number" min="1" max="50" value={slotCapacity} onChange={e => setSlotCapacity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner" />
               </div>
               <button 
                  onClick={addSlot} 
                  className="w-full py-4 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 italic"
               >
                 <Plus size={18} /> Deploy Availability
               </button>
            </div>
          </div>

          {/* Available Slots */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-2">
               <h3 className="font-black text-slate-900 uppercase italic tracking-wider flex items-center gap-2">
                  <LayoutDashboard size={20} className="text-slate-400" /> Active Session Blocks
               </h3>
               <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">{slots.length} Active Slots</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slots.length === 0 ? (
                <div className="col-span-full bg-white rounded-3xl border border-dashed border-slate-300 p-20 text-center">
                  <p className="text-sm font-black text-slate-400 uppercase italic tracking-widest mb-2">No availability configured</p>
                  <p className="text-[10px] text-slate-300 italic">Students won't be able to book sessions until slots are deployed.</p>
                </div>
              ) : slots.map(s => (
                <div key={s.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex items-center justify-between gap-4 group hover:border-indigo-500 transition-all cursor-default relative overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
                      <CalendarDays size={24} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 uppercase italic text-sm">{s.date}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide flex items-center gap-1">
                        <Clock size={12} /> {s.start} — {s.end}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="text-right">
                       <p className="text-xl font-black text-slate-900 italic tracking-tighter">
                          {s.booked}<span className="text-slate-300 font-bold text-xs">/{s.capacity}</span>
                       </p>
                       <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Intake</p>
                    </div>
                    <button onClick={() => setSlots(prev => prev.filter(x => x.id !== s.id))} className="w-9 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {/* Capacity Meter */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50">
                    <div 
                       className={`h-full transition-all duration-1000 ${
                          (s.booked / s.capacity) > 0.8 ? "bg-rose-500" : "bg-indigo-600"
                       }`} 
                       style={{ width: `${(s.booked / s.capacity) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* High Fidelity Meeting Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200"><Link2 size={20} /></div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase italic tracking-tight">V-Connect Port</h3>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Broadcasting Academic Portal</p>
                  </div>
               </div>
               <button onClick={() => setShowLinkModal(false)} className="w-10 h-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all shadow-sm"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6 font-bold italic">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Broadcasting Platform</label>
                <div className="grid grid-cols-2 gap-3">
                   {["Google Meet", "Zoom", "Teams", "Jitsi"].map(p => (
                      <button 
                         key={p} 
                         onClick={() => setPlatform(p)}
                         className={`py-3 px-4 rounded-2xl border text-[10px] font-black uppercase italic transition-all ${
                            platform === p 
                            ? "bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-200 scale-[1.05]" 
                            : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-white"
                         }`}
                      >
                         {p}
                      </button>
                   ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Secure Broadcast URL</label>
                <input 
                   autoFocus
                   value={meetUrl} 
                   onChange={e => setMeetUrl(e.target.value)} 
                   placeholder="https://meet.google.com/xxx-xxxx-xxx" 
                   className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-inner" 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowLinkModal(false)} className="flex-1 py-4 border border-slate-200 rounded-2xl text-xs font-black uppercase italic text-slate-400 hover:bg-slate-50 transition-all">Abort</button>
                <button 
                   onClick={provideLink} 
                   className="flex-1 py-4 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 italic"
                >
                  <ArrowUpRight size={18} /> Deploy Link
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
