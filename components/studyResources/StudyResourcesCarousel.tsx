"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
 * Study-resource promotions, shown as images alone.
 *
 * It keeps the landing hero's frame and sliding track — one rounded banner, a
 * full-bleed image track on the dark base, dots flanked by the previous/next
 * controls — but every text overlay, link and CTA is gone, so the artwork
 * carries the slide by itself. The two heavy black scrims that only existed to
 * keep white copy readable are replaced by a single bottom gradient, which is
 * just enough to keep the controls legible over a pale image.
 *
 * It stays manual on purpose — dots and arrows only, no autoplay — and renders
 * nothing at all when no slide is active, so the collection grid below simply
 * moves up. Slide positions, not slide copy, carry the accessibility labels,
 * and reduced motion is handled in CSS: `motion-reduce:` switches off the track
 * transform and the dot transitions, which is all that is left to switch off now
 * that the copy fade is gone.
 */
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

  const dots: CarouselDot[] = activeSlides.map((_, index) => ({
    index,
    isActive: index === safeIndex,
    label: `Go to slide ${index + 1}`,
  }));

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Study resources promotions"
      className="relative min-h-[280px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ring-1 ring-inset ring-white/10 sm:min-h-[340px] md:rounded-2xl lg:min-h-[400px]"
    >
      {/* Sliding image track */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          data-testid="carousel-track"
          className="flex h-full w-full transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {activeSlides.map((slide, index) => (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slideCount}`}
              className="relative h-full w-full shrink-0"
            >
              <Image
                src={getImageUrl(slide.image_url)}
                alt={`Study resource slide ${index + 1} of ${slideCount}`}
                fill
                priority={index === 0}
                sizes="(min-width: 1280px) 1280px, (min-width: 640px) 100%, 100%"
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* One scrim, under the controls only — no copy to keep legible here. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-linear-to-t from-black/75 via-black/30 to-transparent"
        aria-hidden="true"
      />

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
        Slide {safeIndex + 1} of {slideCount}
      </p>
    </section>
  );
}
