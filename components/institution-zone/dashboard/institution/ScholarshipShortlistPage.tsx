"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Home, Star, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface ShortlistedApplicant {
  id: number;
  user_id: number;
  scholarship_id: number;
  status: string;
  created_at: string;
  scholarship?: { title: string };
  user?: { first_name: string; last_name: string; email: string };
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    shortlisted: "bg-purple-100 text-purple-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
};

const ScholarshipShortlistPage: React.FC = () => {
  const [data, setData] = useState<ShortlistedApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const token = typeof window !== "undefined" ? localStorage.getItem("institutionToken") : null;

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(`${API_BASE_URL}/api/v1/institution/scholarship-applications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setData((d?.data || []).filter((a: any) => a.status === "shortlisted")))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/institution/scholarship-applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setData(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (e) { console.error(e); }
  };

  const filtered = useMemo(() => {
    let items = data.filter(a => a.status === "shortlisted");
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(a =>
        a.user?.first_name?.toLowerCase().includes(s) ||
        a.user?.last_name?.toLowerCase().includes(s) ||
        a.scholarship?.title?.toLowerCase().includes(s)
      );
    }
    return items;
  }, [data, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Scholarship Shortlist</h1>
          <p className="text-sm text-gray-500 mt-1">Manage shortlisted scholarship applicants</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-wrap items-center gap-4">
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none" />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400"><p className="text-sm">Loading...</p></div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-400"><Star className="w-12 h-12 mx-auto mb-3 opacity-40" /><p className="text-sm">No shortlisted applicants.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Applicant</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Scholarship</th>
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
                    <td className="text-center py-3 px-6"><span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge(a.status)}`}>Shortlisted</span></td>
                    <td className="text-center py-3 px-6">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => updateStatus(a.id, "approved")} className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Approve">✓</button>
                        <button onClick={() => updateStatus(a.id, "rejected")} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Reject">✕</button>
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
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 border rounded disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 border rounded disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipShortlistPage;
