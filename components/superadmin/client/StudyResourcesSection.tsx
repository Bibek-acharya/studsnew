"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download as DownloadIcon,
  Edit,
  FileText,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import {
  studyResourcesApi,
  StudyResource,
} from "@/services/studyResourcesApi";
import CourseCombobox from "@/components/studyResources/CourseCombobox";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const TYPE_OPTIONS = [
  "past-questions",
  "study-notes",
  "model-questions",
  "syllabus",
];

const ACCEPTED =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.zip,.rar,.7z,image/*";
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  "past-questions": "Past Questions",
  "study-notes": "Study Notes",
  "model-questions": "Model Questions",
  syllabus: "Syllabus",
};

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm";

const TYPE_STYLES: Record<string, string> = {
  "past-questions": "bg-blue-100 text-blue-700",
  "study-notes": "bg-green-100 text-green-700",
  "model-questions": "bg-purple-100 text-purple-700",
  syllabus: "bg-orange-100 text-orange-700",
};

function formatBytes(bytes: number | string): string {
  const size = Number(bytes) || 0;
  if (size <= 0) return "—";
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(size / 1024)} KB`;
}

/** apiRequest attaches `status`; map 401/403 to the shared "auth_required" error. */
function authErrorOf(error: unknown): boolean {
  const err = error as { status?: number; message?: string };
  return (
    err?.status === 401 ||
    err?.status === 403 ||
    err?.message === "auth_required"
  );
}

interface EditForm {
  title: string;
  resource_type: string;
  course: string;
  year: string;
  description: string;
}

export default function StudyResourcesSection() {
  const [resources, setResources] = useState<StudyResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [
    actionMsg,
    setActionMsg,
  ] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Add form
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [resourceType, setResourceType] = useState("past-questions");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit modal
  const [editTarget, setEditTarget] = useState<StudyResource | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: number | null;
    title: string;
  }>({ open: false, id: null, title: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const showActionMsg = (type: "success" | "error", text: string) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 4000);
  };

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setAuthError(false);
    try {
      const items = await studyResourcesApi.adminListStudyResources();
      setResources(Array.isArray(items) ? items : []);
    } catch (error) {
      if (authErrorOf(error)) setAuthError(true);
      else showActionMsg("error", "Failed to load study resources");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadResources = async () => {
      await fetchResources();
    };
    loadResources();
  }, [fetchResources]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected && selected.size > MAX_SIZE) {
      setFormError("File exceeds the 20 MB limit.");
      e.target.value = "";
      return;
    }
    setFormError(null);
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setFormError("Please select a file to upload.");
      return;
    }
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("type", resourceType);
      if (course.trim()) formData.append("course", course.trim());
      if (year.trim()) formData.append("year", year.trim());
      if (description.trim())
        formData.append("description", description.trim());
      await studyResourcesApi.createStudyResource(formData);
      showActionMsg("success", "Resource uploaded successfully");
      setFile(null);
      setTitle("");
      setResourceType("past-questions");
      setCourse("");
      setYear("");
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowForm(false);
      fetchResources();
    } catch (error) {
      if (authErrorOf(error)) {
        showActionMsg("error", "Session expired. Please log in again.");
      } else {
        showActionMsg(
          "error",
          error instanceof Error ? error.message : "Failed to upload resource",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (resource: StudyResource) => {
    setEditTarget(resource);
    setEditFile(null);
    setEditForm({
      title: resource.title,
      resource_type: resource.resource_type,
      course: resource.course || "",
      year: resource.year || "",
      description: resource.description || "",
    });
  };

  const handleEditField = (field: keyof EditForm, value: string) => {
    setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected && selected.size > MAX_SIZE) {
      showActionMsg("error", "File exceeds the 20 MB limit.");
      e.target.value = "";
      return;
    }
    setEditFile(selected);
  };

  const handleEditSave = async () => {
    if (!editTarget || !editForm) return;
    setSavingEdit(true);
    try {
      // Only send fields that actually changed.
      const payload: Partial<EditForm> = {};
      (Object.keys(editForm) as Array<keyof EditForm>).forEach((key) => {
        if (editForm[key] !== (editTarget as unknown as EditForm)[key]) {
          payload[key] = editForm[key];
        }
      });
      if (Object.keys(payload).length > 0) {
        await studyResourcesApi.updateStudyResource(editTarget.id, payload);
      }
      // If a new file was picked, replace it after the metadata PUT succeeds.
      if (editFile) {
        const fileData = new FormData();
        fileData.append("file", editFile);
        try {
          await studyResourcesApi.replaceStudyResourceFile(
            editTarget.id,
            fileData,
          );
        } catch (fileError) {
          showActionMsg(
            "error",
            `Metadata saved, but replacing the file failed: ${
              fileError instanceof Error
                ? fileError.message
                : "unknown error"
            }`,
          );
          setEditFile(null);
          fetchResources();
          return;
        }
      }
      showActionMsg("success", "Resource updated successfully");
      setEditTarget(null);
      setEditForm(null);
      setEditFile(null);
      fetchResources();
    } catch (error) {
      showActionMsg(
        "error",
        authErrorOf(error)
          ? "Session expired. Please log in again."
          : error instanceof Error
            ? error.message
            : "Failed to update resource",
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await studyResourcesApi.deleteStudyResource(id);
      showActionMsg("success", "Resource deleted successfully");
      fetchResources();
    } catch (error) {
      showActionMsg(
        "error",
        authErrorOf(error)
          ? "Session expired. Please log in again."
          : error instanceof Error
            ? error.message
            : "Failed to delete resource",
      );
    }
    setDeleteDialog({ open: false, id: null, title: "" });
  };

  const totalPages = Math.ceil(resources.length / perPage);
  const paginated = resources.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-[90rem] space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Study Resources</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage study materials — past questions, notes, model questions &amp;
              syllabus.
            </p>
          </div>
          <button
            onClick={() => setShowForm((open) => !open)}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={16} /> Add Resource
          </button>
        </div>

        {actionMsg && (
          <div
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
              actionMsg.type === "success"
                ? "border border-green-200 bg-green-50 text-green-800"
                : "border border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <i
              className={`fa-solid ${
                actionMsg.type === "success"
                  ? "fa-check-circle text-green-600"
                  : "fa-exclamation-circle text-red-600"
              }`}
            ></i>{" "}
            {actionMsg.text}
          </div>
        )}

        {/* Add resource form */}
        {showForm && (
          <div className="rounded-md border border-gray-200 bg-white p-4">
            <h3 className="mb-4 text-sm font-semibold text-gray-800">
              New Study Resource
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  File (pdf, doc, ppt, xls, txt, csv, zip, images — max 20 MB)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED}
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
                />
                {file && (
                  <p className="mt-1 text-xs text-gray-500">
                    {file.name} · {formatBytes(file.size)}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. BCA 1st Semester — Mathematics"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Type *
                  </label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className={inputClass}
                  >
                    {TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {RESOURCE_TYPE_LABELS[type] || type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Course
                  </label>
                  <CourseCombobox
                    value={course}
                    onChange={setCourse}
                    inputClassName={inputClass}
                    placeholder="Select or type course (e.g. BCA)"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Year
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 2081"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={inputClass}
                  placeholder="Short description of the material"
                />
              </div>
              {formError && (
                <p className="text-xs font-medium text-red-600">{formError}</p>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {submitting ? "Uploading..." : "Upload Resource"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-md border border-gray-200 bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-blue-500" />
            </div>
          ) : authError ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-500">
              <i className="fa-solid fa-lock text-4xl"></i>
              <p className="text-sm">
                Authentication required. Please log in again.
              </p>
            </div>
          ) : resources.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
              <BookOpen size={48} className="stroke-1" />
              <p className="text-sm font-medium">No study resources found</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <Plus size={14} className="mr-1 inline" /> Upload your first
                resource
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">
                        Resource
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">
                        Course
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">
                        Year
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">
                        Size
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">
                        Downloads
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">
                        Created
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((resource) => (
                      <tr
                        key={resource.id}
                        className="transition-colors hover:bg-gray-50/50"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <FileText size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-gray-800">
                                {resource.title}
                              </p>
                              {resource.file_name && (
                                <p className="truncate text-xs text-gray-400">
                                  {resource.file_name}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              TYPE_STYLES[resource.resource_type] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {RESOURCE_TYPE_LABELS[resource.resource_type] ||
                              resource.resource_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {resource.course || (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">
                          {resource.year || "—"}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">
                          {formatBytes(resource.file_size)}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-gray-800">
                          {resource.downloads ?? 0}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {resource.created_at
                            ? new Date(resource.created_at).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <a
                              href={`${API_BASE_URL}/api/v1/study-resources/${resource.id}/download`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                              title="Download"
                            >
                              <DownloadIcon size={15} />
                            </a>
                            <button
                              onClick={() => openEdit(resource)}
                              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  id: resource.id,
                                  title: resource.title,
                                })
                              }
                              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  {paginated.length > 0
                    ? `${(currentPage - 1) * perPage + 1}–${Math.min(
                        currentPage * perPage,
                        resources.length,
                      )}`
                    : "0"}{" "}
                  of {resources.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-2 text-sm text-gray-600">
                    {currentPage} / {totalPages || 1}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage >= totalPages}
                    className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {editTarget && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Edit Resource
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => handleEditField("title", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Type
                  </label>
                  <select
                    value={editForm.resource_type}
                    onChange={(e) =>
                      handleEditField("resource_type", e.target.value)
                    }
                    className={inputClass}
                  >
                    <option value={editForm.resource_type}>
                      {RESOURCE_TYPE_LABELS[editForm.resource_type] ||
                        editForm.resource_type}
                    </option>
                    {TYPE_OPTIONS.filter(
                      (t) => t !== editForm.resource_type,
                    ).map((type) => (
                      <option key={type} value={type}>
                        {RESOURCE_TYPE_LABELS[type] || type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Course
                  </label>
                  <CourseCombobox
                    value={editForm.course}
                    onChange={(v) => handleEditField("course", v)}
                    inputClassName={inputClass}
                    placeholder="Select or type course"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Replace file (optional)
                  </label>
                  <input
                    type="file"
                    accept={ACCEPTED}
                    onChange={handleEditFileChange}
                    className="w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
                  />
                  <p className="mt-1 truncate text-xs text-gray-500">
                    Current: {editTarget.file_name || "—"}
                    {editFile && (
                      <span className="text-blue-600">
                        {" "}
                        → New: {editFile.name}
                      </span>
                    )}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Year
                  </label>
                  <input
                    type="text"
                    value={editForm.year}
                    onChange={(e) => handleEditField("year", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      handleEditField("description", e.target.value)
                    }
                    rows={3}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditTarget(null);
                  setEditForm(null);
                  setEditFile(null);
                }}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={savingEdit}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {savingEdit && <Loader2 size={14} className="animate-spin" />}
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Delete Resource
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete <strong>{deleteDialog.title}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteDialog({ open: false, id: null, title: "" })
                }
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
