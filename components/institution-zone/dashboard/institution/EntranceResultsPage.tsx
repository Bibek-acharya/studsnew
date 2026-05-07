"use client";
import React, { useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";

const breadcrumb = [
  { label: "Dashboard", href: "/institution-zone/dashboard" },
  { label: "Entrance", href: "/institution-zone/dashboard/entrance" },
  { label: "Results" },
];

const initialData = [
  {
    id: 1,
    studentName: "Aarav Sharma",
    registrationNo: "ENT-2026-001",
    marksObtained: 82,
    totalMarks: 100,
    percentage: 82,
    result: "pass",
    rank: 1,
    exam: "BSc CS Entrance 2026",
  },
  {
    id: 2,
    studentName: "Anita Rai",
    registrationNo: "ENT-2026-006",
    marksObtained: 76,
    totalMarks: 100,
    percentage: 76,
    result: "pass",
    rank: 2,
    exam: "BSc CS Entrance 2026",
  },
  {
    id: 3,
    studentName: "Priya Patel",
    registrationNo: "ENT-2026-002",
    marksObtained: 68,
    totalMarks: 100,
    percentage: 68,
    result: "pass",
    rank: 3,
    exam: "BSc CS Entrance 2026",
  },
  {
    id: 4,
    studentName: "Rohan Thapa",
    registrationNo: "ENT-2026-003",
    marksObtained: 45,
    totalMarks: 100,
    percentage: 45,
    result: "pass",
    rank: 4,
    exam: "BSc CS Entrance 2026",
  },
  {
    id: 5,
    studentName: "Sneha Adhikari",
    registrationNo: "ENT-2026-004",
    marksObtained: 35,
    totalMarks: 100,
    percentage: 35,
    result: "fail",
    rank: 5,
    exam: "BSc CS Entrance 2026",
  },
  {
    id: 6,
    studentName: "Kiran Gurung",
    registrationNo: "ENT-2026-005",
    marksObtained: 88,
    totalMarks: 100,
    percentage: 88,
    result: "pass",
    rank: 1,
    exam: "MBA Entrance 2026",
  },
];

const EntranceResultsPage = () => {
  const [data] = useState(initialData);
  const [selectedExam, setSelectedExam] = useState("All");

  const exams = [...new Set(data.map((d) => d.exam))];

  const filtered = selectedExam === "All" ? data : data.filter((d) => d.exam === selectedExam);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <SectionHeader title="Results" breadcrumbItems={breadcrumb} />
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <label className="block text-sm font-medium text-gray-700">Exam:</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            >
              <option value="All">All Exams</option>
              {exams.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <DownloadSimple />
            Download PDF
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Registration No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Marks Obtained</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total Marks</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Percentage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Result</th>
              </tr>
            </thead>
            <tbody>
              {filtered
                .sort((a, b) => a.rank - b.rank)
                .map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          r.rank === 1
                            ? "bg-yellow-100 text-yellow-700"
                            : r.rank === 2
                              ? "bg-gray-100 text-gray-600"
                              : r.rank === 3
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-50 text-gray-500"
                        }`}
                      >
                        {r.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{r.studentName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{r.registrationNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.marksObtained}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.totalMarks}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.percentage}%</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.result === "pass"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.result === "pass" ? "Pass" : "Fail"}
                      </span>
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

export default EntranceResultsPage;
