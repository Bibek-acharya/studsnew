"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Home, Search, Plus, Pencil, Trash2, X, Loader2, ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { scholarshipProviderApi, writtenExamApi, WrittenExamData, WrittenExamResultData, ProviderApplication } from "@/services/scholarshipProviderApi";

const PAGE_SIZE = 20;

const APP_ID_YEAR = new Date().getFullYear();
const formatAppId = (id: number) => `APP-${APP_ID_YEAR}-${String(id).padStart(3, "0")}`;
// Strip "APP-YYYY-" prefix to get raw numeric ID for matching
const parseAppId = (val: string) => {
  const m = val.match(/^#?APP-\d{4}-(\d+)$/i);
  return m ? parseInt(m[1], 10) : null;
};

const STREAM_COLORS: Record<string, string> = {
  Science: "bg-cyan-100 text-cyan-700",
  Management: "bg-indigo-100 text-indigo-700",
  Humanities: "bg-yellow-100 text-yellow-700",
  Education: "bg-green-100 text-green-700",
  Law: "bg-red-100 text-red-700",
};

const LS_KEY = "written_exam_scholarship_id";

const WrittenExam: React.FC<{ onNavigate?: (section: string) => void }> = memo(({ onNavigate }) => {
  const [scholarships, setScholarships] = useState<{ id: number; title: string; status: string }[]>([]);
  const [scholarshipId, setScholarshipId] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem(LS_KEY) || "";
    return "";
  });
  const [exam, setExam] = useState<WrittenExamData | null>(null);
  const [appsMap, setAppsMap] = useState<Record<number, ProviderApplication>>({});
  const [loading, setLoading] = useState(false);

  // Search & pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Add student modal — 2-step flow
  const [addOpen, setAddOpen] = useState(false);
  const [addStep, setAddStep] = useState<1 | 2>(1);
  const [lookupValue, setLookupValue] = useState("");
  const [lookupError, setLookupError] = useState(false);
  const [lookedUpStudent, setLookedUpStudent] = useState<{
    application_id: number;
    full_name: string;
    roll_no?: string;
    stream?: string;
    exam_center?: string;
  } | null>(null);
  const [addMarks, setAddMarks] = useState("");
  const [addingStudent, setAddingStudent] = useState(false);

  // Edit marks modal
  const [editOpen, setEditOpen] = useState(false);
  const [editResult, setEditResult] = useState<WrittenExamResultData | null>(null);
  const [editMarks, setEditMarks] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const resp = await scholarshipProviderApi.getScholarships(1, 100);
        setScholarships(
          resp.scholarships
            .filter((s) => s.status !== "draft")
            .map((s) => ({ id: s.id, title: s.title, status: s.status }))
        );
      } catch {
        toast.error("Failed to load scholarships");
      }
    })();
  }, []);

  const getOrCreateExam = useCallback(async (sid: number) => {
    setLoading(true);
    try {
      const [exams, appsResp] = await Promise.all([
        writtenExamApi.getList({ scholarship_id: sid }),
        scholarshipProviderApi.getApplications({ scholarship_id: String(sid), page: 1, limit: 1000 }),
      ]);

      // Build apps lookup map
      const map: Record<number, ProviderApplication> = {};
      for (const a of appsResp.applications) {
        map[a.id] = a;
      }
      setAppsMap(map);

      if (exams.exams && exams.exams.length > 0) {
        setExam(await writtenExamApi.getById(exams.exams[0].id));
      } else {
        const created = await writtenExamApi.create({
          scholarship_id: sid,
          title: "Written Exam",
          status: "draft",
        });
        setExam(created);
      }
    } catch {
      toast.error("Failed to load written exam");
      setExam(null);
      setAppsMap({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (scholarshipId) {
      setPage(1);
      setSearch("");
      getOrCreateExam(Number(scholarshipId));
    } else {
      setExam(null);
    }
  }, [scholarshipId, getOrCreateExam]);

  const refreshExam = useCallback(async () => {
    if (!exam?.id) return;
    try {
      const [updated, appsResp] = await Promise.all([
        writtenExamApi.getById(exam.id),
        scholarshipProviderApi.getApplications({ scholarship_id: String(scholarshipId), page: 1, limit: 1000 }),
      ]);
      setExam(updated);
      const map: Record<number, ProviderApplication> = {};
      for (const a of appsResp.applications) {
        map[a.id] = a;
      }
      setAppsMap(map);
    } catch {
      toast.error("Failed to refresh exam");
    }
  }, [exam?.id, scholarshipId]);

  // --- Filtered & paginated results ---
  const allResults = exam?.results || [];

  const filteredResults = useMemo(() => {
    if (!search) return allResults;
    const q = search.toLowerCase();
    return allResults.filter(
      (r) =>
        (r.student_name || "").toLowerCase().includes(q) ||
        String(r.application_id).includes(q) ||
        (r.roll_no || "").toLowerCase().includes(q)
    );
  }, [allResults, search]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedResults = filteredResults.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // --- Add Student Modal ---
  const openAddModal = () => {
    setAddStep(1);
    setLookupValue("");
    setLookupError(false);
    setLookedUpStudent(null);
    setAddMarks("");
    setAddOpen(true);
  };

  const closeAddModal = () => {
    setAddOpen(false);
    setLookedUpStudent(null);
    setLookupError(false);
  };

  const handleLookup = async () => {
    const val = lookupValue.trim();
    if (!val) return;
    setLookupError(false);
    setLookedUpStudent(null);

    try {
      // Search all applications for this scholarship
      const resp = await scholarshipProviderApi.getApplications({
        scholarship_id: scholarshipId,
        search: val,
        page: 1,
        limit: 50,
      });

      const match = resp.applications.find((a) =>
        (a.roll_number && a.roll_number.toLowerCase().includes(val.toLowerCase())) ||
        a.full_name?.toLowerCase().includes(val.toLowerCase())
      );

      if (!match) {
        setLookupError(true);
        return;
      }

      // Check not already in exam
      if (exam?.results?.some((r) => r.application_id === match.id)) {
        toast.error("Student already added to this exam");
        setLookupError(true);
        return;
      }

      setLookedUpStudent({
        application_id: match.id,
        full_name: match.full_name || `${match.first_name} ${match.last_name}`,
        roll_no: match.roll_number,
        stream: match.stream,
        exam_center: match.exam_center,
      });
      setAddMarks("");
      setAddStep(2);
    } catch {
      toast.error("Failed to look up student");
    }
  };

  const handleAddStudent = async () => {
    if (!exam?.id || !lookedUpStudent || !addMarks.trim()) return;
    setAddingStudent(true);
    try {
      const updated = await writtenExamApi.addResult(exam.id, {
        application_id: lookedUpStudent.application_id,
        marks_obtained: Number(addMarks),
      });
      setExam(updated);
      // Merge looked-up student into apps map so name shows immediately
      if (lookedUpStudent && !appsMap[lookedUpStudent.application_id]) {
        setAppsMap((prev) => ({
          ...prev,
          [lookedUpStudent.application_id]: {
            id: lookedUpStudent.application_id,
            first_name: lookedUpStudent.full_name.split(" ")[0] || "",
            last_name: lookedUpStudent.full_name.split(" ").slice(1).join(" ") || "",
            stream: lookedUpStudent.stream,
            exam_center: lookedUpStudent.exam_center,
          } as ProviderApplication,
        }));
      }
      toast.success("Student added");
      closeAddModal();
    } catch {
      toast.error("Failed to add student");
    } finally {
      setAddingStudent(false);
    }
  };

  // --- Edit Marks Modal ---
  const openEditMarks = (result: WrittenExamResultData) => {
    setEditResult(result);
    setEditMarks(String(result.marks_obtained ?? ""));
    setEditOpen(true);
  };

  const getStudentName = (r: WrittenExamResultData) => {
    if (r.student_name) return r.student_name;
    const app = appsMap[r.application_id];
    return app ? `${app.first_name} ${app.last_name}` : "—";
  };

  const handleEditMarks = async () => {
    if (!exam?.id || !editResult) return;
    setSavingEdit(true);
    try {
      const updated = await writtenExamApi.updateResult(exam.id, editResult.id, {
        marks_obtained: Number(editMarks),
      });
      setExam(updated);
      toast.success("Marks updated");
      setEditOpen(false);
    } catch {
      toast.error("Failed to update marks");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteResult = async () => {
    const resultId = deleteId;
    if (!exam?.id || resultId == null) return;
    setDeleteId(null);
    try {
      await writtenExamApi.deleteResult(exam.id, resultId);
      refreshExam();
      toast.success("Student removed");
    } catch {
      toast.error("Failed to remove student");
    }
  };

  const autoStatus = (marks: number) => {
    if (!marks && marks !== 0) return "";
    return marks >= 40 ? "Pass" : "Fail";
  };

  const autoStatusClass = (marks: number) => {
    const s = autoStatus(marks);
    if (s === "Pass") return "bg-green-100 text-green-700";
    if (s === "Fail") return "bg-red-100 text-red-700";
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Written Exam</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Evaluation & Results / Written Exam</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-100">
        {/* Top bar: scholarship select + search + add button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-72">
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                value={scholarshipId}
                onChange={(e) => { const v = e.target.value; setScholarshipId(v); if (typeof window !== "undefined") localStorage.setItem(LS_KEY, v); }}
              >
                <option value="">Select scholarship</option>
                {scholarships.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>
          {exam && (
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Search by name or symbol..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Student
              </button>
              <button
                onClick={() => setPublishConfirmOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center gap-1"
              >
                <Megaphone className="w-4 h-4" /> Publish Result
              </button>
            </div>
          )}
        </div>

        {!scholarshipId ? (
          <div className="py-12 text-center text-gray-400 text-sm">Select a scholarship to manage written exam</div>
        ) : loading ? (
          <div className="py-12 flex items-center justify-center text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...</div>
        ) : allResults.length > 0 ? (
          <>
            <div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
              <table className="w-full text-sm" style={{ minWidth: 1000 }}>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student Name</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Application ID</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Symbol No.</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Stream</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Exam Center</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Marks</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedResults.map((r) => {
                    const app = appsMap[r.application_id];
                    const studentName = r.student_name || (app ? `${app.first_name} ${app.last_name}` : "—");
                    const rollNo = r.roll_no || app?.roll_number || "—";
                    const stream = r.stream || app?.stream;
                    const examCenter = r.exam_center || app?.exam_center;
                    const streamColor = STREAM_COLORS[stream || ""] || "bg-gray-100 text-gray-700";
                    const statusClass = r.marks_obtained != null
                      ? (r.marks_obtained >= 40 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")
                      : "";
                    const statusText = r.marks_obtained != null
                      ? (r.marks_obtained >= 40 ? "Pass" : "Fail")
                      : "";
                    return (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{studentName}</td>
                        <td className="text-center py-3 px-4 font-mono text-gray-600">{formatAppId(r.application_id)}</td>
                        <td className="text-center py-3 px-4 font-mono text-gray-600">{rollNo}</td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${streamColor}`}>{stream || "N/A"}</span>
                        </td>
                        <td className="text-center py-3 px-4 text-gray-600">{examCenter || "—"}</td>
                        <td className="text-center py-3 px-4 font-bold text-gray-900">{r.marks_obtained ?? "—"}</td>
                        <td className="text-center py-3 px-4">
                          {statusText ? (
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusClass}`}>{statusText}</span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => openEditMarks(r)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="Edit marks"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteId(r.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Remove"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{(safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, filteredResults.length)}</span> of{" "}
                <span className="font-medium">{filteredResults.length}</span> students
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={safePage <= 1}
                  onClick={() => setPage(safePage - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                      p === safePage ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={safePage >= totalPages}
                  onClick={() => setPage(safePage + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-gray-400 text-sm">No students added yet. Click &quot;Add Student&quot; to begin.</div>
        )}
      </div>

      {/* Add Student Modal — Step 1: Lookup */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Add Student Result
              </h2>
              <button onClick={closeAddModal} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            {addStep === 1 ? (
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">Enter the Roll Number or Student Name to look up student details.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number / Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg text-center font-mono tracking-widest focus:outline-none focus:border-blue-500"
                    placeholder="e.g., PS-001 or Ram Bahadur"
                    value={lookupValue}
                    onChange={(e) => { setLookupValue(e.target.value); setLookupError(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                  />
                </div>
                {lookupError && (
                  <p className="mt-4 text-sm text-red-600">Student not found. Try again with a different Roll Number or name.</p>
                )}
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={closeAddModal} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={handleLookup} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Look Up</button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={lookedUpStudent?.full_name || ""} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application ID</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={lookedUpStudent ? formatAppId(lookedUpStudent.application_id) : ""} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={lookedUpStudent?.roll_no || "—"} readOnly />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={lookedUpStudent?.stream || "N/A"} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Center</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={lookedUpStudent?.exam_center || "N/A"} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marks / Score <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 85"
                      value={addMarks}
                      onChange={(e) => setAddMarks(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 font-semibold ${autoStatusClass(Number(addMarks))}`}
                      value={autoStatus(Number(addMarks))}
                      readOnly
                      placeholder="Auto from marks"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button onClick={() => { setAddStep(1); setLookupError(false); }} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Back</button>
                  <button onClick={handleAddStudent} disabled={!addMarks.trim() || addingStudent} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                    {addingStudent ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : "Add Student"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full overflow-hidden shadow-xl">
            <div className="px-6 py-4">
              <p className="text-sm text-gray-700">Remove this student from exam?</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleDeleteResult} className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Result Confirmation */}
      {publishConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full overflow-hidden shadow-xl">
            <div className="px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Publish Result</h2>
              <p className="text-sm text-gray-600">Are you sure you want to proceed to publish results? Students who have been added to this exam will have their results published.</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setPublishConfirmOpen(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => { setPublishConfirmOpen(false); onNavigate?.("sec-results"); }} className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">Proceed</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Marks Modal */}
      {editOpen && editResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Edit Marks</h2>
              <button onClick={() => setEditOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={getStudentName(editResult)} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application ID</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={formatAppId(editResult.application_id)} readOnly />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marks Obtained</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={editMarks} onChange={(e) => setEditMarks(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 font-semibold ${autoStatusClass(Number(editMarks))}`}
                    value={autoStatus(Number(editMarks))}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setEditOpen(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={handleEditMarks} disabled={savingEdit} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  {savingEdit ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

WrittenExam.displayName = "WrittenExam";

export default WrittenExam;
