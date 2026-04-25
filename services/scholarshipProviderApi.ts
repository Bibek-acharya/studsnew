import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/api/v1";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("scholarshipProviderToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

function request<T>(config: AxiosRequestConfig): Promise<T> {
  return api.request<T>(config).then((res) => res.data as T);
}

export interface ScholarshipProviderAuthResponse {
  user: any;
  token: string;
}

export interface CreateScholarshipPayload {
  title: string;
  provider: string;
  location: string;
  value: string;
  deadline: string;
  degree_level: string;
  funding_type: string;
  scholarship_type: string;
  description: string;
  image_url?: string;
  field_of_study: string[];
  status?: 'draft' | 'active';
}

export interface ProviderScholarship {
  id: number;
  provider_id: number;
  title: string;
  description: string;
  image_url: string | null;
  location: string;
  value: string;
  deadline: string;
  degree_level: string;
  funding_type: string;
  scholarship_type: string;
  field_of_study: string[];
  eligibility_criteria: any;
  required_documents: any;
  status: string;
  applications_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProviderApplication {
  id: number;
  scholarship_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: string;
  evaluation_notes: string;
  documents: any;
  personal_statement: string;
  scholarship?: ProviderScholarship;
  created_at: string;
}

export interface ProviderInterview {
  id: number;
  application_id: number;
  provider_id: number;
  scheduled_at: string;
  duration: number;
  type: string;
  location: string;
  link: string;
  status: string;
  notes: string;
  created_at: string;
}

export interface ProviderMessage {
  id: number;
  provider_id: number;
  user_id: number;
  subject: string;
  content: string;
  read: boolean;
  direction: string;
  created_at: string;
}

export interface ProviderSettings {
  id: number;
  provider_id: number;
  email_notifications: boolean;
  sms_notifications: boolean;
  auto_reject_expired: boolean;
  timezone: string;
  language: string;
}

export interface ProviderNotification {
  id: number;
  provider_id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link: string;
  created_at: string;
}

export interface NotificationsResponse {
  notifications: ProviderNotification[];
  unread_count: number;
  meta: { total: number; page: number; limit: number };
}

export interface DashboardStats {
  total_scholarships: number;
  total_applications: number;
  pending_applications: number;
  total_interviews: number;
  unread_messages: number;
}

export interface AnalyticsData {
  status_breakdown: Record<string, number>;
  total_applications: number;
  scholarship_stats: { id: number; title: string; applications: number; status: string }[];
}

export interface ProviderNews {
  id: number;
  provider_id: number;
  title: string;
  content: string;
  image_url: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProviderEvent {
  id: number;
  provider_id: number;
  name: string;
  description: string;
  image_url: string | null;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string;
  status: string;
  attendees: number;
  created_at: string;
  updated_at: string;
}

export interface ProviderBlog {
  id: number;
  provider_id: number;
  title: string;
  content: string;
  image_url: string | null;
  author: string;
  status: string;
  published_at: string | null;
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

export interface ProviderCalendarEvent {
  id: number;
  provider_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  color: string;
  is_all_day: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProviderResult {
  id: number;
  provider_id: number;
  scholarship_id: number;
  title: string;
  status: string;
  published_at: string | null;
  results: any;
  created_at: string;
  updated_at: string;
}

export interface ProviderAccess {
  id: number;
  provider_id: number;
  email: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const scholarshipProviderApi = {
  async login(data: { email: string; password: string }): Promise<ScholarshipProviderAuthResponse> {
    const res = await request<any>({
      method: "POST",
      url: "/scholarship-providers/auth/login",
      data,
    });
    return res.data;
  },

  async getDashboard(): Promise<DashboardStats> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/dashboard",
    });
    return res.data;
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/analytics",
    });
    return res.data;
  },

  async createScholarship(data: CreateScholarshipPayload): Promise<ProviderScholarship> {
    const res = await request<any>({
      method: "POST",
      url: "/scholarship-providers/scholarships",
      data,
    });
    return res.data;
  },

  async getScholarships(page = 1, limit = 10): Promise<{ scholarships: ProviderScholarship[]; meta: { total: number; page: number; limit: number } }> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/scholarships",
      params: { page, limit },
    });
    return res.data;
  },

  async getScholarshipById(id: number): Promise<ProviderScholarship> {
    const res = await request<any>({
      method: "GET",
      url: `/scholarship-providers/scholarships/${id}`,
    });
    return res.data;
  },

  async updateScholarship(id: number, data: CreateScholarshipPayload): Promise<ProviderScholarship> {
    const res = await request<any>({
      method: "PUT",
      url: `/scholarship-providers/scholarships/${id}`,
      data,
    });
    return res.data;
  },

  async deleteScholarship(id: number): Promise<void> {
    await request<any>({
      method: "DELETE",
      url: `/scholarship-providers/scholarships/${id}`,
    });
  },

  async getApplications(params?: { page?: number; limit?: number; status?: string; scholarship_id?: string }): Promise<{ applications: ProviderApplication[]; meta: { total: number; page: number; limit: number } }> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/applications",
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        status: params?.status,
        scholarship_id: params?.scholarship_id,
      },
    });
    return res.data;
  },

  async getApplicationById(id: number): Promise<ProviderApplication> {
    const res = await request<any>({
      method: "GET",
      url: `/scholarship-providers/applications/${id}`,
    });
    return res.data;
  },

  async updateApplicationStatus(id: number, status: string): Promise<ProviderApplication> {
    const res = await request<any>({
      method: "PUT",
      url: `/scholarship-providers/applications/${id}/status`,
      data: { status },
    });
    return res.data;
  },

  async evaluateApplication(id: number, data: { score: number; notes: string; passing: boolean }): Promise<ProviderApplication> {
    const res = await request<any>({
      method: "PUT",
      url: `/scholarship-providers/applications/${id}/evaluate`,
      data,
    });
    return res.data;
  },

  async getInterviews(): Promise<ProviderInterview[]> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/interviews",
    });
    return res.data;
  },

  async createInterview(data: { application_id: number; scheduled_at: string; duration?: number; type?: string; location?: string; link?: string; notes?: string }): Promise<ProviderInterview> {
    const res = await request<any>({
      method: "POST",
      url: "/scholarship-providers/interviews",
      data,
    });
    return res.data;
  },

  async updateInterview(id: number, data: { scheduled_at?: string; duration?: number; type?: string; location?: string; link?: string; status?: string; notes?: string }): Promise<ProviderInterview> {
    const res = await request<any>({
      method: "PUT",
      url: `/scholarship-providers/interviews/${id}`,
      data,
    });
    return res.data;
  },

  async getMessages(page = 1, limit = 20): Promise<{ messages: ProviderMessage[]; meta: { total: number; page: number; limit: number } }> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/messages",
      params: { page, limit },
    });
    return res.data;
  },

  async createMessage(data: { user_id: number; subject: string; content: string }): Promise<ProviderMessage> {
    const res = await request<any>({
      method: "POST",
      url: "/scholarship-providers/messages",
      data,
    });
    return res.data;
  },

  async getMessageById(id: number): Promise<ProviderMessage> {
    const res = await request<any>({
      method: "GET",
      url: `/scholarship-providers/messages/${id}`,
    });
    return res.data;
  },

  async getProfile(): Promise<{ id: number; provider_name: string; registration_number: string; email: string; role: string }> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/profile",
    });
    return res.data;
  },

  async updateProfile(data: { provider_name: string; registration_number: string }): Promise<{ id: number; provider_name: string; registration_number: string; email: string }> {
    const res = await request<any>({
      method: "PUT",
      url: "/scholarship-providers/profile",
      data,
    });
    return res.data;
  },

  async getSettings(): Promise<ProviderSettings> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/settings",
    });
    return res.data;
  },

  async updateSettings(data: { email_notifications: boolean; sms_notifications: boolean; auto_reject_expired: boolean; timezone: string; language: string }): Promise<ProviderSettings> {
    const res = await request<any>({
      method: "PUT",
      url: "/scholarship-providers/settings",
      data,
    });
    return res.data;
  },

  async getNotifications(page = 1, limit = 20): Promise<NotificationsResponse> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/notifications",
      params: { page, limit },
    });
    return res.data;
  },

  async markNotificationRead(id: number): Promise<void> {
    await request<any>({
      method: "PUT",
      url: `/scholarship-providers/notifications/${id}/read`,
    });
  },

  async markAllNotificationsRead(): Promise<void> {
    await request<any>({
      method: "PUT",
      url: "/scholarship-providers/notifications/read-all",
    });
  },

  async createNews(data: { title: string; content: string; image_url?: string; status?: string }): Promise<ProviderNews> {
    const res = await request<any>({
      method: "POST",
      url: "/scholarship-providers/news",
      data,
    });
    return res.data;
  },

  async getNews(page = 1, limit = 10): Promise<{ news: ProviderNews[]; meta: { total: number; page: number; limit: number } }> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/news",
      params: { page, limit },
    });
    return res.data;
  },

  async getNewsById(id: number): Promise<ProviderNews> {
    const res = await request<any>({
      method: "GET",
      url: `/scholarship-providers/news/${id}`,
    });
    return res.data;
  },

  async updateNews(id: number, data: { title: string; content: string; image_url?: string; status?: string }): Promise<ProviderNews> {
    const res = await request<any>({
      method: "PUT",
      url: `/scholarship-providers/news/${id}`,
      data,
    });
    return res.data;
  },

  async deleteNews(id: number): Promise<void> {
    await request<any>({
      method: "DELETE",
      url: `/scholarship-providers/news/${id}`,
    });
  },

  async createEvent(data: { name: string; description: string; image_url?: string; event_type?: string; start_date: string; end_date?: string; location?: string; status?: string }): Promise<ProviderEvent> {
    const res = await request<any>({
      method: "POST",
      url: "/scholarship-providers/events",
      data,
    });
    return res.data;
  },

  async getEvents(page = 1, limit = 10): Promise<{ events: ProviderEvent[]; meta: { total: number; page: number; limit: number } }> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/events",
      params: { page, limit },
    });
    return res.data;
  },

  async getEventById(id: number): Promise<ProviderEvent> {
    const res = await request<any>({
      method: "GET",
      url: `/scholarship-providers/events/${id}`,
    });
    return res.data;
  },

  async updateEvent(id: number, data: { name: string; description: string; image_url?: string; event_type?: string; start_date: string; end_date?: string; location?: string; status?: string }): Promise<ProviderEvent> {
    const res = await request<any>({
      method: "PUT",
      url: `/scholarship-providers/events/${id}`,
      data,
    });
    return res.data;
  },

  async deleteEvent(id: number): Promise<void> {
    await request<any>({
      method: "DELETE",
      url: `/scholarship-providers/events/${id}`,
    });
  },

  async createBlog(data: { title: string; content: string; image_url?: string; author?: string; status?: string }): Promise<ProviderBlog> {
    const res = await request<any>({
      method: "POST",
      url: "/scholarship-providers/blogs",
      data,
    });
    return res.data;
  },

  async getBlogs(page = 1, limit = 10): Promise<{ blogs: ProviderBlog[]; meta: { total: number; page: number; limit: number } }> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/blogs",
      params: { page, limit },
    });
    return res.data;
  },

  async getBlogById(id: number): Promise<ProviderBlog> {
    const res = await request<any>({
      method: "GET",
      url: `/scholarship-providers/blogs/${id}`,
    });
    return res.data;
  },

  async updateBlog(id: number, data: { title: string; content: string; image_url?: string; author?: string; status?: string }): Promise<ProviderBlog> {
    const res = await request<any>({
      method: "PUT",
      url: `/scholarship-providers/blogs/${id}`,
      data,
    });
    return res.data;
  },

  async deleteBlog(id: number): Promise<void> {
    await request<any>({
      method: "DELETE",
      url: `/scholarship-providers/blogs/${id}`,
    });
  },

  async createCalendarEvent(data: { title: string; description?: string; start_date: string; end_date?: string; color?: string; is_all_day?: boolean }): Promise<ProviderCalendarEvent> {
    const res = await request<any>({
      method: "POST",
      url: "/scholarship-providers/calendar-events",
      data,
    });
    return res.data;
  },

  async getCalendarEvents(): Promise<ProviderCalendarEvent[]> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/calendar-events",
    });
    return res.data;
  },

  async getCalendarEventById(id: number): Promise<ProviderCalendarEvent> {
    const res = await request<any>({
      method: "GET",
      url: `/scholarship-providers/calendar-events/${id}`,
    });
    return res.data;
  },

  async updateCalendarEvent(id: number, data: { title: string; description?: string; start_date: string; end_date?: string; color?: string; is_all_day?: boolean }): Promise<ProviderCalendarEvent> {
    const res = await request<any>({
      method: "PUT",
      url: `/scholarship-providers/calendar-events/${id}`,
      data,
    });
    return res.data;
  },

  async deleteCalendarEvent(id: number): Promise<void> {
    await request<any>({
      method: "DELETE",
      url: `/scholarship-providers/calendar-events/${id}`,
    });
  },

  async createResult(data: { scholarship_id: number; title: string; status?: string; results?: any }): Promise<ProviderResult> {
    const res = await request<any>({
      method: "POST",
      url: "/scholarship-providers/results",
      data,
    });
    return res.data;
  },

  async getResults(page = 1, limit = 10): Promise<{ results: ProviderResult[]; meta: { total: number; page: number; limit: number } }> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/results",
      params: { page, limit },
    });
    return res.data;
  },

  async getResultById(id: number): Promise<ProviderResult> {
    const res = await request<any>({
      method: "GET",
      url: `/scholarship-providers/results/${id}`,
    });
    return res.data;
  },

  async updateResult(id: number, data: { scholarship_id: number; title: string; status?: string; results?: any }): Promise<ProviderResult> {
    const res = await request<any>({
      method: "PUT",
      url: `/scholarship-providers/results/${id}`,
      data,
    });
    return res.data;
  },

  async deleteResult(id: number): Promise<void> {
    await request<any>({
      method: "DELETE",
      url: `/scholarship-providers/results/${id}`,
    });
  },

  async createAccess(data: { email: string; role?: string }): Promise<ProviderAccess> {
    const res = await request<any>({
      method: "POST",
      url: "/scholarship-providers/access",
      data,
    });
    return res.data;
  },

  async getAccess(page = 1, limit = 10): Promise<{ access: ProviderAccess[]; meta: { total: number; page: number; limit: number } }> {
    const res = await request<any>({
      method: "GET",
      url: "/scholarship-providers/access",
      params: { page, limit },
    });
    return res.data;
  },

  async getAccessById(id: number): Promise<ProviderAccess> {
    const res = await request<any>({
      method: "GET",
      url: `/scholarship-providers/access/${id}`,
    });
    return res.data;
  },

  async updateAccess(id: number, data: { email: string; role?: string }): Promise<ProviderAccess> {
    const res = await request<any>({
      method: "PUT",
      url: `/scholarship-providers/access/${id}`,
      data,
    });
    return res.data;
  },

  async deleteAccess(id: number): Promise<void> {
    await request<any>({
      method: "DELETE",
      url: `/scholarship-providers/access/${id}`,
    });
  },
};
