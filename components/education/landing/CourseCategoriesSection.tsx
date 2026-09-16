"use client";

import type { SyntheticEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HoverTooltip from "./HoverTooltip";

interface Institution {
  id: number;
  institution_id: string;
  institution_name: string;
  institution_logo: string;
  institution_type: string;
  slug: string;
}

interface CourseCategoriesSectionProps {
  onNavigate: (view: string, data?: { [key: string]: unknown }) => void;
}

const CourseCategoriesSection: React.FC<CourseCategoriesSectionProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [categories, setCategories] = useState<{ field_of_study: string; institutions: Institution[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/system/landing-courses")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const scrollByCard = (direction: -1 | 1) => {
    const container = containerRef.current;
    if (!container) return;

    const card = container.querySelector(".course-category-card") as HTMLDivElement | null;
    const amount = card ? card.offsetWidth + 20 : 340;

    container.scrollBy({
      left: amount * direction,
      behavior: "smooth",
    });
  };

  if (!loading && categories.length === 0) return null;

  return (
<section className="w-full py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8">
  <div className="max-w-350 mx-auto w-full">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4 mb-4 sm:mb-6 md:mb-8">
        <div className="max-w-3xl">
          <h2 className="text-[24px] xs:text-[28px] sm:text-3xl md:text-[36px] lg:text-[40px] font-bold text-[#0B1221] tracking-tight">
            Right Course. Right College.
          </h2>
          <p className="text-gray-500 mt-1.5 sm:mt-2 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px]">
            Explore courses based on your interests and goals.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex shrink-0 gap-2 sm:gap-3">
          <button
            onClick={() => scrollByCard(-1)}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative -mx-3 md:mx-0 sm:px-0">
        <div
          ref={containerRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 pt-1"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="course-category-card flex-none w-70 xs:w-75 sm:w-80 bg-white rounded-xl snap-start border border-blue-500/20 p-3.5 sm:p-4"
                >
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="flex gap-1.5 sm:gap-2 mt-4">
                    {Array.from({ length: 4 }).map((_, lIdx) => (
                      <div
                        key={`skel-logo-${lIdx}`}
                        className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-md bg-gray-200 animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ))
            : categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="course-category-card flex-none w-70 xs:w-75 sm:w-80 bg-white rounded-xl snap-start group cursor-pointer border border-blue-500/20 hover:shadow-xs transition-all duration-300 p-3.5 sm:p-4"
                  onClick={() => onNavigate("courseCategory", { category: cat.field_of_study })}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[17px] xs:text-[18px] sm:text-[19px] font-semibold text-gray-900 group-hover:text-brand-blue transition-all duration-300 tracking-tight">
                      {cat.field_of_study}
                    </h3>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 group-hover:text-brand-blue transition-colors duration-300 transform group-hover:translate-x-1" />
                  </div>
                  {cat.institutions.length > 0 && (
                    <div className="flex gap-1.5 sm:gap-2 mt-4">
                      {cat.institutions.slice(0, 5).map((inst) => (
                        <HoverTooltip
                          key={inst.id}
                          label={inst.institution_name}
                          className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 shrink-0"
                        >
                          <button
                            type="button"
                            className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 shrink-0 rounded-md border border-gray-100 flex items-center justify-center p-1 sm:p-1.5 bg-white hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate("collegeDetails", { id: inst.institution_id, type: inst.institution_type });
                            }}
                            aria-label={`View ${inst.institution_name} details`}
                          >
                            <Image
                              src={inst.institution_logo || "https://placehold.co/48x48/f1f5f9/94a3b8?text=Logo"}
                              alt={inst.institution_name}
                              width={48}
                              height={48}
                              unoptimized
                              className="max-w-full max-h-full object-contain mix-blend-multiply rounded-sm"
                              onError={(e: SyntheticEvent<HTMLImageElement>) => {
                                e.currentTarget.src = "https://placehold.co/48x48/f1f5f9/94a3b8?text=Logo";
                              }}
                            />
                          </button>
                        </HoverTooltip>
                      ))}
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>
      </div>
    </section>
  );
};

export default CourseCategoriesSection;
