"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Search, X, Loader2, Building2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Institution {
  id: number;
  institution_name: string;
  registration_number?: string;
  level?: string;
  organization_type?: string;
}

interface CollegePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (institution: Institution) => void;
  selectedId?: number;
}

async function superadminFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("superadmin_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  if (response.status === 401 || response.status === 403)
    throw new Error("auth_required");
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Unexpected response");
  }
  if (!response.ok)
    throw new Error(data.message || data.error || "Request failed");
  return data as T;
}

export default function CollegePickerModal({
  open,
  onClose,
  onSelect,
  selectedId,
}: CollegePickerModalProps) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setLoading(true);
    superadminFetch<{ data: { institutions: Institution[] } }>(
      "/api/v1/superadmin/institutions",
    )
      .then((res) => setInstitutions(res.data?.institutions || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  const filtered = institutions.filter((inst) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      inst.institution_name.toLowerCase().includes(q) ||
      (inst.registration_number || "").toLowerCase().includes(q)
    );
  });

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSelect = (inst: Institution) => {
    onSelect(inst);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" /> Select Institution
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by institution name or reg. number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Building2 size={40} className="mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No institutions found</p>
              <p className="text-sm mt-1">
                {search
                  ? "Try a different search term."
                  : "No institutions available."}
              </p>
            </div>
          ) : (
            <div>
              {filtered.map((inst) => (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => handleSelect(inst)}
                  className={`w-full text-left px-6 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors flex items-center justify-between gap-4 ${
                    selectedId === inst.id
                      ? "bg-blue-50 ring-1 ring-blue-200"
                      : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {inst.institution_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {[inst.registration_number, inst.level]
                        .filter(Boolean)
                        .join(" | ") || "—"}
                    </p>
                  </div>
                  {inst.organization_type && (
                    <span className="shrink-0 text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 font-medium">
                      {inst.organization_type}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
