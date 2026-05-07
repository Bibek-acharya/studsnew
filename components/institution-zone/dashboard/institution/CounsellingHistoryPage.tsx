"use client";
import React, { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";

const breadcrumb = [
  { label: "Dashboard", href: "/institution-zone/dashboard" },
  { label: "Counselling", href: "/institution-zone/dashboard/counselling" },
  { label: "Session History" },
];

const initialData = [
  {
    id: 1,
    studentName: "Aarav Sharma",
    program: "BSc Computer Science",
    counselor: "Dr. Sunita Rai",
    date: "Mar 20, 2026",
    time: "10:00 AM",
    duration: "45 min",
    status: "completed",
    notes: "Discussed career path in software engineering and elective choices.",
  },
  {
    id: 2,
    studentName: "Priya Patel",
    program: "MBA",
    counselor: "Prof. Ramesh Karki",
    date: "Mar 18, 2026",
    time: "02:00 PM",
    duration: "30 min",
    status: "completed",
    notes: "Reviewed MBA specialization options and internship opportunities.",
  },
  {
    id: 3,
    studentName: "Rohan Thapa",
    program: "BE Civil Engineering",
    counselor: "Dr. Sunita Rai",
    date: "Mar 15, 2026",
    time: "11:00 AM",
    duration: "60 min",
    status: "cancelled",
    notes: "Student cancelled due to schedule conflict.",
  },
  {
    id: 4,
    studentName: "Sneha Adhikari",
    program: "BA Psychology",
    counselor: "Dr. Anil Shrestha",
    date: "Mar 12, 2026",
    time: "09:00 AM",
    duration: "45 min",
    status: "completed",
    notes: "Discussed clinical psychology pathway and required certifications.",
  },
  {
    id: 5,
    studentName: "Kiran Gurung",
    program: "BBA",
    counselor: "Prof. Ramesh Karki",
    date: "Mar 10, 2026",
    time: "03:00 PM",
    duration: "30 min",
    status: "completed",
    notes: "Reviewed semester performance and study improvement strategies.",
  },
  {
    id: 6,
    studentName: "Anita Rai",
    program: "BSc Nursing",
    counselor: "Dr. Sunita Rai",
    date: "Mar 08, 2026",
    time: "01:00 PM",
    duration: "45 min",
    status: "completed",
    notes: "Discussed clinical rotation preferences and career goals.",
  },
];

const CounsellingHistoryPage = () => {
  const [data] = useState(initialData);
  const [search, setSearch] = useState("");

  const filtered = data.filter(
    (s) =>
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.program.toLowerCase().includes(search.toLowerCase()) ||
      s.counselor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <SectionHeader title="Session History" breadcrumbItems={breadcrumb} />
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="relative max-w-md mb-6">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student, program, or counselor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Program</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Counselor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{s.studentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.program}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.counselor}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.time}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.duration}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        s.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{s.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CounsellingHistoryPage;
