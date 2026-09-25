"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { getImageUrl } from "@/services/api";
import type { CarouselSlide } from "@/services/api";

interface StudyResourcesCarouselProps {
  slides: CarouselSlide[];
}

interface CarouselDot {
  index: number;
  isActive: boolean;
  label: string;
}

/**
 * Study-resource promotions, laid out on the landing hero's carousel language:
 * one short rounded banner, a sliding image track, stacked dark overlays,
 * centred copy, and dots flanked by the previous/next controls.
 *
 * It stays manual on purpose — dots and arrows only, no autoplay — and renders
 * nothing at all when no slide is active, so the collection grid below simply
 * moves up.
 */
export default function StudyResourcesCarousel({
  slides,
}: StudyResourcesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const activeSlides = useMemo(
    () => slides.filter((slide) => slide.active === true),
    [slides],
  );
  const slideCount = activeSlides.length;
  const safeIndex = slideCount > 0 ? currentIndex % slideCount : 0;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  // Dip the copy as the slide changes, the same way the landing hero does.
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
  }, [currentIndex, prefersReducedMotion]);

  if (slideCount === 0) return null;

  const showPrevious = () =>
    setCurrentIndex((safeIndex - 1 + slideCount) % slideCount);
  const showNext = () => setCurrentIndex((safeIndex + 1) % slideCount);

  const current = activeSlides[safeIndex];
  const currentLink = current.link_url?.trim();
  const ctaLabel = current.button_text?.trim() || "Learn more";
  const opensExternally = /^https?:\/\//i.test(currentLink ?? "");
  const currentTitle = current.title || "Prepare for what comes next";

  const dots: CarouselDot[] = activeSlides.map((slide, index) => ({
    index,
    isActive: index === safeIndex,
    label: `Go to slide ${index + 1}: ${slide.title || "Study resources"}`,
  }));

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Study resources promotions"
      className="relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 md:rounded-2xl"
    >
      {/* Sliding image track */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          data-testid="carousel-track"
          className="flex h-full w-full transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {activeSlides.map((slide, index) => (
            <div key={slide.id} className="relative h-full w-full shrink-0">
              <Image
                src={getImageUrl(slide.image_url)}
                alt={slide.title || "Study resource promotion"}
                fill
                priority={index === 0}
                sizes="(min-width: 1280px) 1280px, (min-width: 640px) 100%, 100%"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
              <div
                className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/70"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Copy for the active slide only */}
      <div className="relative z-20 flex min-h-[280px] flex-col items-center justify-center px-5 pb-20 pt-12 text-center sm:min-h-[340px] sm:px-8 lg:min-h-[400px]">
        <article
          role="group"
          aria-roledescription="slide"
          aria-label={`${safeIndex + 1} of ${slideCount}`}
          className={`max-w-3xl transition-opacity duration-300 motion-reduce:transition-none ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Study resources
          </div>
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-white drop-shadow sm:text-3xl lg:text-4xl">
            {currentTitle}
          </h2>
          {current.subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-[13px] font-semibold leading-relaxed text-blue-100 drop-shadow sm:text-sm lg:text-base">
              {current.subtitle}
            </p>
          )}
          {current.description && (
            <p className="mx-auto mt-2 max-w-2xl text-[12px] leading-relaxed text-slate-200 drop-shadow sm:text-[13px]">
              {current.description}
            </p>
          )}
          {currentLink && (
            <a
              href={currentLink}
              target={opensExternally ? "_blank" : undefined}
              rel={opensExternally ? "noopener noreferrer" : undefined}
              className="group/cta mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-blue shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 motion-reduce:transform-none motion-reduce:transition-none"
            >
              {ctaLabel}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                aria-hidden="true"
              />
            </a>
          )}
        </article>
      </div>

      {/* Controls: dots between the previous/next buttons */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-center gap-3 pb-4 sm:gap-4 sm:pb-6">
        <button
          type="button"
          onClick={showPrevious}
          aria-label="Previous study resources slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {dots.map((dot) => (
            <button
              key={dot.index}
              type="button"
              onClick={() => setCurrentIndex(dot.index)}
              aria-label={dot.label}
              aria-current={dot.isActive ? "true" : undefined}
              className={`transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 motion-reduce:transition-none ${
                dot.isActive
                  ? "h-1.5 w-5 rounded-full bg-brand-blue sm:h-2.5 sm:w-8"
                  : "h-1.5 w-1.5 rounded-full bg-white/50 hover:bg-white/80 sm:h-2.5 sm:w-2.5"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={showNext}
          aria-label="Next study resources slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {safeIndex + 1} of {slideCount}: {currentTitle}
      </p>
    </section>
  );
}
