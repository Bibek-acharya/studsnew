"use client";

import React, { memo, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, GraduationCap, Home, Search, Trophy, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { scholarshipProviderApi, writtenExamApi, ProviderApplication, ProviderScholarship, ProviderResult } from "@/services/scholarshipProviderApi";

type FinalResultRow = {
  application_id: number;
  scholarship_id: number;
  scholarship_title: string;
  student_name: string;
  evaluation_score: number;
  evaluation_passed: boolean;
  stream?: string;
  exam_center?: string;
  roll_number?: string;
  marks_obtained?: number;
  interview_location?: string;
  interview_date?: string;
  reporting_time?: string;
  required_documents?: string[];
  written_exam_marks?: number;
  final_score?: number;
  rank: number;
  result: string;
  notes: string;
};

const resultColor = (result: string) => {
  if (result === "Selected") return "bg-green-100 text-green-700";
  if (result === "Waitlisted") return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
};

const rankColor = (rank: number) => {
  if (rank === 1) return "bg-yellow-100 text-yellow-700";
  if (rank === 2) return "bg-gray-200 text-gray-700";
  if (rank === 3) return "bg-orange-100 text-orange-700";
  return "bg-gray-100 text-gray-600";
};

const FinalResult: React.FC = memo(() => {
  const [scholarships, setScholarships] = useState<ProviderScholarship[]>([]);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>("");
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [results, setResults] = useState<FinalResultRow[]>([]);
  const [existingPublished, setExistingPublished] = useState<ProviderResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
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

    async function loadData() {
      setLoading(true);
      try {
        const sid = selectedScholarshipId ? Number(selectedScholarshipId) : undefined;
        const [appsRes, resultsRes, writtenExamsRes] = await Promise.all([
          scholarshipProviderApi.getApplications({
            page: 1,
            limit: 100000,
            status: "shortlisted",
            scholarship_id: selectedScholarshipId || undefined,
          }),
          sid ? scholarshipProviderApi.getResults(1, 100, sid) : Promise.resolve({ results: [], meta: { total: 0, page: 1, limit: 100 } }),
          sid ? writtenExamApi.getList({ scholarship_id: sid }) : Promise.resolve({ exams: [], meta: { total: 0, page: 1, limit: 10 } }),
        ]);

        if (!mounted) return;

        const shortlist = appsRes.applications;
        setApplications(shortlist);
        setExistingPublished(resultsRes.results || []);

        // Load written exam marks
        let writtenMarksMap: Record<number, { marks_obtained: number; interview_location?: string; interview_date?: string; reporting_time?: string; required_documents?: string[] }> = {};
        if (writtenExamsRes.exams.length > 0) {
          for (const exam of writtenExamsRes.exams) {
            const fullExam = await writtenExamApi.getById(exam.id);
            for (const r of fullExam.results || []) {
              writtenMarksMap[r.application_id] = {
                marks_obtained: r.marks_obtained,
                interview_location: r.interview_location,
                interview_date: r.interview_date,
                reporting_time: r.reporting_time,
                required_documents: r.required_documents,
              };
            }
          }
        }

        const ordered = shortlist
          .map((application) => {
            const evalScore = application.evaluation_score ?? 0;
            const passing = application.evaluation_passed ?? evalScore >= 40;
            const written = writtenMarksMap[application.id];
            const writtenMarks = written?.marks_obtained ?? 0;
            const finalScore = evalScore + writtenMarks;
            return {
              application,
              evalScore,
              writtenMarks,
              finalScore,
              passing,
              interview: written,
            };
          })
          .sort((left, right) => right.finalScore - left.finalScore || `${left.application.first_name} ${left.application.last_name}`.localeCompare(`${right.application.first_name} ${right.application.last_name}`));

        const nextResults = ordered.map((item, index): FinalResultRow => {
          const rank = index + 1;
          const result = item.passing ? (rank <= 3 ? "Selected" : "Waitlisted") : "Rejected";
          return {
            application_id: item.application.id,
            scholarship_id: item.application.scholarship_id,
            scholarship_title: item.application.scholarship?.title || "Scholarship",
            student_name: item.application.full_name || `${item.application.first_name} ${item.application.last_name}`,
            evaluation_score: item.evalScore,
            evaluation_passed: item.passing,
            stream: item.application.stream,
            exam_center: item.application.exam_center,
            roll_number: item.application.roll_number,
            marks_obtained: item.writtenMarks,
            interview_location: item.interview?.interview_location,
            interview_date: item.interview?.interview_date,
            required_documents: item.interview?.required_documents,
            final_score: item.finalScore,
            rank,
            result,
            notes: item.application.evaluation_notes || "",
          };
        });

        setResults(nextResults);
      } catch (err) {
        if (mounted) {
          setApplications([]);
          setResults([]);
          toast.error(err instanceof Error ? err.message : "Failed to load result data");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [selectedScholarshipId]);

  const scholarshipLabel = useMemo(() => {
    if (!selectedScholarshipId) return "Select scholarship";
    return scholarships.find((scholarship) => String(scholarship.id) === selectedScholarshipId)?.title || "Selected scholarship";
  }, [scholarships, selectedScholarshipId]);

  const filtered = results.filter((row) => {
    const query = search.toLowerCase();
    return !query || row.student_name.toLowerCase().includes(query) || String(row.application_id).includes(query) || row.scholarship_title.toLowerCase().includes(query);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paged = filtered.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    setPage(1);
  }, [selectedScholarshipId, search]);

  const handlePublish = async () => {
    if (!selectedScholarshipId) {
      toast.error("Select a scholarship first");
      return;
    }

    if (results.length === 0) {
      toast.error("No shortlisted students to publish");
      return;
    }

    const scholarshipId = Number(selectedScholarshipId);
    const scholarshipTitle = scholarshipLabel;

    setPublishing(true);
    try {
      const payloadResults = results.map((row) => ({
        application_id: row.application_id,
        scholarship_id: row.scholarship_id,
        scholarship_title: row.scholarship_title,
        student_name: row.student_name,
        evaluation_score: row.evaluation_score,
        evaluation_passed: row.evaluation_passed,
        marks_obtained: row.marks_obtained || 0,
        final_score: (row.evaluation_score || 0) + (row.marks_obtained || 0),
        interview_location: row.interview_location || "",
        interview_date: row.interview_date || "",
        reporting_time: row.reporting_time || "",
        required_documents: row.required_documents || [],
        stream: row.stream || "",
        exam_center: row.exam_center || "",
        roll_number: row.roll_number || "",
        rank: row.rank,
        result: row.result,
        notes: row.notes,
      }));

      await scholarshipProviderApi.createResult({
        scholarship_id: scholarshipId,
        title: `${scholarshipTitle} Final Result`,
        status: "published",
        results: payloadResults,
      });
      // Reload published results
      const reloaded = await scholarshipProviderApi.getResults(1, 100, scholarshipId);
      setExistingPublished(reloaded.results || []);
      toast.success("Results have been published successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to publish final result");
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteResult = async () => {
    if (deleteId == null) return;
    try {
      await scholarshipProviderApi.deleteResult(deleteId);
      const sid = selectedScholarshipId ? Number(selectedScholarshipId) : undefined;
      const reloaded = sid ? await scholarshipProviderApi.getResults(1, 100, sid) : { results: [] };
      setExistingPublished(reloaded.results || []);
      setDeleteId(null);
      toast.success("Published result deleted");
    } catch {
      toast.error("Failed to delete result");
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading shortlist results...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Final Result</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Evaluation & Results / Final Result</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6 gap-3 flex-col sm:flex-row">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" /> Final Selection Result
          </h2>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {publishing ? "Publishing..." : "Publish Final Result"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Scholarship</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              value={selectedScholarshipId}
              onChange={(e) => setSelectedScholarshipId(e.target.value)}
            >
              <option value="">Select scholarship</option>
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
            <GraduationCap className="w-5 h-5 text-green-600" /> Final Results
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

        {results.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No shortlisted students found</div>
        ) : (
          <>
            <div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
              <table className="w-full text-sm" style={{ minWidth: "1100px" }}>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student Name</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Application ID</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Score</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Rank</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Result</th>
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
                    paged.map((row) => (
                      <tr key={row.application_id} className="hover:bg-gray-50 align-top">
                        <td className="py-3 px-4 font-medium text-gray-900">{row.student_name}</td>
                        <td className="text-center py-3 px-4 font-mono text-gray-600">#{row.application_id}</td>
                        <td className="text-center py-3 px-4 font-bold text-blue-600">{row.evaluation_score}</td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${rankColor(row.rank)}`}>
                            {row.rank}{row.rank === 1 ? "st" : row.rank === 2 ? "nd" : row.rank === 3 ? "rd" : "th"}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${resultColor(row.result)}`}>
                            {row.result}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{row.notes || "-"}</td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="Download result">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> final results
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

      {(existingPublished?.length ?? 0) > 0 && (
        <div className="bg-white rounded-lg p-8 border border-slate-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Published result records</h2>
          <div className="space-y-3 text-sm text-gray-600">
            {(existingPublished ?? []).map((record) => (
              <div key={record.id} className="rounded-lg border border-gray-200 px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{record.title}</div>
                  <div className="text-xs text-gray-500">
                    Status: {record.status}
                    {record.published_at && ` | Published: ${new Date(record.published_at).toLocaleDateString()}`}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Results: {Array.isArray(record.results) ? record.results.length : 0} students
                  </div>
                </div>
                <button
                  onClick={() => setDeleteId(record.id)}
                  className="p-1.5 hover:bg-red-50 rounded text-red-600"
                  title="Delete result"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full overflow-hidden shadow-xl">
            <div className="px-6 py-4">
              <p className="text-sm text-gray-700">Delete this published result? This cannot be undone.</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleDeleteResult} className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

FinalResult.displayName = "FinalResult";

export default FinalResult;
