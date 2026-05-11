import { Suspense } from "react";
import ShikshaSuccessPage from "@/components/project-shiksha/ShikshaSuccessPage";

export const metadata = {
  title: "Application Successful | Project Shiksha | StudSphere",
  description: "Your Project Shiksha scholarship application has been submitted successfully.",
};

export default function ProjectShikshaSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#0000ff] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ShikshaSuccessPage />
    </Suspense>
  );
}
