import type { College } from "@/services/api";
import type { CollegePagination } from "@/services/api.types";
import FindCollegeView from "./FindCollegeView";

/**
 * Server component: fetches the default "page 1 / default filters" data with
 * ISR revalidation using the exact same URLs the client CollegeGrid query
 * builds for the default filters, then renders the client view with the data
 * as a prop. Any failure falls back to the previous client-only fetching.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const COLLEGES_PER_PAGE = 18;

interface InstitutionRow {
  id: number | string;
  institution_name?: string;
  card_image_url?: string | null;
  banner_url?: string | null;
  logo_url?: string | null;
  about?: string | null;
  district?: string | null;
  website_url?: string | null;
  verified?: boolean;
  claimed?: boolean;
  college_id?: number;
  affiliation?: string;
  non_university_affiliation?: string;
  featured?: boolean;
  rating?: number;
  review_count?: number;
  type?: string;
  institution_type?: string;
}

async function fetchJson(url: string): Promise<unknown> {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return ((await res.json()) as unknown) ?? null;
  } catch {
    return null;
  }
}

async function fetchInitialColleges(): Promise<{
  data: { colleges: College[]; pagination: CollegePagination };
} | null> {
  // Mirrors CollegeGrid's queryFn for the default filters:
  // sort=popularity -> { sort: "rating", order: "DESC" }, no search/fee/etc params.
  const [collegeRes, institutionRes] = await Promise.all([
    fetchJson(
      `${API_BASE}/api/v1/colleges?page=1&pageSize=${COLLEGES_PER_PAGE}&sort=rating&order=DESC`,
    ),
    fetchJson(
      `${API_BASE}/api/v1/institutions/public?page=1&limit=${COLLEGES_PER_PAGE}`,
    ),
  ]);

  if (!collegeRes && !institutionRes) return null;

  try {
    const collegeData = (
      collegeRes as
        | { data?: { colleges?: { id: number }[]; pagination?: CollegePagination } }
        | null
    )?.data;
    const instData = (
      institutionRes as
        | { data?: { institutions?: InstitutionRow[] } }
        | null
    )?.data;

    const institutions = instData?.institutions || [];

    // Map institution results to College shape (same mapping as CollegeGrid).
    const institutionColleges: College[] = institutions.map(
      (inst: InstitutionRow): College => ({
        id: `inst_${inst.id}` as unknown as number,
        name: inst.institution_name || "",
        image_url:
          inst.card_image_url || inst.banner_url || inst.logo_url || "",
        description: inst.about || "",
        location: inst.district || "",
        website: inst.website_url || "",
        verified: inst.verified ?? false,
        claimed: inst.claimed ?? false,
        affiliation: inst.affiliation || "",
        non_university_affiliation: inst.non_university_affiliation || "",
        featured: inst.featured || false,
        rating: inst.rating || 0,
        reviews: inst.review_count || 0,
        type: inst.type || inst.institution_type || "College",
      }),
    );

    // Build set of college IDs that are claimed by institutions
    const claimedCollegeIds = new Set(
      institutions
        .filter((inst: InstitutionRow) => (inst.college_id ?? 0) > 0)
        .map((inst: InstitutionRow) => inst.college_id as number),
    );

    // Filter out colleges already represented by an institution, then merge.
    const filteredColleges = ((collegeData?.colleges || []) as College[]).filter(
      (c: College) => !claimedCollegeIds.has(c.id),
    );
    const merged = [...institutionColleges, ...filteredColleges];

    const combinedTotal = collegeData?.pagination?.total
      ? collegeData.pagination.total - claimedCollegeIds.size + institutions.length
      : merged.length;

    return {
      data: {
        colleges: merged,
        pagination: {
          page: 1,
          pageSize: COLLEGES_PER_PAGE,
          total: combinedTotal,
          totalPages: Math.ceil(
            (combinedTotal || merged.length) / COLLEGES_PER_PAGE,
          ),
        },
      },
    };
  } catch {
    return null;
  }
}

export default async function FindCollegePage() {
  const initialData = await fetchInitialColleges();
  return <FindCollegeView initialData={initialData ?? undefined} />;
}
