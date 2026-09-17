// Course-ads API (contract: docs/course-ads-refactor-plan.md).
// Public half: interfaces + useCourseAdCards hook (react-query).
// Admin half: courseAdAdminApi client + uploadCourseAdFile helper.

"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/services/api";

export type CourseAdPosition = "multi_college" | "single_college";

export interface CourseAdCourse {
  id: number;
  title: string;
  level: string;
  duration: string;
  field_of_study: string;
  affiliation: string;
  est_fee: string;
  banner_url: string;
  location: string;
  description: string;
}

export interface CourseAdInstitution {
  id: number;
  name: string;
  image_url: string;
  rating: number;
  location: string;
  website: string;
  slug: string;
}

export interface CourseAdMou {
  id: number;
  name: string;
  logo_url: string;
  company_url: string;
}

export interface CourseAdCard {
  id: number;
  position: CourseAdPosition;
  course: CourseAdCourse;
  subtitle: string;
  institutions: CourseAdInstitution[];
  mou_companies: CourseAdMou[];
  active: boolean;
  priority: number;
}

interface CourseAdCardsResponse {
  success: boolean;
  data: CourseAdCard[];
}

/**
 * Fetches active course-ad cards for the course-finder page, ordered by
 * priority desc / id desc (server-enforced, max 10).
 */
export function useCourseAdCards(position: CourseAdPosition) {
  return useQuery({
    queryKey: ["course-ad-cards", position],
    queryFn: async () => {
      const res = await apiRequest<CourseAdCardsResponse>(
        `/api/v1/system/course-ads?position=${position}`,
      );
      return (Array.isArray(res?.data) ? res.data : []) as CourseAdCard[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ── Admin payloads ──────────────────────────────────────────────────────────

export interface CourseAdMouPayload {
  name: string;
  company_url?: string;
  logo_url?: string;
}

export interface CourseAdCardPayload {
  position: CourseAdPosition;
  course_id: number;
  /** single_college only */
  institution_id?: number;
  subtitle?: string;
  /** multi_college only (up to 7) */
  institution_ids?: number[];
  mou_companies?: CourseAdMouPayload[];
  active?: boolean;
  priority?: number;
}

function getSuperadminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("superadmin_token");
}

async function extractData<T>(promise: Promise<any>): Promise<T> {
  const res = await promise;
  if (res && typeof res === "object" && "data" in res) return res.data as T;
  return res as T;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Upload a file via the existing superadmin multipart endpoint and return the
 * raw `/uploads/...` path (same mechanism as AddCollegeSection.uploadFile).
 * Callers pass the returned path as `logo_url` in the course-ad payload.
 */
export async function uploadCourseAdFile(
  file: File,
  folder: string,
): Promise<string> {
  const token = getSuperadminToken();
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(
    `${API_BASE}/api/v1/superadmin/upload?folder=${encodeURIComponent(folder)}`,
    {
      method: "POST",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    },
  );
  if (!res.ok) throw new Error(`Upload error: ${res.status}`);
  const data = await res.json();
  const path: string = data?.data?.url || data?.url || "";
  if (!path) throw new Error("Upload returned no URL");
  return path;
}

// ── Admin client ────────────────────────────────────────────────────────────

export const courseAdAdminApi = {
  async list(position: CourseAdPosition): Promise<CourseAdCard[]> {
    const res = await extractData<CourseAdCard[]>(
      apiRequest(`/api/v1/admin/course-ads?position=${position}`, {
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
    return Array.isArray(res) ? res : [];
  },

  async create(payload: CourseAdCardPayload): Promise<CourseAdCard> {
    return extractData<CourseAdCard>(
      apiRequest("/api/v1/admin/course-ads", {
        method: "POST",
        body: JSON.stringify(payload),
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
  },

  async update(
    id: number,
    payload: Partial<CourseAdCardPayload>,
  ): Promise<CourseAdCard> {
    return extractData<CourseAdCard>(
      apiRequest(`/api/v1/admin/course-ads/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
  },

  async remove(id: number): Promise<void> {
    await apiRequest(`/api/v1/admin/course-ads/${id}`, {
      method: "DELETE",
      authToken: getSuperadminToken() ?? undefined,
    });
  },
};
