"use client";
import React, { useState, useEffect } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { superadminEntranceApi } from "@/services/superadminRecordsApi";
import CollegeFilterDropdown from "./CollegeFilterDropdown";

interface Institution {
  id: number;
  institution_name: string;
}

export default function SuperadminEntranceResultsSection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const [entrances, setEntrances] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [collegeFilter, setCollegeFilter] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      superadminEntranceApi.list(1, 100),
      fetch("/api/v1/superadmin/institutions")
        .then((r) => r.json())
        .then((d) => d.data?.institutions || [])
        .catch(() => []),
    ])
      .then(([res, insts]) => {
        setEntrances(res.entrances || []);
        setInstitutions(insts);
      })
      .catch(() => setEntrances([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedExam) {
      setApplicants([]);
      return;
    }
    superadminEntranceApi
      .getApplicants(Number(selectedExam))
      .then(setApplicants)
      .catch(() => setApplicants([]));
  }, [selectedExam]);

  const filteredEntrances = entrances.filter((e) => {
    if (collegeFilter === null) return true;
    return e.institution_id === collegeFilter;
  });

  const filtered = applicants.filter((a) => a.score > 0 || a.rank > 0);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <SectionHeader
          title="Results"
          breadcrumbItems={[
            { label: "Dashboard" },
            { label: "Entrance" },
            { label: "Results" },
          ]}
        />
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <label className="block text-sm font-medium text-gray-700">
              Exam:
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            >
              <option value="">Select Exam</option>
              {filteredEntrances.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                  {e.institution_name ? ` (${e.institution_name})` : ""}
                </option>
              ))}
            </select>
            <CollegeFilterDropdown
              institutions={institutions}
              value={collegeFilter}
              onChange={(id) => {
                setCollegeFilter(id);
                setSelectedExam("");
              }}
            />
          </div>
          {filtered.length > 0 && (
            <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <DownloadSimple size={18} /> Download Results
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Loading...</p>
          </div>
        ) : !selectedExam ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Select an exam to view results</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No results published yet for this exam.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    User ID
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    Score
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    Rank
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {a.user_id}
                    </td>
                    <td className="text-center px-4 py-3 font-semibold text-gray-900">
                      {a.score}
                    </td>
                    <td className="text-center px-4 py-3 font-semibold text-gray-900">
                      {a.rank}
                    </td>
                    <td className="text-center px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          a.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : a.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
