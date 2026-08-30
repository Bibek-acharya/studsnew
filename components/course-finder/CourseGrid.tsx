import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { GlobalCourse } from "@/types/course";
import { CourseFinderFilters } from "./types";
import Pagination from "@/components/ui/Pagination";
import CourseCard from "./CourseCard";
import useCourseBookmarks from "./useCourseBookmarks";
// import CourseCarouselAd from "./ads/CourseCarouselAd";
// import KistProgramsAd from "./ads/KistProgramsAd";
// import SudsphereBannerAd from "./ads/SudsphereBannerAd";

interface CourseGridProps {
  onNavigate: (
    view: "universitiesPage",
    data: { courseId: number; courseTitle: string },
  ) => void;
  courses: GlobalCourse[];
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
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { savedCourseIds, pendingBookmarks, toggleSaved } = useCourseBookmarks();

  // const ads = [
  //   <CourseCarouselAd key="0" />,
  //   <KistProgramsAd key="1" />,
  //   <SudsphereBannerAd key="2" />,
  // ];

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allCourses.length === 0 && !isLoading && (
          <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-20 px-4">
            <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Courses Found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
          </div>
        )}
        {currentCourses.map((course, index) => {
          const courseId = Number(course.id);

          return (
            <React.Fragment key={course.id || index}>
              <CourseCard
                course={{
                  id: courseId,
                  title: course.title,
                  level: course.level,
                  duration: course.duration,
                  affiliation: course.affiliationName || course.nonUniversityAffiliation,
                  field: course.fieldOfStudy || course.field,
                  estFee: course.estFee,
                }}
                onDetails={() => router.push(`/course-finder/${course.id}`)}
                onViewColleges={() =>
                  onNavigate("universitiesPage", {
                    courseId: course.id,
                    courseTitle: course.title,
                  })
                }
                onToggleSaved={() => toggleSaved(courseId)}
                isSaved={savedCourseIds.includes(courseId)}
                isBookmarkPending={!!pendingBookmarks[courseId]}
              />
              {/* {(index + 1) % 6 === 0 && index !== currentCourses.length - 1 && (
                <div className="col-span-1 md:col-span-2 xl:col-span-3 my-4">
                  {ads[Math.floor(index / 6) % 3]}
                </div>
              )} */}
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
