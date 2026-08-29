"use client";

import Link from "next/link";
import { Banknote, MapPin, GraduationCap, Calendar } from "lucide-react";
import { SearchResult } from "./types";

export default function SearchScholarshipCard({ item }: { item: SearchResult }) {
  const slug = item.slug || String(item.id);

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
          <span className="text-blue-600 bg-blue-50 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
            {item.institutionType || "Scholarship"}
          </span>
        </div>
        <h3 className="font-bold text-[16px] leading-tight text-slate-900 mb-1 line-clamp-2">{item.title}</h3>
        {item.university && (
          <div className="flex items-center gap-1.5 text-[12.5px] text-gray-500 mb-2">
            <span>{item.university}</span>
          </div>
        )}
        {item.description && (
          <p className="text-[13px] text-gray-500 line-clamp-2 mb-3">{item.description.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()}</p>
        )}
        <div className="bg-[#f9fafb] rounded-md p-3 border border-gray-100 mb-3 mt-auto flex flex-col gap-2">
          {item.location && (
            <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/scholarship-finder/${slug}`} className="flex-1 py-2 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-center">
            Details
          </Link>
          <Link href={`/scholarship-finder/apply/${slug}`} className="flex-[1.2] py-2 text-[13px] font-semibold text-white bg-[#0000ff] rounded-md hover:bg-[#0000cc] transition-colors text-center">
            Apply
          </Link>
        </div>
      </div>
    </div>
  );
}
