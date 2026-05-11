"use client";

import React, { useState, useMemo } from "react";
import { Home, Star, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface ShortlistedApplicant {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  ethnicity: string;
  province: string;
  district: string;
  stream: string;
  examCenter: string;
  gpa: number;
  schoolType: string;
  scholarship: string;
  status: string;
}

const SHORTLISTED: ShortlistedApplicant[] = [
  { id: 3, firstName: "Rohan", lastName: "Thapa", gender: "Male", ethnicity: "Chhetri", province: "Gandaki", district: "Kaski", stream: "Science", examCenter: "Pokhara", gpa: 3.2, schoolType: "Private", scholarship: "Need-Based Aid", status: "shortlisted" },
  { id: 8, firstName: "Bishal", lastName: "KC", gender: "Male", ethnicity: "Chhetri", province: "Karnali", district: "Surkhet", stream: "Science", examCenter: "Surkhet", gpa: 3.6, schoolType: "Public", scholarship: "Full Funded", status: "shortlisted" },
  { id: 12, firstName: "Prakash", lastName: "Neupane", gender: "Male", ethnicity: "Bahun", province: "Gandaki", district: "Kaski", stream: "Science", examCenter: "Pokhara", gpa: 3.8, schoolType: "Private", scholarship: "Merit Excellence", status: "shortlisted" },
  { id: 13, firstName: "Sita", lastName: "Rai", gender: "Female", ethnicity: "Rai", province: "Koshi", district: "Morang", stream: "Education", examCenter: "Biratnagar", gpa: 3.5, schoolType: "Public", scholarship: "Women Scholarship", status: "shortlisted" },
  { id: 14, firstName: "Ram", lastName: "Thapa", gender: "Male", ethnicity: "Magar", province: "Lumbini", district: "Rupandehi", stream: "Management", examCenter: "Bhairahawa", gpa: 3.9, schoolType: "Private", scholarship: "Merit Excellence", status: "shortlisted" },
  { id: 15, firstName: "Gita", lastName: "Dahal", gender: "Female", ethnicity: "Bahun", province: "Gandaki", district: "Nawalpur", stream: "Science", examCenter: "Pokhara", gpa: 3.5, schoolType: "Private", scholarship: "Full Funded", status: "shortlisted" },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    shortlisted: "bg-purple-100 text-purple-700",
    rejected: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
};

const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const appId = (id: number) => `#APP-2026-${String(id).padStart(3, "0")}`;

const ScholarshipShortlistPage: React.FC = () => {
  const [applications, setApplications] = useState(SHORTLISTED);
  const [page, setPage] = useState(1);
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(null);
  const limit = 10;

  const totalPages = Math.max(1, Math.ceil(applications.length / limit));
  const safePage = Math.min(page, totalPages);
  const paged = applications.slice((safePage - 1) * limit, safePage * limit);

  if (applications.length === 0) {
    return (
      <div className="p-4 md:p-6 lg:p-8 min-h-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Shortlist</h1>
          <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
            <span>-</span>
            <span className="text-gray-800 font-medium">Shortlist</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-8 border border-slate-100">
          <div className="text-center py-12 text-gray-400">
            <Star className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No shortlisted applicants yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Shortlist</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Shortlist</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-600" /> Shortlisted Applicants
          </h2>
        </div>

        <div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
          <table className="w-full text-sm" style={{ minWidth: "1200px" }}>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">App ID</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-700">Full Name</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">Gender</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">Ethnicity</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">Province</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">District</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">Stream</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">Exam Center</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">GPA</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">School Type</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">Status</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="text-center py-3 px-3 font-mono font-medium text-blue-600">{appId(app.id)}</td>
                  <td className="py-3 px-3 font-medium text-gray-900">{app.firstName} {app.lastName}</td>
                  <td className="text-center py-3 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${app.gender === "Female" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"}`}>{app.gender}</span>
                  </td>
                  <td className="text-center py-3 px-3 text-gray-600">{app.ethnicity}</td>
                  <td className="text-center py-3 px-3 text-gray-600">{app.province}</td>
                  <td className="text-center py-3 px-3 text-gray-600">{app.district}</td>
                  <td className="text-center py-3 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${app.stream === "Management" ? "bg-indigo-100 text-indigo-700" : "bg-cyan-100 text-cyan-700"}`}>{app.stream}</span>
                  </td>
                  <td className="text-center py-3 px-3 text-gray-600">{app.examCenter}</td>
                  <td className="text-center py-3 px-3 font-bold text-green-600">{app.gpa.toFixed(2)}</td>
                  <td className="text-center py-3 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      app.schoolType === "Private" ? "bg-blue-100 text-blue-700" :
                      app.schoolType === "Public" ? "bg-green-100 text-green-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{app.schoolType}</span>
                  </td>
                  <td className="text-center py-3 px-3">
                    <span className={`${statusBadge(app.status)} px-2 py-1 rounded text-xs font-semibold`}>{statusLabel(app.status)}</span>
                  </td>
                  <td className="text-center py-3 px-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedApplicantId(app.id)}
                        className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{(safePage - 1) * limit + 1}-{Math.min(safePage * limit, applications.length)}</span> of <span className="font-medium">{applications.length}</span> shortlisted
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${safePage === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipShortlistPage;
