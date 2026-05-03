"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { Home, Star, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { scholarshipProviderApi, ProviderApplication } from "@/services/scholarshipProviderApi";
import { toast } from "sonner";

const ShortlistManagement: React.FC = memo(() => {
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await scholarshipProviderApi.getApplications({ page: 1, limit: 100 });
        setApplications(res.applications.filter((a) => a.status === "shortlisted" || a.status === "approved" || a.status === "rejected"));
      } catch {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const shortlisted = applications.filter((a) => a.status === "shortlisted");
  const totalPages = Math.ceil(shortlisted.length / limit);
  const paged = shortlisted.slice((page - 1) * limit, page * limit);

  const updateStatus = useCallback(async (id: number, status: string) => {
    try {
      await scholarshipProviderApi.updateApplicationStatus(id, status);
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      const user = applications.find(a => a.id === id);
      const name = user ? `${user.first_name} ${user.last_name}` : "User";
      toast.success(status === 'approved' ? `You have shortlisted ${name}.` : `You have rejected ${name}'s application.`);
    } catch {
      toast.error("Failed to update status");
    }
  }, []);

  const appId = (idx: number) => `#APP-2026-${String(idx + 1).padStart(3, "0")}`;

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading shortlist...</div>;
  }

  return (
    <div className="space-y-6">
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

        {shortlisted.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Star className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No shortlisted applicants yet</p>
            <p className="text-xs mt-1">
              Click the <span className="text-purple-600 font-medium"><Star className="w-3 h-3 inline" /> Shortlist</span> button in Manage Application to add here
            </p>
          </div>
        ) : (
          <>
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
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">GPA</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">School Type</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paged.map((app, idx) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="text-center py-3 px-3 font-mono font-medium text-blue-600">{appId((page - 1) * limit + idx)}</td>
                      <td className="py-3 px-3 font-medium text-gray-900">{app.first_name} {app.last_name}</td>
                      <td className="text-center py-3 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${app.gender === "Female" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"}`}>{app.gender || "N/A"}</span>
                      </td>
                      <td className="text-center py-3 px-3 text-gray-600">{(app as any).ethnicity || "-"}</td>
                      <td className="text-center py-3 px-3 text-gray-600">{app.province || "-"}</td>
                      <td className="text-center py-3 px-3 text-gray-600">{(app as any).district || "-"}</td>
                      <td className="text-center py-3 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${app.stream === "Management" ? "bg-indigo-100 text-indigo-700" : "bg-cyan-100 text-cyan-700"}`}>{app.stream || "N/A"}</span>
                      </td>
                      <td className="text-center py-3 px-3 font-bold text-green-600">{app.gpa?.toFixed(2) || "-"}</td>
                      <td className="text-center py-3 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          app.school_type === "Private" ? "bg-blue-100 text-blue-700" :
                          app.school_type === "Public" ? "bg-green-100 text-green-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>{app.school_type || "N/A"}</span>
                      </td>
                      <td className="text-center py-3 px-3">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="View Profile">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => updateStatus(app.id, "approved")} className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => updateStatus(app.id, "rejected")} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Reject">
                            <XCircle className="w-4 h-4" />
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
                <p className="text-sm text-gray-500">Showing <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, shortlisted.length)}</span> of <span className="font-medium">{shortlisted.length}</span> shortlisted</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

ShortlistManagement.displayName = "ShortlistManagement";

export default ShortlistManagement;
