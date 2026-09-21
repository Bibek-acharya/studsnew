import { DEFAULT_ENTRANCE_FILTERS } from "@/app/entrance/types";
import { mapRawEntrance, type EntrancesResponse } from "@/services/entrance.api";
import EntranceView from "./EntranceView";

/**
 * Server-side fetch of the default "page 1 / default filters" entrances list
 * so the entrance grid is server-rendered. Uses the same POST /api/v1/entrances
 * endpoint and body shape the client EntranceGrid query builds, with ISR
 * revalidation, then returns the entranceService-style response.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchInitialEntrances(): Promise<EntrancesResponse | null> {
  try {
    // Mirrors EntranceGrid's apiFilters built from DEFAULT_ENTRANCE_FILTERS.
    const f = DEFAULT_ENTRANCE_FILTERS;
    const filters = {
      search: f.search || undefined,
      academicLevel: f.academicLevel.length > 0 ? f.academicLevel : undefined,
      stream: f.stream.length > 0 ? f.stream : undefined,
      status: f.status.length > 0 ? f.status : undefined,
      sortBy: f.sortBy || undefined,
      location: f.location || undefined,
      institutionType:
        f.institutionType.length > 0 ? f.institutionType : undefined,
      province: f.province.length > 0 ? f.province : undefined,
      district: f.district.length > 0 ? f.district : undefined,
      localLevel: f.localLevel.length > 0 ? f.localLevel : undefined,
      applicationFee:
        f.applicationFee.length > 0 ? f.applicationFee : undefined,
      scholarship: f.scholarship.length > 0 ? f.scholarship : undefined,
      gpa: f.gpa.length > 0 ? [f.gpa] : undefined,
    };

      // Bound the fetch so slow/hung upstreams during CI builds can't blow
      // Next.js's 60s per-page static-generation deadline: abort quickly and
      // let the client-side grid hydrate instead (initialData is optional).
      const res = await fetch(`${API_BASE}/api/v1/entrances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...filters, page: 1, pageSize: 18 }),
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(10_000),
      });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: { entrances?: unknown[]; total?: number; page?: number; pageSize?: number };
    } | null;
    return {
      data: {
        entrances: (json?.data?.entrances ?? []).map(mapRawEntrance),
        total: json?.data?.total ?? 0,
        page: json?.data?.page ?? 1,
        pageSize: json?.data?.pageSize ?? 18,
      },
    };
  } catch {
    return null;
  }
}

export default async function EntrancePage() {
  const initialData = await fetchInitialEntrances();
  return <EntranceView initialData={initialData ?? undefined} />;
}
