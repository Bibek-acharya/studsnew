"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Check, X, Loader2, RefreshCw, Building2, Mail, FileText, MapPin, Phone, Clock, CheckCircle, XCircle } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface PendingInstitution {
  id: number;
  institution_name: string;
  registration_number: string;
  email: string;
  contact_number: string;
  province: string;
  district: string;
  local_body: string;
  organization_type: string;
  pan_number: string;
  website_url: string;
  contact_person: string;
  contact_person_designation: string;
  contact_person_phone: string;
  status: string;
  created_at: string;
}

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

export default function PendingInstitutionsSection() {
  const [institutions, setInstitutions] = useState<PendingInstitution[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [authError, setAuthError] = useState(false);

  const fetchInstitutions = useCallback(async () => {
    setLoading(true);
    setAuthError(false);
    try {
      const response = await superadminFetch<{ data: PendingInstitution[]; message: string }>("/api/v1/superadmin/pending-institutions");
      setInstitutions(response.data || []);
    } catch (error) {
      if (error instanceof Error && error.message === "auth_required") setAuthError(true);
      else console.error("Failed to fetch pending institutions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInstitutions(); }, [fetchInstitutions]);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await superadminFetch("/api/v1/superadmin/institutions/approve", {
        method: "POST",
        body: JSON.stringify({ institution_id: id, action: "approved" }),
      });
      setInstitutions((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to approve institution:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      await superadminFetch("/api/v1/superadmin/institutions/approve", {
        method: "POST",
        body: JSON.stringify({ institution_id: id, action: "rejected" }),
      });
      setInstitutions((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to reject institution:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Building2 size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium text-gray-700">Authentication Required</p>
        <p className="text-sm mt-1 text-gray-500 mb-6">Please log in as Super Admin to manage institution approvals.</p>
        <button type="button" onClick={() => window.location.href = "/superadmin/login"}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">Go to Login</button>
      </div>
    );
  }

  if (loading) {
    return <div className="flex min-h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pending Institutions Request</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <span>Super Admin</span><span>-</span><span className="text-gray-800 font-medium">Pending Institutions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0"><Clock size={20} className="text-amber-600" /></div>
          <div><div className="text-sm text-gray-500">Pending Requests</div><div className="text-xl font-bold text-gray-800">{institutions.length}</div></div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0"><CheckCircle size={20} className="text-green-600" /></div>
          <div><div className="text-sm text-gray-500">Confirmed</div><div className="text-xl font-bold text-gray-800">0</div></div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0"><XCircle size={20} className="text-red-600" /></div>
          <div><div className="text-sm text-gray-500">Rejected</div><div className="text-xl font-bold text-gray-800">0</div></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900">Registration Requests</h2>
          <div className="flex items-center gap-3">
            <button type="button" onClick={fetchInstitutions} className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        {institutions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Building2 size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No pending approvals</p>
            <p className="text-sm mt-1">All institution registrations have been processed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Institution</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Details</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registration</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Person</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {institutions.map((inst) => (
                  <tr key={inst.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{inst.institution_name}</span>
                        <span className="text-xs text-blue-600">{inst.website_url?.replace(/^https?:\/\//, "") || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600">{inst.email}</span>
                        <span className="text-xs text-gray-400">{inst.contact_number}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600">PAN: {inst.pan_number || "N/A"}</span>
                        <span className="text-xs text-gray-400">Reg: {inst.registration_number}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600">{inst.province}</span>
                        <span className="text-xs text-gray-400">{inst.district}, {inst.local_body}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{inst.contact_person}</span>
                        <span className="text-xs text-gray-400">{inst.contact_person_designation} &bull; {inst.contact_person_phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Pending</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          disabled={actionLoading === inst.id}
                          onClick={() => handleApprove(inst.id)}
                          className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                          title="Approve this institution"
                        >
                          {actionLoading === inst.id ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading === inst.id}
                          onClick={() => handleReject(inst.id)}
                          className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Reject this institution"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
