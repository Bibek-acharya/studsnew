import { apiRequest } from "./api";

export interface ProfileContextResponse {
  educationEntries: Array<{
    level: string;
    stream: string;
    grade: string;
    gradingSystem: string;
    institutionName: string;
  }>;
  preferences?: {
    role: string;
    preferences?: Record<string, unknown>;
  };
  bookmarkedFields: string[];
}

export const profileApi = {
  async getRecommendationContext(): Promise<{
    success: boolean;
    data: ProfileContextResponse;
  }> {
    return apiRequest("/api/v1/profile/recommendation-context", {
      method: "GET",
    });
  },
};
