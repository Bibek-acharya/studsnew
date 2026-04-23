"use client";

import type { SyntheticEvent } from "react";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar, Users, Gift, BadgeCheck, Briefcase } from "lucide-react";

interface CampusEventsSectionProps {
  onNavigate: (view: string, data?: { [key: string]: unknown }) => void;
}

const events = [
  {
    closeText: "Entry closes by 10 Mar",
    tag: "Tech Fest",
    title: "KU IT Meet 2026",
    location: "Kathmandu University",
    logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    chips: ["Software Dev", "AI & ML"],
    schedule: "15 Mar, 09:00 AM",
    enrolled: "342 Enrolled",
    bottomPill: "Prize Pool",
    bottomPillClass: "bg-purple-50 text-purple-600",
    icon: <Gift className="w-3.5 h-3.5" />
  },
  {
    closeText: "Entry closes by 20 Mar",
    tag: "Exhibition",
    title: "Locus Tech Festival",
    location: "Pulchowk Campus, IOE",
    logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    chips: ["Hardware", "Robotics"],
    schedule: "22 Mar, 10:00 AM",
    enrolled: "510 Enrolled",
    bottomPill: "Certificate",
    bottomPillClass: "bg-green-50 text-green-600",
    icon: <BadgeCheck className="w-3.5 h-3.5" />
  },
  {
    closeText: "Entry closes by 2 Apr",
    tag: "Competition",
    title: "Deerwalk Appathon",
    location: "DWIT College",
    logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    chips: ["App Development", "UI / UX"],
    schedule: "5 Apr, 08:30 AM",
    enrolled: "215 Enrolled",
    bottomPill: "Internship",
    bottomPillClass: "bg-orange-50 text-orange-600",
    icon: <Briefcase className="w-3.5 h-3.5" />
  },
  {
    closeText: "Entry closes by 10 Apr",
    tag: "Hiring Challenge",
    title: "Islington Innovation",
    location: "Islington College",
    logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    chips: ["Cybersecurity", "Cloud Config"],
    schedule: "12 Apr, 11:00 AM",
    enrolled: "420 Enrolled",
    bottomPill: "Job offer",
    bottomPillClass: "bg-indigo-50 text-indigo-600",
    icon: <Briefcase className="w-3.5 h-3.5" />
  },
];

const CampusEventsSection: React.FC<CampusEventsSectionProps> = ({ onNavigate }) => {
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
              key={index}
              className="w-[80vw] xs:w-[70vw] sm:w-[calc(50%-10px)] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 rounded-md border border-gray-200 bg-white overflow-hidden flex flex-col snap-start transition-shadow duration-300 group cursor-pointer"
              onClick={() => onNavigate("eventDetails", event)}
            >
              {/* Top Banner */}
              <div className="bg-brand-blue relative h-17.5 xs:h-20 sm:h-22.5 flex items-center px-4 sm:px-5">
                <span className="absolute top-0 right-0 bg-gray-50 text-gray-600 text-[10px] xs:text-[11px] sm:text-[11px] font-semibold tracking-wide px-2 sm:px-3 py-1 sm:py-1.5 uppercase rounded-bl-md border-l border-b border-gray-200">
                  {event.tag}
                </span>
                <h3 className="text-white font-bold text-[13px] xs:text-[14px] sm:text-[15px] md:text-[17px]">
                  {event.closeText}
                </h3>
              </div>

              {/* Content Body */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3 sm:gap-4">
                {/* Logo & Title */}
                <div className="flex items-center gap-2.5 sm:gap-3 md:gap-3.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-md border border-gray-200 flex items-center justify-center p-1 bg-white shrink-0">
                    <img
                      src={event.logo}
                      alt={event.location}
                      className="w-full h-full object-contain rounded-md"
                      onError={(e: SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src =
                          "https://placehold.co/48x48/f1f5f9/94a3b8?text=Logo";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm xs:text-base sm:text-base md:text-base leading-tight group-hover:text-[#0000ff] transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-[11px] xs:text-[12px] sm:text-[13px] text-gray-500 mt-0.5">{event.location}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                  {event.chips.map((chip, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-gray-200 text-[10px] xs:text-[11px] sm:text-[12px] text-gray-600 font-medium"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                {/* Details */}
                <div className="flex items-center gap-3 sm:gap-4 text-[11px] xs:text-[12px] sm:text-[13px] text-gray-500 font-medium mt-0.5 sm:mt-1">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {event.schedule}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {event.enrolled}
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-t border-dashed border-gray-200 my-0.5 sm:my-1" />

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-0.5 sm:pt-1">
                  <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded text-[10px] xs:text-[11px] sm:text-[12px] font-bold ${event.bottomPillClass}`}>
                    {event.icon}
                    {event.bottomPill}
                  </div>
                  <a href="#" className="text-[#0000ff] font-bold text-[12px] xs:text-[13px] sm:text-[14px] hover:text-blue-800 transition-colors">
                    View details
                  </a>
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
