"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "./landing/HeroSection";
import SmarterToolsSection from "./landing/SmarterToolsSection";
import EventShowcaseSection from "./landing/EventShowcaseSection";
import CourseCategoriesSection from "./landing/CourseCategoriesSection";
import FeaturedInstitutionsSection from "./landing/FeaturedInstitutionsSection";
import FinancialAidSection from "./landing/FinancialAidSection";
import ExamAnnouncementsSection from "./landing/ExamAnnouncementsSection";
import NewsStoriesSection from "./landing/NewsStoriesSection";
import AdWidgetsSection from "./landing/AdWidgetsSection";
import CampusEventsSection from "./landing/CampusEventsSection";
import TestimonialsSection from "./landing/TestimonialsSection";
import LandingPopups from "./landing/LandingPopups";
import { College, EducationEvent, EducationNewsItem, ScholarshipItem } from "@/services/api";

interface EducationPageProps {
  featuredColleges: College[];
  scholarships: ScholarshipItem[];
  eventSlides: EducationEvent[];
  newsArticles: EducationNewsItem[];
}

const EducationPage: React.FC<EducationPageProps> = ({
  featuredColleges,
  scholarships,
  eventSlides,
  newsArticles,
}) => {
  const router = useRouter();

  const handleNavigate = useCallback(
    (view: string, data?: { search?: string; [key: string]: unknown }) => {
    if (view.startsWith("search")) {
      router.push(`/${view}`);
    } else if (view === "compareColleges") {
      router.push("/compare-colleges");
    } else if (view === "bookCounselling") {
      router.push("/counseling");
    } else if (view === "collegeRecommenderTool") {
      router.push("/college-recommender");
    } else if (view.startsWith("http")) {
      window.open(view, "_blank");
    } else {
      console.log("Navigate to:", view, data);
    }
    },
    [router],
  );
  return (
    <div className="bg-white min-h-screen font-sans text-[#111827] antialiased pt-4 sm:pt-6 overflow-x-hidden">
      {/* Section 1: Hero */}
      <HeroSection onNavigate={handleNavigate} />
      {/* Section 2: Smarter Tools, Greater Success */}
      <SmarterToolsSection onNavigate={handleNavigate} />
      {/* Section 3: Event Carousel */}
      <EventShowcaseSection onNavigate={handleNavigate} events={eventSlides} />
      {/* Section 4: Right Course. Right College. */}
      <CourseCategoriesSection onNavigate={handleNavigate} />
      {/* Section 5: Explore Featured Colleges & Universities */}
      <FeaturedInstitutionsSection onNavigate={handleNavigate} featuredColleges={featuredColleges} />
      {/* Section 6: Featured Financial Aid */}
      <FinancialAidSection onNavigate={handleNavigate} scholarships={scholarships} />
      {/* Section 7: Find All Exam Announcements Easily */}
      <ExamAnnouncementsSection onNavigate={handleNavigate} />
      {/* Section 8: Latest News & Stories */}
      <NewsStoriesSection onNavigate={handleNavigate} newsArticles={newsArticles} />
      {/* Section 9: Ad Widgets */}
      <AdWidgetsSection />
      {/* Section 10: Top College Events */}
      <CampusEventsSection onNavigate={handleNavigate} />
      {/* Section 11: What Our Students Say */}
      <TestimonialsSection onNavigate={handleNavigate} />
      {/* Section 12: Not sure where to start? */}
      {/* <RecommendedForYouSection onNavigate={onNavigate} /> */}
      {/* Floating Popups */}
      <LandingPopups />
    </div>
  );
};

export default EducationPage;
