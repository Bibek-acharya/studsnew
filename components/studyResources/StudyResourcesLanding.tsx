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
  type StudyResourceCategory,
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

const STATUS_LABELS: Record<StudyResourceCategory["status"], string> = {
  available: "Available now",
  "coming-soon": "Coming soon",
  planned: "In planning",
};

/** Each collection opens with a different surface; say which one. */
const RENDER_LABELS: Record<StudyResourceCategory["render"], string> = {
  resources: "Download",
  "video-lectures": "Watch",
  "mock-tests": "Take test",
};

export default function StudyResourcesLanding({
  slides,
}: StudyResourcesLandingProps) {
  const hasSlides = slides.some((slide) => slide.active === true);

  return (
    <section className="bg-[#f6f8fc] pb-16 pt-6 sm:pb-20 sm:pt-9">
      <h1 className="sr-only">Study resources for focused exam preparation</h1>
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6 lg:px-8">
        <StudyResourcesCarousel slides={slides} />

        <div className={hasSlides ? "mt-14 sm:mt-20" : "mt-3 sm:mt-6"}>
          <div className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)] lg:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-blue">
                Curated study collections
              </p>
              <h2 className="max-w-3xl text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl">
                Choose the resource that moves you forward.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-[15px] lg:justify-self-end">
              Start with a focused collection, download what you need, and
              build a revision routine around the material you trust.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {STUDY_RESOURCE_CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.visual.icon];

              return (
                <Link
                  key={category.slug}
                  href={category.href}
                  aria-label={`Explore ${category.label}`}
                  className={`group relative flex min-h-64 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-28px_rgba(15,23,42,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none ${category.visual.hoverClass}`}
                >
                  <span
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${category.visual.topBorderClass}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20 ${category.visual.glowClass}`}
                    aria-hidden="true"
                  />

                  <div className="mb-7 flex items-start justify-between gap-4">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${category.visual.accentClass}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs font-bold tracking-[0.16em] text-slate-300">
                      {category.visual.number}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-bold tracking-[-0.02em] text-slate-950">
                        {category.label}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${category.visual.statusClass}`}
                      >
                        {STATUS_LABELS[category.status]}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      {category.description}
                    </p>
                  </div>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition-colors group-hover:text-brand-blue">
                    {RENDER_LABELS[category.render]}
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
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
