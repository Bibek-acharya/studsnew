"use client";
import React, { useState } from "react";
import {
  ChatsCircle,
  Clock,
  CheckCircle,
  ClipboardText,
  ChatCircleDots,
  WhatsappLogo,
  XCircle,
  CalendarBlank,
  ArrowClockwise,
} from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import StatCard from "@/components/institution-zone/dashboard/shared/StatCard";

const breadcrumb = [
  { label: "Dashboard", href: "/institution-zone/dashboard" },
  { label: "Counselling", href: "/institution-zone/dashboard/counselling" },
  { label: "Requests" },
];

const initialData = [
  {
    id: 1,
    studentName: "Aarav Sharma",
    program: "BSc Computer Science",
    preferredDate: "Mar 28, 2026",
    preferredTime: "10:00 AM - 11:00 AM",
    contact: "+977 9841234567",
    status: "pending",
  },
  {
    id: 2,
    studentName: "Priya Patel",
    program: "MBA",
    preferredDate: "Mar 25, 2026",
    preferredTime: "02:00 PM - 03:00 PM",
    contact: "+977 9812345678",
    status: "confirmed",
  },
  {
    id: 3,
    studentName: "Rohan Thapa",
    program: "BE Civil Engineering",
    preferredDate: "Mar 30, 2026",
    preferredTime: "11:00 AM - 12:00 PM",
    contact: "rohan@email.com",
    status: "pending",
  },
  {
    id: 4,
    studentName: "Sneha Adhikari",
    program: "BA Psychology",
    preferredDate: "Mar 22, 2026",
    preferredTime: "09:00 AM - 10:00 AM",
    contact: "+977 9865432109",
    status: "completed",
  },
  {
    id: 5,
    studentName: "Kiran Gurung",
    program: "BBA",
    preferredDate: "Mar 27, 2026",
    preferredTime: "03:00 PM - 04:00 PM",
    contact: "+977 9856712345",
    status: "pending",
  },
  {
    id: 6,
    studentName: "Anita Rai",
    program: "BSc Nursing",
    preferredDate: "Mar 29, 2026",
    preferredTime: "01:00 PM - 02:00 PM",
    contact: "anita@email.com",
    status: "confirmed",
  },
];

const CounsellingRequestsPage = () => {
  const [data] = useState(initialData);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterProgram, setFilterProgram] = useState("All");

  const filtered = data.filter((r) => {
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    const matchProgram = filterProgram === "All" || r.program === filterProgram;
    return matchStatus && matchProgram;
  });

  const statusCounts = {
    total: data.length,
    pending: data.filter((r) => r.status === "pending").length,
    confirmed: data.filter((r) => r.status === "confirmed").length,
    completed: data.filter((r) => r.status === "completed").length,
  };

  const stats = [
    {
      icon: <ChatsCircle weight="fill" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      label: "Total",
      value: String(statusCounts.total),
    },
    {
      icon: <Clock weight="fill" />,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      label: "Pending",
      value: String(statusCounts.pending),
    },
    {
      icon: <CheckCircle weight="fill" />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      label: "Confirmed",
      value: String(statusCounts.confirmed),
    },
    {
      icon: <ClipboardText weight="fill" />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      label: "Completed",
      value: String(statusCounts.completed),
    },
  ];

  const programs = [...new Set(data.map((r) => r.program))];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <SectionHeader title="Counselling Requests" breadcrumbItems={breadcrumb} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          >
            <option value="All">All Programs</option>
            {programs.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarBlank />
            <span>Date: Today</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Program</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Preferred Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Preferred Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{r.studentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.program}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.preferredDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.preferredTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.contact}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.status === "confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : r.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : r.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium hover:bg-green-200 transition-colors">
                        Accept
                      </button>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors">
                        Reschedule
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-colors">
                        Reject
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Message">
                        <ChatCircleDots />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CounsellingRequestsPage;
