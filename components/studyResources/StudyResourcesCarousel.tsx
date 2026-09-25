"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { getImageUrl } from "@/services/api";
import type { CarouselSlide } from "@/services/api";

interface StudyResourcesCarouselProps {
  slides: CarouselSlide[];
}

export default function StudyResourcesCarousel({
  slides,
}: StudyResourcesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeSlides = useMemo(
    () => slides.filter((slide) => slide.active === true),
    [slides],
  );
  const slideCount = activeSlides.length;
  const safeIndex = slideCount > 0 ? currentIndex % slideCount : 0;

  if (slideCount === 0) return null;

  const showPrevious = () =>
    setCurrentIndex((safeIndex - 1 + slideCount) % slideCount);
  const showNext = () => setCurrentIndex((safeIndex + 1) % slideCount);

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Study resources promotions"
      className="relative isolate min-h-[520px] overflow-hidden rounded-2xl bg-slate-950 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.65)] sm:min-h-[490px] lg:min-h-[460px] lg:rounded-[28px]"
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {activeSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
              index === safeIndex ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={index !== safeIndex}
          >
            <Image
              src={getImageUrl(slide.image_url)}
              alt={slide.title || "Study resource promotion"}
              fill
              priority={index === 0}
              sizes="(min-width: 1280px) 1280px, (min-width: 640px) 100vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.82)_42%,rgba(2,6,23,0.3)_75%,rgba(2,6,23,0.16)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(2,6,23,0.92)_0%,transparent_58%)] lg:bg-[linear-gradient(90deg,transparent_55%,rgba(2,6,23,0.3)_100%)]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/3 h-px w-2/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-[520px] flex-col justify-end px-5 pb-28 pt-28 sm:min-h-[490px] sm:px-10 sm:pb-24 sm:pt-24 lg:min-h-[460px] lg:px-16 lg:py-14">
        {activeSlides.map((slide, index) => {
          const isActive = index === safeIndex;
          const link = slide.link_url?.trim();
          const ctaLabel = slide.button_text?.trim() || "Learn more";
          const opensExternally = /^https?:\/\//i.test(link ?? "");

          return (
            <article
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slideCount}`}
              aria-hidden={!isActive}
              className={`max-w-3xl transition-all duration-500 motion-reduce:transition-none ${
                isActive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none absolute translate-y-3 opacity-0"
              }`}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-100 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Study resources
              </div>
              <h2 className="max-w-2xl text-3xl font-bold leading-[1.08] tracking-[-0.035em] text-white sm:text-4xl lg:text-[48px]">
                {slide.title || "Prepare for what comes next"}
              </h2>
              {slide.subtitle && (
                <p className="mt-3 max-w-2xl text-base font-semibold leading-relaxed text-blue-100 sm:text-lg">
                  {slide.subtitle}
                </p>
              )}
              {slide.description && (
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-[15px]">
                  {slide.description}
                </p>
              )}
              {link && (
                <a
                  href={link}
                  target={opensExternally ? "_blank" : undefined}
                  rel={opensExternally ? "noopener noreferrer" : undefined}
                  tabIndex={isActive ? 0 : -1}
                  className="group/cta mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-slate-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  {ctaLabel}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </a>
              )}
            </article>
          );
        })}
      </div>

      {slideCount > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 border-t border-white/10 bg-slate-950/30 px-5 py-3 backdrop-blur-md sm:px-10 lg:px-16">
          <div
            className="flex min-w-0 items-center gap-2"
            role="group"
            aria-label="Choose a promotion slide"
          >
            {activeSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${index + 1}: ${slide.title || "Study resources"}`}
                aria-pressed={index === safeIndex}
                onClick={() => setCurrentIndex(index)}
                className="group flex h-9 w-7 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <span
                  className={`block rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    index === safeIndex
                      ? "h-2.5 w-6 bg-blue-400"
                      : "h-2 w-2 bg-white/45 group-hover:bg-white/80"
                  }`}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous study resources slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next study resources slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {safeIndex + 1} of {slideCount}:{" "}
        {activeSlides[safeIndex].title || "Study resources"}
      </p>
    </section>
  );
}
