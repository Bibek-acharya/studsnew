"use client";

import EducationPage from "@/components/education/EducationPage";

export default function Home() {
  const handleNavigate = (view: string, data?: any) => {
    if (view.startsWith("search")) {
      window.location.href = `/${view}`;
    } else if (view === "compareColleges") {
      window.location.href = "/compare-colleges";
    } else if (view === "bookCounselling") {
      window.location.href = "/counseling";
    } else if (view === "collegeRecommenderTool") {
      window.location.href = "/college-recommender";
    } else if (view.startsWith("http")) {
      window.open(view, "_blank");
    } else {
      console.log("Navigate to:", view, data);
    }
  };

  return <EducationPage onNavigate={handleNavigate} />;
}
