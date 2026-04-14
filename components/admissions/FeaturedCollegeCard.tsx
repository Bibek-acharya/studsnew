"use client";

import { useState, useEffect } from "react";

interface FeaturedCollegeCardProps {
  provider: string;
  location: string;
  type: string;
  rating: number;
  logo: string;
  title: string;
  website: string;
  secondaryBadge: string;
  badgeColor: string;
  programs: string[];
  images: string[];
  onApply?: () => void;
  onMockTest?: () => void;
  onCounselling?: () => void;
}

export default function FeaturedCollegeCard({
  provider,
  location,
  type,
  rating,
  logo,
  title,
  website,
  secondaryBadge,
  badgeColor,
  programs,
  images,
  onApply,
  onMockTest,
  onCounselling,
}: FeaturedCollegeCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="bg-white rounded-xl shadow-sm w-full flex flex-col border border-gray-100 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden group/card relative">
      {/* Image Carousel */}
      <div className="p-2 pb-0">
        <div className="h-[120px] w-full bg-gray-100 overflow-hidden relative rounded-lg group/slider">
          {/* Badges */}
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
            <span className={`${badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm`}>
              {secondaryBadge}
            </span>
          </div>

          {/* Carousel Track */}
          <div
            className="flex transition-transform duration-500 ease-out h-full w-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {images.map((img, index) => (
              <div key={index} className="w-full h-full shrink-0">
                <img src={img} alt={`${provider} ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-1 opacity-0 group-hover/slider:opacity-100 transition-opacity z-10 backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-1 opacity-0 group-hover/slider:opacity-100 transition-opacity z-10 backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white w-2.5 h-1.5"
                    : "bg-white/50 w-1.5 h-1.5"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-grow relative">
        {/* Rating - Fixed to right border */}
        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 bg-yellow-50 border border-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0 shadow-xs">
          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {rating}
        </div>

        {/* Header: Logo, Title */}
        <div className="flex items-start gap-3 mb-3">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded border border-gray-100 shadow-sm shrink-0 mt-0.5" />
          <div className="flex-grow flex flex-col gap-1.5 min-w-0 pr-12">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-bold text-gray-900 leading-none truncate" title={provider}>{provider}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0040ff" className="w-4 h-4 shrink-0">
                <path fillRule="evenodd" d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
              <div className="flex items-center gap-1 min-w-0">
                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate" title={location}>{location}</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 shrink-0">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{type}</span>
              </div>
            </div>
          </div>
        </div>


        {/* Website and WhatsApp | Viber text */}
        <div className="flex items-center justify-between mb-3">
          <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[12px] text-[#1053F3] font-medium hover:underline">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {website}
          </a>
          <span className="flex items-center gap-1 text-[12px] font-semibold">
            <a
              href="https://wa.me/" // Add your WhatsApp group link here
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#25D366' }}
              className="hover:underline"
            >
              WhatsApp
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="https://invite.viber.com/" // Add your Viber group link here
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#7360F2' }}
              className="hover:underline"
            >
              Viber
            </a>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[14px] text-gray-800 leading-tight mb-3 truncate" title={title}>
          {title}
        </h3>

        {/* Programs Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          {programs.map((program, index) => (
            <span key={index} className="bg-blue-50/50 text-gray-600 border border-blue-100/50 text-[10px] font-semibold px-2 py-0.5 rounded-sm flex items-center gap-1.5">
              {program === "Science" && (
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
              )}
              {program}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-2">
          <button
            onClick={onApply}
            className="w-full bg-[#1053F3] hover:bg-blue-700 text-white text-[13px] font-semibold py-2 rounded-md transition-colors shadow-sm"
          >
            Apply Now
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onMockTest}
              className="bg-[#EBF1FF] text-[#1053F3] hover:bg-blue-100 text-[11px] font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Mock Test
            </button>
            <button
              onClick={onCounselling}
              className="bg-[#EBF1FF] text-[#1053F3] hover:bg-blue-100 text-[11px] font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Counselling
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
