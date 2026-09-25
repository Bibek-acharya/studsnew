import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenText,
  ClipboardCheck,
  FileClock,
  ListChecks,
  PlaySquare,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { CarouselSlide } from "@/services/api";
import StudyResourcesCarousel from "./StudyResourcesCarousel";
import {
  STUDY_RESOURCE_CATEGORIES,
  type StudyResourceCategoryIcon,
} from "./studyResourceCategories";

interface StudyResourcesLandingProps {
  slides: CarouselSlide[];
}

const CATEGORY_ICONS: Record<StudyResourceCategoryIcon, LucideIcon> = {
  notes: BookOpenText,
  "past-questions": FileClock,
  "model-questions": ClipboardCheck,
  syllabus: ListChecks,
  video: PlaySquare,
  "mock-test": Sparkles,
};

/** One action label for all six collections: the card always opens the list. */
const CARD_ACTION_LABEL = "View all";

export default function StudyResourcesLanding({
  slides,
}: StudyResourcesLandingProps) {
  const hasSlides = slides.some((slide) => slide.active === true);

  return (
    <section className="bg-gray-50 pb-14 pt-6 sm:pb-16 sm:pt-8">
      <h1 className="sr-only">Study resources for focused exam preparation</h1>
      {/* max-w-350 is the site content width; padding is mobile-only so the
          grid lines up with the rest of the desktop layout. */}
      <div className="mx-auto w-full max-w-350 px-4 sm:px-0">
        <StudyResourcesCarousel slides={slides} />

        <div className={hasSlides ? "mt-10 sm:mt-12" : "mt-3 sm:mt-6"}>
          <div className="mb-6 flex flex-col gap-2 sm:mb-7 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">
                Curated study collections
              </p>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Choose the resource that moves you forward.
              </h2>
            </div>
            <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500 lg:mt-0">
              Start with a focused collection, download what you need, and
              build a revision routine around the material you trust.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STUDY_RESOURCE_CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.icon];

              return (
                <Link
                  key={category.slug}
                  href={category.href}
                  aria-label={`${CARD_ACTION_LABEL}: ${category.label}`}
                  className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-brand-blue">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <h3 className="mb-1.5 text-[15px] font-bold text-gray-900 transition-colors group-hover:text-brand-blue">
                    {category.label}
                  </h3>
                  <p className="mb-4 text-[13px] leading-relaxed text-gray-500">
                    {category.description}
                  </p>

                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue">
                    {CARD_ACTION_LABEL}
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
