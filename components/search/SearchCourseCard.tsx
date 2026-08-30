"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2, Clock, CreditCard, GraduationCap } from "lucide-react";
import type { SearchResult } from "./types";

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
  const levelText = item.institutionType || "+2(plus two)";

  return (
    <div className="bg-white rounded-xl border border-gray-200 w-full p-4 flex flex-col">
      <div className="banner-gradient rounded-lg mb-4 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[140px]">
        {item.banner || item.image ? (
          <Image
            src={item.banner || item.image}
            alt={`${item.title} banner`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-16 -mb-16 blur-2xl"></div>
          </>
        )}
        <div className={`absolute inset-0 ${item.banner || item.image ? "bg-black/35" : ""}`} />
        <div className="flex flex-1 items-center justify-center w-full relative z-10 p-6">
          <h2 className="text-white text-[1.1rem] font-bold leading-tight drop-shadow-sm">{item.title}</h2>
        </div>
        <div className="text-white/80 text-[0.55rem] relative z-10 pb-3 tracking-wide font-medium">studsphere.com</div>
      </div>

      {/* Badges and Duration Row */}
      <div className="flex justify-between items-center mb-3">
        <span className={`${getLevelColor(levelText)} text-[0.65rem] font-bold px-3 py-1 rounded-md tracking-wider`}>
          {levelText.toUpperCase()}
        </span>
        {item.duration && (
          <div className="flex items-center text-gray-500 text-xs font-medium">
            <Clock className="w-4 h-4 mr-1.5" />
            <span>{item.duration}</span>
          </div>
        )}
      </div>

      {/* Main Title */}
      <Link href={`/course-finder/${item.id}`} title={item.title} className="text-[0.95rem] font-bold text-gray-900 mb-4 leading-tight hover:text-[#0014FF] transition-colors truncate">
        {item.title}
      </Link>

      <div className="space-y-2.5 mb-5">
        {(item.university || item.nonUniversityAffiliation) && (
          <div className="flex items-center min-w-0 text-[0.8rem]">
            <Building2 className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
            <span className="font-semibold text-gray-800 mr-1">Affiliation:</span>
            <span className="text-gray-500 truncate">{item.university || item.nonUniversityAffiliation}</span>
          </div>
        )}
        {item.field && (
          <div className="flex items-center min-w-0 text-[0.8rem]">
            <GraduationCap className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
            <span className="font-semibold text-gray-800 mr-1">Field:</span>
            <span className="text-gray-500 truncate">{item.field}</span>
          </div>
        )}
        {item.estFee && (
          <div className="flex items-center min-w-0 text-[0.8rem]">
            <CreditCard className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
            <span className="font-semibold text-gray-800 mr-1">Est. Fee:</span>
            <span className="font-bold text-[#0014FF] truncate">{item.estFee}</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-300 mb-4"></div>

      {/* Action Buttons */}
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
