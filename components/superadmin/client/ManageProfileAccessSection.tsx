"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Building2,
  PenSquare,
  CheckSquare,
  Search,
  Funnel,
  Loader2,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Institution {
  id: number;
  institution_name: string;
  profile_access?: string;
}

interface InstitutionAccess {
  id: number;
  name: string;
  toggles: Record<string, boolean>;
}

const defaultToggles = [
  "About", "Course & Fees", "Admission", "Offered Programs",
  "Facilities", "Scholarship", "Alumni", "Gallery",
  "News", "Events", "Blogs",
];

const socialToggles = ["FB", "IG", "TT", "LI", "YT", "X", "Web", "Map"];

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

export default function ManageProfileAccessSection() {
  const [institutions, setInstitutions] = useState<InstitutionAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [search, setSearch] = useState("");

  const fetchInstitutions = useCallback(async () => {
    setLoading(true);
    setAuthError(false);
    try {
      const response = await superadminFetch<{ data: { institutions: Institution[] }; message: string }>("/api/v1/superadmin/institutions");
      const data = response.data?.institutions || [];
      const allToggles = [...defaultToggles, ...socialToggles];
      setInstitutions(
        data.map((inst) => ({
          id: inst.id,
          name: inst.institution_name,
          toggles: (() => {
            const saved: Record<string, boolean> = {};
            try {
              if (inst.profile_access) {
                const parsed = JSON.parse(inst.profile_access);
                Object.assign(saved, parsed);
              }
            } catch {}
            allToggles.forEach((k) => { if (saved[k] === undefined) saved[k] = true; });
            return saved;
          })(),
        }))
      );
    } catch (error) {
      if (error instanceof Error && error.message === "auth_required") setAuthError(true);
      else console.error("Failed to fetch institutions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInstitutions(); }, [fetchInstitutions]);

  const saveAccess = async (id: number, toggles: Record<string, boolean>) => {
    try {
      await superadminFetch(`/api/v1/superadmin/institutions/${id}/access`, {
        method: "PUT",
        body: JSON.stringify({ profile_access: toggles }),
      });
    } catch (error) {
      console.error("Failed to save profile access:", error);
    }
  };

  const toggleOne = (id: number, key: string) => {
    setInstitutions((prev) => {
      const updated = prev.map((inst) =>
        inst.id === id
          ? { ...inst, toggles: { ...inst.toggles, [key]: !inst.toggles[key] } }
          : inst
      );
      const inst = updated.find((i) => i.id === id);
      if (inst) saveAccess(id, inst.toggles);
      return updated;
    });
  };

  const toggleAll = (id: number) => {
    setInstitutions((prev) => {
      const updated = prev.map((inst) =>
        inst.id === id
          ? { ...inst, toggles: Object.fromEntries(Object.keys(inst.toggles).map((k) => [k, true])) }
          : inst
      );
      const inst = updated.find((i) => i.id === id);
      if (inst) saveAccess(id, inst.toggles);
      return updated;
    });
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

  const filtered = institutions.filter((inst) =>
    inst.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Profile Access</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <span>Super Admin</span><span>-</span><span className="text-gray-800 font-medium">Manage Profile Access</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Institution Profile Management ({institutions.length})</h2>
          <div className="flex gap-2">
            <button type="button" onClick={fetchInstitutions}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <RefreshCw size={16} /> Refresh
            </button>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 px-3 py-2 pl-9 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-600 bg-white"
                placeholder="Search institution..."
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase border-b border-gray-200" rowSpan={2}>S.N</th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase border-b border-gray-200" rowSpan={2}>College Name</th>
                {defaultToggles.map((t) => (
                  <th key={t} className="px-2 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase border-b border-gray-200" rowSpan={2}>{t}</th>
                ))}
                <th className="px-1 py-2 text-center text-[11px] font-semibold text-gray-500 uppercase border-b border-gray-200" colSpan={8}>Contact Information</th>
                <th className="px-2 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase border-b border-gray-200" rowSpan={2}>Enquiry</th>
                <th className="px-2 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase border-b border-gray-200" rowSpan={2}>Actions</th>
              </tr>
              <tr className="bg-gray-50">
                {socialToggles.map((t) => (
                  <th key={t} className="px-1 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase border-b border-gray-200">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={23} className="px-4 py-12 text-center text-gray-400">
                    <Building2 size={40} className="mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">No institutions found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((inst, idx) => (
                  <tr key={inst.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-3 text-center text-sm text-gray-500">{idx + 1}</td>
                    <td className="px-3 py-3">
                      <span className="text-sm font-semibold text-gray-900">{inst.name}</span>
                    </td>
                    {defaultToggles.map((t) => (
                      <td key={t} className="px-2 py-3 text-center">
                        <ToggleSwitch checked={inst.toggles[t]} onChange={() => toggleOne(inst.id, t)} />
                      </td>
                    ))}
                    {socialToggles.map((t) => (
                      <td key={t} className="px-1 py-3 text-center">
                        <ToggleSwitch checked={inst.toggles[t]} onChange={() => toggleOne(inst.id, t)} />
                      </td>
                    ))}
                    <td className="px-2 py-3 text-center">
                      <ToggleSwitch checked={true} onChange={() => {}} />
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-center gap-0.5">
                        <button className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors" title="Edit Profile">
                          <PenSquare size={18} />
                        </button>
                        <button
                          onClick={() => toggleAll(inst.id)}
                          className="p-1 rounded-md text-green-600 hover:bg-green-50 transition-colors"
                          title="Allow All Access"
                        >
                          <CheckSquare size={18} />
                        </button>
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

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="inline-flex relative cursor-pointer" onClick={(e) => e.stopPropagation()}>
      <div className="relative w-10 h-[22px]" onClick={onChange}>
        <div className={`absolute inset-0 rounded-full transition-colors duration-200 ${checked ? "bg-blue-600" : "bg-gray-300"}`} />
        <div className={`absolute left-[3px] bottom-[3px] w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-[18px]" : ""}`} />
      </div>
    </label>
  );
}
