import { cookies } from "next/headers";
import ScholarshipRecommenderPage from "@/components/scholarship-recommender/ScholarshipRecommenderPage";
import type { RecommenderState } from "@/components/scholarship-recommender/types";

async function getProfilePrefill(): Promise<Partial<RecommenderState> | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await fetch(`${apiUrl}/api/v1/profile/recommendation-context`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const json = await res.json();
    if (!json.success) return null;

    const data = json.data;
    const prefill: Partial<RecommenderState> = {};

    const entries = data.educationEntries || [];
    if (entries.length > 0) {
      const latest = entries[entries.length - 1];
      const levelMap: Record<string, string> = {
        SEE: "high_school",
        "+2": "high_school",
        "A Level": "high_school",
        Diploma: "diploma",
        Bachelor: "undergraduate",
        Master: "postgraduate",
        PhD: "postgraduate",
      };
      if (latest.level && levelMap[latest.level]) {
        prefill.educationLevel = levelMap[latest.level];
      }
      if (latest.grade) {
        prefill.academicScore = latest.grade;
        prefill.academicScoreType =
          latest.gradingSystem === "percentage" ? "percentage" : "gpa";
      }
    }

    if (data.preferences?.preferences?.fields) {
      const fields = data.preferences.preferences.fields as string[];
      if (fields.length > 0 && typeof fields[0] === "string") {
        prefill.fieldOfStudy = fields[0];
      }
    }

    return prefill;
  } catch {
    return null;
  }
}

export default async function Page() {
  const prefill = await getProfilePrefill();
  return <ScholarshipRecommenderPage prefill={prefill || undefined} />;
}
