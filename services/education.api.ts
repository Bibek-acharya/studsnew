import { apiRequest, type EducationEventsResponse, type EducationEventResponse, type EducationNewsResponse, type EducationExamsResponse, type EducationCourse } from "./api";
import { fetchCourses } from "./course-api";

export const educationApi = {
  async getEducationEvents(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
    featured?: string;
  }): Promise<EducationEventsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.sort) query.set("sort", params.sort);
    if (params?.featured) query.set("featured", params.featured);
    const queryStr = query.toString();
    return apiRequest<EducationEventsResponse>(
      `/api/v1/education/events${queryStr ? `?${queryStr}` : ""}`,
    );
  },
  async getEducationEventFilterCounts(): Promise<any> {
    return apiRequest<any>("/api/v1/education/events/filter-counts");
  },
  async getEducationEventById(id: number): Promise<EducationEventResponse> {
    return apiRequest<EducationEventResponse>(`/api/v1/education/events/${id}`);
  },
  async getAdminEvents(page = 1, limit = 50): Promise<any> {
    return apiRequest<any>(`/api/v1/admin/events?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });
  },
  async createEvent(data: any): Promise<any> {
    return apiRequest<any>("/api/v1/admin/events", {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
    });
  },
  async updateEvent(id: number, data: any): Promise<any> {
    return apiRequest<any>(`/api/v1/admin/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      cache: "no-store",
    });
  },
  async deleteEvent(id: number): Promise<any> {
    return apiRequest<any>(`/api/v1/admin/events/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });
  },
  async toggleEventFeatured(id: number): Promise<any> {
    return apiRequest<any>(`/api/v1/admin/events/${id}/feature`, {
      method: "PUT",
      cache: "no-store",
    });
  },
  async getEducationNews(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
    featured?: string;
  }): Promise<EducationNewsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.sort) query.set("sort", params.sort);
    if (params?.featured) query.set("featured", params.featured);
    const queryStr = query.toString();
    return apiRequest<EducationNewsResponse>(
      `/api/v1/education/news${queryStr ? `?${queryStr}` : ""}`,
    );
  },
  async getEducationNewsFilterCounts(): Promise<any> {
    return apiRequest<any>("/api/v1/education/news/filter-counts");
  },
  async getEducationCourses(params?: {
    page?: number;
    limit?: number;
    search?: string;
    level?: string;
    field?: string;
    affiliation?: string;
  }): Promise<{ data: { courses: EducationCourse[] } }> {
    const { courses } = await fetchCourses({
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
      level: params?.level,
      field: params?.field,
      affiliation: params?.affiliation,
    });
    return { data: { courses: courses as unknown as EducationCourse[] } };
  },
  async getEducationExams(params?: {
    page?: number;
    limit?: number;
  }): Promise<EducationExamsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const queryStr = query.toString();
    return apiRequest<EducationExamsResponse>(
      `/api/v1/education/exams${queryStr ? `?${queryStr}` : ""}`,
    );
  },
  async getPublicVolunteers(params?: {
    search?: string;
    type?: string;
    province?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.type) searchParams.set("type", params.type);
    if (params?.province) searchParams.set("province", params.province);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return apiRequest(`/api/v1/public/volunteers${qs ? `?${qs}` : ""}`);
  },
  async getPublicVolunteerByID(id: string | number): Promise<any> {
    return apiRequest(`/api/v1/public/volunteers/${id}`);
  },
  async submitVolunteerApplication(
    volunteerId: string | number,
    data: any,
    cvFile?: File,
  ): Promise<any> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v: string) => formData.append(key, v));
      } else {
        formData.append(key, value as string);
      }
    });
    if (cvFile) {
      formData.append("cv_file", cvFile);
    }
    return apiRequest(`/api/v1/public/volunteers/${volunteerId}/apply`, {
      method: "POST",
      body: formData,
    });
  },
  async reindexEmbeddings(force = false): Promise<{ success: boolean; message: string }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    return apiRequest<{ success: boolean; message: string }>(
      `/api/v1/admin/search/reindex?force=${force}`,
      { method: "POST", authToken: token || undefined },
    );
  },
  async getReindexProgress(): Promise<{ running: boolean; force: boolean; table: string; processed: number; total: number; error?: string }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    const res = await apiRequest<{ success: boolean; data: { running: boolean; force: boolean; table: string; processed: number; total: number; error?: string } }>(
      "/api/v1/admin/search/reindex/status",
      { authToken: token || undefined },
    );
    return res.data;
  },
};
