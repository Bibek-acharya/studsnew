"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import ShikshaApplicationForm from "@/components/project-shiksha/ShikshaApplicationForm";

export default function ScholarshipApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const { data: detailRes, isLoading } = useQuery({
    queryKey: ["scholarship", id],
    queryFn: () => apiService.getEducationScholarshipById(id),
    retry: false,
  });

  const scholarship = detailRes?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!scholarship) {
    return (
      <ShikshaApplicationForm
        scholarshipTitle="Project Shiksha Scholarship"
        scholarshipId={Number(id) || undefined}
      />
    );
  }

  return <ShikshaApplicationForm scholarshipTitle={scholarship.title} scholarshipId={Number(id) || undefined} />;
}
