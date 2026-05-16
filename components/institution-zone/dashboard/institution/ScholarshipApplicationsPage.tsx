"use client";

import React, { useState, useEffect } from "react";
import { Search, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight, Star } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface ScholarshipApp {
  id: number;
  scholarship_id: number;
  user_id: number;
  status: string;
  cover_letter: string;
  created_at: string;
  scholarship?: { id: number; title: string };
  user?: { id: number; first_name: string; last_name: string; email: string };
}

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

const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ");

const ScholarshipApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<ScholarshipApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [detailModal, setDetailModal] = useState<ScholarshipApp | null>(null);
  const perPage = 10;

  const fetchApps = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("institutionToken");
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`${API_BASE_URL}/api/v1/institution/scholarship-applications?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setApplications(data?.data || []);
    } catch { setApplications([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchApps(); }, [statusFilter]);

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("institutionToken");
      await fetch(`${API_BASE_URL}/api/v1/institution/scholarship-applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (e) { console.error(e); }
  };

  const filtered = applications.filter(a =>
    !search || a.user?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.user?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.scholarship?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Scholarship Applications</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-wrap items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400"><p className="text-sm">Loading...</p></div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No scholarship applications found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Applicant</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Scholarship</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">Applied</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6">
                      <p className="font-medium text-gray-900">{a.user ? `${a.user.first_name} ${a.user.last_name}` : `User #${a.user_id}`}</p>
                      <p className="text-xs text-gray-500">{a.user?.email || ""}</p>
                    </td>
                    <td className="py-3 px-6 text-gray-600">{a.scholarship?.title || "-"}</td>
                    <td className="text-center py-3 px-6 text-gray-500 text-xs">{new Date(a.created_at).toLocaleDateString()}</td>
                    <td className="text-center py-3 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge(a.status)}`}>{statusLabel(a.status)}</span>
                    </td>
                    <td className="text-center py-3 px-6">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setDetailModal(a)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
                        {a.status === "pending" && (
                          <>
                            <button onClick={() => updateStatus(a.id, "shortlisted")} className="p-1.5 hover:bg-purple-50 rounded text-purple-600" title="Shortlist"><Star className="w-4 h-4" /></button>
                            <button onClick={() => updateStatus(a.id, "approved")} className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                            <button onClick={() => updateStatus(a.id, "rejected")} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Reject"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDetailModal(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Application Details</h3>
              <button onClick={() => setDetailModal(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium">Applicant:</span> {detailModal.user ? `${detailModal.user.first_name} ${detailModal.user.last_name}` : `User #${detailModal.user_id}`}</div>
              <div><span className="font-medium">Email:</span> {detailModal.user?.email || "-"}</div>
              <div><span className="font-medium">Scholarship:</span> {detailModal.scholarship?.title || "-"}</div>
              <div><span className="font-medium">Status:</span> <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusBadge(detailModal.status)}`}>{statusLabel(detailModal.status)}</span></div>
              <div><span className="font-medium">Applied:</span> {new Date(detailModal.created_at).toLocaleDateString()}</div>
              {detailModal.cover_letter && <div><span className="font-medium">Cover Letter:</span><p className="mt-1 text-gray-600">{detailModal.cover_letter}</p></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarshipApplicationsPage;
