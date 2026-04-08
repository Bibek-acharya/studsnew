import React, { useState } from "react";
import { EducationCourse } from "../../services/api";
import { CourseFinderFilters, defaultCourseFinderFilters } from "./types";
import Pagination from "@/components/ui/Pagination";

interface CourseGridProps {
  onNavigate: (view: any, data?: any) => void;
  courses: EducationCourse[];
  totalCourses: number;
  isLoading?: boolean;
  filters: CourseFinderFilters;
  onFiltersChange: (next: CourseFinderFilters) => void;
}

interface CourseCardData {
  id: string;
  title: string;
  colleges: number;
  affiliation: string;
  topBadge: string;
  level: string;
  field: string;
  duration: string;
  estFee: string;
  highlights: string[];
  careerPath: string;
  applyBtnClass: string;
}

const mapCourseToCard = (
  course: EducationCourse,
  index: number,
): CourseCardData => {
  const badgeList = Array.isArray(course.badges) ? course.badges : [];
  const highlightList = Array.isArray(course.highlights) ? course.highlights : [];

  return {
    id: String(course.id ?? index + 1),
    title: course.title || "Untitled Course",
    colleges: typeof course.colleges === "number" ? course.colleges : 0,
    affiliation: course.affiliation || "Affiliation",
    topBadge: badgeList[0] || "",
    level: course.level || "-",
    field: course.field || "-",
    duration: course.duration || "-",
    estFee: course.estFee || "-",
    highlights: highlightList.length > 0 ? highlightList : [],
    careerPath: course.careerPath || "-",
    applyBtnClass: index === 1 ? "bg-[#3B82F6]" : "bg-[#0F172A]",
  };
};

const CourseCard: React.FC<{
  course: CourseCardData;
  onNavigate: (view: any, data?: any) => void;
}> = ({ course, onNavigate }) => {
  const handleViewColleges = () => {
    onNavigate("universitiesPage", {
      courseId: course.id,
      courseTitle: course.title,
      collegesCount: course.colleges,
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[16px] p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-2 mb-4">
        <span className="bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wide">
          {course.affiliation}
        </span>
        <span className="bg-[#ECFDF5] text-[#059669] text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wide">
          {course.topBadge}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex-shrink-0"></div>
        <div>
          <h3 className="text-[16px] font-bold text-gray-900 leading-tight mb-1">
            {course.title}
          </h3>
          <button
            type="button"
            onClick={handleViewColleges}
            className="inline-flex items-center gap-1 text-[13px] text-gray-500 font-medium hover:text-blue-600 transition-colors group"
          >
            View {course.colleges} colleges
            <svg
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
            </svg>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Level</span>
          </div>
          <span className="text-[13px] font-bold text-gray-900 ml-5.5 pl-5.5">{course.level}</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Field</span>
          </div>
          <span className="text-[13px] font-bold text-gray-900 ml-5.5 pl-5.5">{course.field}</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Duration</span>
          </div>
          <span className="text-[13px] font-bold text-gray-900 ml-5.5 pl-5.5">{course.duration}</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Est.Fee</span>
          </div>
          <span className="text-[13px] font-bold text-gray-900 ml-5.5 pl-5.5">{course.estFee}</span>
        </div>
      </div>

      <div className="mb-5">
        <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Scholarship & Highlights</h4>
        <ul className="space-y-2">
          {course.highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-2 text-[13px] text-gray-700 font-medium">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-start gap-2 pt-4 border-t border-gray-100 mb-6">
        <svg className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
        </svg>
        <p className="text-[13px] text-gray-700 leading-snug">
          <span className="font-bold">Major Career Path:</span> {course.careerPath}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onNavigate("courseDetails", { id: course.id })}
          className="flex-1 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Details
        </button>
        <button className={`flex-1 ${course.applyBtnClass} text-white text-[13px] font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-sm`}>
          Apply Now
        </button>
        <button className="w-[42px] h-[42px] flex items-center justify-center bg-white border border-gray-200 text-gray-400 rounded-lg hover:text-red-500 hover:border-red-200 transition-colors flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

const CourseGrid: React.FC<CourseGridProps> = ({
  onNavigate,
  courses,
  totalCourses,
  isLoading,
  filters,
  onFiltersChange,
}) => {
  const mappedCourses = courses.map((course, index) =>
    mapCourseToCard(course, index),
  );
  const resolvedCourses = mappedCourses;

  const activeFilters = [
    ...filters.academicLevels,
    ...filters.fields,
    ...filters.providerTypes,
    ...filters.durations,
  ];

  const removeActiveFilter = (value: string) => {
    const next = { ...filters };
    next.academicLevels = next.academicLevels.filter((item) => item !== value);
    next.fields = next.fields.filter((item) => item !== value);
    next.providerTypes = next.providerTypes.filter((item) => item !== value);
    next.durations = next.durations.filter((item) => item !== value);
    onFiltersChange(next);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col mb-6 pb-2 gap-3">
        <h1 className="text-[24px] font-bold text-gray-900 tracking-tight mb-2">Colleges and Courses</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] text-gray-500 font-medium mr-1">Active :</span>
          {activeFilters.map((filter) => (
            <span
              key={`${filter}-active`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-gray-200 text-[12px] text-gray-700 font-medium"
            >
              {filter}
              <button onClick={() => removeActiveFilter(filter)} className="text-blue-600 hover:text-blue-800 focus:outline-none">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </span>
          ))}
          {activeFilters.length > 0 && (
            <button
              onClick={() => onFiltersChange(defaultCourseFinderFilters)}
              className="text-[12px] text-blue-600 hover:underline font-medium ml-1"
            >
              Clear All
            </button>
          )}
        </div>
        <p className="text-[13px] text-gray-600">
          Showing {resolvedCourses.length} results for courses (total {totalCourses})
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 font-medium">
          Loading courses...
        </div>
      ) : resolvedCourses.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 font-medium">
          No courses available right now.
        </div>
      ) : (
        <>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="courses-grid-1">
            {resolvedCourses.slice(0, 4).map((course) => (
              <CourseCard key={course.id} course={course} onNavigate={onNavigate} />
            ))}
          </div>

          <div className="my-6 w-full h-[180px] md:h-[220px] rounded-xl overflow-hidden relative shadow-sm group">
            <img src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80" alt="University Campus" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              <button className="w-6 h-1 rounded-full bg-blue-600 transition-all"></button>
              <button className="w-6 h-1 rounded-full bg-white transition-all"></button>
              <button className="w-6 h-1 rounded-full bg-white transition-all"></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="courses-grid-2">
            {resolvedCourses.slice(4, 6).map((course) => (
              <CourseCard key={course.id} course={course} onNavigate={onNavigate} />
            ))}
          </div>
        </>
      )}

      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    </div>
  );
};

export default CourseGrid;
