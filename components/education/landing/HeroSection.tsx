"use client";

import { useState, useEffect } from "react";
import { Search, Link as LinkIcon } from "lucide-react";
import FeedbackWidget from "@/components/FeedbackWidget";

interface HeroSectionProps {
  onNavigate: (
    view: string,
    data?: { search?: string; [key: string]: unknown },
  ) => void;
  slides?: {
    image: string;
    title?: string;
    subtitle?: string;
    link_url?: string;
    button_text?: string;
  }[];
}

const DEFAULT_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
    text: "studsphere.com",
    url: "https://studsphere.com",
  },
  {
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=2070&auto=format&fit=crop",
    text: "studsphere.com",
    url: "https://studsphere.com",
  },
  {
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2065&auto=format&fit=crop",
    text: "studsphere.com",
    url: "https://studsphere.com",
  },
  {
    image:
      "https://images.unsplash.com/photo-1525926476841-be2069c93a4d?q=80&w=2070&auto=format&fit=crop",
    text: "studsphere.com",
    url: "https://studsphere.com",
  },
  {
    image:
      "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1974&auto=format&fit=crop",
    text: "studsphere.com",
    url: "https://studsphere.com",
  },
];

const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  slides = [],
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);
  const [desktopQuery, setDesktopQuery] = useState("");
  const [fetchedSlides, setFetchedSlides] = useState(slides);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    if (slides.length > 0) {
      setFetchedSlides(slides);
      return;
    }
    const fetchCarousel = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/v1/system/carousels?page=landing`,
        );
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setFetchedSlides(
            json.data.map(
              (s: {
                image_url: string;
                link_url: string;
                title?: string;
                subtitle?: string;
              }) => ({
                image: s.image_url.startsWith("/uploads")
                  ? `${API_BASE}${s.image_url}`
                  : s.image_url,
                title: s.title,
                subtitle: s.subtitle,
                link_url: s.link_url,
              }),
            ),
          );
        }
      } catch {
        // fallback to defaults
      }
    };
    fetchCarousel();
  }, [slides]);

  const heroSlides =
    fetchedSlides.length > 0
      ? fetchedSlides.map((s) => ({
          image: s.image,
          text: s.title || s.subtitle || "studsphere.com",
          url: s.link_url || "https://studsphere.com",
        }))
      : DEFAULT_SLIDES.slice(0, 1);

  const slideCount = heroSlides.length;
  const safeIndex = slideCount > 0 ? currentSlide % slideCount : 0;

  useEffect(() => {
    if (slideCount === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideCount]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const frame = requestAnimationFrame(() => {
      setFade(false);
      timeoutId = setTimeout(() => setFade(true), 120);
    });
    return () => {
      cancelAnimationFrame(frame);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentSlide]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = desktopQuery.trim();
    if (!query) return;
    onNavigate("findCollege", { search: query });
  };

  return (
    <div className="w-full pt-2 pb-6 md:pb-4 flex justify-center px-4 sm:px-6 md:px-8">
      <main className="relative w-full max-w-350 h-60 sm:h-70 md:h-auto md:min-h-120 lg:h-135 flex items-center justify-center overflow-hidden rounded-xl md:rounded-2xl">
        {/* Background Slider Container */}
        <div
          id="slider-container"
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <div
            className="flex h-full w-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className="h-full w-full shrink-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${slide.image}')` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Dark Overlays */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/70 z-10"></div>

        {/* MOBILE LAYOUT */}
        <div className="md:hidden relative z-20 w-full h-full flex flex-col justify-center items-center px-4 sm:px-6 text-white text-center mt-0 sm:mt-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 drop- leading-tight">
            Find Your Perfect College
          </h1>
          <p className="text-[12px] sm:text-[13px] text-gray-200 max-w-[320px] mx-auto mb-5 drop-shadow leading-relaxed">
            Discover and compare colleges with our free search tool. Get
            insights on admissions, programs, and student reviews to build your
            ideal college list.
          </p>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden md:block relative z-20 w-full max-w-5xl mx-auto px-6 lg:px-8 text-center sm:pb-0 sm:-mt-10 text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 drop- leading-tight">
            Find Your Perfect College
          </h1>
          <p className="text-[13px] md:text-sm lg:text-base text-gray-200 max-w-3xl mx-auto mb-6 drop-shadow px-0">
            Discover and compare colleges with our free search tool. Get
            insights on admissions, programs, and student reviews to build your
            ideal college list.
          </p>

          <form
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto bg-white rounded-md p-2 flex flex-row items-center shadow-lg gap-2 transition-all duration-300"
          >
            <div className="w-full grow flex items-center px-4 gap-2">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={desktopQuery}
                onChange={(e) => setDesktopQuery(e.target.value)}
                placeholder="Search by college name, location & program..."
                className="w-full bg-transparent text-gray-800 text-[15px] py-2.5 outline-none placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              className="w-auto bg-brand-blue hover:bg-brand-hover text-white font-semibold py-2.5 px-8 rounded-md transition-colors duration-200  text-[15px] whitespace-nowrap"
            >
              Search
            </button>
          </form>

          {/* <div className="mt-6 flex flex-wrap justify-center items-center gap-3 text-sm font-medium text-gray-200 drop-">
              <span className="font-bold text-white">Your recent visit:</span>
              <button
                onClick={() => onNavigate("findCollege", { search: "BIT" })}
                className="hover:text-white hover:underline transition-colors"
              >
                BIT Colleges
              </button>
              <span className="text-gray-400 inline">&bull;</span>
              <button
                onClick={() => onNavigate("collegeRecommender")}
                className="hover:text-white hover:underline transition-colors"
              >
                College Predictor
              </button>
              <span className="text-gray-400 inline">&bull;</span>
              <button
                onClick={() => onNavigate("scholarshipFinder")}
                className="hover:text-white hover:underline transition-colors"
              >
                Scholarship
              </button>
            </div> */}
        </div>

        {/* BOTTOM CONTROLS */}
        <div className="absolute bottom-4 md:bottom-8 left-0 w-full flex flex-col items-center z-30">
          <a
            href={heroSlides[safeIndex].url}
            target="_blank"
            rel="noopener noreferrer"
            className={`md:hidden fade-text text-white text-[13px] font-semibold underline decoration-white/80 underline-offset-4 drop-shadow-lg hover:text-gray-200 transition-opacity duration-300 mb-3 ${fade ? "opacity-100" : "opacity-0"}`}
          >
            {heroSlides[safeIndex].text}
          </a>

          {heroSlides.length > 1 && (
            <div className="flex items-center space-x-2 md:space-x-3">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`nav-dot transition-all duration-300 focus:outline-none ${
                    currentSlide === index
                      ? "w-5 md:w-8 h-1.5 md:h-2.5 rounded-full bg-brand-blue"
                      : "w-1.5 md:w-2.5 h-1.5 md:h-2.5 rounded-full bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          )}
        </div>

        {/* Floating Link (Desktop) */}
        <a
          href={heroSlides[safeIndex].url}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex absolute bottom-8 right-8 z-30 bg-white text-brand-blue items-center gap-2 px-5 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <LinkIcon className="w-5 h-5 text-brand-blue group-hover:rotate-12 transition-transform" />
          <span className="text-base">{heroSlides[safeIndex].text}</span>
        </a>

        <FeedbackWidget />
      </main>
    </div>
  );
};

export default HeroSection;
