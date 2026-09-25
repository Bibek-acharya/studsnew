import type { Metadata } from "next";
import StudyResourcesLanding from "@/components/studyResources/StudyResourcesLanding";
import StudyResourcesPage from "@/components/studyResources/StudyResourcesPage";
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
      "Find practical study notes, previous-year questions, model questions, and syllabi in one place.",
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

  return (
    <>
      <StudyResourcesLanding slides={slides} />
      <StudyResourcesPage />
    </>
  );
}
