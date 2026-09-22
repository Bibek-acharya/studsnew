"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash, X, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from "lucide-react";
import {
  collegeAdAdminApi,
  type TrendingCollegeAd,
  type TrendingCollegeKind,
  type CollegeFeedbackItem,
  type CollegeFeedbackStats,
} from "@/services/collegeAdApi";
import { apiRequest } from "@/services/api";

const KIND_TABS = [
  { id: "spotlight" as TrendingCollegeKind, label: "Monthly Spotlight" },
  { id: "most_searched" as TrendingCollegeKind, label: "Most Searched" },
];

const MAX_ITEMS = 10;

type SearchItem = { id: number; name: string };

const formatDate = (value: string) => {
  if (!value) return "\u2014";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function CollegePageAdsSection() {
  const [items, setItems] = useState<TrendingCollegeAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kindTab, setKindTab] = useState<TrendingCollegeKind>("spotlight");

  // Secondary view: entries vs feedback responses
  const [viewTab, setViewTab] = useState<"entries" | "feedback">("entries");
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TrendingCollegeAd | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedCollege, setSelectedCollege] = useState<SearchItem | null>(null);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [collegeResults, setCollegeResults] = useState<SearchItem[]>([]);
  const [headline, setHeadline] = useState("");
  const [priority, setPriority] = useState(0);
  const [active, setActive] = useState(true);

  // Feedback state
  const [feedbackItems, setFeedbackItems] = useState<CollegeFeedbackItem[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<CollegeFeedbackStats>({
    total: 0,
    helpful_count: 0,
    not_helpful_count: 0,
  });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const collegeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await collegeAdAdminApi.listTrending();
      setItems(res);
    } catch {
      setError("Failed to load college ads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const fetchFeedback = useCallback(async () => {
    setFeedbackLoading(true);
    setFeedbackError(null);
    try {
      const res = await collegeAdAdminApi.listFeedback();
      setFeedbackItems(res.items);
      setFeedbackStats(res.stats);
    } catch {
      setFeedbackError("Failed to load feedback responses");
    } finally {
      setFeedbackLoading(false);
    }
  }, []);

  const toggleFeedback = useCallback(() => {
    setFeedbackOpen((prev) => {
      const next = !prev;
      if (next && feedbackItems.length === 0 && !feedbackLoading) {
        fetchFeedback();
      }
      return next;
    });
  }, [feedbackItems.length, feedbackLoading, fetchFeedback]);

  // ── Search ────────────────────────────────────────────────────────────────

  const searchColleges = useCallback((query: string) => {
    if (collegeDebounceRef.current) clearTimeout(collegeDebounceRef.current);
    if (!query.trim()) {
      setCollegeResults([]);
      return;
    }
    collegeDebounceRef.current = setTimeout(async () => {
      try {
        const raw: unknown = await apiRequest(
          `/api/v1/superadmin/institutions/search?search=${encodeURIComponent(query)}`
        );
        const body = (raw as Record<string, any>)?.data ?? raw;
        const list = ((body as Record<string, any>)?.institutions || []) as Record<string, unknown>[];
        setCollegeResults(
          list.map((i) => {
            const name = ((i.institution_name || i.name || i.title) as string) || "";
            return { id: Number(i.id), name };
          })
        );
      } catch {
        setCollegeResults([]);
      }
    }, 300);
  }, []);

  // ── Modal open/close ──────────────────────────────────────────────────────

  const resetForm = useCallback(() => {
    setSelectedCollege(null);
    setCollegeSearch("");
    setCollegeResults([]);
    setHeadline("");
    setPriority(0);
    setActive(true);
  }, []);

  const openCreateForm = useCallback(() => {
    setEditingItem(null);
    resetForm();
    setShowForm(true);
  }, [resetForm]);

  const openEditForm = useCallback((item: TrendingCollegeAd) => {
    setEditingItem(item);
    setSelectedCollege(
      item.college ? { id: item.college.id, name: item.college.name } : null
    );
    setCollegeSearch("");
    setCollegeResults([]);
    setHeadline(item.headline || "");
    setPriority(item.priority || 0);
    setActive(item.active);
    setShowForm(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowForm(false);
    setEditingItem(null);
  }, []);

  // ── College selection (exactly one per item) ──────────────────────────────

  const handleSelectCollege = useCallback((item: SearchItem) => {
    setSelectedCollege(item);
    setCollegeSearch("");
    setCollegeResults([]);
  }, []);

  // ── Save ──────────────────────────────────────────────────────────────────

  const canSave = selectedCollege !== null;

  const handleFormSave = useCallback(async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const payload = {
        kind: kindTab,
        college_id: (selectedCollege || { id: editingItem?.college?.id || 0 }).id,
        headline: headline.trim() || undefined,
        priority,
        active,
      };

      if (editingItem) {
        await collegeAdAdminApi.updateTrending(editingItem.id, payload);
      } else {
        await collegeAdAdminApi.createTrending(payload);
      }
      closeModal();
      fetchItems();
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message || "Failed to save college ad";
      alert(message);
    } finally {
      setSaving(false);
    }
  }, [
    canSave, editingItem, kindTab, selectedCollege, headline, active,
    priority, closeModal, fetchItems,
  ]);

  // ── Row actions ───────────────────────────────────────────────────────────

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Delete this college ad?")) return;
      try {
        await collegeAdAdminApi.removeTrending(id);
        fetchItems();
      } catch {
        alert("Failed to delete college ad");
      }
    },
    [fetchItems]
  );

  const handleToggleActive = useCallback(async (item: TrendingCollegeAd) => {
    try {
      await collegeAdAdminApi.updateTrending(item.id, { active: !item.active });
      setItems((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, active: !c.active } : c))
      );
    } catch {
      alert("Failed to toggle active status");
    }
  }, []);

  const visibleItems = items.filter((i) => i.kind === kindTab);
  const atItemCap = visibleItems.length >= MAX_ITEMS;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Find College Page Ads</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            {visibleItems.length}/{MAX_ITEMS} items
          </span>
          <button
            onClick={openCreateForm}
            disabled={atItemCap || viewTab !== "entries"}
            title={atItemCap ? `Limit reached — max ${MAX_ITEMS} items per kind` : undefined}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={18} /> Create Item
          </button>
        </div>
      </div>

      {/* View tabs: entries / feedback */}
      <div className="flex items-center gap-1 px-6 pt-4">
        <button
          onClick={() => setViewTab("entries")}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
            viewTab === "entries"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Ad Entries
        </button>
        <button
          onClick={() => {
            setViewTab("feedback");
            setFeedbackOpen(true);
            if (feedbackItems.length === 0 && !feedbackLoading) fetchFeedback();
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
            viewTab === "feedback"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Feedback Responses
        </button>
      </div>

      {viewTab === "entries" && (
        <>
          {/* Kind tabs */}
          <div className="flex items-center gap-1 px-6 pt-3">
            {KIND_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setKindTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  kindTab === tab.id
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
            <div className="px-6 py-8 text-center text-gray-500">Loading items...</div>
          ) : error ? (
            <div className="px-6 py-8 text-center text-red-500">{error}</div>
          ) : visibleItems.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 text-sm">No items found for this kind.</p>
              <button
                onClick={openCreateForm}
                className="mt-3 text-blue-600 hover:underline text-sm font-medium"
              >
                Create your first college ad
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                    <th className="px-4 py-3 w-10">#</th>
                    <th className="px-4 py-3">College</th>
                    <th className="px-4 py-3">Headline</th>
                    <th className="px-4 py-3">Active</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900 max-w-[200px] truncate block">
                          {item.college?.name || `College #${item.college?.id}`}
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.college?.rating ? `★ ${item.college.rating}` : ""}
                          {item.college?.location ? ` · ${item.college.location}` : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                        {item.headline || "\u2014"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(item)}
                          className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                            item.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.priority}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditForm(item)}
                            className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Feedback Responses */}
      {viewTab === "feedback" && (
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Recommendation Feedback
            </h3>
            <button
              onClick={toggleFeedback}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              {feedbackOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {feedbackOpen ? "Collapse" : "Expand"}
            </button>
          </div>

          {feedbackOpen && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase">Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {feedbackStats.total}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase">Helpful</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {feedbackStats.helpful_count}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Not Helpful
                  </p>
                  <p className="text-2xl font-bold text-red-500 mt-1">
                    {feedbackStats.not_helpful_count}
                  </p>
                </div>
              </div>

              {/* Responses table */}
              {feedbackLoading ? (
                <div className="py-8 text-center text-gray-500">
                  Loading feedback responses...
                </div>
              ) : feedbackError ? (
                <div className="py-8 text-center text-red-500">{feedbackError}</div>
              ) : feedbackItems.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-sm">
                  No feedback responses yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                        <th className="px-4 py-3">Rating</th>
                        <th className="px-4 py-3">Helpful</th>
                        <th className="px-4 py-3">Reasons</th>
                        <th className="px-4 py-3">Comment</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbackItems.map((fb) => (
                        <tr
                          key={fb.id}
                          className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-600">
                            {fb.rating ? `★ ${fb.rating}` : "\u2014"}
                          </td>
                          <td className="px-4 py-3">
                            {fb.helpful ? (
                              <span className="inline-flex items-center gap-1.5 text-green-600">
                                <ThumbsUp size={14} /> Helpful
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-red-500">
                                <ThumbsDown size={14} /> Not helpful
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600 max-w-[220px] truncate">
                            {fb.reasons || "\u2014"}
                          </td>
                          <td className="px-4 py-3 text-gray-600 max-w-[260px] truncate">
                            {fb.comment || "\u2014"}
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {formatDate(fb.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem
                  ? "Edit College Ad"
                  : `Create College Ad (${kindTab === "spotlight" ? "Monthly Spotlight" : "Most Searched"})`}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* College search picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  College <span className="text-red-500">*</span>
                </label>
                {selectedCollege ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700">
                      {selectedCollege.name}
                      <button
                        type="button"
                        onClick={() => setSelectedCollege(null)}
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={collegeSearch}
                      onChange={(e) => {
                        setCollegeSearch(e.target.value);
                        searchColleges(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                      placeholder="Search colleges..."
                    />
                    {collegeResults.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {collegeResults.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectCollege(item)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  {selectedCollege
                    ? "1/1 selected — exactly one college"
                    : "0/1 selected — exactly one college"}
                </p>
              </div>

              {/* Headline + priority */}
              <div className="border-t border-gray-200 pt-4 grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                    placeholder="Ad headline (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Priority
                  </label>
                  <input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                    min={0}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSave}
                disabled={saving || (!editingItem && !canSave)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingItem ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
