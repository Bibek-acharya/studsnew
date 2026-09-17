"use client";

import React, { useCallback, useEffect, useState } from "react";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { apiRequest } from "@/services/api";
import { advertiseForLabel } from "@/services/advertiseForOptions";

interface AdvertiseRequest {
  id: number;
  created_at: string;
  institution_id: number;
  name: string;
  designation: string;
  contact: string;
  email: string;
  advertise_for: string;
  status: "pending" | "approved" | "declined";
  admin_note?: string;
  note?: string;
}

interface AdvertiseRequestsResponse {
  requests: AdvertiseRequest[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

type StatusFilter = "all" | "pending" | "approved" | "declined";

const PAGE_SIZE = 10;

function getSuperadminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("superadmin_token");
}

async function extractData<T>(promise: Promise<any>): Promise<T> {
  const res = await promise;
  if (res && typeof res === "object" && "data" in res) return res.data as T;
  return res as T;
}

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "declined", label: "Declined" },
];

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  declined: "Declined",
};

export default function AdvertiseRequestSection() {
  const [requests, setRequests] = useState<AdvertiseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [actingId, setActingId] = useState<number | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (statusFilter !== "all") query.set("status", statusFilter);
      query.set("page", String(page));
      query.set("limit", String(PAGE_SIZE));
      const res = await extractData<{
        requests?: AdvertiseRequest[];
        meta?: { total?: number };
        items?: AdvertiseRequest[];
      }>(
        apiRequest(`/api/v1/admin/advertise-requests?${query.toString()}`, {
          authToken: getSuperadminToken() ?? undefined,
        }),
      );
      const list = (res.requests || res.items || []) as AdvertiseRequest[];
      setRequests(list);
      setTotal((res.meta as { total?: number })?.total ?? list.length);
    } catch {
      setError("Failed to load advertise requests");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusFilter = useCallback((s: StatusFilter) => {
    setStatusFilter(s);
    setPage(1);
    setExpandedId(null);
  }, []);

  const handleDecision = useCallback(
    async (req: AdvertiseRequest, status: "approved" | "declined") => {
      setActingId(req.id);
      try {
        await apiRequest(`/api/v1/admin/advertise-requests/${req.id}/status`, {
          method: "PUT",
          body: JSON.stringify({ status }),
          authToken: getSuperadminToken() ?? undefined,
        });
        setRequests((prev) =>
          prev.map((r) => (r.id === req.id ? { ...r, status } : r)),
        );
      } catch {
        alert("Failed to update request status");
      } finally {
        setActingId(null);
      }
    },
    [],
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const formatDate = (d: string) => {
    if (!d) return "\u2014";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "\u2014";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          Advertisement Requests from Institutions
        </h2>
        <span className="text-xs text-gray-500">{total} total</span>
      </div>

      {/* Status filter chips */}
      <div className="flex items-center gap-1 px-6 pt-4">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === tab.id
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="px-6 py-8 text-center text-gray-500">Loading requests...</div>
      ) : error ? (
        <div className="px-6 py-8 text-center text-red-500">{error}</div>
      ) : requests.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500 text-sm">
            No advertise requests found for this filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <th className="px-4 py-3 w-10">S.N</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Contact Number</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Advertise For</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, idx) => {
                const isAdminDecided = req.status !== "pending";
                const isExpanded = expandedId === req.id;
                return (
                  <React.Fragment key={req.id}>
                    <tr className="hover:bg-gray-50 border-b border-gray-200 transition-colors">
                      <td className="px-4 py-3 text-gray-500">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900 max-w-[180px] truncate block">
                          {req.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">
                        {req.designation || "\u2014"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {req.contact || "\u2014"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                        {req.email}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                        {advertiseForLabel(req.advertise_for)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            statusStyles[req.status] || "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {req.status === "pending" && <Clock size={12} />}
                          {statusLabels[req.status] || req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {req.status === "pending" ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleDecision(req, "approved")}
                              disabled={actingId === req.id}
                              className="p-1.5 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 disabled:opacity-40"
                              title="Approve"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleDecision(req, "declined")}
                              disabled={actingId === req.id}
                              className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-40"
                              title="Decline"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : req.id)
                            }
                            className="flex items-center justify-center gap-1 p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 w-full"
                            title="View details"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp size={16} /> Hide
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} /> View
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* Expander: full details for decided rows */}
                    {isAdminDecided && isExpanded && (
                      <tr className="bg-gray-50/60 border-b border-gray-200">
                        <td colSpan={8} className="px-4 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Requested on
                              </p>
                              <p className="text-gray-700">{formatDate(req.created_at)}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Institution ID
                              </p>
                              <p className="text-gray-700">{req.institution_id}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Contact
                              </p>
                              <p className="text-gray-700">{req.contact || "\u2014"}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Email
                              </p>
                              <p className="text-gray-700 break-all">{req.email}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Advertise for
                              </p>
                              <p className="text-gray-700">
                                {advertiseForLabel(req.advertise_for)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Status
                              </p>
                              <p className="text-gray-700 capitalize">
                                {statusLabels[req.status] || req.status}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Admin note
                              </p>
                              <p className="text-gray-700 whitespace-pre-line">
                                {req.admin_note || req.note || "No note added."}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of{" "}
            {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="text-gray-500">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
