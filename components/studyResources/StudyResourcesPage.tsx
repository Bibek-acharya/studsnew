"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Book,
  Calendar,
  Download,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import {
  studyResourcesApi,
  StudyResource,
} from "@/services/studyResourcesApi";
import { useAuth } from "@/services/AuthContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const RESOURCE_TYPES = [
  { value: "", label: "All resource types" },
  { value: "past-questions", label: "Past Questions" },
  { value: "study-notes", label: "Study Notes" },
  { value: "model-questions", label: "Model Questions" },
  { value: "syllabus", label: "Syllabus" },
];

const COURSES = ["", "BCA", "BIM", "BBS", "BIT", "BBA"];
const YEARS = ["", "2081", "2080", "2079"];

function formatFileSize(bytes: number | string): string {
  const size = Number(bytes) || 0;
  if (size <= 0) return "—";
  if (size >= 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(size / 1024)} KB`;
}

const inputClass =
  "w-full border border-gray-200 rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand-blue";

type DownloadTarget = { resource: StudyResource } | null;

export default function StudyResourcesPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [resources, setResources] = useState<StudyResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [modalResource, setModalResource] = useState<DownloadTarget>(null);

  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await studyResourcesApi.listStudyResources({
          q: searchQuery || undefined,
          type: typeFilter || undefined,
          course: courseFilter || undefined,
          year: yearFilter || undefined,
          page,
          limit: 20,
        });
        const items = res?.data?.study_resources ?? [];
        setResources(items);
        const total = res?.data?.total ?? items.length;
        setTotalPages(Math.max(1, Math.ceil(total / 20)));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load study resources",
        );
        setResources([]);
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, [searchQuery, typeFilter, courseFilter, yearFilter, page]);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearchQuery("");
    setTypeFilter("");
    setCourseFilter("");
    setYearFilter("");
    setPage(1);
  };

  const handleDownload = (resource: StudyResource) => {
    if (!user) {
      setModalResource({ resource });
      setLoginModalOpen(true);
      return;
    }
    setDownloadingId(resource.id);
    // Optimistically bump the displayed download count.
    setResources((prev) =>
      prev.map((r) => r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r),
    );
    window.open(
      `${API_BASE_URL}/api/v1/study-resources/${resource.id}/download`,
      "_self",
    );
    setTimeout(() => setDownloadingId(null), 1500);
  };

  const typeLabel = (value: string) =>
    value
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  return (
    <div className="min-h-[70vh] bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-350 px-4 pb-14 sm:px-0">
        {/* Header */}
        <section className="mb-7">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Past Questions &amp; Resources
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-500">
            Access past exam papers, study notes, model questions, and other
            useful academic materials.
          </p>
        </section>

        {/* Toolbar */}
        <section className="mb-6 rounded-md border border-gray-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Browse resources
              </h2>
              <p className="text-[13px] text-gray-500">
                Find the materials you need for your preparation.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
            >
              Reset
            </button>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                placeholder="Search by title, subject, or course..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className={`${inputClass} pl-9`}
              />
            </div>
            <button
              onClick={handleSearch}
              className="rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover sm:w-32"
            >
              Search
            </button>
          </div>

          <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`${inputClass} sm:flex-1`}
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className={`${inputClass} sm:flex-1`}
            >
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c || "All courses"}
                </option>
              ))}
            </select>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className={`${inputClass} sm:flex-1`}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y || "All years"}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* List */}
        <section>
          {loading ? (
            <div className="flex items-center justify-center py-24 text-gray-400">
              <Loader2 size={28} className="animate-spin text-brand-blue" />
            </div>
          ) : error ? (
            <div className="rounded-md border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
              {error}
            </div>
          ) : resources.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
              No resources found. Try changing your search or filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {resources.map((resource) => (
                  <article
                    key={resource.id}
                    className="min-w-0 rounded-md border border-gray-200 bg-white p-4"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-brand-blue">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="rounded bg-gray-100 px-2 py-1 text-[11px] font-bold text-gray-600">
                        {typeLabel(resource.resource_type || "")}
                      </span>
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-gray-900">
                      {resource.title}
                    </h3>
                    <p className="mb-4 min-h-[40px] text-[13px] leading-relaxed text-gray-500">
                      {resource.description || "—"}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 pb-4 text-xs text-gray-500">
                      {resource.course && (
                        <span className="inline-flex items-center gap-1.5">
                          <Book size={13} /> {resource.course}
                        </span>
                      )}
                      {resource.year && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={13} /> {resource.year}
                        </span>
                      )}
                      <span>{formatFileSize(resource.file_size)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                        <Download size={13} /> {resource.downloads} downloads
                      </span>
                      <button
                        onClick={() => handleDownload(resource)}
                        disabled={downloadingId === resource.id}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs font-semibold text-brand-blue hover:bg-blue-100 disabled:opacity-60"
                      >
                        <Download size={13} /> Download
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Login required modal */}
      {loginModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLoginModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-lg bg-white p-6"
          >
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Login required
            </h2>
            <p className="text-sm leading-relaxed text-gray-500">
              Please log in to download
              {modalResource ? ` "${modalResource.resource.title}"` : " this resource"}.
            </p>
            <div className="mt-6 flex gap-2.5">
              <button
                onClick={() => setLoginModalOpen(false)}
                className="flex-1 rounded-md bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setLoginModalOpen(false);
                  router.push("/login");
                }}
                className="flex-1 rounded-md bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
