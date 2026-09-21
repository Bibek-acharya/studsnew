"use client";

import { useMemo, useState } from "react";
import {
  fetchDownloadsList,
  formatFileSize,
  getDownloadEndpoint,
  type DownloadItem,
  type DownloadListResponse,
} from "@/services/downloads.api";

const PAGE_LIMIT = 9;

const DEFAULT_TABS = ["all", "brochures", "forms"];

// ─── File type styling ────────────────────────────────────────────────────

function fileMeta(item: DownloadItem): {
  icon: string;
  band: string;
  ext: string;
} {
  const name = (item.fileName || item.fileUrl || "").toLowerCase();
  const ext = name.includes(".")
    ? (name.split(".").pop() ?? "").slice(0, 5)
    : "";
  const mime = (item.mimeType || "").toLowerCase();

  if (mime.includes("pdf") || ext === "pdf")
    return {
      icon: "fa-solid fa-file-pdf",
      band: "bg-red-50 text-red-600",
      ext: "pdf",
    };
  if (mime.includes("word") || ext === "doc" || ext === "docx")
    return {
      icon: "fa-solid fa-file-word",
      band: "bg-blue-50 text-blue-600",
      ext,
    };
  if (mime.includes("sheet") || ext === "xls" || ext === "xlsx")
    return {
      icon: "fa-solid fa-file-excel",
      band: "bg-emerald-50 text-emerald-600",
      ext,
    };
  if (mime.includes("image") || ["png", "jpg", "jpeg", "webp", "svg"].includes(ext))
    return {
      icon: "fa-solid fa-file-image",
      band: "bg-violet-50 text-violet-600",
      ext,
    };
  if (mime.includes("zip") || ext === "zip" || ext === "rar")
    return {
      icon: "fa-solid fa-file-zipper",
      band: "bg-amber-50 text-amber-600",
      ext,
    };
  if (mime.includes("text") || ext === "txt" || ext === "csv")
    return {
      icon: "fa-solid fa-file-lines",
      band: "bg-slate-100 text-slate-600",
      ext,
    };
  return {
    icon: "fa-solid fa-download",
    band: "bg-blue-50 text-brand-blue",
    ext,
  };
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Pagination ───────────────────────────────────────────────────────────

function Pagination({
  page,
  total,
  limit,
  onPage,
}: {
  page: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pages = useMemoPageList(page, totalPages);
  if (totalPages <= 1) return null;

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="flex h-10 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <i className="fa-solid fa-chevron-left text-xs" aria-hidden />
        Prev
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-10 w-8 items-center justify-center text-sm text-gray-400"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPage(p)}
            aria-current={p === page ? "page" : undefined}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
              p === page
                ? "bg-brand-blue text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        className="flex h-10 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <i className="fa-solid fa-chevron-right text-xs" aria-hidden />
      </button>
    </nav>
  );
}

function useMemoPageList(page: number, totalPages: number): (number | "…")[] {
  return useMemo(() => {
    const out: (number | "…")[] = [];
    const push = (n: number | "…") => out.push(n);
    const windowSize = 1;
    const show = (n: number) => n >= 1 && n <= totalPages;

    push(1);
    const left = Math.max(2, page - windowSize);
    const right = Math.min(totalPages - 1, page + windowSize);
    if (left > 2) push("…");
    for (let n = left; n <= right; n++) if (show(n)) push(n);
    if (right < totalPages - 1) push("…");
    if (totalPages > 1) push(totalPages);
    return out;
  }, [page, totalPages]);
}

// ─── Download row ─────────────────────────────────────────────────────────

function DownloadRow({ item }: { item: DownloadItem }) {
  const meta = fileMeta(item);
  const date = formatDate(item.publishedAt);
  const href = getDownloadEndpoint(item.id);

  return (
    <article className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20 hover:shadow-md hover:shadow-blue-500/5 sm:gap-6 sm:p-6">
      {/* File icon */}
      <div
        className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${meta.band} transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16`}
      >
        <i className={`${meta.icon} text-2xl`} aria-hidden />
        {meta.ext && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-gray-900 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase">
            {meta.ext}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-bold tracking-tight text-gray-900 sm:text-base">
          {item.title}
        </h3>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-gray-500">
            {item.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <i className="fa-solid fa-hard-drive text-[10px]" aria-hidden />
            {formatFileSize(item.fileSize)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="fa-solid fa-cloud-arrow-down text-[10px]" aria-hidden />
            {item.downloadCount.toLocaleString()} downloads
          </span>
          {item.category && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600 capitalize">
              <i className="fa-solid fa-tag text-[9px]" aria-hidden />
              {item.category.replace(/_/g, " ")}
            </span>
          )}
          {date && (
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <i className="fa-regular fa-calendar text-[10px]" aria-hidden />
              {date}
            </span>
          )}
        </div>
      </div>

      {/* Download button */}
      <a
        href={href}
        className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-brand-blue px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-hover sm:px-6"
        aria-label={`Download ${item.title}`}
      >
        <i className="fa-solid fa-download text-xs" aria-hidden />
        <span className="hidden sm:inline">Download</span>
      </a>
    </article>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────

export default function DownloadsView({
  initialData,
}: {
  initialData: DownloadListResponse;
}) {
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<DownloadListResponse>(initialData);
  const [loading, setLoading] = useState(false);

  const items = data.items;

  // Category tabs: derive from the data, fall back to sensible defaults and
  // gracefully keep only tabs that actually exist.
  const tabs = useMemo(() => {
    const present = Array.from(
      new Set(
        [
          ...initialData.items,
          ...items,
        ]
          .map((i) => (i.category || "").trim().toLowerCase())
          .filter(Boolean),
      ),
    );
    const merged = Array.from(new Set([...DEFAULT_TABS, ...present]));
    return ["all", ...merged.filter((c) => c !== "all")];
  }, [initialData.items, items]);

  const visible = useMemo(
    () =>
      category === "all"
        ? items
        : items.filter((i) => (i.category || "").trim().toLowerCase() === category),
    [items, category],
  );

  async function load(nextCategory: string, nextPage: number) {
    setLoading(true);
    const res = await fetchDownloadsList({
      page: nextPage,
      limit: PAGE_LIMIT,
      category: nextCategory,
    });
    setData(res);
    setLoading(false);
  }

  function changeCategory(key: string) {
    setCategory(key);
    setPage(1);
    if (key !== "all") {
      load(key, 1);
    } else if (initialData.unavailable) {
      load("all", 1);
    } else {
      setData(initialData);
    }
  }

  function changePage(nextPage: number) {
    setPage(nextPage);
    load(category, nextPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="w-full">
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden rounded-b-2xl bg-brand-blue pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="absolute top-[-80px] right-[-80px] h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute bottom-[-40px] left-[-40px] h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/3 h-32 w-32 rounded-full bg-white/[0.03]" />

        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest text-blue-100 uppercase">
            <i className="fa-solid fa-cloud-arrow-down text-[10px]" aria-hidden />
            Resource Center
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Downloads
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Brochures, forms and official documents — everything you need, one
            click away.
          </p>
        </div>
      </section>

      {/* ==================== CONTENT ==================== */}
      <section className="bg-gray-50 pb-20">
        <div className="mx-auto w-full max-w-350 px-4 sm:px-6 md:px-8">
          {/* Category tabs */}
          <div
            className="-mt-8 flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm"
            role="tablist"
            aria-label="Filter by category"
          >
            {tabs.map((tab) => {
              const active = category === tab;
              const label =
                tab === "all"
                  ? "All"
                  : tab.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => changeCategory(tab)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                    active
                      ? "bg-brand-blue text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* List */}
          {loading ? (
            <div className="mt-10 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex animate-pulse items-center gap-6 rounded-xl border border-gray-200 bg-white p-6"
                >
                  <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-100" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/3 rounded bg-gray-100" />
                    <div className="h-3 w-2/3 rounded bg-gray-100" />
                  </div>
                  <div className="h-10 w-28 shrink-0 rounded-full bg-gray-100" />
                </div>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <i
                  className="fa-solid fa-folder-open text-2xl text-brand-blue"
                  aria-hidden
                />
              </div>
              <h3 className="mt-5 text-lg font-bold text-gray-900">
                {data.unavailable
                  ? "We couldn't load the resource center right now"
                  : "No files here yet"}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                {data.unavailable
                  ? "Downloads are temporarily unavailable. Please try again in a moment."
                  : "No files have been published in this category yet. Check back soon."}
              </p>
              <button
                type="button"
                onClick={() => changeCategory("all")}
                className="mt-6 cursor-pointer rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                View all files
              </button>
            </div>
          ) : (
            <div className="mt-10 space-y-4">
              {visible.map((item) => (
                <DownloadRow key={item.id} item={item} />
              ))}
            </div>
          )}

          {!loading && visible.length > 0 && (
            <Pagination
              page={page}
              total={data.pagination.total}
              limit={data.pagination.limit || PAGE_LIMIT}
              onPage={changePage}
            />
          )}
        </div>
      </section>
    </div>
  );
}
