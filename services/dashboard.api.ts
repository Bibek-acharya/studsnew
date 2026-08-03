import { apiRequest, type DashboardStatsResponse, type RecentApplicationsResponse, type MyApplicationsResponse, type MessagesResponse, type MessageResponse, type CreateMessagePayload, type MessageContactsResponse, type CalendarEventsResponse, type CalendarEventResponse, type CreateEventPayload, type UpdateEventPayload, type InvitesResponse, type EducationEntriesResponse, type EducationEntryPayload, type EducationEntryResponse, type ProfileResponse, type UpdateProfilePayload, type SuperadminDashboardStats, type InstitutionDashboardData, type InstitutionAnalyticsData, type InstitutionProfileData } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const dashboardApi = {
  async getProfile(options: { suppressAuthExpired?: boolean } = {}): Promise<ProfileResponse> {
    return apiRequest<ProfileResponse>("/api/v1/profile", options);
  },
  async updateProfile(data: UpdateProfilePayload): Promise<ProfileResponse> {
    return apiRequest<ProfileResponse>("/api/v1/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async uploadProfilePicture(file: File): Promise<ProfileResponse> {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token") || sessionStorage.getItem("token")
      : null;
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(
      `${API_BASE_URL}/api/v1/auth/profile/picture`,
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      },
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to upload profile picture");
    }
    return response.json();
  },
  async getEducationEntries(): Promise<EducationEntriesResponse> {
    return apiRequest<EducationEntriesResponse>("/api/v1/profile/education");
  },
  async createEducationEntry(data: EducationEntryPayload): Promise<EducationEntryResponse> {
    return apiRequest<EducationEntryResponse>("/api/v1/profile/education", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateEducationEntry(id: number, data: EducationEntryPayload): Promise<EducationEntryResponse> {
    return apiRequest<EducationEntryResponse>(`/api/v1/profile/education/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteEducationEntry(id: number): Promise<void> {
    return apiRequest<void>(`/api/v1/profile/education/${id}`, { method: "DELETE" });
  },
  async getProfileDocuments(): Promise<{
    success: boolean;
    data: Array<{ id: number; file_name: string; file_size: number; type: string; mime_type: string; url: string; created_at: string }>;
  }> {
    return apiRequest("/api/v1/profile/documents");
  },
  async uploadProfileDocument(file: File, type: string): Promise<{
    success: boolean;
    data: { id: number; file_name: string; file_size: number; type: string; mime_type: string; url: string; created_at: string };
  }> {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token") || sessionStorage.getItem("token")
      : null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/profile/documents`,
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      },
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Failed to upload document");
    }
    return response.json();
  },
  async deleteProfileDocument(id: number): Promise<void> {
    return apiRequest(`/api/v1/profile/documents/${id}`, { method: "DELETE" });
  },
  async savePreferences(data: { preference_role: string; preference_flow: string; preferences: Record<string, any> }, _token?: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/preferences`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save preferences");
    const result = await response.json();
    return result.data || result;
  },
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    return apiRequest<DashboardStatsResponse>("/api/v1/dashboard/stats");
  },
  async getRecentApplications(): Promise<RecentApplicationsResponse> {
    return apiRequest<RecentApplicationsResponse>("/api/v1/dashboard/recent-applications");
  },
  async getMyApplications(params?: { page?: number; limit?: number }): Promise<MyApplicationsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiRequest<MyApplicationsResponse>(
      `/api/v1/my-applications${qs ? `?${qs}` : ""}`,
    );
  },
  async getMessages(params?: { page?: number; limit?: number }): Promise<MessagesResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiRequest<MessagesResponse>(`/api/v1/messages${qs ? `?${qs}` : ""}`);
  },
  async getMessageById(id: number): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(`/api/v1/messages/${id}`);
  },
  async createMessage(data: CreateMessagePayload): Promise<MessageResponse> {
    return apiRequest<MessageResponse>("/api/v1/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async replyToMessage(id: number, content: string): Promise<MessageResponse> {
    return apiRequest<MessageResponse>(`/api/v1/messages/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  },
  async getMessageContacts(): Promise<MessageContactsResponse> {
    return apiRequest<MessageContactsResponse>("/api/v1/messages/contacts");
  },
  async getCalendarEvents(): Promise<CalendarEventsResponse> {
    return apiRequest<CalendarEventsResponse>("/api/v1/calendar/events");
  },
  async getCalendarEventById(id: number): Promise<CalendarEventResponse> {
    return apiRequest<CalendarEventResponse>(`/api/v1/calendar/events/${id}`);
  },
  async createCalendarEvent(data: CreateEventPayload): Promise<CalendarEventResponse> {
    return apiRequest<CalendarEventResponse>("/api/v1/calendar/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateCalendarEvent(id: number, data: UpdateEventPayload): Promise<CalendarEventResponse> {
    return apiRequest<CalendarEventResponse>(`/api/v1/calendar/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteCalendarEvent(id: number): Promise<void> {
    return apiRequest<void>(`/api/v1/calendar/events/${id}`, { method: "DELETE" });
  },
  async getInvites(params?: { page?: number; limit?: number }): Promise<InvitesResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiRequest<InvitesResponse>(`/api/v1/invites${qs ? `?${qs}` : ""}`);
  },
  async acceptInvite(id: number): Promise<void> {
    return apiRequest<void>(`/api/v1/invites/${id}/accept`, { method: "PUT" });
  },
  async declineInvite(id: number): Promise<void> {
    return apiRequest<void>(`/api/v1/invites/${id}/decline`, { method: "PUT" });
  },
  async saveInvite(id: number): Promise<void> {
    return apiRequest<void>(`/api/v1/invites/${id}/save`, { method: "PUT" });
  },
  async getSuperadminDashboardStats(): Promise<{ data: SuperadminDashboardStats }> {
    return apiRequest<{ data: SuperadminDashboardStats }>("/api/v1/superadmin/dashboard/stats");
  },
  async listAllUsers(params?: { search?: string; page?: number; limit?: number; status?: string }): Promise<{ data: { users: any[]; pagination: any } }> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.status) query.set("status", params.status);
    const qs = query.toString();
    return apiRequest<{ data: { users: any[]; pagination: any } }>(
      `/api/v1/superadmin/users${qs ? `?${qs}` : ""}`,
    );
  },
  async getUserDetail(id: number): Promise<{ data: any }> {
    return apiRequest<{ data: any }>(`/api/v1/superadmin/users/${id}`);
  },
  async suspendUser(id: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `/api/v1/superadmin/users/${id}/suspend`,
      { method: "PUT" },
    );
  },
  async reinstateUser(id: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `/api/v1/superadmin/users/${id}/reinstate`,
      { method: "PUT" },
    );
  },
  async getUserEducation(id: number): Promise<{ data: any[] }> {
    return apiRequest<{ data: any[] }>(`/api/v1/superadmin/users/${id}/education`);
  },
  async getInstitutionDashboard(): Promise<{ success: boolean; data: InstitutionDashboardData; message: string }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("institutionToken") : null;
    return apiRequest("/api/v1/institution/dashboard", { authToken: token || undefined });
  },
  async getInstitutionAnalytics(): Promise<{ success: boolean; data: InstitutionAnalyticsData; message: string }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("institutionToken") : null;
    return apiRequest("/api/v1/institution/analytics", { authToken: token || undefined });
  },
  async getInstitutionAdmissions(status?: string): Promise<{ success: boolean; data: any[]; message: string }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("institutionToken") : null;
    const query = status ? `?status=${status}` : "";
    return apiRequest(`/api/v1/institution/admissions${query}`, { authToken: token || undefined });
  },
  async updateAdmissionStatus(id: number, status: string, notes?: string): Promise<{ success: boolean; data: any; message: string }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("institutionToken") : null;
    return apiRequest(`/api/v1/institution/admissions/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, notes: notes || "" }),
      authToken: token || undefined,
    });
  },
  async getInstitutionProfile(): Promise<{ success: boolean; data: InstitutionProfileData; message: string }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("institutionToken") : null;
    return apiRequest("/api/v1/institution/profile", { authToken: token || undefined });
  },
  async updateInstitutionProfile(data: Partial<InstitutionProfileData>): Promise<{ success: boolean; data: InstitutionProfileData; message: string }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("institutionToken") : null;
    return apiRequest("/api/v1/institution/profile", {
      method: "PUT",
      body: JSON.stringify(data),
      authToken: token || undefined,
    });
  },
};
