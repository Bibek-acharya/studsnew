import { apiRequest, type PublicNotificationsResponse, type StudentNotificationsResponse } from "./api";

export const notificationApi = {
  async getPublicNotifications(): Promise<PublicNotificationsResponse> {
    return apiRequest<PublicNotificationsResponse>(
      "/api/v1/system/notifications",
    );
  },
  async getStudentNotifications(
    page = 1,
    limit = 20,
  ): Promise<StudentNotificationsResponse> {
    return apiRequest<StudentNotificationsResponse>(
      `/api/v1/notifications?page=${page}&limit=${limit}`,
    );
  },
  async markNotificationRead(id: number): Promise<void> {
    return apiRequest<void>(`/api/v1/notifications/${id}/read`, {
      method: "PUT",
    });
  },
  async markAllNotificationsRead(): Promise<void> {
    return apiRequest<void>("/api/v1/notifications/read-all", {
      method: "PUT",
    });
  },
};
