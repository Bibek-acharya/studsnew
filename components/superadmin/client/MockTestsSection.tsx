"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  ClipboardList,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  mockTestsApi,
  type AdminMockTest,
} from "@/services/mockTestsApi";
import CourseCombobox from "@/components/studyResources/CourseCombobox";
import RichTextEditor from "@/components/shared/RichTextEditor";
import MockTestQuestionEditor from "./mockTests/MockTestQuestionEditor";
import {
  createDraftTest,
  draftFromAdminTest,
  setPublished,
  toPayload,
  validateDraftTest,
  type DraftTest,
} from "./mockTests/questionEditorState";

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm";

/** apiRequest attaches `status`; map 401/403 to the shared auth failure. */
function authErrorOf(error: unknown): boolean {
  const err = error as { status?: number; message?: string };
  return (
    err?.status === 401 ||
    err?.status === 403 ||
    err?.message === "auth_required"
  );
}

export default function MockTestsSection() {
  const [tests, setTests] = useState<AdminMockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [actionMsg, setActionMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [draft, setDraft] = useState<DraftTest | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminMockTest | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showActionMsg = (type: "success" | "error", text: string) => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg(null), 4000);
  };

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setAuthError(false);
    try {
      setTests(await mockTestsApi.adminListMockTests());
    } catch (error) {
      if (authErrorOf(error)) setAuthError(true);
      else showActionMsg("error", "Failed to load mock tests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // `loading` already starts true, so this first read only fills state in.
    let active = true;
    mockTestsApi
      .adminListMockTests()
      .then((items) => {
        if (active) setTests(items);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (authErrorOf(error)) setAuthError(true);
        else showActionMsg("error", "Failed to load mock tests");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const openCreate = () => {
    setDraft(createDraftTest());
    setShowValidation(false);
  };

  const openEdit = async (test: AdminMockTest) => {
    try {
      // The list omits questions, so pull the full document before editing.
      const full = await mockTestsApi.adminGetMockTest(test.id);
      setDraft(draftFromAdminTest(full));
      setShowValidation(false);
    } catch (error) {
      showActionMsg(
        "error",
        authErrorOf(error)
          ? "Session expired. Please log in again."
          : error instanceof Error
            ? error.message
            : "Failed to open test",
      );
    }
  };

  const validation = draft ? validateDraftTest(draft) : null;

  const handleSave = async () => {
    if (!draft) return;
    const result = validateDraftTest(draft);
    if (!result.valid) {
      setShowValidation(true);
      return;
    }
    setSaving(true);
    try {
      const payload = toPayload(draft);
      if (draft.id) {
        await mockTestsApi.updateMockTest(draft.id, payload);
        showActionMsg("success", "Mock test updated");
      } else {
        await mockTestsApi.createMockTest(payload);
        showActionMsg("success", "Mock test created");
      }
      setDraft(null);
      fetchTests();
    } catch (error) {
      showActionMsg(
        "error",
        authErrorOf(error)
          ? "Session expired. Please log in again."
          : error instanceof Error
            ? error.message
            : "Failed to save test",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await mockTestsApi.deleteMockTest(deleteTarget.id);
      showActionMsg("success", "Mock test deleted");
      setDeleteTarget(null);
      fetchTests();
    } catch (error) {
      showActionMsg(
        "error",
        authErrorOf(error)
          ? "Session expired. Please log in again."
          : error instanceof Error
            ? error.message
            : "Failed to delete test",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 font-sans md:p-8">
      <div className="mx-auto max-w-[90rem] space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Mock Tests</h2>
            <p className="mt-1 text-sm text-gray-500">
              Build practice papers — each test owns its questions, and each
              question has exactly one correct option.
            </p>
          </div>
          {!draft && (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 self-start rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:self-auto"
            >
              <Plus size={16} /> Add Mock Test
            </button>
          )}
        </div>

        {actionMsg && (
          <div
            role="status"
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

        {/* Editor */}
        {draft && (
          <div className="rounded-md border border-gray-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-gray-800">
                {draft.id ? "Edit Mock Test" : "New Mock Test"}
              </h3>
              <button
                type="button"
                onClick={() => setDraft(null)}
                aria-label="Close editor"
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className="mb-1 block text-xs font-medium text-gray-600"
                    htmlFor="mock-test-title"
                  >
                    Title *
                  </label>
                  <input
                    id="mock-test-title"
                    type="text"
                    value={draft.title}
                    onChange={(e) =>
                      setDraft({ ...draft, title: e.target.value })
                    }
                    placeholder="e.g. BSc CS — Data Structures Midterm"
                    className={inputClass}
                    aria-invalid={Boolean(showValidation && validation?.title)}
                  />
                  {showValidation && validation?.title && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {validation.title}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="mb-1 block text-xs font-medium text-gray-600"
                    htmlFor="mock-test-course"
                  >
                    Course
                  </label>
                  <CourseCombobox
                    value={draft.course}
                    onChange={(value) => setDraft({ ...draft, course: value })}
                    inputClassName={inputClass}
                    placeholder="Select or type course (e.g. BSc CS)"
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block text-xs font-medium text-gray-600"
                    htmlFor="mock-test-year"
                  >
                    Year
                  </label>
                  <input
                    id="mock-test-year"
                    type="text"
                    value={draft.year}
                    onChange={(e) => setDraft({ ...draft, year: e.target.value })}
                    placeholder="e.g. 2082"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block text-xs font-medium text-gray-600"
                    htmlFor="mock-test-duration"
                  >
                    Suggested minutes
                  </label>
                  <input
                    id="mock-test-duration"
                    type="number"
                    min={0}
                    max={600}
                    value={draft.duration_minutes ?? ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        duration_minutes: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    placeholder="e.g. 30"
                    className={inputClass}
                    aria-invalid={Boolean(
                      showValidation && validation?.duration,
                    )}
                  />
                  {showValidation && validation?.duration && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      {validation.duration}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Instructions
                </label>
                <RichTextEditor
                  value={draft.description}
                  onChange={(value) =>
                    setDraft({ ...draft, description: value })
                  }
                  placeholder="What should students know before starting?"
                  minHeight={90}
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <input
                  type="checkbox"
                  checked={draft.is_published}
                  onChange={(e) =>
                    setDraft(setPublished(draft, e.target.checked))
                  }
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                />
                Published (visible in the public mock test list)
              </label>

              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-800">
                  Questions ({draft.questions.length})
                </h4>
                <MockTestQuestionEditor
                  draft={draft}
                  onChange={setDraft}
                  errors={showValidation ? (validation?.questions ?? []) : []}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDraft(null)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? "Saving..." : "Save Test"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
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
          ) : tests.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
              <ClipboardList size={48} className="stroke-1" />
              <p className="text-sm font-medium">No mock tests yet</p>
              <button
                type="button"
                onClick={openCreate}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <Plus size={14} className="mr-1 inline" /> Create your first
                test
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Test
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Course
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">
                      Year
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">
                      Questions
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">
                      Minutes
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tests.map((test) => (
                    <tr
                      key={test.id}
                      className="transition-colors hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                            <ClipboardList size={16} />
                          </div>
                          <p className="max-w-[22rem] truncate font-semibold text-gray-800">
                            {test.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {test.course || (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {test.year || "—"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {test.question_count ?? test.questions?.length ?? 0}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {test.duration_minutes ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            test.is_published === false
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {test.is_published === false ? "Draft" : "Published"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(test)}
                            title="Edit"
                            aria-label={`Edit ${test.title}`}
                            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(test)}
                            title="Delete"
                            aria-label={`Delete ${test.title}`}
                            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
          )}
        </div>
      </div>

      {/* Delete dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-mock-test-title"
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <h3
              id="delete-mock-test-title"
              className="mb-2 text-lg font-semibold text-gray-800"
            >
              Delete Mock Test
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              Delete <strong>{deleteTarget.title}</strong> and all of its
              questions? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
