"use client";

import type { SyntheticEvent } from "react";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import HoverTooltip from "./HoverTooltip";
import { stripHtml } from "@/services/api";

interface CampusEventsSectionProps {
  onNavigate: (view: string, data?: { [key: string]: unknown }) => void;
  events?: any[];
}

type EventFilter =
  | "Feast & Concert"
  | "Seminar & Workshop"
  | "Career Fairs"
  | "Hackthons"
  | "Cultural Programs"
  | "Achievements"
  | "Others";

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

const CampusEventsSection: React.FC<CampusEventsSectionProps> = ({ onNavigate, events = [] }) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const scrollSlider = (direction: -1 | 1) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const scrollAmount = slider.clientWidth * 0.8;
    slider.scrollBy({
      left: scrollAmount * direction,
      behavior: "smooth",
    });
  };

  return (
<section className="mt-16 sm:mt-20 md:mt-24 w-full px-4 sm:px-6 md:px-8">
  <div className="max-w-350 mx-auto w-full">
        {/* Header Area */}
        <div className="flex items-start justify-between gap-4 mb-4 sm:mb-6 md:mb-12">
          <div className="max-w-3xl">
            <h2 className="text-[24px] xs:text-[28px] sm:text-3xl md:text-[40px] font-bold text-gray-900 tracking-tight mb-1.5 sm:mb-2">
              Top Ongoing Events
            </h2>
            <p className="text-gray-500 text-sm sm:text-base md:text-lg">
              Discover the best hackathons, tech fests, and challenges across Nepal.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => scrollSlider(-1)}
              className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => scrollSlider(1)}
              className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Cards Container */}
        <div
          ref={sliderRef}
          className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory"
        >
          {events.map((event, index) => {
            const mapped = mapCategory(event.category);
            return (
              <div
                key={event.id || index}
                className="w-[80vw] xs:w-[70vw] sm:w-[calc(50%-10px)] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 snap-start"
              >
                <Link
                  href={`/events/${(event as any).slug || event.id}`}
                  className="bg-white rounded-md border border-gray-200 hover:border-blue-500/20 overflow-hidden flex flex-col duration-300 cursor-pointer block h-full"
                >
                  <div className="h-35 w-full overflow-hidden p-4">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e: SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src =
                          "https://placehold.co/400x200/f1f5f9/94a3b8?text=Event";
                      }}
                    />
                  </div>
                  <div className="p-5 flex flex-col grow">
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className={`${badgeClass(mapped)} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}
                      >
                        {mapped}
                      </span>
                      <span className="flex items-center text-xs text-gray-500 font-semibold">
                        <i className="fa-regular fa-calendar mr-1.5"></i> {event.date || "TBA"}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg mb-3 leading-tight text-left text-black hover:text-[#0000ff] line-clamp-1">
                      {event.title}
                    </h3>

                    <div className="flex items-center text-xs text-gray-600 mb-2 font-semibold min-w-0">
                      <i className="fa-regular fa-building mr-2 text-gray-500 shrink-0"></i>{" "}
                      <span className="truncate" title={event.organizer}>{event.organizer}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600 mb-3 font-semibold min-w-0">
                      <i className="fa-solid fa-location-dot mr-2 text-gray-500 shrink-0"></i>{" "}
                      <span className="truncate" title={event.location}>{event.location}</span>
                    </div>

                    <p className="text-xs text-gray-500 mb-5 line-clamp-2 leading-relaxed font-medium">
                      {stripHtml(event.excerpt || "")}
                    </p>

                    <div className="mt-auto">
                      <span className="text-[#0000ff] font-bold text-[13px] group-hover:text-blue-800 transition-colors">
                        View Details
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CampusEventsSection;
