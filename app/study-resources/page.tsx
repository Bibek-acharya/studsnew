import type { Metadata } from "next";
import StudyResourcesLanding from "@/components/studyResources/StudyResourcesLanding";
import { carouselApi, extractCarouselSlides } from "@/services/carousel.api";
import type { CarouselSlide } from "@/services/api";

const CAROUSEL_PAGE = "study-resources";

export const metadata: Metadata = {
  title: {
    absolute: "Study Notes, Past Questions & Revision Resources | Studsphere",
  },
  description:
    "Browse study notes, past and model questions, syllabi, video lectures, and mock-test resources for focused exam preparation.",
  alternates: { canonical: "/study-resources" },
  openGraph: {
    title: "Study Resources for Better Exam Preparation",
    description:
      "Find practical study notes, previous-year questions, model questions, syllabi, video lectures and mock tests in one place.",
    url: "/study-resources",
    type: "website",
  },
};

export const revalidate = 300;

async function getActiveStudyResourceSlides(): Promise<CarouselSlide[]> {
  try {
    const response = await carouselApi.getCarousels(CAROUSEL_PAGE, {
      active: true,
      revalidate: 300,
    });

    return extractCarouselSlides(response)
      .filter((slide) => slide.active === true)
      .sort(
        (first, second) =>
          (first.order || 0) - (second.order || 0) || first.id - second.id,
      );
  } catch {
    return [];
  }
}

export default async function StudyResourcesRoutePage() {
  const slides = await getActiveStudyResourceSlides();

  // The landing is the whole page: a carousel plus the six collection cards.
  // Each card opens its own collection, so there is no second, generic
  // catalogue underneath.
  return <StudyResourcesLanding slides={slides} />;
}
