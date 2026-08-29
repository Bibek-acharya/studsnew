"use client";

import Link from "next/link";
import { Star, MapPin, Award, Globe, GraduationCap } from "lucide-react";
import { SearchResult } from "./types";

export default function SearchUniversityCard({ item }: { item: SearchResult }) {
  const slug = item.slug || String(item.id);
  const displayUrl = item.website?.replace(/^https?:\/\//, "").replace(/\/+$/, "") || "";

  return (
    <div className="flex h-full flex-col rounded-md border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20">
      <Link href={`/universities/${slug}`} className="group relative h-35 shrink-0 overflow-hidden rounded-md mb-3">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#0000ff]" />
        )}
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex items-center gap-1.5">
          <Link href={`/universities/${slug}`} className="truncate text-[20px] font-bold text-slate-800 tracking-tight hover:text-blue-600">
            {item.title}
          </Link>
          {item.verified && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d6efd" className="w-5 h-5 shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="mb-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-gray-500">
          {item.rating > 0 && (
            <div className="flex items-center gap-1 font-bold text-slate-700">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{item.rating}</span>
            </div>
          )}
          {item.institutionType && (
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-slate-700">{item.institutionType}</span>
            </div>
          )}
          {item.location && (
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
              <span className="truncate font-semibold text-slate-700">{item.location}</span>
            </div>
          )}
        </div>
        {item.description && (
          <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{item.description.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()}</p>
        )}
        {displayUrl && (
          <div className="flex items-center gap-2 text-[14px] text-gray-500 mb-2">
            <Globe className="w-4 h-4 text-gray-400 shrink-0" />
            <a href={item.website.match(/^https?:\/\//) ? item.website : `https://${item.website}`} target="_blank" rel="noopener noreferrer" className="truncate cursor-pointer font-medium text-[#0000ff] hover:underline">
              {displayUrl}
            </a>
          </div>
        )}
        <div className="mt-auto flex gap-2">
          <Link href={`/universities/${slug}`} className="flex-1 flex items-center justify-center rounded-md border border-gray-200 py-2 text-[13px] font-medium text-slate-600 hover:bg-gray-50 transition-colors">
            Details
          </Link>
          <Link href={`/universities/${slug}`} className="flex-[1.2] flex items-center justify-center rounded-md bg-[#0000ff] py-2 text-[13px] font-medium text-white hover:bg-[#0000cc] transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
