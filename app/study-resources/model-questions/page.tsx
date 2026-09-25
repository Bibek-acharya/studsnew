import StudyResourceCategoryPage, {
  createStudyResourceCategoryMetadata,
} from "@/components/studyResources/StudyResourceCategoryPage";

const SLUG = "model-questions" as const;

export const metadata = createStudyResourceCategoryMetadata(SLUG);

export default function ModelQuestionsPage() {
  return <StudyResourceCategoryPage slug={SLUG} />;
}
