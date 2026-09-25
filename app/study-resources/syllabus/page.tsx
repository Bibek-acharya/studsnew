import StudyResourceCategoryPage, {
  createStudyResourceCategoryMetadata,
} from "@/components/studyResources/StudyResourceCategoryPage";

const SLUG = "syllabus" as const;

export const metadata = createStudyResourceCategoryMetadata(SLUG);

export default function SyllabusPage() {
  return <StudyResourceCategoryPage slug={SLUG} />;
}
