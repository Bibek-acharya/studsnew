import { apiRequest, type AdsResponse, type CarouselsResponse } from "./api";
import type { CarouselSlide } from "./api.types";

export interface GetCarouselsOptions {
  active?: boolean;
  /** ISR window for server-side public carousel fetches. */
  revalidate?: number;
}

/** Normalize both public carousel envelope shapes used by the API. */
export function extractCarouselSlides(
  response: CarouselsResponse | null | undefined,
): CarouselSlide[] {
  const data = response?.data;
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.carousels)) return data.carousels;
  return [];
}

export const carouselApi = {
  async getActiveAds(page?: string): Promise<AdsResponse> {
    const query = page ? `?page=${encodeURIComponent(page)}` : "";
    return apiRequest<AdsResponse>(`/api/v1/system/ads${query}`);
  },
  async getCarousels(
    page?: string,
    options: GetCarouselsOptions = {},
  ): Promise<CarouselsResponse> {
    const params = new URLSearchParams();
    if (page) params.set("page", page);
    if (options.active !== undefined) {
      params.set("active", String(options.active));
    }
    const query = params.toString();
    const path = `/api/v1/system/carousels${query ? `?${query}` : ""}`;
    return options.revalidate !== undefined
      ? apiRequest<CarouselsResponse>(path, {
          next: { revalidate: options.revalidate },
        })
      : apiRequest<CarouselsResponse>(path);
  },
};
