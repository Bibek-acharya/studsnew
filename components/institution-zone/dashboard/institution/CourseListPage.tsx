"use client";
import React, { useState } from "react";
import { Plus, MagnifyingGlass, Pencil, Trash, DotsThreeVertical, BookOpen } from "@phosphor-icons/react";
import SectionHeader from "../shared/SectionHeader";

const courses = [
  {
    id: 1,
    name: "B.Tech Computer Science",
    duration: "4 Years",
    fees: "$12,000/year",
    seats: 60,
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 2,
    name: "BBA",
    duration: "3 Years",
    fees: "$8,000/year",
    seats: 80,
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 3,
    name: "M.Sc Physics",
    duration: "2 Years",
    fees: "$6,500/year",
    seats: 30,
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 4,
    name: "BCA",
    duration: "3 Years",
    fees: "$9,000/year",
    seats: 50,
    status: "Inactive",
    statusColor: "bg-red-100 text-red-700",
  },
  {
    id: 5,
    name: "M.Tech Data Science",
    duration: "2 Years",
    fees: "$10,000/year",
    seats: 25,
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 6,
    name: "BA English",
    duration: "3 Years",
    fees: "$5,000/year",
    seats: 60,
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 7,
    name: "B.Com Honours",
    duration: "3 Years",
    fees: "$7,000/year",
    seats: 70,
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 8,
    name: "Ph.D Computer Science",
    duration: "5 Years",
    fees: "$4,000/year",
    seats: 10,
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
  },
];

const CourseListPage: React.FC = () => {
  const [search, setSearch] = useState("");

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Course List"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "Course" },
          { label: "List" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 whitespace-nowrap">
          <Plus />
          Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-blue-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 leading-tight">
                  {course.name}
                </h3>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${course.statusColor}`}
              >
                {course.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm font-medium text-gray-700">{course.duration}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Fees</p>
                <p className="text-sm font-medium text-gray-700">{course.fees}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Seats</p>
                <p className="text-sm font-medium text-gray-700">{course.seats}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50">
                <Pencil />
                Edit
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50">
                <DotsThreeVertical />
                View
              </button>
              <button className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 text-gray-700 rounded-lg text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                <Trash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseListPage;
