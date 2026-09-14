"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin, Calendar, GraduationCap } from "lucide-react";
import { useCoursePageAds, trackAdClick } from "./useCoursePageAds";

const CourseCarouselAd: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { data: ads, isLoading } = useCoursePageAds("carousel");

  if (isLoading || !ads || ads.length === 0) return null;

  const scroll = (direction: number) => {
    carouselRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  };

  const slides = ads.map((ad) => ({
    title: ad.college_name || ad.title,
    subtitle: ad.description || ad.college_location || "",
    rating: ad.college_rating ? `${ad.college_rating}+` : "",
    university: ad.college_name || "",
    degree: "",
    location: ad.college_location || "",
    duration: "",
    logos: ad.college_image ? [{ name: ad.college_name || ad.title, url: ad.college_image }] : [],
    website: ad.college_website || "",
    link: ad.college_id ? `/find-college/${ad.college_id}` : ad.link_url || "#",
    ad,
  }));

  const accent = slides[0]?.ad?.accent || "#0000ff";

  return (
    <div className="bg-[#0000ff] rounded-md p-5" style={{ backgroundColor: accent, boxShadow: `0 10px 30px ${accent}33` }}>
      <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
        <h2 className="text-lg font-extrabold text-white tracking-tight">
          Featured Colleges
        </h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="w-9 h-9 rounded-full bg-white border-none cursor-pointer flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all" style={{ color: accent }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll(1)} className="w-9 h-9 rounded-full bg-white border-none cursor-pointer flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all" style={{ color: accent }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto" ref={carouselRef} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <div className="flex gap-4 pb-3 items-stretch" style={{ scrollSnapType: "x mandatory" }}>
          {slides.map((course, idx) => (
            <a
              key={course.ad?.id || idx}
              href={course.link}
              onClick={() => course.ad && trackAdClick(course.ad.id)}
              className="bg-white rounded-md p-4 min-w-[220px] max-w-[240px] flex-shrink-0 border border-gray-100 flex flex-col no-underline"
              style={{ scrollSnapAlign: "start" }}
            >
              <h3 className="text-[15px] font-bold text-slate-800 mb-1 line-clamp-2" title={course.title}>{course.title}</h3>
              {course.subtitle && (
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mb-2">{course.subtitle}</p>
              )}
              <div className="flex gap-1.5 mb-2">
                {course.rating && (
                  <span className="px-2 py-0.5 rounded-full border border-gray-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{course.rating}
                  </span>
                )}
                {course.university && (
                  <span className="px-2 py-0.5 rounded-full border border-gray-200 text-[11px] font-semibold text-slate-700 max-w-[120px] truncate">{course.university}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-[11px] text-slate-600 font-medium mb-3">
                {course.location && (
                  <div className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 text-slate-400 shrink-0" />{course.location}</div>
                )}
                {course.website && (
                  <div className="col-span-2 flex items-center gap-1 truncate">
                    <a href={course.website.startsWith("http") ? course.website : `https://${course.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate" onClick={(e) => e.stopPropagation()}>
                      {course.website}
                    </a>
                  </div>
                )}
              </div>
              <div className="h-px bg-gray-100 my-2" />
              <div className="mt-auto">
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Available at:</p>
                <div className="flex gap-1 flex-wrap">
                  {course.logos.map((logo, i) => (
                    <div key={i} className="relative w-6 h-6 rounded-md border border-gray-100 p-0.5 flex items-center justify-center bg-white cursor-pointer group">
                      <img src={logo.url} alt={logo.name} className="w-full h-full object-contain rounded opacity-80 hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-800 text-white text-[10px] font-semibold px-2 py-1 rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        {logo.name}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCarouselAd;
