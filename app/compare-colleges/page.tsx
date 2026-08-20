"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type { College } from "@/services/api";
import CompareCollegesPage from "@/components/compare-colleges/CompareCollegesPage";
import CollegeComparisonResultPage from "@/components/compare-colleges/CollegeComparisonResultPage";

type CollegeInput = Partial<College> | string;

export default function CompareCollegesRoute() {
  const [view, setView] = useState<"search" | "result">("search");
  const [compareData, setCompareData] = useState<{
    college1: CollegeInput;
    college2: CollegeInput;
  } | null>(null);

  const needsResolve = view === "result" && compareData && (
    (typeof compareData.college1 === "object" && !("id" in compareData.college1 && compareData.college1.id)) ||
    (typeof compareData.college2 === "object" && !("id" in compareData.college2 && compareData.college2.id)) ||
    typeof compareData.college1 === "string" ||
    typeof compareData.college2 === "string"
  );

  const { data: collegesData } = useQuery({
    queryKey: ["all-colleges-compare-resolve"],
    queryFn: () => apiService.getColleges({ pageSize: 100 }),
    enabled: !!needsResolve,
  });

  const resolvedColleges = useMemo(() => {
    if (!compareData) return { college1: null, college2: null };

    const colleges = collegesData?.data?.colleges || [];
    const c1 = compareData.college1;
    const c2 = compareData.college2;

    const resolve = (input: CollegeInput): College | null => {
      if (typeof input === "object" && "id" in input && input.id) {
        return input as College;
      }
      if (typeof input === "object" && "name" in input) {
        return colleges.find(
          (c) => c.name.toLowerCase() === input.name?.toLowerCase()
        ) || null;
      }
      if (typeof input === "string") {
        return colleges.find(
          (c) => c.name.toLowerCase() === input.toLowerCase()
        ) || null;
      }
      return null;
    };

    return {
      college1: resolve(c1),
      college2: resolve(c2),
    };
  }, [compareData, collegesData]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {view === "search" ? (
        <CompareCollegesPage onNavigate={handleNavigate} />
      ) : (
        <CollegeComparisonResultPage
          onNavigate={handleNavigate}
          college1={resolvedColleges.college1 || compareData?.college1}
          college2={resolvedColleges.college2 || compareData?.college2}
          loading={!!needsResolve && !collegesData}
        />
      )}
    </div>
  );
}
