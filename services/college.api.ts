import { apiRequest, type College, type CollegesResponse, type CollegeFilterCountsResponse, type CollegeRecommendation } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const collegeApi = {
  async getColleges(params: Record<string, any>): Promise<CollegesResponse> {
    const typeIdToBackendValue: Record<string, string> = {
      ct_private: "Private",
      ct_public: "Public / Govt",
      ct_community: "Community",
      ct_constituent: "Constituent",
      ct_foreign: "Foreign Affiliated",
    };
    const normalizedParams: Record<string, string> = {};
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (key === "type" && typeof value === "string") {
        const normalizedTypes = value
          .split(",")
          .map((type) => type.trim())
          .filter(Boolean)
          .map((type) => typeIdToBackendValue[type] || type);
        if (normalizedTypes.length > 0) {
          normalizedParams[key] = normalizedTypes.join(",");
        }
        return;
      }
      normalizedParams[key] = String(value);
    });
    const query = new URLSearchParams(normalizedParams).toString();
    return apiRequest<CollegesResponse>(
      `/api/v1/colleges${query ? `?${query}` : ""}`,
    );
  },
  async getFeaturedColleges(limit = 4): Promise<CollegesResponse> {
    const query = new URLSearchParams();
    query.set("limit", String(limit));
    return apiRequest<CollegesResponse>(
      `/api/v1/colleges/featured?${query.toString()}`,
    );
  },
  async getCollegeById(id: number): Promise<{ data: College }> {
    return apiRequest<{ data: College }>(`/api/v1/colleges/${id}`);
  },
  async getCollegeFilterCounts(): Promise<CollegeFilterCountsResponse> {
    return apiRequest<CollegeFilterCountsResponse>(
      "/api/v1/colleges/filter-counts",
    );
  },
  async getPublicInstitutionFilterCounts(): Promise<CollegeFilterCountsResponse> {
    return apiRequest<CollegeFilterCountsResponse>(
      "/api/v1/institutions/public/filter-counts",
    );
  },
  async getAdminColleges(
    params?: Record<string, any>,
  ): Promise<CollegesResponse> {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      query.set(key, String(value));
    });
    return apiRequest<CollegesResponse>(
      `/api/v1/admin/colleges${query.toString() ? `?${query.toString()}` : ""}`,
    );
  },
  async getAdminCollegeById(id: number): Promise<{ data: College }> {
    return apiRequest<{ data: College }>(`/api/v1/admin/colleges/${id}`);
  },
  async createCollege(data: any): Promise<{ data: College }> {
    return apiRequest<{ data: College }>("/api/v1/admin/colleges", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateCollege(id: number, data: Partial<College>): Promise<{ data: College }> {
    return apiRequest<{ data: College }>(`/api/v1/admin/colleges/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteCollege(id: number): Promise<void> {
    await apiRequest(`/api/v1/admin/colleges/${id}`, { method: "DELETE" });
  },
  async approveCollege(id: number): Promise<{ data: College }> {
    return apiRequest<{ data: College }>(
      `/api/v1/admin/colleges/${id}/approve`,
      { method: "PUT" },
    );
  },
  async toggleCollegeFeatured(id: number): Promise<{ data: College }> {
    return apiRequest<{ data: College }>(
      `/api/v1/admin/colleges/${id}/featured`,
      { method: "PUT" },
    );
  },
  async uploadCollegeImage(file: File): Promise<string> {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(
      `${API_BASE_URL}/api/v1/admin/colleges/upload-image`,
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      },
    );
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || data?.message || "Failed to upload image");
    }
    return data?.data?.url || data?.url;
  },
  async getMapColleges(params: {
    north?: number;
    south?: number;
    east?: number;
    west?: number;
  }): Promise<any> {
    const qs = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) qs.set(k, String(v));
    });
    const s = qs.toString();
    return apiRequest<any>(`/api/v1/map/colleges${s ? `?${s}` : ""}`);
  },
  async updateCollegeLocation(
    id: number,
    latitude: number,
    longitude: number,
  ): Promise<any> {
    return apiRequest<any>(`/api/v1/admin/colleges/${id}/location`, {
      method: "PUT",
      body: JSON.stringify({ latitude, longitude }),
    });
  },
  async updateInstitutionCollegeLocation(
    latitude: number,
    longitude: number,
  ): Promise<any> {
    return apiRequest<any>("/api/v1/institution/college/location", {
      method: "PUT",
      body: JSON.stringify({ latitude, longitude }),
    });
  },
  async getCollegeRecommenderRecommendations(
    payload: object,
  ): Promise<{ data: { recommendations: CollegeRecommendation[] } }> {
    return apiRequest<{
      data: { recommendations: CollegeRecommendation[] };
    }>("/api/v1/colleges/recommend", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async getPublicInstitutions(params: Record<string, any>): Promise<any> {
    const typeIdToBackendValue: Record<string, string> = {
      ct_private: "Private",
      ct_public: "Public / Govt",
      ct_community: "Community",
      ct_constituent: "Constituent",
      ct_foreign: "Foreign Affiliated",
    };
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        const normalized =
          key === "type" && typeof value === "string"
            ? value
                .split(",")
                .map((t) => typeIdToBackendValue[t.trim()] || t.trim())
                .filter(Boolean)
                .join(",")
            : String(value);
        query.set(key, normalized);
      }
    });
    const qs = query.toString();
    return apiRequest<any>(`/api/v1/institutions/public${qs ? `?${qs}` : ""}`);
  },
  async getPublicInstitutionById(id: number): Promise<any> {
    return apiRequest<any>(`/api/v1/institutions/public/${id}`);
  },
  async getSponsoredInstitutions(universityId: number): Promise<any> {
    return apiRequest<any>(`/api/v1/institutions/public/sponsored/${universityId}`);
  },
  async getInstitutionsByUniversity(universityId: number): Promise<any> {
    return apiRequest<any>(`/api/v1/institutions/public/by-university/${universityId}`);
  },
  async toggleInstitutionSponsored(institutionId: number, isSponsored: boolean): Promise<any> {
    return apiRequest<any>(`/api/v1/admin/institutions/${institutionId}/sponsored`, {
      method: "PUT",
      body: JSON.stringify({ is_sponsored: isSponsored }),
    });
  },
  async getSuperadminInstitution(id: number): Promise<any> {
    return apiRequest<any>(`/api/v1/superadmin/institutions/${id}`);
  },
  async updateSuperadminInstitution(id: number, data: any): Promise<any> {
    return apiRequest<any>(`/api/v1/superadmin/institutions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async listPendingInstitutions(): Promise<{ data: any[]; message: string }> {
    return apiRequest<{ data: any[]; message: string }>(
      "/api/v1/superadmin/pending-institutions",
    );
  },
  async listVerifiedInstitutions(): Promise<{ data: any[]; message: string }> {
    return apiRequest<{ data: any[]; message: string }>(
      "/api/v1/superadmin/institutions",
    );
  },
  async listRejectedInstitutions(): Promise<{ data: any[]; message: string }> {
    return apiRequest<{ data: any[]; message: string }>(
      "/api/v1/superadmin/rejected-institutions",
    );
  },
  async approveInstitution(
    institutionId: number,
    action: string,
  ): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      "/api/v1/superadmin/institutions/approve",
      {
        method: "POST",
        body: JSON.stringify({ institution_id: institutionId, action }),
      },
    );
  },
  async listPendingProviders(): Promise<{ data: any[]; message: string }> {
    return apiRequest<{ data: any[]; message: string }>(
      "/api/v1/superadmin/pending-providers",
    );
  },
  async approveProvider(providerId: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      "/api/v1/superadmin/providers/approve",
      {
        method: "POST",
        body: JSON.stringify({ provider_id: providerId, action: "approved" }),
      },
    );
  },
  async rejectProvider(providerId: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      "/api/v1/superadmin/providers/approve",
      {
        method: "POST",
        body: JSON.stringify({ provider_id: providerId, action: "rejected" }),
      },
    );
  },
  async geocodeLocation(query: string): Promise<any> {
    return apiRequest<any>(`/api/v1/geocode?q=${encodeURIComponent(query)}`);
  },
};
