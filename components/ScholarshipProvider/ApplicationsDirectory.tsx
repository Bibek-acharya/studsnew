"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FileText, Clock, CheckCircle, Users, XCircle, Search, Download, Mail, Trash2, Eye, Check, X, Star } from "lucide-react";
import SectionCard from "./common/SectionCard";
import Avatar from "./common/Avatar";
import { scholarshipProviderApi, ProviderApplication, ProviderScholarship } from "@/services/scholarshipProviderApi";

interface ApplicationsDirectoryProps {
  onReviewStudent: (id: string) => void;
}

export default function ApplicationsDirectory({ onReviewStudent }: ApplicationsDirectoryProps) {
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [scholarships, setScholarships] = useState<ProviderScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [scholarshipFilter, setScholarshipFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [appsRes, schRes] = await Promise.all([
          scholarshipProviderApi.getApplications({ page, limit, status: statusFilter || undefined, scholarship_id: scholarshipFilter || undefined }),
          scholarshipProviderApi.getScholarships(1, 50),
        ]);
        setApplications(appsRes.applications);
        setTotal(appsRes.meta.total);
        setScholarships(schRes.scholarships);
      } catch {
        setApplications([]);
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page, statusFilter, scholarshipFilter]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      approved: applications.filter((a) => a.status === "approved").length,
      shortlisted: applications.filter((a) => a.status === "shortlisted").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    };
  }, [applications]);

  const handleStatusChange = useCallback(async (id: number, newStatus: string) => {
    try {
      await scholarshipProviderApi.updateApplicationStatus(id, newStatus);
      setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)));
    } catch {
      alert("Failed to update status");
    }
  }, []);

  const totalPages = Math.ceil(total / limit);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      shortlisted: "bg-purple-100 text-purple-700",
      rejected: "bg-red-100 text-red-700",
      under_review: "bg-blue-100 text-blue-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  const statusLabel = (status: string) => status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-6">
      <SectionCard>
        {/* Header with Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Manage Applications
          </h2>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600" value={scholarshipFilter} onChange={(e) => { setScholarshipFilter(e.target.value); setPage(1); }}>
              <option value="">All Scholarships</option>
              {scholarships.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
            <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="shortlisted">Shortlisted</option>
            </select>
            <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2 focus-within:border-blue-600 w-80">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search by name, email, or application ID..." className="bg-transparent border-none outline-none text-sm ml-2 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Applications</p>
                <p className="text-2xl font-bold text-slate-900">{total.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Shortlisted</p>
                <p className="text-2xl font-bold text-purple-600">{stats.shortlisted}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input type="checkbox" className="rounded w-4 h-4" />
            <span className="text-sm text-slate-600">Select All</span>
            <span className="text-sm text-slate-400">|</span>
            <span className="text-sm text-slate-600">0 selected</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-lg transition text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-lg transition text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Selected
            </button>
            <button className="border border-red-300 hover:bg-red-50 text-red-600 font-medium py-2 px-4 rounded-lg transition text-sm flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>

        {/* Applications Table */}
        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading applications...</div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700"><input type="checkbox" className="rounded" /></th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Applicant</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Application ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Scholarship</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Province</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Stream</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">GPA</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Submitted</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.length === 0 ? (
                    <tr><td colSpan={10} className="py-8 text-center text-slate-500">No applications found</td></tr>
                  ) : applications.map((app) => {
                    const initials = `${app.first_name?.[0] || ""}${app.last_name?.[0] || ""}`;
                    return (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4"><input type="checkbox" className="rounded" /></td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">{initials}</div>
                            <div>
                              <p className="font-medium text-slate-900">{app.first_name} {app.last_name}</p>
                              <p className="text-xs text-slate-500">{app.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">#SCH-2026-{String(app.id).padStart(3, "0")}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-900">{app.scholarship?.title || "N/A"}</span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{(app as any).province || "N/A"}</span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{(app as any).stream || "N/A"}</span>
                        </td>
                        <td className="text-center py-3 px-4 font-bold text-slate-900">{(app as any).gpa ? (app as any).gpa.toFixed(2) : "N/A"}</td>
                        <td className="text-center py-3 px-4 text-slate-500">{app.created_at ? new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}</td>
                        <td className="text-center py-3 px-4">
                          <span className={`${statusBadge(app.status)} px-3 py-1 rounded-full text-xs font-semibold`}>{statusLabel(app.status)}</span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="View Details" onClick={() => onReviewStudent(String(app.id))}>
                              <Eye className="w-4 h-4" />
                            </button>
                            {app.status !== "approved" && (
                              <button className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Approve" onClick={() => handleStatusChange(app.id, "approved")}>
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            {app.status !== "rejected" && (
                              <button className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Reject" onClick={() => handleStatusChange(app.id, "rejected")}>
                                <X className="w-4 h-4" />
                              </button>
                            )}
                            {app.status === "pending" && (
                              <button className="p-1.5 hover:bg-purple-50 rounded text-purple-600" title="Shortlist" onClick={() => handleStatusChange(app.id, "shortlisted")}>
                                <Star className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center gap-4">
                <p className="text-sm text-slate-500">Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of {total.toLocaleString()} applications</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={`px-3 py-1.5 rounded-lg text-sm ${p === page ? "bg-blue-600 text-white" : "border border-slate-300 hover:bg-slate-50"}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                {totalPages > 5 && <span className="text-slate-400">...</span>}
                {totalPages > 5 && <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm hover:bg-slate-50" onClick={() => setPage(totalPages)}>{totalPages}</button>}
                <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
              </div>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
