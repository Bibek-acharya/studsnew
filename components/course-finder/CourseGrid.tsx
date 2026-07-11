import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Clock,
  Building2,
  GraduationCap,
  ClipboardCheck,
  CreditCard,
  Briefcase,
  Bookmark,
} from "lucide-react";
import { EducationCourse, apiService } from "../../services/api";
import { useAuth } from "@/services/AuthContext";
import { CourseFinderFilters } from "./types";
import Pagination from "@/components/ui/Pagination";
import { mockCourses } from "./mockCourses";
import CourseCarouselAd from "./ads/CourseCarouselAd";
import KistProgramsAd from "./ads/KistProgramsAd";
import SudsphereBannerAd from "./ads/SudsphereBannerAd";

interface CourseGridProps {
  onNavigate: (view: any, data?: any) => void;
  courses: EducationCourse[];
  totalCourses: number;
  isLoading?: boolean;
  filters: CourseFinderFilters;
  onFiltersChange: (next: CourseFinderFilters) => void;
}

const COURSES_PER_PAGE = 18;

const levelBadgeColor = (level?: string) => {
  const l = (level || "").toLowerCase();
  if (
    l.includes("+2") ||
    l.includes("plus two") ||
    l.includes("higher secondary")
  )
    return "bg-[#7c3aed]/10 text-[#7c3aed]";
  if (l.includes("bachelor") || l.includes("bach") || l.includes("diploma"))
    return "bg-[#db2777]/10 text-[#db2777]";
  if (l.includes("master") || l.includes("post"))
    return "bg-[#ea580c]/10 text-[#ea580c]";
  return "bg-gray-100 text-gray-600";
};

const CourseGrid: React.FC<CourseGridProps> = ({
  onNavigate,
  courses,
  isLoading,
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [savedCourseIds, setSavedCourseIds] = useState<number[]>([]);
  const [bookmarkMap, setBookmarkMap] = useState<Record<number, number>>({});
  const [pendingBookmarks, setPendingBookmarks] = useState<
    Record<number, boolean>
  >({});

  const ads = [
    <CourseCarouselAd key="0" />,
    <KistProgramsAd key="1" />,
    <SudsphereBannerAd key="2" />,
  ];

  const toggleSaved = async (courseId: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to save bookmarks");
      return;
    }
    if (pendingBookmarks[courseId]) return;
    setPendingBookmarks((prev) => ({ ...prev, [courseId]: true }));
    const existingBookmarkId = bookmarkMap[courseId];
    try {
      if (existingBookmarkId) {
        await apiService.deleteBookmark(existingBookmarkId);
        setBookmarkMap((prev) => {
          const n = { ...prev };
          delete n[courseId];
          return n;
        });
        setSavedCourseIds((prev) => prev.filter((id) => id !== courseId));
        toast.success("Removed from bookmarks");
      } else {
        const res = await apiService.createBookmark(courseId, "courses");
        setBookmarkMap((prev) => ({ ...prev, [courseId]: res.data.id }));
        setSavedCourseIds((prev) => [...prev, courseId]);
        toast.success("Added to bookmarks!");
      }
    } catch {
      toast.error("Failed to save bookmark");
    } finally {
      setPendingBookmarks((prev) => {
        const n = { ...prev };
        delete n[courseId];
        return n;
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    apiService
      .getBookmarksByType("courses")
      .then((items) => {
        const ids: number[] = [];
        const map: Record<number, number> = {};
        items.forEach((b) => {
          ids.push(b.item_id);
          map[b.item_id] = b.id;
        });
        setSavedCourseIds(ids);
        setBookmarkMap(map);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const allCourses = useMemo(() => {
    if (courses.length > 0) return courses;
    return mockCourses;
  }, [courses]);

  const totalPages = Math.ceil(allCourses.length / COURSES_PER_PAGE);
  const currentCourses = useMemo(() => {
    const start = (currentPage - 1) * COURSES_PER_PAGE;
    return allCourses.slice(start, start + COURSES_PER_PAGE);
  }, [allCourses, currentPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(COURSES_PER_PAGE)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white rounded-md border border-gray-100 h-95"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <style>{`
        .custom-tooltip {
          position: absolute;
          bottom: 100%;
          left: 0;
          margin-bottom: 8px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s;
          z-index: 20;
          width: auto;
          max-width: 200px;
          background-color: #111827;
          color: white;
          font-size: 11px;
          font-weight: 500;
          padding: 6px 10px;
          border-radius: 6px;
          pointer-events: none;
          transform: translateY(4px);
        }
        .group:hover .custom-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(-4px);
        }
        .tooltip-arrow {
          position: absolute;
          top: 100%;
          left: 16px;
          border-width: 5px;
          border-style: solid;
          border-color: #111827 transparent transparent transparent;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentCourses.map((course, index) => {
          const levelText = course.level || "+2(plus two)";

          return (
            <React.Fragment key={course.id || index}>
              <div className="bg-white rounded-md border border-gray-200 flex flex-col relative transition-all hover:border-blue-500/20 duration-300">
                {/* Image Area - Reduced height and padding */}
                <div className="relative h-28 w-full p-3 pb-2">
                  <img
                    src={
                      course.image ||
                      `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=200`
                    }
                    alt={course.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Content Area - Reduced paddings */}
                <div className="px-3 pb-3 pt-0 flex-1 flex flex-col">
                  {/* Level & Duration */}
                  <div className="flex justify-between items-center mb-1.5 text-[12px] font-bold">
                    <span
                      className={`${levelBadgeColor(levelText)} px-2 py-0.5 rounded-md tracking-wide uppercase`}
                    >
                      {levelText}
                    </span>
                    <div className="flex items-center text-gray-500 gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {course.duration || "4 Years"}
                    </div>
                  </div>

                  {/* Title with Custom Tooltip */}
                  <div className="relative group mb-1.5">
                    <h2 className="text-base font-bold text-gray-900 group-hover:text-[#0000ff] cursor-pointer transition-colors truncate leading-tight">
                      {course.title}
                    </h2>
                    <div className="custom-tooltip">
                      {course.title}
                      <div className="tooltip-arrow"></div>
                    </div>
                  </div>

                  {/* Details List - Tighter spacing */}
                  <div className="space-y-1 text-[12px] flex-1">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                      <div>
                        <span className="font-bold text-gray-700">
                          Affiliation:
                        </span>{" "}
                        <span className="text-gray-600">
                          {course.affiliation || "Tribhuvan University"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                      <div>
                        <span className="font-bold text-gray-700">
                          Eligibility:
                        </span>{" "}
                        <span className="text-gray-600">
                          {(course as any).eligibility ||
                            "As per institution criteria"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <ClipboardCheck className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                      <div>
                        <span className="font-bold text-gray-700">
                          Entrance:
                        </span>{" "}
                        <span className="text-gray-600">
                          {(course as any).entranceExam ||
                            "Entrance exam required"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CreditCard className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                      <div>
                        <span className="font-bold text-gray-700">
                          Est. Fee:
                        </span>{" "}
                        <span className="text-[#0000ff] font-bold">
                          {course.estFee || "Rs. 5,00,000"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Briefcase className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                      <div>
                        <span className="font-bold text-gray-700">Career:</span>{" "}
                        <span className="text-gray-600 truncate inline-block max-w-37.5 align-bottom">
                          {course.careerPath ||
                            "Software Engineer, Web Developer, Sys..."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - All in a single row */}
                  <div className="flex gap-2 mt-3 -mb-3 py-5 border-t border-dashed border-gray-200">
                    <button
                      onClick={() => router.push(`/course-finder/${course.id}`)}
                      className="flex-[1.5] flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-slate-600 font-medium py-2 rounded-md transition-colors text-[12px] whitespace-nowrap"
                    >
                      Details
                    </button>

                    <button
                      onClick={() =>
                        onNavigate("universitiesPage", {
                          courseId: course.id,
                          courseTitle: course.title,
                        })
                      }
                      className="flex-[2.5] bg-[#0014f4] hover:bg-blue-800 text-white font-semibold py-2 rounded-md  text-[12px] flex items-center justify-center transition-colors whitespace-nowrap"
                    >
                      View Colleges
                    </button>

                    <button
                      type="button"
                      disabled={!!pendingBookmarks[Number(course.id)]}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaved(Number(course.id));
                      }}
                      className={`shrink-0 w-10 flex items-center justify-center border rounded-md transition-colors ${
                        pendingBookmarks[Number(course.id)]
                          ? "border-gray-100 bg-gray-50 cursor-not-allowed"
                          : savedCourseIds.includes(Number(course.id))
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {pendingBookmarks[Number(course.id)] ? (
                        <svg
                          className="w-4 h-4 animate-spin text-gray-400"
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
                          className={`w-4 h-4 transition-all ${
                            savedCourseIds.includes(Number(course.id))
                              ? "text-[#0000ff] fill-[#0000ff]"
                              : "text-gray-400"
                          }`}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {(index + 1) % 6 === 0 && index !== currentCourses.length - 1 && (
                <div className="col-span-1 md:col-span-2 xl:col-span-3 my-4">
                  {ads[Math.floor(index / 6) % 3]}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default CourseGrid;
