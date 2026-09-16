"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { GripVertical, Plus, X, ChevronDown, ChevronUp, Search, Eye, EyeOff } from "lucide-react";

interface LandingField {
  id: number;
  field_of_study: string;
  display_order: number;
  is_active: boolean;
  institutions: LandingInstitution[];
}

interface LandingInstitution {
  id: number;
  field_id: number;
  institution_id: number;
  institution_type: string;
  institution_name: string;
  institution_logo: string;
  slug: string;
  order_index: number;
}

interface SearchResults {
  id: number;
  name: string;
  logo_url: string;
  type: string;
  slug: string;
  location: string;
}

export default function LandingCoursesTab() {
  const [fields, setFields] = useState<LandingField[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedField, setExpandedField] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeSearchField, setActiveSearchField] = useState<number | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const fetchFields = useCallback(async () => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const tok = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    const hdrs: Record<string, string> = tok ? { Authorization: `Bearer ${tok}` } : {};
    try {
      const res = await fetch(`${base}/api/v1/admin/landing-courses`, { headers: hdrs });
      const json = await res.json();
      if (json.success) {
        setFields(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch landing courses", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const handleSearch = useCallback((query: string, fieldId: number) => {
    setSearchQuery(query);
    setActiveSearchField(fieldId);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!query.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const tok = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    const hdrs: Record<string, string> = tok ? { Authorization: `Bearer ${tok}` } : {};

    setSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${base}/api/v1/admin/landing-courses/search?q=${encodeURIComponent(query)}`,
          { headers: hdrs },
        );
        const json = await res.json();
        setSearchResults(json.data || []);
      } catch (err) {
        console.error("Search failed", err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  const linkInstitution = async (fieldId: number, institution: SearchResults) => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const tok = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    const hdrs: Record<string, string> = tok ? { Authorization: `Bearer ${tok}` } : {};
    try {
      const res = await fetch(`${base}/api/v1/admin/landing-courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...hdrs },
        body: JSON.stringify({
          field_id: fieldId,
          institution_id: institution.id,
          institution_type: institution.type,
          institution_name: institution.name,
          institution_logo: institution.logo_url,
          slug: institution.slug,
        }),
      });
      if (res.ok) {
        setSearchQuery("");
        setSearchResults([]);
        setActiveSearchField(null);
        fetchFields();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to link institution");
      }
    } catch (err) {
      console.error("Link failed", err);
    }
  };

  const unlinkInstitution = async (instId: number) => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const tok = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    const hdrs: Record<string, string> = tok ? { Authorization: `Bearer ${tok}` } : {};
    try {
      const res = await fetch(`${base}/api/v1/admin/landing-courses/${instId}`, {
        method: "DELETE",
        headers: hdrs,
      });
      if (res.ok) fetchFields();
    } catch (err) {
      console.error("Unlink failed", err);
    }
  };

  const toggleFieldActive = async (fieldId: number, isActive: boolean) => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const tok = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    const hdrs: Record<string, string> = tok ? { Authorization: `Bearer ${tok}` } : {};
    try {
      await fetch(`${base}/api/v1/admin/landing-courses/fields/${fieldId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...hdrs },
        body: JSON.stringify({ is_active: isActive }),
      });
      fetchFields();
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const moveField = async (fieldId: number, direction: "up" | "down") => {
    const idx = fields.findIndex((f) => f.id === fieldId);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= fields.length) return;

    const newFields = [...fields];
    [newFields[idx].display_order, newFields[swapIdx].display_order] = [
      newFields[swapIdx].display_order,
      newFields[idx].display_order,
    ];
    [newFields[idx], newFields[swapIdx]] = [newFields[swapIdx], newFields[idx]];

    setFields(newFields);

    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const tok = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    const hdrs: Record<string, string> = tok ? { Authorization: `Bearer ${tok}` } : {};
    try {
      await fetch(`${base}/api/v1/admin/landing-courses/fields/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...hdrs },
        body: JSON.stringify({
          items: newFields.map((f, i) => ({ id: f.id, display_order: i })),
        }),
      });
    } catch (err) {
      console.error("Reorder failed", err);
      fetchFields();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Landing Course Categories</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage which field of study categories and institution logos appear on the landing page.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {fields.map((field, idx) => (
          <div
            key={field.id}
            className={`border rounded-lg transition-colors ${
              field.is_active ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100"
            }`}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <GripVertical className="w-4 h-4 text-gray-300 cursor-grab shrink-0" />

              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  onClick={() => moveField(field.id, "up")}
                  disabled={idx === 0}
                  className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveField(field.id, "down")}
                  disabled={idx === fields.length - 1}
                  className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <span
                className={`flex-1 text-sm font-medium ${
                  field.is_active ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {field.field_of_study}
              </span>

              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                {field.institutions.length}/5
              </span>

              <button
                onClick={() => toggleFieldActive(field.id, !field.is_active)}
                className={`p-1.5 rounded-md transition-colors shrink-0 ${
                  field.is_active
                    ? "text-green-600 hover:bg-green-50"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
                title={field.is_active ? "Active on landing page" : "Hidden from landing page"}
              >
                {field.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setExpandedField(expandedField === field.id ? null : field.id)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors shrink-0"
              >
                {expandedField === field.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {expandedField === field.id && (
              <div className="px-4 pb-4 border-t border-gray-100">
                {field.institutions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 mb-3">
                    {field.institutions.map((inst) => (
                      <div
                        key={inst.id}
                        className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 group"
                      >
                        <div className="w-8 h-8 rounded-md bg-white border border-gray-100 flex items-center justify-center p-1">
                          <Image
                            src={
                              inst.institution_logo ||
                              "https://placehold.co/32x32/f1f5f9/94a3b8?text=L"
                            }
                            alt={inst.institution_name}
                            width={32}
                            height={32}
                            unoptimized
                            className="max-w-full max-h-full object-contain rounded-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/32x32/f1f5f9/94a3b8?text=L";
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 max-w-[120px] truncate">
                          {inst.institution_name}
                        </span>
                        <button
                          onClick={() => unlinkInstitution(inst.id)}
                          className="p-0.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {field.institutions.length < 5 && (
                  <div className="relative">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <Search className="w-4 h-4 text-gray-400 shrink-0" />
                      <input
                        type="text"
                        placeholder={`Search institutions to link... (${5 - field.institutions.length} slots remaining)`}
                        value={activeSearchField === field.id ? searchQuery : ""}
                        onChange={(e) => handleSearch(e.target.value, field.id)}
                        onFocus={() => setActiveSearchField(field.id)}
                        className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
                      />
                      {searching && activeSearchField === field.id && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
                      )}
                    </div>

                    {activeSearchField === field.id && searchResults.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((result) => {
                          const alreadyLinked = field.institutions.some(
                            (i) =>
                              i.institution_id === result.id && i.institution_type === result.type,
                          );
                          return (
                            <button
                              key={`${result.type}-${result.id}`}
                              onClick={() => !alreadyLinked && linkInstitution(field.id, result)}
                              disabled={alreadyLinked}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                                alreadyLinked ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center p-1 shrink-0">
                                <Image
                                  src={
                                    result.logo_url ||
                                    "https://placehold.co/32x32/f1f5f9/94a3b8?text=L"
                                  }
                                  alt={result.name}
                                  width={32}
                                  height={32}
                                  unoptimized
                                  className="max-w-full max-h-full object-contain rounded-sm"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://placehold.co/32x32/f1f5f9/94a3b8?text=L";
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {result.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {result.type === "institution" ? "Institution" : "College"}
                                  {result.location ? ` · ${result.location}` : ""}
                                </p>
                              </div>
                              {alreadyLinked && (
                                <span className="text-xs text-gray-400 shrink-0">Linked</span>
                              )}
                              {!alreadyLinked && (
                                <Plus className="w-4 h-4 text-blue-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {field.institutions.length >= 5 && (
                  <p className="text-xs text-amber-600 mt-2">
                    Maximum 5 institutions linked. Remove one to add another.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No field categories found. The migration may not have run yet.</p>
        </div>
      )}
    </div>
  );
}
