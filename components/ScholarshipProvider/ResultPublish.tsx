"use client";

import React, { memo, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, GraduationCap, Home, Search, Trophy } from "lucide-react";
import { toast } from "sonner";
import { scholarshipProviderApi, ProviderApplication, ProviderScholarship } from "@/services/scholarshipProviderApi";

type FinalResultRow = {
  application_id: number;
  scholarship_id: number;
  scholarship_title: string;
  student_name: string;
  evaluation_score: number;
  evaluation_passed: boolean;
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
  const [existingPublished, setExistingPublished] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
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
        const [appsRes, resultsRes] = await Promise.all([
          scholarshipProviderApi.getApplications({
            page: 1,
            limit: 100,
            status: "shortlisted",
            scholarship_id: selectedScholarshipId || undefined,
          }),
          scholarshipProviderApi.getResults(1, 100),
        ]);

        if (!mounted) return;

        const shortlist = appsRes.applications.filter((application) => application.status === "shortlisted");
        setApplications(shortlist);
        setExistingPublished(resultsRes.results.filter((entry) => !selectedScholarshipId || String(entry.scholarship_id) === selectedScholarshipId));

        const ordered = shortlist
          .map((application) => {
            const score = application.evaluation_score ?? 0;
            const passing = application.evaluation_passed ?? score >= 40;
            return {
              application,
              score,
              passing,
            };
          })
          .sort((left, right) => right.score - left.score || `${left.application.first_name} ${left.application.last_name}`.localeCompare(`${right.application.first_name} ${right.application.last_name}`));

        const nextResults = ordered.map((item, index): FinalResultRow => {
          const rank = index + 1;
          const result = item.passing ? (rank <= 3 ? "Selected" : "Waitlisted") : "Rejected";
          return {
            application_id: item.application.id,
            scholarship_id: item.application.scholarship_id,
            scholarship_title: item.application.scholarship?.title || "Scholarship",
            student_name: item.application.full_name || `${item.application.first_name} ${item.application.last_name}`,
            evaluation_score: item.score,
            evaluation_passed: item.passing,
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
      toast.success("Final result published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to publish final result");
    } finally {
      setPublishing(false);
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

      {existingPublished.length > 0 && (
        <div className="bg-white rounded-lg p-8 border border-slate-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Published result records</h2>
          <div className="space-y-3 text-sm text-gray-600">
            {existingPublished.slice(0, 3).map((record) => (
              <div key={record.id} className="rounded-lg border border-gray-200 px-4 py-3">
                <div className="font-medium text-gray-900">{record.title}</div>
                <div className="text-xs text-gray-500">Status: {record.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

FinalResult.displayName = "FinalResult";

export default FinalResult;
