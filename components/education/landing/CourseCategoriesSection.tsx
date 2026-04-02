"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CourseCategoriesSectionProps {
  onNavigate: (view: string, data?: any) => void;
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
    <section className="w-full py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-[28px] md:text-[40px] font-bold text-[#0B1221] tracking-tight">
            Right Course. Right College.
          </h2>
          <p className="text-gray-500 mt-2 text-[15px] md:text-[17px]">
            Explore courses based on your interests and goals.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => scrollByCard(-1)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white shadow-sm text-gray-500 hover:text-gray-800"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white shadow-sm text-gray-500 hover:text-gray-800"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative -mx-4 sm:mx-0 sm:px-0">
        <div
          ref={containerRef}
          className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 pt-1"
        >
          {courseCategories.map((course, idx) => (
            <div
              key={idx}
              className="course-category-card flex-none w-[320px] bg-white rounded-xl snap-start group cursor-pointer border border-transparent hover:border-blue-100 hover:shadow-md transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-4"
              onClick={() => onNavigate("courseCategory", { category: course.title })}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-[19px] font-semibold text-gray-900 group-hover:text-blue-600 transition-all duration-300 tracking-tight">
                  {course.title}
                </h3>
                <ChevronRight className="w-5 h-5 text-gray-400 mt-0.5 group-hover:text-blue-500 transition-colors duration-300 transform group-hover:translate-x-1" />
              </div>
              <p className={`text-sm ${course.isActive ? 'text-blue-500 font-medium' : 'text-gray-500'} mb-6 group-hover:text-blue-500 transition-all duration-300`}>
                {course.count}
              </p>
              <div className="flex gap-2">
                {partnerLogos.map((logo, lIdx) => (
                  <div
                    key={lIdx}
                    className="w-12 h-12 flex-shrink-0 rounded-xl border border-gray-100 flex items-center justify-center p-1.5 shadow-sm bg-white hover:border-gray-300 transition-colors"
                  >
                    <img
                      src={logo}
                      alt={`Partner ${lIdx + 1}`}
                      className="max-w-full max-h-full object-contain mix-blend-multiply rounded-sm"
                      onError={(e: any) => { e.target.src = "https://placehold.co/48x48/f1f5f9/94a3b8?text=Logo"; }}
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
