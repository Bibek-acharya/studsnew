"use client";
import React, { useState, useEffect } from "react";
import {
  MagnifyingGlass,
  Pencil,
  Trash,
  BookOpen,
  X,
  Plus,
} from "@phosphor-icons/react";
import { AlertTriangle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { superadminGlobalCourseApi } from "@/services/superadminRecordsApi";

const PAGE_SIZE = 20;
const COURSE_LEVELS = [
  "+2",
  "A-Level",
  "TSLC (CTEVT)",
  "Diploma (CTEVT)",
  "PCL",
  "Bachelor",
  "Bachelor's",
  "Bachelor's (Honours)",
  "Postgraduate Diploma (PGD)",
  "Master",
  "Master's",
  "MPhil",
  "PhD",
];

interface Course {
  id: number;
  title: string;
  name?: string;
  duration: string;
  fee: string;
  estFee?: string;
  status: string;
  affiliation?: string;
  affiliationName?: string;
  nonUniversityAffiliation?: string;
  fieldOfStudy?: string;
  level?: string;
}

export default function SuperadminCourseListSection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [level, setLevel] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    superadminGlobalCourseApi
      .list(page, PAGE_SIZE, level, debouncedSearch)
      .then((res) => {
        if (!active) return;
        setCourses(res.courses || []);
        setTotal(res.meta?.total || 0);
        setTotalPages(res.meta?.pages || 0);
      })
      .catch(() => {
        if (!active) return;
        setCourses([]);
        setTotal(0);
        setTotalPages(0);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, level, debouncedSearch, refreshKey]);

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: number | null;
    name: string;
  }>({ open: false, id: null, name: "" });
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.id) return;
    setDeleting(true);
    try {
      await superadminGlobalCourseApi.delete(deleteDialog.id);
      setDeleteDialog({ open: false, id: null, name: "" });
      if (courses.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        setRefreshKey((current) => current + 1);
      }
    } catch {
      alert("Failed to delete course. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (id: number) => {
    localStorage.setItem("superadmin_edit_global_course_id", String(id));
    setActiveSection("superadmin-add-course");
  };

  const firstItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, total);
  const visiblePages = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => {
      const start = Math.max(1, Math.min(page - 2, totalPages - 4));
      return start + index;
    },
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Course Directory</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all courses across institutions
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("superadmin_edit_global_course_id");
            setActiveSection("superadmin-add-course");
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by course or affiliation..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          />
        </div>
        <select
          value={level}
          onChange={(e) => {
            setLevel(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-64 px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:border-blue-600 outline-none"
          aria-label="Filter courses by level"
        >
          <option value="">All levels</option>
          {COURSE_LEVELS.map((courseLevel) => (
            <option key={courseLevel} value={courseLevel}>
              {courseLevel}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Loading...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">
              {search || level ? "No courses matched." : "No courses yet."}
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
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Affiliation
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Field of Study
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Level
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Duration
                  </th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">
                    Fee
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
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium text-gray-900">
                      {c.title || c.name || "-"}
                    </td>
                    <td className="py-3 px-6 text-gray-600">
                      {c.affiliationName || c.affiliation || c.nonUniversityAffiliation || "-"}
                    </td>
                    <td className="py-3 px-6 text-gray-600">
                      {c.fieldOfStudy || "-"}
                    </td>
                    <td className="py-3 px-6 text-gray-600">
                      {c.level || "-"}
                    </td>
                    <td className="py-3 px-6 text-gray-600">
                      {c.duration || "-"}
                    </td>
                    <td className="py-3 px-6 text-gray-600">{c.estFee || c.fee || "-"}</td>
                    <td className="text-center py-3 px-6">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${c.status === "published" ? "bg-green-100 text-green-700" : c.status === "draft" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="text-center py-3 px-6">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEdit(c.id)}
                          className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              id: c.id,
                              name: c.title || c.name || "",
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
      </div>

      {!loading && total > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing {firstItem}-{lastItem} of {total} courses
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {visiblePages.map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`w-9 h-9 rounded-lg border text-sm font-medium ${
                  pageNumber === page
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
                aria-current={pageNumber === page ? "page" : undefined}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Delete Course
              </h3>
              <button
                onClick={() =>
                  setDeleteDialog({ open: false, id: null, name: "" })
                }
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to delete this course?
            </p>
            <p className="text-sm font-medium text-gray-900 mb-6">
              &ldquo;{deleteDialog.name}&rdquo;
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteDialog({ open: false, id: null, name: "" })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
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
