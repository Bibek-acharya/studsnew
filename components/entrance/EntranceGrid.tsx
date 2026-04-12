import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { EntranceFilterState } from "@/app/entrance/types";
import { Exam } from "@/components/entrance/types";
import { entranceService, EntranceFilters } from "@/services/entrance.api";
import Pagination from "@/components/ui/Pagination";
import {
  BadgeCheck,
  MapPin,
  Award,
  ExternalLink,
  Bookmark,
  Clock,
  GraduationCap,
  Users,
  Bell,
  Send,
  PlayCircle,
  Flame,
  Monitor,
  Globe,
  TrendingUp,
  Building,
  BadgeCheckIcon,
} from "lucide-react";

interface EntranceGridProps {
  filters: EntranceFilterState;
  setFilters: React.Dispatch<React.SetStateAction<EntranceFilterState>>;
}

const EntranceGrid: React.FC<EntranceGridProps> = ({ filters, setFilters }) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const apiFilters: EntranceFilters = {
    search: filters.search || undefined,
    academicLevel: filters.academicLevel.length > 0 ? filters.academicLevel : undefined,
    stream: filters.stream.length > 0 ? filters.stream : undefined,
    programName: filters.programName.length > 0 ? filters.programName : undefined,
    university: filters.university.length > 0 ? filters.university : undefined,
    status: filters.status.length > 0 ? filters.status : undefined,
    quick: filters.quick.length > 0 ? filters.quick : undefined,
    sortBy: filters.sortBy || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["entrances", apiFilters, currentPage],
    queryFn: () => entranceService.getEntrances(apiFilters, currentPage, 12),
    staleTime: 5 * 60 * 1000,
  });

  const filteredExams = useMemo(() => data?.data?.entrances || [], [data]);
  const total = data?.data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / 12));
  const pagedExams = filteredExams;

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col justify-start">
            <h1 className="mb-3 text-base font-bold text-gray-900">
              {isLoading ? "Loading..." : `Showing ${total} Entrance Exams`}
            </h1>
          </div>

          <div className="mt-2 flex w-full shrink-0 flex-col gap-3 sm:mt-0 sm:w-[320px] sm:items-end">
            <div className="relative w-full">
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
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm transition-all placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {filteredExams.length === 0 && (
          <div className="col-span-1 md:col-span-2 xl:col-span-3 rounded-2xl border border-gray-100 bg-white py-16 text-center text-gray-500 shadow-[0_2px_15px_rgb(0,0,0,0.04)]">
            No entrance exams found matching your filters.
          </div>
        )}

        {pagedExams.map((exam) => (
          <EntranceCard key={exam.id} exam={exam} />
        ))}
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
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

const EntranceCard: React.FC<{ exam: Exam }> = ({ exam }) => {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked((prev) => !prev);
  };

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 flex flex-col h-full hover:border-blue-500/20 transition-all duration-300">
      <header className="flex justify-between items-start mb-4 sm:mb-5">
        <div className="flex gap-2.5 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-gray-100 flex items-center justify-center bg-white shrink-0">
            <img
              src={exam.logo}
              alt={exam.institution}
              className="w-full h-full rounded-lg object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-[13px] xs:text-[14px] sm:text-[15px] font-bold text-[#111827] flex items-center gap-1 sm:gap-1.5 min-w-0" title={exam.institution}>
              <span className="truncate">{truncateText(exam.institution, 20)}</span>
              {exam.verified && (
                <BadgeCheckIcon className="w-3.25 h-3.25 sm:w-3.75 sm:h-3.75 text-white fill-blue-500 ml-0.5 sm:ml-1 shrink-0" />
              )}
            </h3>
            <div className="flex flex-col gap-1 text-[10px] xs:text-[11px] sm:text-[11px] text-[#6b7280] mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                <span className="truncate" title={exam.location}>{exam.location}</span>
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                <span className="truncate" title={exam.affiliation}>{exam.affiliation}</span>
              </span>
            </div>
            <a
              href="#"
              className="text-[#2563eb] text-[10px] xs:text-[11px] sm:text-[11px] font-medium mt-0.5 sm:mt-1 flex items-center gap-1 hover:underline"
            >
              <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{" "}
              {exam.website}
            </a>
          </div>
        </div>
        <div className="w-8 h-8 opacity-0"></div>
      </header>

      <main className="grow">
        <h4
          className="text-[15px] xs:text-[16px] sm:text-[17px] font-bold text-[#111827] mb-2.5 sm:mb-3 leading-tight cursor-pointer hover:text-brand-blue transition-colors truncate"
          onClick={() => router.push(`/entrance/${exam.id}`)}
          title={exam.title}
        >
          {exam.title}
        </h4>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {exam.tags.map((tag, tIdx) => (
            <span
              key={tIdx}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[9px] xs:text-[10px] sm:text-[10px] font-bold flex items-center gap-1 sm:gap-1.5 ${
                tag.type === "alert"
                  ? "bg-red-50 text-red-500"
                  : tag.type === "warning"
                    ? "bg-amber-50 text-amber-600"
                    : tag.type === "success"
                      ? "bg-emerald-50 text-emerald-600"
                      : tag.type === "purple"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-gray-50 text-gray-600"
              }`}
            >
              {iconMap[tag.icon]} {tag.text}
            </span>
          ))}
        </div>

        <div className="bg-[#f8fafc] rounded-lg sm:rounded-xl p-2 sm:p-2.5 flex flex-col gap-1.5 sm:gap-2 mt-auto border border-[#f1f5f9]">
          <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] xs:text-[12px] sm:text-[13px] text-[#475569]">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94a3b8] shrink-0" />
            <span className="truncate font-medium text-red-500 text-[11px] sm:text-[12px]">
              Ends: {exam.deadline}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] xs:text-[12px] sm:text-[13px] text-[#475569]">
            <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94a3b8] shrink-0" />
            <span className="truncate text-[11px] sm:text-[12px]">
              {exam.eligibility}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] xs:text-[12px] sm:text-[13px] text-[#475569]">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94a3b8] shrink-0" />
            <div className="flex gap-1.5 sm:gap-2 text-[10px] sm:text-[11px]">
              <a
                href={exam.whatsapp}
                className="text-[#059669] hover:underline font-bold"
              >
                WhatsApp
              </a>
              <span className="text-gray-300">|</span>
              <a
                href={exam.viber}
                className="text-[#6d28d9] hover:underline font-bold"
              >
                Viber
              </a>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-3 sm:mt-4 pt-1 flex flex-col gap-2 sm:gap-2.5">
        <button
          onClick={() => router.push(`/entrance/${exam.id}`)}
          className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 bg-brand-blue text-white font-bold text-[12px] sm:text-[13px] rounded-lg hover:bg-brand-hover transition-colors shadow-sm"
        >
          <PlayCircle className="w-4 h-4" /> Start Mock Test
        </button>
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 sm:gap-2.5">
          <button className="flex items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 border border-[#e2e8f0] text-[#475569] font-bold text-[11px] xs:text-[12px] rounded-lg hover:bg-gray-50 transition-colors">
            <Bell className="w-3.5 h-3.5" /> <span>Notify</span>
          </button>
          <button
            onClick={() => router.push(`/entrance/${exam.id}`)}
            className="flex items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 border border-[#e2e8f0] text-[#475569] font-bold text-[11px] xs:text-[12px] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Send className="w-3.5 h-3.5" /> Apply
          </button>
          <button
            className={`w-9 sm:w-10 shrink-0 rounded-lg flex items-center justify-center transition-all duration-200 ${
              bookmarked
                ? "border-blue-200 bg-blue-50"
                : "bg-white border border-[#e2e8f0] text-[#94a3b8] hover:bg-[#f8fafc] hover:text-[#64748b]"
            }`}
            title={bookmarked ? "Remove Bookmark" : "Bookmark"}
            onClick={toggleBookmark}
          >
            <Bookmark
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${bookmarked ? "text-[#0000ff] fill-[#0000ff]" : ""}`}
            />
          </button>
        </div>
      </div>
    </article>
  );
};

export default EntranceGrid;
