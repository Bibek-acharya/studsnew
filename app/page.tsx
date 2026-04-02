"use client";

import EducationPage from "@/components/education/EducationPage";

export default function Home() {
  const handleNavigate = (view: string, data?: any) => {
    if (view.startsWith("search")) {
      window.location.href = `/${view}`;
    } else if (view.startsWith("http")) {
      window.open(view, "_blank");
    } else {
      console.log("Navigate to:", view, data);
    }
  };

  return <EducationPage onNavigate={handleNavigate} />;
}
