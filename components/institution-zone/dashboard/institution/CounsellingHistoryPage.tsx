"use client";
import React, { useState } from "react";
import {
  MagnifyingGlass,
  CalendarCheck,
  Users,
  GraduationCap,
  Clock,
  VideoCamera,
  Buildings,
  Notepad,
  X,
} from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";

const breadcrumb = [
  { label: "Dashboard", href: "/institution-zone/dashboard" },
  { label: "Counselling", href: "/institution-zone/dashboard/counselling" },
  { label: "Session History" },
];

interface SessionItem {
  id: number;
  program: string;
  level: string;
  title: string;
  type: string;
  students: number;
  studentAvatars: string[];
  date: string;
  time: string;
  mode: "online" | "in-person";
  status: "completed" | "cancelled";
  notes: string;
}

const initialSessions: SessionItem[] = [
  { id: 1, program: "Computer Science", level: "Undergraduate", title: "B.Tech CS orientation", type: "Group Counselling", students: 25, studentAvatars: ["https://i.pravatar.cc/150?img=1", "https://i.pravatar.cc/150?img=2", "https://i.pravatar.cc/150?img=3"], date: "Mon, Apr 28", time: "10:00 AM - 11:30 AM", mode: "online", status: "completed", notes: "Group orientation session for B.Tech Computer Science program. Covered curriculum overview, placement opportunities, hostel facilities, and fee structure." },
  { id: 2, program: "Business Admin", level: "Undergraduate", title: "BBA Admissions 2026", type: "Group Counselling", students: 30, studentAvatars: ["https://i.pravatar.cc/150?img=4", "https://i.pravatar.cc/150?img=5", "https://i.pravatar.cc/150?img=6"], date: "Sun, Apr 27", time: "02:00 PM - 03:30 PM", mode: "online", status: "completed", notes: "Group counselling session for BBA program. Discussed specializations, internship opportunities, and placement records." },
  { id: 3, program: "Data Science", level: "Postgraduate", title: "M.Sc Data Science Info", type: "Group Counselling", students: 18, studentAvatars: ["https://i.pravatar.cc/150?img=7", "https://i.pravatar.cc/150?img=8"], date: "Sat, Apr 26", time: "11:00 AM - 12:30 PM", mode: "online", status: "completed", notes: "Online info session for M.Sc Data Science. Covered AI/ML modules, research opportunities, and industry partnerships." },
  { id: 4, program: "MBBS", level: "Undergraduate", title: "Medical College Tour", type: "Campus Visit", students: 22, studentAvatars: ["https://i.pravatar.cc/150?img=9", "https://i.pravatar.cc/150?img=10"], date: "Fri, Apr 25", time: "09:00 AM - 01:00 PM", mode: "in-person", status: "completed", notes: "Offline campus tour for MBBS aspirants. 22 students with parents visited anatomy lab, library, hostel, and hospital." },
  { id: 5, program: "Engineering", level: "Diploma", title: "Polytechnic Diploma Info", type: "Group Counselling", students: 20, studentAvatars: ["https://i.pravatar.cc/150?img=11"], date: "Wed, Apr 23", time: "03:00 PM - 04:30 PM", mode: "online", status: "cancelled", notes: "Session cancelled due to technical issues. Rescheduled to May 2." },
  { id: 6, program: "BA Psychology", level: "Undergraduate", title: "Psychology Career Path", type: "Individual", students: 1, studentAvatars: ["https://i.pravatar.cc/150?img=12"], date: "Tue, Apr 22", time: "01:00 PM - 01:45 PM", mode: "in-person", status: "completed", notes: "Discussed clinical psychology pathway and required certifications." },
];

const CounsellingHistoryPage = () => {
  const [sessions] = useState(initialSessions);
  const [search, setSearch] = useState("");
  const [filterProgram, setFilterProgram] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewSession, setViewSession] = useState<SessionItem | null>(null);

  const filtered = sessions.filter((s) => {
    const matchSearch = !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.program.toLowerCase().includes(search.toLowerCase());
    const matchProgram = filterProgram === "All" || s.program === filterProgram;
    const matchStatus = filterStatus === "All" || s.status === filterStatus;
    return matchSearch && matchProgram && matchStatus;
  });

  const programs = [...new Set(sessions.map((s) => s.program))];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <SectionHeader title="Session History" breadcrumbItems={breadcrumb} />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: <CalendarCheck className="w-5 h-5" />, bg: "bg-indigo-50 text-indigo-600", label: "Total Sessions", value: "156" },
          { icon: <Users className="w-5 h-5" />, bg: "bg-green-50 text-green-600", label: "Total Students", value: "3,240" },
          { icon: <GraduationCap className="w-5 h-5" />, bg: "bg-purple-50 text-purple-600", label: "Avg per Session", value: "21" },
          { icon: <Clock className="w-5 h-5" />, bg: "bg-amber-50 text-amber-600", label: "This Month", value: "18" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center">
            <div className={`w-10 h-10 ${s.bg} rounded-md flex items-center justify-center mr-3`}>{s.icon}</div>
            <div>
              <p className="text-xs font-medium text-gray-500">{s.label}</p>
              <h4 className="text-xl font-bold text-gray-800">{s.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Sessions Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="text-blue-600" /> Past Sessions
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:border-blue-600 outline-none"
                />
              </div>
              <select value={filterProgram} onChange={(e) => setFilterProgram(e.target.value)} className="text-sm px-3 py-2 bg-white border border-gray-300 rounded-md focus:border-blue-600 outline-none">
                <option value="All">All Programs</option>
                {programs.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-sm px-3 py-2 bg-white border border-gray-300 rounded-md focus:border-blue-600 outline-none">
                <option value="All">All Status</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Program</th>
                <th className="px-6 py-4 font-semibold">Session Title</th>
                <th className="px-6 py-4 font-semibold">Students</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Mode</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">{s.program}</div>
                    <div className="text-xs text-gray-500">{s.level}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">{s.title}</div>
                    <div className="text-xs text-gray-500">{s.type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex -space-x-2 mr-2">
                        {s.studentAvatars.slice(0, 3).map((avatar, i) => (
                          <img key={i} className="h-6 w-6 rounded-full border-2 border-white" src={avatar} alt="" />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{s.students} Students</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{s.date}</div>
                    <div className="text-xs text-gray-500">{s.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    {s.mode === "online"
                      ? <VideoCamera className="text-indigo-500 text-lg" />
                      : <Buildings className="text-gray-500 text-lg" />
                    }
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      s.status === "completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${s.status === "completed" ? "bg-green-500" : "bg-red-500"}`}></span>
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setViewSession(s)} className="text-gray-400 hover:text-blue-600 text-xs font-medium">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing <span className="font-medium">1-{filtered.length}</span> of <span className="font-medium">{sessions.length}</span> sessions</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 cursor-not-allowed"><span className="text-sm">&#8249;</span></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white text-sm font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"><span className="text-sm">&#8250;</span></button>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {viewSession && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewSession(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Notepad className="text-blue-600" /> Session Details
              </h2>
              <button onClick={() => setViewSession(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="text-2xl" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-md p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Session Title</p>
                    <p className="font-medium text-gray-900">{viewSession.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Program</p>
                    <p className="font-medium text-gray-900">{viewSession.program} ({viewSession.level})</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Date & Time</p>
                    <p className="font-medium text-gray-900">{viewSession.date} {viewSession.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Status</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      viewSession.status === "completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1 ${viewSession.status === "completed" ? "bg-green-500" : "bg-red-500"}`}></span>
                      {viewSession.status.charAt(0).toUpperCase() + viewSession.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Session Summary</p>
                <div className="text-sm text-gray-600 bg-white border border-gray-200 rounded-md p-4 min-h-[120px]">
                  {viewSession.notes}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button onClick={() => setViewSession(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounsellingHistoryPage;
