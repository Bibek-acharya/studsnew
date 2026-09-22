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
  /** Star rating 1-5; 0 means not provided. */
  rating?: number;
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

// ── Ad-card visibility settings (public GET + superadmin PUT) ──────────────

export interface CollegeAdCardSettings {
  trending: boolean;
  by_type: boolean;
  rating: boolean;
}

interface CollegeAdCardSettingsResponse {
  success: boolean;
  data: CollegeAdCardSettings;
}

const DEFAULT_COLLEGE_AD_CARD_SETTINGS: CollegeAdCardSettings = {
  trending: true,
  by_type: true,
  rating: true,
};

function normalizeAdCardSettings(
  raw: Partial<CollegeAdCardSettings> | null | undefined,
): CollegeAdCardSettings {
  return {
    trending:
      typeof raw?.trending === "boolean"
        ? raw.trending
        : DEFAULT_COLLEGE_AD_CARD_SETTINGS.trending,
    by_type:
      typeof raw?.by_type === "boolean"
        ? raw.by_type
        : DEFAULT_COLLEGE_AD_CARD_SETTINGS.by_type,
    rating:
      typeof raw?.rating === "boolean"
        ? raw.rating
        : DEFAULT_COLLEGE_AD_CARD_SETTINGS.rating,
  };
}

/**
 * Fetches which find-college ad cards are currently enabled.
 * Missing/failure falls back to all cards enabled.
 */
export function useCollegeAdCardSettings() {
  return useQuery({
    queryKey: ["college-ad-card-settings"],
    queryFn: async () => {
      try {
        const res = await apiRequest<CollegeAdCardSettingsResponse>(
          "/api/v1/system/college-ad-card-settings",
        );
        const body =
          res && typeof res === "object" && "data" in res ? res.data : res;
        return normalizeAdCardSettings(
          body as Partial<CollegeAdCardSettings> | null | undefined,
        );
      } catch {
        return { ...DEFAULT_COLLEGE_AD_CARD_SETTINGS };
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

/**
 * Persists a partial settings patch (superadmin only).
 * Response data is the full settings shape.
 */
export async function updateCollegeAdCardSettings(
  patch: Partial<CollegeAdCardSettings>,
): Promise<CollegeAdCardSettings> {
  const res = await extractData<Partial<CollegeAdCardSettings> | null>(
    apiRequest("/api/v1/admin/college-ad-card-settings", {
      method: "PUT",
      body: JSON.stringify(patch),
      authToken: getSuperadminToken() ?? undefined,
    }),
  );
  return normalizeAdCardSettings(res);
}

// ── College type counts (public) ────────────────────────────────────────────

export interface CollegeTypeCount {
  type: string;
  count: number;
}

interface CollegeTypeCountsResponse {
  success: boolean;
  data: CollegeTypeCount[];
}

export async function getCollegeTypeCounts(): Promise<CollegeTypeCount[]> {
  try {
    const res = await apiRequest<CollegeTypeCountsResponse>(
      "/api/v1/system/college-type-counts",
    );
    const body =
      res && typeof res === "object" && "data" in res ? res.data : res;
    return Array.isArray(body) ? (body as CollegeTypeCount[]) : [];
  } catch {
    return [];
  }
}

/**
 * Fetches raw college_type values with their counts for the ByTypeAd card.
 * Errors resolve to an empty list (card hides).
 */
export function useCollegeTypeCounts() {
  return useQuery({
    queryKey: ["college-type-counts"],
    queryFn: getCollegeTypeCounts,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export interface CollegeRecommendationFeedbackPayload {
  helpful: boolean;
  reasons?: string[];
  comment?: string;
  /** Star rating 1-5 (optional). */
  rating?: number;
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
