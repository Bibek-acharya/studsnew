"use client";

import React, { useState } from "react";
import CompareCollegesPage from "@/components/compare-colleges/CompareCollegesPage";
import CollegeComparisonResultPage from "@/components/compare-colleges/CollegeComparisonResultPage";

export default function CompareCollegesRoute() {
  const [view, setView] = useState<"search" | "result">("search");
  const [compareData, setCompareData] = useState<{
    college1: any;
    college2: any;
  } | null>(null);

  const handleNavigate = (newView: string, data?: any) => {
    if (newView === "compareCollegesResult") {
      setCompareData(data);
      setView("result");
      window.scrollTo(0, 0);
    } else if (newView === "search") {
      setView("search");
      window.scrollTo(0, 0);
    } else {
        // Fallback for other navigation
        console.log("Navigating to:", newView, data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {view === "search" ? (
        <CompareCollegesPage onNavigate={handleNavigate} />
      ) : (
        <CollegeComparisonResultPage 
            onNavigate={handleNavigate} 
            college1={compareData?.college1} 
            college2={compareData?.college2} 
        />
      )}
    </div>
  );
}
