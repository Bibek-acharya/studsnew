"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Loader2,
  LockKeyhole,
  Search,
  Users,
} from "lucide-react";
import { stripHtml } from "@/services/api";
import {
  mockTestsApi,
  type MockTestListPage,
  type PublicMockTest,
} from "@/services/mockTestsApi";
import CourseCombobox from "@/components/studyResources/CourseCombobox";
import { requireStudyResourceCategory } from "../studyResourceCategories";

const PAGE_SIZE = 12;
const category = requireStudyResourceCategory("mock-test");

const inputClass =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand-blue";

interface MockTestListPageProps {
  /** First page, server-fetched so the collection is indexable. */
  initialPage?: MockTestListPage;
}

function durationLabel(minutes: number | null): string {
  const value = Number(minutes);
  if (!Number.isFinite(value) || value <= 0) return "Self-paced";
  return `${value} min`;
}

function TestCard({ test }: { test: PublicMockTest }) {
  return (
    <article className="group flex h-full min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_18px_40px_-28px_rgba(15,23,42,0.5)] motion-reduce:transform-none motion-reduce:transition-none">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100">
          <ClipboardList className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          <Clock3 className="h-3 w-3" aria-hidden="true" />
          {durationLabel(test.duration_minutes)}
        </span>
      </div>

      <h3 className="text-base font-bold tracking-[-0.02em] text-gray-900">
        {test.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-gray-500">
        {stripHtml(test.description) || "No description provided."}
      </p>

      <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Questions</dt>
          <ClipboardList size={12} aria-hidden="true" />
          <dd>{test.question_count} questions</dd>
        </div>
        {test.course && (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Course</dt>
            <Users size={12} aria-hidden="true" />
            <dd className="truncate">{test.course}</dd>
          </div>
        )}
        {test.year && (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Year</dt>
            <Calendar size={12} aria-hidden="true" />
            <dd>{test.year}</dd>
          </div>
        )}
      </dl>

      <div className="mt-5 flex items-center justify-between gap-3 pt-1">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
          <LockKeyhole size={12} aria-hidden="true" />
          Sign in to submit
        </span>
        <Link
          href={`/study-resources/mock-test/${test.id}`}
          className="inline-flex items-center gap-1.5 rounded-md bg-cyan-600 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
        >
          Open test
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function MockTestListPage({ initialPage }: MockTestListPageProps) {
  const seeded = useRef(false);
  const [tests, setTests] = useState<PublicMockTest[]>(
    initialPage?.items ?? [],
  );
  const [total, setTotal] = useState(initialPage?.total ?? 0);
  const [loading, setLoading] = useState(!initialPage);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const loadTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await mockTestsApi.listMockTests({
        q: searchQuery || undefined,
        course: courseFilter || undefined,
        year: yearFilter || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setTests(result.items);
      setTotal(result.total);
      const years = new Set<string>();
      result.items.forEach((item) => {
        if (item.year?.trim()) years.add(item.year.trim());
      });
      setYearOptions(Array.from(years));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load mock tests",
      );
      setTests([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, courseFilter, yearFilter, page]);

  useEffect(() => {
    // The server already delivered page 1; only refetch once filters change.
    if (!seeded.current && initialPage) {
      seeded.current = true;
      return;
    }
    loadTests();
  }, [loadTests, initialPage]);

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

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const showEmpty = !loading && !error && tests.length === 0;

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
            {category.description} Browse freely — sign in when you are ready to
            submit and get your score with a per-question breakdown.
          </p>
        </section>

        <section className="mb-6 rounded-md border border-gray-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Browse tests
              </h2>
              <p className="text-[13px] text-gray-500">
                Each test shows its question count and suggested time.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSearchQuery("");
                setCourseFilter("");
                setYearFilter("");
                setPage(1);
              }}
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
                placeholder="Search tests by title or course..."
                aria-label="Search mock tests"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchQuery(searchInput.trim());
                    setPage(1);
                  }
                }}
                className={`${inputClass} pl-9`}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery(searchInput.trim());
                setPage(1);
              }}
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
              aria-label="Filter tests by year"
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

        <section aria-label="Mock test list">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-gray-400">
              <Loader2 size={28} className="animate-spin text-brand-blue" />
              <span className="sr-only">Loading mock tests</span>
            </div>
          ) : error ? (
            <div className="rounded-md border border-dashed border-rose-200 bg-rose-50/50 p-10 text-center text-sm text-rose-700">
              {error}
            </div>
          ) : showEmpty ? (
            <div className="rounded-md border border-dashed border-gray-200 bg-white p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <ClipboardList className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-900">
                No mock tests available yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                New practice sets are added regularly. Check back soon or try
                another filter.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {tests.map((test) => (
                <li key={test.id} className="min-w-0">
                  <TestCard test={test} />
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && !loading && !error && (
            <nav
              className="mt-6 flex items-center justify-center gap-3"
              aria-label="Mock test pages"
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
