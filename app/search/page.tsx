"use client";

import React, { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Award,
  MapPin,
  Clock,
  Building2,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const ENTITY_TYPES = [
  { value: "all", label: "All" },
  { value: "college", label: "Colleges & Institutes" },
  { value: "course", label: "Courses" },
  { value: "university", label: "Universities" },
  { value: "scholarship", label: "Scholarships" },
  { value: "event", label: "Events" },
  { value: "news", label: "News" },
  { value: "blog", label: "Blogs" },
  { value: "exam", label: "Exams" },
  { value: "admission_page", label: "Admissions" },
] as const;

const SORT_OPTIONS: Record<string, string> = {
  Popular: "relevance",
  "Newest First": "created_at_desc",
  "Highest Rated": "rating_desc",
  "Title A-Z": "title_asc",
};

interface SearchItem {
  id: number;
  type: string;
  title: string;
  description: string;
  image: string;
  featured: boolean;
  verified: boolean;
  rating: number;
  institutionType: string;
  location: string;
  university: string;
  website: string;
  slug: string;
  tags: string[];
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface SearchResponse {
  success: boolean;
  message: string;
  data: {
    items: SearchItem[];
    meta: PaginationMeta;
  };
}

function stripHtml(html?: string): string {
  if (!html || typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

const categoryColors: Record<string, string> = {
  workshop: "bg-orange-500",
  seminar: "bg-blue-500",
  webinar: "bg-purple-500",
  conference: "bg-green-500",
  competition: "bg-pink-500",
  default: "bg-gray-500",
};

function mapEventCategory(cat?: string): string {
  if (!cat) return "default";
  const c = cat.toLowerCase();
  if (c.includes("workshop")) return "workshop";
  if (c.includes("seminar")) return "seminar";
  if (c.includes("webinar")) return "webinar";
  if (c.includes("conference")) return "conference";
  if (c.includes("competition") || c.includes("hackathon")) return "competition";
  return "default";
}

const newsCategoryColors: Record<string, string> = {
  admission: "bg-blue-700",
  scholarship: "bg-emerald-500",
  exams: "bg-red-500",
  events: "bg-purple-500",
  achievements: "bg-amber-500",
  notice: "bg-indigo-500",
  news: "bg-cyan-500",
  default: "bg-slate-500",
};

function mapNewsCategory(cat?: string): string {
  if (!cat) return "default";
  const c = cat.toLowerCase();
  for (const key of Object.keys(newsCategoryColors)) {
    if (c.includes(key)) return key;
  }
  return "default";
}

const levelBadgeColors: Record<string, string> = {
  bachelor: "bg-[#FDE8EE] text-[#D11D5A]",
  master: "bg-[#E8F0FE] text-[#1A56DB]",
  "+2": "bg-[#FEF3C7] text-[#92400E]",
  diploma: "bg-[#D1FAE5] text-[#065F46]",
  phd: "bg-[#EDE9FE] text-[#5B21B6]",
  default: "bg-[#FDE8EE] text-[#D11D5A]",
};

function getLevelColor(level?: string): string {
  if (!level) return levelBadgeColors.default;
  const l = level.toLowerCase();
  for (const [key, val] of Object.entries(levelBadgeColors)) {
    if (l.includes(key)) return val;
  }
  return levelBadgeColors.default;
}

function CollegeCard({ item }: { item: SearchItem }) {
  const slug = item.slug || item.id;
  const displayUrl = item.website?.replace(/^https?:\/\//, "").replace(/\/+$/, "") || "";
  return (
    <div className="flex h-full cursor-pointer flex-col rounded-md border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20 overflow-visible">
      <Link href={`/find-college/${slug}`} className="group relative h-35 shrink-0 overflow-hidden rounded-md">
        {item.featured && (
          <div className="absolute top-3 left-3 z-10 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Featured</div>
        )}
        {item.image ? (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-blue-600">
            <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col px-0 pt-3 overflow-visible">
        <div className="flex items-center gap-1.5 mb-2">
          <Link href={`/find-college/${slug}`} className="group/title relative truncate text-left text-[20px] font-bold text-slate-800 tracking-tight transition-colors hover:text-blue-600 line-clamp-2">
            <span className="truncate block" title={item.title}>{item.title}</span>
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
        <div className="mb-2 flex min-w-0 items-center text-[12px] text-[#64748b]">
          {item.rating > 0 && (
            <>
              <div className="flex items-center gap-1">
                <svg className="w-3.75 h-3.75 fill-[#f59e0b]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span className="font-bold text-[#334155]">{Number(item.rating).toFixed(1)}</span>
              </div>
              <span className="mx-2 text-gray-300">|</span>
            </>
          )}
          {item.institutionType && (
            <>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span>{item.institutionType}</span>
              </div>
              <span className="mx-2 text-gray-300">|</span>
            </>
          )}
          {item.location && (
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="truncate" title={item.location}>{item.location}</span>
            </div>
          )}
        </div>
        {displayUrl && (
          <div className="flex items-center gap-1.5 text-[12.5px] text-[#64748b] mb-2 hover:text-[#0d6efd] transition-colors cursor-pointer w-fit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            <span>{displayUrl}</span>
          </div>
        )}
        <div className="mt-auto flex gap-2">
          <Link href={`/find-college/${slug}`} className="flex-1 flex items-center justify-center rounded-md bg-blue-600 text-white font-medium py-2 text-[13px] hover:bg-blue-700 transition-colors">View Details</Link>
          <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-slate-600 font-medium py-2 rounded-md transition-colors text-[13px]">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Inquiry
          </button>
          <button className="w-9 h-9 flex items-center justify-center border border-gray-200 hover:bg-gray-50 rounded-md transition-colors shrink-0" title="Bookmark">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function InstitutionCard({ item }: { item: SearchItem }) {
  const slug = item.slug || item.id;
  return (
    <div className="flex h-full flex-col rounded-md border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20">
      <Link href={`/find-college/inst_${slug}`} className="relative h-35 shrink-0 overflow-hidden rounded-md mb-3">
        {item.featured && (
          <div className="absolute top-3 left-3 z-10 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Featured
          </div>
        )}
        {item.image ? (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-blue-600" />
        )}
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex items-center gap-1.5">
          <Link href={`/find-college/inst_${slug}`} className="truncate text-[18px] font-bold text-slate-800 hover:text-blue-600">
            {item.title}
          </Link>
          {item.verified && <BadgeCheck className="h-5 w-5 shrink-0 fill-blue-500 text-white" />}
        </div>
        <div className="mb-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-500">
          {item.institutionType && (
            <div className="flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-semibold text-slate-700">{item.institutionType}</span>
            </div>
          )}
          {item.location && (
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="truncate font-semibold text-slate-700">{item.location}</span>
            </div>
          )}
        </div>
        {item.description && (
          <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{stripHtml(item.description)}</p>
        )}
        <div className="mt-auto flex gap-2">
          <Link href={`/find-college/inst_${slug}`} className="flex-1 flex items-center justify-center rounded-md border border-gray-200 bg-white py-2 text-[13px] font-medium text-slate-600 hover:bg-gray-50 transition-colors">
            Details
          </Link>
          <Link href={`/find-college/inst_${slug}`} className="flex-[1.2] flex items-center justify-center rounded-md bg-blue-600 py-2 text-[13px] font-medium text-white hover:bg-blue-700 transition-colors">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ item }: { item: SearchItem }) {
  const levelText = item.institutionType || "Course";
  return (
    <div className="bg-white rounded-xl border border-gray-200 w-full p-4 flex flex-col">
      {/* Banner */}
      <div className="rounded-lg p-6 mb-4 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[140px] bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-16 -mb-16 blur-2xl"></div>
        <div className="flex-1 flex items-center justify-center w-full relative z-10">
          <h2 className="text-white text-[1.1rem] font-bold leading-tight">{item.title}</h2>
        </div>
        <div className="text-white/80 text-[0.55rem] relative z-10 pt-2 tracking-wide font-medium">studsphere.com</div>
      </div>

      {/* Badges and Duration */}
      <div className="flex justify-between items-center mb-3">
        <span className={`${getLevelColor(levelText)} text-[0.65rem] font-bold px-3 py-1 rounded-md tracking-wider`}>
          {levelText.toUpperCase()}
        </span>
      </div>

      {/* Title */}
      <h3 title={item.title} className="text-[0.95rem] font-bold text-gray-900 mb-4 leading-tight line-clamp-2">
        {item.title}
      </h3>

      {/* Details */}
      {item.description && (
        <p className="text-[0.8rem] text-gray-500 mb-4 line-clamp-2">{stripHtml(item.description)}</p>
      )}

      {/* Divider */}
      <div className="border-t border-dashed border-gray-300 mb-4"></div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link href={`/course-finder/${item.id}`} className="flex-1 py-2.5 px-4 bg-white border border-gray-300 rounded text-gray-600 font-medium text-xs text-center hover:bg-gray-50 transition-colors">
          Details
        </Link>
        <Link href={`/course-finder/${item.id}`} className="flex-[1.5] py-2.5 px-4 bg-[#0014FF] text-white rounded font-semibold text-xs text-center hover:bg-blue-700 transition-colors">
          View Colleges
        </Link>
      </div>
    </div>
  );
}

function UniversityCard({ item }: { item: SearchItem }) {
  const slug = item.slug || item.id;
  return (
    <div className="flex h-full flex-col rounded-md border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20">
      <Link href={`/universities/${slug}`} className="relative h-35 shrink-0 overflow-hidden rounded-md mb-3">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-blue-600" />
        )}
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex items-center gap-1.5">
          <Link href={`/universities/${slug}`} className="truncate text-[18px] font-bold text-slate-800 hover:text-blue-600">
            {item.title}
          </Link>
          {item.verified && <BadgeCheck className="h-5 w-5 shrink-0 fill-blue-500 text-white" />}
        </div>
        <div className="mb-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-500">
          {item.rating > 0 && (
            <div className="flex items-center gap-1 font-bold text-slate-700">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{item.rating}</span>
            </div>
          )}
          {item.institutionType && (
            <div className="flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-semibold text-slate-700">{item.institutionType}</span>
            </div>
          )}
          {item.location && (
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="truncate font-semibold text-slate-700">{item.location}</span>
            </div>
          )}
        </div>
        {item.description && (
          <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{stripHtml(item.description)}</p>
        )}
        <div className="mt-auto flex gap-2">
          <Link href={`/universities/${slug}`} className="flex-1 flex items-center justify-center rounded-md border border-gray-200 py-2 text-[13px] font-medium text-slate-600 hover:bg-gray-50 transition-colors">
            Details
          </Link>
          <Link href={`/universities/${slug}`} className="flex-[1.2] flex items-center justify-center rounded-md bg-blue-600 py-2 text-[13px] font-medium text-white hover:bg-blue-700 transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScholarshipCard({ item }: { item: SearchItem }) {
  const slug = item.slug || item.id;
  return (
    <div className="relative flex flex-col bg-white rounded-md border border-gray-200/80 transition-all duration-300 p-3 h-full">
      <div className="h-32 w-full bg-gray-100 relative overflow-hidden rounded-md mb-3">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full p-3 flex items-start bg-gradient-to-br from-gray-200 to-gray-50">
            <span className="text-gray-600 text-[13px] font-medium line-clamp-2">{item.title}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col grow px-1">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-blue-600 bg-blue-50 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">Scholarship</span>
        </div>
        <h3 className="font-bold text-[16px] leading-tight text-slate-900 mb-1 line-clamp-2">{item.title}</h3>
        {item.description && (
          <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{stripHtml(item.description)}</p>
        )}
        <div className="mt-auto flex gap-2">
          <Link href={`/scholarship-finder/${slug}`} className="flex-1 py-2 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-center">
            Details
          </Link>
          <Link href={`/scholarship-finder/apply/${slug}`} className="flex-[1.2] py-2 text-[13px] font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors text-center">
            Apply
          </Link>
        </div>
      </div>
    </div>
  );
}

function EventCard({ item }: { item: SearchItem }) {
  const slug = item.slug || item.id;
  const mapped = mapEventCategory(item.institutionType);
  return (
    <article className="bg-white rounded-md border border-gray-200 hover:border-blue-500/20 overflow-hidden flex flex-col duration-300 h-full">
      <div className="h-35 w-full overflow-hidden p-4">
        <img src={item.image || "/placeholder.jpg"} alt={item.title} className="w-full h-full object-cover rounded-md" />
      </div>
      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-center mb-3">
          <span className={`${categoryColors[mapped] || categoryColors.default} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}>
            {item.institutionType || "Event"}
          </span>
        </div>
        <Link href={`/events/${slug}`} className="font-bold text-lg mb-3 leading-tight text-left text-black hover:text-blue-600">
          {item.title}
        </Link>
        {item.location && (
          <div className="flex items-center text-xs text-gray-600 mb-3 font-semibold">
            <MapPin className="w-3.5 h-3.5 mr-2 text-gray-500" />
            {item.location}
          </div>
        )}
        {item.description && (
          <p className="text-xs text-gray-500 mb-5 line-clamp-3 leading-relaxed font-medium">{stripHtml(item.description)}</p>
        )}
        <div className="mt-auto flex gap-2">
          <Link href={`/events/${slug}`} className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-bold py-2 rounded-md hover:bg-gray-50 transition text-center">
            Details
          </Link>
          <button className="flex-1 text-white text-sm font-bold py-2 rounded-md transition bg-blue-600 hover:bg-blue-700">Register</button>
        </div>
      </div>
    </article>
  );
}

function NewsCard({ item }: { item: SearchItem }) {
  const slug = item.slug || item.id;
  const colorKey = mapNewsCategory(item.institutionType);
  return (
    <article className="bg-white rounded-md border border-gray-200 overflow-hidden flex flex-col h-full hover:border-blue-500/20 transition-all duration-300">
      <div className="h-30 w-full overflow-hidden p-3">
        <img src={item.image || "/placeholder.jpg"} alt={item.title} className="w-full h-full object-cover rounded-md hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`${newsCategoryColors[colorKey] || newsCategoryColors.default} text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase`}>
            {item.institutionType || "News"}
          </span>
        </div>
        <Link href={`/news/${slug}`} className="font-bold text-lg leading-tight text-black hover:text-blue-600 mb-2 line-clamp-2">{item.title}</Link>
        {item.description && <p className="text-sm text-slate-500 line-clamp-2 mb-3">{stripHtml(item.description)}</p>}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">{item.university || ""}</span>
          <Link href={`/news/${slug}`} className="text-sm font-semibold text-blue-600 hover:underline">View Details</Link>
        </div>
      </div>
    </article>
  );
}

function BlogCard({ item }: { item: SearchItem }) {
  const slug = item.slug || item.id;
  const colorKey = mapNewsCategory(item.institutionType);
  return (
    <article className="bg-white rounded-md border border-gray-200 overflow-hidden flex flex-col h-full hover:border-blue-500/20 transition-all duration-300">
      <div className="h-32 w-full overflow-hidden p-3">
        <img src={item.image || "/placeholder.jpg"} alt={item.title} className="w-full h-full object-cover rounded-md hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`${newsCategoryColors[colorKey] || newsCategoryColors.default} text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase`}>
            {item.institutionType || "Blog"}
          </span>
        </div>
        <Link href={`/blogs/${slug}`} className="font-bold text-lg leading-tight text-black hover:text-blue-600 mb-2 line-clamp-2">{item.title}</Link>
        {item.description && <p className="text-sm text-slate-500 line-clamp-3 mb-3">{stripHtml(item.description)}</p>}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">{item.university || ""}</span>
          <Link href={`/blogs/${slug}`} className="text-sm font-semibold text-blue-600 hover:underline">View Details</Link>
        </div>
      </div>
    </article>
  );
}

function ExamCard({ item }: { item: SearchItem }) {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-4 flex flex-col h-full hover:border-blue-500/20 transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Exam</span>
        {item.institutionType && <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{item.institutionType}</span>}
      </div>
      <h3 className="font-bold text-[17px] text-slate-800 mb-1 line-clamp-2">{item.title}</h3>
      {item.description && <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{stripHtml(item.description)}</p>}
      {item.university && (
        <div className="flex items-center gap-1.5 text-[13px] text-gray-500 mb-2">
          <Building2 className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold">{item.university}</span>
        </div>
      )}
      <div className="mt-auto pt-3 border-t border-gray-100">
        <span className="text-sm font-semibold text-blue-600">View Details</span>
      </div>
    </div>
  );
}

function AdmissionCard({ item }: { item: SearchItem }) {
  return (
    <div className="bg-white rounded-md border border-gray-200 hover:border-blue-200 overflow-hidden w-full flex flex-col h-full transition-transform">
      <div className="p-2.5 pb-0 shrink-0">
        <div className="relative w-full aspect-[21/9] bg-gray-200 rounded-md overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
          )}
        </div>
      </div>
      <div className="p-3 pb-3 flex flex-col grow">
        <div className="flex items-center gap-1.5 mb-1">
          <h2 title={item.title} className="text-[#0f172a] text-[18px] font-bold leading-tight truncate">{item.title}</h2>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d6efd" className="w-5 h-5 shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>
        {item.institutionType && (
          <div className="flex items-center gap-1.5 text-[12px] text-[#64748b] mb-1.5">
            <svg className="w-3.75 h-3.75 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            <span>Level: {item.institutionType}</span>
          </div>
        )}
        {item.location && (
          <div className="flex items-center gap-1.5 text-[12px] text-[#64748b] mb-2">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="truncate">{item.location}</span>
          </div>
        )}
        {item.description && (
          <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{stripHtml(item.description)}</p>
        )}
        <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#2563eb] mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Admission Open
        </div>
        <div className="mt-auto flex items-center gap-1.5">
          <Link href={`/admissions/bachelor`} className="flex-1 py-2 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 rounded-md text-[13px] font-semibold transition-colors flex justify-center items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Ask Question
          </Link>
          <Link href={`/admissions/bachelor`} className="flex-1 py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[13px] font-bold transition-colors flex justify-center items-center">
            View Detail
          </Link>
        </div>
      </div>
    </div>
  );
}

function SearchResultCard({ item }: { item: SearchItem }) {
  switch (item.type) {
    case "college": return <CollegeCard item={item} />;
    case "institution": return <InstitutionCard item={item} />;
    case "course": return <CourseCard item={item} />;
    case "university": return <UniversityCard item={item} />;
    case "scholarship": return <ScholarshipCard item={item} />;
    case "event": return <EventCard item={item} />;
    case "news": return <NewsCard item={item} />;
    case "blog": return <BlogCard item={item} />;
    case "exam": return <ExamCard item={item} />;
    case "admission_page": return <AdmissionCard item={item} />;
    default: return <CollegeCard item={item} />;
  }
}

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") || "";
  const pageParam = parseInt(params.get("page") || "1", 10);
  const sortParam = params.get("sort") || "relevance";
  const typeFilter = params.get("type") || "all";

  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [currentSort, setCurrentSort] = useState(
    Object.keys(SORT_OPTIONS).find((k) => SORT_OPTIONS[k] === sortParam) || "Popular"
  );
  const [isSortOpen, setIsSortOpen] = useState(false);

  const currentPage = Math.min(Math.max(pageParam, 1), 5);

  const filteredItems = useMemo(() => {
    if (typeFilter === "all") return items;
    // "college" includes both colleges and institutions
    if (typeFilter === "college") {
      return items.filter((item) => item.type === "college" || item.type === "institution");
    }
    return items.filter((item) => item.type === typeFilter);
  }, [items, typeFilter]);

  const buildSearchUrl = useCallback(
    (page: number, sort: string) => `${API_BASE_URL}/api/v1/search?q=${encodeURIComponent(q)}&page=${page}&limit=20&sort=${sort}`,
    [q]
  );

  useEffect(() => {
    if (!q) { setLoading(false); return; }
    setLoading(true);
    const fetchSearch = async () => {
      try {
        const sortValue = SORT_OPTIONS[currentSort] || "relevance";
        const url = buildSearchUrl(currentPage, sortValue);
        const res = await fetch(url, { credentials: "include" });
        const json: SearchResponse = await res.json();
        if (json.success) {
          setItems(json.data.items || []);
          setMeta(json.data.meta);
        }
      } catch (e) {
        console.error("Search fetch failed:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [q, currentPage, currentSort, buildSearchUrl]);

  const navigateToPage = (page: number) => {
    const sp = new URLSearchParams();
    sp.set("q", q);
    sp.set("page", String(page));
    sp.set("sort", SORT_OPTIONS[currentSort] || "relevance");
    if (typeFilter !== "all") sp.set("type", typeFilter);
    router.push(`/search?${sp.toString()}`);
  };

  const handleSortChange = (label: string) => {
    setCurrentSort(label);
    setIsSortOpen(false);
    const sp = new URLSearchParams();
    sp.set("q", q);
    sp.set("page", "1");
    sp.set("sort", SORT_OPTIONS[label] || "relevance");
    if (typeFilter !== "all") sp.set("type", typeFilter);
    router.push(`/search?${sp.toString()}`);
  };

  const handleTypeFilter = (value: string) => {
    const sp = new URLSearchParams();
    sp.set("q", q);
    sp.set("page", "1");
    sp.set("sort", SORT_OPTIONS[currentSort] || "relevance");
    if (value !== "all") sp.set("type", value);
    router.push(`/search?${sp.toString()}`);
  };

  const sortPopoverItems = [
    { label: "Popular", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
    { label: "Newest First", icon: "M3 6h18M3 12h18M3 18h18" },
    { label: "Highest Rated", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
    { label: "Title A-Z", icon: "M3 6h18M3 12h18M3 18h18" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto w-full pt-8 px-8">
        <div className="flex flex-col w-full mt-8">
          <h1 className="text-[28px] font-bold text-[#0d0c22] mb-1">Search Results</h1>
          {q && <p className="text-[15px] text-[#6e6d7a] mb-6">Showing results for &quot;<span className="font-semibold text-gray-900">{q}</span>&quot;{meta.total > 0 && ` — ${meta.total} found`}</p>}

          {/* Category filter chips */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
            {ENTITY_TYPES.map((et) => (
              <button key={et.value} onClick={() => handleTypeFilter(et.value)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${typeFilter === et.value ? "bg-[#0d0c22] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
                {et.label}
              </button>
            ))}
          </div>

          {/* Sort bar */}
          <div className="flex items-center justify-between pb-2 mb-4">
            <div className="relative">
              <button onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-[14px] font-medium text-[#0d0c22] hover:border-gray-300 hover:shadow-sm transition-all bg-white">
                <span>{currentSort}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-20">
                    {sortPopoverItems.map((item) => (
                      <div key={item.label}
                        className={`px-4 py-2.5 text-[14px] hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2 ${currentSort === item.label ? "text-blue-600 font-semibold" : "text-gray-700"}`}
                        onClick={() => handleSortChange(item.label)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d={item.icon}></path></svg>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <span className="text-[13px] text-gray-400">{loading ? "Searching..." : `${filteredItems.length} results`}</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full py-16">
              <h3 className="text-[26px] font-bold text-gray-900 mb-3">No results found</h3>
              <p className="text-[15px] text-gray-600 text-center max-w-md mb-8">
                We couldn&apos;t find anything matching &quot;<span className="font-semibold text-gray-900">{q}</span>&quot;. Try different keywords.
              </p>
              <div className="flex gap-3 flex-wrap justify-center">
                <button onClick={() => router.push("/search")} className="px-6 py-3 bg-blue-600 text-white rounded-lg text-[14px] font-semibold hover:bg-blue-700 transition-colors">Clear Search</button>
                <button onClick={() => router.push("/search?q=Colleges")} className="px-6 py-3 border border-gray-200 bg-white text-gray-700 rounded-lg text-[14px] font-semibold hover:bg-gray-50 transition-colors">Browse Colleges</button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full pb-10">
                {filteredItems.map((item, idx) => (
                  <SearchResultCard key={`${item.type}-${item.id}-${idx}`} item={item} />
                ))}
              </div>
              {meta.pages > 1 && (
                <div className="flex items-center justify-center gap-2 py-8">
                  <button onClick={() => navigateToPage(currentPage - 1)} disabled={currentPage <= 1}
                    className="px-4 py-2 rounded-lg text-[14px] font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Previous</button>
                  {Array.from({ length: Math.min(meta.pages, 5) }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => navigateToPage(p)}
                      className={`w-10 h-10 rounded-lg text-[14px] font-medium transition-colors ${currentPage === p ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}>{p}</button>
                  ))}
                  <button onClick={() => navigateToPage(currentPage + 1)} disabled={currentPage >= meta.pages || currentPage >= 5}
                    className="px-4 py-2 rounded-lg text-[14px] font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function SearchLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto w-full pt-32 px-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 mb-4"></div>
          <div className="h-4 w-96 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}
