"use client";

import { useState } from "react";

interface DirectAdmissionCardProps {
  image: string;
  collegeName: string;
  rating: number;
  type: string;
  location: string;
  website: string;
  courseName: string;
  description: string;
  onApply?: () => void;
  onCounselling?: () => void;
  onAskQuestion?: () => void;
}

export default function DirectAdmissionCard({
  image,
  collegeName,
  rating,
  type,
  location,
  website,
  courseName,
  description,
  onApply,
  onCounselling,
  onAskQuestion,
}: DirectAdmissionCardProps) {
  const [favorited, setFavorited] = useState(false);

  return (
    <div className="bg-white rounded-md  border border-gray-100 overflow-hidden w-full max-w-[340px] flex flex-col transition-all duration-300 hover: relative">
      {/* Image Section */}
      <div className="p-2.5 pb-0 shrink-0">
        <div className="relative h-28 w-full bg-gray-50 rounded-[14px] overflow-hidden flex items-center justify-center">
          <img src={image} alt={collegeName} className="w-full h-full object-cover" />

          {/* Direct Admission Badge */}
          <div className="absolute top-2 left-0 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 tracking-wide rounded-r-sm z-10 uppercase flex items-center gap-1 ">
            <svg className="w-[10px] h-[10px]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Direct Admission
          </div>

          {/* Info Overlay */}
          <div className="absolute bottom-1.5 right-1.5 z-20 flex items-center gap-1 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
            <span className="text-white text-[8px] font-bold tracking-tight uppercase">Direct Admission</span>
            <svg className="w-[9px] h-[9px] text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 pb-3 flex flex-col flex-grow">
        {/* Title and Verified Badge */}
        <div className="flex items-center gap-1.5 mb-1.5 group/name relative">
          <h2 
            title={collegeName}
            className="text-[#0f172a] text-[18px] font-bold leading-tight truncate transition-colors group-hover/name:text-brand-blue"
          >
            {collegeName}
          </h2>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6366f1" className="w-5 h-5 shrink-0">
            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Stats: Rating, Type, Location */}
        <div className="flex items-center text-[12px] text-[#64748b] mb-1.5 whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-1">
            <svg className="w-[15px] h-[15px] fill-[#f59e0b]" viewBox="0 0 20 20">
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
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate" title={location}>{location}</span>
          </div>
        </div>

        {/* Website Link */}
        <div className="flex items-center gap-1.5 text-[12px] text-[#64748b] mb-1.5 hover:text-indigo-600 transition-colors cursor-pointer w-fit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span className="font-medium">{website}</span>
        </div>

        {/* Course Name */}
        <div className="flex items-center gap-1.5 text-[12.5px] text-[#1e293b] mb-3">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="font-semibold">{courseName}</span>
        </div>

        {/* Fast Track Highlight */}
        <div className="bg-indigo-50/50 rounded-md p-2.5 mb-3 border border-indigo-100/50">
          <div className="text-[11px] text-indigo-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Fast-Track Process
          </div>
          <p className="text-[11.5px] text-indigo-900/80 leading-relaxed line-clamp-2" title={description}>{description}</p>
        </div>

        <div className="flex-grow"></div>
        <div className="border-b border-dotted border-gray-200 mb-3 w-full" style={{ borderBottomWidth: "1.5px", borderBottomStyle: "dotted" }}></div>

        {/* Middle Actions */}
        <div className="flex items-center gap-1.5 mb-2">
          <button
            onClick={onCounselling}
            className="flex-1 py-1.5 px-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 rounded-md text-[11px] font-semibold transition-colors flex justify-center items-center gap-1 whitespace-nowrap"
          >
            <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Get Counselling
          </button>
          <button
            onClick={onAskQuestion}
            className="flex-1 py-1.5 px-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 rounded-md text-[11px] font-semibold transition-colors flex justify-center items-center gap-1 whitespace-nowrap"
          >
            <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Ask Question
          </button>
        </div>

        {/* Primary Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onApply}
            className="flex-1 py-2 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[12px] font-bold transition-all  flex items-center justify-center gap-2"
          >
            Secure Spot
          </button>
          <button
            onClick={() => setFavorited(!favorited)}
            className={`flex-none w-9 h-9 flex items-center justify-center border rounded-md transition-colors ${
              favorited
                ? "border-blue-100 bg-blue-50 text-blue-600"
                : "border-gray-200 text-gray-400 hover:bg-gray-50"
            }`}
          >
            <i className={`fa-${favorited ? "solid" : "regular"} fa-bookmark text-[16px]`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}
