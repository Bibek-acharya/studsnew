"use client";

import React, { useState } from "react";
import CourseFinderPage from "@/components/course-finder/CourseFinderPage";
import CollegesAndCoursesPage from "@/components/course-finder/CollegesAndCoursesPage";
import CourseDetailsPage from "@/components/course-finder/CourseDetailsPage";

export default function FindCoursePage() {
  const [view, setView] = useState<"finder" | "colleges" | "details">("finder");
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
      setSelectedCourse({ id: data.id });
      setView("details");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {view === "finder" ? (
        <CourseFinderPage onNavigate={handleNavigate} />
      ) : view === "details" ? (
        <div className="pt-10">
          <CourseDetailsPage
            courseId={selectedCourse?.id || "1"}
            onBack={() => setView("finder")}
            onNavigate={handleNavigate}
          />
        </div>
      ) : (
        <div className="pt-10">

          <CollegesAndCoursesPage
            selectedCourse={selectedCourse}
            onBack={() => setView("finder")}
          />
        </div>
      )}
    </div>
  );
}
