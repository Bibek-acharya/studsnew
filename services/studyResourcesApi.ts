import { apiRequest } from "./api";
import { fetchCourses } from "./course-api";
import type { GlobalCourse } from "@/types/course";

export interface StudyResource {
  id: number;
  title: string;
  description: string;
  resource_type: string;
  course: string;
  year: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  downloads: number;
  created_at: string;
}

export interface StudyResourceListEnvelope {
  page: number;
  limit: number;
  total: number;
  study_resources: StudyResource[];
  /** Aggregated year values from the backend, when provided. */
  years?: string[];
  /** Aggregated course values from the backend, when provided. */
  courses?: string[];
}

export interface StudyResourcesResponse {
  success: boolean;
  data?: StudyResourceListEnvelope;
  total?: number;
  page?: number;
  limit?: number;
}

export interface StudyResourceFilters {
  q?: string;
  type?: string;
  course?: string;
  year?: string;
  page?: number;
  limit?: number;
}

export const studyResourcesApi = {
  async listStudyResources(
    params: StudyResourceFilters = {},
  ): Promise<StudyResourcesResponse> {
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q);
    if (params.type) search.set("type", params.type);
    if (params.course) search.set("course", params.course);
    if (params.year) search.set("year", params.year);
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    const qs = search.toString();
    return apiRequest<StudyResourcesResponse>(
      `/api/v1/study-resources${qs ? `?${qs}` : ""}`,
    );
  },

  async getStudyResource(id: number | string): Promise<StudyResource> {
    const res = await apiRequest<unknown>(`/api/v1/study-resources/${id}`);
    const payload = res as { data?: StudyResource } | StudyResource;
    if (payload && typeof payload === "object" && "data" in payload) {
      return (payload as { data: StudyResource }).data;
    }
    return payload as StudyResource;
  },

  /** Distinct course names for filter/dropdowns, from one shared source. */
  async listCourseOptions(): Promise<string[]> {
    // Preferred: existing courses service.
    try {
      const result = await fetchCourses({ limit: 100 });
      const courses: GlobalCourse[] = Array.isArray(result)
        ? result
        : result.courses ?? [];
      const names = courses
        .map((c) => c.title || (c as unknown as { name?: string }).name || "")
        .map((n) => n.trim())
        .filter(Boolean);
      if (names.length > 0) return Array.from(new Set(names)).sort();
    } catch {
      // Fall through to the simple endpoint below.
    }
    const res = await apiRequest<unknown>("/api/v1/courses/simple");
    const payload = Array.isArray(res)
      ? res
      : (res as { data?: unknown }).data ?? [];
    const items = Array.isArray(payload) ? payload : [];
    const names = items
      .map(
        (item: unknown) =>
          typeof item === "string"
            ? item
            : (item as { name?: string; title?: string })?.name ||
              (item as { title?: string })?.title ||
              "",
      )
      .map((n: string) => n.trim())
      .filter(Boolean);
    return Array.from(new Set(names)).sort();
  },

  // ─── Admin (superadmin) ─────────────────────────────────────────────────────

  async createStudyResource(form: FormData): Promise<StudyResource> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("superadmin_token")
        : null;
    return apiRequest<StudyResource>("/api/v1/admin/study-resources", {
      method: "POST",
      body: form,
      authToken: token ?? undefined,
    });
  },

  async adminListStudyResources(): Promise<StudyResource[]> {
    const res = await apiRequest<{
      data?: { study_resources?: StudyResource[] } | StudyResource[];
    }>("/api/v1/admin/study-resources", {
      authToken:
        (typeof window !== "undefined"
          ? localStorage.getItem("superadmin_token")
          : null) ?? undefined,
    });
    if (Array.isArray(res)) return res;
    return (res as { data?: { study_resources?: StudyResource[] } })
      .data?.study_resources ?? [];
  },

  async updateStudyResource(
    id: number,
    data: Partial<
      Pick<StudyResource, "title" | "resource_type" | "course" | "year" | "description">
    >,
  ): Promise<StudyResource> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("superadmin_token")
        : null;
    return apiRequest<StudyResource>(`/api/v1/admin/study-resources/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      authToken: token ?? undefined,
    });
  },

  /** Replace the file of an existing resource (metadata already saved via PUT). */
  async replaceStudyResourceFile(
    id: number,
    form: FormData,
  ): Promise<StudyResource> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("superadmin_token")
        : null;
    return apiRequest<StudyResource>(
      `/api/v1/admin/study-resources/${id}/file`,
      {
        method: "POST",
        body: form,
        authToken: token ?? undefined,
      },
    );
  },

  async deleteStudyResource(id: number): Promise<void> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("superadmin_token")
        : null;
    await apiRequest(`/api/v1/admin/study-resources/${id}`, {
      method: "DELETE",
      authToken: token ?? undefined,
    });
  },
};
