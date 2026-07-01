import { Suspense } from "react";
import CourseCreatePage from "@/components/institution-zone/dashboard/institution/CourseCreatePage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-4 md:p-6 lg:p-8 min-h-full flex items-center justify-center text-gray-400">
          Loading...
        </div>
      }
    >
      <CourseCreatePage />
    </Suspense>
  );
}
