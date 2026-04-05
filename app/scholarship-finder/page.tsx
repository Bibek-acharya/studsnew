"use client";

import React from "react";
import ScholarshipFinderPage from "@/components/scholarship-finder/ScholarshipFinderPage";

export default function ScholarshipFinderRoute() {
  const handleNavigate = (view: string, data?: any) => {
    console.log("Navigating to", view, data);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="pt-20">
        <ScholarshipFinderPage onNavigate={handleNavigate} />
      </main>
    </div>
  );
}
