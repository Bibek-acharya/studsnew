"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Building2, Mail, FileText, Search, RefreshCw, Loader2, ShieldCheck, Globe, Phone, Eye, CheckCircle } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface VerifiedProvider {
  id: number;
  provider_name: string;
  registration_number: string;
  email: string;
  contact_number: string;
  pan_number: string;
  website_url: string;
  status: string;
  created_at: string;
  verified_at?: string;
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
  if (response.status === 401 || response.status === 403) throw new Error("auth_required");
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { throw new Error("Unexpected response"); }
  if (!response.ok) throw new Error(data.message || data.error || "Request failed");
  return data as T;
}

export default function VerifiedProvidersSection() {
  const [providers, setProviders] = useState<VerifiedProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [authError, setAuthError] = useState(false);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setAuthError(false);
    try {
      const response = await superadminFetch<{ data: VerifiedProvider[]; message: string }>("/api/v1/superadmin/providers");
      setProviders(response.data || []);
    } catch (error) {
      if (error instanceof Error && error.message === "auth_required") {
        setAuthError(true);
      } else {
        console.error("Failed to fetch providers:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProviders(); }, [fetchProviders]);

  const filtered = providers.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.provider_name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.registration_number.toLowerCase().includes(q) ||
      (p.contact_number && p.contact_number.includes(q))
    );
  });

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Building2 size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium text-gray-700">Authentication Required</p>
        <p className="text-sm mt-1 text-gray-500 mb-6">Please log in as Super Admin to view scholarship providers.</p>
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
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <ShieldCheck size={22} className="text-green-600" />
              Scholarship Providers
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filtered.length} verified provider{filtered.length !== 1 ? "s" : ""}
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

        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or registration..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Building2 size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">
              {providers.length === 0 ? "No verified providers yet" : "No providers match your search"}
            </p>
            <p className="text-sm mt-1">
              {providers.length === 0
                ? "Approved scholarship providers will appear here."
                : "Try adjusting your search terms."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">Provider</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-600">Contact</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-600">Registration</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-600">PAN Number</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-600">Verified On</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600 shrink-0">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{provider.provider_name}</p>
                          {provider.website_url && (
                            <a href={provider.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                              <Globe size={12} />
                              {provider.website_url.replace(/^https?:\/\//, "")}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Mail size={13} className="shrink-0" />
                          <span>{provider.email}</span>
                        </div>
                        {provider.contact_number && (
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Phone size={13} className="shrink-0" />
                            <span>{provider.contact_number}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {provider.registration_number || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {provider.pan_number || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
                        <CheckCircle size={12} />
                        Verified
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                      {provider.verified_at
                        ? new Date(provider.verified_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                        : new Date(provider.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        className="rounded-md p-2 text-blue-600 hover:bg-blue-50 transition-all"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
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
