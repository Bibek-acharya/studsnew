"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, PlayCircle, Search } from "lucide-react";
import {
  studyResourcesApi,
  STUDY_RESOURCE_VIDEO_TYPE,
  type StudyResource,
  type StudyResourcePage,
} from "@/services/studyResourcesApi";
import { useAuth } from "@/services/AuthContext";
import CourseCombobox from "@/components/studyResources/CourseCombobox";
import ResourceCard from "@/components/studyResources/ResourceCard";
import { resolveResourceAccess } from "@/components/coins/useCoinState";
import { coinsApi, type CoinBalance } from "@/services/coinsApi";
import { requireStudyResourceCategory } from "./studyResourceCategories";
import VideoLecturePlayer from "./VideoLecturePlayer";

const PAGE_SIZE = 12;
const category = requireStudyResourceCategory("video-lectures");

const inputClass =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand-blue";

interface VideoLecturesPageProps {
  /** First page, server-fetched so the collection is indexable. */
  initialPage?: StudyResourcePage;
}

export default function VideoLecturesPage({
  initialPage,
}: VideoLecturesPageProps) {
  const seeded = useRef(false);
  const { user } = useAuth();
  const [resources, setResources] = useState<StudyResource[]>(
    initialPage?.items ?? [],
  );
  const [total, setTotal] = useState(initialPage?.total ?? 0);
  const [loading, setLoading] = useState(!initialPage);
  const [error, setError] = useState<string | null>(null);
  // The wallet, tagged with the user it was read for. See the effect below.
  const [wallet, setWallet] = useState<{
    userId: number | null;
    balance: CoinBalance | null;
  } | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [yearOptions, setYearOptions] = useState<string[]>(
    initialPage?.years ?? [],
  );
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(
    initialPage?.items?.[0]?.id ?? null,
  );

  const loadLectures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // The session-scoped list when signed in, so each lecture card carries its
      // access block. Signed out it falls back to the public list, which carries none —
      // the same thing an ungated deployment gets either way. See
      // StudyResourcesPage for the identical wiring and the reasoning.
      const result = await studyResourcesApi.listStudyResourcesWithAccess(
        {
          q: searchQuery || undefined,
          type: STUDY_RESOURCE_VIDEO_TYPE,
          course: courseFilter || undefined,
          year: yearFilter || undefined,
          page,
          limit: PAGE_SIZE,
        },
        { signedIn: Boolean(user) },
      );
      setResources(result.items);
      setTotal(result.total);
      const years = new Set<string>(result.years);
      result.items.forEach((item) => {
        if (item.year?.trim()) years.add(item.year.trim());
      });
      setYearOptions(Array.from(years));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load video lectures",
      );
      setResources([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
    // `user` is in the deps because the fetch branches on it — see the note on
    // StudyResourcesPage's identical wiring.
  }, [searchQuery, courseFilter, yearFilter, page, user]);

  useEffect(() => {
    // The server already delivered page 1; only refetch once filters change.
    if (!seeded.current && initialPage) {
      seeded.current = true;
      return;
    }
    loadLectures();
  }, [loadLectures, initialPage]);

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

  // One wallet read for the list, and only for a signed-in student. Tagged with
  // the user it belongs to and derived below, so signing out resolves every
  // badge to `anonymous` without a cascading setState inside the effect.
  useEffect(() => {
    if (!user) return;
    let active = true;
    // `user.id` is optional on the session type; a session without one is not a
    // wallet we can attribute, so the read is tagged null and the derived
    // balance stays null: undetermined, never zero.
    const userId = user.id ?? null;
    void coinsApi.getBalance().then((balance) => {
      if (active) setWallet({ userId, balance });
    });
    return () => {
      active = false;
    };
  }, [user]);

  // Null means "no wallet could be read", never zero. See useCoinState.
  const balance =
    user && wallet?.userId === (user.id ?? null) ? wallet.balance : null;

  /**
   * The one access decision, shared with the document catalogue. A lecture with
   * no `access` block resolves to null, so with the gate off the list renders
   * exactly as it did before coins existed — including the removal of the
   * `text-slate-400` "Sign in to play" label, which sat at 2.56:1 contrast
   * (06 §11.2) and is replaced by the state badge when the gate is on.
   */
  const accessFor = (lecture: StudyResource) =>
    resolveResourceAccess({
      access: lecture.access ?? null,
      balance,
      signedIn: Boolean(user),
      isPublished: lecture.is_published,
    });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // Derived, not stored: a filtered-out selection falls back to the first
  // lecture, so the player never points at something that is not on screen.
  const selected =
    resources.find((item) => item.id === selectedId) ?? resources[0] ?? null;

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearchQuery("");
    setCourseFilter("");
    setYearFilter("");
    setPage(1);
  };

  const showEmpty = !loading && !error && resources.length === 0;

  return (
    <div className="min-h-[70vh] bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-350 px-4 pb-14 sm:px-0">
        <section className="mb-7">
          <Link
            href="/study-resources"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-blue transition-colors hover:text-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            All study resources
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {category.label}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {category.description}
          </p>
        </section>

        {/* The stage sits above the list, so opening a lecture scrolls into view. */}
        {selected && (
          <section className="mb-6 scroll-mt-24" aria-label="Lecture player">
            <VideoLecturePlayer lecture={selected} />
          </section>
        )}

        <section className="mb-6 rounded-md border border-gray-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Browse lectures
              </h2>
              <p className="text-[13px] text-gray-500">
                Filter by course or year, then pick a lesson to play.
              </p>
            </div>
            <button
              type="button"
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
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search lectures by title, topic, or course..."
                aria-label="Search video lectures"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className={`${inputClass} pl-9`}
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover sm:w-32"
            >
              Search
            </button>
          </div>

          <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row">
            <div className="sm:flex-1">
              <CourseCombobox
                value={courseFilter}
                onChange={(value) => {
                  setCourseFilter(value);
                  setPage(1);
                }}
                allowEmpty
                emptyLabel="All courses"
                placeholder="All courses"
                inputClassName={inputClass}
              />
            </div>
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter lectures by year"
              className={`${inputClass} sm:flex-1`}
            >
              <option value="">All years</option>
              {yearsSortedDesc.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section aria-label="Video lecture list">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-gray-400">
              <Loader2 size={28} className="animate-spin text-brand-blue" />
              <span className="sr-only">Loading video lectures</span>
            </div>
          ) : error ? (
            <div className="rounded-md border border-dashed border-rose-200 bg-rose-50/50 p-10 text-center text-sm text-rose-700">
              {error}
            </div>
          ) : showEmpty ? (
            <div className="rounded-md border border-dashed border-gray-200 bg-white p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <PlayCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-900">
                No lectures match these filters
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Try a different course or year, or reset the filters to see
                everything.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
              {resources.map((lecture) => (
                <ResourceCard
                  key={lecture.id}
                  resource={lecture}
                  variant="video"
                  access={accessFor(lecture)}
                  selected={lecture.id === selectedId}
                  onSelect={() => setSelectedId(lecture.id)}
                  onPrimaryAction={() => setSelectedId(lecture.id)}
                  onSignIn={() => setSelectedId(lecture.id)}
                />
              ))}
            </ul>
          )}

          {totalPages > 1 && !loading && !error && (
            <nav
              className="mt-6 flex items-center justify-center gap-3"
              aria-label="Lecture pages"
            >
              <button
                type="button"
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
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
