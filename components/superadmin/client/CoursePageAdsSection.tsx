"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash, X } from "lucide-react";
import {
  courseAdAdminApi,
  uploadCourseAdFile,
  type CourseAdCard,
  type CourseAdCardPayload,
  type CourseAdPosition,
} from "@/services/courseAdApi";
import { apiRequest } from "@/services/api";

const POSITION_TABS = [
  { id: "multi_college" as CourseAdPosition, label: "Course with different colleges" },
  { id: "single_college" as CourseAdPosition, label: "Course in individual college" },
];

const MAX_CARDS = 10;
const MAX_INSTITUTIONS = 7;
const MAX_MOU = 12;

const emptyMouRow = () => ({
  key: Date.now() + Math.random(),
  name: "",
  company_url: "",
  logo_url: "",
  uploading: false,
});

type MouRow = ReturnType<typeof emptyMouRow>;

type SearchItem = { id: number; name: string };

const resolveImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("/uploads")) {
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${url}`;
  }
  return url;
};

export default function CoursePageAdsSection() {
  const [cards, setCards] = useState<CourseAdCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [positionTab, setPositionTab] = useState<CourseAdPosition>("multi_college");

  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<CourseAdCard | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedCourse, setSelectedCourse] = useState<SearchItem | null>(null);
  const [courseSearch, setCourseSearch] = useState("");
  const [courseResults, setCourseResults] = useState<SearchItem[]>([]);

  const [selectedInstitutions, setSelectedInstitutions] = useState<SearchItem[]>([]);
  const [institutionSearch, setInstitutionSearch] = useState("");
  const [institutionResults, setInstitutionResults] = useState<SearchItem[]>([]);

  const [mouRows, setMouRows] = useState<MouRow[]>([]);
  const [subtitle, setSubtitle] = useState("");
  const [priority, setPriority] = useState(0);
  const [active, setActive] = useState(true);

  const courseDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const institutionDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await courseAdAdminApi.list(positionTab);
      setCards(res);
    } catch {
      setError("Failed to load course ad cards");
    } finally {
      setLoading(false);
    }
  }, [positionTab]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // ── Search ────────────────────────────────────────────────────────────────

  const searchCourses = useCallback((query: string) => {
    if (courseDebounceRef.current) clearTimeout(courseDebounceRef.current);
    if (!query.trim()) {
      setCourseResults([]);
      return;
    }
    courseDebounceRef.current = setTimeout(async () => {
      try {
        const raw: unknown = await apiRequest(
          `/api/v1/education/courses/search?q=${encodeURIComponent(query)}`
        );
        const body = (raw as Record<string, any>)?.data ?? raw;
        const list = ((body as Record<string, any>)?.courses || []) as Record<string, unknown>[];
        setCourseResults(
          list.map((c) => ({ id: Number(c.id), name: (c.title || c.name || "") as string }))
        );
      } catch {
        setCourseResults([]);
      }
    }, 300);
  }, []);

  const searchInstitutions = useCallback((query: string) => {
    if (institutionDebounceRef.current) clearTimeout(institutionDebounceRef.current);
    if (!query.trim()) {
      setInstitutionResults([]);
      return;
    }
    institutionDebounceRef.current = setTimeout(async () => {
      try {
        const raw: unknown = await apiRequest(
          `/api/v1/superadmin/institutions/search?search=${encodeURIComponent(query)}`
        );
        const body = (raw as Record<string, any>)?.data ?? raw;
        const list = ((body as Record<string, any>)?.institutions || []) as Record<string, unknown>[];
        setInstitutionResults(
          list.map((i) => {
            const name = ((i.institution_name || i.name || i.title) as string) || "";
            return { id: Number(i.id), name };
          })
        );
      } catch {
        setInstitutionResults([]);
      }
    }, 300);
  }, []);

  // ── Modal open/close ──────────────────────────────────────────────────────

  const resetForm = useCallback(() => {
    setSelectedCourse(null);
    setCourseSearch("");
    setCourseResults([]);
    setSelectedInstitutions([]);
    setInstitutionSearch("");
    setInstitutionResults([]);
    setMouRows([]);
    setSubtitle("");
    setPriority(0);
    setActive(true);
  }, []);

  const openCreateForm = useCallback(() => {
    setEditingCard(null);
    resetForm();
    setShowForm(true);
  }, [resetForm]);

  const openEditForm = useCallback((card: CourseAdCard) => {
    setEditingCard(card);
    setSelectedCourse({ id: card.course.id, name: card.course.title });
    setCourseSearch("");
    setCourseResults([]);
    setSelectedInstitutions(
      card.institutions.map((i) => ({ id: i.id, name: i.name }))
    );
    setInstitutionSearch("");
    setInstitutionResults([]);
    setMouRows(
      card.mou_companies.map((m) => ({
        key: Date.now() + Math.random(),
        name: m.name,
        company_url: m.company_url || "",
        logo_url: m.logo_url || "",
        uploading: false,
      }))
    );
    setSubtitle(card.subtitle || "");
    setPriority(card.priority || 0);
    setActive(card.active);
    setShowForm(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowForm(false);
    setEditingCard(null);
  }, []);

  // ── Entity selection ──────────────────────────────────────────────────────

  const handleSelectCourse = useCallback((item: SearchItem) => {
    setSelectedCourse(item);
    setCourseSearch("");
    setCourseResults([]);
  }, []);

  const handleSelectInstitution = useCallback((item: SearchItem) => {
    if (positionTab === "multi_college") {
      setSelectedInstitutions((prev) => {
        if (prev.some((e) => e.id === item.id) || prev.length >= MAX_INSTITUTIONS) return prev;
        return [...prev, item];
      });
    } else {
      setSelectedInstitutions([item]);
    }
    setInstitutionSearch("");
    setInstitutionResults([]);
  }, [positionTab]);

  // ── MOU rows ──────────────────────────────────────────────────────────────

  const addMouRow = useCallback(() => {
    setMouRows((prev) => {
      if (prev.length >= MAX_MOU) return prev;
      return [...prev, emptyMouRow()];
    });
  }, []);

  const removeMouRow = useCallback((key: number) => {
    setMouRows((prev) => prev.filter((r) => r.key !== key));
  }, []);

  const updateMouRow = useCallback(
    (key: number, field: "name" | "company_url" | "logo_url", value: string) => {
      setMouRows((prev) =>
        prev.map((r) => (r.key === key ? { ...r, [field]: value } : r))
      );
    },
    []
  );

  const handleMouLogoUpload = useCallback(async (key: number, file: File) => {
    setMouRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, uploading: true } : r))
    );
    try {
      const path = await uploadCourseAdFile(file, "course-ads/mou");
      updateMouRow(key, "logo_url", path);
    } catch {
      alert("Failed to upload logo");
    } finally {
      setMouRows((prev) =>
        prev.map((r) => (r.key === key ? { ...r, uploading: false } : r))
      );
    }
  }, [updateMouRow]);

  // ── Save ──────────────────────────────────────────────────────────────────

  const canSave = (() => {
    if (!selectedCourse) return false;
    if (positionTab === "multi_college") return selectedInstitutions.length > 0;
    return selectedInstitutions.length === 1;
  })();

  const handleFormSave = useCallback(async () => {
    if (!canSave && !editingCard) return;
    setSaving(true);
    try {
      let payload: CourseAdCardPayload;
      if (positionTab === "multi_college") {
        payload = {
          position: "multi_college",
          course_id: (selectedCourse || { id: editingCard?.course.id || 0 }).id,
          subtitle: subtitle.trim(),
          institution_ids: selectedInstitutions.map((i) => i.id),
          active,
          priority,
        };
      } else {
        payload = {
          position: "single_college",
          course_id: (selectedCourse || { id: editingCard?.course.id || 0 }).id,
          institution_id: selectedInstitutions[0]?.id ?? editingCard?.institutions[0]?.id,
          subtitle: subtitle.trim(),
          mou_companies: mouRows
            .filter((r) => r.name.trim())
            .map((r) => ({
              name: r.name.trim(),
              company_url: r.company_url.trim() || undefined,
              logo_url: r.logo_url.trim() || undefined,
            })),
          active,
          priority,
        };
      }

      if (editingCard) {
        await courseAdAdminApi.update(editingCard.id, payload);
      } else {
        await courseAdAdminApi.create(payload);
      }
      closeModal();
      fetchCards();
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message || "Failed to save course ad card";
      alert(message);
    } finally {
      setSaving(false);
    }
  }, [
    canSave, editingCard, positionTab, selectedCourse, selectedInstitutions,
    subtitle, mouRows, active, priority, closeModal, fetchCards,
  ]);

  // ── Row actions ───────────────────────────────────────────────────────────

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Delete this course ad card?")) return;
      try {
        await courseAdAdminApi.remove(id);
        fetchCards();
      } catch {
        alert("Failed to delete card");
      }
    },
    [fetchCards]
  );

  const handleToggleActive = useCallback(async (card: CourseAdCard) => {
    try {
      await courseAdAdminApi.update(card.id, { active: !card.active });
      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, active: !c.active } : c))
      );
    } catch {
      alert("Failed to toggle active status");
    }
  }, []);

  const atCardCap = cards.length >= MAX_CARDS;

  // ── Entity summary per tab ────────────────────────────────────────────────

  const entitySummary = (card: CourseAdCard) => {
    if (card.position === "multi_college") {
      return card.institutions.map((i) => i.name).join(", ") || "\u2014";
    }
    const inst = card.institutions[0]?.name || "\u2014";
    const mouCount = card.mou_companies?.length || 0;
    return `${inst} · ${mouCount} MOU ${mouCount === 1 ? "company" : "companies"}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Course Finder Ads</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            {cards.length}/{MAX_CARDS} cards
          </span>
          <button
            onClick={openCreateForm}
            disabled={atCardCap}
            title={atCardCap ? `Limit reached — max ${MAX_CARDS} cards per position` : undefined}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={18} /> Create Card
          </button>
        </div>
      </div>

      {/* Position tabs */}
      <div className="flex items-center gap-1 px-6 pt-4">
        {POSITION_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPositionTab(tab.id)}
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
        <div className="px-6 py-8 text-center text-gray-500">Loading cards...</div>
      ) : error ? (
        <div className="px-6 py-8 text-center text-red-500">{error}</div>
      ) : cards.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500 text-sm">No cards found for this position.</p>
          <button
            onClick={openCreateForm}
            className="mt-3 text-blue-600 hover:underline text-sm font-medium"
          >
            Create your first course ad card
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <th className="px-4 py-3 w-10">#</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Subtitle</th>
                <th className="px-4 py-3">
                  {positionTab === "multi_college" ? "Institutions" : "Institution / MOU"}
                </th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((card, idx) => (
                <tr
                  key={card.id}
                  className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900 max-w-[200px] truncate block">
                      {card.course?.title || `Course #${card.course?.id}`}
                    </span>
                    <span className="text-xs text-gray-400">
                      {card.course?.level}
                      {card.course?.affiliation ? ` · ${card.course.affiliation}` : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                    {card.subtitle || "\u2014"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[260px] truncate">
                    {entitySummary(card)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(card)}
                      className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        card.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {card.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{card.priority}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEditForm(card)}
                        className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
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

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCard ? "Edit Course Ad Card" : "Create Course Ad Card"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Step 1: Course search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course <span className="text-red-500">*</span>
                </label>
                {selectedCourse ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700">
                      {selectedCourse.name}
                      <button
                        type="button"
                        onClick={() => setSelectedCourse(null)}
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
                      value={courseSearch}
                      onChange={(e) => {
                        setCourseSearch(e.target.value);
                        searchCourses(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                      placeholder="Search courses..."
                    />
                    {courseResults.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {courseResults.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectCourse(item)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step 2: Institutions */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {positionTab === "multi_college"
                    ? `Colleges (up to ${MAX_INSTITUTIONS})`
                    : "Institution"}
                </label>

                {selectedInstitutions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedInstitutions.map((inst) => (
                      <span
                        key={inst.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700"
                      >
                        {inst.name}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedInstitutions((prev) =>
                              prev.filter((e) => e.id !== inst.id)
                            )
                          }
                          className="text-blue-400 hover:text-blue-600"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {!(positionTab === "single_college" && selectedInstitutions.length >= 1) && (
                  <div className="relative">
                    <input
                      type="text"
                      value={institutionSearch}
                      onChange={(e) => {
                        setInstitutionSearch(e.target.value);
                        searchInstitutions(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                      placeholder="Search institutions..."
                    />
                    {institutionResults.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {institutionResults.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectInstitution(item)}
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
                  {positionTab === "multi_college"
                    ? `${selectedInstitutions.length}/${MAX_INSTITUTIONS} selected`
                    : selectedInstitutions.length === 1
                      ? "1/1 selected — exactly one institution"
                      : "0/1 selected — exactly one institution"}
                </p>
              </div>

              {/* Step 2b: MOU companies (single_college only) */}
              {positionTab === "single_college" && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      MOU Companies (up to {MAX_MOU})
                    </label>
                    <button
                      type="button"
                      onClick={addMouRow}
                      disabled={mouRows.length >= MAX_MOU}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus size={14} /> Add company ({mouRows.length}/{MAX_MOU})
                    </button>
                  </div>

                  {mouRows.length === 0 && (
                    <p className="text-xs text-gray-400 italic">
                      No MOU companies added yet.
                    </p>
                  )}

                  <div className="space-y-3">
                    {mouRows.map((row) => (
                      <div
                        key={row.key}
                        className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-500 uppercase">
                            Company
                          </span>
                          <button
                            type="button"
                            onClick={() => removeMouRow(row.key)}
                            className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
                            title="Remove"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => updateMouRow(row.key, "name", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none bg-white"
                          placeholder="Company name *"
                        />
                        <input
                          type="text"
                          value={row.company_url}
                          onChange={(e) =>
                            updateMouRow(row.key, "company_url", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none bg-white"
                          placeholder="Company URL (https://...)"
                        />
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm text-gray-700 cursor-pointer hover:bg-gray-50">
                            {row.uploading ? "Uploading..." : "Upload logo"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleMouLogoUpload(row.key, file);
                                e.target.value = "";
                              }}
                            />
                          </label>
                          {row.logo_url && (
                            <>
                              <img
                                src={resolveImageUrl(row.logo_url)}
                                alt="Logo preview"
                                className="w-8 h-8 object-contain rounded border bg-white"
                              />
                              <span className="text-xs text-gray-400 truncate max-w-[160px]">
                                {row.logo_url}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateMouRow(row.key, "logo_url", "")}
                                className="text-gray-400 hover:text-red-600"
                                title="Remove logo"
                              >
                                <X size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Subtitle + priority */}
              <div className="border-t border-gray-200 pt-4 grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                    placeholder="Card descriptor line (optional)"
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
                disabled={saving || (!editingCard && !canSave)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : editingCard ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
