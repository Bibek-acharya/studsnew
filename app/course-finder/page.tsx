"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CourseFinderPage from "@/components/course-finder/CourseFinderPage";
import CourseDetailsPage from "@/components/course-finder/CourseDetailsPage";

export default function FindCoursePage() {
  const router = useRouter();
  const [view, setView] = useState<"finder" | "details">("finder");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const handleNavigate = (targetView: string, data?: any) => {
    if (targetView === "universitiesPage") {
      router.push(`/course-finder/colleges?course=${data.courseId}`);
    } else if (targetView === "courseDetails") {
      setSelectedCourse({ id: data.id });
      setView("details");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {view === "finder" ? (
        <CourseFinderPage onNavigate={handleNavigate} />
      ) : (
        <CourseDetailsPage
          courseId={selectedCourse?.id || "1"}
          onBack={() => setView("finder")}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
