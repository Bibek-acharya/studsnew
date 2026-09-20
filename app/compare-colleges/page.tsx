import { apiService, getImageUrl } from "@/services/api";
import type { College } from "@/services/api";
import CompareCollegesView from "./CompareCollegesView";
import type { PopularComparison } from "./popularTypes";

export const revalidate = 300;

interface InstituteResult {
  college_id?: number;
  institution_name?: string;
  logo_url?: string;
  card_image_url?: string;
}

// Mirrors the resolution logic the client used on mount so the rendered
// popular comparisons are identical. Selection/typeahead stays client-side.
async function resolveCollege(
  id: number,
  name: string,
): Promise<Partial<College> | undefined> {
  let college: Partial<College> | undefined;

  try {
    const response = await apiService.getCollegeById(id);
    college = response?.data;
  } catch {
    // Historical comparison records can contain an institution ID.
  }

  try {
    const response = await apiService.getColleges({ search: name, pageSize: 10, page: 1 });
    const colleges = (response as { data?: { colleges?: College[] } })?.data?.colleges || [];
    const match =
      colleges.find((item) => item.name?.toLowerCase() === name.toLowerCase()) ||
      colleges[0];
    if (match) college = { ...match, image_url: match.image_url || college?.image_url || "" };
  } catch {
    // Continue with institution lookup for the logo only.
  }

  try {
    const response = await apiService.getPublicInstitutions({ search: name, limit: 10 });
    const institutions =
      (response as { data?: { institutions?: InstituteResult[] } })?.data?.institutions || [];
    const institution =
      institutions.find((item) => item.college_id === college?.id) || institutions[0];
    if (institution) {
      college = {
        ...(college || {}),
        id: college?.id || institution.college_id || 0,
        name: college?.name || institution.institution_name || name,
        image_url:
          institution.logo_url || institution.card_image_url || college?.image_url || "",
      } as College;
    }
  } catch {
    // Keep the college search result when institution lookup is unavailable.
  }

  return college;
}

async function loadPopularComparisons(): Promise<PopularComparison[]> {
  const res = await apiService.getPopularComparisons(6);
  if (!res?.data) return [];

  const pairs = await Promise.all(
    (res.data || []).map(async (pair): Promise<PopularComparison> => {
      const [college1, college2] = await Promise.all([
        resolveCollege(pair.college1_id, pair.college1_name),
        resolveCollege(pair.college2_id, pair.college2_name),
      ]);
      return {
        ...pair,
        college1_id: college1?.id || pair.college1_id,
        college2_id: college2?.id || pair.college2_id,
        college1_logo_url:
          college1?.image_url || pair.college1_logo_url
            ? getImageUrl(college1?.image_url || pair.college1_logo_url)
            : "",
        college2_logo_url:
          college2?.image_url || pair.college2_logo_url
            ? getImageUrl(college2?.image_url || pair.college2_logo_url)
            : "",
      };
    }),
  );

  return pairs.filter(
    (pair) =>
      pair.college1_id > 0 &&
      pair.college2_id > 0 &&
      pair.college1_id !== pair.college2_id,
  );
}

export default async function CompareCollegesRoute() {
  const initialPopular = await loadPopularComparisons().catch(() => undefined);

  return <CompareCollegesView initialPopular={initialPopular} />;
}
