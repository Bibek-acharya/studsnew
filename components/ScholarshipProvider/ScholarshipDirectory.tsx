"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Search, Edit, Trash2, Eye, Users, Calendar, CheckCircle, FilePen } from "lucide-react";
import SectionCard from "./common/SectionCard";
import { scholarshipProviderApi, ProviderScholarship } from "@/services/scholarshipProviderApi";

const ScholarshipDirectory: React.FC = memo(() => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scholarships, setScholarships] = useState<ProviderScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    async function fetchScholarships() {
      setLoading(true);
      try {
        const res = await scholarshipProviderApi.getScholarships(page, limit);
        setScholarships(res.scholarships);
        setTotal(res.meta.total);
      } catch {
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    }
    fetchScholarships();
  }, [page]);

  const filtered = useMemo(() => {
    return scholarships.filter((s) => {
      const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [scholarships, search, statusFilter]);

  const stats = useMemo(() => ({
    total: total,
    active: scholarships.filter((s) => s.status === "active").length,
    draft: scholarships.filter((s) => s.status === "draft").length,
    finished: scholarships.filter((s) => s.status === "finished").length,
  }), [scholarships, total]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Delete this scholarship?")) return;
    try {
      await scholarshipProviderApi.deleteScholarship(id);
      setScholarships((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Failed to delete scholarship");
    }
  }, []);

  const totalPages = Math.ceil(total / limit);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      draft: "bg-gray-100 text-gray-700",
      finished: "bg-purple-100 text-purple-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <SectionCard>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" /> Scholarship Directory
          </h2>
          <span className="text-sm text-slate-500">Showing {filtered.length} of {total} scholarships</span>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Scholarships</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Draft</p>
                <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <FilePen className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Finished</p>
                <p className="text-2xl font-bold text-purple-600">{stats.finished}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 flex items-center border border-slate-200 rounded-lg px-3 py-2 focus-within:border-blue-600">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search scholarships..." className="bg-transparent border-none outline-none text-sm ml-2 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="finished">Finished</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading scholarships...</div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Scholarship</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Type</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Deadline</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Applications</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Created</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-slate-500">No scholarships found</td></tr>
                ) : filtered.map((sch) => (
                  <tr key={sch.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {sch.image_url && <img src={sch.image_url} alt={sch.title} className="w-16 h-12 object-cover rounded-lg" />}
                        <div>
                          <p className="font-medium text-slate-900">{sch.title}</p>
                          <p className="text-xs text-slate-500">{sch.location || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{sch.scholarship_type || "N/A"}</span>
                    </td>
                    <td className="text-center py-3 px-4 text-slate-500">{sch.deadline ? new Date(sch.deadline).toLocaleDateString() : "N/A"}</td>
                    <td className="text-center py-3 px-4">
                      <span className="flex items-center justify-center gap-1 text-slate-600"><Users className="w-3 h-3" />{sch.applications_count}</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`${statusBadge(sch.status)} px-3 py-1 rounded-full text-xs font-semibold`}>{sch.status}</span>
                    </td>
                    <td className="text-center py-3 px-4 text-slate-500">{new Date(sch.created_at).toLocaleDateString()}</td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Delete" onClick={() => handleDelete(sch.id)}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
                <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
                  <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
                </div>
              </div>
            )}
          </div>
        )}
      </SectionCard>
    </div>
  );
});

ScholarshipDirectory.displayName = "ScholarshipDirectory";

export default ScholarshipDirectory;
