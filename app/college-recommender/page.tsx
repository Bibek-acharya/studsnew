"use client";

import React, { useState } from "react";
import CollegeRecommenderToolPage from "@/components/college-recommender/CollegeRecommenderToolPage";

export default function CollegeRecommenderRoute() {
  const handleNavigate = (view: string, data?: any) => {
    if (view === "educationPage") {
      window.location.href = "/";
    } else if (view === "collegeProfile") {
      window.location.href = `/find-college/${data.id}`;
    } else {
      console.log("Navigating to", view, data);
    }
  };

  return <CollegeRecommenderToolPage onNavigate={handleNavigate} />;
}
