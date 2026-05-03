"use client";

import React, { memo, useEffect, useMemo, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Home, Mic, Save, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { scholarshipProviderApi, ProviderApplication, ProviderScholarship } from "@/services/scholarshipProviderApi";

type EvaluationDraft = {
  score: string;
  notes: string;
  passing: boolean;
};

const Interviews: React.FC = memo(() => {
  const [scholarships, setScholarships] = useState<ProviderScholarship[]>([]);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>("");
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [drafts, setDrafts] = useState<Record<number, EvaluationDraft>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    let mounted = true;

    async function loadScholarships() {
      try {
        const res = await scholarshipProviderApi.getScholarships(1, 100);
        if (!mounted) return;
        setScholarships(res.scholarships);
        if (!selectedScholarshipId && res.scholarships.length > 0) {
          setSelectedScholarshipId(String(res.scholarships[0].id));
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load scholarships");
      }
    }

    loadScholarships();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadShortlisted() {
      setLoading(true);
      try {
        const res = await scholarshipProviderApi.getApplications({
          page: 1,
          limit: 100,
          status: "shortlisted",
          scholarship_id: selectedScholarshipId || undefined,
        });
        if (!mounted) return;
        const shortlist = res.applications.filter((application) => application.status === "shortlisted");
        setApplications(shortlist);
        setDrafts((prev) => {
          const next = { ...prev };
          shortlist.forEach((application) => {
            if (!next[application.id]) {
              next[application.id] = {
                score: application.evaluation_score != null ? String(application.evaluation_score) : "",
                notes: application.evaluation_notes || "",
                passing: application.evaluation_passed ?? false,
              };
            }
          });
          return next;
        });
      } catch (err) {
        if (mounted) {
          setApplications([]);
          toast.error(err instanceof Error ? err.message : "Failed to load shortlisted students");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadShortlisted();

    return () => {
      mounted = false;
    };
  }, [selectedScholarshipId]);

  const scholarshipLabel = useMemo(() => {
    if (!selectedScholarshipId) return "All shortlisted scholarships";
    return scholarships.find((scholarship) => String(scholarship.id) === selectedScholarshipId)?.title || "Selected scholarship";
  }, [scholarships, selectedScholarshipId]);

  const filtered = applications.filter((application) => {
    const fullName = `${application.first_name} ${application.last_name}`.toLowerCase();
    const scholarshipTitle = application.scholarship?.title?.toLowerCase() || "";
    const query = search.toLowerCase();
    return !query || fullName.includes(query) || scholarshipTitle.includes(query) || String(application.id).includes(query);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paged = filtered.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    setPage(1);
  }, [selectedScholarshipId, search]);

  const handleSaveEvaluation = async (applicationId: number) => {
    const draft = drafts[applicationId];
    if (!draft) return;

    const score = Number(draft.score);
    if (Number.isNaN(score)) {
      toast.error("Enter a valid score before saving");
      return;
    }

    setSavingId(applicationId);
    try {
      const updated = await scholarshipProviderApi.evaluateApplication(applicationId, {
        score,
        notes: draft.notes,
        passing: draft.passing,
      });
      setApplications((prev) => prev.map((application) => (application.id === applicationId ? updated : application)));
      setDrafts((prev) => ({
        ...prev,
        [applicationId]: {
          score: updated.evaluation_score != null ? String(updated.evaluation_score) : String(score),
          notes: updated.evaluation_notes || draft.notes,
          passing: updated.evaluation_passed ?? draft.passing,
        },
      }));
      toast.success("Interview details have been updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save evaluation");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading shortlisted students...</div>;
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

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-600" /> Evaluation From Shortlisted Students
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Scholarship</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              value={selectedScholarshipId}
              onChange={(e) => setSelectedScholarshipId(e.target.value)}
            >
              <option value="">All shortlisted scholarships</option>
              {scholarships.map((scholarship) => (
                <option key={scholarship.id} value={scholarship.id}>
                  {scholarship.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current shortlist</label>
            <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700">
              {scholarshipLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6 gap-3 flex-col sm:flex-row">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> Shortlisted Students
          </h2>
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              placeholder="Search by name or application id..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
            No shortlisted students found for the selected scholarship.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
              <table className="w-full text-sm" style={{ minWidth: "1100px" }}>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Application ID</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Scholarship</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Score</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Pass / Fail</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Notes</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        No results found
                      </td>
                    </tr>
                  ) : (
                    paged.map((application) => {
                      const draft = drafts[application.id] || { score: "", notes: "", passing: false };
                      return (
                        <tr key={application.id} className="hover:bg-gray-50 align-top">
                          <td className="py-3 px-4 font-medium text-gray-900">
                            <div>{application.full_name || `${application.first_name} ${application.last_name}`}</div>
                            <div className="text-xs text-gray-500">{application.email}</div>
                          </td>
                          <td className="text-center py-3 px-4 font-mono text-gray-600">#{application.id}</td>
                          <td className="text-center py-3 px-4 text-gray-600">{application.scholarship?.title || "N/A"}</td>
                          <td className="text-center py-3 px-4">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="w-24 text-center text-sm py-1 px-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                              value={draft.score}
                              onChange={(e) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [application.id]: { ...draft, score: e.target.value },
                                }))
                              }
                              placeholder="Score"
                            />
                          </td>
                          <td className="text-center py-3 px-4">
                            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                              <input
                                type="checkbox"
                                checked={draft.passing}
                                onChange={(e) =>
                                  setDrafts((prev) => ({
                                    ...prev,
                                    [application.id]: { ...draft, passing: e.target.checked },
                                  }))
                                }
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              Passing
                            </label>
                          </td>
                          <td className="py-3 px-4">
                            <textarea
                              className="w-full min-h-[72px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                              value={draft.notes}
                              onChange={(e) =>
                                setDrafts((prev) => ({
                                  ...prev,
                                  [application.id]: { ...draft, notes: e.target.value },
                                }))
                              }
                              placeholder="Evaluation notes"
                            />
                          </td>
                          <td className="text-center py-3 px-4">
                            <button
                              onClick={() => handleSaveEvaluation(application.id)}
                              disabled={savingId === application.id}
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                              <Save className="w-4 h-4" />
                              {savingId === application.id ? "Saving..." : "Save"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> shortlisted students
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${page === index + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                  >
                    {index + 1}
                  </button>
                ))}
                {totalPages > 5 && <span className="text-gray-400">...</span>}
                <button
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
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
    </div>
  );
});

Interviews.displayName = "Interviews";

export default Interviews;
