import { apiRequest, type University, type UniversityDetailResponse, type UniversityFilterCountsResponse } from "./api";

export const universityApi = {
  async getUniversities(params?: {
    search?: string;
    type?: string;
    popular?: boolean;
    isNepali?: string;
  }): Promise<{ data: { universities: University[] } }> {
    const query = new URLSearchParams();
    query.set("status", "published");
    if (params?.search) query.set("search", params.search);
    if (params?.type) query.set("type", params.type);
    if (params?.popular) query.set("popular", "true");
    if (params?.isNepali) query.set("isNepali", params.isNepali);
    return apiRequest<{ data: { universities: University[] } }>(
      `/api/v1/universities${query.toString() ? `?${query.toString()}` : ""}`,
    );
  },
  async getUniversityById(
    id: number,
  ): Promise<{ data: UniversityDetailResponse }> {
    return apiRequest<{ data: UniversityDetailResponse }>(
      `/api/v1/universities/${id}`,
    );
  },
  async getUniversityCourses(
    id: number,
    page: number = 1,
    limit: number = 10,
    level: string = "",
  ): Promise<{ data: { courses: any[]; total: number; page: number; limit: number } }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (level && level !== "all") {
      params.append("level", level);
    }
    return apiRequest<{ data: { courses: any[]; total: number; page: number; limit: number } }>(
      `/api/v1/universities/${id}/courses?${params.toString()}`,
    );
  },
  async getUniversityScholarships(
    id: number,
    page: number = 1,
    limit: number = 10,
    level: string = "",
  ): Promise<{ data: { scholarships: any[]; total: number; page: number; limit: number } }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (level && level !== "all") {
      params.append("level", level);
    }
    return apiRequest<{ data: { scholarships: any[]; total: number; page: number; limit: number } }>(
      `/api/v1/universities/${id}/scholarships?${params.toString()}`,
    );
  },
  async getUniversityFilterCounts(
    isNepali?: string,
  ): Promise<UniversityFilterCountsResponse> {
    const query = isNepali ? `?isNepali=${isNepali}` : "";
    return apiRequest<UniversityFilterCountsResponse>(
      `/api/v1/universities/filter-counts${query}`,
    );
  },
  async getUniversityReviews(
    universityId: number,
    params?: { page?: number; limit?: number },
    options?: any,
  ): Promise<any> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiRequest<any>(
      `/api/v1/education/reviews/university/${universityId}${qs ? `?${qs}` : ""}`,
      options,
    );
  },
  async submitUniversityReview(
    data: { university_id: number; rating: number; pros: string; cons: string },
    options?: any,
  ): Promise<any> {
    return apiRequest<any>("/api/v1/user/university-reviews", {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  },
  async updateUniversityReview(
    universityId: number,
    data: { rating?: number; pros?: string; cons?: string },
    options?: any,
  ): Promise<any> {
    return apiRequest<any>(`/api/v1/user/university-reviews/${universityId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  },
  async getMyUniversityReview(
    universityId: number,
    options?: any,
  ): Promise<any> {
    return apiRequest<any>(
      `/api/v1/user/university-reviews/${universityId}`,
      options,
    );
  },
  async getUniversityEvents(
    universityId: number,
    params?: { page?: number; limit?: number; category?: string },
  ): Promise<any> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.category) qs.set("category", params.category);
    qs.set("university_id", String(universityId));
    return apiRequest<any>(`/api/v1/education/events?${qs.toString()}`);
  },
  async getUniversityNews(
    universityId: number,
    params?: { page?: number; limit?: number; category?: string },
  ): Promise<any> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.category) qs.set("category", params.category);
    qs.set("university_id", String(universityId));
    return apiRequest<any>(`/api/v1/education/news?${qs.toString()}`);
  },
};
