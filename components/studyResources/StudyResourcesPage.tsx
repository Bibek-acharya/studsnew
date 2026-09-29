"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  FolderOpen,
  Loader2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  getStudyResourceStreamUrl,
  isVideoStudyResourceType,
  requestStudyResourcePlaybackToken,
  studyResourcesApi,
  StudyResource,
} from "@/services/studyResourcesApi";
import { useAuth } from "@/services/AuthContext";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import StudyResourceFilterPanel from "@/components/studyResources/StudyResourceFilterPanel";
import ResourceCard from "@/components/studyResources/ResourceCard";
import { resolveResourceAccess } from "@/components/coins/useCoinState";
import { coinsApi, type CoinBalance } from "@/services/coinsApi";
import {
  buildStudyResourceFilters,
  getStudyResourceCategoryByApiType,
  type ApiStudyResourceType,
} from "./studyResourceCategories";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/** Results per page, unchanged from the previous toolbar-based catalog. */
const PAGE_SIZE = 20;

/** How long typing settles before a search request goes out. */
const SEARCH_DEBOUNCE_MS = 350;

// Courses and years are no longer hardcoded: courses come from the shared
// course list endpoint (via CourseCombobox) and years are aggregated from
// the list response (data.years + item values).

const searchInputClass =
  "w-full rounded-md border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue";

/** What the login modal is asking for, so its copy names the real action. */
type AccessTarget = {
  resource: StudyResource;
  action: "download" | "watch";
} | null;

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
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Search is autonomous: the input is the source of truth, `searchQuery` is
  // the debounced value the request actually uses.
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [watchingId, setWatchingId] = useState<number | null>(null);
  const [watchError, setWatchError] = useState<string | null>(null);
  const [modalResource, setModalResource] = useState<AccessTarget>(null);
  // Below lg the sidebar column is replaced by a bottom drawer holding the very
  // same filter panel, which is how Find College handles its own filters.
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  // The wallet, read once for the whole grid and tagged with the user it
  // belongs to. See the effect below for why it is tagged rather than bare.
  const [wallet, setWallet] = useState<{
    userId: number | null;
    balance: CoinBalance | null;
  } | null>(null);

  // Settle the typed query before it reaches the API, so a burst of keystrokes
  // costs one request rather than one per character.
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === searchQuery) return;

    const timeoutId = setTimeout(() => {
      setSearchQuery(trimmed);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [searchInput, searchQuery]);

  useEffect(() => {
    // Bumped for every run; a response from a superseded run is discarded, so
    // a slow earlier request can never overwrite a newer result set.
    const controller = new AbortController();
    let active = true;

    const loadResources = async () => {
      setError(null);
      // Keep the current results on screen while a new query is in flight and
      // only show the skeleton for a cold first load.
      setSearching(true);
      try {
        const res = await studyResourcesApi.listStudyResources(
          buildStudyResourceFilters({
            lockedType,
            query: searchQuery,
            course: courseFilter,
            year: yearFilter,
            page,
          }),
          { signal: controller.signal },
        );
        if (!active) return;

        const items = res?.data?.study_resources ?? [];
        setResources(items);
        const responseTotal = res?.data?.total ?? items.length;
        setTotal(responseTotal);
        setTotalPages(Math.max(1, Math.ceil(responseTotal / PAGE_SIZE)));
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
        if (!active || controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : "Failed to load study resources",
        );
        setResources([]);
        setTotal(0);
      } finally {
        if (active) {
          setLoading(false);
          setSearching(false);
        }
      }
    };
    void loadResources();

    return () => {
      active = false;
      controller.abort();
    };
  }, [searchQuery, courseFilter, yearFilter, page, lockedType]);

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

  // One wallet read for the whole grid, and only once a student is signed in.
  //
  // The read is stored against the user it was for rather than in a bare
  // balance, and the balance the cards see is DERIVED from that. Setting state
  // to null on sign-out would be a synchronous setState inside this effect,
  // which cascades a render; deriving it means signing out resolves every card
  // to `anonymous` with no extra render at all, and a stale wallet for a
  // previous user can never be shown to the next one.
  useEffect(() => {
    if (!user) return;
    let active = true;
    // `user.id` is optional on the session type. A session without one is not a
    // wallet we can attribute, so the read is tagged with null and the derived
    // balance stays null: undetermined, never zero.
    const userId = user.id ?? null;
    void coinsApi.getBalance().then((balance) => {
      if (active) setWallet({ userId, balance });
    });
    return () => {
      active = false;
    };
  }, [user]);

  // Null means "no wallet could be read", never a zero balance. Every card
  // falls back to undetermined rather than to "cannot afford" (06 §2.2).
  const balance =
    user && wallet?.userId === (user.id ?? null) ? wallet.balance : null;

  const handleReset = () => {
    setSearchInput("");
    setSearchQuery("");
    setCourseFilter("");
    setYearFilter("");
    setPage(1);
  };

  const handleDownload = (resource: StudyResource) => {
    if (!user) {
      setModalResource({ resource, action: "download" });
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

  /**
   * Playback is gated, so a watch is a two-step handshake: trade the session
   * for a short-lived token bound to this one resource, then open the stream
   * carrying it. A 401 is a normal outcome here, not a failure — the service
   * reports it as `login-required` and the catalog answers it the same way the
   * download button does.
   */
  const handleWatch = async (resource: StudyResource) => {
    if (!user) {
      setModalResource({ resource, action: "watch" });
      setLoginModalOpen(true);
      return;
    }
    setWatchError(null);
    setWatchingId(resource.id);
    // Opened synchronously so the token round-trip does not cost the new tab
    // to the popup blocker; the placeholder is closed again on failure.
    const tab = window.open("", "_blank");
    try {
      const authorization = await requestStudyResourcePlaybackToken(
        resource.id,
      );
      if (authorization.status !== "authorized") {
        if (tab) tab.close();
        setWatchError(authorization.message);
        return;
      }
      const url = getStudyResourceStreamUrl(
        resource.id,
        authorization.token.token,
      );
      if (tab) tab.location.href = url;
      else window.open(url, "_blank", "noopener");
    } catch (err) {
      if (tab) tab.close();
      setWatchError(
        err instanceof Error
          ? err.message
          : "Failed to prepare this lecture for playback",
      );
    } finally {
      setWatchingId(null);
    }
  };

  const CatalogHeading = lockedCategory ? "h1" : "h2";

  /**
   * One call for every card, and the only place access is decided.
   *
   * An item with no `access` block resolves to null, which is the whole
   * inertness mechanism: with the gate off the list endpoint sends nothing, so
   * `ResourceCard` draws no badge, mounts no dialog and renders today's plain
   * Download button.
   */
  const accessFor = (resource: StudyResource) =>
    resolveResourceAccess({
      access: resource.access ?? null,
      balance,
      signedIn: Boolean(user),
      busy: downloadingId === resource.id || watchingId === resource.id,
      isPublished: resource.is_published,
    });

  // An empty page reports nothing rather than a backwards range like "1-0".
  const showingFrom = resources.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo =
    resources.length === 0
      ? 0
      : Math.min((page - 1) * PAGE_SIZE + resources.length, total);

  const filterPanel = (onClose?: () => void) => (
    <StudyResourceFilterPanel
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
          <CatalogHeading className="mb-2 text-3xl font-bold text-gray-900">
            {lockedCategory ? lockedCategory.label : "Past Questions & Resources"}
          </CatalogHeading>
          <p className="max-w-2xl text-base text-gray-500">
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
            {/* Count and search share a row, exactly as CollegeGrid lays them
                out: the tally on the left, search plus the drawer trigger on
                the right. */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 pb-2 sm:flex-row sm:items-center">
              <p
                className="text-base text-gray-900"
                aria-live="polite"
                aria-atomic="true"
              >
                {loading
                  ? "Loading resources..."
                  : `Showing ${showingFrom}-${showingTo} of ${total} `}
                {!loading && <span className="font-bold">Resources</span>}
              </p>

              <div className="flex w-full items-center gap-2 sm:w-95">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="search"
                    placeholder="Search resources, courses..."
                    aria-label="Search study resources"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className={`${searchInputClass} ${
                      searching ? "pr-9" : "pr-4"
                    }`}
                  />
                  {searching && (
                    <Loader2
                      size={15}
                      className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                </div>

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
              {error ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-6 text-center">
                  <p className="font-semibold text-red-700">{error}</p>
                </div>
              ) : loading ? (
                /* Cold first load only: a refetch keeps the current results on
                   screen, the same way CollegeGrid keeps its previous data. */
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex animate-pulse flex-col rounded-md border border-gray-200 bg-white p-4"
                      data-testid="resource-skeleton"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="h-10 w-10 rounded-md bg-gray-200" />
                        <div className="h-5 w-20 rounded bg-gray-100" />
                      </div>
                      <div className="mt-4 h-5 w-3/4 rounded bg-gray-200" />
                      <div className="mt-2.5 space-y-2">
                        <div className="h-3 w-full rounded bg-gray-100" />
                        <div className="h-3 w-2/3 rounded bg-gray-100" />
                      </div>
                      <div className="mt-4 border-b border-gray-200 pb-4">
                        <div className="h-3 w-1/2 rounded bg-gray-100" />
                      </div>
                      <div className="flex items-center justify-between gap-3 pt-4">
                        <div className="h-3 w-20 rounded bg-gray-100" />
                        <div className="h-8 w-24 rounded-md bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : resources.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-20">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
                    <FolderOpen className="h-10 w-10 text-gray-300" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    No Resources Found
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Try changing your search or filters.
                  </p>
                </div>
              ) : (
                <>
                  {watchError && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-6 text-center">
                      <p className="font-semibold text-red-700">{watchError}</p>
                    </div>
                  )}

                  {/* The grid itself. Unchanged: `grid-cols-1 sm:grid-cols-2
                      xl:grid-cols-3` at the same gap. The coin badge lives in
                      the card's own header row, so no column width moves. */}
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                    {resources.map((resource) => {
                      const isVideo = isVideoStudyResourceType(
                        resource.resource_type,
                      );
                      return (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          variant="document"
                          access={accessFor(resource)}
                          onPrimaryAction={() =>
                            isVideo
                              ? void handleWatch(resource)
                              : handleDownload(resource)
                          }
                          onSignIn={() => {
                            setModalResource({
                              resource,
                              action: isVideo ? "watch" : "download",
                            });
                            setLoginModalOpen(true);
                          }}
                        />
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  )}
                </>
              )}
            </section>
          </main>
        </div>
      </div>

      {/*
        The login modal, now on the shared `Modal` shell. The copy is the
        existing copy and the classes are the existing classes — what changed is
        that it now moves focus into itself, traps Tab inside it, closes on
        Escape, and hands focus back to the card button that opened it. Without
        those it declared `aria-modal` and then trapped keyboard users on the
        page behind it (06 §11.1).
      */}
      <Modal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        labelledBy="login-required-title"
        describedBy="login-required-body"
      >
        <h2
          id="login-required-title"
          className="mb-2 text-lg font-semibold text-gray-900"
        >
          Log in to unlock
        </h2>
        <p
          id="login-required-body"
          className="text-sm leading-relaxed text-gray-500"
        >
          {modalResource?.action === "watch"
            ? "Sign in to play this lecture. You can browse the whole collection without an account."
            : "Sign in to download this resource. You can browse the whole catalogue without an account."}
        </p>
        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            onClick={() => setLoginModalOpen(false)}
            className="flex-1 rounded-md bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-200"
          >
            Not now
          </button>
          <button
            type="button"
            data-modal-initial
            onClick={() => {
              setLoginModalOpen(false);
              router.push("/login");
            }}
            className="flex-1 rounded-md bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            Log in
          </button>
        </div>
      </Modal>
    </div>
  );
}
