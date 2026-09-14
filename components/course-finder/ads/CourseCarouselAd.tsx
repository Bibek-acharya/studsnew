"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";
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
    location: ad.college_location || "",
    rating: ad.college_rating || 0,
    image: ad.college_image || "",
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
          {slides.map((slide, idx) => (
            <a
              key={slide.ad?.id || idx}
              href={slide.link}
              onClick={() => slide.ad && trackAdClick(slide.ad.id)}
              className="bg-white rounded-lg overflow-hidden min-w-[220px] max-w-[240px] w-[220px] flex-shrink-0 border border-gray-100 flex flex-col no-underline"
              style={{ scrollSnapAlign: "start" }}
            >
              {slide.image ? (
                <div className="w-full h-[120px] bg-gray-100 overflow-hidden">
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-[120px] flex items-center justify-center p-4" style={{ backgroundColor: accent }}>
                  <h3 className="text-white text-[13px] font-bold text-center leading-tight line-clamp-2" title={slide.title}>{slide.title}</h3>
                </div>
              )}
              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-[14px] font-bold text-slate-800 mb-1.5 leading-tight line-clamp-2" title={slide.title}>{slide.title}</h3>
                <div className="flex items-center gap-2 mb-2 text-[11px] text-slate-600 flex-wrap">
                  {slide.rating > 0 && (
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{slide.rating}
                    </span>
                  )}
                  {slide.location && (
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />{slide.location}
                    </span>
                  )}
                </div>
                {slide.website && (
                  <a
                    href={slide.website.startsWith("http") ? slide.website : `https://${slide.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 hover:underline truncate mb-2 block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {slide.website}
                  </a>
                )}
                <div className="mt-auto">
                  <span className="block text-center text-[11px] font-semibold text-white bg-blue-600 rounded py-1.5 px-3">
                    View Details
                  </span>
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
