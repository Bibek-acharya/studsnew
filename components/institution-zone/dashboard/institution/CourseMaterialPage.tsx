"use client";
import React, { useState } from "react";
import {
  Plus,
  MagnifyingGlass,
  FileText,
  FilePdf,
  Video,
  Link as LinkIcon,
  DownloadSimple,
} from "@phosphor-icons/react";
import SectionHeader from "../shared/SectionHeader";

const materials = [
  {
    id: 1,
    title: "Introduction to Algorithms - Lecture 1",
    course: "B.Tech CS",
    type: "PDF",
    typeIcon: FilePdf,
    typeColor: "bg-red-50 text-red-600",
    date: "May 01, 2026",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Data Structures Complete Notes",
    course: "B.Tech CS",
    type: "PDF",
    typeIcon: FilePdf,
    typeColor: "bg-red-50 text-red-600",
    date: "Apr 28, 2026",
    size: "5.1 MB",
  },
  {
    id: 3,
    title: "Management Principles - Week 3",
    course: "BBA",
    type: "Video",
    typeIcon: Video,
    typeColor: "bg-purple-50 text-purple-600",
    date: "Apr 25, 2026",
    size: "45 min",
  },
  {
    id: 4,
    title: "Financial Accounting Workbook",
    course: "BBA",
    type: "PDF",
    typeIcon: FilePdf,
    typeColor: "bg-red-50 text-red-600",
    date: "Apr 22, 2026",
    size: "3.8 MB",
  },
  {
    id: 5,
    title: "Python Programming Basics",
    course: "BCA",
    type: "Link",
    typeIcon: LinkIcon,
    typeColor: "bg-blue-50 text-blue-600",
    date: "Apr 20, 2026",
    size: "—",
  },
  {
    id: 6,
    title: "Cloud Computing Fundamentals",
    course: "BCA",
    type: "Video",
    typeIcon: Video,
    typeColor: "bg-purple-50 text-purple-600",
    date: "Apr 18, 2026",
    size: "1 hr 20 min",
  },
  {
    id: 7,
    title: "Operating Systems Notes",
    course: "B.Tech CS",
    type: "PDF",
    typeIcon: FilePdf,
    typeColor: "bg-red-50 text-red-600",
    date: "Apr 15, 2026",
    size: "4.2 MB",
  },
  {
    id: 8,
    title: "Marketing Strategies Case Study",
    course: "BBA",
    type: "Link",
    typeIcon: LinkIcon,
    typeColor: "bg-blue-50 text-blue-600",
    date: "Apr 12, 2026",
    size: "—",
  },
  {
    id: 9,
    title: "Java OOP Concepts",
    course: "BCA",
    type: "PDF",
    typeIcon: FilePdf,
    typeColor: "bg-red-50 text-red-600",
    date: "Apr 10, 2026",
    size: "1.9 MB",
  },
  {
    id: 10,
    title: "Database Design & ER Diagrams",
    course: "BCA",
    type: "Video",
    typeIcon: Video,
    typeColor: "bg-purple-50 text-purple-600",
    date: "Apr 08, 2026",
    size: "55 min",
  },
];

const courses = ["All Courses", "B.Tech CS", "BBA", "BCA"];

const CourseMaterialPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Courses");

  const filtered = materials.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All Courses" || m.course === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Study Material"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "Course" },
          { label: "Study Material" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search materials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-44 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          >
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 whitespace-nowrap">
          <Plus />
          Add Material
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((material) => {
          const TypeIcon = material.typeIcon;
          return (
            <div
              key={material.id}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-start gap-4"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${material.typeColor}`}
              >
                <TypeIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 truncate">
                  {material.title}
                </h4>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-gray-500">{material.course}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-500">{material.type}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400">{material.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{material.size}</span>
                    <button className="inline-flex items-center justify-center w-7 h-7 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600">
                      <DownloadSimple className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseMaterialPage;
