import { createStudyResourceCategoryMetadata } from "@/components/studyResources/StudyResourceCategoryPage";
import MockTestListPage from "@/components/studyResources/mockTests/MockTestListPage";
import { mockTestsApi } from "@/services/mockTestsApi";

const FIRST_PAGE_SIZE = 12;

export const metadata = createStudyResourceCategoryMetadata("mock-test");

// Segment configs must stay literal values for the compiler to read them.
export const revalidate = 300;

async function getFirstPageOfTests() {
  try {
    return await mockTestsApi.listMockTests(
      { page: 1, limit: FIRST_PAGE_SIZE },
      { revalidate: 300 },
    );
  } catch {
    // A cold API must not take the page down; the client retries on mount.
    return undefined;
  }
}

export default async function MockTestRoutePage() {
  const initialPage = await getFirstPageOfTests();
  return <MockTestListPage initialPage={initialPage} />;
}
