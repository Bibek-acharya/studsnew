import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Clock,
  Building2,
  GraduationCap,
  CreditCard,
  Users,
  Bookmark,
  BookOpen,
} from "lucide-react";
import { GlobalCourse } from "@/types/course";
import { apiService } from "../../services/api";
import { useAuth } from "@/services/AuthContext";
import { CourseFinderFilters } from "./types";
import Pagination from "@/components/ui/Pagination";
import CourseCarouselAd from "./ads/CourseCarouselAd";
import KistProgramsAd from "./ads/KistProgramsAd";
import SudsphereBannerAd from "./ads/SudsphereBannerAd";

interface CourseGridProps {
  onNavigate: (view: any, data?: any) => void;
  courses: GlobalCourse[];
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
    return "bg-[#FDE8EE] text-[#D11D5A]";
  if (l.includes("bachelor") || l.includes("bach") || l.includes("diploma"))
    return "bg-[#FDE8EE] text-[#D11D5A]";
  if (l.includes("master") || l.includes("post"))
    return "bg-[#FDE8EE] text-[#D11D5A]";
  return "bg-[#FDE8EE] text-[#D11D5A]";
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
    return courses;
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
        .banner-gradient {
          background: linear-gradient(135deg, #0d21e0 0%, #0014ff 100%);
          background-image:
            radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 40%),
            radial-gradient(circle at bottom left, rgba(255,255,255,0.1) 0%, transparent 40%),
            linear-gradient(135deg, #1126ef 0%, #0014FF 100%);
        }
        .card-shadow {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allCourses.length === 0 && !isLoading && (
          <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-20 px-4">
            <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Courses Found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
          </div>
        )}
        {currentCourses.map((course, index) => {
          const levelText = course.level || "+2(plus two)";

          return (
            <React.Fragment key={course.id || index}>
              <div className="bg-white rounded-xl border border-gray-200 w-full p-4 card-shadow flex flex-col">
                {/* Banner Area */}
                <div className="banner-gradient rounded-lg p-6 mb-4 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[140px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                  <h2 className="text-white text-[1.3rem] font-bold leading-tight relative z-10 mb-2">
                    {course.title}
                  </h2>
                  <div className="text-white/80 text-[0.65rem] relative z-10 mt-auto pt-2 tracking-wide font-medium">
                    studsphere.com
                  </div>
                </div>

                {/* Badges and Duration Row */}
                <div className="flex justify-between items-center mb-3">
                  <span className={`${levelBadgeColor(levelText)} text-xs font-bold px-3 py-1 rounded-md tracking-wider`}>
                    {levelText.toUpperCase()}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm font-medium">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <span>{course.duration || "4 Years"}</span>
                  </div>
                </div>

                {/* Main Title */}
                <h3 className="text-[1.1rem] font-bold text-gray-900 mb-4 leading-tight">
                  {course.title}
                </h3>

                {/* Details List */}
                <div className="space-y-2.5 mb-5">
                  <div className="flex items-start">
                    <div className="w-6 flex justify-center mt-0.5">
                      <Building2 className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-[0.9rem]">
                      <span className="font-semibold text-gray-800">Affiliation:</span>{" "}
                      <span className="text-gray-500">
                        {course.affiliationName || course.nonUniversityAffiliation || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 flex justify-center mt-0.5">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-[0.9rem]">
                      <span className="font-semibold text-gray-800">Field:</span>{" "}
                      <span className="text-gray-500">
                        {course.fieldOfStudy || course.field || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 flex justify-center mt-0.5">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-[0.9rem]">
                      <span className="font-semibold text-gray-800">Est. Fee:</span>{" "}
                      <span className="font-bold text-[#0014FF]">
                        {course.estFee || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 flex justify-center mt-0.5">
                      <Users className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-[0.9rem]">
                      <span className="font-semibold text-gray-800">Seats:</span>{" "}
                      <span className="text-gray-500">
                        {course.fullTimeCourses?.[0]?.seats || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-300 mb-4"></div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/course-finder/${course.id}`)}
                    className="flex-1 py-2.5 px-4 bg-white border border-gray-300 rounded text-gray-600 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                    className="flex-[1.5] py-2.5 px-4 bg-[#0014FF] text-white rounded font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#0014FF] focus:ring-offset-1"
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
                    className="w-[42px] h-[42px] flex items-center justify-center bg-white border border-gray-300 rounded text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 shrink-0"
                  >
                    {pendingBookmarks[Number(course.id)] ? (
                      <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <Bookmark
                        className={`w-5 h-5 transition-all ${
                          savedCourseIds.includes(Number(course.id))
                            ? "text-[#0014FF] fill-[#0014FF]"
                            : "text-gray-400"
                        }`}
                      />
                    )}
                  </button>
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
