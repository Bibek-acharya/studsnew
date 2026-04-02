"use client";

import { useState, useEffect } from "react";

interface HeroSectionProps {
  onNavigate: (view: string, data?: any) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1380&q=80",
      alt: "College Campus 1",
      collegeLabel: "kist.edu.np",
      collegeSearch: "KIST College",
      collegeHref: "https://kist.edu.np",
    },
    {
      image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1380&q=80",
      alt: "College Campus 2",
      collegeLabel: "trinity.edu.np",
      collegeSearch: "Trinity International College",
      collegeHref: "https://trinity.edu.np",
    },
    {
      image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1380&q=80",
      alt: "Library",
      collegeLabel: "sxj.edu.np",
      collegeSearch: "St. Xavier's College",
      collegeHref: "https://sxj.edu.np",
    },
    {
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1380&q=80",
      alt: "Graduation",
      collegeLabel: "kcm.edu.np",
      collegeSearch: "Kathmandu College of Management",
      collegeHref: "https://kcm.edu.np",
    },
    {
      image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1380&q=80",
      alt: "Students",
      collegeLabel: "goldengate.edu.np",
      collegeSearch: "GoldenGate International College",
      collegeHref: "https://goldengate.edu.np",
    }
  ];

  const activeSlide = heroSlides[currentSlide];

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
    <main className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-900 rounded-[12px] overflow-hidden flex items-center mb-6 max-w-[1400px] mx-auto group mt-8">
      <div
        id="hero-slider"
        className="absolute inset-0 flex w-[500%] h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 20}%)` }}
      >
        {heroSlides.map((slide, index) => (
          <div key={index} className="w-[20%] h-full relative">
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-black/60 rounded-[12px] pointer-events-none z-10" />

      <div className="relative z-20 w-full flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-white text-[28px] sm:text-4xl md:text-[46px] font-bold mb-3 sm:mb-4 tracking-tight leading-tight">
          Find Your Perfect College
        </h1>
        <p className="text-gray-200 text-[14px] md:text-[16px] max-w-2xl mx-auto mb-6 sm:mb-8 font-light leading-normal px-2">
          Discover and compare colleges with our free search tool. Get insights
          on admissions, programs, and student reviews to build your ideal
          college list.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchTerm.trim()) {
              onNavigate(`search?q=${encodeURIComponent(searchTerm)}`);
            }
          }}
          className="w-full max-w-[650px] bg-white rounded-lg p-2 flex flex-col sm:flex-row items-center shadow-lg mb-6 gap-2 sm:gap-0"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by college name, location & program..."
            className="w-full sm:flex-1 bg-transparent border-none outline-none px-3 sm:px-5 h-[50px] sm:h-auto sm:py-0 text-gray-700 placeholder-gray-400 text-[14px] sm:text-[15px] font-medium"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#4461f2] hover:bg-blue-600 text-white px-8 h-[50px] sm:h-auto sm:py-3 rounded-md font-medium transition-colors text-[15px] shrink-0"
          >
            Search
          </button>
        </form>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-gray-200 text-[13px] sm:text-[14px]">
          <span className="font-bold tracking-wide">Your recent visit:</span>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 sm:gap-4">
            <button
              type="button"
              onClick={() => onNavigate("findCollege", { search: "BIT" })}
              className="text-white hover:underline hover:text-blue-300 transition-colors"
            >
              BIT Colleges
            </button>
            <span className="hidden sm:inline text-gray-400">•</span>
            <button
              type="button"
              onClick={() => onNavigate("collegeRecommender")}
              className="text-white hover:underline hover:text-blue-300 transition-colors"
            >
              College Predictor
            </button>
            <span className="hidden sm:inline text-gray-400">•</span>
            <button
              type="button"
              onClick={() => onNavigate("scholarshipFinder")}
              className="text-white hover:underline hover:text-blue-300 transition-colors"
            >
              Scholarship
            </button>
          </div>
        </div>
      </div>

      <div id="carousel-dots" className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "w-8 h-2 bg-[#4461f2] shadow-sm"
                : "w-4 h-2 bg-white/60 hover:bg-white/90"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      <a
        href={activeSlide.collegeHref}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 z-20 bg-white hover:bg-gray-50 border border-gray-100 text-[#4461f2] px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[14px] font-semibold shadow-md transition-all hover:scale-105"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[12px] h-[12px] sm:w-[16px] sm:h-[16px]"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <span className="hidden sm:inline">{activeSlide.collegeLabel}</span>
        <span className="sm:hidden tracking-wide">{activeSlide.collegeLabel.split('.')[0]}</span>
      </a>
    </main>
    </div>
  );
};

export default HeroSection;
