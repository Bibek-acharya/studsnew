"use client";

import React, { useState } from "react";
import ScholarshipsCategoryPage from "./ScholarshipsCategoryPage";
import ScholarshipHubDetailsPage from "./ScholarshipHubDetailsPage";

interface ScholarshipMainPageProps {
  onNavigate?: (view: any, data?: any) => void;
}

const ScholarshipMainPage: React.FC<ScholarshipMainPageProps> = ({ onNavigate }) => {
  const [view, setView] = useState<"list" | "details">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleNavigate = (targetView: string, data?: any) => {
    if (targetView === "scholarshipHubDetails") {
      setSelectedId(data?.id || "1");
      setView("details");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (targetView === "scholarshipsCategory") {
      setView("list");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (onNavigate) {
      onNavigate(targetView, data);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {view === "list" ? (
        <>
          <div className="bg-blue-600 py-16 px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Find Your Perfect Scholarship</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">Explore thousands of scholarship opportunities for your education journey.</p>
          </div>
          <ScholarshipsCategoryPage onNavigate={handleNavigate} />
        </>
      ) : (
        <div className="pt-6">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-4">
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all px-2 py-1 rounded hover:bg-white"
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back to Scholarship List
            </button>
          </div>
          {selectedId && (
            <ScholarshipHubDetailsPage
              id={selectedId}
              onNavigate={handleNavigate}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ScholarshipMainPage;
