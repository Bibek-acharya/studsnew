"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Check, X, Loader2, RefreshCw, Building2, Mail, FileText, MapPin, Phone, Clock } from "lucide-react";

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
  level: string;
  affiliation: string;
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

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function PendingInstitutionsSection() {
  const [institutions, setInstitutions] = useState<PendingInstitution[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [authError, setAuthError] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean; title: string; message: string; type: "registration" | "claim"; institutionId: number | null; institutionName: string;
  }>({ open: false, title: "", message: "", type: "registration", institutionId: null, institutionName: "" });
  const [activeTab, setActiveTab] = useState<"registration" | "claim">("registration");

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setAuthError(false);
    try {
      const response = await superadminFetch<{ data: PendingInstitution[]; message: string }>("/api/v1/superadmin/pending-institutions?type=registration");
      setInstitutions(response.data || []);
    } catch (error) {
      if (error instanceof Error && error.message === "auth_required") setAuthError(true);
      else console.error("Failed to fetch pending institutions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnclaimed = useCallback(async () => {
    setLoading(true);
    setAuthError(false);
    try {
      const response = await superadminFetch<{ data: PendingInstitution[]; message: string }>("/api/v1/superadmin/pending-institutions?type=claim");
      setInstitutions(response.data || []);
    } catch (error) {
      if (error instanceof Error && error.message === "auth_required") setAuthError(true);
      else console.error("Failed to fetch unclaimed institutions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "registration") fetchPending();
    else fetchUnclaimed();
  }, [activeTab, fetchPending, fetchUnclaimed]);

  const openConfirmApprove = (id: number, name: string) => {
    setConfirmDialog({
      open: true,
      title: activeTab === "registration" ? "Approve Registration" : "Approve Claim",
      message: activeTab === "registration"
        ? `Are you sure you want to approve "${name}"? An email with login credentials will be sent.`
        : `Are you sure you want to approve the claim for "${name}"? An email with login credentials will be sent.`,
      type: activeTab,
      institutionId: id,
      institutionName: name,
    });
  };

  const executeApprove = async () => {
    const id = confirmDialog.institutionId;
    if (!id) return;
    setActionLoading(id);
    setConfirmDialog({ ...confirmDialog, open: false });
    try {
      if (confirmDialog.type === "registration") {
        await superadminFetch("/api/v1/superadmin/institutions/approve", {
          method: "POST",
          body: JSON.stringify({ institution_id: id, action: "approved" }),
        });
      } else {
        await superadminFetch("/api/v1/superadmin/institutions/claim-approve", {
          method: "POST",
          body: JSON.stringify({ institution_id: id }),
        });
      }
      setInstitutions((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to approve:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      if (activeTab === "registration") {
        await superadminFetch("/api/v1/superadmin/institutions/approve", {
          method: "POST",
          body: JSON.stringify({ institution_id: id, action: "rejected" }),
        });
        setInstitutions((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to reject:", error);
    } finally {
      setActionLoading(null);
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pending Institution Requests</h2>
          <p className="text-sm text-gray-500 mt-1">{institutions.length} request(s) awaiting review</p>
        </div>
        <button type="button" onClick={activeTab === "registration" ? fetchPending : fetchUnclaimed}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
        <button type="button" onClick={() => setActiveTab("registration")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "registration" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}>
          Registration Request
        </button>
        <button type="button" onClick={() => setActiveTab("claim")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "claim" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}>
          Claim Request
        </button>
      </div>

      {institutions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Building2 size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">{activeTab === "registration" ? "No pending registration requests" : "No claim requests"}</p>
          <p className="text-sm mt-1">
            {activeTab === "registration"
              ? "All institution registrations have been processed."
              : "All institutions have been claimed."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {institutions.map((inst) => (
            <div key={inst.id} className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{inst.institution_name}</h3>
                      {inst.level && <span className="text-xs text-gray-500">Level: {inst.level}</span>}
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200 ml-2">
                        {activeTab === "registration" ? "Pending Review" : "Unclaimed"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} className="text-gray-400" />
                      <span>{inst.email}</span>
                    </div>
                    {inst.contact_number && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PhoneIcon />
                        <span>{inst.contact_number}</span>
                      </div>
                    )}
                    {inst.contact_person && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 size={14} className="text-gray-400" />
                        <span>{inst.contact_person}{inst.contact_person_designation ? ` (${inst.contact_person_designation})` : ""}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{inst.district || inst.province || "N/A"}{inst.province ? `, ${inst.province}` : ""}</span>
                    </div>
                    {inst.pan_number && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText size={14} className="text-gray-400" />
                        <span>PAN: {inst.pan_number}</span>
                      </div>
                    )}
                    {inst.registration_number && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText size={14} className="text-gray-400" />
                        <span>Reg: {inst.registration_number}</span>
                      </div>
                    )}
                    {inst.website_url && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <GlobeIcon />
                        <a href={inst.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{inst.website_url}</a>
                      </div>
                    )}
                    {inst.affiliation && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText size={14} className="text-gray-400" />
                        <span>Affiliation: {inst.affiliation}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    Registered on {new Date(inst.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {activeTab === "registration" && (
                    <button type="button" disabled={actionLoading === inst.id} onClick={() => handleReject(inst.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50">
                      {actionLoading === inst.id ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                      Reject
                    </button>
                  )}
                  <button type="button" disabled={actionLoading === inst.id} onClick={() => openConfirmApprove(inst.id, inst.institution_name)}
                    className="flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 transition-colors disabled:opacity-50">
                    {actionLoading === inst.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    {activeTab === "registration" ? "Approve" : "Approve Claim"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{confirmDialog.title}</h3>
              <button type="button" onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">{confirmDialog.message}</p>
            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={executeApprove}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center gap-2">
                <Check size={16} />
                {confirmDialog.type === "registration" ? "Approve" : "Approve Claim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
