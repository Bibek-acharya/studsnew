import apiService from './apiService';
import { apiRequest } from './api';

async function callApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiRequest<any>(path, options);
  if (res && typeof res === 'object' && 'data' in res) return res.data as T;
  return res as T;
}

const FIELD_MAPPINGS = {
  scholarship_types_new: 'scholarship_types',
  selection_rubric_new: 'selection_rubric',
  faqs_new: 'fa_qs',
  gallery_images_new: 'gallery_images',
  exam_centers_new: 'exam_centers',
  about_paragraph_1: 'about_paragraph1',
  about_paragraph_2: 'about_paragraph2',
  scholarship_description_1: 'scholarship_description1',
  scholarship_description_2: 'scholarship_description2',
} as const;

function mapScholarshipFields(data: Partial<CreateScholarshipPayload>) {
  const mapped = { ...data } as Record<string, unknown>;

  Object.entries(FIELD_MAPPINGS).forEach(([newField, oldField]) => {
    if (newField in mapped) {
      (mapped as any)[oldField] = mapped[newField];
      delete mapped[newField];
    }
  });

  return mapped as Partial<CreateScholarshipPayload>;
}

export interface ScholarshipProviderAuthResponse {
  user: any;
  token: string;
}

export interface ScholarshipType {
  type: string;
  seats: string;
  coverage: string;
  eligibility: string;
}

export interface SelectionRubric {
  criteria: string;
  description: string;
  weight: string;
  marks: string;
  pass_mark: string;
}

export interface SelectionProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface TimelineEvent {
  title: string;
  date: string;
  description: string;
}

export interface JourneyTimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface ExamCenter {
  province: string;
  city: string;
  venue: string;
  contact: string;
  phone: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Partner {
  name: string;
  logo_url: string;
  website: string;
}

export interface Achievement {
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

export interface NewsItem {
  title: string;
  description: string;
  date: string;
  category: string;
  link?: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface VideoTutorial {
  url: string;
  title: string;
  description: string;
}

export interface ScholarshipTypeItem {
  type: string;
  seats: string;
  coverage: string;
}

export interface SelectionRubricItem {
  criteria: string;
  description: string;
  weight: string;
}

export interface SelectionProcessStepItem {
  step: number;
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface GalleryImageItem {
  title: string;
  url: string;
}

export interface PartnerOrganization {
  name: string;
  website: string;
}

export interface PartnerGroup {
  heading: string;
  partners: PartnerOrganization[];
}

export interface ExamCenterItem {
  province: string;
  center_name: string;
  contact_person: string;
  phone_number: string;
  map_coordinates: string;
}

export interface DownloadItem {
  title: string;
  description: string;
}

export interface CreateScholarshipPayload {
  title: string;
  provider: string;
  provider_email?: string;
  provider_phone?: string;
  provider_website?: string;
  provider_domain?: string;
  location: string;
  value: string;
  deadline: string;
  degree_level?: string;
  funding_type?: string;
  scholarship_type: string;
  description: string;
  short_description?: string;
  important_notes?: string;
  image_url?: string;
  banner_image?: string;
  field_of_study: string[];
  status?: 'draft' | 'published';
  total_seats?: number;
  amount_per_student?: number;
  disbursement_type?: string;
  coverage?: string;
  application_start_date?: string;
  application_end_date?: string;
  result_publication_date?: string;
  eligible_grades?: string;
  min_gpa?: string;
  streams?: string[];
  age_min?: number;
  age_max?: number;
  gender?: string;
  marital_status?: string;
  eligible_provinces?: string[];
  additional_requirements?: string[];
  selection_criteria?: string;
  interview_rounds?: number;
  interview_location?: string;
  scholarship_types?: ScholarshipType[];
  selection_rubric?: SelectionRubric[];
  eligibility_criteria?: string[];
  fully_funded_criteria?: string[];
  partially_funded_criteria?: string[];
  selection_process?: SelectionProcessStep[];
  required_documents?: string[];
  timeline?: TimelineEvent[];
  journey_timeline?: JourneyTimelineItem[];
  exam_centers?: ExamCenter[];
  faqs?: FAQ[];
  partners?: Partner[];
  achievements?: Achievement[];
  gallery_images?: string[];
  guidelines_url?: string;
  news_items?: NewsItem[];
  map_embed_url?: string;
  social_links?: SocialLinks;

  // Prototype fields
  banner_background_image_url?: string;
  about_paragraph_1?: string;
  about_paragraph_2?: string;
  video_tutorials?: VideoTutorial[];
  scholarship_section_title?: string;
  scholarship_subtitle?: string;
  scholarship_description_1?: string;
  scholarship_description_2?: string;
  scholarship_types_new?: ScholarshipTypeItem[];
  selection_rubric_new?: SelectionRubricItem[];
  eligibility_section_title?: string;
  eligibility_subtitle?: string;
  basic_eligibility_criteria?: string[];
  selection_process_steps?: SelectionProcessStepItem[];
  faqs_new?: FAQItem[];
  gallery_images_new?: GalleryImageItem[];
  partner_groups?: PartnerGroup[];
  exam_centers_new?: ExamCenterItem[];
  downloads?: DownloadItem[];
}

export interface ProviderScholarship {
  id: number;
  provider_id: number;
  title: string;
  provider: string;
  provider_email?: string;
  provider_phone?: string;
  provider_website?: string;
  provider_domain?: string;
  description: string;
  short_description?: string;
  important_notes?: string;
  image_url?: string | null;
  banner_image?: string;
  location: string;
  value: string;
  deadline: string;
  degree_level: string;
  funding_type: string;
  scholarship_type: string;
  field_of_study: string[];
  status: string;
  total_seats?: number;
  amount_per_student?: number;
  disbursement_type?: string;
  coverage?: string;
  application_start_date?: string;
  application_end_date?: string;
  result_publication_date?: string;
  eligible_grades?: string;
  min_gpa?: string;
  streams?: string[];
  age_min?: number;
  age_max?: number;
  gender?: string;
  marital_status?: string;
  eligible_provinces?: string[];
  additional_requirements?: string[];
  selection_criteria?: string;
  interview_rounds?: number;
  interview_location?: string;
  scholarship_types?: ScholarshipType[];
  selection_rubric?: SelectionRubric[];
  eligibility_criteria?: string[];
  fully_funded_criteria?: string[];
  partially_funded_criteria?: string[];
  selection_process?: SelectionProcessStep[];
  required_documents?: string[];
  timeline?: TimelineEvent[];
  journey_timeline?: JourneyTimelineItem[];
  exam_centers?: ExamCenter[];
  faqs?: FAQ[];
  partners?: Partner[];
  achievements?: Achievement[];
  gallery_images?: string[];
  guidelines_url?: string;
  news_items?: NewsItem[];
  map_embed_url?: string;
  social_links?: SocialLinks;
  applications_count: number;
  created_at: string;
  updated_at: string;

  // Prototype fields
  banner_background_image_url?: string | null;
  about_paragraph_1?: string;
  about_paragraph_2?: string;
  video_tutorials?: VideoTutorial[];
  scholarship_section_title?: string;
  scholarship_subtitle?: string;
  scholarship_description_1?: string;
  scholarship_description_2?: string;
  scholarship_types_new?: ScholarshipTypeItem[];
  selection_rubric_new?: SelectionRubricItem[];
  eligibility_section_title?: string;
  eligibility_subtitle?: string;
  basic_eligibility_criteria?: string[];
  selection_process_steps?: SelectionProcessStepItem[];
  faqs_new?: FAQItem[];
  gallery_images_new?: GalleryImageItem[];
  partner_groups?: PartnerGroup[];
  exam_centers_new?: ExamCenterItem[];
  downloads?: DownloadItem[];
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
  province?: string;
  stream?: string;
  gpa?: number;
  gender?: string;
  age?: number;
  school_type?: string;
  exam_center?: string;
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
    return apiRequest<ScholarshipProviderAuthResponse>("/api/v1/scholarship-providers/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getDashboard(): Promise<DashboardStats> {
    return callApi<DashboardStats>("/api/v1/scholarship-providers/dashboard");
  },

  async getAnalytics(): Promise<AnalyticsData> {
    return apiRequest<AnalyticsData>("/api/v1/scholarship-providers/analytics");
  },

  async createScholarship(data: CreateScholarshipPayload): Promise<ProviderScholarship> {
    const mappedData = mapScholarshipFields(data);
    return apiRequest<ProviderScholarship>('/api/v1/scholarship-providers/scholarships', {
      method: 'POST',
      body: JSON.stringify(mappedData),
    });
  },

  async getScholarships(page = 1, limit = 10): Promise<{ scholarships: ProviderScholarship[]; meta: { total: number; page: number; limit: number } }> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    return callApi<{ scholarships: ProviderScholarship[]; meta: { total: number; page: number; limit: number } }>(`/api/v1/scholarship-providers/scholarships?${params}`);
  },

  async getScholarshipById(id: number): Promise<ProviderScholarship> {
    return callApi<ProviderScholarship>(`/api/v1/scholarship-providers/scholarships/${id}`);
  },

  async updateScholarship(id: number, data: CreateScholarshipPayload): Promise<ProviderScholarship> {
    const mappedData = mapScholarshipFields(data);
    return callApi<ProviderScholarship>(`/api/v1/scholarship-providers/scholarships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mappedData),
    });
  },

  async deleteScholarship(id: number): Promise<void> {
    await apiRequest(`/api/v1/scholarship-providers/scholarships/${id}`, { method: "DELETE" });
  },

  async publishScholarship(id: number): Promise<ProviderScholarship> {
    return callApi<ProviderScholarship>(`/api/v1/scholarship-providers/scholarships/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'active' }),
    });
  },

  async getApplications(params?: { page?: number; limit?: number; status?: string; scholarship_id?: string }): Promise<{ applications: ProviderApplication[]; meta: { total: number; page: number; limit: number } }> {
    const queryParams = new URLSearchParams();
    queryParams.set('page', String(params?.page || 1));
    queryParams.set('limit', String(params?.limit || 10));
    if (params?.status) queryParams.set('status', params.status);
    if (params?.scholarship_id) queryParams.set('scholarship_id', params.scholarship_id);
    return apiRequest(`/api/v1/scholarship-providers/applications?${queryParams}`);
  },

  async getApplicationById(id: number): Promise<ProviderApplication> {
    return apiRequest<ProviderApplication>(`/api/v1/scholarship-providers/applications/${id}`);
  },

  async updateApplicationStatus(id: number, status: string): Promise<ProviderApplication> {
    return apiRequest<ProviderApplication>(`/api/v1/scholarship-providers/applications/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  async evaluateApplication(id: number, data: { score: number; notes: string; passing: boolean }): Promise<ProviderApplication> {
    return apiRequest<ProviderApplication>(`/api/v1/scholarship-providers/applications/${id}/evaluate`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async getInterviews(): Promise<ProviderInterview[]> {
    return apiRequest<ProviderInterview[]>("/api/v1/scholarship-providers/interviews");
  },

  async createInterview(data: { application_id: number; scheduled_at: string; duration?: number; type?: string; location?: string; link?: string; notes?: string }): Promise<ProviderInterview> {
    return apiRequest<ProviderInterview>("/api/v1/scholarship-providers/interviews", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateInterview(id: number, data: { scheduled_at?: string; duration?: number; type?: string; location?: string; link?: string; status?: string; notes?: string }): Promise<ProviderInterview> {
    return apiRequest<ProviderInterview>(`/api/v1/scholarship-providers/interviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async getMessages(page = 1, limit = 20): Promise<{ messages: ProviderMessage[]; meta: { total: number; page: number; limit: number } }> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    return apiRequest(`/api/v1/scholarship-providers/messages?${params}`);
  },

  async createMessage(data: { user_id: number; subject: string; content: string }): Promise<ProviderMessage> {
    return apiRequest<ProviderMessage>("/api/v1/scholarship-providers/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getMessageById(id: number): Promise<ProviderMessage> {
    return apiRequest<ProviderMessage>(`/api/v1/scholarship-providers/messages/${id}`);
  },

  async getProfile(): Promise<{ id: number; provider_name: string; registration_number: string; email: string; role: string }> {
    return callApi<{ id: number; provider_name: string; registration_number: string; email: string; role: string }>("/api/v1/scholarship-providers/profile");
  },

  async updateProfile(data: { provider_name: string; registration_number: string }): Promise<{ id: number; provider_name: string; registration_number: string; email: string }> {
    return apiRequest("/api/v1/scholarship-providers/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async getSettings(): Promise<ProviderSettings> {
    return apiRequest<ProviderSettings>("/api/v1/scholarship-providers/settings");
  },

  async updateSettings(data: { email_notifications: boolean; sms_notifications: boolean; auto_reject_expired: boolean; timezone: string; language: string }): Promise<ProviderSettings> {
    return apiRequest<ProviderSettings>("/api/v1/scholarship-providers/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async getNotifications(page = 1, limit = 20): Promise<NotificationsResponse> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    return apiRequest(`/api/v1/scholarship-providers/notifications?${params}`);
  },

  async markNotificationRead(id: number): Promise<void> {
    await apiRequest(`/api/v1/scholarship-providers/notifications/${id}/read`, { method: "PUT" });
  },

  async markAllNotificationsRead(): Promise<void> {
    await apiRequest("/api/v1/scholarship-providers/notifications/read-all", { method: "PUT" });
  },

  async createNews(data: { title: string; content: string; image_url?: string; status?: string }): Promise<ProviderNews> {
    return apiRequest<ProviderNews>("/api/v1/scholarship-providers/news", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getNews(page = 1, limit = 10): Promise<{ news: ProviderNews[]; meta: { total: number; page: number; limit: number } }> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    return apiRequest(`/api/v1/scholarship-providers/news?${params}`);
  },

  async getNewsById(id: number): Promise<ProviderNews> {
    return apiRequest<ProviderNews>(`/api/v1/scholarship-providers/news/${id}`);
  },

  async updateNews(id: number, data: { title: string; content: string; image_url?: string; status?: string }): Promise<ProviderNews> {
    return apiRequest<ProviderNews>(`/api/v1/scholarship-providers/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteNews(id: number): Promise<void> {
    await apiRequest(`/api/v1/scholarship-providers/news/${id}`, { method: "DELETE" });
  },

  async createEvent(data: { name: string; description: string; image_url?: string; event_type?: string; start_date: string; end_date?: string; location?: string; status?: string }): Promise<ProviderEvent> {
    return apiRequest<ProviderEvent>("/api/v1/scholarship-providers/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getEvents(page = 1, limit = 10): Promise<{ events: ProviderEvent[]; meta: { total: number; page: number; limit: number } }> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    return apiRequest(`/api/v1/scholarship-providers/events?${params}`);
  },

  async getEventById(id: number): Promise<ProviderEvent> {
    return apiRequest<ProviderEvent>(`/api/v1/scholarship-providers/events/${id}`);
  },

  async updateEvent(id: number, data: { name: string; description: string; image_url?: string; event_type?: string; start_date?: string; end_date?: string; location?: string; status?: string }): Promise<ProviderEvent> {
    return apiRequest<ProviderEvent>(`/api/v1/scholarship-providers/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteEvent(id: number): Promise<void> {
    await apiRequest(`/api/v1/scholarship-providers/events/${id}`, { method: "DELETE" });
  },

  async createBlog(data: { title: string; content: string; image_url?: string; author?: string; status?: string }): Promise<ProviderBlog> {
    return apiRequest<ProviderBlog>("/api/v1/scholarship-providers/blogs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getBlogs(page = 1, limit = 10): Promise<{ blogs: ProviderBlog[]; meta: { total: number; page: number; limit: number } }> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    return apiRequest(`/api/v1/scholarship-providers/blogs?${params}`);
  },

  async getBlogById(id: number): Promise<ProviderBlog> {
    return apiRequest<ProviderBlog>(`/api/v1/scholarship-providers/blogs/${id}`);
  },

  async updateBlog(id: number, data: { title: string; content: string; image_url?: string; author?: string; status?: string }): Promise<ProviderBlog> {
    return apiRequest<ProviderBlog>(`/api/v1/scholarship-providers/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteBlog(id: number): Promise<void> {
    await apiRequest(`/api/v1/scholarship-providers/blogs/${id}`, { method: "DELETE" });
  },

  async createResult(data: { scholarship_id: number; title: string; status?: string; results?: any }): Promise<ProviderResult> {
    return apiRequest<ProviderResult>("/api/v1/scholarship-providers/results", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getResults(page = 1, limit = 10): Promise<{ results: ProviderResult[]; meta: { total: number; page: number; limit: number } }> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    return apiRequest(`/api/v1/scholarship-providers/results?${params}`);
  },

  async getResultById(id: number): Promise<ProviderResult> {
    return apiRequest<ProviderResult>(`/api/v1/scholarship-providers/results/${id}`);
  },

  async updateResult(id: number, data: { scholarship_id: number; title: string; status?: string; results?: any }): Promise<ProviderResult> {
    return apiRequest<ProviderResult>(`/api/v1/scholarship-providers/results/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteResult(id: number): Promise<void> {
    await apiRequest(`/api/v1/scholarship-providers/results/${id}`, { method: "DELETE" });
  },

  async createAccess(data: { email: string; role?: string }): Promise<ProviderAccess> {
    return apiRequest<ProviderAccess>("/api/v1/scholarship-providers/access", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getAccess(page = 1, limit = 10): Promise<{ access: ProviderAccess[]; meta: { total: number; page: number; limit: number } }> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    return apiRequest(`/api/v1/scholarship-providers/access?${params}`);
  },

  async getAccessById(id: number): Promise<ProviderAccess> {
    return apiRequest<ProviderAccess>(`/api/v1/scholarship-providers/access/${id}`);
  },

  async updateAccess(id: number, data: { email: string; role?: string }): Promise<ProviderAccess> {
    return apiRequest<ProviderAccess>(`/api/v1/scholarship-providers/access/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteAccess(id: number): Promise<void> {
    await apiRequest(`/api/v1/scholarship-providers/access/${id}`, { method: "DELETE" });
  },

  async sendOTP(email: string, type: "verification" | "password_reset"): Promise<void> {
    await apiRequest("/api/v1/scholarship-providers/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email, type }),
    });
  },

  async resetPassword(email: string, otp: string, password: string): Promise<void> {
    await apiRequest("/api/v1/scholarship-providers/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, password }),
    });
  },
};

export const getCalendarEvents = async (): Promise<ProviderCalendarEvent[]> => {
  const res = await apiRequest<{ data: ProviderCalendarEvent[] }>(`/api/v1/scholarship-providers/calendar-events`);
  return res.data;
};

export const createCalendarEvent = async (data: Partial<ProviderCalendarEvent>): Promise<ProviderCalendarEvent> => {
  const res = await apiRequest<{ data: ProviderCalendarEvent }>(`/api/v1/scholarship-providers/calendar-events`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
};

export const updateCalendarEvent = async (id: number, data: any) => {
  return apiRequest(`/api/v1/scholarship-providers/calendar-events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteCalendarEvent = async (id: number) => {
  return apiRequest(`/api/v1/scholarship-providers/calendar-events/${id}`, { method: 'DELETE' });
};
