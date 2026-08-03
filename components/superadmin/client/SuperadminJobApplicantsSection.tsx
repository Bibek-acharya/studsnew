"use client";

import React, { useState, useEffect } from "react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { careersApi, Job, JobApplication } from "@/services/api";
import { MagnifyingGlass, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReviewApplicantModal from "@/components/careers/ReviewApplicantModal";

type TabStatus = "all" | "pending" | "shortlisted" | "approved" | "rejected";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  shortlisted: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  reviewed: "bg-purple-100 text-purple-700",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  approved: "Approved",
  rejected: "Rejected",
  reviewed: "Reviewed",
};

const statusPill = (status: string) => {
  const color = statusColors[status] || "bg-gray-100 text-gray-700";
  const label = statusLabels[status] || status;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
};

const ITEMS_PER_PAGE = 10;

export default function SuperadminJobApplicantsSection({
  setActiveSection,
  jobId,
}: {
  setActiveSection: (s: string) => void;
  jobId?: number;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<number | "">(jobId || "");
  const [applicants, setApplicants] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reviewApplicant, setReviewApplicant] = useState<JobApplication | null>(null);

  useEffect(() => {
    careersApi
      .listAllJobs({ limit: 200 })
      .then((res) => setJobs(res.data?.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedJob) {
      setApplicants([]);
      return;
    }
    setLoadingApplicants(true);
    careersApi
      .listApplicants(Number(selectedJob), { limit: 200 })
      .then((res) => setApplicants(res.data?.applications || []))
      .catch(() => setApplicants([]))
      .finally(() => setLoadingApplicants(false));
  }, [selectedJob]);

  const filtered = React.useMemo(() => {
    return applicants.filter((row) => {
      if (activeTab !== "all" && row.status !== activeTab) return false;
      const s = search.toLowerCase();
      if (
        s &&
        !row.full_name.toLowerCase().includes(s) &&
        !row.email.toLowerCase().includes(s)
      )
        return false;
      return true;
    });
  }, [applicants, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const tabs: { key: TabStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "shortlisted", label: "Shortlisted" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <SectionHeader
        title="Job Applicants"
        breadcrumbItems={[{ label: "Dashboard" }, { label: "Job Applicants" }]}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <select
              value={selectedJob}
              onChange={(e) => {
                setSelectedJob(e.target.value ? Number(e.target.value) : "");
                setPage(1);
                setActiveTab("all");
              }}
              className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            >
              <option value="">Select a job...</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.department})
                </option>
              ))}
            </select>

            {selectedJob && (
              <>
                <div className="relative w-full sm:w-72">
                  <MagnifyingGlass
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search applicants..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
                  />
                </div>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key);
                        setPage(1);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        activeTab === tab.key
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {!selectedJob ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Select a job to view applicants.</p>
          </div>
        ) : loadingApplicants ? (
          <div className="text-center py-12 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading applicants...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">
              {search || activeTab !== "all"
                ? "No applicants matched."
                : "No applicants yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Applied
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium text-gray-900">
                      {app.full_name}
                    </td>
                    <td className="text-center py-3 px-6 text-gray-600">
                      {app.email}
                    </td>
                    <td className="text-center py-3 px-6 text-gray-600">
                      {app.phone || "—"}
                    </td>
                    <td className="text-center py-3 px-6 text-gray-600">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="text-center py-3 px-6">
                      {statusPill(app.status)}
                    </td>
                    <td className="text-center py-3 px-6">
                      <button
                        onClick={() => setReviewApplicant(app)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50"
              >
                <CaretLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                    safePage === i + 1
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50"
              >
                <CaretRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {reviewApplicant && (
        <ReviewApplicantModal
          applicant={reviewApplicant}
          onClose={() => setReviewApplicant(null)}
          onUpdated={() => {
            setReviewApplicant(null);
            if (selectedJob) {
              setLoadingApplicants(true);
              careersApi
                .listApplicants(Number(selectedJob), { limit: 200 })
                .then((res) => setApplicants(res.data?.applications || []))
                .catch(() => setApplicants([]))
                .finally(() => setLoadingApplicants(false));
            }
          }}
        />
      )}
    </div>
  );
}
