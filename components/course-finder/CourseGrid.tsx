import React, { useState, useMemo } from "react";
import {
  Clock,
  Building2,
  GraduationCap,
  ClipboardCheck,
  CreditCard,
  Briefcase,
  Bookmark,
} from "lucide-react";
import { EducationCourse } from "../../services/api";
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

const CourseGrid: React.FC<CourseGridProps> = ({
  onNavigate,
  courses,
  isLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>([]);

  const ads = [
    <CourseCarouselAd key="0" />,
    <KistProgramsAd key="1" />,
    <SudsphereBannerAd key="2" />,
  ];

  const toggleBookmark = (id: string) => {
    setSavedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

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
          const badgeStyle =
            index % 3 === 0
              ? "bg-[#7c3aed]/10 text-[#7c3aed]"
              : index % 3 === 1
                ? "bg-[#db2777]/10 text-[#db2777]"
                : "bg-[#ea580c]/10 text-[#ea580c]";

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
                      className={`${badgeStyle} px-2 py-0.5 rounded-md tracking-wide uppercase`}
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
                          As per institution criteria
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
                          Entrance exam required
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
                      onClick={() =>
                        onNavigate("courseDetails", { id: course.id })
                      }
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
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(String(course.id));
                      }}
                      className={`shrink-0 w-10 flex items-center justify-center border rounded-md transition-colors ${
                        savedCourseIds.includes(String(course.id))
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Bookmark
                        className={`w-4 h-4 transition-all ${
                          savedCourseIds.includes(String(course.id))
                            ? "text-[#0000ff] fill-[#0000ff]"
                            : "text-gray-400"
                        }`}
                      />
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
