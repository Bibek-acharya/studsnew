"use client";
import React, { useState } from "react";
import {
  MagnifyingGlass,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  GraduationCap,
  Faders,
} from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import StatCard from "@/components/institution-zone/dashboard/shared/StatCard";

const breadcrumb = [
  { label: "Dashboard", href: "/institution-zone/dashboard" },
  { label: "Scholarship", href: "/institution-zone/dashboard/scholarship" },
  { label: "Applications" },
];

const initialData = [
  {
    id: 1,
    studentName: "Aarav Sharma",
    initials: "AS",
    scholarship: "Merit Excellence Scholarship",
    level: "Undergraduate",
    gpa: "3.8",
    status: "pending",
    appliedDate: "Mar 15, 2026",
  },
  {
    id: 2,
    studentName: "Priya Patel",
    initials: "PP",
    scholarship: "Women in STEM Grant",
    level: "Masters",
    gpa: "3.9",
    status: "approved",
    appliedDate: "Mar 10, 2026",
  },
  {
    id: 3,
    studentName: "Rohan Thapa",
    initials: "RT",
    scholarship: "Need-Based Financial Aid",
    level: "All Levels",
    gpa: "3.2",
    status: "pending",
    appliedDate: "Mar 18, 2026",
  },
  {
    id: 4,
    studentName: "Sneha Adhikari",
    initials: "SA",
    scholarship: "Rural Education Fund",
    level: "Undergraduate",
    gpa: "3.5",
    status: "rejected",
    appliedDate: "Mar 05, 2026",
  },
  {
    id: 5,
    studentName: "Kiran Gurung",
    initials: "KG",
    scholarship: "Sports Achievement Award",
    level: "All Levels",
    gpa: "3.1",
    status: "pending",
    appliedDate: "Mar 20, 2026",
  },
  {
    id: 6,
    studentName: "Anita Rai",
    initials: "AR",
    scholarship: "Research Fellowship Program",
    level: "PhD",
    gpa: "3.7",
    status: "approved",
    appliedDate: "Mar 12, 2026",
  },
];

const ScholarshipApplicationsPage = () => {
  const [data] = useState(initialData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterStream, setFilterStream] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const filtered = data.filter((a) => {
    const matchSearch =
      a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.scholarship.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || a.status === filterStatus;
    const matchStream = filterStream === "All" || a.level === filterStream;
    return matchSearch && matchStatus && matchStream;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const statusCounts = {
    total: data.length,
    pending: data.filter((a) => a.status === "pending").length,
    approved: data.filter((a) => a.status === "approved").length,
    rejected: data.filter((a) => a.status === "rejected").length,
  };

  const stats = [
    {
      icon: <Users weight="fill" />,
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
      label: "Approved",
      value: String(statusCounts.approved),
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
        <SectionHeader title="Scholarship Applications" breadcrumbItems={breadcrumb} />
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
              placeholder="Search by student or scholarship..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={filterStream}
            onChange={(e) => {
              setFilterStream(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          >
            <option value="All">All Levels</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Masters">Masters</option>
            <option value="PhD">PhD</option>
            <option value="All Levels">All Levels</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Scholarship</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Level</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">GPA</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Applied Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold shrink-0">
                        {a.initials}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{a.studentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.scholarship}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.level}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.gpa}</td>
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
                  <td className="px-4 py-3 text-sm text-gray-600">{a.appliedDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium hover:bg-green-200 transition-colors">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-colors">
                        Reject
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="View">
                        <Eye />
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

export default ScholarshipApplicationsPage;
