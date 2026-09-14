"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash, X } from "lucide-react";
import {
  adminAdApi,
  type AdminAd,
  type AdminAdCreatePayload,
} from "@/services/adminAdApi";
import { apiRequest } from "@/services/api";

const POSITION_TABS = [
  { id: "carousel", label: "Carousel (Colleges)" },
  { id: "panel", label: "Panel (Courses)" },
] as const;

const PAGE_SIZE = 10;

const emptyForm = {
  title: "",
  image_url: "",
  link_url: "",
  position: "carousel",
  location: "",
  priority: 0,
  start_date: "",
  end_date: "",
  active: true,
  entity_type: "college" as "none" | "college" | "course",
  entity_search: "",
  description: "",
  accent: "#0000ff",
};

type FormData = typeof emptyForm;

type SearchItem = { id: number; name: string };

const resolveImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("/uploads")) {
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${url}`;
  }
  return url;
};

export default function CoursePageAdsSection() {
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [positionTab, setPositionTab] = useState<string>("carousel");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<AdminAd | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Entity search state
  const [entityResults, setEntityResults] = useState<SearchItem[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<SearchItem[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAdApi.listAds({
        ad_page: "course-finder",
        limit: PAGE_SIZE,
        ...(positionTab !== "all" ? { position: positionTab } : {}),
        ...(page > 1 ? { page } : {}),
      });
      setAds(res.ads || []);
      setTotal(res.meta?.total || 0);
    } catch {
      setError("Failed to load ads");
    } finally {
      setLoading(false);
    }
  }, [positionTab, page]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const handlePositionTabChange = useCallback((tab: string) => {
    setPositionTab(tab);
    setPage(1);
  }, []);

  const openCreateForm = useCallback(() => {
    const entityType = positionTab === "carousel" ? "college" : "course";
    setEditingAd(null);
    setForm({ ...emptyForm, position: positionTab, entity_type: entityType });
    setSelectedEntities([]);
    setEntityResults([]);
    setShowForm(true);
  }, [positionTab]);

  const openEditForm = useCallback((ad: AdminAd) => {
    const entityType = ad.college_id ? "college" : ad.course_id ? "course" : "none";
    setEditingAd(ad);
    setForm({
      title: ad.title,
      image_url: ad.image_url,
      link_url: ad.link_url,
      position: ad.position,
      location: ad.location || "",
      priority: ad.priority || 0,
      start_date: ad.start_date ? ad.start_date.slice(0, 10) : "",
      end_date: ad.end_date ? ad.end_date.slice(0, 10) : "",
      active: ad.active,
      entity_type: entityType as "none" | "college" | "course",
      entity_search: "",
      description: ad.description || "",
      accent: ad.accent || "#0000ff",
    });
    setSelectedEntities(
      (ad.college_id || ad.course_id)
        ? [{ id: (ad.college_id || ad.course_id) as number, name: ad.college_name || ad.course_title || "" }]
        : []
    );
    setEntityResults([]);
    setShowForm(true);
  }, []);

  const debouncedSearch = useCallback(
    (
      query: string,
      endpoint: string,
    ) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!query.trim()) {
        setEntityResults([]);
        return;
      }
      debounceRef.current = setTimeout(async () => {
        try {
          const param = endpoint.includes("institutions") ? "search" : "q";
          const raw: Record<string, unknown> = await apiRequest(
            endpoint + "?" + param + "=" + encodeURIComponent(query)
          );
          // apiRequest returns {success, data: {institutions|courses: [...]}, message}
          const body = (raw.data ?? raw) as Record<string, unknown>;
          const key = endpoint.includes("institutions") ? "institutions" : "courses";
          const list = (body[key] || []) as Record<string, unknown>[];
          setEntityResults(
            list.map((i) => ({
              id: Number(i.id),
              name: (i.institution_name || i.name || i.title) as string,
            }))
          );
        } catch {
          setEntityResults([]);
        }
      }, 300);
    },
    []
  );

  const handleSelectEntity = useCallback((item: SearchItem) => {
    setSelectedEntities((prev) => {
      if (prev.some((e) => e.id === item.id)) return prev;
      return [...prev, item];
    });
    setForm((f) => ({ ...f, entity_search: "" }));
    setEntityResults([]);
  }, []);

  const handleFormSave = useCallback(async () => {
    if (!form.title.trim() && selectedEntities.length === 0) return;
    setSaving(true);
    try {
      const payload: AdminAdCreatePayload = {
        title: form.title.trim(),
        image_url: form.image_url.trim(),
        link_url: form.link_url.trim(),
        position: form.position,
        location: form.location.trim(),
        priority: form.priority,
        start_date: form.start_date,
        end_date: form.end_date,
        active: form.active,
        page: "course-finder",
        description: form.description.trim() || undefined,
        accent: form.accent,
      };

      if (editingAd) {
        await adminAdApi.updateAd(editingAd.id, payload);
      } else if (selectedEntities.length > 0) {
        // Batch create — one ad per entity
        for (const entity of selectedEntities) {
          const entityPayload: AdminAdCreatePayload = {
            ...payload,
            title: form.title.trim() || entity.name,
            college_id: form.entity_type === "college" ? entity.id : undefined,
            course_id: form.entity_type === "course" ? entity.id : undefined,
          };
          await adminAdApi.createAd(entityPayload);
        }
      } else {
        // Standalone banner (no entity)
        await adminAdApi.createAd(payload);
      }
      setShowForm(false);
      setEditingAd(null);
      fetchAds();
    } catch {
      alert("Failed to save ad");
    } finally {
      setSaving(false);
    }
  }, [editingAd, form, fetchAds, selectedEntities]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Delete this ad?")) return;
      try {
        await adminAdApi.deleteAd(id);
        fetchAds();
      } catch {
        alert("Failed to delete ad");
      }
    },
    [fetchAds]
  );

  const handleToggleActive = useCallback(
    async (ad: AdminAd) => {
      try {
        await adminAdApi.toggleAdActive(ad.id, !ad.active);
        setAds((prev) =>
          prev.map((a) => (a.id === ad.id ? { ...a, active: !a.active } : a))
        );
      } catch {
        alert("Failed to toggle active status");
      }
    },
    []
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Course Finder Page Ads</h2>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
        >
          <Plus size={18} /> Create Ad
        </button>
      </div>

      {/* Position filter tabs */}
      <div className="flex items-center gap-1 px-6 pt-4">
        {POSITION_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handlePositionTabChange(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              positionTab === tab.id
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="px-6 py-8 text-center text-gray-500">Loading ads...</div>
      ) : error ? (
        <div className="px-6 py-8 text-center text-red-500">{error}</div>
      ) : ads.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500 text-sm">No ads found for this filter.</p>
          <button
            onClick={openCreateForm}
            className="mt-3 text-blue-600 hover:underline text-sm font-medium"
          >
            Create your first course page ad
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <th className="px-4 py-3 w-10">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Linked Entity</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Clicks</th>
                <th className="px-4 py-3">Impressions</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad, idx) => {
                const linkedEntity =
                  ad.college_name || ad.course_title || null;
                const adDescription = ad.description || null;
                return (
                  <tr
                    key={ad.id}
                    className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-500">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 max-w-[200px] truncate block">
                        {ad.title}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                        {ad.position}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                      {linkedEntity || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                      {adDescription || "\u2014"}
                    </td>
                    <td className="px-4 py-3">
                      {ad.image_url ? (
                        <img
                          src={resolveImageUrl(ad.image_url)}
                          alt=""
                          className="w-16 h-10 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-16 h-10 bg-gray-100 rounded border flex items-center justify-center text-[10px] text-gray-400">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(ad)}
                        className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                          ad.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {ad.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{ad.priority}</td>
                    <td className="px-4 py-3 text-gray-600">{ad.clicks}</td>
                    <td className="px-4 py-3 text-gray-600">{ad.impressions}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditForm(ad)}
                          className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, total)} of {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="text-gray-500">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {editingAd ? "Edit Ad" : "Create Ad"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingAd(null);
                }}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Manual fields only for standalone banner (no entity linked) */}
              {form.entity_type === "none" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                      placeholder="Ad title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={form.image_url}
                      onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                      placeholder="https://..."
                    />
                    {form.image_url && (
                      <img
                        src={resolveImageUrl(form.image_url)}
                        alt="Preview"
                        className="mt-2 max-h-24 rounded object-contain"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Link URL
                    </label>
                    <input
                      type="text"
                      value={form.link_url}
                      onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              {form.entity_type !== "none" && !form.title && (
                <p className="text-xs text-gray-400 italic">
                  Title, image, and link are auto-filled from the linked entity.
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Position
                  </label>
                  <select
                    value={form.position}
                    onChange={(e) => {
                      const pos = e.target.value;
                      const entityType = pos === "carousel" ? "college" : pos === "panel" ? "course" : "none";
                      setForm((f) => ({
                        ...f,
                        position: pos,
                        entity_type: entityType,
                        entity_search: "",
                      }));
                      setSelectedEntities([]);
                      setEntityResults([]);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                  >
                    <option value="carousel">Carousel (Colleges)</option>
                    <option value="panel">Panel (Courses)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Priority
                  </label>
                  <input
                    type="number"
                    value={form.priority}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, priority: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                    min={0}
                  />
                </div>
              </div>

              {/* Location: only for standalone banner */}
              {form.entity_type === "none" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                    placeholder="Descriptive label"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* Description: only for standalone banner */}
              {form.entity_type === "none" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none resize-none"
                    placeholder="Ad description"
                  />
                </div>
              )}

              {/* Accent Color */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-700">
                  Accent Color
                </label>
                <input
                  type="color"
                  value={form.accent}
                  onChange={(e) => setForm((f) => ({ ...f, accent: e.target.value }))}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0"
                />
                <span className="text-xs text-gray-500 font-mono">{form.accent}</span>
              </div>

              {/* Only show entity linking for carousel (college) and panel (course) */}
              {form.entity_type !== "none" && (
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select {form.position === "carousel" ? "Colleges" : "Courses"}
                  </label>
                  
                  {/* Selected entities as chips */}
                  {selectedEntities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedEntities.map((entity) => (
                        <span
                          key={entity.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700"
                        >
                          {entity.name}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedEntities((prev) => prev.filter((e) => e.id !== entity.id))
                            }
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Search input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={form.entity_search}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm((f) => ({ ...f, entity_search: val }));
                        const endpoint =
                          form.entity_type === "college"
                            ? "/api/v1/superadmin/institutions/search"
                            : "/api/v1/education/courses/search";
                        debouncedSearch(val, endpoint);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                      placeholder={form.entity_type === "college" ? "Search colleges..." : "Search courses..."}
                    />
                    {entityResults.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {entityResults.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectEntity(item)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {selectedEntities.length > 0
                      ? `${selectedEntities.length} selected — one ad will be created per entity`
                      : "Search and select multiple — each becomes an ad slide"}
                  </p>
                </div>
              )}

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingAd(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSave}
                disabled={saving || (!form.title.trim() && selectedEntities.length === 0)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingAd ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
