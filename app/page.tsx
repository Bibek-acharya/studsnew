import EducationPage from "@/components/education/EducationPage";
import HomeClientWrapper from "@/components/education/HomeClientWrapper";
import { apiService, feedbackApi, College } from "@/services/api";
import { extractCarouselSlides } from "@/services/carousel.api";
import type { Metadata } from "next";

const HOME_TITLE = "Find Colleges, Scholarships & Courses in Nepal | Studsphere";
const HOME_DESCRIPTION =
  "Discover top colleges in Nepal, compare courses and fees, find scholarships, and get expert admission guidance — your one-stop education platform.";

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "./" },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    type: "website",
  },
};

export const revalidate = 300;

export default async function Home() {
  const [
    featuredColleges,
    scholarshipResponse,
    eventsResponse,
    newsResponse,
    examsResponse,
    carouselsResponse,
    adsResponse,
    testimonialsResponse,
  ] = await Promise.all([
    apiService
      .getPublicInstitutions({ limit: 50 })
      .then((res) => {
        const raw = res?.data?.institutions || res?.data || res || [];
        const list: any[] = Array.isArray(raw) ? raw : [];
        return list
          .filter((inst: any) => inst.featured === true)
          .slice(0, 4)
          .map((inst: any): College => ({
            id: inst.id,
            name: inst.institution_name || inst.name || "",
            card_image_url: inst.card_image_url || "",
            image_url: inst.image_url || "",
            banner_url: inst.banner_url || "",
            rating: inst.rating || 0,
            type: inst.organization_type || inst.type || "",
            location:
              [inst.province, inst.district, inst.local_body]
                .filter(Boolean)
                .join(", ") ||
              inst.location ||
              "",
            affiliation: inst.affiliation || "",
            website: inst.website_url || inst.website || "",
            description: inst.description || inst.short_desc || "",
            featured: true,
          }));
      })
      .catch(() => [] as College[]),
    apiService
      .getEducationScholarships({ page: 1, limit: 4, sort: "newest" })
      .then((res) => res.data.scholarships)
      .catch(() => []),
    apiService
      .getEducationEvents({ page: 1, limit: 3 })
      .then((res) => res.data.events)
      .catch(() => []),
    apiService
      .getEducationNews({ page: 1, limit: 4 })
      .then((res) => res.data.news)
      .catch(() => []),
    apiService
      .getEducationExams({ page: 1, limit: 4 })
      .then((res) => res.data.exams)
      .catch(() => []),
    apiService
      .getCarousels("landing", { active: true })
      .then(extractCarouselSlides)
      .catch(() => []),
    apiService
      .getActiveAds("landing")
      .then((res) => res.data.ads)
      .catch(() => []),
    feedbackApi
      .getPublicFeedbacks()
      .then((res) => res.data || [])
      .catch(() => []),
  ]);

  return (
    <HomeClientWrapper>
      <EducationPage
        featuredColleges={featuredColleges}
        scholarships={scholarshipResponse}
        eventSlides={eventsResponse}
        newsArticles={newsResponse}
        exams={examsResponse}
        heroSlides={carouselsResponse}
        ads={adsResponse}
        testimonials={testimonialsResponse}
      />
    </HomeClientWrapper>
  );
}
