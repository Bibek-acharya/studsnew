import AffiliatedColleges from "@/components/education/university-listing/AffiliatedColleges";
import type { College } from "@/services/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

interface UniItem {
  id: number;
  name: string;
  is_nepali: boolean;
}

async function fetchFromAPI<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success ? (json.data as T) : null;
  } catch {
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const uniPayload = await fetchFromAPI<{ universities: UniItem[] }>(
    "/api/v1/universities?pageSize=200",
  );
  const allUnis = uniPayload?.universities ?? [];

  const matched = allUnis.find((u) => toSlug(u.name) === id) ?? null;
  const isNepali = matched ? matched.is_nepali : true;

  let colleges: College[] = [];
  if (matched) {
    const collegePayload = await fetchFromAPI<{ colleges: College[] }>(
      `/api/v1/colleges?universityId=${matched.id}&pageSize=200`,
    );
    colleges = collegePayload?.colleges ?? [];
  }

  const sameTypeUnis = allUnis.filter((u) => u.is_nepali === isNepali);
  const uniOptions = sameTypeUnis.map((u) => ({
    id: toSlug(u.name),
    name: u.name,
    collegeCount: "",
  }));

  const matchIdx = uniOptions.findIndex((u) => u.id === id);
  if (matchIdx > 0) {
    const [item] = uniOptions.splice(matchIdx, 1);
    uniOptions.unshift(item);
  }

  return (
    <AffiliatedColleges
      universities={uniOptions}
      colleges={colleges}
      type={isNepali ? "nepali" : "foreign"}
    />
  );
}
