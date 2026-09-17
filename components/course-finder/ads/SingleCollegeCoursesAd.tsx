"use client";

import React, { useCallback, useRef, useState } from "react";
import {
  useCourseAdCards,
  type CourseAdCard,
  type CourseAdMou,
} from "@/services/courseAdApi";

/* ---------------------------------- icons --------------------------------- */

const IconStarSolid = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const IconBriefcase = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const IconMapPin = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const resolveImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("/uploads")) {
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${url}`;
  }
  return url;
};

/* ------------------------------- MOU logo box ------------------------------ */

const MouCompanyBox: React.FC<{ mou: CourseAdMou }> = ({ mou }) => {
  const src = resolveImageUrl(mou.logo_url);
  const tooltip = (
    <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 opacity-0 group-hover/mou:opacity-100 group-hover/mou:-translate-y-0.5 transition-all duration-200 flex flex-col items-center pointer-events-none z-50">
      <div className="bg-gray-800 text-white text-[10px] font-medium px-2 py-0.5 rounded-[4px] whitespace-nowrap shadow-sm">
        {mou.name}
      </div>
      <div className="w-1.5 h-1.5 bg-gray-800 transform rotate-45 -mt-[3px]" />
    </div>
  );

  const inner = (
    <>
      {src ? (
        <img
          src={src}
          alt={mou.name}
          className="w-full h-full object-contain p-1"
        />
      ) : (
        <span className="font-bold text-[9px] text-gray-700">
          {mou.name.slice(0, 2).toUpperCase()}
        </span>
      )}
      {tooltip}
    </>
  );

  const boxClasses =
    "group/mou relative flex-shrink-0 w-8 h-[28px] rounded-[4px] border border-gray-200 flex items-center justify-center cursor-pointer bg-white";

  if (mou.company_url) {
    return (
      <a href={mou.company_url} target="_blank" rel="noopener noreferrer" className={boxClasses}>
        {inner}
      </a>
    );
  }
  return <div className={boxClasses}>{inner}</div>;
};

/* --------------------------------- card --------------------------------- */

const SingleCollegeCard: React.FC<{ card: CourseAdCard }> = ({ card }) => {
  const { course, institutions, mou_companies } = card;
  // For single_college the backend puts the single institution in the array too.
  const institution = institutions[0];

  const ratingLabel =
    institution && institution.rating > 0
      ? `${institution.rating.toFixed(1)}/5`
      : null;

  return (
    <div className="w-[290px] flex-shrink-0 bg-white rounded-[16px] shadow-sm border border-gray-100 p-4 relative snap-center flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <div>
            <h2 className="text-[17px] font-bold text-gray-900 leading-tight tracking-tight mb-0.5">
              {course.title}
              {institution?.name ? ` in ${institution.name}` : ""}
            </h2>
            <p className="text-[12px] font-normal text-slate-500">
              {card.subtitle || course.description}
            </p>
          </div>
          {institution && (
            <div className="w-10 flex items-center justify-center flex-shrink-0 bg-white rounded-[6px] p-1 border border-gray-100 shadow-sm">
              {resolveImageUrl(institution.image_url) ? (
                <img
                  src={resolveImageUrl(institution.image_url)}
                  alt={institution.name}
                  className="w-full object-contain rounded-[4px]"
                />
              ) : (
                <span className="text-[9px] font-bold text-slate-500">
                  {institution.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {ratingLabel && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[11px] font-medium text-slate-700">
              <IconStarSolid className="h-3 w-3 fill-amber-400 text-amber-400" />
              {ratingLabel}
            </span>
          )}
          {course.affiliation && (
            <span className="inline-flex items-center px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[11px] font-medium text-slate-700 max-w-[140px] whitespace-nowrap overflow-hidden text-ellipsis">
              {course.affiliation}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex items-center gap-2.5 text-[12px] text-slate-600 mb-3">
          {course.duration && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <IconBriefcase className="h-3.5 w-3.5 text-slate-400" />
              <span className="whitespace-nowrap">{course.duration}</span>
            </div>
          )}
          {course.location && (
            <div className="flex items-center gap-1 truncate">
              <IconMapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{course.location}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <hr className="border-gray-100 mb-3" />
        {/* Footer: MOU Companies */}
        <div>
          <p className="text-[11px] font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
            MOU Companies
          </p>
          <div className="flex flex-wrap items-center gap-1.5 pb-0.5">
            {mou_companies.map((mou) => (
              <MouCompanyBox key={mou.id} mou={mou} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------- section ------------------------------- */

const SingleCollegeCoursesAd: React.FC = () => {
  const { data: cards, isLoading } = useCourseAdCards("single_college");
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  const getCards = () =>
    Array.from(carouselRef.current?.children ?? []) as HTMLElement[];

  const handleScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const cardEls = getCards();
    if (cardEls.length === 0) return;
    let activeIndex = 0;
    let minDistance = Infinity;
    const carouselCenter = el.scrollLeft + el.clientWidth / 2;
    cardEls.forEach((cardEl, index) => {
      const cardCenter = cardEl.offsetLeft + cardEl.clientWidth / 2;
      const distance = Math.abs(carouselCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = index;
      }
    });
    setActiveDot(activeIndex);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const cardEls = getCards();
    const card = cardEls[index];
    if (!card) return;
    el.scrollTo({
      left: card.offsetLeft - el.clientWidth / 2 + card.clientWidth / 2,
      behavior: "smooth",
    });
  }, []);

  const scroll = useCallback((direction: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const firstCard = (getCards()[0] as HTMLElement | undefined);
    const step = firstCard ? firstCard.clientWidth + 16 : 306;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  if (isLoading || !cards || cards.length === 0) return null;

  const visibleCards = cards.filter((c) => c.active);

  return (
    <div className="w-full max-w-[942px] mx-auto bg-[#ebfbf1] border border-[#c6f6d5] rounded-[20px] sm:rounded-[28px] p-4 sm:p-5 shadow-sm flex flex-col items-center">
      {/* Section Header */}
      <div className="w-full max-w-[902px] flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg md:text-[22px] font-bold text-green-900 tracking-tight leading-snug">
            Best bachelor degree
          </h2>
          <p className="text-[13px] text-green-700 font-medium">on best colleges</p>
        </div>

        <div className="flex items-center gap-2 hidden sm:flex">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scroll(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scroll(1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="w-full max-w-[902px] flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 justify-start items-stretch"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {visibleCards.map((card) => (
          <SingleCollegeCard key={card.id} card={card} />
        ))}
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-4 mt-4 w-full max-w-[902px]">
        <div className="flex items-center gap-2">
          {visibleCards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              aria-label={`Go to card ${index + 1}`}
              onClick={() => scrollToIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                index === activeDot
                  ? "w-5 h-1.5 bg-blue-600"
                  : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleCollegeCoursesAd;
