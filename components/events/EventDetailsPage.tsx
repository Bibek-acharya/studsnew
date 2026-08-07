"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  fetchPublicEventById,
  fetchPublicEventBySlug,
  fetchPublicEvents,
  EventEntry,
} from "@/services/eventApi";
import { getPublicEventBySlug } from "@/services/scholarshipProviderApi";
import { fetchInstitutionEventBySlug } from "@/services/institutionEventsApi";
import { getImageUrl, stripHtml } from "@/services/api";
import RichText from "@/components/RichText";

const EventDetailsPage: React.FC<{ params: Promise<{ slug: string }> }> = ({
  params,
}) => {
  const [id, setId] = useState<string | null>(null);
  const [event, setEvent] = useState<EventEntry | null>(null);
  const [related, setRelated] = useState<EventEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(async (p) => {
      setId(p.slug);
      try {
        const isProvider = p.slug.startsWith("provider-");
        const isInst = p.slug.startsWith("inst-");
        const slug = isProvider
          ? p.slug.replace("provider-", "")
          : isInst
            ? p.slug.replace("inst-", "")
            : p.slug;

        let eventData: EventEntry | null;
        if (isProvider) {
          try {
            const providerData = await getPublicEventBySlug(slug);
            if (providerData) {
              eventData = {
                id: `provider-${providerData.id}`,
                title: providerData.name,
                excerpt: providerData.short_desc || "",
                description: providerData.description || "",
                category:
                  providerData.category || providerData.event_type || "Event",
                image: providerData.image_url || "",
                organizer: providerData.organized_by || "",
                location: providerData.location || "",
                date: providerData.start_date
                  ? new Date(providerData.start_date).toLocaleDateString()
                  : "",
                time: providerData.start_date
                  ? new Date(providerData.start_date).toLocaleTimeString()
                  : "",
                registrationFee: "",
                interestedCount: 0,
                published: true,
                created_at: providerData.created_at,
              };
            } else {
              eventData = null;
            }
          } catch {
            eventData = null;
          }
        } else if (isInst) {
          try {
            const instData = await fetchInstitutionEventBySlug(slug);
            if (instData) {
              eventData = {
                id: `inst-${instData.id}`,
                title: instData.name,
                excerpt: instData.short_desc || "",
                description: instData.description || "",
                category: instData.event_type || instData.category || "Event",
                image: instData.image_url || "",
                organizer: instData.organized_by || "",
                location: instData.location || "",
                date: instData.start_date
                  ? new Date(instData.start_date).toLocaleDateString()
                  : "",
                time: instData.start_date
                  ? new Date(instData.start_date).toLocaleTimeString()
                  : "",
                registrationFee: "",
                interestedCount: 0,
                published: true,
                created_at: instData.created_at,
              };
            } else if (/^\d+$/.test(slug)) {
              const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
              const res = await fetch(`${API_BASE}/api/v1/institution/events/${slug}`).catch(() => null);
              if (res && res.ok) {
                const json = await res.json();
                const instData2 = json?.data || json;
                if (instData2) {
                  eventData = {
                    id: `inst-${instData2.id}`,
                    title: instData2.name,
                    excerpt: instData2.short_desc || "",
                    description: instData2.description || "",
                    category: instData2.event_type || instData2.category || "Event",
                    image: instData2.image_url || "",
                    organizer: instData2.organized_by || "",
                    location: instData2.location || "",
                    date: instData2.start_date
                      ? new Date(instData2.start_date).toLocaleDateString()
                      : "",
                    time: instData2.start_date
                      ? new Date(instData2.start_date).toLocaleTimeString()
                      : "",
                    registrationFee: "",
                    interestedCount: 0,
                    published: true,
                    created_at: instData2.created_at,
                  };
                } else {
                  eventData = null;
                }
              } else {
                eventData = null;
              }
            } else {
              eventData = null;
            }
          } catch {
            eventData = null;
          }
        } else {
          if (/^\d+$/.test(slug)) {
            const API_BASE =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            const res = await fetch(
              `${API_BASE}/api/v1/education/events/${slug}`,
            );
            const json = await res.json();
            eventData = json?.data || json;
          } else {
            eventData = await fetchPublicEventBySlug(slug);
          }
        }
        setEvent(eventData);

        if (eventData) {
          const eventsResult = await fetchPublicEvents({ limit: 10 });
          const relatedEvents = eventsResult.events
            .filter((e) => e.id !== p.slug && e.category === eventData.category)
            .slice(0, 3);
          setRelated(relatedEvents);
        }
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const badgeLabel = useMemo(() => {
    if (!event) return "Seminar";
    if (event.category === "Job Fair") return "Career Fairs";
    if (event.category === "Hackathon") return "Competitions";
    return event.category;
  }, [event]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-500 font-semibold">
        Loading...
      </div>
    );
  }

  if (!event || !id) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-500 font-semibold">
        Event not found.
      </div>
    );
  }

  return (
    <main className="max-w-350 mx-auto pt-6 pb-10 lg:pb-14 bg-white min-h-screen px-4 sm:px-6">
      <div className="relative w-full h-62.5 sm:h-75 lg:h-90 rounded-md lg:rounded-md overflow-hidden shadow-xl mb-10 lg:mb-16 bg-gray-100">
        <img
          src={getImageUrl(event.image)}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getImageUrl("");
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 lg:p-12">
          <div className="flex flex-wrap items-center gap-3 mb-3 sm:mb-4">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ">
              {badgeLabel}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
              <i className="fa-solid fa-star text-[11px]"></i> Featured
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-3 sm:mb-4 max-w-4xl">
            {event.title}
          </h1>
          <div className="hidden sm:block max-w-2xl news-content prose prose-invert prose-sm max-w-none prose-p:text-gray-200 prose-a:text-blue-300">
            <RichText html={event.excerpt} variant="sm" />
          </div>
        </div>
      </div>

      <div className="lg:flex lg:gap-12 xl:gap-16">
        <div className="lg:w-2/3 space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <i className="fa-regular fa-calendar-check text-blue-600"></i>
              <h2 className="text-xl font-bold text-gray-900">
                Events Description
              </h2>
            </div>

            <RichText
              html={event.description || ""}
              className="news-content prose prose-slate max-w-none break-words overflow-hidden prose-img:max-w-full prose-img:h-auto prose-img:rounded-xl prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap prose-table:block prose-table:overflow-x-auto prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
            />
          </section>
        </div>

        <div className="lg:w-1/3 mt-12 lg:mt-0">
          <div className="sticky top-8">
            <div className="mb-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-gray-900">
                  Events Details
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <i className="fa-regular fa-clock text-blue-600 shrink-0 mt-0.5"></i>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">
                      Date & Time
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {event.date}
                      <br />
                      {event.time}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <i className="fa-solid fa-location-dot text-blue-600 shrink-0 mt-0.5"></i>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">
                      Venue
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <i className="fa-regular fa-calendar-xmark text-blue-600 shrink-0 mt-0.5"></i>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">
                      Venue
                    </h4>
                    <p className="text-xs text-red-500">
                      Closes on oct 24,2025
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors text-sm ">
                  Register Now
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-md transition-colors text-xs ">
                    <i className="fa-regular fa-calendar"></i> Calendar
                  </button>
                  <button className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-md transition-colors text-xs ">
                    <i className="fa-solid fa-share-nodes"></i> Share
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Organized By
              </h2>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden shrink-0">
                  <div className="w-6 h-6 border-2 border-orange-500 rotate-45"></div>
                </div>
                <h3 className="font-bold text-gray-900 text-sm">
                  {event.organizer}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <i className="fa-regular fa-envelope"></i>
                  </div>
                  <a
                    href="mailto:info@gmail.com"
                    className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                  >
                    info@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <a
                    href="tel:+977987654321"
                    className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                  >
                    +977-987654321
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <i className="fa-solid fa-globe"></i>
                  </div>
                  <a
                    href="http://www.studsphere.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                  >
                    www.studsphere.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 lg:mt-24 border-t border-gray-100 pt-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Similar Events</h2>
          <Link
            href="/events"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(related.length > 0 ? related : [event])
            .slice(0, 3)
            .map((rel, idx) => {
              const relBadge =
                idx % 3 === 0
                  ? { label: "Seminars & Workshops", className: "bg-[#0f9d86]" }
                  : idx % 3 === 1
                    ? { label: "Career Fairs", className: "bg-amber-400" }
                    : { label: "Competitions", className: "bg-blue-500" };

              return (
                <article
                  key={`${rel.id}-${idx}`}
                  className="bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={getImageUrl(rel.image)}
                    alt={rel.title}
                    className="w-full h-44 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getImageUrl("");
                    }}
                  />
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className={`${relBadge.className} text-white text-[11px] px-2.5 py-1 rounded-full font-medium tracking-wide`}
                      >
                        {relBadge.label}
                      </span>
                      <div className="flex items-center text-gray-500 text-[12px] font-medium gap-1.5">
                        <i className="fa-regular fa-calendar"></i> Oct 25 , 2024
                      </div>
                    </div>

                    <h3
                      className={`text-[17px] font-bold mb-3 leading-snug ${idx === 0 ? "text-blue-600" : "text-gray-900"}`}
                    >
                      {rel.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-700 text-[13px] font-medium gap-2">
                        <i className="fa-regular fa-building text-gray-400"></i>{" "}
                        {rel.organizer}
                      </div>
                      <div className="flex items-center text-gray-700 text-[13px] font-medium gap-2">
                        <i className="fa-solid fa-location-dot text-gray-400"></i>{" "}
                        {rel.location}
                      </div>
                    </div>

                    <RichText
                      html={rel.excerpt}
                      variant="sm"
                      as="p"
                      className="text-gray-500 text-[13px] leading-relaxed mb-5 line-clamp-3 news-content"
                    />

                    <div className="border-t border-dashed border-gray-200 mb-4"></div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/events/${(rel as any).slug || rel.id}`}
                        className="flex-1 border border-gray-200 text-gray-700 text-[13px] font-semibold py-2.5 rounded-md hover:bg-gray-50 transition-colors text-center"
                      >
                        Details
                      </Link>
                      <button
                        className={`flex-[1.5] text-white text-[13px] font-semibold py-2.5 rounded-md transition-colors ${
                          idx === 1
                            ? "bg-[#1a233a] hover:bg-gray-900"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        Register Now
                      </button>
                      <button className="border border-gray-200 p-2.5 rounded-md hover:bg-gray-50 text-gray-600 transition-colors group">
                        <i className="fa-regular fa-heart w-4 h-4 group-hover:text-red-500 transition-colors"></i>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
      <style>{`
         .news-content { overflow-wrap: break-word; word-break: normal; hyphens: none; line-break: strict; }
        .news-content a { color: #2563eb !important; text-decoration: underline !important; font-weight: 500 !important; }
        .news-content a:hover { color: #1d4ed8 !important; }
      `}</style>
    </main>
  );
};

export default EventDetailsPage;
