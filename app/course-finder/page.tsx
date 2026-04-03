"use client";

import React, { useState } from "react";
import CourseFinderPage from "@/components/course-finder/CourseFinderPage";
import CollegesAndCoursesPage from "@/components/course-finder/CollegesAndCoursesPage";

export default function FindCoursePage() {
  const [view, setView] = useState<"finder" | "colleges">("finder");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const handleNavigate = (targetView: string, data?: any) => {
    if (targetView === "universitiesPage") {
      setSelectedCourse({
        id: data.courseId,
        title: data.courseTitle,
        collegesCount: data.collegesCount,
      });
      setView("colleges");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (targetView === "courseDetails") {
      // Mock navigation to details
      alert(`Navigating to details for course ID: ${data.id}`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {view === "finder" ? (
        <CourseFinderPage onNavigate={handleNavigate} />
      ) : (
        <div className="pt-10">
          <div className="max-w-[1400px] mx-auto px-6 mb-8 pt-4">
            <button
              onClick={() => setView("finder")}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all group"
            >
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Course Finder
            </button>
          </div>

          <CollegesAndCoursesPage
            selectedCourse={selectedCourse}
            onBack={() => setView("finder")}
          />
        </div>
      )}
    </div>
  );
}
