import { apiRequest } from "./api";

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
