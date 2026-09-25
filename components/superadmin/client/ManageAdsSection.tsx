"use client";

import React, { useRef, useState } from "react";
import AdvertiseRequestSection from "./AdvertiseRequestSection";
import PopupManagementTab from "./PopupManagementTab";
import HeroBannerTab from "./HeroBannerTab";
import ShowcaseBannerTab from "./ShowcaseBannerTab";
import UniversityAffiliationSection from "./UniversityAffiliationSection";
import CoursePageAdsSection from "./CoursePageAdsSection";
import CollegePageAdsSection from "./CollegePageAdsSection";
import CollegeAdCardsToggleSection from "./CollegeAdCardsToggleSection";
import LandingCoursesTab from "./LandingCoursesTab";

const TABS = [
  { id: "advertise", label: "Advertise Request" },
  { id: "course-ads", label: "Course Page Ads" },
  { id: "college-ads", label: "College Page Ads" },
  { id: "college-ad-cards", label: "College Ad Cards" },
  { id: "popup", label: "Landing Page Popup" },
  { id: "hero", label: "Hero Banner" },
  {
    id: "study-resources-carousel",
    label: "Study Resources Carousel",
  },
  { id: "showcase", label: "Showcase Banner" },
  { id: "landing-courses", label: "Landing Courses" },
  { id: "affiliation", label: "University Affiliation" },
];

export default function ManageAdsSection() {
  const [activeTab, setActiveTab] = useState("advertise");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % TABS.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = TABS.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    setActiveTab(TABS[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <div className="mb-6 w-full overflow-x-auto rounded-lg border border-gray-200 bg-white p-1 no-scrollbar">
        <div
          role="tablist"
          aria-label="Ad and banner management"
          aria-orientation="horizontal"
          className="flex w-max min-w-full items-center gap-1"
        >
          {TABS.map((tab, index) => (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`manage-ads-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={
                activeTab === tab.id ? "manage-ads-panel" : undefined
              }
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`shrink-0 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div id="manage-ads-panel" role="tabpanel" aria-labelledby={`manage-ads-tab-${activeTab}`}>
        {activeTab === "course-ads" && <CoursePageAdsSection />}
        {activeTab === "college-ads" && <CollegePageAdsSection />}
        {activeTab === "college-ad-cards" && <CollegeAdCardsToggleSection />}
        {activeTab === "advertise" && <AdvertiseRequestSection />}
        {activeTab === "popup" && <PopupManagementTab />}
        {activeTab === "hero" && <HeroBannerTab />}
        {activeTab === "study-resources-carousel" && (
          <HeroBannerTab
            page="study-resources"
            heading="Study Resources Carousel"
            itemLabel="Study Resources Slide"
            description="Slides pinned to page=study-resources. Drag rows or use the arrow controls to change the order students see them in."
          />
        )}
        {activeTab === "showcase" && <ShowcaseBannerTab />}
        {activeTab === "landing-courses" && <LandingCoursesTab />}
        {activeTab === "affiliation" && <UniversityAffiliationSection />}
      </div>
    </div>
  );
}
