"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TabKey =
  | "tab-about"
  | "tab-courses"
  | "tab-institutes"
  | "tab-admissions"
  | "tab-scholarship"
  | "tab-events"
  | "tab-news"
  | "tab-download"
  | "tab-gallery"
  | "tab-review";

const TABS: { key: TabKey; label: string }[] = [
  { key: "tab-about", label: "About" },
  { key: "tab-courses", label: "Courses & Fees" },
  { key: "tab-institutes", label: "Institute / Faculties" },
  { key: "tab-admissions", label: "Admissions" },
  { key: "tab-scholarship", label: "Scholarship" },
  { key: "tab-events", label: "Events" },
  { key: "tab-news", label: "News & Notices" },
  { key: "tab-download", label: "Download" },
  { key: "tab-gallery", label: "Gallery" },
  { key: "tab-review", label: "Review" },
];

interface UniversityTabsProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

export default function UniversityTabs({ activeTab, setActiveTab }: UniversityTabsProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const nav = navRef.current;
    if (!nav) return;
    setCanScrollLeft(nav.scrollLeft > 5);
    setCanScrollRight(nav.scrollLeft < nav.scrollWidth - nav.clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const nav = navRef.current;
    if (!nav) return;
    nav.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      nav.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const nav = navRef.current;
    if (!nav) return;
    const scrollAmount = nav.clientWidth * 0.7;
    nav.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  const handleTabClick = (tab: TabKey) => {
    setActiveTab(tab);
    // Scroll to make the clicked tab visible
    const nav = navRef.current;
    if (!nav) return;
    const tabButton = nav.querySelector(`[data-tab="${tab}"]`) as HTMLElement;
    if (tabButton) {
      const navRect = nav.getBoundingClientRect();
      const tabRect = tabButton.getBoundingClientRect();
      if (tabRect.left < navRect.left) {
        nav.scrollBy({ left: tabRect.left - navRect.left - 16, behavior: "smooth" });
      } else if (tabRect.right > navRect.right) {
        nav.scrollBy({ left: tabRect.right - navRect.right + 16, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="sticky top-0 z-40 border-b border-t border-gray-100 bg-white shadow-sm shadow-gray-100/50">
      <div className="relative mx-auto max-w-[1400px]">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 z-10 flex h-full w-10 items-center justify-center bg-gradient-to-r from-white via-white/90 to-transparent lg:hidden"
            aria-label="Scroll tabs left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Tab Nav */}
        <div
          ref={navRef}
          className="flex space-x-8 whitespace-nowrap overflow-x-auto no-scrollbar px-4 sm:px-0 md:px-0"
          id="tab-nav"
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              data-tab={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`border-b-2 py-4 text-[15px] transition-colors shrink-0 ${
                activeTab === tab.key
                  ? "border-blue-600 font-bold text-gray-900"
                  : "border-transparent font-semibold text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 z-10 flex h-full w-10 items-center justify-center bg-gradient-to-l from-white via-white/90 to-transparent lg:hidden"
            aria-label="Scroll tabs right"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}
