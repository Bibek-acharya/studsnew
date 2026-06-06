"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  School, Plus, Search, ChevronLeft, ChevronRight,
  Trash2, Edit, CheckCircle, Loader2, MapPin, Star,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface UniversityItem {
  id: number;
  name: string;
  location: string;
  type: string;
  rank: number;
  rating: number;
  review_count: number;
  verified: boolean;
  popular: boolean;
  status: string;
  website: string;
  established: string;
  logo: string;
  cover: string;
  created_at: string;
}

interface ApiResponse {
  data: { universities: UniversityItem[] };
}

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-gray-100 text-gray-600",
};

const TYPE_STYLES: Record<string, string> = {
  Public: "bg-blue-100 text-blue-700",
  Private: "bg-orange-100 text-orange-700",
  Community: "bg-purple-100 text-purple-700",
  Constituent: "bg-teal-100 text-teal-700",
};

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm";

async function superadminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("superadmin_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, credentials: "include" });
  if (response.status === 401 || response.status === 403) throw new Error("auth_required");
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { throw new Error("Unexpected response"); }
  if (!response.ok) throw new Error(data.message || data.error || "Request failed");
  return data as T;
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function getInitialsColors(name: string): string {
  const colors = [
    "from-blue-400 to-blue-600", "from-purple-400 to-purple-600",
    "from-orange-400 to-orange-600", "from-green-400 to-green-600",
    "from-pink-400 to-pink-600", "from-teal-400 to-teal-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function ListUniversitiesSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null; name: string }>({ open: false, id: null, name: "" });

  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    setAuthError(false);
    try {
      const params = new URLSearchParams();
      params.set("status", "published");
      if (searchQuery) params.set("search", searchQuery);
      if (typeFilter) params.set("type", typeFilter);
      const qs = params.toString();
      const response = await superadminFetch<ApiResponse>(`/api/v1/admin/universities?${qs}`);
      setUniversities(response.data?.universities || []);
    } catch (error) {
      if (error instanceof Error && error.message === "auth_required") setAuthError(true);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, typeFilter]);

  useEffect(() => { fetchUniversities(); }, [fetchUniversities]);
  useEffect(() => { setCurrentPage(1); }, [searchQuery, typeFilter]);

  const handleDelete = async (id: number) => {
    try {
      await superadminFetch(`/api/v1/admin/universities/${id}`, { method: "DELETE" });
      showActionMsg("success", "University deleted successfully");
      fetchUniversities();
    } catch {
      showActionMsg("error", "Failed to delete university");
    }
    setDeleteDialog({ open: false, id: null, name: "" });
  };

  const showActionMsg = (type: "success" | "error", text: string) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 4000);
  };

  const totalPages = Math.ceil(universities.length / perPage);
  const paginated = universities.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-[90rem] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">List Universities</h2>
            <p className="text-sm text-gray-500 mt-1">Manage all published universities.</p>
          </div>
          <button
            onClick={() => setActiveSection("create-universities")}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition text-sm"
          >
            <Plus size={16} /> Create University
          </button>
        </div>

        {actionMsg && (
          <div className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${actionMsg.type === "success" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
            <i className={`fa-solid ${actionMsg.type === "success" ? "fa-check-circle text-green-600" : "fa-exclamation-circle text-red-600"}`}></i> {actionMsg.text}
          </div>
        )}

        <div className="bg-white rounded-md border border-gray-200">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text" className={`${inputClass} pl-9`} placeholder="Search universities by name or location..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select className={`${inputClass} sm:w-48`} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Community">Community</option>
              <option value="Constituent">Constituent</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-blue-500" />
            </div>
          ) : authError ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
              <i className="fa-solid fa-lock text-4xl"></i>
              <p className="text-sm">Authentication required. Please log in again.</p>
            </div>
          ) : universities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <School size={48} className="stroke-1" />
              <p className="text-sm font-medium">No published universities found</p>
              <button onClick={() => setActiveSection("create-universities")} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                <Plus size={14} className="inline mr-1" /> Create your first university
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">University</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Location</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600">Rank</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600">Rating</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((uni) => (
                      <tr key={uni.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {uni.logo ? (
                              <img src={uni.logo} alt="" className="w-9 h-9 rounded-lg object-cover border border-gray-200" />
                            ) : (
                              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${getInitialsColors(uni.name)} flex items-center justify-center text-white text-[11px] font-bold`}>
                                {getInitials(uni.name)}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-800">{uni.name}</p>
                              {uni.website && <p className="text-xs text-gray-400 truncate max-w-[200px]">{uni.website}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {uni.location ? (
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <MapPin size={13} className="text-gray-400 shrink-0" />
                              <span>{uni.location}</span>
                            </div>
                          ) : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          {uni.type ? (
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLES[uni.type] || "bg-gray-100 text-gray-600"}`}>
                              {uni.type}
                            </span>
                          ) : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-gray-800">{uni.rank || "—"}</td>
                        <td className="px-4 py-3 text-center">
                          {uni.rating > 0 ? (
                            <div className="inline-flex items-center gap-1">
                              <Star size={13} className="fill-amber-400 text-amber-400" />
                              <span className="font-semibold text-gray-800">{uni.rating}</span>
                            </div>
                          ) : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[uni.status] || "bg-blue-100 text-blue-700"}`}>
                            {uni.verified && <CheckCircle size={11} />}
                            {uni.status || "published"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setActiveSection(`edit-university-${uni.id}`)}
                              className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteDialog({ open: true, id: uni.id, name: uni.name })}
                              className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Showing {paginated.length > 0 ? `${(currentPage - 1) * perPage + 1}–${Math.min(currentPage * perPage, universities.length)}` : "0"} of {universities.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-600 px-2">{currentPage} / {totalPages || 1}</span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete University</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete <strong>{deleteDialog.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteDialog({ open: false, id: null, name: "" })}
                className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
