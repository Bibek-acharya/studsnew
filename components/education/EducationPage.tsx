"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "./landing/HeroSection";
import SmarterToolsSection from "./landing/SmarterToolsSection";
import EventShowcaseSection from "./landing/EventShowcaseSection";
import FeaturedInstitutionsSection from "./landing/FeaturedInstitutionsSection";
import FinancialAidSection from "./landing/FinancialAidSection";
import ExamAnnouncementsSection from "./landing/ExamAnnouncementsSection";
import NewsStoriesSection from "./landing/NewsStoriesSection";
import AdWidgetsSection from "./landing/AdWidgetsSection";
import CampusEventsSection from "./landing/CampusEventsSection";
import TestimonialsSection from "./landing/TestimonialsSection";
import {
  College,
  EducationEvent,
  EducationNewsItem,
  ScholarshipItem,
} from "@/services/api";
import {
  mockFeaturedColleges,
  mockScholarships,
  mockExams,
  mockNewsArticles,
  mockEvents,
  mockTestimonials,
} from "./landing/mockData";

interface EducationPageProps {
  featuredColleges: College[];
  scholarships: ScholarshipItem[];
  eventSlides: EducationEvent[];
  newsArticles: EducationNewsItem[];
  exams?: any[];
  heroSlides?: any[];
  ads?: any[];
  testimonials?: Array<{
    id: number;
    user_name: string;
    rating: number;
    experience: string;
  }>;
}

const EducationPage: React.FC<EducationPageProps> = ({
  featuredColleges,
  scholarships,
  eventSlides,
  newsArticles,
  exams = [],
  heroSlides = [],
  ads = [],
  testimonials = [],
}) => {
  const displayColleges = featuredColleges.length > 0 ? featuredColleges : mockFeaturedColleges;
  const displayScholarships = scholarships.length > 0 ? scholarships : mockScholarships;
  const displayExams = exams.length > 0 ? exams : mockExams;
  const displayNews = newsArticles.length > 0 ? newsArticles : mockNewsArticles;
  const displayEvents = eventSlides.length > 0 ? eventSlides : mockEvents;
  const displayTestimonials = testimonials.length > 0 ? testimonials : mockTestimonials;
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
      } else if (view === "scholarshipRecommenderTool") {
        router.push("/scholarship-recommender");
      } else if (view === "courseFinder") {
        router.push("/course-finder");
      } else if (view === "scholarshipFinderTool") {
        router.push("/scholarship-finder");
      } else if (view === "collegeDetails" && data?.id) {
        router.push(`/find-college/${data.id}`);
      } else if (view === "newsDetails" && data?.id) {
        router.push(`/news/${data.slug || `edu-${data.id}`}`);
      } else if (view === "eventDetails" && data?.id) {
        router.push(`/events/${data.slug || `edu-${data.id}`}`);
      } else if (view.startsWith("http")) {
        window.open(view, "_blank");
      } else {
        console.log("Navigate to:", view, data);
      }
    },
    [router],
  );
  const heroRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onScroll = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      setShowBackToTop(heroBottom < 0);

      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };

    // observe hero visibility
    const observer = new IntersectionObserver(
      ([entry]) => setShowBackToTop(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(hero);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white min-h-screen font-sans text-[#111827] antialiased pt-4 sm:pt-6 overflow-x-hidden">
      {/* Section 1: Hero */}
      <div ref={heroRef}>
        <HeroSection onNavigate={handleNavigate} slides={heroSlides} />
      </div>
      {/* Section 2: Smarter Tools, Greater Success */}
      <SmarterToolsSection onNavigate={handleNavigate} />
      {/* Section 3: Event Carousel */}
      <EventShowcaseSection onNavigate={handleNavigate} />
      {/* Section 4: Right Course. Right College. */}
      {/* <CourseCategoriesSection onNavigate={handleNavigate} /> */}
      {/* Section 5: Explore Featured Colleges & Universities */}
      <FeaturedInstitutionsSection
        onNavigate={handleNavigate}
        featuredColleges={displayColleges}
      />
      {/* Section 6: Featured Financial Aid */}
      <FinancialAidSection
        onNavigate={handleNavigate}
        scholarships={displayScholarships}
      />
      {/* Section 7: Find All Exam Announcements Easily */}
      <ExamAnnouncementsSection onNavigate={handleNavigate} exams={displayExams} />
      {/* Section 8: Latest News & Stories */}
      <NewsStoriesSection
        onNavigate={handleNavigate}
        newsArticles={displayNews}
      />
      {/* Section 9: Ad Widgets */}
      <AdWidgetsSection ads={ads} />
      {/* Section 10: Top College Events */}
      <CampusEventsSection onNavigate={handleNavigate} events={displayEvents} />
      {/* Section 11: What Our Students Say */}
      <TestimonialsSection
        onNavigate={handleNavigate}
        testimonials={displayTestimonials}
      />
      {/* Section 12: Not sure where to start? */}
      {/* <RecommendedForYouSection onNavigate={onNavigate} /> */}
      {/* Floating Popups */}
      {/* <LandingPopups /> */}

      {/* Back to Top */}
      <div
        onClick={scrollToTop}
        role="button"
        tabIndex={0}
        aria-label="Back to top"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") scrollToTop();
        }}
        className={`fixed bottom-6 right-6 z-50 cursor-pointer transition-all duration-300 max-md:hidden ${
          showBackToTop
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="relative flex items-center justify-center h-16 w-16">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="5"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#0000FF"
              strokeWidth="5"
              strokeDasharray={`${scrollProgress * circumference} ${circumference}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 hover:scale-110 pointer-events-none">
            <i className="fa-solid fa-arrow-up text-base text-brand-blue"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
