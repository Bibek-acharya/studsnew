"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  School, Search, ChevronLeft, ChevronRight,
  Trash2, Loader2, Star, MessageSquare, AlertTriangle,
  FileText, Eye, X, CheckCircle, XCircle,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface UniversityItem {
  id: number;
  name: string;
  logo: string;
  rating: number;
  review_count: number;
}

interface ReviewItem {
  id: number;
  user_name: string;
  user_initials: string;
  rating: number;
  pros: string;
  cons: string;
  created_at: string;
}

interface DateReport {
  id: number;
  contact: string;
  feedback: string;
  file_url?: string;
  university_id: number;
  university_name?: string;
  created_at: string;
  status: "pending" | "resolved" | "dismissed";
}

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

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  dismissed: "bg-gray-100 text-gray-600",
};

export default function UniversityReviewSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const [activeTab, setActiveTab] = useState<"reviews" | "date-reports">("reviews");
  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [selectedUni, setSelectedUni] = useState<UniversityItem | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [dateReports, setDateReports] = useState<DateReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: "review" | "report"; id: number | null; name: string }>({ open: false, type: "review", id: null, name: "" });
  const [reportDetail, setReportDetail] = useState<DateReport | null>(null);

  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    setAuthError(false);
    try {
      const params = new URLSearchParams();
      params.set("status", "published");
      if (searchQuery) params.set("search", searchQuery);
      const qs = params.toString();
      const response = await superadminFetch<{ data: { universities: UniversityItem[] } }>(`/api/v1/admin/universities?${qs}`);
      setUniversities(response.data?.universities || []);
    } catch (error) {
      if (error instanceof Error && error.message === "auth_required") setAuthError(true);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const fetchReviews = useCallback(async (universityId: number) => {
    setReviewsLoading(true);
    try {
      const response = await superadminFetch<{ data: { reviews: ReviewItem[] } }>(`/api/v1/admin/university-reviews/${universityId}`);
      setReviews(response.data?.reviews || []);
    } catch {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  const fetchDateReports = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const response = await superadminFetch<{ data: { reports: DateReport[] } }>(`/api/v1/admin/date-reports`);
      setDateReports(response.data?.reports || []);
    } catch {
      setDateReports([]);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  useEffect(() => { fetchUniversities(); }, [fetchUniversities]);
  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedUni]);

  useEffect(() => {
    if (selectedUni) {
      fetchReviews(selectedUni.id);
    }
  }, [selectedUni, fetchReviews]);

  useEffect(() => {
    if (activeTab === "date-reports") {
      fetchDateReports();
    }
  }, [activeTab, fetchDateReports]);

  const handleDeleteReview = async (id: number) => {
    try {
      await superadminFetch(`/api/v1/admin/university-reviews/${id}`, { method: "DELETE" });
      showActionMsg("success", "Review deleted successfully");
      if (selectedUni) fetchReviews(selectedUni.id);
    } catch {
      showActionMsg("error", "Failed to delete review");
    }
    setDeleteDialog({ open: false, type: "review", id: null, name: "" });
  };

  const handleDeleteReport = async (id: number) => {
    try {
      await superadminFetch(`/api/v1/admin/date-reports/${id}`, { method: "DELETE" });
      showActionMsg("success", "Report deleted successfully");
      fetchDateReports();
    } catch {
      showActionMsg("error", "Failed to delete report");
    }
    setDeleteDialog({ open: false, type: "report", id: null, name: "" });
  };

  const handleUpdateReportStatus = async (id: number, status: "resolved" | "dismissed") => {
    try {
      await superadminFetch(`/api/v1/admin/date-reports/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      showActionMsg("success", `Report ${status}`);
      fetchDateReports();
      if (reportDetail?.id === id) {
        setReportDetail({ ...reportDetail, status });
      }
    } catch {
      showActionMsg("error", "Failed to update report");
    }
  };

  const showActionMsg = (type: "success" | "error", text: string) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 4000);
  };

  const filteredUniversities = universities.filter((u) =>
    u.review_count > 0 || searchQuery
  );

  const paginatedUniversities = filteredUniversities.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalUniPages = Math.ceil(filteredUniversities.length / perPage);

  const paginatedReports = dateReports.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalReportPages = Math.ceil(dateReports.length / perPage);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-[90rem] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">University Reviews</h2>
            <p className="text-sm text-gray-500 mt-1">Manage user reviews and date reports.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => { setActiveTab("reviews"); setSelectedUni(null); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "reviews" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <MessageSquare size={14} className="inline mr-1.5" />
            Reviews
          </button>
          <button
            onClick={() => { setActiveTab("date-reports"); setSelectedUni(null); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "date-reports" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <AlertTriangle size={14} className="inline mr-1.5" />
            Date Reports
            {dateReports.filter((r) => r.status === "pending").length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                {dateReports.filter((r) => r.status === "pending").length}
              </span>
            )}
          </button>
        </div>

        {actionMsg && (
          <div className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${actionMsg.type === "success" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
            <i className={`fa-solid ${actionMsg.type === "success" ? "fa-check-circle text-green-600" : "fa-exclamation-circle text-red-600"}`}></i> {actionMsg.text}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <>
            {!selectedUni ? (
              <div className="bg-white rounded-md border border-gray-200">
                <div className="p-4 border-b border-gray-100">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text" className={`${inputClass} pl-9`} placeholder="Search universities..."
                      value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
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
                ) : filteredUniversities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                    <School size={48} className="stroke-1" />
                    <p className="text-sm font-medium">No universities with reviews found</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">University</th>
                            <th className="text-center px-4 py-3 font-semibold text-gray-600">Rating</th>
                            <th className="text-center px-4 py-3 font-semibold text-gray-600">Reviews</th>
                            <th className="text-right px-4 py-3 font-semibold text-gray-600">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {paginatedUniversities.map((uni) => (
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
                                  <p className="font-semibold text-gray-800">{uni.name}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {uni.rating > 0 ? (
                                  <div className="inline-flex items-center gap-1">
                                    <Star size={13} className="fill-amber-400 text-amber-400" />
                                    <span className="font-semibold text-gray-800">{uni.rating.toFixed(1)}</span>
                                  </div>
                                ) : <span className="text-gray-400">—</span>}
                              </td>
                              <td className="px-4 py-3 text-center font-semibold text-gray-800">{uni.review_count}</td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => setSelectedUni(uni)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                                >
                                  <Eye size={14} /> View Reviews
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Showing {paginatedUniversities.length > 0 ? `${(currentPage - 1) * perPage + 1}–${Math.min(currentPage * perPage, filteredUniversities.length)}` : "0"} of {filteredUniversities.length}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                          className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
                          <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm text-gray-600 px-2">{currentPage} / {totalUniPages || 1}</span>
                        <button onClick={() => setCurrentPage((p) => Math.min(totalUniPages, p + 1))} disabled={currentPage >= totalUniPages}
                          className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Selected University Header */}
                <div className="bg-white rounded-md border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setSelectedUni(null); setReviews([]); }}
                        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <X size={18} />
                      </button>
                      {selectedUni.logo ? (
                        <img src={selectedUni.logo} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                      ) : (
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getInitialsColors(selectedUni.name)} flex items-center justify-center text-white text-xs font-bold`}>
                          {getInitials(selectedUni.name)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800">{selectedUni.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          {selectedUni.rating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star size={12} className="fill-amber-400 text-amber-400" />
                              {selectedUni.rating.toFixed(1)}
                            </span>
                          )}
                          <span>{selectedUni.review_count} reviews</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="bg-white rounded-md border border-gray-200">
                  {reviewsLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 size={32} className="animate-spin text-blue-500" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                      <MessageSquare size={48} className="stroke-1" />
                      <p className="text-sm font-medium">No reviews yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {reviews.map((review) => (
                        <div key={review.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getInitialsColors(review.user_name || "User")} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                                {review.user_initials || getInitials(review.user_name || "User")}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-gray-800 text-sm">{review.user_name || "Anonymous"}</p>
                                  <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star key={star} size={12} className={`${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                                    ))}
                                  </div>
                                </div>
                                {review.pros && (
                                  <p className="text-sm text-gray-600 mb-1">
                                    <span className="text-green-600 font-medium">Pros:</span> {review.pros}
                                  </p>
                                )}
                                {review.cons && (
                                  <p className="text-sm text-gray-600">
                                    <span className="text-red-500 font-medium">Cons:</span> {review.cons}
                                  </p>
                                )}
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setDeleteDialog({ open: true, type: "review", id: review.id, name: review.user_name || "this review" })}
                              className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                              title="Delete Review"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Date Reports Tab */}
        {activeTab === "date-reports" && (
          <div className="bg-white rounded-md border border-gray-200">
            {reviewsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-blue-500" />
              </div>
            ) : dateReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                <AlertTriangle size={48} className="stroke-1" />
                <p className="text-sm font-medium">No date reports found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">University</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Contact</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Feedback</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginatedReports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-800 truncate max-w-[200px]">{report.university_name || `University #${report.university_id}`}</p>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{report.contact}</td>
                          <td className="px-4 py-3">
                            <p className="text-gray-600 truncate max-w-[250px]">{report.feedback}</p>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[report.status]}`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">
                            {new Date(report.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setReportDetail(report)}
                                className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                title="View Details"
                              >
                                <Eye size={15} />
                              </button>
                              {report.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateReportStatus(report.id, "resolved")}
                                    className="p-1.5 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                                    title="Mark Resolved"
                                  >
                                    <CheckCircle size={15} />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateReportStatus(report.id, "dismissed")}
                                    className="p-1.5 rounded-md text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                                    title="Dismiss"
                                  >
                                    <XCircle size={15} />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => setDeleteDialog({ open: true, type: "report", id: report.id, name: `report for ${report.university_name || `University #${report.university_id}`}` })}
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
                    Showing {paginatedReports.length > 0 ? `${(currentPage - 1) * perPage + 1}–${Math.min(currentPage * perPage, dateReports.length)}` : "0"} of {dateReports.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                      className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-gray-600 px-2">{currentPage} / {totalReportPages || 1}</span>
                    <button onClick={() => setCurrentPage((p) => Math.min(totalReportPages, p + 1))} disabled={currentPage >= totalReportPages}
                      className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete {deleteDialog.type === "review" ? "Review" : "Report"}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteDialog.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteDialog({ open: false, type: "review", id: null, name: "" })}
                className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => {
                if (deleteDialog.type === "review" && deleteDialog.id) handleDeleteReview(deleteDialog.id);
                else if (deleteDialog.type === "report" && deleteDialog.id) handleDeleteReport(deleteDialog.id);
              }}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {reportDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setReportDetail(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Date Report Details</h3>
              <button onClick={() => setReportDetail(null)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">University</label>
                <p className="text-sm text-gray-800 mt-1">{reportDetail.university_name || `University #${reportDetail.university_id}`}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</label>
                <p className="text-sm text-gray-800 mt-1">{reportDetail.contact}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</label>
                <p className="text-sm text-gray-600 mt-1">{reportDetail.feedback}</p>
              </div>

              {reportDetail.file_url && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Attached File</label>
                  <a href={reportDetail.file_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-1 text-sm text-blue-600 hover:text-blue-700">
                    <FileText size={14} /> View Attachment
                  </a>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                <div className="mt-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[reportDetail.status]}`}>
                    {reportDetail.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</label>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(reportDetail.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            {reportDetail.status === "pending" && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleUpdateReportStatus(reportDetail.id, "resolved")}
                  className="flex-1 px-4 py-2.5 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <CheckCircle size={14} className="inline mr-1.5" /> Mark Resolved
                </button>
                <button
                  onClick={() => handleUpdateReportStatus(reportDetail.id, "dismissed")}
                  className="flex-1 px-4 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <XCircle size={14} className="inline mr-1.5" /> Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}