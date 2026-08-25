"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiService } from "@/services/api";
import EmptyTabState from "@/app/find-college/[id]/components/EmptyTabState";

interface EventsTabProps {
  universityId: number;
}

const mapEventCategory = (category: string): string => {
  if (category === "Workshop" || category === "Seminar")
    return "Seminar & Workshop";
  if (category === "Job Fair") return "Career Fairs";
  if (category === "Hackathon") return "Hackthons";
  return "Others";
};

const eventBadgeClass = (category: string) => {
  if (category === "Seminar & Workshop") return "bg-[#00c2a8]";
  if (category === "Career Fairs") return "bg-orange-500";
  if (category === "Hackthons") return "bg-blue-500";
  return "bg-blue-500";
};

export default function EventsTab({ universityId }: EventsTabProps) {
  const [uniEvents, setUniEvents] = useState<any[]>([]);
  const [uniEventsLoading, setUniEventsLoading] = useState(false);
  const [eventCategory, setEventCategory] = useState("all");

  useEffect(() => {
    if (!universityId) return;
    (async () => {
      setUniEventsLoading(true);
      try {
        const params: any = { page: 1, limit: 50 };
        if (eventCategory !== "all") params.category = eventCategory;
        const res = await apiService.getUniversityEvents(universityId, params);
        const list = res?.data?.events || res?.events || [];
        setUniEvents(list);
      } catch {
        setUniEvents([]);
      } finally {
        setUniEventsLoading(false);
      }
    })();
  }, [universityId, eventCategory]);

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Events</h2>
        <p className="mt-1 text-[14px] text-gray-500">Upcoming events and activities.</p>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "Seminar & Workshop", "Career Fairs", "Hackthons", "Others"].map((cat) => (
          <button
            key={cat}
            onClick={() => setEventCategory(cat)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${eventCategory === cat ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>
      {uniEventsLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : uniEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uniEvents.map((event: any) => {
            const mapped = mapEventCategory(event.category);
            const dateStr = event.date ? new Date(event.date) : null;
            const formattedDate = dateStr && !isNaN(dateStr.getTime())
              ? dateStr.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : event.date || "";
            return (
              <div key={event.id} className="flex items-center gap-4 rounded-md border border-gray-200 bg-white p-4 transition hover:border-blue-500/20">
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
                  <Link
                    href={`/events/${event.slug || event.id}`}
                    className="font-bold text-gray-900 hover:text-brand-blue line-clamp-2 leading-snug cursor-pointer"
                  >
                    {event.title}
                  </Link>
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    <span className={`${eventBadgeClass(mapped)} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}>
                      {mapped}
                    </span>
                    <span className="flex items-center text-xs text-gray-500">
                      <i className="fa-regular fa-calendar mr-1.5"></i> {formattedDate}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyTabState tabName="Events" />
      )}
    </div>
  );
}
