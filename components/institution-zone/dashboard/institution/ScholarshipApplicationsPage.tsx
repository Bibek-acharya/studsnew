"use client";

import React, { useState, useMemo } from "react";
import { Home, Search, Eye, CheckCircle, XCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Application {
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

const APPLICATIONS: Application[] = [
  { id: 1, firstName: "Aarav", lastName: "Sharma", gender: "Male", ethnicity: "Bahun", province: "Bagmati", district: "Kathmandu", stream: "Science", examCenter: "Kathmandu", gpa: 3.8, schoolType: "Private", scholarship: "Merit Excellence", status: "pending" },
  { id: 2, firstName: "Priya", lastName: "Patel", gender: "Female", ethnicity: "Madhesi", province: "Madhesh", district: "Dhanusha", stream: "Management", examCenter: "Janakpur", gpa: 3.9, schoolType: "Public", scholarship: "Women in STEM", status: "approved" },
  { id: 3, firstName: "Rohan", lastName: "Thapa", gender: "Male", ethnicity: "Chhetri", province: "Gandaki", district: "Kaski", stream: "Science", examCenter: "Pokhara", gpa: 3.2, schoolType: "Private", scholarship: "Need-Based Aid", status: "shortlisted" },
  { id: 4, firstName: "Sneha", lastName: "Adhikari", gender: "Female", ethnicity: "Bahun", province: "Bagmati", district: "Lalitpur", stream: "Humanities", examCenter: "Patan", gpa: 3.5, schoolType: "Private", scholarship: "Rural Education", status: "rejected" },
  { id: 5, firstName: "Kiran", lastName: "Gurung", gender: "Male", ethnicity: "Magar", province: "Lumbini", district: "Rupandehi", stream: "Management", examCenter: "Bhairahawa", gpa: 3.1, schoolType: "Community", scholarship: "Sports Achievement", status: "pending" },
  { id: 6, firstName: "Anita", lastName: "Rai", gender: "Female", ethnicity: "Rai", province: "Koshi", district: "Morang", stream: "Science", examCenter: "Biratnagar", gpa: 3.7, schoolType: "Private", scholarship: "Research Fellowship", status: "approved" },
  { id: 7, firstName: "Sita", lastName: "Lama", gender: "Female", ethnicity: "Tamang", province: "Bagmati", district: "Kathmandu", stream: "Education", examCenter: "Kathmandu", gpa: 3.4, schoolType: "Public", scholarship: "Merit Excellence", status: "pending" },
  { id: 8, firstName: "Bishal", lastName: "KC", gender: "Male", ethnicity: "Chhetri", province: "Karnali", district: "Surkhet", stream: "Science", examCenter: "Surkhet", gpa: 3.6, schoolType: "Public", scholarship: "Full Funded", status: "shortlisted" },
  { id: 9, firstName: "Deepa", lastName: "Shrestha", gender: "Female", ethnicity: "Bahun", province: "Bagmati", district: "Bhaktapur", stream: "Management", examCenter: "Bhaktapur", gpa: 3.3, schoolType: "Private", scholarship: "Need-Based Aid", status: "pending" },
  { id: 10, firstName: "Raj", lastName: "Maharjan", gender: "Male", ethnicity: "Madhesi", province: "Madhesh", district: "Dhanusha", stream: "Science", examCenter: "Janakpur", gpa: 3.0, schoolType: "Community", scholarship: "Scholarship", status: "pending" },
  { id: 11, firstName: "Maya", lastName: "Tamang", gender: "Female", ethnicity: "Tamang", province: "Bagmati", district: "Nuwakot", stream: "Humanities", examCenter: "Kathmandu", gpa: 3.5, schoolType: "Public", scholarship: "Women Scholarship", status: "approved" },
  { id: 12, firstName: "Prakash", lastName: "Neupane", gender: "Male", ethnicity: "Bahun", province: "Gandaki", district: "Kaski", stream: "Science", examCenter: "Pokhara", gpa: 3.8, schoolType: "Private", scholarship: "Merit Excellence", status: "shortlisted" },
];

const GENDER_OPTIONS = ["Male", "Female"];
const ETHNICITY_OPTIONS = ["Bahun", "Chhetri", "Magar", "Tamang", "Gurung", "Rai", "Tharu", "Madhesi", "Dalit"];
const PROVINCE_OPTIONS = ["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];
const DISTRICT_OPTIONS = ["Kathmandu", "Lalitpur", "Kaski", "Chitwan", "Morang", "Sunsari", "Rupandehi", "Dhanusha", "Surkhet", "Bhaktapur", "Nuwakot", "Patan"];
const SCHOOL_TYPE_OPTIONS = ["Private", "Public", "Community"];
const STATUS_OPTIONS = ["Pending", "Shortlisted", "Approved", "Rejected"];

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

const ScholarshipApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState(APPLICATIONS);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterEthnicity, setFilterEthnicity] = useState("");
  const [filterProvince, setFilterProvince] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterSchool, setFilterSchool] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filtered = applications.filter((a) => {
    const name = `${a.firstName} ${a.lastName}`.toLowerCase();
    if (search && !name.includes(search.toLowerCase())) return false;
    if (filterGender && a.gender !== filterGender) return false;
    if (filterEthnicity && a.ethnicity !== filterEthnicity) return false;
    if (filterProvince && a.province !== filterProvince) return false;
    if (filterDistrict && a.district !== filterDistrict) return false;
    if (filterSchool && a.schoolType !== filterSchool) return false;
    if (filterStatus && a.status !== filterStatus.toLowerCase()) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * limit, safePage * limit);

  const clearFilters = () => {
    setSearch("");
    setFilterGender("");
    setFilterEthnicity("");
    setFilterProvince("");
    setFilterDistrict("");
    setFilterSchool("");
    setFilterStatus("");
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    toast.success(`Status updated to ${statusLabel(newStatus)}`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Manage Application</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Manage Application</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" /> Application Directory
          </h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-xs font-semibold text-gray-700 mr-1">Filters:</span>
          <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500">
            <option value="">All Gender</option>
            {GENDER_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterEthnicity} onChange={(e) => setFilterEthnicity(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500">
            <option value="">All Ethnicity</option>
            {ETHNICITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterProvince} onChange={(e) => setFilterProvince(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500">
            <option value="">All Province</option>
            {PROVINCE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500">
            <option value="">All District</option>
            {DISTRICT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterSchool} onChange={(e) => setFilterSchool(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500">
            <option value="">All School Type</option>
            {SCHOOL_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-500">
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <button onClick={clearFilters} className="text-xs text-blue-600 font-medium hover:underline">Clear All</button>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} applications</span>
        </div>

        <div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
          <table className="w-full text-sm" style={{ minWidth: "1400px" }}>
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
                <th className="text-center py-3 px-3 font-semibold text-gray-700">Final Status</th>
                <th className="text-center py-3 px-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.length === 0 ? (
                <tr><td colSpan={12} className="py-8 text-center text-slate-500">No applications found</td></tr>
              ) : paged.map((app) => (
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
                      <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="View Profile">
                        <Eye className="w-4 h-4" />
                      </button>
                      {(app.status === "pending") && (
                        <>
                          <button onClick={() => handleStatusChange(app.id, "approved")} className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleStatusChange(app.id, "rejected")} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {app.status === "approved" && (
                        <button onClick={() => handleStatusChange(app.id, "shortlisted")} className="p-1.5 hover:bg-purple-50 rounded text-purple-600" title="Shortlist">
                          <Star className="w-4 h-4" />
                        </button>
                      )}
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
              Showing <span className="font-medium">{(safePage - 1) * limit + 1}-{Math.min(safePage * limit, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> applications
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

export default ScholarshipApplicationsPage;
