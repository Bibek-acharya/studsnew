import CollegesAndCoursesPage from "@/components/course-finder/CollegesAndCoursesPage";

export default async function CourseCollegesPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await searchParams;

  return (
    <div className="pt-10">
      <CollegesAndCoursesPage selectedCourse={{ id: course }} />
    </div>
  );
}
