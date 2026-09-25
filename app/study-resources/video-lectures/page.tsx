import StudyResourceCategoryPage, {
  createStudyResourceCategoryMetadata,
} from "@/components/studyResources/StudyResourceCategoryPage";
import VideoLecturesPage from "@/components/studyResources/VideoLecturesPage";
import { studyResourcesApi } from "@/services/studyResourcesApi";

const FIRST_PAGE_SIZE = 12;

export const metadata = createStudyResourceCategoryMetadata("video-lectures");

// Segment configs must stay literal values for the compiler to read them.
export const revalidate = 300;

async function getFirstPageOfLectures() {
  try {
    return await studyResourcesApi.listVideoLectures(
      { page: 1, limit: FIRST_PAGE_SIZE },
      { revalidate: 300 },
    );
  } catch {
    // A cold API must not take the page down; the client retries on mount.
    return undefined;
  }
}

export default async function VideoLecturesRoutePage() {
  const initialPage = await getFirstPageOfLectures();

  // Zero lectures: render the catalog shell (filters + empty state) directly so
  // the collection is still indexable.
  if (!initialPage || initialPage.items.length === 0) {
    return <StudyResourceCategoryPage slug="video-lectures" />;
  }

  return <VideoLecturesPage initialPage={initialPage} />;
}
