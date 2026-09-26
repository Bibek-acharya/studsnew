"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Book,
  Calendar,
  ChevronLeft,
  Clock,
  Download,
  Eye,
  FileText,
  Loader2,
  Play,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  getStudyResourceStreamUrl,
  isVideoStudyResourceType,
  studyResourcesApi,
  StudyResource,
} from "@/services/studyResourcesApi";
import { stripHtml } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import StudyResourceFilterPanel from "@/components/studyResources/StudyResourceFilterPanel";
import { formatDuration } from "@/components/studyResources/videoFormat";
import {
  buildStudyResourceFilters,
  getStudyResourceCategoryByApiType,
  resolveStudyResourceType,
  type ApiStudyResourceType,
} from "./studyResourceCategories";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Courses and years are no longer hardcoded: courses come from the shared
// course list endpoint (via CourseCombobox) and years are aggregated from
// the list response (data.years + item values).

function formatFileSize(bytes: number | string): string {
  const size = Number(bytes) || 0;
  if (size <= 0) return "—";
  if (size >= 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(size / 1024)} KB`;
}

const searchInputClass =
  "w-full rounded-md border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue";

type DownloadTarget = { resource: StudyResource } | null;

interface StudyResourcesPageProps {
  lockedType?: ApiStudyResourceType;
}

export default function StudyResourcesPage({
  lockedType,
}: StudyResourcesPageProps = {}) {
  const router = useRouter();
  const { user } = useAuth();
  const lockedCategory = lockedType
    ? getStudyResourceCategoryByApiType(lockedType)
    : undefined;

  const [resources, setResources] = useState<StudyResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const effectiveType = resolveStudyResourceType(lockedType, typeFilter);
  const [courseFilter, setCourseFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [modalResource, setModalResource] = useState<DownloadTarget>(null);
  // Below lg the sidebar column is replaced by a bottom drawer holding the very
  // same filter panel, which is how Find College handles its own filters.
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await studyResourcesApi.listStudyResources(
          buildStudyResourceFilters({
            lockedType,
            selectedType: effectiveType,
            query: searchQuery,
            course: courseFilter,
            year: yearFilter,
            page,
          }),
        );
        const items = res?.data?.study_resources ?? [];
        setResources(items);
        const total = res?.data?.total ?? items.length;
        setTotalPages(Math.max(1, Math.ceil(total / 20)));
        // Aggregate years from the envelope (when present) and the items.
        const years = new Set<string>();
        if (Array.isArray(res?.data?.years)) {
          res.data.years.forEach((y) => {
            if (typeof y === "string" && y.trim()) years.add(y.trim());
          });
        }
        items.forEach((item) => {
          if (item.year && item.year.trim()) years.add(item.year.trim());
        });
        setYearOptions(Array.from(years));
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
  }, [searchQuery, effectiveType, courseFilter, yearFilter, page, lockedType]);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const yearsSortedDesc = useMemo(
    () =>
      [...yearOptions].sort((a, b) => {
        const na = Number(a);
        const nb = Number(b);
        if (Number.isFinite(na) && Number.isFinite(nb) && na !== nb) {
          return nb - na;
        }
        return b.localeCompare(a);
      }),
    [yearOptions],
  );

  const handleReset = () => {
    setSearchInput("");
    setSearchQuery("");
    if (!lockedType) setTypeFilter("");
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
  const CatalogHeading = lockedCategory ? "h1" : "h2";

  const filterPanel = (onClose?: () => void) => (
    <StudyResourceFilterPanel
      typeFilter={typeFilter}
      onTypeChange={(value) => {
        setTypeFilter(value);
        setPage(1);
      }}
      courseFilter={courseFilter}
      onCourseChange={(value) => {
        setCourseFilter(value);
        setPage(1);
      }}
      yearFilter={yearFilter}
      onYearChange={(value) => {
        setYearFilter(value);
        setPage(1);
      }}
      yearOptions={yearsSortedDesc}
      lockedCategory={lockedCategory}
      onReset={() => {
        handleReset();
        onClose?.();
      }}
      onClose={onClose}
    />
  );

  return (
    <div className="min-h-[70vh] bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-350 px-4 pb-14 sm:px-0">
        {/* Header */}
        <section className="mb-7">
          {lockedCategory && (
            <Link
              href="/study-resources"
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-blue transition-colors hover:text-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              All study resources
            </Link>
          )}
          <CatalogHeading className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {lockedCategory ? lockedCategory.label : "Past Questions & Resources"}
          </CatalogHeading>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {lockedCategory
              ? lockedCategory.description
              : "Access past exam papers, study notes, model questions, and other useful academic materials."}
          </p>
        </section>

        <div className="flex flex-col gap-6 lg:flex-row lg:flex-nowrap lg:gap-8">
          {/* Desktop filter sidebar */}
          <aside className="hidden w-full shrink-0 lg:block lg:w-75">
            {filterPanel()}
          </aside>

          {/* Mobile/tablet filter drawer: the same panel, lifted into a sheet */}
          {showMobileFilters && (
            <div
              className="fixed inset-0 z-50 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div
                className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {filterPanel(() => setShowMobileFilters(false))}
              </div>
            </div>
          )}

          {/* Results */}
          <main className="min-w-0 flex-1">
            {/* Search stays above the results at every width, next to the
                control that opens the drawer below lg. */}
            <div className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="search"
                  placeholder="Search by title, subject, or course..."
                  aria-label="Search study resources"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className={searchInputClass}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSearch}
                  className="flex-1 rounded-md bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 sm:flex-none sm:w-28"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(true)}
                  className="flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2.5 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 lg:hidden"
                >
                  <SlidersHorizontal size={14} aria-hidden="true" />
                  Filters
                </button>
              </div>
            </div>

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
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                    {resources.map((resource) => {
                      const isVideo = isVideoStudyResourceType(
                        resource.resource_type,
                      );
                      return (
                        <article
                          key={resource.id}
                          className="min-w-0 rounded-md border border-gray-200 bg-white p-4"
                        >
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
                                isVideo
                                  ? "bg-rose-50 text-rose-600"
                                  : "bg-blue-50 text-brand-blue"
                              }`}
                            >
                              {isVideo ? (
                                <Play className="h-5 w-5" />
                              ) : (
                                <FileText className="h-5 w-5" />
                              )}
                            </div>
                            <span className="rounded bg-gray-100 px-2 py-1 text-[11px] font-bold text-gray-600">
                              {typeLabel(resource.resource_type || "")}
                            </span>
                          </div>
                          <h3 className="mb-2 text-base font-semibold text-gray-900">
                            {resource.title}
                          </h3>
                          <p className="mb-4 min-h-[40px] text-[13px] leading-relaxed text-gray-500">
                            {stripHtml(resource.description) || "—"}
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
                            {isVideo ? (
                              <span className="inline-flex items-center gap-1.5">
                                <Clock size={13} />
                                {formatDuration(resource.duration_seconds)}
                              </span>
                            ) : (
                              <span>{formatFileSize(resource.file_size)}</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-3 pt-4">
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                              {isVideo ? (
                                <>
                                  <Eye size={13} /> {resource.views ?? 0} views
                                </>
                              ) : (
                                <>
                                  <Download size={13} /> {resource.downloads}{" "}
                                  downloads
                                </>
                              )}
                            </span>
                            {isVideo ? (
                              // Playback is public, so it goes straight to the
                              // backend stream for this exact lecture.
                              <a
                                href={getStudyResourceStreamUrl(resource.id)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-md bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                              >
                                <Play size={13} /> Watch
                              </a>
                            ) : (
                              <button
                                onClick={() => handleDownload(resource)}
                                disabled={downloadingId === resource.id}
                                className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs font-semibold text-brand-blue hover:bg-blue-100 disabled:opacity-60"
                              >
                                <Download size={13} /> Download
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    })}
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
          </main>
        </div>
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
