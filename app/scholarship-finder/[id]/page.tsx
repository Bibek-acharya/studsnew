"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import ScholarshipDetailPage from "@/components/scholarship-finder/ScholarshipDetailPage";

export default function ScholarshipDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const { data: detailRes, isLoading: isDetailLoading, error: detailError } = useQuery({
    queryKey: ["scholarship", id],
    queryFn: () => apiService.getEducationScholarshipById(id),
  });

  const { data: similarRes } = useQuery({
    queryKey: ["similar-scholarships", id],
    queryFn: () => apiService.getEducationSimilarScholarships(id),
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
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-4 text-center">
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-800">Scholarship Not Found</h2>
          <Link href="/scholarship-finder" className="font-bold text-blue-600 underline">Back to Finder</Link>
        </div>
      </div>
    );
  }

  return <ScholarshipDetailPage scholarship={scholarship} similarScholarships={similarScholarships} />;
}
