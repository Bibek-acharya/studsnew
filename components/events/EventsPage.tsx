"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, FolderOpen, Loader2 } from "lucide-react";
import { fetchPublicEvents } from "@/services/eventApi";
import { apiService } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import Pagination from "@/components/ui/Pagination";

type EventFilter =
  | "All News"
  | "Feast & Concert"
  | "Seminar & Workshop"
  | "Career Fairs"
  | "Hackthons"
  | "Cultural Programs"
  | "Achievements"
  | "Others";

const filterPills: EventFilter[] = [
  "All News",
  "Feast & Concert",
  "Seminar & Workshop",
  "Career Fairs",
  "Hackthons",
  "Cultural Programs",
  "Achievements",
  "Others",
];

const stripHtml = (html: string) => {
  if (typeof window === "undefined") return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const mapCategory = (category: string): EventFilter => {
  if (category === "Workshop" || category === "Seminar")
    return "Seminar & Workshop";
  if (category === "Job Fair") return "Career Fairs";
  if (category === "Hackathon") return "Hackthons";
  return "Others";
};

const badgeClass = (filter: EventFilter) => {
  if (filter === "Seminar & Workshop") return "bg-[#00c2a8]";
  if (filter === "Career Fairs") return "bg-orange-500";
  if (filter === "Hackthons") return "bg-blue-500";
  return "bg-blue-500";
};

const EventsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState<EventFilter>("All News");
  const [sortBy, setSortBy] = useState<
    "Newest First" | "Oldest First" | "Popular"
  >("Newest First");
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedEventIds, setBookmarkedEventIds] = useState<Set<string>>(
    new Set(),
  );
  const [bookmarkMap, setBookmarkMap] = useState<Record<string, number>>({});
  const [pendingBookmarks, setPendingBookmarks] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    let cancelled = false;
    const loadEvents = async () => {
      setLoading(true);
      setError(null);

      let allEvents: any[] = [];

      try {
        const result = await fetchPublicEvents({ limit: 50 });
        allEvents = result.events || [];
      } catch (err) {
        setError((err as Error).message || "Unable to load events.");
      }

      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const instRes = await fetch(
          `${API_BASE}/api/v1/institutions/public/events?page=1&limit=20`,
        );
        const instData = await instRes.json();
        const instEvents = instData?.data?.events || [];
        allEvents = [
          ...allEvents,
          ...instEvents.map((e: any) => ({
            id: `inst-${e.id}`,
            title: e.name || e.title,
            excerpt: e.short_desc || "",
            description: e.description || "",
            category: e.event_type || e.category || "Event",
            image: e.image_url || "",
            organizer: e.organized_by || "",
            location: e.location || "",
            date: e.start_date
              ? new Date(e.start_date).toLocaleDateString()
              : "",
            time: e.start_date
              ? new Date(e.start_date).toLocaleTimeString()
              : "",
            registrationFee: "",
            interested: 0,
            published: true,
            created_at: e.created_at,
          })),
        ];
      } catch {
        // Institution events fetch failed silently
      }

      if (!cancelled) {
        setEvents(allEvents);
      }

      if (!cancelled) setLoading(false);
    };

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    apiService
      .getBookmarksByType("events")
      .then((items) => {
        if (cancelled) return;
        const ids: Set<string> = new Set();
        const map: Record<string, number> = {};
        items.forEach((b) => {
          ids.add(String(b.item_id));
          map[b.item_id] = b.id;
        });
        setBookmarkedEventIds(ids);
        setBookmarkMap(map);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const toggleBookmark = async (e: React.MouseEvent, id: string | number) => {
    e.preventDefault();
    e.stopPropagation();

    const key = String(id);
    const numId = Number(id);
    if (isNaN(numId)) return;

    if (!isAuthenticated) return;
    if (pendingBookmarks[key]) return;
    setPendingBookmarks((prev) => ({ ...prev, [key]: true }));

    const existingBookmarkId = bookmarkMap[key];
    try {
      if (existingBookmarkId) {
        await apiService.deleteBookmark(existingBookmarkId);
        setBookmarkMap((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        setBookmarkedEventIds((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      } else {
        const res = await apiService.createBookmark(numId, "events");
        if (res.data?.id) {
          setBookmarkMap((prev) => ({ ...prev, [key]: res.data.id }));
          setBookmarkedEventIds((prev) => {
            const next = new Set(prev);
            next.add(key);
            return next;
          });
        }
      }
    } catch {
      // silently fail
    } finally {
      setPendingBookmarks((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const allEvents = events;
  const featured = allEvents[0];

  const visibleEvents = useMemo(() => {
    const filtered =
      activeFilter === "All News"
        ? events
        : events.filter(
            (event) => mapCategory(event.category) === activeFilter,
          );

    return [...filtered].sort((a, b) => {
      if (sortBy === "Newest First") return Number(b.id) - Number(a.id);
      if (sortBy === "Oldest First") return Number(a.id) - Number(b.id);
      return b.interested - a.interested;
    });
  }, [activeFilter, events, sortBy]);

  const itemsPerPage = 12;
  const totalPages = Math.max(
    1,
    Math.ceil(visibleEvents.length / itemsPerPage),
  );
  const paginatedEvents = visibleEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading) {
    return (
      <div className="bg-white text-gray-900 antialiased min-h-screen max-w-350 mx-auto py-8 px-4 sm:px-0">
        <div className="mx-auto py-8 flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#0000ff] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 antialiased min-h-screen max-w-350 mx-auto py-8 px-4 sm:px-0">
      <div className="mx-auto py-8">
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-4">Browse by category</h2>
          <div className="flex flex-wrap gap-2 text-sm font-semibold items-center">
            {filterPills.map((pill) => {
              const isActive = activeFilter === pill;
              return (
                <button
                  key={pill}
                  onClick={() => setActiveFilter(pill)}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors  ${
                    isActive
                      ? "bg-brand-blue text-white "
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </section>

        {loading && (
          <div className="mb-8 text-center text-gray-500">Loading events…</div>
        )}
        {error && <div className="mb-8 text-center text-red-500">{error}</div>}

        {featured && (
          <section className="mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-5">
              Featured Event of the Week
            </h2>
            <Link
              href={`/events/${(featured as any).slug || featured.id}`}
              className="relative w-full h-112.5 sm:h-100 rounded-md overflow-hidden shadow-lg group cursor-pointer block"
            >
              <img
                src={featured.image}
                alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>

              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 w-full">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Featured
                      </span>
                      <div className="flex items-center text-gray-300 text-sm font-medium">
                        <i className="fa-regular fa-clock mr-1.5 opacity-80"></i>
                        {featured.date || "Date TBA"}
                      </div>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight tracking-tight line-clamp-2">
                      {featured.title}
                    </h3>
                    <p className="text-gray-200 text-base sm:text-lg font-medium line-clamp-2 overflow-hidden break-words">
                      {stripHtml(featured.excerpt || "")}
                    </p>
                  </div>

                  <button className="w-full sm:w-auto bg-white text-slate-900 font-semibold px-6 py-3 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 whitespace-nowrap">
                    View Details
                  </button>
                </div>
              </div>
            </Link>
          </section>
        )}

        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold">Latest Events</h2>
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-3 font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value as
                      "Newest First" | "Oldest First" | "Popular",
                  )
                }
                className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-800 font-semibold outline-none focus:border-blue-500  cursor-pointer"
              >
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Popular</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedEvents.map((event) => {
              const mapped = mapCategory(event.category);
              const isBookmarked = bookmarkedEventIds.has(String(event.id));
              return (
                <article
                  key={event.id}
                  className="bg-white border border-gray-100 hover:border-blue-500/20 rounded-md p-5 flex flex-col transition-all duration-300 group cursor-pointer"
                >
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${badgeClass(mapped)}`}
                    >
                      {mapped}
                    </span>
                  </div>

                  <div className="rounded-md overflow-hidden aspect-16/10 mb-5 bg-gray-100 h-30">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>

                  <Link
                    href={`/events/${(event as any).slug || event.id}`}
                    className="font-bold text-lg text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-1"
                    title={event.title}
                  >
                    {event.title}
                  </Link>
                  <p className="text-slate-500 text-sm mb-5 grow line-clamp-2 leading-relaxed overflow-hidden break-words" title={stripHtml(event.excerpt || "")}>
                    {stripHtml(event.excerpt || "")}
                  </p>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm mt-auto">
                    <span className="text-slate-400 flex items-center font-medium">
                      <i className="fa-regular fa-clock mr-1.5"></i>{" "}
                      {event.date || "TBA"}
                    </span>
                    <Link
                      href={`/events/${(event as any).slug || event.id}`}
                      className="text-blue-600 font-semibold flex items-center group-hover:translate-x-1 transition-transform duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {visibleEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <FolderOpen className="w-32 h-32 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-6">
                No events information is currently available.
              </p>
              <Link
                href="/"
                className="bg-[#0000ff] hover:bg-[#0000cc] cursor-pointer text-white font-semibold py-2.5 px-6 rounded-md transition-colors text-sm"
              >
                Explore More
              </Link>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default EventsPage;
