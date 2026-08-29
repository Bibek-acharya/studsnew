"use client";

import Link from "next/link";
import { Star, MapPin, Award, MessageSquare, Bookmark, Globe, Loader2 } from "lucide-react";
import { SearchResult } from "./types";

export default function SearchCollegeCard({ item }: { item: SearchResult }) {
  const slug = item.slug || String(item.id);
  const displayUrl = item.website?.replace(/^https?:\/\//, "").replace(/\/+$/, "") || "";

  return (
    <div className="flex h-full cursor-pointer flex-col rounded-md border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20 overflow-visible">
      <Link href={`/find-college/${slug}`} className="group relative h-35 shrink-0 overflow-hidden rounded-md">
        {item.featured && (
          <div className="absolute top-3 left-3 z-10 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Featured
          </div>
        )}
        {item.image ? (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#0000ff]" />
        )}
      </Link>

      <div className="flex flex-1 flex-col px-0 pt-3 overflow-visible">
        <div className="flex items-center gap-1.5 mb-2">
          <Link
            href={`/find-college/${slug}`}
            className="group/title relative truncate text-left text-[20px] font-bold text-slate-800 tracking-tight transition-colors hover:text-blue-600 line-clamp-2"
          >
            <span className="truncate block" title={item.title}>
              {item.title}
            </span>
            <span className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/title:visible group-hover/title:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded whitespace-nowrap transition-all duration-200 z-50 pointer-events-none">
              {item.title}
              <span className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></span>
            </span>
          </Link>
          {item.verified && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d6efd" className="w-5 h-5 shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        <div className="mb-2 flex min-w-0 items-center text-[14px] text-gray-500">
          <div className="flex items-center gap-1 font-bold text-slate-700">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{Number(item.rating || 0).toFixed(1)}</span>
          </div>
          <span className="mx-3 text-gray-300 font-light">|</span>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-slate-700">{item.institutionType || "College"}</span>
          </div>
          <span className="mx-3 text-gray-300 font-light">|</span>
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="group/location block min-w-0 truncate font-semibold text-slate-700 line-clamp-1" title={item.location || "Kathmandu"}>
              <span className="truncate block">{item.location || "Kathmandu"}</span>
              <span className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/location:visible group-hover/location:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded whitespace-nowrap transition-all duration-200 z-50 pointer-events-none">
                {item.location || "Kathmandu"}
                <span className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></span>
              </span>
            </span>
          </div>
        </div>

        {item.university && (
          <div className="flex items-start gap-2 text-[14px] text-gray-500 mb-2">
            <Award className="w-4 h-4 text-gray-400 shrink-0 mt-0.75" />
            <p className="group/affil leading-snug pr-4 font-semibold text-slate-700 line-clamp-1" title={item.university}>
              <span className="truncate block">{item.university}</span>
            </p>
          </div>
        )}

        {item.featured && displayUrl && (
          <div className="flex items-center gap-2 text-[14px] text-gray-500 mb-3">
            <Globe className="w-4 h-4 text-gray-400 shrink-0" />
            <a
              href={item.website.match(/^https?:\/\//) ? item.website : `https://${item.website}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#0000ff] hover:underline font-medium truncate"
            >
              {displayUrl}
            </a>
          </div>
        )}

        <div className="mt-2 flex items-center gap-4 mb-3">
          <Link
            href={`/find-college/${slug}?tab=admissions`}
            className="text-[12px] font-medium text-[#0000ff] hover:text-blue-800 flex items-center transition-colors"
          >
            Admission
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
            </svg>
          </Link>
          <Link
            href={`/find-college/${slug}?tab=courses`}
            className="text-[12px] font-medium text-[#0000ff] hover:text-blue-800 flex items-center transition-colors"
          >
            Courses & Fees
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
            </svg>
          </Link>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <div className="flex gap-2">
            <Link
              href={`/find-college/${slug}`}
              className="bg-[#0000ff] flex-1 flex items-center justify-center gap-1.5 hover:bg-[#0000cc] text-white font-medium py-2 px-2 rounded-md transition-colors text-[13px]"
            >
              View Details
            </Link>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-slate-600 font-medium py-2 px-2 rounded-md transition-colors text-[13px]"
            >
              <MessageSquare className="w-4 h-4 text-gray-500" />
              Inquiry
            </button>
            <button
              type="button"
              className="w-10 flex items-center justify-center border border-gray-200 hover:bg-gray-50 rounded-md transition-colors shrink-0"
              title="Bookmark"
            >
              <Bookmark className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
