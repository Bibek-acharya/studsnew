"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CourseFinderPage from "@/components/course-finder/CourseFinderPage";
import CourseDetailsPage from "@/components/course-finder/CourseDetailsPage";
import type { GlobalCourse } from "@/types/course";
import type { CourseFilterCountsResponse } from "@/services/course-api";

interface NavigationData {
  courseId?: string | number;
  id?: string | number;
}

interface CourseFinderViewProps {
  initialCourses?: GlobalCourse[];
  initialFilterCounts?: CourseFilterCountsResponse;
}

export default function CourseFinderView({
  initialCourses,
  initialFilterCounts,
}: CourseFinderViewProps) {
  const router = useRouter();
  const [view, setView] = useState<"finder" | "details">("finder");
  const [selectedCourse, setSelectedCourse] = useState<{ id?: string | number } | null>(null);

  const handleNavigate = (targetView: string, data?: NavigationData) => {
    if (targetView === "universitiesPage" && data?.courseId) {
      router.push(`/course-finder/colleges?course=${data.courseId}`);
    } else if (targetView === "courseDetails" && data?.id) {
      setSelectedCourse({ id: data.id });
      setView("details");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {view === "finder" ? (
        <CourseFinderPage
          onNavigate={handleNavigate}
          initialData={
            initialCourses
              ? {
                  courses: initialCourses,
                  counts: initialFilterCounts,
                }
              : undefined
          }
        />
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
