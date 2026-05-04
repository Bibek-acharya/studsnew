import apiService from './apiService';
import { apiRequest } from './api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function callApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiRequest<any>(path, options);
  if (res && typeof res === 'object' && 'data' in res) return res.data as T;
  return res as T;
}

const FIELD_MAPPINGS = {} as Record<string, string>;

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

async function extractUploadedUrl<T extends { data?: { url?: string }; url?: string }>(promise: Promise<T>): Promise<string> {
  const response = await promise;
  const rawUrl = response?.data?.url || response?.url || "";
  if (!rawUrl) return "";
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }
  return `${API_BASE_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
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
  url: string;
}

export interface BankDetails {
  bank_name: string;
  account_name: string;
  account_number: string;
  branch: string;
}

export interface PaymentConfig {
  enabled: boolean;
  fee_amount?: number;
  methods: string[];
  bank_details?: BankDetails;
  qr_code?: string;
}

export interface CreateScholarshipPayload {
  title: string;
  provider?: string;
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
  gallery_images?: GalleryImageItem[];
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

  // New fields from prototype
  provider_name?: string;
  funding_type_other?: string;
  scholarship_type_other?: string;
  education_level?: string;
  education_level_other?: string;
  apply_link?: string;
  coverage_area?: string;
  contact_email?: string;
  primary_phone?: string;
  secondary_phone?: string;
  website_url?: string;
  office_address?: string;
  map_url?: string;
  payment_config?: PaymentConfig;
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
  gallery_images?: GalleryImageItem[];
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
  payment_config?: PaymentConfig;
}

export interface ProviderPayment {
  id: number;
  method: string;
  amount: number;
  status: string;
  receipt_url?: string;
  transaction_id?: string;
  paid_at?: string;
}

export interface ProviderProfile {
  id: number;
  provider_name: string;
  registration_number: string;
  email: string;
  contact_number?: string;
  pan_number?: string;
  website_url?: string;
  role: string;
  is_sub_user?: boolean;
  permissions?: string[];
}

export interface ProviderApplication {
  id: number;
  scholarship_id: number;
  user_id: number;
  full_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: string;
  evaluation_score?: number;
  evaluation_passed?: boolean;
  evaluation_notes: string;
  documents: any;
  personal_statement: string;
  scholarship?: ProviderScholarship;
  created_at: string;
  updated_at?: string;
  province?: string;
  district?: string;
  stream?: string;
  gpa?: number;
  gender?: string;
  age?: number;
  ethnicity?: string;
  ethnicity_other?: string;
  date_of_birth_bs?: string;
  date_of_birth_ad?: string;
  photo_url?: string;
  see_gpa?: string;
  school_name?: string;
  school_province?: string;
  school_district?: string;
  school_municipality?: string;
  school_tole?: string;
  permanent_province?: string;
  permanent_district?: string;
  permanent_municipality?: string;
  permanent_ward?: string;
  permanent_tole?: string;
  temporary_province?: string;
  temporary_district?: string;
  temporary_municipality?: string;
  temporary_ward?: string;
  temporary_tole?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  father_occupation?: string;
  father_occupation_other?: string;
  mother_occupation?: string;
  mother_occupation_other?: string;
  family_monthly_income?: number;
  family_members_count?: number;
  school_type?: string;
  exam_center?: string;
  payment?: ProviderPayment;
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

export interface MetricCount {
  label: string;
  count: number;
}

export interface DetailedAnalyticsData {
  total_applicants: number;
  gender: MetricCount[];
  ethnicity: MetricCount[];
  gpa_breakdown: MetricCount[];
  school_type: MetricCount[];
  stream: MetricCount[];
  province: MetricCount[];
  district: MetricCount[];
  status: MetricCount[];
}

export interface DetailedAnalyticsFilters {
  province?: string;
  district?: string;
  school_type?: string;
  scholarship_status?: string;
}

export interface ProviderNews {
  id: number;
  provider_id: number;
  title: string;
  short_desc: string;
  content: string;
  image_url: string | null;
  news_type: string;
  published_by: string;
  publish_date: string | null;
  tags: string[];
  allow_comments: boolean;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProviderEvent {
  id: number;
  provider_id: number;
  name: string;
  short_desc: string;
  description: string;
  image_url: string | null;
  event_type: string;
  category: string;
  max_participants: number;
  online_link: string;
  organized_by: string;
  contact_person: string;
  contact_email: string;
  start_date: string;
  end_date: string;
  location: string;
  tags: string[];
  enable_registration: boolean;
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
    return callApi<AnalyticsData>("/api/v1/scholarship-providers/analytics");
  },

  async getDetailedAnalytics(filters: DetailedAnalyticsFilters = {}): Promise<DetailedAnalyticsData> {
    const params = new URLSearchParams();
    if (filters.province) params.append('province', filters.province);
    if (filters.district) params.append('district', filters.district);
    if (filters.school_type) params.append('school_type', filters.school_type);
    if (filters.scholarship_status) params.append('scholarship_status', filters.scholarship_status);
    
    return callApi<DetailedAnalyticsData>(`/api/v1/scholarship-providers/analytics/detailed?${params.toString()}`);
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
      body: JSON.stringify({ status: 'published' }),
    });
  },

  async getApplications(params?: { page?: number; limit?: number; status?: string; scholarship_id?: string }): Promise<{ applications: ProviderApplication[]; meta: { total: number; page: number; limit: number } }> {
    const queryParams = new URLSearchParams();
    queryParams.set('page', String(params?.page || 1));
    queryParams.set('limit', String(params?.limit || 10));
    if (params?.status) queryParams.set('status', params.status);
    if (params?.scholarship_id) queryParams.set('scholarship_id', params.scholarship_id);
    return callApi(`/api/v1/scholarship-providers/applications?${queryParams}`);
  },

  async getApplicationById(id: number): Promise<ProviderApplication> {
    return callApi<ProviderApplication>(`/api/v1/scholarship-providers/applications/${id}`);
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

  async getProfile(): Promise<ProviderProfile> {
    return callApi<ProviderProfile>("/api/v1/scholarship-providers/profile");
  },

  async updateProfile(data: { provider_name: string; registration_number: string; contact_number?: string; pan_number?: string; website_url?: string }): Promise<ProviderProfile> {
    return apiRequest<ProviderProfile>("/api/v1/scholarship-providers/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async getSettings(): Promise<ProviderSettings> {
    return apiRequest<ProviderSettings>("/api/v1/scholarship-providers/settings");
  },

  async uploadImage(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    return extractUploadedUrl(
      apiRequest<{ data?: { url?: string }; url?: string }>(
        `/api/v1/scholarship-providers/uploads?folder=${encodeURIComponent(folder)}`,
        {
          method: "POST",
          body: formData,
        },
      ),
    );
  },

  async uploadDocument(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    return extractUploadedUrl(
      apiRequest<{ data?: { url?: string }; url?: string }>(
        `/api/v1/scholarship-providers/uploads/document?folder=${encodeURIComponent(folder)}`,
        {
          method: "POST",
          body: formData,
        },
      ),
    );
  },

  async updateSettings(data: { email_notifications: boolean; sms_notifications: boolean; auto_reject_expired: boolean; timezone: string; language: string }): Promise<ProviderSettings> {
    return apiRequest<ProviderSettings>("/api/v1/scholarship-providers/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async getNotifications(page = 1, limit = 20): Promise<NotificationsResponse> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    return callApi(`/api/v1/scholarship-providers/notifications?${params}`);
  },

  async markNotificationRead(id: number): Promise<void> {
    await apiRequest(`/api/v1/scholarship-providers/notifications/${id}/read`, { method: "PUT" });
  },

  async markAllNotificationsRead(): Promise<void> {
    await apiRequest("/api/v1/scholarship-providers/notifications/read-all", { method: "PUT" });
  },

  async exportApplications(): Promise<void> {
    const token = localStorage.getItem("scholarshipProviderToken");
    // We pass the token in query param because window.location.href doesn't support headers
    const url = `${API_BASE_URL}/api/v1/scholarship-providers/applications/export?token=${token}`;
    window.location.href = url;
  },

  async changeEmail(data: { new_email: string; password: string }): Promise<void> {
    await apiRequest("/api/v1/scholarship-providers/change-email", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async createNews(data: {
    title: string;
    short_desc?: string;
    content: string;
    image_url?: string;
    news_type?: string;
    published_by?: string;
    publish_date?: string;
    tags?: string[];
    allow_comments?: boolean;
    status?: string;
  }): Promise<ProviderNews> {
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

  async updateNews(id: number, data: {
    title: string;
    short_desc?: string;
    content: string;
    image_url?: string;
    news_type?: string;
    published_by?: string;
    publish_date?: string;
    tags?: string[];
    allow_comments?: boolean;
    status?: string;
  }): Promise<ProviderNews> {
    return apiRequest<ProviderNews>(`/api/v1/scholarship-providers/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteNews(id: number): Promise<void> {
    await apiRequest(`/api/v1/scholarship-providers/news/${id}`, { method: "DELETE" });
  },

  async createEvent(data: {
    name: string;
    short_desc?: string;
    description: string;
    image_url?: string;
    event_type?: string;
    category?: string;
    max_participants?: number;
    online_link?: string;
    organized_by?: string;
    contact_person?: string;
    contact_email?: string;
    start_date: string;
    end_date?: string;
    location?: string;
    tags?: string[];
    enable_registration?: boolean;
    status?: string;
  }): Promise<ProviderEvent> {
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

  async updateEvent(id: number, data: {
    name: string;
    short_desc?: string;
    description: string;
    image_url?: string;
    event_type?: string;
    category?: string;
    max_participants?: number;
    online_link?: string;
    organized_by?: string;
    contact_person?: string;
    contact_email?: string;
    start_date?: string;
    end_date?: string;
    location?: string;
    tags?: string[];
    enable_registration?: boolean;
    status?: string;
  }): Promise<ProviderEvent> {
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

  async approvePayment(applicationId: number, approve: boolean, reason?: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/api/v1/scholarship-providers/applications/${applicationId}/payment`, {
      method: "PUT",
      body: JSON.stringify({ approve, reason }),
    });
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

export const getPublicNews = async (page = 1, limit = 12) => {
  const res = await apiRequest<{ data: { news: ProviderNews[]; meta: any } }>(
    `/api/v1/public/news?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getPublicEvents = async (page = 1, limit = 12) => {
  const res = await apiRequest<{ data: { events: ProviderEvent[]; meta: any } }>(
    `/api/v1/public/events?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getPublicBlogs = async (page = 1, limit = 12) => {
  const res = await apiRequest<{ data: { blogs: ProviderBlog[]; meta: any } }>(
    `/api/v1/public/blogs?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getPublicBlogByID = async (id: number) => {
  const res = await apiRequest<{ data: ProviderBlog }>(
    `/api/v1/public/blogs/${id}`
  );
  return res.data;
};
