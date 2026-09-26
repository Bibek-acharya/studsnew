import Link from "next/link";
import {
  BookOpenText,
  ChevronRight,
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
      {/* max-w-350 is the site content width; padding is mobile-only so the
          grid lines up with the rest of the desktop layout. */}
      <div className="mx-auto w-full max-w-350 px-4 sm:px-0">
        <StudyResourcesCarousel slides={slides} />

        <div className={hasSlides ? "mt-8 sm:mt-10" : "mt-3 sm:mt-6"}>
          {/* One visible h1, styled like the Find College page title. The
              eyebrow and lead paragraph stay gone — the six cards below speak
              for themselves. */}
          <h1 className="mb-6 text-3xl font-bold text-gray-900 sm:mb-7">
            Study Resources
          </h1>

          {/* One column on phones, two from `sm`, four across on desktop. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STUDY_RESOURCE_CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.icon];

              return (
                <Link
                  key={category.slug}
                  href={category.href}
                  aria-label={`${CARD_ACTION_LABEL}: ${category.label}`}
                  className="group flex h-full items-start gap-3.5 rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-brand-blue">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  {/* One content column, so the description lines up with the
                      title rather than with the icon. */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[15px] font-bold leading-tight text-gray-900 transition-colors group-hover:text-brand-blue">
                        {category.label}
                      </h3>

                      <span className="mt-px inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-blue">
                        {CARD_ACTION_LABEL}
                        <ChevronRight
                          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                          aria-hidden="true"
                        />
                      </span>
                    </div>

                    <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
                      {category.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
