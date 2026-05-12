import { apiRequest } from "./api";

const institutionToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("institutionToken") : null;

export const institutionAdmissionApi = {
  async create(data: any, publish: boolean) {
    return apiRequest<any>("/api/v1/institution/admission-pages", {
      method: "POST",
      body: JSON.stringify({ data, status: publish ? "published" : "draft" }),
      authToken: institutionToken() || undefined,
    });
  },

  async list(status?: string, page = 1, limit = 20) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set("status", status);
    return apiRequest<any>(`/api/v1/institution/admission-pages?${params}`, {
      authToken: institutionToken() || undefined,
    });
  },

  async get(id: number) {
    return apiRequest<any>(`/api/v1/institution/admission-pages/${id}`, {
      authToken: institutionToken() || undefined,
    });
  },

  async update(id: number, data: any, publish?: boolean) {
    const body: any = { data };
    if (publish !== undefined) {
      body.status = publish ? "published" : "draft";
    }
    return apiRequest<any>(`/api/v1/institution/admission-pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      authToken: institutionToken() || undefined,
    });
  },

  async delete(id: number) {
    return apiRequest<any>(`/api/v1/institution/admission-pages/${id}`, {
      method: "DELETE",
      authToken: institutionToken() || undefined,
    });
  },

  async getPublished(page = 1, limit = 20) {
    return apiRequest<any>(`/api/v1/admissions/published?page=${page}&limit=${limit}`);
  },
};
