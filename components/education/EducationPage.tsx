"use client";

import React from "react";
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
import RecommendedForYouSection from "./landing/RecommendedForYouSection";
import LandingPopups from "./landing/LandingPopups";

interface EducationPageProps {
  onNavigate: (view: string, data?: any) => void;
}

const EducationPage: React.FC<EducationPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white min-h-screen font-sans text-[#111827] antialiased pt-18 xs:pt-20 sm:pt-24 md:pt-27">
      {/* Section 1: Hero */}
      <HeroSection onNavigate={onNavigate} />
      {/* Section 2: Smarter Tools, Greater Success */}
      <SmarterToolsSection onNavigate={onNavigate} />
      {/* Section 3: Event Carousel */}
      <EventShowcaseSection onNavigate={onNavigate} />
      {/* Section 4: Right Course. Right College. */}
      <CourseCategoriesSection onNavigate={onNavigate} />
      {/* Section 5: Explore Featured Colleges & Universities */}
      <FeaturedInstitutionsSection onNavigate={onNavigate} />
      {/* Section 6: Featured Financial Aid */}
      <FinancialAidSection onNavigate={onNavigate} />
      {/* Section 7: Find All Exam Announcements Easily */}
      <ExamAnnouncementsSection onNavigate={onNavigate} />
      {/* Section 8: Latest News & Stories */}
      <NewsStoriesSection onNavigate={onNavigate} />
      {/* Section 9: Ad Widgets */}
      <AdWidgetsSection />
      {/* Section 10: Top College Events */}
      <CampusEventsSection onNavigate={onNavigate} />
      {/* Section 11: What Our Students Say */}
      <TestimonialsSection onNavigate={onNavigate} />
      {/* Section 12: Not sure where to start? */}
      <RecommendedForYouSection onNavigate={onNavigate} />
      {/* Floating Popups */}
      <LandingPopups />
    </div>
  );
};

export default EducationPage;
