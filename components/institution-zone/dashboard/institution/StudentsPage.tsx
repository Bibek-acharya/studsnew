"use client";

import React, { useState, useEffect, useCallback } from "react";
import SectionHeader from "../shared/SectionHeader";
import { X, Trash, MagnifyingGlass, Download, Clock } from "@phosphor-icons/react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("institutionToken");
}

function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: string;
  status: string;
  created_at: string;
}

interface Follower {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  image_url: string;
  followed_at: string;
}

type TabKey = "inquiries" | "followers";

const INQUIRY_TYPES = [
  "All Types",
  "Course Info",
  "Fee Structure",
  "Admission",
  "Scholarship",
  "Hostel",
];

const STATUS_OPTIONS = ["All Statuses", "New", "In Contact", "Follow Up", "Admitted", "Closed"];

function getStatusClass(status: string): string {
  switch (status) {
    case "New":
      return "bg-[#e0f2fe] text-[#0369a1]";
    case "In Contact":
      return "bg-[#fef3c7] text-[#b45309]";
    case "Follow Up":
      return "bg-[#f3e8ff] text-[#6b21a8]";
    case "Admitted":
      return "bg-[#dcfce7] text-[#15803d]";
    case "Closed":
      return "bg-[#fee2e2] text-[#b91c1c]";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getInitials(first: string, last: string): string {
  return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-orange-100 text-orange-600 border-orange-200",
    "bg-blue-100 text-blue-600 border-blue-200",
    "bg-green-100 text-green-600 border-green-200",
    "bg-purple-100 text-purple-600 border-purple-200",
    "bg-pink-100 text-pink-600 border-pink-200",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB");
}

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return diffMins <= 1 ? "Just now" : `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateStr);
}

function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
}

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("inquiries");

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiryLoading, setInquiryLoading] = useState(true);
  const [inquiryError, setInquiryError] = useState<string | null>(null);
  const [inquiryPage, setInquiryPage] = useState(1);
  const [inquiryTotal, setInquiryTotal] = useState(0);
  const [inquiryLimit, setInquiryLimit] = useState(10);
  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState("ALL");
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState("ALL");

  const [followers, setFollowers] = useState<Follower[]>([]);
  const [followerLoading, setFollowerLoading] = useState(true);
  const [followerError, setFollowerError] = useState<string | null>(null);
  const [followerPage, setFollowerPage] = useState(1);
  const [followerTotal, setFollowerTotal] = useState(0);
  const [followerLimit, setFollowerLimit] = useState(10);
  const [followerSearch, setFollowerSearch] = useState("");

  const [messageModal, setMessageModal] = useState<{ name: string; message: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadInquiries = useCallback(async () => {
    setInquiryLoading(true);
    setInquiryError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(inquiryPage));
      params.set("limit", String(inquiryLimit));
      if (inquiryStatusFilter !== "ALL") params.set("status", inquiryStatusFilter);
      if (inquiryTypeFilter !== "ALL") params.set("type", inquiryTypeFilter);
      if (inquirySearch) params.set("search", inquirySearch);

      const res = await authFetch(`/api/v1/institution/inquiries?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) {
        setInquiryError(json?.message || json?.error || "Failed to load inquiries");
        return;
      }
      setInquiries(json?.data?.inquiries || json?.inquiries || []);
      setInquiryTotal(json?.data?.pagination?.total || json?.pagination?.total || 0);
    } catch (e: any) {
      setInquiryError(e.message || "Failed to load inquiries");
    } finally {
      setInquiryLoading(false);
    }
  }, [inquiryPage, inquiryLimit, inquiryStatusFilter, inquiryTypeFilter, inquirySearch]);

  const loadFollowers = useCallback(async () => {
    setFollowerLoading(true);
    setFollowerError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(followerPage));
      params.set("limit", String(followerLimit));
      if (followerSearch) params.set("search", followerSearch);

      const res = await authFetch(`/api/v1/institution/followers?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) {
        setFollowerError(json?.message || json?.error || "Failed to load followers");
        return;
      }
      setFollowers(json?.data?.followers || json?.followers || []);
      setFollowerTotal(json?.data?.pagination?.total || json?.pagination?.total || 0);
    } catch (e: any) {
      setFollowerError(e.message || "Failed to load followers");
    } finally {
      setFollowerLoading(false);
    }
  }, [followerPage, followerLimit, followerSearch]);

  useEffect(() => {
    if (activeTab === "inquiries") loadInquiries();
  }, [activeTab, loadInquiries]);

  useEffect(() => {
    if (activeTab === "followers") loadFollowers();
  }, [activeTab, loadFollowers]);

  const handleInquirySearch = () => {
    setInquiryPage(1);
    loadInquiries();
  };

  const handleFollowerSearch = () => {
    setFollowerPage(1);
    loadFollowers();
  };

  const handleInquiryFilter = (status: string, type: string) => {
    setInquiryStatusFilter(status);
    setInquiryTypeFilter(type);
    setInquiryPage(1);
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await authFetch(`/api/v1/institution/inquiries/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
        );
        showToast(`Status updated to ${newStatus}`);
      }
    } catch {
      showToast("Failed to update status");
    }
  };

  const deleteInquiry = async (id: number) => {
    try {
      const res = await authFetch(`/api/v1/institution/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        setInquiryTotal((prev) => prev - 1);
        showToast("Inquiry deleted successfully");
      }
    } catch {
      showToast("Failed to delete inquiry");
    }
    setDeleteTarget(null);
  };

  const renderInquiryPagination = () => {
    const totalPages = Math.ceil(inquiryTotal / inquiryLimit) || 1;
    const startIdx = inquiryTotal === 0 ? 0 : (inquiryPage - 1) * inquiryLimit + 1;
    const endIdx = Math.min(inquiryPage * inquiryLimit, inquiryTotal);

    return (
      <div className="px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500 bg-white rounded-b">
        <div>
          <span>
            {startIdx}-{endIdx} of {inquiryTotal}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setInquiryPage((p) => Math.max(1, p - 1))}
            disabled={inquiryPage === 1}
            className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-angle-left text-xs"></i>
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (inquiryPage <= 3) {
              pageNum = i + 1;
            } else if (inquiryPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = inquiryPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setInquiryPage(pageNum)}
                className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-all ${
                  inquiryPage === pageNum
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setInquiryPage((p) => Math.min(totalPages, p + 1))}
            disabled={inquiryPage >= totalPages}
            className="w-6 h-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-angle-right text-xs"></i>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span>Row/Page:</span>
          <select
            value={inquiryLimit}
            onChange={(e) => {
              setInquiryLimit(Number(e.target.value));
              setInquiryPage(1);
            }}
            className="border border-slate-200 rounded py-1 px-2 focus:outline-none focus:border-blue-600 text-sm bg-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    );
  };

  const renderFollowerPagination = () => {
    const totalPages = Math.ceil(followerTotal / followerLimit) || 1;
    const startIdx = followerTotal === 0 ? 0 : (followerPage - 1) * followerLimit + 1;
    const endIdx = Math.min(followerPage * followerLimit, followerTotal);

    return (
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{startIdx}</span> to{" "}
          <span className="font-medium text-gray-900">{endIdx}</span> of{" "}
          <span className="font-medium text-gray-900">{followerTotal}</span> followers
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFollowerPage((p) => Math.max(1, p - 1))}
            disabled={followerPage === 1}
            className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (followerPage <= 3) {
                pageNum = i + 1;
              } else if (followerPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = followerPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setFollowerPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                    followerPage === pageNum
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setFollowerPage((p) => Math.min(totalPages, p + 1))}
            disabled={followerPage >= totalPages}
            className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Students"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard/overview" },
          { label: "Students" },
        ]}
      />

      {/* Tab Navigation */}
      <div className="flex gap-0 mb-0 -mb-px relative z-10">
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border border-b-0 ${
            activeTab === "inquiries"
              ? "bg-white text-brand-blue border-slate-200"
              : "bg-slate-50 text-slate-500 border-transparent hover:text-slate-700"
          }`}
        >
          Inquiries
        </button>
        <button
          onClick={() => setActiveTab("followers")}
          className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border border-b-0 ${
            activeTab === "followers"
              ? "bg-white text-brand-blue border-slate-200"
              : "bg-slate-50 text-slate-500 border-transparent hover:text-slate-700"
          }`}
        >
          Followers
        </button>
      </div>

      {/* Inquiries Tab */}
      {activeTab === "inquiries" && (
        <main className="bg-white border border-slate-200 rounded shadow-sm">
          {inquiryError && (
            <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <X className="w-5 h-5 shrink-0" />
              <span className="flex-1">{inquiryError}</span>
              <button onClick={() => setInquiryError(null)} className="text-red-400 hover:text-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Toolbar */}
          <div className="px-5 py-3.5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white rounded-t">
            <div className="relative w-full md:w-auto">
              <MagnifyingGlass
                weight="bold"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5"
              />
              <input
                type="text"
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInquirySearch()}
                className="pl-9 pr-4 py-1.5 w-full md:w-64 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-slate-700"
                placeholder="Search student name..."
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <div className="relative">
                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => handleInquiryFilter(e.target.value, inquiryTypeFilter)}
                  className="appearance-none pl-3 pr-8 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-600 bg-white cursor-pointer hover:bg-slate-50 text-slate-700"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <i className="fa-solid fa-filter absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
              </div>

              <div className="relative">
                <select
                  value={inquiryTypeFilter}
                  onChange={(e) => handleInquiryFilter(inquiryStatusFilter, e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-600 bg-white cursor-pointer hover:bg-slate-50 text-slate-700"
                >
                  {INQUIRY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <i className="fa-solid fa-filter absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
              </div>

              <button
                onClick={() => showToast("Exporting data to CSV...")}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition-all flex items-center space-x-1.5 text-sm font-medium text-slate-700"
              >
                <Download weight="bold" className="text-slate-500 w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table */}
          {inquiryLoading ? (
            <div className="p-12 flex items-center justify-center text-gray-400 text-sm">
              Loading inquiries...
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar p-1">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="text-[13px] font-medium text-slate-500 border-b border-slate-200 bg-slate-50/50">
                    <th className="py-3 px-4 font-semibold">Student Name</th>
                    <th className="py-3 px-4 font-semibold">Contact Number</th>
                    <th className="py-3 px-4 font-semibold">Inquiry Date</th>
                    <th className="py-3 px-4 font-semibold">Inquiry Type</th>
                    <th className="py-3 px-4 font-semibold">Message</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] divide-y divide-slate-100">
                  {inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                        No students found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-900">{inq.name}</td>
                        <td className="py-3 px-4 text-slate-600">{inq.phone}</td>
                        <td className="py-3 px-4 text-slate-600">{formatDate(inq.created_at)}</td>
                        <td className="py-3 px-4 text-slate-600">{inq.type}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() =>
                              setMessageModal({ name: inq.name, message: inq.message })
                            }
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors border border-slate-200"
                          >
                            View Message
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={inq.status}
                            onChange={(e) => updateStatus(inq.id, e.target.value)}
                            style={{
                              appearance: "none",
                              padding: "4px 20px 4px 10px",
                              borderRadius: "4px",
                              fontSize: "13px",
                              fontWeight: 500,
                              border: "none",
                              backgroundImage:
                                "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 4px center",
                              backgroundSize: "14px",
                              cursor: "pointer",
                            }}
                            className={`${getStatusClass(inq.status)}`}
                          >
                            <option value="New">New</option>
                            <option value="In Contact">In Contact</option>
                            <option value="Follow Up">Follow Up</option>
                            <option value="Admitted">Admitted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setDeleteTarget(inq)}
                            title="Delete Inquiry"
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          >
                            <i className="fa-solid fa-trash-can text-xs"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!inquiryLoading && renderInquiryPagination()}
        </main>
      )}

      {/* Followers Tab */}
      {activeTab === "followers" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {followerError && (
            <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <X className="w-5 h-5 shrink-0" />
              <span className="flex-1">{followerError}</span>
              <button onClick={() => setFollowerError(null)} className="text-red-400 hover:text-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-100 gap-4">
            <div className="relative w-full sm:w-80">
              <MagnifyingGlass
                weight="bold"
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-lg"
              />
              <input
                type="text"
                value={followerSearch}
                onChange={(e) => setFollowerSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFollowerSearch()}
                placeholder="Search followers"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>

            <div className="flex items-center text-sm text-gray-500 gap-2">
              <span>Showing</span>
              <div className="relative">
                <select
                  value={followerLimit}
                  onChange={(e) => {
                    setFollowerLimit(Number(e.target.value));
                    setFollowerPage(1);
                  }}
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-1 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-300"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <i className="fa-solid fa-caret-down text-xs"></i>
                </div>
              </div>
              <span>of {followerTotal} results</span>
            </div>
          </div>

          {/* Table */}
          {followerLoading ? (
            <div className="p-12 flex items-center justify-center text-gray-400 text-sm">
              Loading followers...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-left whitespace-nowrap">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">
                        NAME
                        <div className="flex flex-col opacity-50">
                          <i className="fa-solid fa-caret-up text-[10px] -mb-1"></i>
                          <i className="fa-solid fa-caret-down text-[10px]"></i>
                        </div>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">
                        EMAIL
                        <div className="flex flex-col opacity-50">
                          <i className="fa-solid fa-caret-up text-[10px] -mb-1"></i>
                          <i className="fa-solid fa-caret-down text-[10px]"></i>
                        </div>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">
                        CONTACT NO
                        <div className="flex flex-col opacity-50">
                          <i className="fa-solid fa-caret-up text-[10px] -mb-1"></i>
                          <i className="fa-solid fa-caret-down text-[10px]"></i>
                        </div>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">
                        ADDRESS
                        <div className="flex flex-col opacity-50">
                          <i className="fa-solid fa-caret-up text-[10px] -mb-1"></i>
                          <i className="fa-solid fa-caret-down text-[10px]"></i>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {followers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">
                        No followers found
                      </td>
                    </tr>
                  ) : (
                    followers.map((f) => (
                      <tr key={f.id} className="transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {f.image_url ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover border border-gray-100"
                                  src={resolveImageUrl(f.image_url)}
                                  alt=""
                                />
                              ) : (
                                <div
                                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold border ${getAvatarColor(f.first_name + f.last_name)}`}
                                >
                                  {getInitials(f.first_name, f.last_name)}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {f.first_name} {f.last_name}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <Clock weight="fill" className="w-3 h-3" />
                                {formatRelativeTime(f.followed_at)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {f.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          (977) {f.phone || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {f.address || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!followerLoading && renderFollowerPagination()}
        </div>
      )}

      {/* Message Modal */}
      {messageModal && (
        <div className="fixed inset-0 bg-slate-900/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-sm w-full shadow-md overflow-hidden border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-medium text-slate-800 text-sm">Message Details</h3>
              <button
                onClick={() => setMessageModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X weight="bold" className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-500 mb-1">
                From: <span className="text-slate-800 font-medium">{messageModal.name}</span>
              </p>
              <div className="mt-2.5 p-3 bg-slate-50 rounded border border-slate-200 text-slate-700 text-sm leading-relaxed">
                &ldquo;{messageModal.message}&rdquo;
              </div>
            </div>
            <div className="px-4 py-2.5 border-t border-slate-100 flex justify-end bg-slate-50">
              <button
                onClick={() => setMessageModal(null)}
                className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs rounded transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash weight="fill" className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Inquiry</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete inquiry from{" "}
                <strong>{deleteTarget.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteInquiry(deleteTarget.id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-800 text-white text-xs px-3.5 py-2 rounded shadow-lg flex items-center space-x-2 z-50 transition-all duration-300">
          <i className="fa-solid fa-circle-check text-green-400"></i>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
