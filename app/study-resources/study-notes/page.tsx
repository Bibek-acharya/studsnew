import StudyResourceCategoryPage, {
  createStudyResourceCategoryMetadata,
} from "@/components/studyResources/StudyResourceCategoryPage";

const SLUG = "study-notes" as const;

export const metadata = createStudyResourceCategoryMetadata(SLUG);

export default function StudyNotesPage() {
  return <StudyResourceCategoryPage slug={SLUG} />;
}
