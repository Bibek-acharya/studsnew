import { notFound } from "next/navigation";
import { admissionService } from "@/services/admission.api";
import AdmissionLevelClient, {
  type AdmissionInitialData,
} from "./AdmissionLevelClient";
import { DEFAULT_ADMISSION_FILTERS } from "./types";

export const revalidate = 300;

// Real admission levels exposed publicly (mirrors the sitemap's admission level routes).
const ADMISSION_LEVELS = ["+2", "bachelor", "master", "a-level", "ctevt"];

export default async function AdmissionsLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  if (!ADMISSION_LEVELS.includes(level)) {
    notFound();
  }

  let initialData: AdmissionInitialData | undefined;
  try {
    const response = await admissionService.getPublishedAdmissionColleges(
      level,
      1,
      18,
      { sortBy: DEFAULT_ADMISSION_FILTERS.sortBy },
    );
    initialData = {
      colleges: response?.data?.colleges || [],
      pagination:
        response?.data?.pagination || {
          page: 1,
          pageSize: 18,
          total: 0,
          totalPages: 1,
        },
    };
  } catch {
    // Let the client fetch handle loading/error states when the initial fetch fails.
  }

  return <AdmissionLevelClient level={level} initialData={initialData} />;
}
