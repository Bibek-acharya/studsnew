"use client";

import { useState, useRef, useEffect } from "react";

interface Program {
  name: string;
  status: "Closing Soon" | "Opening Soon" | "Seats Available";
}

interface CollegeCardProps {
  images: string[];
  tag: { text: string; color: string };
  collegeName: string;
  rating: number;
  type: string;
  location: string;
  website: string;
  programs: Program[];
  moreProgramsCount?: number;
  onApply?: () => void;
  onMockTest?: () => void;
  onAskQuestion?: () => void;
  onNavigate?: () => void;
}

export default function CollegeCard({
  images,
  tag,
  collegeName,
  rating,
  type,
  location,
  website,
  programs,
  moreProgramsCount = 0,
  onApply,
  onMockTest,
  onAskQuestion,
  onNavigate,
}: CollegeCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3500);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const statusColor = (status: string) => {
    switch (status) {
      case "Closing Soon":
        return "text-[#ef4444]";
      case "Opening Soon":
      case "Seats Available":
        return "text-[#059669]";
      default:
        return "text-[#059669]";
    }
  };

  const statusBg = (status: string) => {
    switch (status) {
      case "Closing Soon":
        return "bg-[#ef4444]";
      case "Opening Soon":
      case "Seats Available":
        return "bg-[#059669]";
      default:
        return "bg-[#059669]";
    }
  };

  return (
    <div 
      onClick={onNavigate}
      className="bg-white rounded-md border border-gray-200 hover:border-blue-200 overflow-hidden w-full max-w-85 flex flex-col h-full transition-transform cursor-pointer"
    >
      {/* Image Section with Carousel */}
      <div className="p-2.5 pb-0 shrink-0">
        <div
          ref={carouselRef}
          className="group relative h-28 w-full bg-gray-200 rounded-md overflow-hidden"
        >
          <div
            className="carousel-track flex w-full h-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${collegeName} ${index + 1}`}
                className="w-full h-full object-cover shrink-0"
              />
            ))}
          </div>

          {/* Prev Button */}
          <button
            onClick={prevSlide}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 focus:outline-none backdrop-blur-sm"
          >
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 focus:outline-none backdrop-blur-sm"
          >
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Dynamic Status Tag */}
          <div className={`absolute top-2.5 left-0 ${tag.color} text-white text-[10px] font-bold px-2.5 py-1 tracking-wide rounded-r-md z-10 uppercase `}>
            {tag.text}
          </div>

          {/* Tiny Integrated Text Links */}
          <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/10">
            <span className="text-white text-[8px] font-medium tracking-tight opacity-90">Required Counselling?</span>
            <span className="w-px h-2 bg-white/20"></span>
            <span className="text-emerald-300 text-[8px] font-bold tracking-tight cursor-pointer hover:text-emerald-100 transition-colors">
              Reserve Seat
            </span>
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-2 right-3 flex items-center gap-1 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`dot-indicator transition-all duration-300 rounded-full focus:outline-none cursor-pointer ${
                  index === currentSlide
                    ? "w-3 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 pb-3 flex flex-col grow">
        {/* College Name + Verified */}
        <div className="flex items-center gap-1.5 mb-1 group/name relative">
          <h2 
            title={collegeName}
            className="text-[#0f172a] text-[18px] font-bold leading-tight truncate transition-colors group-hover/name:text-brand-blue"
          >
            {collegeName}
          </h2>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d6efd" className="w-5 h-5 shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Stats Row */}
        <div className="flex items-center text-[12px] text-[#64748b] mb-1.5 whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-1">
            <svg className="w-3.75 h-3.75 fill-[#f59e0b]" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-bold text-[#334155]">{rating}</span>
          </div>
          <span className="mx-2 text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{type}</span>
          </div>
          <span className="mx-2 text-gray-300">|</span>
          <div className="flex items-center gap-1.5 truncate">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate" title={location}>{location}</span>
          </div>
        </div>

        {/* Website */}
        <div className="flex items-center gap-1.5 text-[12.5px] text-[#64748b] mb-2 hover:text-[#0d6efd] transition-colors cursor-pointer w-fit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span>{website}</span>
        </div>

        <hr className="border-gray-100 mb-2" />

        {/* Programs Offered Header */}
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[12.5px] font-medium text-[#64748b]">Programs Offered</span>
          <span className="text-[12.5px] font-semibold text-[#2563eb]">Admission Open</span>
        </div>

        {/* Programs List */}
        <ul className="space-y-1 mb-2">
          {programs.map((program, index) => (
            <li key={index} className="flex justify-between items-center text-[12.5px]">
              <span className="font-semibold text-[#1e293b]">{program.name}</span>
              <div className={`flex items-center gap-1.5 font-medium text-[11px] ${statusColor(program.status)}`}>
                <span className="relative flex h-2 w-2 justify-center items-center">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusBg(program.status)}`}></span>
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusBg(program.status)}`}></span>
                </span>
                {program.status}
              </div>
            </li>
          ))}
        </ul>

        {moreProgramsCount > 0 && (
          <a href="#" className="inline-flex items-center gap-1 text-[#2563eb] text-[12.5px] font-semibold hover:underline mb-2">
            {moreProgramsCount}+ programs
            <svg className="w-2.5 h-2.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </a>
        )}

        <div className="border-b border-dotted border-gray-200 mt-auto mb-3 w-full pt-2" style={{ borderBottomWidth: "1.5px", borderBottomStyle: "dotted" }}></div>

        {/* Middle Actions */}
        <div className="flex items-center gap-1.5 mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMockTest?.();
            }}
            className="flex-1 py-1.5 px-2 bg-gray-50 text-[#334155] hover:bg-gray-100 border border-gray-200 rounded-md text-[11px] font-semibold transition-colors flex justify-center items-center gap-1 whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Mock Test
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAskQuestion?.();
            }}
            className="flex-1 py-1.5 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 rounded-md text-[11px] font-semibold transition-colors flex justify-center items-center gap-1 whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Ask Question
          </button>
        </div>

        {/* Apply + Favorite */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply?.();
            }}
            className="flex-1 py-2 px-2 bg-brand-blue hover:bg-brand-hover text-white rounded-md text-[12px] font-bold transition-colors"
          >
            Apply Now
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFavorited(!favorited);
            }}
            className={`flex-none w-9 h-9 flex items-center justify-center border rounded-md transition-colors ${
              favorited
                ? "border-blue-100 bg-blue-50 text-blue-600"
                : "border-gray-200 text-[#64748b] hover:bg-gray-50"
            }`}
          >
            <i className={`fa-${favorited ? "solid" : "regular"} fa-bookmark text-[16px]`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}
