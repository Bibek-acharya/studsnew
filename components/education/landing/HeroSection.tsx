"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Link as LinkIcon } from "lucide-react";
import FeedbackWidget from "@/components/FeedbackWidget";
import { getImageUrl } from "@/services/api";
import type { CarouselSlide } from "@/services/api";

type HeroSlide = Partial<CarouselSlide> & {
  image?: string;
  text?: string;
  url?: string;
};

const normalizeSlide = (slide: HeroSlide): HeroSlide => {
  const image = slide.image || slide.image_url || "";
  return {
    ...slide,
    image: image ? getImageUrl(image) : "",
    title: slide.title || slide.text,
    link_url: slide.link_url || slide.url,
  };
};

function readCarouselPayload(payload: unknown): CarouselSlide[] {
  const data = (payload as { data?: unknown } | null)?.data;
  if (Array.isArray(data)) return data as CarouselSlide[];
  if (data && Array.isArray((data as { carousels?: unknown }).carousels)) {
    return (data as { carousels: CarouselSlide[] }).carousels;
  }
  return [];
}

interface HeroSectionProps {
  onNavigate: (
    view: string,
    data?: { search?: string; [key: string]: unknown },
  ) => void;
  slides?: HeroSlide[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const fetchedRef = useRef(false);
  const [fetchedSlides, setFetchedSlides] = useState<HeroSlide[]>([]);
  const displaySlides = useMemo(
    () =>
      (slides.length > 0 ? slides : fetchedSlides)
        .filter((slide) => slide.active === true)
        .map(normalizeSlide),
    [fetchedSlides, slides],
  );

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    if (slides.length > 0) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const fetchCarousel = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/v1/system/carousels?page=landing&active=true`,
        );
        const json = await res.json();
        const remoteSlides = readCarouselPayload(json).filter(
          (slide) => slide.active === true,
        );
        if (remoteSlides.length > 0) {
          setFetchedSlides(remoteSlides.map(normalizeSlide));
        }
      } catch {
        // Keep the static hero copy when the carousel endpoint is unavailable.
      }
    };
    void fetchCarousel();
  }, [API_BASE, slides]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const heroSlides =
    displaySlides.length > 0
      ? displaySlides.map((slide) => ({
          image: slide.image ?? "",
          text: slide.title || slide.subtitle || "studsphere.com",
          url: slide.link_url || "https://studsphere.com",
        }))
      : [];

  const slideCount = heroSlides.length;
  const safeIndex = slideCount > 0 ? currentSlide % slideCount : 0;

  useEffect(() => {
    if (slideCount < 2 || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, slideCount]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const frame = requestAnimationFrame(() => {
      setFade(false);
      timeoutId = setTimeout(() => setFade(true), 120);
    });
    return () => {
      cancelAnimationFrame(frame);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentSlide, prefersReducedMotion]);

  return (
    <div className="w-full pt-2 pb-6 md:pb-4 flex justify-center px-4 sm:px-6 md:px-8">
      <main className="relative w-full max-w-350 h-60 sm:h-70 md:h-auto md:min-h-120 lg:h-135 flex items-center justify-center overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Slider Container */}
        {heroSlides.length > 0 && (
          <div
            id="slider-container"
            className="absolute inset-0 z-0 overflow-hidden"
          >
            <div
              className="flex h-full w-full transition-transform duration-700 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${safeIndex * 100}%)` }}
            >
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className="h-full w-full shrink-0 bg-cover bg-center"
                  style={{
                    backgroundImage: slide.image
                      ? `url('${slide.image}')`
                      : undefined,
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}

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
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 drop- leading-tight">
            Find Your Perfect College
          </p>
          <p className="text-[13px] md:text-sm lg:text-base text-gray-200 max-w-3xl mx-auto mb-6 drop-shadow px-0">
            Discover and compare colleges with our free search tool. Get
            insights on admissions, programs, and student reviews to build your
            ideal college list.
          </p>

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
        {heroSlides.length > 0 && (
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
                    className={`nav-dot transition-all duration-300 focus:outline-none motion-reduce:transition-none ${
                      safeIndex === index
                        ? "w-5 md:w-8 h-1.5 md:h-2.5 rounded-full bg-brand-blue"
                        : "w-1.5 md:w-2.5 h-1.5 md:h-2.5 rounded-full bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={safeIndex === index ? "true" : undefined}
                  ></button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Floating Link (Desktop) */}
        {heroSlides.length > 0 && (
          <a
            href={heroSlides[safeIndex].url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex absolute bottom-8 right-8 z-30 bg-white text-brand-blue items-center gap-2 px-5 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <LinkIcon className="w-5 h-5 text-brand-blue group-hover:rotate-12 transition-transform" />
            <span className="text-base">{heroSlides[safeIndex].text}</span>
          </a>
        )}

        <FeedbackWidget />
      </main>
    </div>
  );
};

export default HeroSection;
