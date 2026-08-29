"use client";

import Link from "next/link";
import { SearchResult } from "./types";

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

function mapCategory(cat?: string): string {
  if (!cat) return "default";
  const c = cat.toLowerCase();
  for (const key of Object.keys(newsCategoryColors)) {
    if (c.includes(key)) return key;
  }
  return "default";
}

export function SearchNewsCard({ item }: { item: SearchResult }) {
  const slug = item.slug || String(item.id);
  const colorKey = mapCategory(item.institutionType);

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
        {item.description && <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.description.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()}</p>}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">{item.university || ""}</span>
          <Link href={`/news/${slug}`} className="text-sm font-semibold text-blue-600 hover:underline">View Details</Link>
        </div>
      </div>
    </article>
  );
}

export function SearchBlogCard({ item }: { item: SearchResult }) {
  const slug = item.slug || String(item.id);
  const colorKey = mapCategory(item.institutionType);

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
        {item.description && <p className="text-sm text-slate-500 line-clamp-3 mb-3">{item.description.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()}</p>}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">{item.university || ""}</span>
          <Link href={`/blogs/${slug}`} className="text-sm font-semibold text-blue-600 hover:underline">View Details</Link>
        </div>
      </div>
    </article>
  );
}

export function SearchExamCard({ item }: { item: SearchResult }) {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-4 flex flex-col h-full hover:border-blue-500/20 transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Exam</span>
        {item.institutionType && <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{item.institutionType}</span>}
      </div>
      <h3 className="font-bold text-[17px] text-slate-800 mb-1 line-clamp-2">{item.title}</h3>
      {item.description && <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{item.description.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()}</p>}
      {item.university && (
        <div className="flex items-center gap-1.5 text-[13px] text-gray-500 mb-2">
          <span className="font-semibold">{item.university}</span>
        </div>
      )}
      <div className="mt-auto pt-3 border-t border-gray-100">
        <span className="text-sm font-semibold text-blue-600">View Details</span>
      </div>
    </div>
  );
}

export function SearchAdmissionCard({ item }: { item: SearchResult }) {
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
            <span>Level: {item.institutionType}</span>
          </div>
        )}
        {item.location && (
          <div className="flex items-center gap-1.5 text-[12px] text-[#64748b] mb-2">
            <span className="truncate">{item.location}</span>
          </div>
        )}
        {item.description && (
          <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{item.description.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()}</p>
        )}
        <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#2563eb] mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Admission Open
        </div>
        <div className="mt-auto flex items-center gap-1.5">
          <Link href={`/admissions/bachelor`} className="flex-1 py-2 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 rounded-md text-[13px] font-semibold transition-colors flex justify-center items-center gap-1">
            Ask Question
          </Link>
          <Link href={`/admissions/bachelor`} className="flex-1 py-2 px-2 bg-[#0000ff] hover:bg-[#0000cc] text-white rounded-md text-[13px] font-bold transition-colors flex justify-center items-center">
            View Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
