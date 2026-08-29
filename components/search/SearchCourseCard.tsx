"use client";

import Link from "next/link";
import { Clock, Building2 } from "lucide-react";
import { SearchResult } from "./types";

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

export default function SearchCourseCard({ item }: { item: SearchResult }) {
  const levelText = item.institutionType || "Course";

  return (
    <div className="bg-white rounded-xl border border-gray-200 w-full p-4 flex flex-col">
      <div className="rounded-lg p-6 mb-4 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[140px] bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-16 -mb-16 blur-2xl"></div>
        <div className="flex-1 flex items-center justify-center w-full relative z-10">
          <h2 className="text-white text-[1.1rem] font-bold leading-tight">{item.title}</h2>
        </div>
        <div className="text-white/80 text-[0.55rem] relative z-10 pt-2 tracking-wide font-medium">studsphere.com</div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className={`${getLevelColor(levelText)} text-[0.65rem] font-bold px-3 py-1 rounded-md tracking-wider`}>
          {levelText.toUpperCase()}
        </span>
      </div>

      <h3 title={item.title} className="text-[0.95rem] font-bold text-gray-900 mb-4 leading-tight line-clamp-2">{item.title}</h3>

      {item.description && (
        <p className="text-[0.8rem] text-gray-500 mb-4 line-clamp-2">{item.description.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()}</p>
      )}

      <div className="border-t border-dashed border-gray-300 mb-4"></div>

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
