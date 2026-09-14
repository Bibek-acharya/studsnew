"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/services/api";

export interface CoursePageAd {
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
  description: string;
  accent: string;
  college_id: number | null;
  course_id: number | null;
  college_name: string;
  college_image: string;
  college_rating: number;
  college_location: string;
  course_title: string;
  course_level: string;
  course_duration: string;
  course_field: string;
  course_banner_url: string;
}

interface AdsApiResponse {
  data: {
    ads: CoursePageAd[];
  };
  message: string;
}

export function useCoursePageAds(position?: string) {
  return useQuery({
    queryKey: ["course-page-ads", position],
    queryFn: async () => {
      const params = new URLSearchParams({ page: "course-finder" });
      if (position) params.set("position", position);
      const res = await apiRequest<AdsApiResponse>(
        `/api/v1/system/ads?${params.toString()}`,
      );
      return res.data.ads;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function trackAdClick(adId: number) {
  return apiRequest(`/api/v1/system/ads/${adId}/click`, { method: "POST" });
}
