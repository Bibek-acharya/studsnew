import StudyResourceCategoryPage, {
  createStudyResourceCategoryMetadata,
} from "@/components/studyResources/StudyResourceCategoryPage";

const SLUG = "past-questions" as const;

export const metadata = createStudyResourceCategoryMetadata(SLUG);

export default function PastQuestionsPage() {
  return <StudyResourceCategoryPage slug={SLUG} />;
}
