import CourseFinderView from "./CourseFinderView";
import {
  fetchGlobalCourses,
  fetchCourseFilterCounts,
} from "@/services/course-api";

export const revalidate = 300;

export default async function CourseFinderHomePage() {
  const [coursesResponse, filterCounts] = await Promise.all([
    fetchGlobalCourses(1, 100).catch(() => undefined as undefined),
    fetchCourseFilterCounts().catch(() => undefined as undefined),
  ]);

  return (
    <CourseFinderView
      initialCourses={coursesResponse?.courses}
      initialFilterCounts={filterCounts}
    />
  );
}
