"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import CollegeComparisonResultPage from "@/components/compare-colleges/CollegeComparisonResultPage";

function ComparisonResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const college1Id = useMemo(
    () => Number(searchParams.get("college1")) || null,
    [searchParams],
  );
  const college2Id = useMemo(
    () => Number(searchParams.get("college2")) || null,
    [searchParams],
  );

  useEffect(() => {
    if (college1Id === null || college2Id === null) {
      router.replace("/compare-colleges");
    }
  }, [college1Id, college2Id, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["college-comparison", college1Id, college2Id],
    queryFn: () => apiService.compareColleges(college1Id!, college2Id!),
    enabled: college1Id !== null && college2Id !== null,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <CollegeComparisonResultPage
        onNavigate={(view) => {
          if (view === "search") router.push("/compare-colleges");
        }}
        college1={data?.data?.college1}
        college2={data?.data?.college2}
        loading={isLoading}
      />
    </div>
  );
}

export default function CompareCollegesResultRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ComparisonResultContent />
    </Suspense>
  );
}
