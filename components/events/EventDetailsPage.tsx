"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiService, EducationEvent } from "@/services/api";

const EventDetailsPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const [id, setId] = useState<string | null>(null);
  const [event, setEvent] = useState<EducationEvent | null>(null);
  const [related, setRelated] = useState<EducationEvent[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      setLoading(true);
      setNotFound(false);

      try {
        const eventResponse = await apiService.getEducationEventById(Number(id));
        setEvent(eventResponse.data.event);

        const eventsResponse = await apiService.getEducationEvents();
        const relatedEvents = eventsResponse.data.events
          .filter((item) => item.id !== Number(id) && item.category === eventResponse.data.event.category)
          .slice(0, 3);

        setRelated(
          relatedEvents.length > 0
            ? relatedEvents
            : eventsResponse.data.events.filter((item) => item.id !== Number(id)).slice(0, 3),
        );
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

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
        Loading event details...
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-500 font-semibold">
        Event not found.
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 lg:pb-14 bg-white min-h-screen">
      <div className="relative w-full h-62.5 sm:h-75 lg:h-90 rounded-2xl lg:rounded-4xl overflow-hidden shadow-xl mb-10 lg:mb-16">
        <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 lg:p-12">
          <div className="flex flex-wrap items-center gap-3 mb-3 sm:mb-4">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {badgeLabel}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
              <i className="fa-solid fa-star text-[11px]"></i> Featured
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-3 sm:mb-4 max-w-4xl">
            {event.title}
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm lg:text-lg max-w-2xl leading-relaxed hidden sm:block">
            {event.excerpt}
          </p>
        </div>
      </div>

      <div className="lg:flex lg:gap-12 xl:gap-16">
        <div className="lg:w-2/3 space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <i className="fa-regular fa-calendar-check text-blue-600"></i>
              <h2 className="text-xl font-bold text-gray-900">Events Description</h2>
            </div>

            <div className="space-y-4 text-[15px] leading-relaxed text-gray-600 whitespace-pre-line">
              <p>{event.description}</p>
              <p>
                This seminar provides a comprehensive overview of fully funded and partial scholarships available for Nepalese students in Australia, USA, UK, and Europe. We bring together expert counselors, past scholarship winners, and university representatives to guide you through the application process.
              </p>
              <p>
                Don&apos;t miss this opportunity to unlock your academic potential and build a roadmap for your future career without the burden of financial stress.
              </p>
            </div>

            <div className="mt-8 bg-[#f4f7ff] rounded-xl p-6 md:p-8">
              <h3 className="font-bold text-gray-900 mb-6">Key Highlights & Objectives</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <i className="fa-regular fa-circle-check text-blue-600 shrink-0 mt-0.5"></i>
                    <span className="text-sm text-gray-600">
                      The Institute of Engineering (IOE) entrance exam is tough.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <i className="fa-solid fa-users text-blue-600"></i>
              <h2 className="text-xl font-bold text-gray-900">Who Should Attend?</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: "fa-graduation-cap", color: "text-blue-500" },
                { icon: "fa-user-plus", color: "text-emerald-500" },
                { icon: "fa-book-open", color: "text-purple-500" },
                { icon: "fa-display", color: "text-orange-500" },
              ].map((entry, index) => (
                <div
                  key={`${entry.icon}-${index}`}
                  className="bg-gray-50/80 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2"
                >
                  <i className={`fa-solid ${entry.icon} ${entry.color} mb-1`}></i>
                  <h4 className="font-bold text-gray-900 text-sm">Students</h4>
                  <span className="text-xs text-gray-500">+2 & Bachelor&apos;s</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <i className="fa-regular fa-clock text-blue-600"></i>
              <h2 className="text-xl font-bold text-gray-900">Events Schedule</h2>
            </div>

            <div className="flex flex-col border-t border-gray-100 mt-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="py-5 border-b border-gray-100 flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Registration & Welcome Tea</h4>
                    <p className="text-xs text-gray-500">Main Lobby. Collect your information kit and name tag.</p>
                  </div>
                  <div className="bg-[#f0f5ff] text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                    {event.time}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <i className="fa-solid fa-paperclip text-blue-600 -rotate-45"></i>
              <h2 className="text-xl font-bold text-gray-900">Resources</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: "fa-file-lines", title: "Date & Time", meta: "PDF , 2.4 MB", color: "bg-red-50 text-red-500" },
                { icon: "fa-image", title: "Event Poster", meta: "PDF , 2.4 MB", color: "bg-blue-50 text-blue-600" },
              ].map((resource) => (
                <button
                  key={resource.title}
                  className="border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded flex items-center justify-center ${resource.color}`}>
                      <i className={`fa-solid ${resource.icon}`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{resource.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{resource.meta}</p>
                    </div>
                  </div>
                  <span className="text-gray-400 hover:text-gray-600">
                    <i className="fa-solid fa-download"></i>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:w-1/3 mt-12 lg:mt-0">
          <div className="sticky top-8">
            <div className="mb-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-gray-900">Events Details</h2>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded">
                  {event.registrationFee === "Free" ? "Free Entry" : "Paid Entry"}
                </span>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <i className="fa-regular fa-clock text-blue-600 shrink-0 mt-0.5"></i>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Date & Time</h4>
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
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Venue</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{event.location}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <i className="fa-regular fa-calendar-xmark text-blue-600 shrink-0 mt-0.5"></i>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Venue</h4>
                    <p className="text-xs text-red-500">Closes on oct 24,2025</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg overflow-hidden h-32 relative border border-gray-100 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Map Placeholder"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm shadow-sm">
                  Register Now
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors text-xs shadow-sm">
                    <i className="fa-regular fa-calendar"></i> Calendar
                  </button>
                  <button className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors text-xs shadow-sm">
                    <i className="fa-solid fa-share-nodes"></i> Share
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Organized By</h2>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden shrink-0">
                  <div className="w-6 h-6 border-2 border-orange-500 rotate-45"></div>
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{event.organizer}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <i className="fa-regular fa-envelope"></i>
                  </div>
                  <a href="mailto:info@gmail.com" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                    info@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <a href="tel:+977987654321" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                    +977-987654321
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <i className="fa-solid fa-globe"></i>
                  </div>
                  <a href="http://www.studsphere.com" target="_blank" rel="noreferrer" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
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
          <Link href="/events" className="text-blue-600 text-sm font-medium hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(related.length > 0 ? related : [event]).slice(0, 3).map((rel, idx) => {
            const relBadge =
              idx % 3 === 0
                ? { label: "Seminars & Workshops", className: "bg-[#0f9d86]" }
                : idx % 3 === 1
                  ? { label: "Career Fairs", className: "bg-amber-400" }
                  : { label: "Competitions", className: "bg-blue-500" };

            return (
              <article
                key={`${rel.id}-${idx}`}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img src={rel.image} alt={rel.title} className="w-full h-44 object-cover" />
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className={`${relBadge.className} text-white text-[11px] px-2.5 py-1 rounded-full font-medium tracking-wide`}>
                      {relBadge.label}
                    </span>
                    <div className="flex items-center text-gray-500 text-[12px] font-medium gap-1.5">
                      <i className="fa-regular fa-calendar"></i> Oct 25 , 2024
                    </div>
                  </div>

                  <h3 className={`text-[17px] font-bold mb-3 leading-snug ${idx === 0 ? "text-blue-600" : "text-gray-900"}`}>
                    {rel.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-700 text-[13px] font-medium gap-2">
                      <i className="fa-regular fa-building text-gray-400"></i> {rel.organizer}
                    </div>
                    <div className="flex items-center text-gray-700 text-[13px] font-medium gap-2">
                      <i className="fa-solid fa-location-dot text-gray-400"></i> {rel.location}
                    </div>
                  </div>

                  <p className="text-gray-500 text-[13px] leading-relaxed mb-5 line-clamp-3">{rel.excerpt}</p>

                  <div className="border-t border-dashed border-gray-200 mb-4"></div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/events/${rel.id}`}
                      className="flex-1 border border-gray-200 text-gray-700 text-[13px] font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-center"
                    >
                      Details
                    </Link>
                    <button
                      className={`flex-[1.5] text-white text-[13px] font-semibold py-2.5 rounded-lg transition-colors ${
                        idx === 1 ? "bg-[#1a233a] hover:bg-gray-900" : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      Register Now
                    </button>
                    <button className="border border-gray-200 p-2.5 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors group">
                      <i className="fa-regular fa-heart w-4 h-4 group-hover:text-red-500 transition-colors"></i>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default EventDetailsPage;
