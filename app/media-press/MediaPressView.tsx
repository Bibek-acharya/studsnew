"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  fetchMediaPressList,
  type MediaPressItem,
  type MediaPressListResponse,
} from "@/services/mediaPress.api";

const PAGE_LIMIT = 9;

const CATEGORY_TABS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "press_release", label: "Press Releases" },
  { key: "news", label: "News" },
  { key: "media_coverage", label: "Media Coverage" },
];

const CATEGORY_META: Record<
  string,
  { label: string; icon: string; band: string }
> = {
  press_release: {
    label: "Press Release",
    icon: "fa-solid fa-bullhorn",
    band: "from-brand-blue to-blue-700",
  },
  news: {
    label: "News",
    icon: "fa-solid fa-newspaper",
    band: "from-brand-orange to-orange-600",
  },
  media_coverage: {
    label: "Media Coverage",
    icon: "fa-solid fa-tv",
    band: "from-slate-800 to-slate-600",
  },
};

function categoryMeta(category: string) {
  return (
    CATEGORY_META[category] ?? {
      label: category
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      icon: "fa-solid fa-tag",
      band: "from-brand-blue to-blue-700",
    }
  );
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

// ─── Detail modal ─────────────────────────────────────────────────────────

function DetailModal({
  item,
  onClose,
}: {
  item: MediaPressItem;
  onClose: () => void;
}) {
  const meta = categoryMeta(item.category);
  const date = formatDate(item.publishedAt);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-gray-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="animate-slide-in relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-white sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header band */}
        <div
          className={`relative shrink-0 bg-gradient-to-br ${meta.band} px-6 py-8 sm:px-10 sm:py-10`}
        >
          <div className="absolute top-[-60px] right-[-60px] h-40 w-40 rounded-full bg-white/5" />
          <div className="absolute bottom-[-30px] left-[-30px] h-28 w-28 rounded-full bg-white/5" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
          >
            <i className="fa-solid fa-xmark" aria-hidden />
          </button>
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
              <i className={`${meta.icon} text-[10px]`} aria-hidden />
              {meta.label}
            </span>
            <h2 className="mt-3 pr-10 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              {item.title}
            </h2>
            {date && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-blue-100">
                <i className="fa-regular fa-calendar" aria-hidden />
                {date}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-6 sm:px-10 sm:py-8">
          {item.imageUrl && (
            <div className="relative mb-6 h-52 w-full overflow-hidden rounded-md sm:h-64">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                unoptimized={item.imageUrl.startsWith("http")}
              />
            </div>
          )}
          {item.summary && (
            <p className="mb-6 border-l-4 border-brand-orange pl-4 text-[15px] leading-relaxed font-medium text-gray-700">
              {item.summary}
            </p>
          )}
          {item.content ? (
            <div
              className="prose prose-sm sm:prose-base max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-brand-blue prose-strong:text-gray-900 prose-img:rounded-md"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          ) : (
            <p className="text-sm text-gray-400 italic">
              No additional content available for this item.
            </p>
          )}

          {item.externalUrl && (
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-xs" aria-hidden />
              Read the full story
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────

function PressCard({
  item,
  onOpen,
}: {
  item: MediaPressItem;
  onOpen: () => void;
}) {
  const meta = categoryMeta(item.category);
  const date = formatDate(item.publishedAt);
  const hasImage = Boolean(item.imageUrl);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20">
      {/* Cover */}
      <button
        type="button"
        onClick={onOpen}
        className="relative block h-44 w-full cursor-pointer overflow-hidden text-left"
        aria-label={`Read more about ${item.title}`}
      >
        {hasImage ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized={item.imageUrl.startsWith("http")}
          />
        ) : (
          <div
            className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${meta.band}`}
          >
            <div className="absolute top-[-40px] right-[-40px] h-32 w-32 rounded-full bg-white/5" />
            <div className="absolute bottom-[-20px] left-[-20px] h-20 w-20 rounded-full bg-white/5" />
            <i
              className={`${meta.icon} relative text-4xl text-white/80 transition-transform duration-300 group-hover:scale-110`}
              aria-hidden
            />
          </div>
        )}
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase ${hasImage ? "bg-gray-900/80 backdrop-blur-sm" : "bg-white/15"}`}
        >
          <i className={`${meta.icon} text-[10px]`} aria-hidden />
          {meta.label}
        </span>
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {date && (
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-400">
            <i className="fa-regular fa-calendar" aria-hidden />
            {date}
          </p>
        )}
        <button
          type="button"
          onClick={onOpen}
          className="cursor-pointer text-left text-[17px] leading-snug font-bold tracking-tight text-gray-900 transition-colors group-hover:text-brand-blue"
        >
          {item.title}
        </button>
        {item.summary && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">
            {item.summary}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 md:mt-auto">
          <button
            type="button"
            onClick={onOpen}
            className="flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-brand-blue transition-colors hover:text-brand-hover"
          >
            Read more
            <i
              className="fa-solid fa-arrow-right text-[10px] transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </button>
          {item.externalUrl && (
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400 transition-colors hover:text-brand-orange"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" aria-hidden />
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────

export default function MediaPressView({
  initialData,
}: {
  initialData: MediaPressListResponse;
}) {
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<MediaPressListResponse>(initialData);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<MediaPressItem | null>(null);

  const items = data.items;

  // Local filter for the "All" tab when the API returned a mixed page.
  const visible = useMemo(
    () =>
      category === "all"
        ? items
        : items.filter((i) => String(i.category) === category),
    [items, category],
  );

  const shouldClientFetch = initialData.unavailable || initialData.items.length === 0;

  async function load(nextCategory: string, nextPage: number) {
    setLoading(true);
    const res = await fetchMediaPressList({
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
    // Fetch fresh from the API when switching category (server data is the
    // unfiltered first page; a category tab may need a different slice).
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
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Media &amp; Press
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Official announcements, press releases and stories about StudSphere
            — straight from the source.
          </p>
        </div>
      </section>

      {/* ==================== CONTENT ==================== */}
      <section className="bg-gray-50 pb-20">
        <div className="mx-auto w-full max-w-[87.5rem] px-4 md:px-0">
          {/* Category tabs */}
          <div
            className="mt-8 flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-2"
            role="tablist"
            aria-label="Filter by category"
          >
            {CATEGORY_TABS.map((tab) => {
              const active = category === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => changeCategory(tab.key)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                    active
                      ? "bg-brand-blue text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-xl border border-gray-200 bg-white"
                >
                  <div className="h-44 rounded-t-xl bg-gray-100" />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-24 rounded bg-gray-100" />
                    <div className="h-4 w-3/4 rounded bg-gray-100" />
                    <div className="h-3 w-full rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <i className="fa-solid fa-newspaper text-2xl text-brand-blue" aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-bold text-gray-900">
                {shouldClientFetch && data.unavailable
                  ? "We couldn't load the newsroom right now"
                  : "Nothing here yet"}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                {shouldClientFetch && data.unavailable
                  ? "The newsroom is temporarily unavailable. Please try again in a moment."
                  : `No ${CATEGORY_TABS.find((t) => t.key === category)?.label.toLowerCase() ?? "items"} have been published yet. Check back soon.`}
              </p>
              <button
                type="button"
                onClick={() => changeCategory("all")}
                className="mt-6 cursor-pointer rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                View all items
              </button>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((item) => (
                <PressCard
                  key={item.id}
                  item={item}
                  onOpen={() => setSelected(item)}
                />
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

      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
