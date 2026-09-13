"use client";

import { useState, type MouseEvent, type SyntheticEvent } from "react";
import Image from "next/image";
import { getImageUrl } from "@/services/api";
import {
  Bookmark,
  MapPin,
  GraduationCap,
  Calendar,
  BadgeCheck,
  Banknote,
  Image as ImageIcon,
} from "lucide-react";
import { ScholarshipItem } from "@/services/api";

function getScholarshipDateStatus(
  startDate?: string,
  endDate?: string,
): string {
  if (!startDate && !endDate) return "Ongoing";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (startDate) {
    const start = new Date(startDate);
    if (!isNaN(start.getTime()) && start > today) return "Coming Soon";
  }

  if (endDate) {
    const end = new Date(endDate);
    if (!isNaN(end.getTime())) {
      const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      if (endDay < today) return "Closed";

      const msPerDay = 1000 * 60 * 60 * 24;
      const daysLeft = Math.round(
        (endDay.getTime() - today.getTime()) / msPerDay,
      );

      if (daysLeft <= 2) return "Ending Soon";
    }
  }

  return "Ongoing";
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Ongoing":
      return {
        statusDot: "bg-[#22c55e]",
        statusText: "text-[#22c55e]",
        statusBg: "bg-green-50",
      };
    case "Ending Soon":
      return {
        statusDot: "bg-[#eab308]",
        statusText: "text-[#eab308]",
        statusBg: "bg-yellow-50",
      };
    case "Coming Soon":
      return {
        statusDot: "bg-[#3b82f6]",
        statusText: "text-[#3b82f6]",
        statusBg: "bg-blue-50",
      };
    case "Closed":
      return {
        statusDot: "bg-gray-400",
        statusText: "text-gray-500",
        statusBg: "bg-gray-100",
      };
    default:
      return {
        statusDot: "bg-gray-400",
        statusText: "text-gray-500",
        statusBg: "bg-gray-100",
      };
  }
};

interface FinancialAidSectionProps {
  onNavigate: (view: string, data?: { [key: string]: unknown }) => void;
  scholarships?: ScholarshipItem[];
}

const FinancialAidSection: React.FC<FinancialAidSectionProps> = ({
  onNavigate,
  scholarships = [],
}) => {
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());

  const featured = scholarships.filter((s) => s.isFeatured);
  const items = featured.length > 0 ? featured.slice(0, 4) : scholarships.slice(0, 4);

  const toggleBookmark = (e: MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation();
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="mt-16 sm:mt-20 md:mt-24 w-full px-4 sm:px-6 md:px-8">
      <div className="max-w-350 mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-[26px] xs:text-3xl sm:text-4xl md:text-[40px] font-bold text-[#0f172a] mb-3 sm:mb-4 tracking-tight px-2">
            Featured Financial Aid
          </h2>
          <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#64748b] max-w-2xl mx-auto leading-relaxed px-2">
            Discover scholarships, grants, and financial support options to fund
            your academic journey.
          </p>
        </div>

        {/* Grid Container for Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {items.map((scholarship) => {
            const dateStatus = getScholarshipDateStatus(
              scholarship.start_date,
              scholarship.end_date,
            );
            const statusStyle = getStatusStyle(dateStatus);
            return (
              <div
                key={scholarship.id}
                className="relative flex flex-col bg-white rounded-md border border-gray-200/80 transition-all duration-300 p-3"
              >
                {/* Image Area */}
                <div className="h-32 w-full bg-gray-100 relative overflow-hidden rounded-md mb-3">
                  {getImageUrl(scholarship.image) ? (
                    <Image
                      src={getImageUrl(scholarship.image)}
                      alt={scholarship.title}
                      width={600}
                      height={400}
                      unoptimized
                      className="w-full h-full object-cover"
                      onError={(e: SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x400/f1f5f9/94a3b8?text=Scholarship";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full p-3 flex items-start bg-linear-to-br from-gray-200 to-gray-50">
                      <span className="text-gray-600 text-[13px] font-medium flex items-start gap-1.5 leading-snug">
                        <ImageIcon className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                        {scholarship.title || "Scholarship"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="flex flex-col grow px-1">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="group relative inline-flex">
                      <span className="text-blue-600 bg-blue-50 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide max-w-[100px] truncate inline-block">
                        {scholarship.scholarship_type || "MERIT-BASED"}
                      </span>
                      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {scholarship.scholarship_type || "MERIT-BASED"}
                        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                      </span>
                    </span>
                    <div
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${statusStyle.statusBg}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusStyle.statusDot}`}
                      ></span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide ${statusStyle.statusText}`}
                      >
                        {dateStatus}
                      </span>
                    </div>
                  </div>

                  {/* Title & Organization */}
                  <h3
                    className="font-bold text-[16px] leading-tight text-slate-900 mb-1 hover:text-brand-blue line-clamp-2"
                  >
                    {scholarship.title || "Scholarship"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[12.5px] text-gray-500 mb-3.5 line-clamp-1">
                    <span className="text-gray-500">
                      {scholarship.provider || "Tribhuvan University, Nepal"}
                    </span>
                    <BadgeCheck className="w-3.5 h-3.5 text-white fill-[#2563eb]" />
                  </div>

                  {/* Details Box */}
                  <div className="bg-[#f9fafb] rounded-md p-3.5 border border-gray-100 mb-4 mt-auto flex flex-col gap-2.5">
                    {/* Row 1: Split */}
                    <div className="grid grid-cols-2 gap-x-2">
                      <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium min-w-0">
                        <Banknote className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="group relative inline-flex">
                          <span className="max-w-[100px] truncate inline-block">
                            {scholarship.amount || "100% Tuition"}
                          </span>
                          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {scholarship.amount || "100% Tuition"}
                            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">
                          {scholarship.location || "Bagmati"}
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Level */}
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {scholarship.eligibility ||
                          "Bachelor (+2 Sci: 2.8+ GPA)"}
                      </span>
                    </div>

                    {/* Row 3: Deadline */}
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-800 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#f43f5e] shrink-0" />
                      <span className="text-red-500">
                        Deadline: {scholarship.deadline || "Aug 15, 2026"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onNavigate(
                          "scholarshipDetails",
                          scholarship as unknown as { [key: string]: unknown },
                        )
                      }
                      className="flex-1 py-2 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Details
                    </button>
                    <button className="flex-[1.2] py-2 text-[13px] font-semibold text-white bg-brand-blue rounded-md hover:bg-[#0000cc] transition-colors">
                      Apply
                    </button>
                    <button
                      className={`p-2 border rounded-md transition-colors flex items-center justify-center ${
                        bookmarked.has(scholarship.id)
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={(e) => toggleBookmark(e, scholarship.id)}
                      title={
                        bookmarked.has(scholarship.id)
                          ? "Remove Bookmark"
                          : "Bookmark"
                      }
                    >
                      <Bookmark
                        className={`w-4.5 h-4.5 ${bookmarked.has(scholarship.id) ? "text-brand-blue fill-brand-blue" : ""}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FinancialAidSection;
