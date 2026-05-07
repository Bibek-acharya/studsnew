"use client";
import React, { useState } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  MagnifyingGlass,
  Eye,
  DownloadSimple,
} from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import StatCard from "@/components/institution-zone/dashboard/shared/StatCard";

const breadcrumb = [
  { label: "Dashboard", href: "/institution-zone/dashboard" },
  { label: "Entrance", href: "/institution-zone/dashboard/entrance" },
  { label: "Applicants" },
];

const initialData = [
  {
    id: 1,
    studentName: "Aarav Sharma",
    exam: "BSc CS Entrance 2026",
    registrationNo: "ENT-2026-001",
    contact: "+977 9841234567",
    status: "approved",
  },
  {
    id: 2,
    studentName: "Priya Patel",
    exam: "MBA Entrance 2026",
    registrationNo: "ENT-2026-002",
    contact: "+977 9812345678",
    status: "pending",
  },
  {
    id: 3,
    studentName: "Rohan Thapa",
    exam: "BE Civil Entrance 2026",
    registrationNo: "ENT-2026-003",
    contact: "rohan@email.com",
    status: "pending",
  },
  {
    id: 4,
    studentName: "Sneha Adhikari",
    exam: "BSc CS Entrance 2026",
    registrationNo: "ENT-2026-004",
    contact: "+977 9865432109",
    status: "rejected",
  },
  {
    id: 5,
    studentName: "Kiran Gurung",
    exam: "BBA Entrance 2026",
    registrationNo: "ENT-2026-005",
    contact: "+977 9856712345",
    status: "approved",
  },
  {
    id: 6,
    studentName: "Anita Rai",
    exam: "MBA Entrance 2026",
    registrationNo: "ENT-2026-006",
    contact: "anita@email.com",
    status: "pending",
  },
];

const EntranceApplicantsPage = () => {
  const [data] = useState(initialData);
  const [search, setSearch] = useState("");
  const [filterExam, setFilterExam] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const filtered = data.filter((a) => {
    const matchSearch =
      a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.registrationNo.toLowerCase().includes(search.toLowerCase());
    const matchExam = filterExam === "All" || a.exam === filterExam;
    const matchStatus = filterStatus === "All" || a.status === filterStatus;
    return matchSearch && matchExam && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const statusCounts = {
    total: data.length,
    approved: data.filter((a) => a.status === "approved").length,
    pending: data.filter((a) => a.status === "pending").length,
    rejected: data.filter((a) => a.status === "rejected").length,
  };

  const exams = [...new Set(data.map((a) => a.exam))];

  const stats = [
    {
      icon: <Users weight="fill" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      label: "Total",
      value: String(statusCounts.total),
    },
    {
      icon: <CheckCircle weight="fill" />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      label: "Approved",
      value: String(statusCounts.approved),
    },
    {
      icon: <Clock weight="fill" />,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      label: "Pending",
      value: String(statusCounts.pending),
    },
    {
      icon: <XCircle weight="fill" />,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      label: "Rejected",
      value: String(statusCounts.rejected),
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <SectionHeader title="Entrance Applicants" breadcrumbItems={breadcrumb} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or registration no..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <select
            value={filterExam}
            onChange={(e) => {
              setFilterExam(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          >
            <option value="All">All Exams</option>
            {exams.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          >
            <option value="All">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Exam</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Registration No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{a.studentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.exam}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{a.registrationNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.contact}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        a.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : a.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium hover:bg-green-200 transition-colors">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-colors">
                        Reject
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                        <Eye />
                      </button>
                      <button
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Generate Admit Card"
                      >
                        <DownloadSimple />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * perPage + 1} to{" "}
              {Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    currentPage === p
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntranceApplicantsPage;
