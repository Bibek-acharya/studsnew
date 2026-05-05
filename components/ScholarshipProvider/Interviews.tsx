"use client";

import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Home, Mic, Pencil, Plus, Search, Trash2, Users, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { scholarshipProviderApi, writtenExamApi, ProviderApplication, ProviderScholarship } from "@/services/scholarshipProviderApi";

const APP_ID_YEAR = new Date().getFullYear();
const formatAppId = (id: number) => `APP-${APP_ID_YEAR}-${String(id).padStart(3, "0")}`;
const PASSING = 40;

const parseAppId = (val: string) => {
  const m = val.match(/^#?APP-\d{4}-(\d+)$/i);
  return m ? parseInt(m[1], 10) : null;
};

const Interviews: React.FC = memo(() => {
  const [scholarships, setScholarships] = useState<ProviderScholarship[]>([]);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>("");
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [writtenMarksMap, setWrittenMarksMap] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Add modal — 2-step lookup
  const [addOpen, setAddOpen] = useState(false);
  const [addStep, setAddStep] = useState<1 | 2>(1);
  const [lookupValue, setLookupValue] = useState("");
  const [lookupError, setLookupError] = useState(false);
  const [lookedUpStudent, setLookedUpStudent] = useState<ProviderApplication | null>(null);
  const [addScore, setAddScore] = useState("");
  const [addingScore, setAddingScore] = useState(false);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editApp, setEditApp] = useState<ProviderApplication | null>(null);
  const [editScore, setEditScore] = useState("");

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadScholarships() {
      try {
        const res = await scholarshipProviderApi.getScholarships(1, 100);
        if (!mounted) return;
        const pub = res.scholarships.filter((s) => s.status === "published");
        setScholarships(pub);
        if (!selectedScholarshipId && pub.length > 0) {
          setSelectedScholarshipId(String(pub[0].id));
        }
      } catch {
        toast.error("Failed to load scholarships");
      }
    }
    loadScholarships();
    return () => { mounted = false; };
  }, []);

  const refreshData = useCallback(async () => {
    if (!selectedScholarshipId) return;
    try {
      const [appRes, examRes] = await Promise.all([
        scholarshipProviderApi.getApplications({
          page: 1,
          limit: 500,
          status: "shortlisted",
          scholarship_id: selectedScholarshipId,
        }),
        writtenExamApi.getList({ scholarship_id: Number(selectedScholarshipId) }),
      ]);

      const shortlist = appRes.applications.filter((a) => a.status === "shortlisted");
      setApplications(shortlist);

      if (examRes?.exams?.length) {
        const exam = await writtenExamApi.getById(examRes.exams[0].id);
        const mm: Record<number, number> = {};
        exam.results?.forEach((r) => { mm[r.application_id] = r.marks_obtained; });
        setWrittenMarksMap(mm);
      } else {
        setWrittenMarksMap({});
      }
    } catch {
      // keep existing data on refresh error
    }
  }, [selectedScholarshipId]);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        await refreshData();
      } catch {
        if (mounted) {
          setApplications([]);
          setWrittenMarksMap({});
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, [refreshData]);

  // Only students who passed written exam AND have interview score → shown in table
  const interviewResults = useMemo(() => {
    return applications.filter((a) => a.evaluation_score != null);
  }, [applications]);

  const examCenters = useMemo(() => {
    const centers = new Set<string>();
    applications.forEach((a) => { if (a.exam_center) centers.add(a.exam_center); });
    return Array.from(centers).sort();
  }, [applications]);

  const filtered = useMemo(() => {
    return interviewResults.filter((app) => {
      const fullName = `${app.first_name} ${app.last_name}`.toLowerCase();
      const query = search.toLowerCase();
      if (query && !fullName.includes(query) && !String(app.id).includes(query)) return false;
      if (selectedCenter && app.exam_center !== selectedCenter) return false;
      return true;
    });
  }, [interviewResults, search, selectedCenter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paged = filtered.slice((page - 1) * limit, page * limit);

  useEffect(() => { setPage(1); }, [selectedScholarshipId, search, selectedCenter]);

  // --- Add Interview Score Modal ---
  const openAddModal = () => {
    setAddStep(1);
    setLookupValue("");
    setLookupError(false);
    setLookedUpStudent(null);
    setAddScore("");
    setAddOpen(true);
  };

  const closeAddModal = () => {
    setAddOpen(false);
    setLookedUpStudent(null);
    setLookupError(false);
  };

  const handleLookup = () => {
    const val = lookupValue.trim();
    if (!val) return;
    setLookupError(false);
    setLookedUpStudent(null);

    const parsedId = parseAppId(val);

    // Only students who passed written exam AND don't already have interview score
    const eligible = applications.filter((a) => {
      const wm = writtenMarksMap[a.id];
      const passed = wm != null && wm >= PASSING;
      const noInterview = a.evaluation_score == null;
      return passed && noInterview;
    });

    const match = eligible.find(
      (a) =>
        String(a.id) === val ||
        (parsedId !== null && a.id === parsedId) ||
        formatAppId(a.id) === val.toUpperCase() ||
        (a.full_name || `${a.first_name} ${a.last_name}`).toLowerCase().includes(val.toLowerCase())
    );

    if (!match) {
      setLookupError(true);
      return;
    }

    setLookedUpStudent(match);
    setAddScore("");
    setAddStep(2);
  };

  const handleAddScore = async () => {
    if (!lookedUpStudent || !addScore.trim()) return;
    const score = Number(addScore);
    if (Number.isNaN(score)) return;

    setAddingScore(true);
    try {
      await scholarshipProviderApi.evaluateApplication(lookedUpStudent.id, {
        score,
        notes: "",
        passing: score >= PASSING,
      });
      await refreshData();
      setPage(1);
      toast.success("Interview score added");
      closeAddModal();
    } catch {
      toast.error("Failed to add interview score");
    } finally {
      setAddingScore(false);
    }
  };

  // --- Edit Modal ---
  const openEdit = (app: ProviderApplication) => {
    setEditApp(app);
    setEditScore(app.evaluation_score != null ? String(app.evaluation_score) : "");
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editApp) return;
    const score = Number(editScore);
    if (Number.isNaN(score)) { toast.error("Enter a valid score"); return; }
    setSavingId(editApp.id);
    try {
      await scholarshipProviderApi.evaluateApplication(editApp.id, {
        score,
        notes: "",
        passing: score >= PASSING,
      });
      await refreshData();
      toast.success("Score updated");
      setEditOpen(false);
    } catch {
      toast.error("Failed to update score");
    } finally {
      setSavingId(null);
    }
  };

  // --- Delete ---
  const handleDeleteScore = async () => {
    const appId = deleteId;
    if (appId == null) return;
    setDeleteId(null);
    try {
      await scholarshipProviderApi.evaluateApplication(appId, {
        score: null,
        notes: "",
        passing: false,
      });
      await refreshData();
      toast.success("Interview score removed");
    } catch {
      toast.error("Failed to remove score");
    }
  };

  const scoreStatus = (score: number | undefined) => {
    if (score == null) return { text: "", cls: "" };
    return score >= PASSING
      ? { text: "Pass", cls: "bg-green-100 text-green-700" }
      : { text: "Fail", cls: "bg-red-100 text-red-700" };
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Interview</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Evaluation & Results / Interview</span>
        </div>
      </div>

      {/* Select Scholarship & Center */}
      <div className="bg-white rounded-lg p-6 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-600" /> Interview Evaluation
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Scholarship</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              value={selectedScholarshipId}
              onChange={(e) => setSelectedScholarshipId(e.target.value)}
            >
              <option value="">Select scholarship</option>
              {scholarships.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interview Center</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
            >
              <option value="">Select center</option>
              {examCenters.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interview Results Table */}
      <div className="bg-white rounded-lg p-6 border border-slate-100">
        <div className="flex justify-between items-center mb-6 gap-3 flex-col sm:flex-row">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> Interview Results
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="Search by name or symbol..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={openAddModal}
              disabled={!selectedScholarshipId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Interview Score
            </button>
          </div>
        </div>

        {interviewResults.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            No interview results yet. Click &quot;Add Interview Score&quot; to begin.
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No results match your search.</div>
        ) : (
          <>
            <div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
              <table className="w-full text-sm" style={{ minWidth: 900 }}>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student Name</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Application ID</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Symbol No.</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Written Marks</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Interview Score</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paged.map((app) => {
                    const writtenMark = writtenMarksMap[app.id];
                    const st = scoreStatus(app.evaluation_score);
                    return (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {app.full_name || `${app.first_name} ${app.last_name}`}
                        </td>
                        <td className="text-center py-3 px-4 font-mono text-gray-600">{formatAppId(app.id)}</td>
                        <td className="text-center py-3 px-4 font-mono text-gray-600">—</td>
                        <td className="text-center py-3 px-4 font-bold text-gray-900">
                          {writtenMark != null ? writtenMark : "—"}
                        </td>
                        <td className="text-center py-3 px-4 font-bold text-gray-900">
                          {app.evaluation_score ?? "—"}
                        </td>
                        <td className="text-center py-3 px-4">
                          {st.text ? (
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${st.cls}`}>{st.text}</span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => openEdit(app)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="Edit score"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteId(app.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Remove"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> students
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Interview Score Modal — Step 1: Lookup */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Add Interview Score
              </h2>
              <button onClick={closeAddModal} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            {addStep === 1 ? (
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">Enter Application ID or Student Name to look up. Only students who passed the written exam are eligible.</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application ID / Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg text-center font-mono tracking-widest focus:outline-none focus:border-blue-500"
                    placeholder="e.g., APP-2026-001 or Ram Bahadur"
                    value={lookupValue}
                    onChange={(e) => { setLookupValue(e.target.value); setLookupError(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                  />
                </div>
                {lookupError && (
                  <p className="mt-4 text-sm text-red-600">Student not found. Make sure the student passed the written exam and hasn&apos;t already been added.</p>
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
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={lookedUpStudent?.full_name || `${lookedUpStudent?.first_name} ${lookedUpStudent?.last_name}` || ""} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application ID</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={lookedUpStudent ? formatAppId(lookedUpStudent.id) : ""} readOnly />
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Written Exam Marks</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 font-bold" value={lookedUpStudent ? (writtenMarksMap[lookedUpStudent.id] ?? "—") : "—"} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interview Score <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 72"
                      value={addScore}
                      onChange={(e) => setAddScore(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 font-semibold ${Number(addScore) >= PASSING ? "bg-green-100 text-green-700" : Number.isNaN(Number(addScore)) ? "" : "bg-red-100 text-red-700"}`}
                    value={Number.isNaN(Number(addScore)) ? "" : Number(addScore) >= PASSING ? "Pass" : "Fail"}
                    readOnly
                    placeholder="Auto from score"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button onClick={() => { setAddStep(1); setLookupError(false); }} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Back</button>
                  <button onClick={handleAddScore} disabled={!addScore.trim() || addingScore} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                    {addingScore ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : "Add Score"}
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
              <p className="text-sm text-gray-700">Remove this student from interview results?</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleDeleteScore} className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Score Modal */}
      {editOpen && editApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Edit Interview Score</h2>
              <button onClick={() => setEditOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={editApp.full_name || `${editApp.first_name} ${editApp.last_name}`} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application ID</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={formatAppId(editApp.id)} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Written Exam Marks</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 font-bold" value={writtenMarksMap[editApp.id] ?? "—"} readOnly />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interview Score</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={editScore} onChange={(e) => setEditScore(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 font-semibold ${Number(editScore) >= PASSING ? "bg-green-100 text-green-700" : Number.isNaN(Number(editScore)) ? "" : "bg-red-100 text-red-700"}`}
                    value={Number.isNaN(Number(editScore)) ? "" : Number(editScore) >= PASSING ? "Pass" : "Fail"}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setEditOpen(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={handleEditSave} disabled={savingId === editApp.id} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                  {savingId === editApp.id ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Interviews.displayName = "Interviews";

export default Interviews;
