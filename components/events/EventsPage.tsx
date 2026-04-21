"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, Loader2 } from "lucide-react";
import { fetchPublicEvents } from "@/services/eventApi";
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

const mapCategory = (category: string): EventFilter => {
  if (category === "Workshop" || category === "Seminar") return "Seminar & Workshop";
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
  const [activeFilter, setActiveFilter] = useState<EventFilter>("All News");
  const [sortBy, setSortBy] = useState<"Newest First" | "Oldest First" | "Popular">("Newest First");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedEventIds, setBookmarkedEventIds] = useState<Set<string>>(new Set());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const result = await fetchPublicEvents({ limit: 50 });
        setEvents(result.events);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("events-bookmarks");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as string[];
      if (Array.isArray(parsed)) {
        setBookmarkedEventIds(new Set(parsed));
      }
    } catch {
      // Ignore invalid local storage and continue with empty bookmarks.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "events-bookmarks",
      JSON.stringify(Array.from(bookmarkedEventIds)),
    );
  }, [bookmarkedEventIds]);

  const toggleBookmark = (e: React.MouseEvent, id: string | number) => {
    e.preventDefault();
    e.stopPropagation();

    const key = String(id);
    setBookmarkedEventIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const allEvents = events;
  const featured = allEvents[0];

  const visibleEvents = useMemo(() => {
    const filtered =
      activeFilter === "All News"
        ? allEvents
        : allEvents.filter((event) => mapCategory(event.category) === activeFilter);

    return [...filtered].sort((a, b) => {
      if (sortBy === "Newest First") return Number(b.id) - Number(a.id);
      if (sortBy === "Oldest First") return Number(a.id) - Number(b.id);
      return b.interestedCount - a.interestedCount;
    });
  }, [activeFilter, allEvents, sortBy]);

  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(visibleEvents.length / itemsPerPage));
  const paginatedEvents = visibleEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading) {
    return (
      <div className="bg-white text-gray-900 antialiased min-h-screen max-w-350 mx-auto py-8">
        <div className="mx-auto py-8 flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#0000ff] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 antialiased min-h-screen max-w-350 mx-auto py-8">
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
                      ? "bg-brand-blue text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </section>

        {featured && (
          <section className="mb-14">
            <h2 className="text-3xl font-bold mb-4">Featured Story of the Week</h2>
            <Link
              href={`/events/${featured.id}`}
              className="relative rounded-lg overflow-hidden  h-87.5 sm:h-100 group shadow-sm cursor-pointer block"
            >
              <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="text-white max-w-3xl">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                      Featured
                    </span>
                    <span className="flex items-center text-sm text-gray-200 font-medium">
                      <i className="fa-regular fa-clock mr-1.5 opacity-80"></i> 90 days ago
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{featured.title}</h3>
                  <p className="text-gray-200 text-base font-medium line-clamp-2">{featured.excerpt}</p>
                </div>
                <button className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition whitespace-nowrap shadow-sm">
                  Read Full Story
                </button>
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
                  setSortBy(event.target.value as "Newest First" | "Oldest First" | "Popular")
                }
                className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-800 font-semibold outline-none focus:border-blue-500 shadow-sm cursor-pointer"
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
                  className="bg-white rounded-2xl border border-gray-200 hover:border-blue-500/20 overflow-hidden flex flex-col duration-300 cursor-pointer"
                >
                  <div className="h-35 w-full overflow-hidden p-4">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="p-5 flex flex-col grow">
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className={`${badgeClass(mapped)} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}
                      >
                        {mapped}
                      </span>
                      <span className="flex items-center text-xs text-gray-500 font-semibold">
                        <i className="fa-regular fa-calendar mr-1.5"></i> Oct 25 , 2024
                      </span>
                    </div>

                    <Link
                      href={`/events/${event.id}`}
                      className={`font-bold text-lg mb-3 leading-tight text-left text-black hover:text-[#0000ff]`}
                    >
                      {event.title}
                    </Link>

                    <div className="flex items-center text-xs text-gray-600 mb-2 font-semibold">
                      <i className="fa-regular fa-building mr-2 text-gray-500"></i> {event.organizer}
                    </div>
                    <div className="flex items-center text-xs text-gray-600 mb-3 font-semibold">
                      <i className="fa-solid fa-location-dot mr-2 text-gray-500"></i> {event.location}
                    </div>

                    <p className="text-xs text-gray-500 mb-5 line-clamp-3 leading-relaxed font-medium">{event.excerpt}</p>

                    <div className="mt-auto flex gap-2">
                      <Link
                        href={`/events/${event.id}`}
                        className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-bold py-2 rounded-lg hover:bg-gray-50 transition text-center"
                      >
                        Details
                      </Link>
                      <button className={`flex-1 text-white text-sm font-bold py-2 rounded-lg transition bg-brand-blue cursor-pointer hover:bg-blue-600`}>
                        Register Now
                      </button>
                      <button
                        className={`w-10 flex items-center justify-center border rounded-md transition-colors shrink-0 ${
                          isBookmarked
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                        onClick={(e) => toggleBookmark(e, event.id)}
                      >
                        <Bookmark
                          className={`w-4 h-4 transition-all ${
                            isBookmarked ? "text-[#0000ff] fill-[#0000ff]" : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {visibleEvents.length === 0 && (
            <div className="text-center py-10 text-slate-500 bg-white border border-gray-200 rounded-2xl mt-6">
              No events available for this category.
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