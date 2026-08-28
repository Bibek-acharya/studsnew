import { Suspense } from "react";
import BookCounsellingPage from "@/components/counseling/BookCounsellingPage";

export default function CounselingRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      }
    >
      <BookCounsellingPage />
    </Suspense>
  );
}
