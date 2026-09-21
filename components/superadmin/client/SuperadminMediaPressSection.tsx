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
import { AlertTriangle, Loader2, X, Plus } from "lucide-react";
import {
  superadminPressApi,
  type ContentListParams,
} from "@/services/superadminContentApi";

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none transition-colors bg-white";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
const selectClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none appearance-none bg-white transition-colors";

const EDIT_KEY = "superadmin_edit_press_item_id";

const PRESS_CATEGORIES = [
  { value: "press_release", label: "Press Release" },
  { value: "news", label: "News" },
  { value: "media_coverage", label: "Media Coverage" },
];

const categoryPill = (category: string) => {
  const found = PRESS_CATEGORIES.find((c) => c.value === category);
  const color =
    category === "press_release"
      ? "text-blue-600 bg-blue-50"
      : category === "news"
        ? "text-green-600 bg-green-50"
        : "text-purple-600 bg-purple-50";
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-bold uppercase ${color}`}
    >
      {found ? found.label : category}
    </span>
  );
};

interface PressFormState {
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  external_url: string;
  image_url: string;
  is_published: boolean;
  published_at: string;
}

const emptyForm: PressFormState = {
  title: "",
  slug: "",
  category: "press_release",
  summary: "",
  content: "",
  external_url: "",
  image_url: "",
  is_published: false,
  published_at: "",
};

type View = "list" | "form";

export default function SuperadminMediaPressSection({
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<PressFormState>({ ...emptyForm });

  const ITEMS_PER_PAGE = 10;

  const fetchList = (targetPage: number) => {
    setLoading(true);
    const params: ContentListParams = { page: targetPage, limit: ITEMS_PER_PAGE };
    superadminPressApi
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

  useEffect(() => {
    const stored = localStorage.getItem(EDIT_KEY);
    if (stored) {
      const id = Number(stored);
      if (!isNaN(id)) {
        setEditId(id);
        setView("form");
        setLoadingEdit(true);
        superadminPressApi
          .getById(id)
          .then((item) => {
            setForm({
              title: item?.title || "",
              slug: item?.slug || "",
              category: item?.category || "press_release",
              summary: item?.summary || "",
              content: item?.content || "",
              external_url: item?.external_url || "",
              image_url: item?.image_url || "",
              is_published: !!item?.is_published,
              published_at: item?.published_at
                ? String(item.published_at).split("T")[0]
                : "",
            });
          })
          .catch((e) => console.error("Failed to load press item", e))
          .finally(() => setLoadingEdit(false));
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
      (e.category || "").toLowerCase().includes(s)
    );
  });

  const openCreate = () => {
    localStorage.removeItem(EDIT_KEY);
    setEditId(null);
    setImageFile(null);
    setForm({ ...emptyForm });
    setView("form");
  };

  const handleEdit = (id: number) => {
    localStorage.setItem(EDIT_KEY, String(id));
    // Re-mount the form view with edit data by updating editId and fetching.
    setEditId(id);
    setImageFile(null);
    setLoadingEdit(true);
    setView("form");
    superadminPressApi
      .getById(id)
      .then((item) => {
        setForm({
          title: item?.title || "",
          slug: item?.slug || "",
          category: item?.category || "press_release",
          summary: item?.summary || "",
          content: item?.content || "",
          external_url: item?.external_url || "",
          image_url: item?.image_url || "",
          is_published: !!item?.is_published,
          published_at: item?.published_at
            ? String(item.published_at).split("T")[0]
            : "",
        });
      })
      .catch((e) => console.error("Failed to load press item", e))
      .finally(() => setLoadingEdit(false));
  };

  const backToList = () => {
    localStorage.removeItem(EDIT_KEY);
    setEditId(null);
    setImageFile(null);
    setForm({ ...emptyForm });
    setView("list");
    fetchList(page);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setDeleting(true);
    try {
      await superadminPressApi.delete(deleteDialog.id);
      setItems((prev) => prev.filter((e) => e.id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null, title: "" });
    } catch {
      alert("Failed to delete press item. Please try again.");
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
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        title: form.title.trim(),
        category: form.category,
        summary: form.summary,
        content: form.content,
        is_published: form.is_published,
      };
      if (form.slug.trim()) payload.slug = form.slug.trim();
      if (form.external_url.trim())
        payload.external_url = form.external_url.trim();
      if (form.image_url.trim()) payload.image_url = form.image_url.trim();
      if (form.published_at) payload.published_at = form.published_at;

      let savedId = editId;
      if (editId) {
        await superadminPressApi.update(editId, payload);
      } else {
        const created = await superadminPressApi.create(payload);
        savedId = created?.id ?? null;
      }
      if (imageFile && savedId) {
        try {
          await superadminPressApi.uploadImage(savedId, imageFile);
        } catch (e) {
          console.error("Image upload failed:", e);
        }
      }
      backToList();
    } catch (e: any) {
      console.error("Failed to save press item:", e);
      alert(
        e?.message === "auth_required"
          ? "Your session has expired. Please sign in again."
          : e?.message || "Failed to save press item.",
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
          title={editId ? "Edit Press Item" : "Create Press Item"}
          breadcrumbItems={[
            { label: "Dashboard" },
            { label: editId ? "Edit Press Item" : "Create Press Item" },
          ]}
        />
        {loadingEdit && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg mb-4 text-sm">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Loading press item data...
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-800">
              {editId ? "Edit Press Item" : "New Press Item"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Press releases, news articles, and media coverage entries
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
                placeholder="e.g. StudySphere Launches New Feature"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Slug (optional)</label>
              <input
                type="text"
                className={inputClass}
                placeholder="auto-generated from title if left empty"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                URL-friendly identifier, e.g. studysphere-launches-new-feature
              </p>
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
                {PRESS_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Summary</label>
              <textarea
                className={inputClass}
                rows={3}
                placeholder="Short summary shown in listings..."
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Content (HTML)</label>
              <textarea
                className={`${inputClass} font-mono text-xs`}
                rows={10}
                placeholder="<p>Full article content (HTML allowed)...</p>"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Admin-only rich content. Plain HTML is accepted.
              </p>
            </div>
            <div>
              <label className={labelClass}>External URL</label>
              <input
                type="url"
                className={inputClass}
                placeholder="https://example.com/news/article"
                value={form.external_url}
                onChange={(e) =>
                  setForm({ ...form, external_url: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Link to the original article, if published elsewhere
              </p>
            </div>
            <div>
              <label className={labelClass}>Image</label>
              <input
                type="file"
                accept="image/*"
                className={inputClass}
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {(imageFile || form.image_url) && (
                <p className="text-xs text-gray-500 mt-1">
                  {imageFile
                    ? `Selected: ${imageFile.name}`
                    : `Current: ${form.image_url}`}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {editId
                  ? "Select a new file to replace the current image"
                  : "Uploaded after the item is created"}
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
                id="press-published"
                className="w-4 h-4 accent-blue-600"
                checked={form.is_published}
                onChange={(e) =>
                  setForm({ ...form, is_published: e.target.checked })
                }
              />
              <label
                htmlFor="press-published"
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
                  : "Create Press Item"}
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
        title="Media & Press Directory"
        breadcrumbItems={[
          { label: "Dashboard" },
          { label: "Media & Press Directory" },
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
                placeholder="Search press items..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
            <button
              onClick={openCreate}
              className="sm:ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Press Item
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
              {search ? "No press items matched." : "No press items yet."}
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
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Published
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Date
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
                    <td className="text-center py-3 px-6 text-gray-600">
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString()
                        : "—"}
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
                Delete Press Item
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
              Are you sure you want to delete this press item?
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
