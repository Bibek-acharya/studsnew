"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin, Calendar } from "lucide-react";
import { useCoursePageAds, trackAdClick } from "./useCoursePageAds";

const FALLBACK_PROGRAMS = [
  { title: "BIT in KIST College", subtitle: "Best college for the IT enthusiasts", rating: "4.8/5", university: "Purbanchal Univ", duration: "4 Years (8 Sem)", location: "Kamalpokhari", logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg" },
  { title: "BCA in KIST College", subtitle: "Top choice for future developers", rating: "4.7/5", university: "Purbanchal Univ", duration: "4 Years (8 Sem)", location: "Kamalpokhari", logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg" },
];

const KistProgramsAd: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { data: ads, isLoading } = useCoursePageAds("panel");

  if (isLoading || !ads || ads.length === 0) return null;

  const scroll = (direction: number) => {
    carouselRef.current?.scrollBy({ left: direction * 306, behavior: "smooth" });
  };

  const programs = ads.map((ad) => ({
    title: ad.course_title || ad.title,
    subtitle: ad.description || "Featured program",
    rating: ad.college_rating ? `${ad.college_rating}/5` : "4.8/5",
    university: ad.college_name || "Top partners",
    duration: ad.course_duration || "4 Years (8 Sem)",
    location: ad.college_location || "Kathmandu",
    logo: ad.college_image || ad.image_url,
    accent: ad.accent || "#ebfbf1",
    ad,
  }));

  return (
    <div className="w-full border rounded-[20px] p-5" style={{ backgroundColor: programs[0]?.accent || "#ebfbf1", borderColor: `${programs[0]?.accent || "#ebfbf1"}cc` }}>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-lg md:text-[22px] font-bold text-green-900 tracking-tight leading-snug">
            Best Programs
          </h2>
          <p className="text-[13px] text-green-700 font-medium">
            Explore top-rated programs from leading institutions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => scroll(1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto snap-x snap-mandatory" ref={carouselRef} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <div className="flex gap-4 pb-2">
          {programs.map((program, idx) => (
            <a
              key={program.ad?.id || idx}
              href={program.ad?.link_url || "#"}
              onClick={() => program.ad && trackAdClick(program.ad.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[290px] flex-shrink-0 bg-white rounded-[16px] border border-gray-100 p-4 snap-center flex flex-col justify-between no-underline"
            >
              <div>
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div>
                    <h3 className="text-[17px] font-bold text-gray-900 leading-tight tracking-tight mb-0.5">{program.title}</h3>
                    <p className="text-[12px] font-normal text-slate-500">{program.subtitle}</p>
                  </div>
                  {program.logo && (
                    <div className="w-10 h-auto flex items-center justify-center flex-shrink-0 bg-white rounded-[6px] p-1 border border-gray-100">
                      <img src={program.logo} alt="Logo" className="w-full object-contain rounded-[4px]" />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[11px] font-medium text-slate-700">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{program.rating}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[11px] font-medium text-slate-700">{program.university}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[12px] text-slate-600 mb-3">
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /><span className="whitespace-nowrap">{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" /><span className="truncate">{program.location}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sponsored</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KistProgramsAd;
