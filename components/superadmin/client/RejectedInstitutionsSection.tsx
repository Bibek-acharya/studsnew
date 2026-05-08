"use client";

import React, { useEffect, useState, useCallback } from "react";
import { XCircle, Building2, RotateCcw, Loader2, RefreshCw } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface RejectedInstitution {
  id: number;
  institution_name: string;
  registration_number: string;
  email: string;
  rejection_reason: string;
  created_at: string;
  updated_at: string;
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

export default function RejectedInstitutionsSection() {
  const [rejected, setRejected] = useState<RejectedInstitution[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const fetchRejected = useCallback(async () => {
    setLoading(true);
    setAuthError(false);
    try {
      const response = await superadminFetch<{ data: RejectedInstitution[]; message: string }>("/api/v1/superadmin/rejected-institutions");
      setRejected(response.data || []);
    } catch (error) {
      if (error instanceof Error && error.message === "auth_required") setAuthError(true);
      else console.error("Failed to fetch rejected institutions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRejected(); }, [fetchRejected]);

  const handleReviewAgain = async (id: number) => {
    try {
      await superadminFetch("/api/v1/superadmin/institutions/approve", {
        method: "POST",
        body: JSON.stringify({ institution_id: id, action: "approved" }),
      });
      setRejected((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Failed to move institution back to pending:", error);
    }
  };

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Building2 size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium text-gray-700">Authentication Required</p>
        <p className="text-sm mt-1 text-gray-500 mb-6">Please log in as Super Admin.</p>
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
        <h1 className="text-2xl font-bold text-gray-800">Rejected Institutions</h1>
        <button type="button" onClick={fetchRejected}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Rejected Institution Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Institution</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rejected Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rejected.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    <XCircle size={40} className="mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">No rejected institutions</p>
                  </td>
                </tr>
              ) : (
                rejected.map((inst) => (
                  <tr key={inst.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                          <Building2 size={16} className="text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{inst.institution_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{inst.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(inst.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{inst.rejection_reason || "No reason provided"}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleReviewAgain(inst.id)}
                        className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
                      >
                        <RotateCcw size={14} /> Review Again
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
