"use client";

import React from "react";
import ScholarshipFinderPage from "@/components/scholarship-finder/ScholarshipFinderPage";
import EducationNavbar from "@/components/EducationNavbar";
import Footer from "@/components/Footer";

export default function ScholarshipFinderRoute() {
  const handleNavigate = (view: string, data?: any) => {
    console.log("Navigating to", view, data);
    // You can implement cross-page navigation logic here if needed.
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* EducationNavbar is usually fixed in layout but double check if you want it included manually */}
      <EducationNavbar />
      
      <main className="pt-20">
        <ScholarshipFinderPage onNavigate={handleNavigate} />
      </main>

      <Footer />
    </div>
  );
}
