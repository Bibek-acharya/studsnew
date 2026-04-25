"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Star, Search, Filter, Check, X, Eye, Download, FileText } from "lucide-react";
import SectionCard from "./common/SectionCard";
import Badge from "./common/Badge";
import Button from "./common/Button";
import Avatar from "./common/Avatar";
import { scholarshipProviderApi, ProviderApplication } from "@/services/scholarshipProviderApi";

const ShortlistManagement: React.FC = memo(() => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shortlist, setShortlist] = useState<ProviderApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      try {
        const res = await scholarshipProviderApi.getApplications({ page: 1, limit: 100 });
        setShortlist(res.applications);
      } catch {
        setShortlist([]);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const filtered = useMemo(() => {
    return shortlist.filter((s) => {
      const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
      const matchSearch = fullName.includes(search.toLowerCase()) || s.scholarship?.title?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, shortlist]);

  const updateStatus = useCallback(async (id: number, status: string) => {
    try {
      await scholarshipProviderApi.updateApplicationStatus(id, status);
      setShortlist((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    } catch {
      alert("Failed to update status");
    }
  }, []);

  const statusVariant = (s: string) => {
    if (s === "approved") return "green";
    if (s === "shortlisted") return "blue";
    if (s === "rejected") return "red";
    return "gray";
  };

  return (
    <div className="space-y-6">
      <SectionCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-600" /> Manage Shortlist
          </h2>
          <Button variant="outline"><Download className="w-4 h-4" /> Export</Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 flex items-center border border-slate-200 rounded-lg px-3 py-2 focus-within:border-blue-600">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search candidates..." className="bg-transparent border-none outline-none text-sm ml-2 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading shortlist...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Candidate</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Scholarship</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Date</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-500">No candidates found</td></tr>
                ) : filtered.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={`${candidate.first_name} ${candidate.last_name}`} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900">{candidate.first_name} {candidate.last_name}</p>
                          <p className="text-xs text-slate-500">{candidate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{candidate.scholarship?.title || "N/A"}</td>
                    <td className="text-center py-3 px-4"><Badge variant={statusVariant(candidate.status) as any}>{candidate.status}</Badge></td>
                    <td className="text-center py-3 px-4 text-slate-500">{new Date(candidate.created_at).toLocaleDateString()}</td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-green-50 rounded text-green-600" onClick={() => updateStatus(candidate.id, "approved")} title="Approve"><Check className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-red-50 rounded text-red-600" onClick={() => updateStatus(candidate.id, "rejected")} title="Reject"><X className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
});

ShortlistManagement.displayName = "ShortlistManagement";

export default ShortlistManagement;
