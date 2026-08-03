"use client";

import React, { useState, useEffect } from "react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { careersApi, Job } from "@/services/api";
import {
  MagnifyingGlass,
  Pencil,
  Trash,
  Eye,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  published: "text-green-600 bg-green-50",
  draft: "text-yellow-600 bg-yellow-50",
  closed: "text-red-600 bg-red-50",
};

const statusPill = (status: string) => {
  const color = statusColors[status] || "bg-gray-100 text-gray-700";
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${color}`}>
      {status}
    </span>
  );
};

const ITEMS_PER_PAGE = 10;

type TabStatus = "all" | "published" | "draft" | "closed";

const tabs: { key: TabStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "closed", label: "Closed" },
];

export default function SuperadminJobDirectorySection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: number | null;
    title: string;
  }>({ open: false, id: null, title: "" });
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = () => {
    setLoading(true);
    careersApi
      .listAllJobs({ limit: 200 })
      .then((res) => setJobs(res.data?.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filtered = jobs.filter((job) => {
    if (activeTab !== "all" && job.status !== activeTab) return false;
    const s = search.toLowerCase();
    return (
      !s ||
      job.title.toLowerCase().includes(s) ||
      job.department.toLowerCase().includes(s) ||
      job.location.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setDeleting(true);
    try {
      await careersApi.deleteJob(deleteDialog.id);
      setJobs((prev) => prev.filter((j) => j.id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null, title: "" });
      toast.success("Job deleted successfully");
    } catch {
      toast.error("Failed to delete job");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-full">
      <SectionHeader
        title="Job Directory"
        breadcrumbItems={[{ label: "Dashboard" }, { label: "Job Directory" }]}
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
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search jobs..."
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
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading jobs...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">
              {search || activeTab !== "all"
                ? "No jobs matched."
                : "No jobs yet. Create your first job."}
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
                    Department
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Location
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">
                    Applications
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
                {paginated.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium text-gray-900">
                      {job.title}
                    </td>
                    <td className="text-center py-3 px-6 text-gray-600">
                      {job.department}
                    </td>
                    <td className="text-center py-3 px-6 text-gray-600">
                      {job.location}
                    </td>
                    <td className="text-center py-3 px-6 text-gray-600 capitalize">
                      {job.job_type}
                    </td>
                    <td className="text-center py-3 px-6 text-gray-600">
                      {job.application_count}
                    </td>
                    <td className="text-center py-3 px-6">
                      {statusPill(job.status)}
                    </td>
                    <td className="text-center py-3 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            setActiveSection(
                              `superadmin-job-applicants-${job.id}`,
                            )
                          }
                          className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                          title="View Applicants"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setActiveSection(
                              `superadmin-edit-job-${job.id}`,
                            )
                          }
                          className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              id: job.id,
                              title: job.title,
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

      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Delete Job
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
              Are you sure you want to delete this job posting?
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
