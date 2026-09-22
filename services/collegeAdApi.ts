// College-page-ads API (contract mirrors courseAdApi.ts).
// Public half: interfaces + useTrendingCollegeAds hook (react-query).
// Admin half: collegeAdAdminApi client.

"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/services/api";

export type TrendingCollegeKind = "spotlight" | "most_searched";

export interface TrendingCollegeAd {
  id: number;
  kind: TrendingCollegeKind;
  headline: string;
  priority: number;
  active: boolean;
  college: {
    id: number;
    name: string;
    image_url: string;
    rating: number;
    location: string;
    type: string;
    college_id: number;
    website: string;
    review_count: number;
  } | null;
}

export interface CollegeFeedbackItem {
  id: number;
  helpful: boolean;
  reasons: string;
  comment: string;
  created_at: string;
}

export interface CollegeFeedbackStats {
  total: number;
  helpful_count: number;
  not_helpful_count: number;
}

interface TrendingAdsResponse {
  success: boolean;
  data: {
    spotlight: TrendingCollegeAd[];
    most_searched: TrendingCollegeAd[];
  };
}

/**
 * Fetches active trending-college ads for the find-college page, split by
 * kind (server-enforced, max 10 per kind).
 */
export function useTrendingCollegeAds() {
  return useQuery({
    queryKey: ["college-ad-trending"],
    queryFn: async () => {
      const res = await apiRequest<TrendingAdsResponse>(
        "/api/v1/system/college-ads/trending",
      );
      return {
        spotlight: (Array.isArray(res?.data?.spotlight)
          ? res.data.spotlight
          : []) as TrendingCollegeAd[],
        most_searched: (Array.isArray(res?.data?.most_searched)
          ? res.data.most_searched
          : []) as TrendingCollegeAd[],
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export interface CollegeRecommendationFeedbackPayload {
  helpful: boolean;
  reasons?: string[];
  comment?: string;
}

export async function submitCollegeRecommendationFeedback(
  payload: CollegeRecommendationFeedbackPayload,
): Promise<void> {
  await apiRequest("/api/v1/system/college-ad-feedback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Admin payloads ──────────────────────────────────────────────────────────

export interface TrendingCollegeAdPayload {
  kind: TrendingCollegeKind;
  college_id: number;
  headline?: string;
  priority?: number;
  active?: boolean;
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

// ── Admin client ────────────────────────────────────────────────────────────

export const collegeAdAdminApi = {
  async listTrending(): Promise<TrendingCollegeAd[]> {
    const res = await extractData<TrendingCollegeAd[]>(
      apiRequest("/api/v1/admin/college-ads/trending", {
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
    return Array.isArray(res) ? res : [];
  },

  async createTrending(
    payload: TrendingCollegeAdPayload,
  ): Promise<TrendingCollegeAd> {
    return extractData<TrendingCollegeAd>(
      apiRequest("/api/v1/admin/college-ads/trending", {
        method: "POST",
        body: JSON.stringify(payload),
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
  },

  async updateTrending(
    id: number,
    payload: Partial<TrendingCollegeAdPayload>,
  ): Promise<TrendingCollegeAd> {
    return extractData<TrendingCollegeAd>(
      apiRequest(`/api/v1/admin/college-ads/trending/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
  },

  async removeTrending(id: number): Promise<void> {
    await apiRequest(`/api/v1/admin/college-ads/trending/${id}`, {
      method: "DELETE",
      authToken: getSuperadminToken() ?? undefined,
    });
  },

  async listFeedback(): Promise<{
    items: CollegeFeedbackItem[];
    stats: CollegeFeedbackStats;
  }> {
    const res = await extractData<{
      items: CollegeFeedbackItem[];
      stats: CollegeFeedbackStats;
    }>(
      apiRequest("/api/v1/admin/college-ad-feedback", {
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
    return {
      items: Array.isArray(res?.items) ? res.items : [],
      stats: res?.stats || { total: 0, helpful_count: 0, not_helpful_count: 0 },
    };
  },
};
