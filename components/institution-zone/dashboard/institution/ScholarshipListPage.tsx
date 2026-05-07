"use client";
import React, { useState } from "react";
import {
  Plus,
  MagnifyingGlass,
  GraduationCap,
  CheckCircle,
  Users,
  BookmarkSimple,
  ChatCircleDots,
  Trash,
  Pencil,
} from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import StatCard from "@/components/institution-zone/dashboard/shared/StatCard";

const breadcrumb = [
  { label: "Dashboard", href: "/institution-zone/dashboard" },
  { label: "Scholarship", href: "/institution-zone/dashboard/scholarship" },
  { label: "Scholarship List" },
];

const initialData = [
  {
    id: 1,
    name: "Merit Excellence Scholarship",
    level: "Undergraduate",
    stream: "Science & Technology",
    coverage: "Full Tuition",
    eligibility: "GPA ≥ 3.5",
    seats: 25,
    status: "active",
  },
  {
    id: 2,
    name: "Need-Based Financial Aid",
    level: "All Levels",
    stream: "All Streams",
    coverage: "NPR 50,000/year",
    eligibility: "Income < NPR 5L",
    seats: 50,
    status: "active",
  },
  {
    id: 3,
    name: "Women in STEM Grant",
    level: "Masters",
    stream: "Engineering",
    coverage: "NPR 100,000/year",
    eligibility: "Female Candidates",
    seats: 10,
    status: "active",
  },
  {
    id: 4,
    name: "Rural Education Fund",
    level: "Undergraduate",
    stream: "Arts & Humanities",
    coverage: "Partial Fee",
    eligibility: "Rural Background",
    seats: 30,
    status: "inactive",
  },
  {
    id: 5,
    name: "Sports Achievement Award",
    level: "All Levels",
    stream: "All Streams",
    coverage: "NPR 25,000/year",
    eligibility: "National Level Sports",
    seats: 15,
    status: "active",
  },
  {
    id: 6,
    name: "Research Fellowship Program",
    level: "PhD",
    stream: "Research",
    coverage: "NPR 200,000/year",
    eligibility: "Masters Degree",
    seats: 8,
    status: "inactive",
  },
];

const ScholarshipListPage = () => {
  const [data] = useState(initialData);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = data.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchLevel = filterLevel === "All" || s.level === filterLevel;
    const matchStatus = filterStatus === "All" || s.status === filterStatus;
    return matchSearch && matchLevel && matchStatus;
  });

  const stats = [
    {
      icon: <BookmarkSimple weight="fill" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      label: "Total Scholarships",
      value: "24",
    },
    {
      icon: <CheckCircle weight="fill" />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      label: "Active",
      value: "18",
    },
    {
      icon: <Users weight="fill" />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      label: "Applications",
      value: "156",
    },
    {
      icon: <GraduationCap weight="fill" />,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      label: "Awarded",
      value: "89",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <SectionHeader title="Scholarship List" breadcrumbItems={breadcrumb} />
      </div>

      <div className="flex justify-end mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
          <Plus weight="bold" />
          Add Scholarship
        </button>
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
              placeholder="Search scholarships..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          >
            <option value="All">All Levels</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Masters">Masters</option>
            <option value="PhD">PhD</option>
            <option value="All Levels">All Levels</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Scholarship Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Level</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stream</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Coverage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Eligibility</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Seats</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.level}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.stream}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.coverage}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.eligibility}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.seats}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        s.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                        <Pencil />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-green-600 transition-colors" title="View Applications">
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

export default ScholarshipListPage;
