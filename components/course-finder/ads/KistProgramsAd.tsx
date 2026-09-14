"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, Building2, GraduationCap, CreditCard } from "lucide-react";
import { useCoursePageAds, trackAdClick } from "./useCoursePageAds";

const FALLBACK_PROGRAMS = [
  { title: "BIT in KIST College", level: "Bachelor", duration: "4 Years", affiliation: "Purbanchal Univ", field: "IT", estFee: "-", accent: "#ebfbf1", link: "#", ad: undefined as undefined },
  { title: "BCA in KIST College", level: "Bachelor", duration: "4 Years", affiliation: "Purbanchal Univ", field: "CS", estFee: "-", accent: "#ebfbf1", link: "#", ad: undefined as undefined },
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
    level: ad.course_level || "Bachelor",
    duration: ad.course_duration || "4 Years",
    affiliation: ad.college_name || "-",
    field: ad.course_field || "-",
    estFee: "-",
    accent: ad.accent || "#ebfbf1",
    link: ad.course_id ? `/course-finder/${ad.course_id}` : ad.link_url || "#",
    ad,
  }));

  const accent = programs[0]?.accent || "#ebfbf1";

  return (
    <div className="w-full border rounded-[20px] p-5" style={{ backgroundColor: accent, borderColor: `${accent}cc` }}>
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
        <div className="flex gap-4 pb-2 items-stretch">
          {programs.map((program, idx) => (
            <a
              key={program.ad?.id || idx}
              href={program.link}
              onClick={() => program.ad && trackAdClick(program.ad.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[290px] flex-shrink-0 bg-white rounded-xl border border-gray-200 p-4 snap-center flex flex-col no-underline"
            >
              {/* Blue gradient header matching CourseCard style */}
              <div className="relative mb-3 flex h-[80px] flex-col items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#1126ef] to-[#0014FF] p-4 text-center">
                <div className="absolute -mr-6 -mt-6 right-0 top-0 h-20 w-20 rounded-full bg-white opacity-5 blur-xl" />
                <h2 className="relative z-10 text-[0.9rem] font-bold leading-tight text-white line-clamp-2" title={program.title}>{program.title}</h2>
              </div>

              {/* Level badge + duration */}
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="bg-[#FDE8EE] text-[#D11D5A] rounded-md px-3 py-1 text-[0.65rem] font-bold tracking-wider truncate max-w-[65%]">
                  {(program.level || "BACHELOR").toUpperCase()}
                </span>
                <div className="flex shrink-0 items-center text-[11px] font-medium text-gray-500">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  <span>{program.duration}</span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-3">
                <ProgramDetail icon={Building2} label="Affiliation" value={program.affiliation} />
                <ProgramDetail icon={GraduationCap} label="Field" value={program.field} />
                <ProgramDetail icon={CreditCard} label="Est. Fee" value={program.estFee} highlight />
              </div>

              <div className="border-t border-dashed border-gray-300 my-2" />

              <div className="mt-auto pt-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sponsored</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

function ProgramDetail({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center overflow-hidden whitespace-nowrap">
      <div className="flex w-5 shrink-0 justify-center">
        <Icon className="h-3.5 w-3.5 text-gray-400" />
      </div>
      <div className="min-w-0 overflow-hidden text-[0.75rem]">
        <span className="font-semibold text-gray-800">{label}:</span>{" "}
        <span title={value} className={`truncate ${highlight ? "font-bold text-[#0014FF]" : "text-gray-500"}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

export default KistProgramsAd;
