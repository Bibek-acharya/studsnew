import { apiRequest } from "./api";

export interface AdminAd {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  location: string;
  page: string;
  position: string;
  start_date: string;
  end_date: string;
  active: boolean;
  clicks: number;
  impressions: number;
  priority: number;
  college_id: number | null;
  course_id: number | null;
  description: string;
  accent: string;
  college_name: string;
  college_image: string;
  college_rating: number;
  college_location: string;
  course_title: string;
  course_level: string;
  course_duration: string;
  course_field: string;
  course_banner_url: string;
  course_est_fee: string;
  course_affiliation: string;
  created_at: string;
  updated_at: string;
}

export interface AdminAdListResponse {
  ads: AdminAd[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface AdminAdCreatePayload {
  title: string;
  image_url?: string;
  link_url?: string;
  location?: string;
  page: string;
  position?: string;
  start_date?: string;
  end_date?: string;
  active?: boolean;
  priority?: number;
  college_id?: number;
  course_id?: number;
  description?: string;
  accent?: string;
}

export type AdminAdUpdatePayload = Partial<AdminAdCreatePayload>;

function getSuperadminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("superadmin_token");
}

async function extractData<T>(promise: Promise<any>): Promise<T> {
  const res = await promise;
  if (res && typeof res === "object" && "data" in res) return res.data as T;
  return res as T;
}

export const adminAdApi = {
  async listAds(
    params: {
      page?: number;
      limit?: number;
      ad_page?: string;
      position?: string;
      active?: boolean;
    } = {},
  ): Promise<AdminAdListResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.ad_page) query.set("page", params.ad_page);
    if (params.position) query.set("position", params.position);
    if (params.active !== undefined) query.set("active", String(params.active));
    // ponytail: page param collision — backend uses "page" for both pagination
    // and ad_page filter. Caller must pass ad_page for filter and page for
    // pagination. If both are set, ad_page wins (backend treats ?page= as
    // the filter, not pagination — pagination uses ?page= number).
    const qs = query.toString();
    return extractData(
      apiRequest(`/api/v1/admin/ads${qs ? "?" + qs : ""}`, {
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
  },

  async getAdById(id: number): Promise<AdminAd> {
    return extractData(
      apiRequest(`/api/v1/admin/ads/${id}`, {
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
  },

  async createAd(data: AdminAdCreatePayload): Promise<AdminAd> {
    return extractData(
      apiRequest("/api/v1/admin/ads", {
        method: "POST",
        body: JSON.stringify(data),
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
  },

  async updateAd(id: number, data: AdminAdUpdatePayload): Promise<AdminAd> {
    return extractData(
      apiRequest(`/api/v1/admin/ads/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
  },

  async deleteAd(id: number): Promise<void> {
    await apiRequest(`/api/v1/admin/ads/${id}`, {
      method: "DELETE",
      authToken: getSuperadminToken() ?? undefined,
    });
  },

  async toggleAdActive(id: number, active: boolean): Promise<AdminAd> {
    return extractData(
      apiRequest(`/api/v1/admin/ads/${id}`, {
        method: "PUT",
        body: JSON.stringify({ active }),
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
  },

  async trackAdClick(id: number): Promise<void> {
    await apiRequest(`/api/v1/admin/ads/${id}/click`, {
      method: "POST",
      authToken: getSuperadminToken() ?? undefined,
    });
  },
};
