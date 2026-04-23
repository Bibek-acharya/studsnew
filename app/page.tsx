import EducationPage from "@/components/education/EducationPage";
import { apiService } from "@/services/api";

export const revalidate = 300;

export default async function Home() {
  const [featuredColleges, scholarshipResponse, eventsResponse, newsResponse] = await Promise.all([
    apiService.getFeaturedColleges(4).then((res) => res.data.colleges).catch(() => []),
    apiService.getEducationScholarships({ page: 1, limit: 4 }).then((res) => res.data.scholarships).catch(() => []),
    apiService.getEducationEvents({ page: 1, limit: 3 }).then((res) => res.data.events).catch(() => []),
    apiService.getEducationNews({ page: 1, limit: 5 }).then((res) => res.data.news).catch(() => []),
  ]);

  return (
    <EducationPage
      featuredColleges={featuredColleges}
      scholarships={scholarshipResponse}
      eventSlides={eventsResponse}
      newsArticles={newsResponse}
    />
  );
}
