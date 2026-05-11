import EducationPage from "@/components/education/EducationPage";
import HomeClientWrapper from "@/components/education/HomeClientWrapper";
import { apiService } from "@/services/api";

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
  ] = await Promise.all([
    apiService.getFeaturedColleges(4).then((res) => res.data.colleges).catch(() => []),
    apiService.getEducationScholarships({ page: 1, limit: 4, sort: "newest" }).then((res) => res.data.scholarships).catch(() => []),
    apiService.getEducationEvents({ page: 1, limit: 3 }).then((res) => res.data.events).catch(() => []),
    apiService.getEducationNews({ page: 1, limit: 5 }).then((res) => res.data.news).catch(() => []),
    apiService.getEducationExams({ page: 1, limit: 4 }).then((res) => res.data.exams).catch(() => []),
    apiService.getCarousels("landing").then((res) => res.data.carousels).catch(() => []),
    apiService.getActiveAds("landing").then((res) => res.data.ads).catch(() => []),
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
      />
    </HomeClientWrapper>
  );
}