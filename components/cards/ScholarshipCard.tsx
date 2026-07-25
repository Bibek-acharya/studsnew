"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Banknote,
  MapPin,
  GraduationCap,
  Calendar,
  BadgeCheck,
  Bookmark,
  Image as ImageIcon,
} from "lucide-react";

interface ScholarshipData {
  id: number;
  slug?: string;
  title: string;
  org: string;
  providerId?: number;
  badgeType?: string;
  fundingType?: string;
  location?: string;
  eligibility?: string;
  deadline?: string;
  imageUrl?: string;
  imagePlaceholder?: string;
  startDate?: string;
  endDate?: string;
}

interface ScholarshipCardProps {
  scholarship: ScholarshipData;
  isSaved?: boolean;
  isQuickApplyMode?: boolean;
  isSelected?: boolean;
  onToggleSaved?: () => void;
  onToggleSelection?: () => void;
}

export function ScholarshipCard({
  scholarship,
  isSaved = false,
  isQuickApplyMode = false,
  isSelected = false,
  onToggleSaved,
  onToggleSelection,
}: ScholarshipCardProps) {
  const router = useRouter();

  const imageHtml = scholarship.imageUrl ? (
    <img
      src={scholarship.imageUrl}
      alt={scholarship.title}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full p-3 flex items-start bg-linear-to-br from-gray-200 to-gray-50">
      <span className="text-gray-600 text-[13px] font-medium flex items-start gap-1.5 leading-snug">
        <ImageIcon className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
        {scholarship.title}
      </span>
    </div>
  );

  return (
    <div className="relative flex flex-col bg-white rounded-md border border-gray-200/80 transition-all duration-300 p-3 h-full">
      {isQuickApplyMode && (
        <div
          className="absolute top-3 right-3 z-10 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSelection?.();
          }}
        >
          <div className="relative flex h-5 w-5 items-center justify-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              className="peer sr-only"
            />
            <div className="absolute inset-0 rounded-sm border-[1.5px] border-slate-300 bg-white transition-colors peer-checked:border-brand-blue peer-checked:bg-brand-blue"></div>
            <svg
              className="pointer-events-none absolute z-10 h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}

      <div className="h-32 w-full bg-gray-100 relative overflow-hidden rounded-md mb-3">
        {imageHtml}
      </div>

      <div className="flex flex-col grow px-1">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-blue-600 bg-blue-50 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
            {scholarship.badgeType || "Scholarship"}
          </span>
        </div>

        <h3 className="font-bold text-[16px] leading-tight text-slate-900 mb-1 line-clamp-2">
          {scholarship.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[12.5px] text-gray-500 mb-3.5 line-clamp-1">
          {scholarship.providerId ? (
            <Link
              href={`/providers/${scholarship.providerId}`}
              className="hover:text-blue-600 transition-colors"
            >
              {scholarship.org}
            </Link>
          ) : (
            <span>{scholarship.org}</span>
          )}
          <BadgeCheck className="w-3.5 h-3.5 text-white fill-[#2563eb]" />
        </div>

        <div className="bg-[#f9fafb] rounded-md p-3.5 border border-gray-100 mb-4 mt-auto flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-x-2">
            <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium min-w-0">
              <Banknote className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">
                {scholarship.fundingType || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{scholarship.location || "N/A"}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{scholarship.eligibility || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-gray-800 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#f43f5e] shrink-0" />
            <span className="text-red-500">
              Deadline: {scholarship.deadline || "N/A"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              router.push(
                `/scholarship-finder/${scholarship.slug || scholarship.id}`,
              )
            }
            className="flex-1 py-2 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            Details
          </button>
          <button
            onClick={() =>
              router.push(
                `/scholarship-finder/apply/${scholarship.slug || scholarship.id}`,
              )
            }
            className="flex-[1.2] py-2 text-[13px] font-semibold text-white bg-brand-blue rounded-md hover:bg-brand-hover transition-colors"
          >
            Apply
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSaved?.();
            }}
            className={`p-2 border rounded-md transition-colors flex items-center justify-center ${isSaved ? "border-blue-200 bg-blue-50" : "border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
            title={isSaved ? "Remove Bookmark" : "Bookmark"}
          >
            <Bookmark
              className={`w-4.5 h-4.5 ${isSaved ? "text-brand-blue fill-brand-blue" : ""}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
