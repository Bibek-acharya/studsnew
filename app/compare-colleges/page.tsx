"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type { College } from "@/services/api";
import CompareCollegesPage from "@/components/compare-colleges/CompareCollegesPage";
import CollegeComparisonResultPage from "@/components/compare-colleges/CollegeComparisonResultPage";

type CollegeInput = Partial<College> | string;

function extractId(input: CollegeInput): number | null {
  if (typeof input === "object" && input !== null && "id" in input && input.id) {
    return input.id as number;
  }
  return null;
}

export default function CompareCollegesRoute() {
  const [view, setView] = useState<"search" | "result">("search");
  const [compareData, setCompareData] = useState<{
    college1: CollegeInput;
    college2: CollegeInput;
  } | null>(null);

  const college1Id = useMemo(() => compareData ? extractId(compareData.college1) : null, [compareData]);
  const college2Id = useMemo(() => compareData ? extractId(compareData.college2) : null, [compareData]);

  const { data: comparisonData, isLoading: comparisonLoading } = useQuery({
    queryKey: ["college-comparison", college1Id, college2Id],
    queryFn: () => apiService.compareColleges(college1Id!, college2Id!),
    enabled: view === "result" && college1Id !== null && college2Id !== null,
  });

  const c1Full = comparisonData?.data?.college1 || null;
  const c2Full = comparisonData?.data?.college2 || null;
  const loading = comparisonLoading;

  const handleNavigate = (newView: string, data?: { college1: CollegeInput; college2: CollegeInput }) => {
    if (newView === "compareCollegesResult" && data) {
      setCompareData(data);
      setView("result");
      window.scrollTo(0, 0);
    } else if (newView === "search") {
      setView("search");
      setCompareData(null);
      window.scrollTo(0, 0);
    }
  };

  const getCollege1 = (): Partial<College> | undefined => {
    if (c1Full) return c1Full;
    if (compareData?.college1 && typeof compareData.college1 === "object") return compareData.college1;
    return undefined;
  };

  const getCollege2 = (): Partial<College> | undefined => {
    if (c2Full) return c2Full;
    if (compareData?.college2 && typeof compareData.college2 === "object") return compareData.college2;
    return undefined;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {view === "search" ? (
        <CompareCollegesPage onNavigate={handleNavigate} />
      ) : (
        <CollegeComparisonResultPage
          onNavigate={handleNavigate}
          college1={getCollege1()}
          college2={getCollege2()}
          loading={loading}
        />
      )}
    </div>
  );
}
