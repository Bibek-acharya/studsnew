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
import ShareCollegeModal from "@/app/find-college/[id]/ShareCollegeModal";

const EventDetailsPage: React.FC<{ params: Promise<{ slug: string }> }> = ({
  params,
}) => {
  const [id, setId] = useState<string | null>(null);
  const [event, setEvent] = useState<EventEntry | null>(null);
  const [related, setRelated] = useState<EventEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    params.then(async (p) => {
      setId(p.slug);
      try {
        const isProvider = p.slug.startsWith("provider-");
        const isInst = p.slug.startsWith("inst-");
        const slug = isProvider
          ? p.slug.replace("provider-", "")
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
                registrationFee: providerData.registration_fee || "",
                interestedCount: providerData.interested || 0,
                published: true,
                created_at: providerData.created_at,
                registration_deadline: providerData.registration_deadline || "",
                organizer_email: providerData.organizer_email || providerData.contact_email || "",
                organizer_phone: providerData.organizer_phone || providerData.contact_phone || "",
                organizer_website: providerData.organizer_website || "",
                featured: providerData.featured || false,
                end_date: providerData.end_date
                  ? new Date(providerData.end_date).toLocaleDateString()
                  : "",
                end_time: providerData.end_date
                  ? new Date(providerData.end_date).toLocaleTimeString()
                  : "",
                attendees: providerData.interested || 0,
                max_participants: providerData.max_participants || 0,
                online_link: providerData.online_link || "",
                contact_person: providerData.contact_person || "",
                application_link: providerData.application_link || "",
              };
            } else {
              eventData = null;
            }
          } catch {
            eventData = null;
          }
        } else if (isInst) {
          try {
            const instData = await fetchInstitutionEventBySlug(slug).catch(() => null);
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
                registrationFee: instData.registration_fee || "",
                interestedCount: instData.attendees || 0,
                published: true,
                created_at: instData.created_at,
                registration_deadline: instData.registration_deadline || "",
                organizer_email: instData.contact_email || "",
                organizer_phone: instData.contact_person || "",
                organizer_website: "",
                featured: instData.featured || false,
                end_date: instData.end_date
                  ? new Date(instData.end_date).toLocaleDateString()
                  : "",
                end_time: instData.end_date
                  ? new Date(instData.end_date).toLocaleTimeString()
                  : "",
                attendees: instData.attendees || 0,
                max_participants: instData.max_participants || 0,
                online_link: instData.online_link || "",
                contact_person: instData.contact_person || "",
                application_link: instData.application_link || "",
              };
            } else {
              const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
              const res = await fetch(`${API_BASE}/api/v1/institutions/public/events/${slug}`).catch(() => null);
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
                    registrationFee: instData2.registration_fee || "",
                    interestedCount: instData2.attendees || 0,
                    published: true,
                    created_at: instData2.created_at,
                    registration_deadline: instData2.registration_deadline || "",
                    organizer_email: instData2.contact_email || "",
                    organizer_phone: instData2.contact_person || "",
                    organizer_website: "",
                    featured: instData2.featured || false,
                    end_date: instData2.end_date
                      ? new Date(instData2.end_date).toLocaleDateString()
                      : "",
                    end_time: instData2.end_date
                      ? new Date(instData2.end_date).toLocaleTimeString()
                      : "",
                    attendees: instData2.attendees || 0,
                    max_participants: instData2.max_participants || 0,
                    online_link: instData2.online_link || "",
                    contact_person: instData2.contact_person || "",
                    application_link: instData2.application_link || "",
                  };
                } else {
                  eventData = null;
                }
              } else {
                eventData = null;
              }
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
            const raw = json?.data || json;
            eventData = {
              id: String(raw.id ?? raw.event_id),
              title: raw.title || raw.name || "",
              excerpt: raw.excerpt || raw.short_desc || raw.description?.slice(0, 200) || "",
              description: raw.description || "",
              category: raw.category || raw.event_type || "Event",
              image: raw.image || raw.image_url || raw.banner_image || "",
              organizer: raw.organizer || raw.organized_by || "",
              location: raw.location || "",
              date: raw.date || raw.start_date
                ? new Date(raw.date || raw.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "",
              time: raw.time || raw.start_date
                ? new Date(raw.start_date).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
              registrationFee: raw.registrationFee ?? raw.registration_fee ?? "",
              interestedCount: raw.interestedCount ?? raw.interested_count ?? 0,
              published: raw.published ?? raw.status === "published",
              slug: raw.slug,
              created_at: raw.created_at || raw.publish_date || new Date().toISOString(),
              registration_deadline: raw.registration_deadline || "",
              application_link: raw.application_link || "",
              end_date: raw.end_date || "",
              online_link: raw.online_link || "",
            };
          } else {
            eventData = await fetchPublicEventBySlug(slug);
          }
        }
        setEvent(eventData);
        if (typeof window !== "undefined") {
          setShareUrl(window.location.href);
        }

        if (eventData) {
          const eventsResult = await fetchPublicEvents({ limit: 50 });
          const currentCategory = (eventData.category || "").toLowerCase();
          const currentTags = (eventData as any).tags || [];
          const currentTitle = (eventData.title || "").toLowerCase();
          const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
          const relatedEvents = eventsResult.events
            .filter((e) => {
              if (e.id === p.slug) return false;
              if ((e.title || "").toLowerCase() === currentTitle) return false;
              const eCat = (e.category || "").toLowerCase();
              if (currentCategory && eCat === currentCategory) return true;
              if (currentTags.length > 0 && (e as any).tags) {
                const eTags = (e as any).tags.map((t: string) => t.toLowerCase());
                if (currentTags.some((t: string) => eTags.includes(t))) return true;
              }
              return false;
            })
            .map((e) => ({ ...e, excerpt: stripHtml(e.excerpt || "") }))
            .slice(0, 5);
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
    <main className="max-w-350 mx-auto pt-6 pb-10 lg:pb-14 bg-white min-h-screen px-4 sm:px-0">
      <div className="mb-6">
        {event.featured && (
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Featured
            </span>
          </div>
        )}
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          {event.title}
        </h1>
      </div>

      {event.image && (
        <div className="mb-8 rounded-xl overflow-hidden border border-gray-100">
          <img
            src={getImageUrl(event.image)}
            alt={event.title}
            className="w-full h-auto max-h-[450px] object-cover hover:scale-[1.02] transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getImageUrl("");
            }}
          />
        </div>
      )}

      {event.excerpt && (
        <div className="max-w-none bg-blue-50 border-l-[3px] border-blue-500 p-5 md:p-6 rounded-r-xl mb-10">
          <RichText html={event.excerpt} />
        </div>
      )}

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
                      Registration Deadline
                    </h4>
                    <p className="text-xs text-red-500">
                      {event.registration_deadline
                        ? `Closes on ${new Date(event.registration_deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                        : "No deadline specified"}
                    </p>
                  </div>
                </div>

                {event.organizer && (
                  <div className="flex gap-4">
                    <i className="fa-regular fa-building text-blue-600 shrink-0 mt-0.5"></i>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">
                        Organized By
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {event.organizer}
                      </p>
                    </div>
                  </div>
                )}

                {event.application_link && (
                  <div className="flex gap-4">
                    <i className="fa-solid fa-link text-blue-600 shrink-0 mt-0.5"></i>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">
                        Application Link
                      </h4>
                      <a
                        href={event.application_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline break-all"
                      >
                        {event.application_link}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {event.online_link && (
                  <a
                    href={event.online_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors text-sm text-center"
                  >
                    Register Now
                  </a>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${(() => {
                      const now = new Date();
                      now.setHours(9, 0, 0, 0);
                      const endDate = new Date(now.getTime() + 60 * 60 * 1000);
                      const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
                      return `${fmt(now)}/${fmt(endDate)}`;
                    })()}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-md transition-colors text-xs"
                  >
                    <i className="fa-regular fa-calendar"></i> Calendar
                  </a>
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-md transition-colors text-xs"
                  >
                    <i className="fa-solid fa-share-nodes"></i> Share
                  </button>
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
            {(related.length > 0 ? related : [event]).slice(0, 3).map((rel, idx) => {
              const categoryColors: Record<string, string> = {
                Seminar: "bg-[#0f9d86]",
                Workshop: "bg-[#0f9d86]",
                "Job Fair": "bg-amber-400",
                "Career Fair": "bg-amber-400",
                Hackathon: "bg-blue-500",
                Competition: "bg-blue-500",
                Conference: "bg-purple-500",
                Webinar: "bg-cyan-500",
              };
              const relCategory = rel.category || "Event";
              const relBadgeClass =
                categoryColors[relCategory] || "bg-gray-500";

              return (
                <article
                  key={`${rel.id}-${idx}`}
                  className="bg-white rounded-md border border-gray-200 hover:border-blue-500/20 overflow-hidden flex flex-col duration-300 cursor-pointer"
                >
                  <div className="h-35 w-full overflow-hidden p-4">
                    <img
                      src={getImageUrl(rel.image)}
                      alt={rel.title}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getImageUrl("");
                      }}
                    />
                  </div>
                  <div className="p-5 flex flex-col grow">
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className={`${relBadgeClass} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}
                      >
                        {relCategory}
                      </span>
                      <span className="flex items-center text-xs text-gray-500 font-semibold">
                        <i className="fa-regular fa-calendar mr-1.5"></i> {rel.date || "TBA"}
                      </span>
                    </div>

                    <Link
                      href={`/events/${rel.slug || rel.id}`}
                      className="font-bold text-lg mb-3 leading-tight text-left text-black hover:text-[#0000ff] line-clamp-1"
                      title={rel.title}
                    >
                      {rel.title}
                    </Link>

                    <div className="flex items-center text-xs text-gray-600 mb-2 font-semibold min-w-0">
                      <i className="fa-regular fa-building mr-2 text-gray-500 shrink-0"></i>{" "}
                      <span className="truncate" title={rel.organizer}>{rel.organizer}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600 mb-3 font-semibold min-w-0">
                      <i className="fa-solid fa-location-dot mr-2 text-gray-500 shrink-0"></i>{" "}
                      <span className="truncate" title={rel.location}>{rel.location}</span>
                    </div>

                    <p className="text-xs text-gray-500 mb-5 line-clamp-1 leading-relaxed font-medium" title={stripHtml(rel.excerpt || "")}>
                      {stripHtml(rel.excerpt || "")}
                    </p>

                    <div className="mt-auto flex gap-2">
                      <Link
                        href={`/events/${rel.slug || rel.id}`}
                        className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-bold py-2 rounded-md hover:bg-gray-50 transition text-center"
                      >
                        Details
                      </Link>
                      {rel.online_link ? (
                        <a
                          href={rel.online_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-brand-blue text-white text-sm font-bold py-2 rounded-md transition-colors hover:bg-blue-600 text-center"
                        >
                          Register Now
                        </a>
                      ) : (
                        <Link
                          href={`/events/${rel.slug || rel.id}`}
                          className="flex-1 bg-brand-blue text-white text-sm font-bold py-2 rounded-md transition-colors hover:bg-blue-600 text-center"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
           </div>
      </div>
      <ShareCollegeModal
        collegeName="Event"
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
        shareTitle={event?.title || ""}
        shareText={event?.title || ""}
      />
      <style>{`
         .news-content { overflow-wrap: break-word; word-break: normal; hyphens: none; line-break: strict; }
        .news-content a { color: #2563eb !important; text-decoration: underline !important; font-weight: 500 !important; }
        .news-content a:hover { color: #1d4ed8 !important; }
      `}</style>
    </main>
  );
};

export default EventDetailsPage;
