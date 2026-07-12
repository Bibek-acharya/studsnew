import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { EntranceFilterState } from "@/app/entrance/types";
import { Exam } from "@/components/entrance/types";
import { entranceService, EntranceFilters } from "@/services/entrance.api";
import { apiService } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import Pagination from "@/components/ui/Pagination";
import { EntranceAds } from "./ads/EntranceAds";
import { ApplicationAds } from "./ads/ApplicationAds";
import {
  BadgeCheck,
  MapPin,
  Award,
  ExternalLink,
  Bookmark,
  Clock,
  GraduationCap,
  Bell,
  Send,
  Flame,
  Monitor,
  Globe,
  TrendingUp,
  Building,
  FileText,
  Banknote,
  Calendar,
} from "lucide-react";
import { FaSliders } from "react-icons/fa6";

interface EntranceGridProps {
  filters: EntranceFilterState;
  setFilters: React.Dispatch<React.SetStateAction<EntranceFilterState>>;
  onMobileFilterClick?: () => void;
}

const EntranceGrid: React.FC<EntranceGridProps> = ({
  filters,
  setFilters,
  onMobileFilterClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [bookmarkMap, setBookmarkMap] = useState<Record<number, number>>({});
  const [pendingBookmarks, setPendingBookmarks] = useState<
    Record<number, boolean>
  >({});
  const { isAuthenticated } = useAuth();

  const toggleSaved = async (examId: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to save bookmarks");
      return;
    }
    if (pendingBookmarks[examId]) return;
    setPendingBookmarks((prev) => ({ ...prev, [examId]: true }));
    const existingBookmarkId = bookmarkMap[examId];
    try {
      if (existingBookmarkId) {
        await apiService.deleteBookmark(existingBookmarkId);
        setBookmarkMap((prev) => {
          const n = { ...prev };
          delete n[examId];
          return n;
        });
        setSavedIds((prev) => prev.filter((id) => id !== examId));
        toast.success("Removed from bookmarks");
      } else {
        const res = await apiService.createBookmark(examId, "entrance");
        setBookmarkMap((prev) => ({ ...prev, [examId]: res.data.id }));
        setSavedIds((prev) => [...prev, examId]);
        toast.success("Added to bookmarks!");
      }
    } catch {
      toast.error("Failed to save bookmark");
    } finally {
      setPendingBookmarks((prev) => {
        const n = { ...prev };
        delete n[examId];
        return n;
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    apiService
      .getBookmarksByType("entrance")
      .then((items) => {
        const ids: number[] = [];
        const map: Record<number, number> = {};
        items.forEach((b) => {
          ids.push(b.item_id);
          map[b.item_id] = b.id;
        });
        setSavedIds(ids);
        setBookmarkMap(map);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const apiFilters: EntranceFilters = {
    search: filters.search || undefined,
    academicLevel:
      filters.academicLevel.length > 0 ? filters.academicLevel : undefined,
    stream: filters.stream.length > 0 ? filters.stream : undefined,
    status: filters.status.length > 0 ? filters.status : undefined,
    sortBy: filters.sortBy || undefined,
    location: filters.location || undefined,
    institutionType:
      filters.institutionType.length > 0 ? filters.institutionType : undefined,
    province: filters.province.length > 0 ? filters.province : undefined,
    district: filters.district.length > 0 ? filters.district : undefined,
    localLevel: filters.localLevel.length > 0 ? filters.localLevel : undefined,
    applicationFee:
      filters.applicationFee.length > 0 ? filters.applicationFee : undefined,
    scholarship:
      filters.scholarship.length > 0 ? filters.scholarship : undefined,
    gpa: filters.gpa.length > 0 ? [filters.gpa] : undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["entrances", apiFilters, currentPage],
    queryFn: () => entranceService.getEntrances(apiFilters, currentPage, 18),
    staleTime: 5 * 60 * 1000,
  });

  const filteredExams = useMemo(() => {
    const entrances = data?.data?.entrances || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return entrances.filter((exam) => {
      const endDateStr = exam.deadline || exam.examDate;
      if (!endDateStr) return true;
      const endDate = new Date(endDateStr);
      endDate.setHours(0, 0, 0, 0);
      return endDate >= today;
    });
  }, [data]);
  const total = data?.data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / 18));
  const pagedExams = filteredExams;

  const startItem = (currentPage - 1) * 18 + 1;
  const endItem = Math.min(currentPage * 18, total);

  const showEntranceAds = currentPage === 1 && filteredExams.length >= 6;
  const showApplicationAds = currentPage === 1 && filteredExams.length >= 12;

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col justify-start">
            <h1 className="mb-3 text-base text-gray-900">
              {total === 0 ? (
                <>
                  0 of 0 <span className="font-bold">Entrance Exams</span>
                </>
              ) : (
                <>
                  Showing {startItem} to {endItem} of {total}{" "}
                  <span className="font-bold">Entrance Exams</span>
                </>
              )}
            </h1>
          </div>

          <div className="flex w-full flex-row items-center gap-3 sm:w-[320px] sm:flex-col sm:items-end">
            <div className="relative flex-1 sm:w-full">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
              <input
                type="text"
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }))
                }
                placeholder="Search exams, universities..."
                className="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm transition-all placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            {onMobileFilterClick && (
              <button
                type="button"
                onClick={onMobileFilterClick}
                className="lg:hidden inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <FaSliders className="h-4 w-4" />
                Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {isLoading ? (
          <div className="col-span-full rounded-md border border-gray-100 bg-white py-16 text-center text-gray-500 shadow-[0_2px_15px_rgb(0,0,0,0.04)]">
            Loading entrance exams...
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="col-span-full rounded-md border border-gray-100 bg-white py-16 text-center text-gray-500 shadow-[0_2px_15px_rgb(0,0,0,0.04)]">
            No entrance exams found matching your filters.
          </div>
        ) : (
          pagedExams.map((exam, index) => (
            <React.Fragment key={exam.id}>
              <EntranceCard
                exam={exam}
                isSaved={savedIds.includes(exam.numericId)}
                isPending={!!pendingBookmarks[exam.numericId]}
                onToggleSaved={(e) => {
                  e.stopPropagation();
                  toggleSaved(exam.numericId);
                }}
              />
              {showEntranceAds && index === 5 && (
                <div className="col-span-full -mx-2">
                  <EntranceAds />
                </div>
              )}
              {showApplicationAds && index === 11 && (
                <div className="col-span-full -mx-2">
                  <ApplicationAds />
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

const iconMap: Record<string, React.ReactNode> = {
  flame: <Flame className="w-3 h-3" />,
  monitor: <Monitor className="w-3 h-3" />,
  globe: <Globe className="w-3 h-3" />,
  "trending-up": <TrendingUp className="w-3 h-3" />,
  building: <Building className="w-3 h-3" />,
  award: <Award className="w-3 h-3" />,
  "badge-check": <BadgeCheck className="w-3 h-3" />,
};

const truncateText = (text: string, maxLength: number) => {
  if (!text || text.length <= maxLength) return text || "";
  return text.slice(0, maxLength) + "...";
};

const formatDateExact = (dateStr: string) => {
  if (!dateStr) return "TBA";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
};

const formatFee = (fee: string | undefined) => {
  if (!fee) return "TBA";
  const trimmed = fee.trim();
  if (
    trimmed.toLowerCase().includes("rs") ||
    trimmed.toLowerCase().includes("rupee")
  ) {
    return trimmed;
  }
  return `Rs. ${trimmed}`;
};

export const EntranceCard: React.FC<{
  exam: Exam;
  isSaved: boolean;
  isPending: boolean;
  onToggleSaved: (e: React.MouseEvent) => void;
}> = ({ exam, isSaved, isPending, onToggleSaved }) => {
  const router = useRouter();

  const getStatusConfig = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "published" || s === "ongoing" || s === "open") {
      return {
        text: "ONGOING",
        bg: "bg-[#ecfdf5]",
        textCol: "text-[#059669]",
        dotCol: "bg-[#10b981]",
      };
    }
    if (s === "draft" || s === "upcoming") {
      return {
        text: "UPCOMING",
        bg: "bg-[#fff7ed]",
        textCol: "text-[#ea580c]",
        dotCol: "bg-[#f97316]",
      };
    }
    return {
      text: "CLOSED",
      bg: "bg-[#fef2f2]",
      textCol: "text-[#dc2626]",
      dotCol: "bg-[#ef4444]",
    };
  };

  const getModeText = (mode: string | undefined) => {
    const m = (mode || "").toLowerCase();
    if (m === "online") return "Online";
    if (m === "offline") return "Offline";
    if (m === "hybrid") return "Hybrid";
    return mode || "Online";
  };

  const getScopeText = (scope: string | undefined) => {
    const s = (scope || "").toLowerCase();
    if (s === "nationwide" || s === "national") return "National";
    if (s === "province-wide" || s === "provincial") return "Provincial";
    if (s === "district-level" || s === "district") return "District";
    if (s === "regional") return "Regional";
    if (s === "college-specific") return "College Specific";
    if (s === "university-wide") return "University Wide";
    if (s === "campus-specific") return "Campus Specific";
    return scope || "National";
  };

  const statusConfig = getStatusConfig(exam.status);

  return (
    <article className="bg-white rounded-[16px] p-4 border border-[#e2e8f0] flex flex-col h-full hover:shadow-md transition-all duration-300 overflow-visible relative">
      <header className="flex gap-3 items-start mb-3">
        {/* Logo Container */}
        <div className="w-[56px] h-[56px] rounded-xl border border-[#f1f5f9] flex items-center justify-center bg-white p-1 shrink-0 shadow-sm">
          <img
            src={exam.logo}
            alt={exam.institution}
            className="w-full h-full rounded-lg object-contain"
          />
        </div>

        {/* Institution details */}
        <div className="flex flex-col min-w-0 flex-1 pt-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="group relative text-[15px] font-bold text-[#0f172a] truncate">
              {exam.institution}
              {/* Tooltip */}
              <div className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded whitespace-nowrap transition-all duration-200 z-50 pointer-events-none">
                {exam.institution}
                <div className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></div>
              </div>
            </h3>
            {exam.verified && (
              <svg
                className="w-[18px] h-[18px] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" fill="#3b82f6" />
                <path
                  d="M8.5 12.5L11 15L16 9"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          {/* Location and Affiliation */}
          <div className="flex items-center gap-1.5 text-xs text-[#64748b] mt-1 flex-wrap font-medium">
            {exam.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                <span className="truncate" title={exam.location}>
                  {exam.location}
                </span>
              </span>
            )}
            {exam.location && exam.affiliation && (
              <span className="text-[#cbd5e1]">•</span>
            )}
            {exam.affiliation && (
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                <span className="truncate" title={exam.affiliation}>
                  {exam.affiliation}
                </span>
              </span>
            )}
          </div>

          {/* Website Link */}
          {exam.website && (
            <a
              href={
                exam.website.startsWith("http")
                  ? exam.website
                  : `https://${exam.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2563eb] text-xs font-semibold mt-1.5 flex items-center gap-1 hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {exam.website}
            </a>
          )}
        </div>
      </header>

      <main className="grow overflow-visible flex flex-col">
        {/* Title */}
        <h4
          className="group relative text-[15px] font-bold text-[#0f172a] mb-3 leading-snug cursor-pointer hover:text-brand-blue transition-colors"
          onClick={() => router.push(`/entrance/${exam.id}`)}
        >
          <span className="block truncate">{exam.title}</span>
          <div className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded whitespace-nowrap transition-all duration-200 z-50 pointer-events-none">
            {exam.title}
            <div className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></div>
          </div>
        </h4>

        {/* Badges row */}
        <div className="flex flex-nowrap gap-1.5 mb-3">
          <span
            className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 truncate ${statusConfig.bg} ${statusConfig.textCol}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusConfig.dotCol}`}
            />
            <span className="truncate">{statusConfig.text}</span>
          </span>
          <span className="px-2 py-1 rounded-md text-[10px] font-bold text-[#475569] bg-[#f8fafc] border border-[#f1f5f9] flex items-center gap-1 truncate">
            <Monitor className="w-3 h-3 text-[#64748b] shrink-0" />
            <span className="truncate">{getModeText(exam.examMode)}</span>
          </span>
          <span className="px-2 py-1 rounded-md text-[10px] font-bold text-[#475569] bg-[#f8fafc] border border-[#f1f5f9] flex items-center gap-1 truncate">
            <Globe className="w-3 h-3 text-[#64748b] shrink-0" />
            <span className="truncate">{getScopeText(exam.examScope)}</span>
          </span>
        </div>

        {/* Gray details container */}
        <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-lg p-3 flex flex-col gap-2 mb-3 mt-auto">
          {/* Ends Row */}
          <div className="flex items-center gap-2 text-[13px] text-[#475569]">
            <Clock className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
            <span className="font-semibold text-[#ef4444] text-[12px]">
              Deadline: {formatDateExact(exam.deadline)}
            </span>
          </div>

          {/* Exam Date Row */}
          <div className="flex items-center gap-2 text-[13px] text-[#475569]">
            <Calendar className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
            <span className="font-semibold text-[#1e293b] text-[12px]">
              Exam: {formatDateExact(exam.examDate) || "TBA"}
            </span>
          </div>

          {/* Eligibility Row */}
          <div className="flex items-center gap-2 text-[13px] text-[#475569]">
            <GraduationCap className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
            <span
              className="font-semibold text-[#1e293b] text-[12px] truncate"
              title={exam.eligibilityList?.[0]?.title || exam.eligibility || ""}
            >
              {exam.eligibilityList?.[0]?.title || exam.eligibility || "TBA"}
            </span>
          </div>

          {/* Fee Row */}
          <div className="flex items-center gap-2 text-[13px] text-[#475569]">
            <Banknote className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
            <span className="font-semibold text-[#1e293b] text-[12px]">
              Application Fee: {formatFee(exam.applicationFee)}
            </span>
          </div>
        </div>
      </main>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => {
            if (exam.applicationLink) {
              window.open(
                exam.applicationLink,
                "_blank",
                "noopener,noreferrer",
              );
            } else {
              router.push(`/entrance/${exam.id}`);
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#1b52e8] text-white font-bold text-[13px] rounded-lg hover:bg-[#1b52e8]/90 transition-colors shadow-sm"
        >
          <Send className="w-3.5 h-3.5 rotate-45 -translate-y-0.5" /> Apply Now
        </button>
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <button
            onClick={() => router.push(`/entrance/${exam.id}`)}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 border border-[#cbd5e1] text-[#475569] font-bold text-[11px] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> <span>View Detailed</span>
          </button>
          <button
            onClick={() => router.push(`/entrance/${exam.id}`)}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 border border-[#cbd5e1] text-[#475569] font-bold text-[11px] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Bell className="w-3.5 h-3.5" /> Notify
          </button>
          <button
            disabled={isPending}
            className={`w-[40px] h-[36px] shrink-0 rounded-lg flex items-center justify-center transition-all duration-200 ${
              isPending
                ? "bg-gray-50 border border-gray-100 cursor-not-allowed"
                : isSaved
                  ? "border-blue-200 bg-blue-50"
                  : "bg-white border border-[#cbd5e1] text-[#94a3b8] hover:bg-[#f8fafc] hover:text-[#64748b]"
            }`}
            title={isSaved ? "Remove Bookmark" : "Bookmark"}
            onClick={isPending ? undefined : onToggleSaved}
          >
            {isPending ? (
              <svg
                className="w-3.5 h-3.5 animate-spin text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <Bookmark
                className={`w-3.5 h-3.5 ${isSaved ? "text-[#2563eb] fill-[#2563eb]" : ""}`}
              />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default EntranceGrid;
