"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import ScholarshipDetailPage from "@/components/scholarship-finder/ScholarshipDetailPage";

export default function ScholarshipDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  const { data: detailRes, isLoading: isDetailLoading, error: detailError } = useQuery({
    queryKey: ["scholarship", slug],
    queryFn: () => apiService.getEducationScholarshipById(slug),
  });

  const { data: similarRes } = useQuery({
    queryKey: ["similar-scholarships", slug],
    queryFn: () => apiService.getEducationSimilarScholarships(slug),
  });

  const scholarship = detailRes?.data;
  const similarScholarships = similarRes?.data?.scholarships || [];

  if (isDetailLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="font-bold text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (detailError || !scholarship) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-bold text-gray-500">Scholarship not found</p>
        </div>
      </div>
    );
  }

  return <ScholarshipDetailPage scholarship={scholarship} similarScholarships={similarScholarships} />;
}
