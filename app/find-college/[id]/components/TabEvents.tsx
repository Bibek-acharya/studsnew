"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import EmptyTabState from "./EmptyTabState";

interface TabEventsProps {
  events: any[];
}

const TabEvents: React.FC<TabEventsProps> = ({ events }) => {
  const router = useRouter();
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const categories = useMemo(() => {
    const cats = new Set<string>();
    events.forEach((e) => {
      if (e.tag || e.category) cats.add(e.tag || e.category);
    });
    return Array.from(cats).sort();
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (category !== "all" && (e.tag || e.category) !== category) return false;
      return true;
    });
  }, [events, category]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (events.length === 0) return <EmptyTabState tabName="events" />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Events</h2>
        <p className="mt-1 text-[14px] text-gray-500">Upcoming events and activities.</p>
      </div>

      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => { setCategory("all"); setPage(1); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${category === "all" ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${category === cat ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginated.map((event: any) => {
            const dateStr = event.date ? event.date.split(" | ")[0] : "";
            const location = event.date ? event.date.split(" | ")[1] : "";
            return (
              <div key={event.id || event.title} className="flex items-center gap-4 rounded-md border border-gray-200 bg-white p-4 transition hover:border-blue-500/20">
                <div className="flex h-16 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <i className="fa-regular fa-calendar text-2xl"></i>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {event.slug ? (
                    <button
                      onClick={() => router.push(`/events/${event.slug}`)}
                      className="font-bold text-gray-900 hover:text-brand-blue line-clamp-2 leading-snug text-left cursor-pointer"
                    >
                      {event.title}
                    </button>
                  ) : (
                    <span className="font-bold text-gray-900 line-clamp-2 leading-snug">
                      {event.title}
                    </span>
                  )}
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    {(event.tag || event.category) && (
                      <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        {event.tag || event.category}
                      </span>
                    )}
                    <span className="flex items-center text-xs text-gray-500">
                      <i className="fa-regular fa-calendar mr-1.5"></i> {dateStr}
                    </span>
                    {location && (
                      <span className="flex items-center text-xs text-gray-500">
                        <i className="fa-solid fa-location-dot mr-1.5"></i> {location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyTabState tabName="Events" />
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`h-10 w-10 rounded-md text-sm font-bold transition ${page === idx + 1 ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabEvents;
