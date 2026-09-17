"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { Bookmark } from "lucide-react";
import {
  useCourseAdCards,
  type CourseAdCard,
  type CourseAdInstitution,
} from "@/services/courseAdApi";

/* ---------------------------------- icons --------------------------------- */

const IconChevronLeft = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const IconChevronRight = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const IconExternalLink = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
);

const IconFolder = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
);

const IconMapPin = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconCalendar = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const resolveImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("/uploads")) {
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${url}`;
  }
  return url;
};

/* ------------------------------ institution logo ------------------------------ */

const InstitutionLogo: React.FC<{ institution: CourseAdInstitution }> = ({
  institution,
}) => {
  const src = resolveImageUrl(institution.image_url);
  const href = institution.website || "#";
  return (
    <div className="relative w-7 h-7 rounded-md border border-[#f1f5f9] p-[3px] flex items-center justify-center bg-white cursor-pointer group/logo">
      {src ? (
        <img
          src={src}
          alt={institution.name}
          className="max-w-full max-h-full object-contain opacity-85 transition-opacity duration-200 group-hover/logo:opacity-100"
        />
      ) : (
        <span className="text-[8px] font-bold text-slate-500">
          {institution.name.slice(0, 2).toUpperCase()}
        </span>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group/popup absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 translate-y-[5px] bg-[#1e293b] text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 opacity-0 invisible group-hover/logo:opacity-100 group-hover/logo:visible group-hover/logo:translate-y-0 transition-all duration-200 ease-out z-50 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-[#3b82f6] pointer-events-auto"
      >
        {institution.name}
        <IconExternalLink className="w-3.5 h-3.5 [&]:stroke-[2.5]" />
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#1e293b] group-hover/popup:border-t-[#3b82f6] transition-colors duration-200" />
      </a>
    </div>
  );
};

/* --------------------------------- card --------------------------------- */

const MultiCollegeCard: React.FC<{ card: CourseAdCard }> = ({ card }) => {
  const { course, institutions } = card;
  const maxRating = useMemo(() => {
    const ratings = institutions
      .map((i) => Number(i.rating) || 0)
      .filter((r) => r > 0);
    return ratings.length ? Math.max(...ratings) : 0;
  }, [institutions]);

  const ratingLabel = maxRating > 0 ? `${maxRating.toFixed(1)}+` : null;
  const affiliation = course.affiliation || "";

  return (
    <div className="bg-white rounded-2xl p-5 min-w-[260px] max-w-[280px] flex-shrink-0 snap-start shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] border border-[#f3f4f6] relative flex flex-col transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.01)]">
      {/* Bookmark button — visual placeholder */}
      <button
        type="button"
        aria-label="Bookmark this course"
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-500/10 text-[#3b82f6] flex items-center justify-center transition-colors duration-200 hover:bg-blue-500/15"
      >
        <Bookmark className="w-4 h-4 [&]:stroke-[2.5]" />
      </button>

      <h3 className="text-[17px] font-bold text-[#1e293b] mb-1 pr-9 leading-snug">
        {course.title}
      </h3>
      <p className="text-[13px] text-[#64748b] leading-[1.4] line-clamp-2 min-h-[36px]">
        {card.subtitle || course.description}
      </p>

      {/* Tags */}
      <div className="flex gap-2 mt-3">
        {ratingLabel && (
          <div className="px-2.5 py-1 rounded-full border border-[#e2e8f0] text-xs font-semibold text-[#334155] flex items-center gap-1">
            <svg className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" viewBox="0 0 24 24" stroke="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {ratingLabel}
          </div>
        )}
        {affiliation && (
          <div className="px-2.5 py-1 rounded-full border border-[#e2e8f0] text-xs font-semibold text-[#334155] max-w-[140px] whitespace-nowrap overflow-hidden text-ellipsis">
            {affiliation}
          </div>
        )}
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-4 text-xs text-[#475569] font-medium">
        {course.level && (
          <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
            <IconFolder className="w-3.5 h-3.5 text-[#94a3b8] flex-shrink-0" />
            {course.level}
          </div>
        )}
        {course.location && (
          <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
            <IconMapPin className="w-3.5 h-3.5 text-[#94a3b8] flex-shrink-0" />
            {course.location}
          </div>
        )}
        {course.duration && (
          <div className="col-span-2 flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
            <IconCalendar className="w-3.5 h-3.5 text-[#94a3b8] flex-shrink-0" />
            {course.duration}
          </div>
        )}
      </div>

      <div className="h-px bg-[#f1f5f9] my-4 w-full" />

      {/* Institution logos */}
      <div className="mt-auto">
        <p className="text-xs font-semibold text-[#64748b] mb-2">
          Available at top colleges:
        </p>
        <div className="flex gap-1 flex-wrap">
          {institutions.map((institution) => (
            <InstitutionLogo key={institution.id} institution={institution} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------- section ------------------------------- */

const SCROLL_AMOUNT = 300;

const MultiCollegeCoursesAd: React.FC = () => {
  const { data: cards, isLoading } = useCourseAdCards("multi_college");
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  const handleScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / SCROLL_AMOUNT);
    if (index >= 0 && index < (cards?.length ?? 0)) {
      setActiveDot(index);
    }
  }, [cards?.length]);

  const scrollToIndex = useCallback((index: number) => {
    carouselRef.current?.scrollTo({
      left: index * SCROLL_AMOUNT,
      behavior: "smooth",
    });
  }, []);

  const scrollCarousel = useCallback((direction: number) => {
    carouselRef.current?.scrollBy({
      left: direction * SCROLL_AMOUNT,
      behavior: "smooth",
    });
  }, []);

  if (isLoading || !cards || cards.length === 0) return null;

  const visibleCards = cards.filter((c) => c.active);

  return (
    <div className="bg-[#0000ff] rounded-3xl p-8 max-w-[960px] w-full mx-auto shadow-[0_10px_30px_rgba(0,0,255,0.2)] relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <h2 className="text-[26px] font-extrabold text-white tracking-[-0.5px]">
          Courses within different colleges
        </h2>
        <div className="flex gap-3">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollCarousel(-1)}
            className="w-11 h-11 rounded-full bg-white text-[#0000ff] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:bg-[#f8fafc] hover:scale-105 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] active:scale-95"
          >
            <IconChevronLeft className="w-5 h-5 [&]:stroke-[2.5]" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollCarousel(1)}
            className="w-11 h-11 rounded-full bg-white text-[#0000ff] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:bg-[#f8fafc] hover:scale-105 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] active:scale-95"
          >
            <IconChevronRight className="w-5 h-5 [&]:stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {visibleCards.map((card) => (
            <MultiCollegeCard key={card.id} card={card} />
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {visibleCards.map((card, index) => (
          <button
            key={card.id}
            type="button"
            aria-label={`Go to card ${index + 1}`}
            onClick={() => scrollToIndex(index)}
            className={`rounded-full cursor-pointer transition-all duration-300 ease-out ${
              index === activeDot
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MultiCollegeCoursesAd;
