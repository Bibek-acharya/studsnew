import { apiRequest, type PublicNotificationsResponse } from "./api";

// Guest/public banner list (GET /system/notifications) stays a separate
// concern — NOT merged into user inboxes. The legacy per-role inbox methods
// are deleted: all user inboxes go through services/notificationClient.ts.
export const notificationApi = {
  async getPublicNotifications(): Promise<PublicNotificationsResponse> {
    return apiRequest<PublicNotificationsResponse>(
      "/api/v1/system/notifications",
    );
  },
};
