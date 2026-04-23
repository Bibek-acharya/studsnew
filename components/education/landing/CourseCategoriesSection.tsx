"use client";

import type { SyntheticEvent } from "react";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CourseCategoriesSectionProps {
  onNavigate: (view: string, data?: { [key: string]: unknown }) => void;
}

const courseCategories = [
  { title: "Science & Technology", count: "2k+ colleges", isActive: false },
  { title: "Engineering", count: "2k+ colleges", isActive: true },
  { title: "Management & Business", count: "2k+ colleges", isActive: false },
  { title: "Health & Medical", count: "2k+ colleges", isActive: false },
  { title: "Business", count: "2k+ colleges", isActive: false },
  { title: "Arts & Humanities", count: "1.5k+ colleges", isActive: false },
];

const partnerLogos = [
  "https://kist.edu.np/resources/assets/img/logo_small.jpg",
  "https://www.trinity.edu.np/assets/backend/uploads/Logo/trinity%20college%20logo.jpg",
  "https://advancefoundation.edu.np/public/assets/img/logo.jpg",
  "https://kist.edu.np/resources/assets/img/logo_small.jpg",
];

const CourseCategoriesSection: React.FC<CourseCategoriesSectionProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

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
          {courseCategories.map((course, idx) => (
            <div
              key={idx}
              className="course-category-card flex-none w-70 xs:w-75 sm:w-80 bg-white rounded-md snap-start group cursor-pointer border border-blue-500/20 hover:shadow-xs transition-all duration-300 p-3.5 sm:p-4"
              onClick={() => onNavigate("courseCategory", { category: course.title })}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-[17px] xs:text-[18px] sm:text-[19px] font-semibold text-gray-900 group-hover:text-[#0000FF] transition-all duration-300 tracking-tight">
                  {course.title}
                </h3>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 group-hover:text-[#0000FF] transition-colors duration-300 transform group-hover:translate-x-1" />
              </div>
              <p className={`text-xs sm:text-sm ${course.isActive ? 'text-[#0000FF] font-medium' : 'text-gray-500'} mb-5 sm:mb-6 group-hover:text-[#0000CC] transition-all duration-300`}>
                {course.count}
              </p>
              <div className="flex gap-1.5 sm:gap-2">
                {partnerLogos.map((logo, lIdx) => (
                  <div
                    key={lIdx}
                    className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 shrink-0 rounded-md border border-gray-100 flex items-center justify-center p-1 sm:p-1.5  bg-white hover:border-gray-300 transition-colors"
                  >
                    <img
                      src={logo}
                      alt={`Partner ${lIdx + 1}`}
                      className="max-w-full max-h-full object-contain mix-blend-multiply rounded-sm"
                      onError={(e: SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src =
                          "https://placehold.co/48x48/f1f5f9/94a3b8?text=Logo";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
};

export default CourseCategoriesSection;
