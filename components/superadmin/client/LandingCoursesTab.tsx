"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { GripVertical, Plus, X, ChevronDown, ChevronUp, Search, Eye, EyeOff } from "lucide-react";

interface LandingField {
  id?: number;
  /** Stable local key: "id-<id>" when the API provides id, else "fos-<field_of_study>" (unique per migration). */
  key: string;
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

type FieldKey = string;
const MISSING_ID_MSG = "Field id missing — refresh the list";

export default function LandingCoursesTab() {
  const [fields, setFields] = useState<LandingField[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedField, setExpandedField] = useState<FieldKey | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeSearchField, setActiveSearchField] = useState<FieldKey | null>(null);
  const [dragFieldId, setDragFieldId] = useState<FieldKey | null>(null);
  const [dragOverFieldId, setDragOverFieldId] = useState<FieldKey | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const prevFieldsRef = useRef<LandingField[] | null>(null);

  const fetchFields = useCallback(async () => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const tok = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    const hdrs: Record<string, string> = tok ? { Authorization: `Bearer ${tok}` } : {};
    try {
      const res = await fetch(`${base}/api/v1/admin/landing-courses`, { headers: hdrs });
      const json = await res.json();
      if (json.success) {
        // Defensive normalization: the API may currently omit id/display_order/
        // is_active until the backend fix ships. Build a stable local shape so
        // React keys stay unique (field_of_study is UNIQUE per migration
        // 20260916 and can stand in for id), preventing key collapse that made
        // one search input drive all rows.
        const rawFields = (json.data || []) as Array<{
          id?: number;
          field_of_study?: string;
          display_order?: number;
          is_active?: boolean;
          institutions?: LandingInstitution[];
        }>;
        const normalized: LandingField[] = rawFields.map((f) => {
          const id = typeof f.id === "number" ? f.id : undefined;
          return {
            id,
            key: id != null ? `id-${id}` : `fos-${f.field_of_study || ""}`,
            field_of_study: f.field_of_study || "",
            display_order: typeof f.display_order === "number" ? f.display_order : 0,
            is_active: f.is_active ?? true,
            institutions: f.institutions || [],
          };
        });
        setFields(normalized);
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

  const handleSearch = useCallback((query: string, fieldKey: FieldKey) => {
    setSearchQuery(query);
    setActiveSearchField(fieldKey);

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

  const linkInstitution = async (field: LandingField, institution: SearchResults) => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const tok = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    const hdrs: Record<string, string> = tok ? { Authorization: `Bearer ${tok}` } : {};
    if (typeof field.id !== "number") {
      alert(MISSING_ID_MSG);
      return;
    }
    try {
      const res = await fetch(`${base}/api/v1/admin/landing-courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...hdrs },
        body: JSON.stringify({
          field_id: field.id,
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
        alert(err.error || err.message || "Failed to link institution");
      }
    } catch (err) {
      console.error("Link failed", err);
    }
  };

  const unlinkInstitution = async (instId?: number) => {
    if (instId == null) {
      alert(MISSING_ID_MSG);
      return;
    }
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

  const toggleFieldActive = async (field: LandingField) => {
    if (typeof field.id !== "number") {
      // Guarded twice: the eye button is disabled without an id too.
      alert(MISSING_ID_MSG);
      return;
    }
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const tok = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    const hdrs: Record<string, string> = tok ? { Authorization: `Bearer ${tok}` } : {};
    try {
      await fetch(`${base}/api/v1/admin/landing-courses/fields/${field.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...hdrs },
        body: JSON.stringify({ is_active: !field.is_active }),
      });
      fetchFields();
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const toggleExpanded = (fieldKey: FieldKey) => {
    // Reset any lingering search UI so it doesn't leak across rows.
    if (searchQuery || searchResults.length > 0 || activeSearchField !== null) {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      setSearchQuery("");
      setSearchResults([]);
      setSearching(false);
      setActiveSearchField(null);
    }
    setExpandedField((prev) => (prev === fieldKey ? null : fieldKey));
  };

  const buildReorderHeaders = (): Record<string, string> => {
    const baseToken = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    return baseToken ? { Authorization: `Bearer ${baseToken}` } : {};
  };

  const persistReorder = async (newFields: LandingField[]) => {
    // The reorder PUT needs numeric field ids; refuse invalid payloads.
    const missing = newFields.some((f) => typeof f.id !== "number");
    if (missing) throw new Error(MISSING_ID_MSG);
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await fetch(`${base}/api/v1/admin/landing-courses/fields/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...buildReorderHeaders() },
      body: JSON.stringify({
        items: newFields.map((f, i) => ({ id: f.id as number, display_order: i })),
      }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || json?.success === false) {
      throw new Error(json?.error || json?.message || "Reorder failed");
    }
  };

  const moveField = (field: LandingField, direction: "up" | "down") => {
    const idx = fields.findIndex((f) => f.key === field.key);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= fields.length) return;

    const newFields = [...fields];
    [newFields[idx], newFields[swapIdx]] = [newFields[swapIdx], newFields[idx]];
    // Renumber so local state matches the server (display_order = position).
    const reordered = newFields.map((f, i) => ({ ...f, display_order: i }));
    setFields(reordered);
    persistReorder(reordered).catch((err) => {
      console.error("Reorder failed", err);
      alert((err as { error?: string; message?: string })?.error || (err as { error?: string; message?: string })?.message || "Reorder failed");
      fetchFields();
    });
  };

  // --- Native HTML5 drag & drop (initiated via the grip handle) ---

  const handleDragStartField = (e: React.DragEvent, field: LandingField) => {
    setDragFieldId(field.key);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", field.key);
    // Close any lingering search UI while dragging.
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setSearchQuery("");
    setSearchResults([]);
    setSearching(false);
    setActiveSearchField(null);
  };

  const handleDragOverField = (e: React.DragEvent, field: LandingField) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverFieldId !== field.key) setDragOverFieldId(field.key);
  };

  const handleDragEndField = () => {
    setDragFieldId(null);
    setDragOverFieldId(null);
  };

  const handleDropField = (e: React.DragEvent, target: LandingField) => {
    e.preventDefault();
    setDragOverFieldId(null);
    if (dragFieldId === null || dragFieldId === target.key) {
      setDragFieldId(null);
      return;
    }
    const sourceKey = dragFieldId;
    setDragFieldId(null);

    const from = fields.findIndex((f) => f.key === sourceKey);
    const to = fields.findIndex((f) => f.key === target.key);

    const reordered = [...fields];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    const withOrder = reordered.map((f, i) => ({ ...f, display_order: i }));

    prevFieldsRef.current = fields;
    setFields(withOrder);

    persistReorder(withOrder)
      .then(() => {})
      .catch((err: { error?: string; message?: string } | unknown) => {
        const msg = (err as { error?: string; message?: string })?.error
          || (err as { error?: string; message?: string })?.message
          || "Failed to reorder categories";
        // Roll back to the previous snapshot, then reload true state.
        setFields(prevFieldsRef.current ?? fields);
        prevFieldsRef.current = null;
        alert(msg);
        fetchFields();
      })
      .finally(() => {
        prevFieldsRef.current = null;
      });
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
            key={field.key}
            onDragOver={(e) => handleDragOverField(e, field)}
            onDragEnd={handleDragEndField}
            onDrop={(e) => handleDropField(e, field)}
            className={`border rounded-lg transition-colors ${
              field.is_active ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100"
            } ${dragOverFieldId === field.key && dragFieldId !== field.key ? "ring-2 ring-blue-300" : ""}`}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <span
                draggable
                onDragStart={(e) => handleDragStartField(e, field)}
                className={`shrink-0 cursor-grab active:cursor-grabbing ${
                  dragFieldId === field.key ? "[&>svg]:text-blue-400" : ""
                }`}
              >
                <GripVertical className="w-4 h-4 text-gray-300" />
              </span>

              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  onClick={() => moveField(field, "up")}
                  disabled={idx === 0}
                  className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveField(field, "down")}
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
                onClick={() => toggleFieldActive(field)}
                disabled={typeof field.id !== "number"}
                className={`p-1.5 rounded-md transition-colors shrink-0 ${
                  field.is_active
                    ? "text-green-600 hover:bg-green-50"
                    : "text-gray-400 hover:bg-gray-100"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
                title={
                  typeof field.id !== "number"
                    ? "Requires API update"
                    : field.is_active
                      ? "Active on landing page"
                      : "Hidden from landing page"
                }
              >
                {field.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => toggleExpanded(field.key)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors shrink-0"
              >
                {expandedField === field.key ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {expandedField === field.key && (
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
                        value={activeSearchField === field.key ? searchQuery : ""}
                        onChange={(e) => handleSearch(e.target.value, field.key)}
                        onFocus={() => setActiveSearchField(field.key)}
                        className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
                      />
                      {searching && activeSearchField === field.key && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
                      )}
                    </div>

                    {activeSearchField === field.key && searchResults.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((result) => {
                          const alreadyLinked = field.institutions.some(
                            (i) =>
                              i.institution_id === result.id && i.institution_type === result.type,
                          );
                          return (
                            <button
                              key={`${result.type}-${result.id}`}
                              onClick={() => !alreadyLinked && linkInstitution(field, result)}
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
