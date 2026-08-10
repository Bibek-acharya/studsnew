"use client";

import { useState, type MouseEvent, type SyntheticEvent } from "react";
import Image from "next/image";
import {
  Star,
  MapPin,
  Award,
  MessageSquare,
  Bookmark,
  BadgeCheckIcon,
  Globe,
} from "lucide-react";
import { College } from "@/services/api";

interface FeaturedInstitutionsSectionProps {
  onNavigate: (view: string, data?: { [key: string]: unknown }) => void;
  featuredColleges?: College[];
}

const FeaturedInstitutionsSection: React.FC<
  FeaturedInstitutionsSectionProps
> = ({ onNavigate, featuredColleges = [] }) => {
  const [bookmarked, setBookmarked] = useState<Set<string | number>>(new Set());

  const colleges: College[] = featuredColleges;

  const toggleBookmark = (
    e: MouseEvent<HTMLButtonElement>,
    id: string | number,
  ) => {
    e.stopPropagation();
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="mt-4 sm:mt-8 md:mt-12 lg:mt-16 w-full px-4 sm:px-6 md:px-8">
      <div className="max-w-350 mx-auto w-full">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-[26px] xs:text-[30px] sm:text-3xl md:text-[36px] lg:text-[40px] font-bold text-[#111827] mb-2 sm:mb-3 tracking-tight px-2">
            Explore Featured Colleges & Universities
          </h2>
          <p className="text-[15px] sm:text-[16px] md:text-[17px] text-[#6b7280] max-w-3xl mx-auto leading-relaxed px-2">
            Compare top-rated programs and find the perfect institution for your
            academic future.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {colleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              isBookmarked={bookmarked.has(college.id)}
              onNavigate={onNavigate}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const CollegeCard: React.FC<{
  college: College;
  isBookmarked: boolean;
  onNavigate: (view: string, data?: { [key: string]: unknown }) => void;
  onToggleBookmark: (
    e: MouseEvent<HTMLButtonElement>,
    id: string | number,
  ) => void;
}> = ({ college, isBookmarked, onNavigate, onToggleBookmark }) => {
  return (
    <div
      className="bg-white rounded-xl p-4 border border-gray-200 flex flex-col h-full hover:border-blue-500/20 transition-all duration-300 cursor-pointer"
      onClick={() =>
        onNavigate("collegeDetails", { id: college.id, name: college.name })
      }
    >
      <div className="w-full h-35 rounded-md overflow-hidden mb-4 relative">
        {college.featured && (
          <div className="absolute top-3 left-3 bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-10 ">
            Featured
          </div>
        )}
        <Image
          src={
            college.card_image_url ||
            college.image_url ||
            "https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Unavailable"
          }
          alt={college.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover"
          onError={(e: SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src =
              "https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Unavailable";
          }}
        />
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <button
          type="button"
          onClick={() => onNavigate("collegeDetails", { id: college.id })}
          className="group/title relative truncate text-left text-[20px] font-bold text-slate-800 tracking-tight transition-colors hover:text-blue-600 line-clamp-2"
        >
          <span className="truncate block" title={college.name}>
            {college.name}
          </span>
          <span className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/title:visible group-hover/title:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded  whitespace-nowrap transition-all duration-200 z-50 pointer-events-none">
            {college.name}
            <span className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></span>
          </span>
        </button>
        <BadgeCheckIcon className="w-5 h-5 text-white fill-blue-500 shrink-0" />
      </div>

      <div className="flex items-center text-[14px] text-gray-500 mb-2">
        <div className="flex items-center gap-1 font-bold text-slate-700">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{college.rating || "4.5"}</span>
        </div>
        <span className="mx-3 text-gray-300 font-light">|</span>
        <div className="flex items-center gap-1.5">
          <Award className="w-4.5 h-4.5 text-gray-400" />
          <span className="font-semibold text-slate-700">
            {college.type || "Private"}
          </span>
        </div>
        <span className="mx-3 text-gray-300 font-light">|</span>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4.5 h-4.5 text-gray-400" />
          <span className="font-semibold text-slate-700">
            {college.location || "Kathmandu"}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2 text-[14px] text-gray-500 mb-2">
        <Award className="w-4.5 h-4.5 text-gray-400 shrink-0 mt-0.75" />
        <p className="leading-snug pr-4 font-semibold text-slate-700 line-clamp-1">
          {college.affiliation || "Tribhuvan University"}
        </p>
      </div>

      {college.featured && college.website && (
        <div className="flex items-center gap-2 text-[14px] text-gray-500 mb-3">
          <Globe className="w-4.5 h-4.5 text-gray-400 shrink-0" />
            <a
              href={college.website.match(/^https?:\/\//) ? college.website : `https://${college.website}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-brand-blue hover:underline font-medium truncate"
            >
              {college.website.replace(/^https?:\/\//, "")}
            </a>
        </div>
      )}

      <div className="mt-2 flex items-center gap-4 mb-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("collegeDetails", { id: college.id, tab: "admissions" });
          }}
          className="text-[12px] font-medium text-brand-blue hover:text-blue-800 flex items-center transition-colors"
        >
          Admission
          <svg
            className="w-3 h-3 ml-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 17L17 7M7 7h10v10"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("collegeDetails", { id: college.id, tab: "courses" });
          }}
          className="text-[12px] font-medium text-brand-blue hover:text-blue-800 flex items-center transition-colors"
        >
          Courses & Fees
          <svg
            className="w-3 h-3 ml-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 17L17 7M7 7h10v10"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex gap-2">
          <button
            className="bg-brand-blue flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-brand-hover text-white font-medium py-2 px-2 rounded-md transition-colors text-[13px] cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("collegeDetails", {
                id: college.id,
                name: college.name,
              });
            }}
          >
            View Details
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-slate-600 font-medium py-2 px-2 rounded-md transition-colors text-[13px]"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("campusForum", {
                collegeId: college.id,
                collegeName: college.name,
              });
            }}
          >
            <MessageSquare className="w-4 h-4 text-gray-500" />
            Inquiry
          </button>
          <button
            type="button"
            className={`w-10 flex items-center justify-center border rounded-md transition-colors shrink-0 ${
              isBookmarked
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={(e) => onToggleBookmark(e, college.id)}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
          >
            <Bookmark
              className={`w-4 h-4 transition-all ${isBookmarked ? "text-[#0000ff] fill-[#0000ff]" : "text-gray-400"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInstitutionsSection;
