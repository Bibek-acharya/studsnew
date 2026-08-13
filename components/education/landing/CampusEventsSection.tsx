"use client";

import type { SyntheticEvent } from "react";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import HoverTooltip from "./HoverTooltip";

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
              Top College Events
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
          {events.map((event, index) => (
            <div
              key={event.id || index}
              className="w-[80vw] xs:w-[70vw] sm:w-[calc(50%-10px)] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 rounded-xl border border-gray-200 bg-white overflow-hidden flex flex-col snap-start transition-shadow duration-300 group cursor-pointer"
              onClick={() => onNavigate("eventDetails", event)}
            >
              {/* Top Banner */}
              <div className={`${badgeClass(mapCategory(event.category))} relative h-17.5 xs:h-20 sm:h-22.5 flex items-center px-4 sm:px-5`}>
                <span className="absolute top-0 right-0 bg-gray-50 text-gray-600 text-[10px] xs:text-[11px] sm:text-[11px] font-semibold tracking-wide px-2 sm:px-3 py-1 sm:py-1.5 uppercase rounded-bl-md border-l border-b border-gray-200">
                  {mapCategory(event.category)}
                </span>
                <h3 className="text-white font-bold text-[13px] xs:text-[14px] sm:text-[15px] md:text-[17px] line-clamp-2">
                  {event.title}
                </h3>
              </div>

              {/* Content Body */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3 sm:gap-4">
                {/* Image & Title */}
                <div className="flex items-center gap-2.5 sm:gap-3 md:gap-3.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-md border border-gray-200 flex items-center justify-center p-1 bg-white shrink-0 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e: SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src =
                          "https://placehold.co/48x48/f1f5f9/94a3b8?text=Event";
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <HoverTooltip label={event.title}>
                      <h4 className="font-bold text-gray-900 text-sm xs:text-base sm:text-base md:text-base leading-tight group-hover:text-[#0000ff] transition-colors line-clamp-2">
                        {event.title}
                      </h4>
                    </HoverTooltip>
                    <HoverTooltip label={event.organizer}>
                      <p className="text-[11px] xs:text-[12px] sm:text-[13px] text-gray-500 mt-0.5 truncate">{event.organizer}</p>
                    </HoverTooltip>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center gap-3 sm:gap-4 text-[11px] xs:text-[12px] sm:text-[13px] text-gray-500 font-medium mt-0.5 sm:mt-1">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-t border-dashed border-gray-200 my-0.5 sm:my-1" />

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-0.5 sm:pt-1">
                  <span className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded text-[10px] xs:text-[11px] sm:text-[12px] font-bold text-white ${badgeClass(mapCategory(event.category))}`}>
                    {mapCategory(event.category)}
                  </span>
                  <span className="text-[#0000ff] font-bold text-[12px] xs:text-[13px] sm:text-[14px] group-hover:text-blue-800 transition-colors">
                    View details
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampusEventsSection;
