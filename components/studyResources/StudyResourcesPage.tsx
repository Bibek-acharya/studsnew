"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import {
  AFFORDABLE_PARAM,
  AFFORDABLE_PARAM_ON,
  isAffordableParamOn,
  isGateOffForItems,
  matchesAffordableFilter,
} from "./affordableFilter";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/** Results per page, unchanged from the previous toolbar-based catalog. */
const PAGE_SIZE = 20;

/**
 * The type-less grid's own heading, kept as the fallback for the render that
 * passes neither a lock nor a `heading`. No route renders that combination
 * today, so the fallback exists only so the grid can be mounted in a test and
 * in a storybook without inventing a page.
 */
const DEFAULT_TITLE = "Past Questions & Resources";
const DEFAULT_DESCRIPTION =
  "Access past exam papers, study notes, model questions, and other useful academic materials.";

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
  /**
   * The page's own heading, for the route that renders the MIXED catalogue —
   * every API-backed type, documents and video lectures together, which is
   * what `?affordable=1` needs behind it (see `app/study-resources/can-unlock`).
   *
   * It exists because the grid had two identities and only one of them was a
   * page. A locked type names itself and links back to the landing; the
   * type-less grid drew an `h2` and no way back, which is why it was never
   * routed. Supplying a heading is what makes this render a landing page: an
   * `h1` of its own and the same "All study resources" link back that every
   * collection has.
   */
  heading?: {
    title: string;
    description: string;
  };
}

export default function StudyResourcesPage({
  lockedType,
  heading,
}: StudyResourcesPageProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  // The one filter this page keeps in the URL rather than in state, so a
  // reload and a shared `?affordable=1` link land in exactly the same view.
  // Read the same way as every other param on this site: `get`, one spelling.
  const searchParams = useSearchParams();
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

  /**
   * The URL owns `?affordable=1`. The panel never holds the state itself, which
   * is what lets the checkbox, Reset and a reload from the insufficient screen's
   * "Browse resources you can unlock now" link all agree.
   *
   * `replace`, not `push`: turning a filter on is not somewhere a student means
   * to be able to go back to, and the clearable path is the checkbox itself.
   * The page number is deliberately NOT reset — the filter narrows what is
   * already fetched, so nothing is re-requested.
   */
  const writeAffordableParam = (next: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set(AFFORDABLE_PARAM, AFFORDABLE_PARAM_ON);
    else params.delete(AFFORDABLE_PARAM);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearchQuery("");
    setCourseFilter("");
    setYearFilter("");
    setPage(1);
    // Reset means every filter, and this one lives in the URL like the rest.
    writeAffordableParam(false);
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

  /**
   * One page, one `h1`.
   *
   * A locked type names itself. The mixed catalogue is named by the route that
   * renders it. Only the render with neither — which no route reaches — keeps
   * the `h2` this grid has always drawn when it was a section rather than a
   * page.
   */
  const CatalogHeading = lockedCategory || heading ? "h1" : "h2";
  const title = heading?.title ?? lockedCategory?.label ?? DEFAULT_TITLE;
  const description =
    heading?.description ?? lockedCategory?.description ?? DEFAULT_DESCRIPTION;
  /**
   * Both page-level renders have somewhere to return to, so both link back the
   * same way. The one that has no page-level identity is the one with no link.
   */
  const backHref = lockedCategory || heading ? "/study-resources" : null;

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

  /**
   * `?affordable=1`, resolved through the same `accessFor` call the cards use —
   * one decision, read twice, never two verdicts on one resource.
   *
   * It narrows the page already fetched rather than asking the server again,
   * which is why it costs nothing and why it composes with search, course, year
   * and pagination instead of replacing them. See `affordableFilter.ts`: it
   * excludes only what is positively known to be unaffordable, so with the gate
   * off — `access` absent everywhere — this is the identity function and the
   * catalogue stays whole.
   */
  const affordableOnly = isAffordableParamOn(
    searchParams.get(AFFORDABLE_PARAM),
  );
  const visibleResources = affordableOnly
    ? resources.filter((resource) => matchesAffordableFilter(accessFor(resource)))
    : resources;

  /**
   * With the gate off the list endpoint sends no `access` block on any item,
   * which is the same signal `useCoinState` returns null for. The toggle hides
   * itself then, the way this panel has no resource-type selector: a control
   * that provably removes nothing is not a control.
   *
   * It is also not drawn BEFORE the request has come back. `isGateOffForItems`
   * answers `false` for a page with no items, because an empty or failed
   * response says nothing about the gate — which is right, and is why the
   * toggle is kept for an empty collection where a course or year filter may
   * have emptied it. It is wrong for the seconds BEFORE any response exists:
   * rendering the control then and withdrawing it the moment an ungated
   * collection arrived is a control offered and taken back, on every cold load
   * of the catalogue, which is the shape the product is in today. So the panel
   * waits for the first answer, and a loading page is not that answer.
   *
   * The cost is one pop-in on a gated collection. The alternative was a
   * pop-out on an ungated one, which is the default state today and the worse of
   * the two: a control that appears and then takes itself back is read as a
   * fault, while one that arrives with the data reads as arriving.
   */
  const affordableAvailable = !loading && !isGateOffForItems(resources);

  // An empty page reports nothing rather than a backwards range like "1-0".
  const showingFrom = visibleResources.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo =
    visibleResources.length === 0
      ? 0
      : Math.min(
          (page - 1) * PAGE_SIZE + visibleResources.length,
          total,
        );

  /**
   * What the tally can honestly claim.
   *
   * The filter narrows the page already fetched, so it can only count that
   * page — and it only ever holds one page at a time. Three sentences, and
   * which one is true depends on how much the page knows:
   *
   *  - **Unfiltered, or filtered to nothing.** The server's own range and its
   *    own total. The empty case keeps the collection's size on purpose: "of 0"
   *    under a collection of 45 is the one thing this filter must never say.
   *  - **Filtered, and the whole collection fits on one page.** The visible
   *    count IS the collection, so the ordinary range is exactly true and is
   *    used unchanged.
   *  - **Filtered, with pages left to walk.** There is no honest range to
   *    print. The three visible cards are not positions 1 to 3 of 45 — they are
   *    the only ones this page was able to check — so the count is reported as
   *    the page's own, and the collection's total is stated beside it as the
   *    separate fact it is. The range is dropped rather than approximated.
   */
  const singlePage = totalPages <= 1;
  const affordableTally =
    affordableOnly && visibleResources.length > 0 && !singlePage;
  const tallyTotal =
    affordableOnly && singlePage && visibleResources.length > 0
      ? visibleResources.length
      : total;

  /**
   * The filter emptied a page that had results. Distinct from the empty result
   * set below, which is the server saying there is nothing here at all, and
   * which keeps its existing copy.
   */
  const filteredOutEverything =
    resources.length > 0 && visibleResources.length === 0;

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
      affordableOnly={affordableOnly}
      affordableAvailable={affordableAvailable}
      onAffordableChange={writeAffordableParam}
      signedIn={Boolean(user)}
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
          {backHref && (
            <Link
              href={backHref}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-blue transition-colors hover:text-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              All study resources
            </Link>
          )}
          <CatalogHeading className="mb-2 text-3xl font-bold text-gray-900">
            {title}
          </CatalogHeading>
          <p className="max-w-2xl text-base text-gray-500">{description}</p>
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
                {loading ? (
                  "Loading resources..."
                ) : affordableTally ? (
                  // Filtered, and there are pages left to walk. Two facts, each
                  // labelled as what it is: what this page could check, and how
                  // big the collection is. No range — see `affordableTally`.
                  <>
                    {visibleResources.length}{" "}
                    <span className="font-bold">
                      {visibleResources.length === 1 ? "Resource" : "Resources"}
                    </span>{" "}
                    you can unlock now
                    <span className="text-gray-500">
                      {" "}
                      · {total} in this collection
                    </span>
                  </>
                ) : (
                  <>
                    Showing {showingFrom}-{showingTo} of {tallyTotal}{" "}
                    <span className="font-bold">Resources</span>
                  </>
                )}
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
              ) : filteredOutEverything ? (
                /*
                  The filter emptied a page that had results, so the empty state
                  is the same treatment as the one above — same ground, same
                  tile, same grey icon — with copy that says what happened and a
                  way back. The page can only be here because every item on it
                  was positively unaffordable, so "nothing here is covered" is
                  what the screen actually established.
                */
                <div className="flex flex-col items-center justify-center px-4 py-20">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
                    <FolderOpen className="h-10 w-10 text-gray-300" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Nothing You Can Unlock Here Yet
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Nothing here is covered by your StudsTokens right now. Clear
                    the filter to browse the whole catalogue.
                  </p>
                  <button
                    type="button"
                    onClick={() => writeAffordableParam(false)}
                    className="mt-6 rounded-md bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                  >
                    Show all resources
                  </button>
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
                    {visibleResources.map((resource) => {
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
