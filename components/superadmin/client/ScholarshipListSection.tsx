"use client";

import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  Plus,
  Award,
  CheckCircle,
  FileText,
  X,
  Eye,
  Star,
} from "lucide-react";
import { apiService } from "@/services/api";
import { toast } from "sonner";

export default function ScholarshipListSection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    featured: 0,
  });
  const limit = 20;

  const fetchScholarships = (p: number) => {
    setLoading(true);
    apiService
      .listAllScholarships({ page: p, limit })
      .then((res) => {
        const list = res.data?.scholarships || [];
        setScholarships(list);
        setTotal(res.data?.total || list.length);
        setTotalPages(Math.ceil((res.data?.total || list.length) / limit));
        if (res.data?.stats) setStats(res.data.stats);
      })
      .catch(() => toast.error("Failed to load scholarships"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchScholarships(page);
  }, [page]);

  const handleToggleFeature = async (id: number, current: boolean) => {
    setTogglingId(id);
    try {
      const res = await apiService.toggleScholarshipFeature(id, !current);
      toast.success(res.message || "Feature status updated");
      fetchScholarships(page);
    } catch {
      toast.error("Failed to update feature status");
    } finally {
      setTogglingId(null);
    }
  };

  const activeCount =
    stats.active ||
    scholarships.filter(
      (s) => s.status === "active" || s.status === "published",
    ).length;
  const draftCount =
    stats.draft || scholarships.filter((s) => s.status === "draft").length;
  const featuredCount =
    stats.featured || scholarships.filter((s) => s.isFeatured).length;

  const formatDate = (d: string) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-50 text-green-600",
      published: "bg-green-50 text-green-600",
      draft: "bg-gray-100 text-gray-600",
      closed: "bg-red-50 text-red-600",
    };
    return (
      <span
        className={`rounded-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
          styles[status] || "bg-gray-50 text-gray-500"
        }`}
      >
        {status || "unknown"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-gray-200 bg-white p-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <GraduationCap size={20} className="text-blue-600" /> Manage
            Scholarship
          </h2>
          <button
            type="button"
            onClick={() => setActiveSection("create-scholarship")}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
          >
            <Plus size={16} /> Create Scholarship
          </button>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <SimpleStatCard
            icon={<Award size={18} />}
            value={String(total)}
            label="Total Scholarships"
            bg="bg-blue-100"
          />
          <SimpleStatCard
            icon={<CheckCircle size={18} />}
            value={String(activeCount)}
            label="Active"
            bg="bg-green-100"
          />
          <SimpleStatCard
            icon={<FileText size={18} />}
            value={String(draftCount)}
            label="Draft"
            bg="bg-gray-100"
          />
          <SimpleStatCard
            icon={<Star size={18} />}
            value={String(featuredCount)}
            label="Featured"
            bg="bg-amber-100"
          />
        </div>
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">
                  Scholarship Name
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">
                  Provider
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-600">
                  Featured
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-600">
                  Deadline
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Loading scholarships...
                  </td>
                </tr>
              ) : scholarships.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No scholarships found.
                  </td>
                </tr>
              ) : (
                scholarships.map((s: any) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {s.title || s.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {s.provider || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {s.isFeatured ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                          <Star size={12} /> Featured
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      {formatDate(s.deadline || s.end_date)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {statusBadge(s.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <ActionBtn
                          icon={<Eye size={16} />}
                          color="blue"
                          title="View Details"
                        />
                        <ActionBtn
                          icon={
                            togglingId === s.id ? (
                              <svg
                                className="h-4 w-4 animate-spin text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                            ) : (
                              <Star size={16} />
                            )
                          }
                          color={s.isFeatured ? "amber" : "purple"}
                          title={s.isFeatured ? "Unfeature" : "Feature"}
                          onClick={() =>
                            handleToggleFeature(s.id, s.isFeatured)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-30"
            >
              Prev
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SimpleStatCard({
  icon,
  value,
  label,
  bg,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  bg: string;
}) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-5">
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-md ${bg}`}
      >
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </p>
    </div>
  );
}

function ActionBtn({
  icon,
  color,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "red" | "amber";
  title?: string;
  onClick?: () => void;
}) {
  const colors: Record<string, string> = {
    blue: "text-blue-600 hover:bg-blue-50",
    green: "text-green-600 hover:bg-green-50",
    purple: "text-purple-600 hover:bg-purple-50",
    red: "text-red-600 hover:bg-red-50",
    amber: "text-amber-600 hover:bg-amber-50",
  };
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-md p-2 transition-all ${colors[color]}`}
    >
      {icon}
    </button>
  );
}
