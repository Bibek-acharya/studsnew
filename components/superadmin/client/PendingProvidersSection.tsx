"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Check, X, Loader2, RefreshCw, Building2, Mail, FileText } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface PendingProvider {
  id: number;
  provider_name: string;
  registration_number: string;
  email: string;
  contact_number: string;
  pan_number: string;
  website_url: string;
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
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, credentials: "include" });

  if (response.status === 401 || response.status === 403) {
    throw new Error("auth_required");
  }

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Unexpected response`);
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data as T;
}

export default function PendingProvidersSection() {
  const [providers, setProviders] = useState<PendingProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [authError, setAuthError] = useState(false);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setAuthError(false);
    try {
      const response = await superadminFetch<{ data: PendingProvider[]; message: string }>("/api/v1/superadmin/pending-providers");
      setProviders(response.data || []);
    } catch (error) {
      if (error instanceof Error && error.message === "auth_required") {
        setAuthError(true);
      } else {
        console.error("Failed to fetch pending providers:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await superadminFetch("/api/v1/superadmin/providers/approve", {
        method: "POST",
        body: JSON.stringify({ provider_id: id, action: "approved" }),
      });
      setProviders((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to approve provider:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      await superadminFetch("/api/v1/superadmin/providers/approve", {
        method: "POST",
        body: JSON.stringify({ provider_id: id, action: "rejected" }),
      });
      setProviders((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to reject provider:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Building2 size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium text-gray-700">Authentication Required</p>
        <p className="text-sm mt-1 text-gray-500 mb-6">Please log in as Super Admin to manage provider approvals.</p>
        <button
          type="button"
          onClick={() => window.location.href = "/superadmin/login"}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pending Provider Approvals</h2>
          <p className="text-sm text-gray-500 mt-1">
            {providers.length} provider(s) awaiting review
          </p>
        </div>
        <button
          type="button"
          onClick={fetchProviders}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {providers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Building2 size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">No pending approvals</p>
          <p className="text-sm mt-1">All scholarship provider registrations have been processed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{provider.provider_name}</h3>
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                        Pending Review
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} className="text-gray-400" />
                      <span>{provider.email}</span>
                    </div>
                    {provider.contact_number && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PhoneIcon />
                        <span>{provider.contact_number}</span>
                      </div>
                    )}
                    {provider.pan_number && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText size={14} className="text-gray-400" />
                        <span>PAN: {provider.pan_number}</span>
                      </div>
                    )}
                    {provider.registration_number && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText size={14} className="text-gray-400" />
                        <span>Reg: {provider.registration_number}</span>
                      </div>
                    )}
                    {provider.website_url && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <GlobeIcon />
                        <a href={provider.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{provider.website_url}</a>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    Registered on {new Date(provider.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    type="button"
                    disabled={actionLoading === provider.id}
                    onClick={() => handleApprove(provider.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === provider.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading === provider.id}
                    onClick={() => handleReject(provider.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === provider.id ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
