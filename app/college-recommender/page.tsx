import { cookies } from "next/headers";
import CollegeRecommenderToolPage from "@/components/college-recommender/CollegeRecommenderToolPage";
import type { CollegeRecommenderForm } from "@/components/college-recommender/CollegeRecommenderToolPage";

async function getCollegeProfilePrefill(): Promise<Partial<CollegeRecommenderForm> | null> {
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
    const prefill: Partial<CollegeRecommenderForm> = {};

    const entries = data.educationEntries || [];
    if (entries.length > 0) {
      const latest = entries[entries.length - 1];
      if (latest.stream) {
        const fieldMap: Record<string, string> = {
          Science: "Science",
          Management: "Management",
          Humanities: "Humanities",
          Education: "Education",
          Law: "Law",
          IT: "IT",
          Medical: "Medical",
        };
        if (fieldMap[latest.stream]) {
          prefill.preferred_field = fieldMap[latest.stream];
        }
      }
    }

    if (data.preferences?.preferences?.fields) {
      const fields = data.preferences.preferences.fields as string[];
      if (fields.length > 0 && typeof fields[0] === "string") {
        prefill.preferred_field = fields[0];
      }
    }

    return prefill;
  } catch {
    return null;
  }
}

export default async function CollegeRecommenderRoute() {
  const prefill = await getCollegeProfilePrefill();

  return <CollegeRecommenderToolPage prefill={prefill || undefined} />;
}
