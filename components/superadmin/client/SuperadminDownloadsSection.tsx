"use client";

import React, { useState, useEffect } from "react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import {
  MagnifyingGlass,
  Pencil,
  Trash,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { AlertTriangle, Loader2, X, Plus, FileDown } from "lucide-react";
import {
  superadminDownloadsApi,
  type ContentListParams,
} from "@/services/superadminContentApi";

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none transition-colors bg-white";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
const selectClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none appearance-none bg-white transition-colors";

const EDIT_KEY = "superadmin_edit_download_id";

const DOWNLOAD_CATEGORIES = [
  { value: "syllabus", label: "Syllabus" },
  { value: "form", label: "Forms" },
  { value: "notice", label: "Notices" },
  { value: "result", label: "Results" },
  { value: "other", label: "Other" },
];

const categoryPill = (category: string) => {
  const found = DOWNLOAD_CATEGORIES.find((c) => c.value === category);
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-bold uppercase ${
        found ? "text-blue-600 bg-blue-50" : "text-gray-600 bg-gray-100"
      }`}
    >
      {found ? found.label : category || "—"}
    </span>
  );
};

const formatBytes = (bytes?: number) => {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

interface DownloadFormState {
  title: string;
  description: string;
  category: string;
  is_published: boolean;
  published_at: string;
}

const emptyForm: DownloadFormState = {
  title: "",
  description: "",
  category: "syllabus",
  is_published: false,
  published_at: "",
};

type View = "list" | "form";

export default function SuperadminDownloadsSection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const [view, setView] = useState<View>("list");
  const [editId, setEditId] = useState<number | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  // list state
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: number | null;
    title: string;
  }>({ open: false, id: null, title: "" });
  const [deleting, setDeleting] = useState(false);

  // form state
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState<DownloadFormState>({ ...emptyForm });

  const ITEMS_PER_PAGE = 10;

  const fetchList = (targetPage: number) => {
    setLoading(true);
    const params: ContentListParams = { page: targetPage, limit: ITEMS_PER_PAGE };
    superadminDownloadsApi
      .list(params)
      .then((res) => {
        setItems(res.items || []);
        setTotalPages(res.pagination?.total_pages || res.pagination?.pages || 1);
        setTotal(res.pagination?.total ?? res.pagination?.total_items ?? res.items?.length ?? 0);
      })
      .catch(() => {
        setItems([]);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  };

  const loadEditItem = (id: number) => {
    setEditId(id);
    setFile(null);
    setLoadingEdit(true);
    setView("form");
    superadminDownloadsApi
      .getById(id)
      .then((item) => {
        setForm({
          title: item?.title || "",
          description: item?.description || "",
          category: item?.category || "other",
          is_published: !!item?.is_published,
          published_at: item?.published_at
            ? String(item.published_at).split("T")[0]
            : "",
        });
      })
      .catch((e) => console.error("Failed to load download item", e))
      .finally(() => setLoadingEdit(false));
  };

  useEffect(() => {
    const stored = localStorage.getItem(EDIT_KEY);
    if (stored) {
      const id = Number(stored);
      if (!isNaN(id)) {
        loadEditItem(id);
        return;
      }
    }
    fetchList(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (view === "list") fetchList(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, view]);

  const filtered = items.filter((e) => {
    const s = search.toLowerCase();
    return (
      !s ||
      (e.title || "").toLowerCase().includes(s) ||
      (e.category || "").toLowerCase().includes(s) ||
      (e.file_name || "").toLowerCase().includes(s)
    );
  });

  const openCreate = () => {
    localStorage.removeItem(EDIT_KEY);
    setEditId(null);
    setFile(null);
    setForm({ ...emptyForm });
    setView("form");
  };

  const handleEdit = (id: number) => {
    localStorage.setItem(EDIT_KEY, String(id));
    loadEditItem(id);
  };

  const backToList = () => {
    localStorage.removeItem(EDIT_KEY);
    setEditId(null);
    setFile(null);
    setForm({ ...emptyForm });
    setView("list");
    fetchList(page);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setDeleting(true);
    try {
      await superadminDownloadsApi.delete(deleteDialog.id);
      setItems((prev) => prev.filter((e) => e.id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null, title: "" });
    } catch {
      alert("Failed to delete download. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title is required.");
      return;
    }
    if (!editId && !file) {
      alert("Please select the document file to upload.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("is_published", form.is_published ? "true" : "false");
      if (form.published_at)
        fd.append("published_at", form.published_at);
      if (file) fd.append("file", file);

      if (editId) {
        await superadminDownloadsApi.update(editId, fd);
      } else {
        await superadminDownloadsApi.create(fd);
      }
      backToList();
    } catch (e: any) {
      console.error("Failed to save download:", e);
      alert(
        e?.message === "auth_required"
          ? "Your session has expired. Please sign in again."
          : e?.message || "Failed to save download.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------- FORM VIEW -----------------------------
  if (view === "form") {
    return (
      <div className="p-4 md:p-6 lg:p-8 min-h-full">
        <SectionHeader
          title={editId ? "Edit Download" : "Upload Download"}
          breadcrumbItems={[
            { label: "Dashboard" },
            { label: editId ? "Edit Download" : "Upload Download" },
          ]}
        />
        {loadingEdit && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg mb-4 text-sm">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Loading download data...
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-800">
              {editId ? "Edit Download" : "New Download"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Documents available for students to download
            </p>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className={labelClass}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. IOE Entrance Syllabus 2081"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                className={inputClass}
                rows={3}
                placeholder="What is this document for?"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelClass}>
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className={selectClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {DOWNLOAD_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>
                File {!editId && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                className={inputClass}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-gray-500 mt-1">
                {editId
                  ? "Leave empty to keep the current file; select a new file to replace it"
                  : "The document to upload (PDF, DOCX, etc.)"}
              </p>
            </div>
            <div>
              <label className={labelClass}>Published Date</label>
              <input
                type="date"
                className={inputClass}
                value={form.published_at}
                onChange={(e) =>
                  setForm({ ...form, published_at: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="download-published"
                className="w-4 h-4 accent-blue-600"
                checked={form.is_published}
                onChange={(e) =>
                  setForm({ ...form, is_published: e.target.checked })
                }
              />
              <label
                htmlFor="download-published"
                className="text-sm font-medium text-gray-700"
              >
                Published
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={backToList}
              className="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving
                ? "Saving..."
                : editId
                  ? "Save Changes"
                  : "Upload Download"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ----------------------------- LIST VIEW -----------------------------
  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <SectionHeader
        title="Downloads Directory"
        breadcrumbItems={[
          { label: "Dashboard" },
          { label: "Downloads Directory" },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-full sm:w-80">
              <MagnifyingGlass
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search downloads..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
            <button
              onClick={openCreate}
              className="sm:ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Upload Download
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">
              {search ? "No downloads matched." : "No downloads yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    File
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Size
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Downloads
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Published
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium text-gray-900">
                      {item.title}
                    </td>
                    <td className="text-center py-3 px-6">
                      {categoryPill(item.category)}
                    </td>
                    <td className="py-3 px-6 text-gray-600 max-w-[220px] truncate">
                      <span className="inline-flex items-center gap-1.5">
                        <FileDown className="w-4 h-4 text-gray-400 shrink-0" />
                        {item.file_name || item.file_url || "—"}
                      </span>
                    </td>
                    <td className="text-center py-3 px-6 text-gray-600">
                      {formatBytes(item.file_size)}
                    </td>
                    <td className="text-center py-3 px-6 text-gray-600">
                      {item.download_count ?? 0}
                    </td>
                    <td className="text-center py-3 px-6">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          item.is_published
                            ? "text-green-600 bg-green-50"
                            : "text-gray-500 bg-gray-100"
                        }`}
                      >
                        {item.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="text-center py-3 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              id: item.id,
                              title: item.title,
                            })
                          }
                          className="p-1.5 hover:bg-red-50 rounded text-red-600"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && !search && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
              {total ? ` · ${total} items` : ""}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50"
              >
                <CaretLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const pageNum = start + i;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                      page === pageNum
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50"
              >
                <CaretRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Delete Download
              </h3>
              <button
                onClick={() =>
                  setDeleteDialog({ open: false, id: null, title: "" })
                }
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to delete this download?
            </p>
            <p className="text-sm font-medium text-gray-900 mb-6">
              &ldquo;{deleteDialog.title}&rdquo;
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteDialog({ open: false, id: null, title: "" })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
