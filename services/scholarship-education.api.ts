import { apiRequest, type ScholarshipsResponse, type ScholarshipDetailResponse } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const scholarshipEducationApi = {
  async getEducationScholarships(
    params: {
      page?: number;
      limit?: number;
      degree_level?: string;
      funding_type?: string;
      search?: string;
      category?: string;
      status?: string;
      sort?: string;
    } = {},
  ): Promise<ScholarshipsResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.degree_level) query.set("degree_level", params.degree_level);
    if (params.funding_type) query.set("funding_type", params.funding_type);
    if (params.search) query.set("search", params.search);
    if (params.category) query.set("category", params.category);
    if (params.status) query.set("status", params.status);
    if (params.sort) query.set("sort", params.sort);
    const queryStr = query.toString();
    return apiRequest<ScholarshipsResponse>(
      `/api/v1/education/scholarships${queryStr ? `?${queryStr}` : ""}`,
    );
  },
  async getEducationScholarshipById(id: string | number): Promise<any> {
    return apiRequest<ScholarshipDetailResponse>(
      `/api/v1/education/scholarships/${id}`,
      { cache: "no-store" },
    );
  },
  async getAvailableExamCenters(id: string | number): Promise<string[]> {
    const res = await apiRequest<any>(
      `/api/v1/education/scholarships/${id}/exam-centers`,
      { cache: "no-store" },
    );
    return res?.data?.exam_centers || [];
  },
  async getEducationSimilarScholarships(id: string | number): Promise<any> {
    return apiRequest<ScholarshipDetailResponse>(
      `/api/v1/education/scholarships/${id}/similar`,
      { cache: "no-store" },
    );
  },
  async applyScholarship(scholarshipId: string | number, data: any): Promise<any> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
    return apiRequest<any>(
      `/api/v1/education/scholarships/${scholarshipId}/apply`,
      { method: "POST", body: JSON.stringify(data), headers },
    );
  },
  async uploadScholarshipFile(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/scholarships/upload?folder=${encodeURIComponent(folder)}`,
      { method: "POST", body: formData, headers },
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to upload file");
    }
    const res = await response.json();
    return res.data?.url || res.url || "";
  },
  async listAllScholarships(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<any> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);
    const qs = query.toString();
    return apiRequest(`/api/v1/education/scholarships${qs ? `?${qs}` : ""}`);
  },
  async deleteScholarship(id: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/api/v1/admin/scholarships/${id}`, {
      method: "DELETE",
    });
  },
  async toggleScholarshipFeature(id: number, featured: boolean): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `/api/v1/education/scholarships/${id}`,
      { method: "PATCH", body: JSON.stringify({ isFeatured: featured }) },
    );
  },
  async updateScholarship(id: number, data: any): Promise<any> {
    return apiRequest(`/api/v1/education/scholarships/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
