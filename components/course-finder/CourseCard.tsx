"use client";

import { Bookmark, Building2, Clock, CreditCard, GraduationCap } from "lucide-react";

export interface CourseCardData {
  id: number;
  title: string;
  level?: string;
  duration?: string;
  affiliation?: string;
  field?: string;
  estFee?: string;
}

interface CourseCardProps {
  course: CourseCardData;
  onDetails: () => void;
  onViewColleges: () => void;
  onToggleSaved?: () => void;
  isSaved?: boolean;
  isBookmarkPending?: boolean;
}

const levelBadgeColor = () => "bg-[#FDE8EE] text-[#D11D5A]";

export default function CourseCard({
  course,
  onDetails,
  onViewColleges,
  onToggleSaved,
  isSaved = false,
  isBookmarkPending = false,
}: CourseCardProps) {
  const levelText = course.level || "+2(plus two)";

  return (
    <div className="flex w-full flex-col rounded-xl border border-gray-200 bg-white p-4">
      <div className="relative mb-4 flex min-h-[140px] flex-col items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#1126ef] to-[#0014FF] p-6 text-center">
        <div className="absolute -mr-10 -mt-10 right-0 top-0 h-32 w-32 rounded-full bg-white opacity-5 blur-xl" />
        <div className="absolute -mb-16 -ml-16 bottom-0 left-0 h-40 w-40 rounded-full bg-white opacity-5 blur-2xl" />
        <div className="relative z-10 flex w-full flex-1 items-center justify-center">
          <h2 className="text-[1.1rem] font-bold leading-tight text-white">{course.title}</h2>
        </div>
        <div className="relative z-10 pt-2 text-[0.55rem] font-medium tracking-wide text-white/80">studsphere.com</div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <span className={`${levelBadgeColor()} max-w-[65%] truncate rounded-md px-3 py-1 text-[0.65rem] font-bold tracking-wider`} title={levelText}>
          {levelText.toUpperCase()}
        </span>
        <div className="flex shrink-0 items-center text-xs font-medium text-gray-500">
          <Clock className="mr-1.5 h-4 w-4" />
          <span>{course.duration || "4 Years"}</span>
        </div>
      </div>

      <button
        type="button"
        title={course.title}
        onClick={onDetails}
        className="mb-4 truncate text-left text-[0.95rem] font-bold leading-tight text-gray-900 transition-colors hover:text-[#0014FF]"
      >
        {course.title}
      </button>

      <div className="mb-5 space-y-2.5">
        <CourseDetail icon={Building2} label="Affiliation" value={course.affiliation || "-"} />
        <CourseDetail icon={GraduationCap} label="Field" value={course.field || "-"} />
        <CourseDetail icon={CreditCard} label="Est. Fee" value={course.estFee || "-"} highlight />
      </div>

      <div className="mb-4 border-t border-dashed border-gray-300" />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDetails}
          className="flex-1 rounded border border-gray-300 bg-white px-4 py-2.5 text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Details
        </button>
        <button
          type="button"
          onClick={onViewColleges}
          className="flex-[1.5] rounded bg-[#0014FF] px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#0014FF] focus:ring-offset-1"
        >
          View Colleges
        </button>
        {onToggleSaved && (
          <button
            type="button"
            disabled={isBookmarkPending}
            onClick={(event) => {
              event.stopPropagation();
              onToggleSaved();
            }}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded border border-gray-300 bg-white text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-60"
            aria-label={isSaved ? "Remove course bookmark" : "Save course"}
            title={isSaved ? "Remove bookmark" : "Save course"}
          >
            {isBookmarkPending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500" />
            ) : (
              <Bookmark className={`h-5 w-5 transition-all ${isSaved ? "fill-[#0014FF] text-[#0014FF]" : "text-gray-400"}`} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function CourseDetail({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center overflow-hidden whitespace-nowrap">
      <div className="flex w-6 shrink-0 justify-center">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div className="min-w-0 overflow-hidden text-[0.8rem]">
        <span className="font-semibold text-gray-800">{label}:</span>{" "}
        <span title={value} className={`truncate ${highlight ? "font-bold text-[#0014FF]" : "text-gray-500"}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
