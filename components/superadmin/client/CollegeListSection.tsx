"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Building2, Plus, PenSquare, XCircle, CheckCircle, Loader2, RefreshCw } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Institution {
  id: number;
  institution_name: string;
  email: string;
  contact_number: string;
  registration_number: string;
  pan_number: string;
  website_url: string;
  province: string;
  district: string;
  local_body: string;
  organization_type: string;
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

const statusStyles: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

export default function CollegeListSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const fetchInstitutions = useCallback(async () => {
    setLoading(true);
    setAuthError(false);
    try {
      const response = await superadminFetch<{ data: Institution[]; message: string }>("/api/v1/superadmin/institutions");
      setInstitutions(response.data || []);
    } catch (error) {
      if (error instanceof Error && error.message === "auth_required") setAuthError(true);
      else console.error("Failed to fetch institutions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInstitutions(); }, [fetchInstitutions]);

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
        <h1 className="text-2xl font-bold text-gray-800">Listed Institutions</h1>
        <div className="flex items-center gap-3">
          <button type="button" onClick={fetchInstitutions}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw size={16} /> Refresh
          </button>
          <span className="text-sm text-gray-500">Super Admin - Listed Institutions</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">All Registered Institutions ({institutions.length})</h2>
          <button type="button" onClick={() => setActiveSection("add-college")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} /> Add Institution
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Institution</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Details</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registration</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Person</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {institutions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                    <Building2 size={40} className="mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">No institutions found</p>
                  </td>
                </tr>
              ) : (
                institutions.map((inst) => (
                  <tr key={inst.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <span className="text-sm font-semibold text-gray-900">{inst.institution_name}</span>
                        <br /><span className="text-xs text-blue-600">{inst.website_url?.replace(/^https?:\/\//, "") || ""}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-600">{inst.email}</div>
                      <div className="text-xs text-gray-400">{inst.contact_number}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-600">{inst.pan_number ? `PAN: ${inst.pan_number}` : ""}</div>
                      <div className="text-xs text-gray-400">{inst.registration_number ? `Reg: ${inst.registration_number}` : ""}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-600">{inst.province}</div>
                      <div className="text-xs text-gray-400">{inst.district && inst.local_body ? `${inst.district}, ${inst.local_body}` : ""}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{inst.contact_person}</div>
                      <div className="text-xs text-gray-400">{inst.contact_person_designation}{inst.contact_person_phone ? ` \u2022 ${inst.contact_person_phone}` : ""}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{inst.organization_type || "-"}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(inst.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[inst.status] || "bg-gray-100 text-gray-700"}`}>
                        {inst.status.charAt(0).toUpperCase() + inst.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-0.5">
                        <button className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors" title="Edit"><PenSquare size={18} /></button>
                        <button className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors" title="Close"><XCircle size={18} /></button>
                      </div>
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
