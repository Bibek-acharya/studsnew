import { GlobalCourse, ResolvedCourse } from '@/types/course';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("superadmin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiCall<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(getAuthHeaders() as Record<string, string>),
    ...((options.headers as Record<string, string>) || {}),
  };
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Unexpected response: ${text.substring(0, 100)}`);
  }
  if (!res.ok)
    throw new Error(
      data?.message || data?.error || `Request failed (${res.status})`,
    );
  return data?.data ?? data;
}

export async function fetchGlobalCourses(page = 1, limit = 20): Promise<{ courses: GlobalCourse[]; meta: { total: number } }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
  return apiCall(`/api/v1/education/courses?${params}`);
}

export async function searchGlobalCourses(query: string): Promise<GlobalCourse[]> {
  return apiCall(`/api/v1/education/courses/search?q=${encodeURIComponent(query)}`);
}

export async function fetchCoursesByLevel(level: string, page = 1, limit = 20): Promise<{ courses: GlobalCourse[]; meta: { total: number } }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
  return apiCall(`/api/v1/education/courses/by-level/${encodeURIComponent(level)}?${params}`);
}

export async function fetchCoursesByAffiliation(affiliationId: number, page = 1, limit = 20): Promise<{ courses: GlobalCourse[]; meta: { total: number } }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
  return apiCall(`/api/v1/education/courses/by-affiliation/${affiliationId}?${params}`);
}

export async function fetchSecondaryCourses(page = 1, limit = 20): Promise<{ courses: GlobalCourse[]; meta: { total: number } }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
  return apiCall(`/api/v1/education/courses/secondary?${params}`);
}

export async function fetchResolvedCourse(globalCourseId: number, institutionId: number): Promise<ResolvedCourse> {
  return apiCall(`/api/v1/education/courses/${globalCourseId}/resolved?institutionId=${institutionId}`);
}
