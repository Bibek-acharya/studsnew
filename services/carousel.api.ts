import { apiRequest, type AdsResponse, type CarouselsResponse } from "./api";

export const carouselApi = {
  async getActiveAds(page?: string): Promise<AdsResponse> {
    const query = page ? `?page=${page}` : "";
    return apiRequest<AdsResponse>(`/api/v1/system/ads${query}`);
  },
  async getCarousels(page?: string): Promise<CarouselsResponse> {
    const query = page ? `?page=${page}` : "";
    return apiRequest<CarouselsResponse>(`/api/v1/system/carousels${query}`);
  },
};
