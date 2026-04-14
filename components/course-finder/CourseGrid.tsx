import React, { useState, useMemo } from "react";
import { EducationCourse } from "../../services/api";
import { CourseFinderFilters } from "./types";
import {
  Clock,
  Building2,
  GraduationCap,
  ClipboardCheck,
  CreditCard,
  Briefcase,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";

interface CourseGridProps {
  onNavigate: (view: any, data?: any) => void;
  courses: EducationCourse[];
  totalCourses: number;
  isLoading?: boolean;
  filters: CourseFinderFilters;
  onFiltersChange: (next: CourseFinderFilters) => void;
}

const COURSES_PER_PAGE = 6;

const CourseGrid: React.FC<CourseGridProps> = ({
  onNavigate,
  courses,
  isLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Use the provided courses but ensure we have enough for the grid demo if none provided
  const allCourses = useMemo(() => {
    if (courses.length > 0) return courses;
    return [
      {
        id: "1",
        title: "10+2 Science (Physical Group)",
        level: "+2 (plus two)",
        duration: "2 Years",
        affiliation: "NEB (National Examination Board)",
        image:
          "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=200",
        estFee: "Rs. 1,00,000 - 2,50,000",
        careerPath: "Engineering, IT, Physical Sciences...",
      },
      {
        id: "2",
        title: "10+2 Science (Biology Group)",
        level: "+2 (plus two)",
        duration: "2 Years",
        affiliation: "NEB (National Examination Board)",
        image:
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=200",
        estFee: "Rs. 1,10,000 - 2,60,000",
        careerPath: "Medical (MBBS), Nursing, Agriculture...",
      },
      {
        id: "3",
        title: "10+2 Management",
        level: "+2 (plus two)",
        duration: "2 Years",
        affiliation: "NEB (National Examination Board)",
        image:
          "https://images.unsplash.com/photo-1454165833762-02651d58d92c?auto=format&fit=crop&w=400&q=200",
        estFee: "Rs. 80,000 - 1,80,000",
        careerPath: "BBA, CA, Hotel Management, Banking...",
      },
      {
        id: "4",
        title: "Cambridge International A Levels (Science)",
        level: "A Level",
        duration: "2 Years",
        affiliation: "Cambridge University",
        image:
          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=200",
        estFee: "Rs. 4,00,000 - 8,00,000",
        careerPath: "International Admissions, Research...",
      },
      {
        id: "5",
        title: "10+2 Law",
        level: "+2 (plus two)",
        duration: "2 Years",
        affiliation: "NEB (National Examination Board)",
        image:
          "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=200",
        estFee: "Rs. 70,000 - 1,50,000",
        careerPath: "Legal Practice, Advocacy, Civil Service...",
      },
      {
        id: "6",
        title: "10+2 Humanities",
        level: "+2 (plus two)",
        duration: "2 Years",
        affiliation: "NEB (National Examination Board)",
        image:
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=200",
        estFee: "Rs. 60,000 - 1,40,000",
        careerPath: "Mass Communication, Sociology, Arts...",
      },
    ] as unknown as EducationCourse[];
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
            className="animate-pulse bg-white rounded-xl border border-gray-100 h-95"
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
            <div
              key={course.id || index}
              className="bg-white rounded-xl border border-gray-200 flex flex-col relative transition-all hover:border-blue-500/20 duration-300"
            >
              {/* Image Area - Reduced height and padding */}
              <div className="relative h-28 w-full p-3 pb-2">
                <img
                  src={
                    course.image ||
                    `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=200`
                  }
                  alt={course.title}
                  className="w-full h-full object-cover rounded-lg"
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
                      <span className="font-bold text-gray-700">Entrance:</span>{" "}
                      <span className="text-gray-600">
                        Entrance exam required
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CreditCard className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                    <div>
                      <span className="font-bold text-gray-700">Est. Fee:</span>{" "}
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

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2.5 mt-auto">
                  <button
                    onClick={() =>
                      onNavigate("courseDetails", { id: course.id })
                    }
                    className="flex-1 bg-white border border-gray-200 text-gray-700 text-[13px] font-semibold py-1.5 rounded-md hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200 focus:outline-none"
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
                    className="flex-1 bg-[#0000ff] text-white text-[13px] font-semibold py-1.5 rounded-md hover:bg-blue-800 transition-colors focus:ring-2 focus:ring-[#0000ff] focus:ring-offset-1 focus:outline-none flex justify-center items-center gap-1"
                  >
                    View Colleges
                  </button>
                </div>
              </div>
            </div>
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
