import { fetchCourses, fetchCourseFilterCounts } from "./course-api";
import { clearAllAuthSessions } from "./authSession";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

if (typeof window !== "undefined") {
  // log base URL in browser console to help debugging routing to backend
  // eslint-disable-next-line no-console
  console.info("API_BASE_URL:", API_BASE_URL);
}

type ApiRequestOptions = RequestInit & {
  suppressAuthExpired?: boolean;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { suppressAuthExpired, ...requestOptions } = options;
  // Get token from localStorage for production (cookie won't be sent to API domain)
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const isFormData =
    typeof FormData !== "undefined" && requestOptions.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  } else {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers,
    credentials: "include",
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error(`API Error: ${path} - Non-JSON response:`, text);
    throw new Error(`Unexpected response from server: ${text.substring(0, 100)}`);
  }

  if (!response.ok) {
    const errorMessage = data.message || data.error || "Request failed";
    if (
      response.status === 401 &&
      typeof window !== "undefined" &&
      !suppressAuthExpired &&
      !path.includes("/auth/login") &&
      !path.includes("/auth/register")
    ) {
      window.dispatchEvent(new CustomEvent("auth-expired"));
    }
    throw new Error(errorMessage);
  }

  return data as T;
}

export interface AuthResponse {
  data: {
    preferences: any;
    user: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      role: string;
      preferences?: any;
    };
    token: string;
  };
  message: string;
}

export interface RegisterResponse {
  data: {
    email: string;
    requires_otp: boolean;
  };
  message: string;
}

export interface OTPResponse {
  data: any;
  message: string;
}

export interface ContactInquiryResponse {
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    type: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  message: string;
}

export interface PublicNotificationItem {
  id: number;
  created_at: string;
  title: string;
  message: string;
  type: string;
  link: string;
  icon: string;
  color: string;
  bg_color: string;
}

export interface PublicNotificationsResponse {
  data: PublicNotificationItem[];
  message: string;
}

export interface StudentNotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link: string;
  created_at: string;
  updated_at: string;
}

export interface StudentNotificationsResponse {
  data: {
    notifications: StudentNotificationItem[];
    unread_count: number;
    meta: {
      total: number;
      page: number;
      limit: number;
    };
  };
  message: string;
}

export interface EducationEvent {
  id: number;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  organizer: string;
  location: string;
  date: string;
  time: string;
  registrationFee: string;
  image: string;
  interested: number;
  trending: boolean;
}

export interface EducationEventsResponse {
  data: {
    events: EducationEvent[];
  };
  message: string;
}

export interface EducationEventResponse {
  data: {
    event: EducationEvent;
  };
  message: string;
}

export interface ScholarshipItem {
  id: number;
  title: string;
  provider: string;
  location: string;
  value?: string;
  amount?: string;
  deadline: string;
  degree_level?: string;
  funding_type?: string;
  scholarship_type?: string;
  description?: string;
  image?: string;
  status?: string;
  eligibility?: string;
  category?: string;
  tags?: string[];
}

export interface ScholarshipsResponse {
  data: {
    scholarships: ScholarshipItem[];
    total?: number;
    page?: number;
    limit?: number;
  };
  message: string;
}

export interface ScholarshipDetailResponse {
  data: any;
  message: string;
}

export interface EducationNewsItem {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime?: string;
  source?: string;
  tags?: string[];
}

export interface EducationNewsResponse {
  data: {
    news: EducationNewsItem[];
  };
  message: string;
}

export interface BookmarkItem {
  id: number;
  user_id: number;
  item_id: number;
  item_type: string;
  created_at: string;
  updated_at: string;
}

export interface BookmarksResponse {
  data: {
    bookmarks: BookmarkItem[];
  };
  message: string;
}

export interface CreateBookmarkResponse {
  data: BookmarkItem;
  message: string;
}

export interface CounsellingBookingPayload {
  college: string;
  program_level: string;
  interested_course: string;
  session_mode: "online" | "in_person";
  session_date: string;
  session_time: string;
  student_name: string;
  student_phone: string;
  student_email: string;
  student_notes?: string;
}

export interface CounsellingBookingItem {
  id: number;
  college: string;
  program_level: string;
  interested_course: string;
  session_mode: string;
  session_date: string;
  session_time: string;
  student_name: string;
  student_phone: string;
  student_email: string;
  student_notes?: string;
  status: string;
  created_at: string;
}

export interface MyCounsellingBookingsResponse {
  data: {
    bookings: CounsellingBookingItem[];
  };
  message: string;
}

export interface CounsellingSessionItem {
  id: number;
  created_at: string;
  updated_at: string;
  institution_id: number;
  title: string;
  description: string;
  scheduled_at: string;
  duration: number;
  max_seats: number;
  booked_seats: number;
  status: string;
}

export interface InstitutionCounsellingBookingItem {
  id: number;
  created_at: string;
  updated_at: string;
  session_id: number;
  user_id: number;
  status: string;
  notes: string;
  session?: CounsellingSessionItem;
}

export interface InstitutionCounsellingSessionsResponse {
  data: CounsellingSessionItem[];
  message: string;
}

export interface InstitutionCounsellingBookingsResponse {
  data: InstitutionCounsellingBookingItem[];
  message: string;
}

export interface EducationCourse {
  id: number;
  title: string;
  colleges: number;
  affiliation: string;
  badges?: string[];
  level?: string;
  field?: string;
  duration?: string;
  estFee?: string;
  privateFee?: string;
  govtFee?: string;
  highlights?: string[];
  careerPath?: string;
  description?: string;
  image?: string;
}

export interface College {
  id: number;
  university_id?: number;
  name: string;
  full_name?: string;
  image_url?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  type?: string;
  location?: string;
  affiliation?: string;
  verified?: boolean;
  featured?: boolean;
  popular?: boolean;
  website?: string;
  email?: string;
  phone?: string;
  established?: string;
  students?: string;
  programs?: number;
  featured_programs?: string[];
  amenities?: string[];
  profile_tags?: string[];
  academic_fit_score?: number;
  campus_life_score?: number;
  career_fit_score?: number;
  balanced_fit_score?: number;
  about?: any;
  admissions?: any;
  admission_cards?: any;
  offered_programs?: any;
  alumni?: any;
  gallery?: any;
}

export interface University {
  id: number;
  name: string;
  logo?: string;
  location?: string;
  type?: string;
  rank?: number;
  rating?: number;
  review_count?: number;
  verified?: boolean;
  popular?: boolean;
  website?: string;
  cover?: string;
}

export interface CollegeFilterCountsResponse {
  data: {
    total: number;
    type_counts: Record<string, number>;
    type_counts_by_id: Record<string, number>;
    facet_counts_by_id: Record<string, number>;
    featured: number;
    verified: number;
    popular: number;
  };
}

export interface CollegeRecommendation {
  tuition: string;
  id: number;
  name: string;
  location: string;
  type?: string;
  match_score: number;
  reasons?: string[];
}

export interface CollegeRecommenderPayload {
  student_type: string;
  program_interest: string;
  preferred_location: string;
  budget_preference: string;
  campus_life_priority: string;
  career_goal: string;
  need_scholarship: boolean;
  preferred_mode: string;
  college_type: string;
  final_priority: string;
}

export interface CollegePagination {
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface CollegesResponse {
  data: {
    colleges: College[];
    pagination: CollegePagination;
  };
}

export interface ForumUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface ForumCommunity {
  id: number;
  name: string;
  emoji: string;
  description?: string;
  bg_color?: string;
  member_count?: number;
  post_count?: number;
  is_member?: boolean;
}

export interface ForumComment {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  parent_id?: number;
  created_at: string;
  createdAt?: string;
  user: ForumUser;
  replies?: ForumComment[];
}

export interface ForumPost {
  id: number;
  user_id: number;
  community_id: number;
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  is_poll: boolean;
  poll_options?: string; // JSON string
  poll_results?: Record<number, number>;
  total_votes?: number;
  voted_option?: number;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  is_liked?: boolean;
  is_disliked?: boolean;
  is_saved?: boolean;
  created_at: string;
  CreatedAt?: string;
  user?: ForumUser;
  community?: ForumCommunity;
}

// === Dashboard Stats ===
export interface DashboardStats {
  applications_submitted: number;
  saved_colleges: number;
  scholarships_applied: number;
  profile_completion: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  message: string;
}

export interface RecentApplicationItem {
  id: number;
  institution: string;
  program: string;
  type: string;
  status: string;
  updated_at: string;
}

export interface RecentApplicationsResponse {
  success: boolean;
  data: {
    applications: RecentApplicationItem[];
  };
  message: string;
}

// === My Applications ===
export interface MyApplicationItem {
  id: number;
  institution: string;
  program: string;
  type: "admission" | "entrance" | "scholarship";
  status: string;
  applied_date: string;
  deadline: string;
  location: string;
}

export interface MyApplicationsResponse {
  success: boolean;
  data: {
    applications: MyApplicationItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
    };
  };
  message: string;
}

// === Messages ===
export interface MessageItem {
  id: number;
  created_at: string;
  updated_at: string;
  sender_id: number;
  receiver_id: number;
  subject: string;
  content: string;
  read: boolean;
  direction: "incoming" | "outgoing";
}

export interface MessagesResponse {
  success: boolean;
  data: {
    messages: MessageItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
    };
  };
  message: string;
}

export interface MessageResponse {
  success: boolean;
  data: MessageItem;
  message: string;
}

export interface CreateMessagePayload {
  receiver_id: number;
  subject: string;
  content: string;
}

export interface MessageContactItem {
  user_id: number;
  name: string;
  last_message: string;
  unread: number;
}

export interface MessageContactsResponse {
  success: boolean;
  data: MessageContactItem[];
  message: string;
}

// === Calendar Events ===
export interface CalendarEventItem {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  link: string;
  color: string;
  reminder: boolean;
  type: string;
}

export interface CalendarEventsResponse {
  success: boolean;
  data: CalendarEventItem[];
  message: string;
}

export interface CalendarEventResponse {
  success: boolean;
  data: CalendarEventItem;
  message: string;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  location?: string;
  link?: string;
  color?: string;
  reminder?: boolean;
  type?: string;
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  link?: string;
  color?: string;
  reminder?: boolean;
  type?: string;
}

// === Invites ===
export interface InviteItem {
  id: number;
  user_id: number;
  institution_id: number;
  title: string;
  message: string;
  status: "pending" | "accepted" | "declined" | "saved";
  type: string;
  created_at: string;
  updated_at: string;
}

export interface InvitesResponse {
  success: boolean;
  data: {
    invites: InviteItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
    };
  };
  message: string;
}

// === Profile ===
export interface ProfileData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  address: string;
  bio: string;
  role: string;
  preferences?: {
    id: number;
    role: string;
    preference_flow: string;
    preferences: Record<string, any>;
    onboarding_completed: boolean;
    completed_at: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: ProfileData;
  message: string;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  bio?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

// === Education Entries ===
export interface EducationEntryItem {
  id: number;
  level: string;
  institution_name: string;
  board_university: string;
  country: string;
  stream: string;
  start_year: string;
  end_year: string;
  grading_system: string;
  grade: string;
}

export interface EducationEntryPayload {
  level: string;
  institution_name: string;
  board_university: string;
  country: string;
  stream?: string;
  start_year: string;
  end_year: string;
  grading_system?: string;
  grade?: string;
}

export interface EducationEntriesResponse {
  success: boolean;
  data: EducationEntryItem[];
  message: string;
}

export interface EducationEntryResponse {
  success: boolean;
  data: EducationEntryItem;
  message: string;
}

export const apiService = {
  getUser(): ForumUser | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("user");
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  },
  setUser(user: ForumUser | null): void {
    if (typeof window === "undefined") return;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  },
  setScholarshipProviderUser(_user: any | null): void {
    // Auth handled via HttpOnly cookie
  },
  getScholarshipProviderUser(): any | null {
    // Auth handled via HttpOnly cookie
    return null;
  },
  getToken(): string | null {
    // In production, cookie is set on frontend domain, not API domain
    // Read token from localStorage for API requests
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },
  getScholarshipProviderToken(): string | null {
    // In production, cookie is set on frontend domain, not API domain
    // Read token from localStorage for API requests
    if (typeof window !== "undefined") {
      return localStorage.getItem("scholarshipProviderToken");
    }
    return null;
  },
  setToken(token: string | null): void {
    // Store token in localStorage for API requests
    // In production, HttpOnly cookie won't be sent to API domain
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
  },
  setScholarshipProviderToken(token: string | null): void {
    // Store scholarship provider token in localStorage for API requests
    // In production, HttpOnly cookie won't be sent to API domain
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("scholarshipProviderToken", token);
      } else {
        localStorage.removeItem("scholarshipProviderToken");
      }
    }
  },
  isAuthenticated(): boolean {
    // Auth handled via HttpOnly cookie. Check by calling /profile.
    return false;
  },
  async logout(): Promise<void> {
    await apiRequest("/api/v1/auth/logout", { method: "POST", suppressAuthExpired: true });
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: string;
    education_level?: string;
    access_code?: string;
  }): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/v1/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  async sendOTP(email: string, type: "verification" | "password_reset" = "verification"): Promise<OTPResponse> {
    return apiRequest<OTPResponse>("/api/v1/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email, type }),
    });
  },

  async checkEmailExists(email: string): Promise<{ exists: boolean }> {
    return apiRequest<{ exists: boolean }>("/api/v1/auth/check-email", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async getProfile(options: { suppressAuthExpired?: boolean } = {}): Promise<ProfileResponse> {
    return apiRequest<ProfileResponse>("/api/v1/profile", options);
  },

  async getEducationEvents(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
  }): Promise<EducationEventsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.sort) query.set("sort", params.sort);

    const queryStr = query.toString();
    return apiRequest<EducationEventsResponse>(`/api/v1/education/events${queryStr ? `?${queryStr}` : ""}`);
  },

  async getEducationEventFilterCounts(): Promise<any> {
    return apiRequest<any>("/api/v1/education/events/filter-counts");
  },

  async getEducationEventById(id: number): Promise<EducationEventResponse> {
    return apiRequest<EducationEventResponse>(`/api/v1/education/events/${id}`);
  },

  async getEducationNews(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
  }): Promise<EducationNewsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.sort) query.set("sort", params.sort);

    const queryStr = query.toString();
    return apiRequest<EducationNewsResponse>(`/api/v1/education/news${queryStr ? `?${queryStr}` : ""}`);
  },

  async getEducationNewsFilterCounts(): Promise<any> {
    return apiRequest<any>("/api/v1/education/news/filter-counts");
  },

  async getEducationScholarships(params: { page?: number; limit?: number; degree_level?: string; funding_type?: string; search?: string; category?: string; status?: string; sort?: string } = {}): Promise<ScholarshipsResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.degree_level) query.set("degree_level", params.degree_level);
    if (params.funding_type) query.set("funding_type", params.funding_type);
    if (params.search) query.set("search", params.search);
    if (params.category) query.set("category", params.category);
    if (params.status) query.set("status", params.status);
    if (params.sort) query.set("sort", params.sort);

    const queryStr = query.toString();
    return apiRequest<ScholarshipsResponse>(`/api/v1/education/scholarships${queryStr ? `?${queryStr}` : ""}`);
  },

  async getFeaturedColleges(limit = 4): Promise<CollegesResponse> {
    const query = new URLSearchParams();
    query.set("limit", String(limit));
    return apiRequest<CollegesResponse>(`/api/v1/colleges/featured?${query.toString()}`);
  },

  async getBookmarksByType(type: string): Promise<BookmarksResponse> {
    return apiRequest<BookmarksResponse>(`/api/v1/bookmarks/${type}`);
  },

  async createBookmark(item_id: number, item_type: string): Promise<CreateBookmarkResponse> {
    return apiRequest<CreateBookmarkResponse>("/api/v1/bookmarks", {
      method: "POST",
      body: JSON.stringify({ item_id, item_type }),
    });
  },

  async deleteBookmark(bookmarkId: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/api/v1/bookmarks/${bookmarkId}`, {
      method: "DELETE",
    });
  },

  async submitContactInquiry(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
    type?: string;
    subject?: string;
  }): Promise<ContactInquiryResponse> {
    return apiRequest<ContactInquiryResponse>("/api/v1/system/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getPublicNotifications(): Promise<PublicNotificationsResponse> {
    return apiRequest<PublicNotificationsResponse>("/api/v1/system/notifications");
  },

  async getStudentNotifications(page = 1, limit = 20): Promise<StudentNotificationsResponse> {
    return apiRequest<StudentNotificationsResponse>(`/api/v1/notifications?page=${page}&limit=${limit}`);
  },

  async markNotificationRead(id: number): Promise<void> {
    return apiRequest<void>(`/api/v1/notifications/${id}/read`, { method: "PUT" });
  },

  async markAllNotificationsRead(): Promise<void> {
    return apiRequest<void>("/api/v1/notifications/read-all", { method: "PUT" });
  },

  async resetPassword(email: string, otp: string, password: string): Promise<any> {
    return apiRequest<any>("/api/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, password }),
    });
  },

  async createCounsellingBooking(
    token: string,
    data: CounsellingBookingPayload,
  ): Promise<{ data: any; message: string }> {
    return apiRequest<{ data: any; message: string }>("/api/v1/counselling/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getMyCounsellingBookings(): Promise<MyCounsellingBookingsResponse> {
    return apiRequest<MyCounsellingBookingsResponse>("/api/v1/counselling/bookings/my");
  },

  async getInstitutionCounsellingSessions(): Promise<InstitutionCounsellingSessionsResponse> {
    return apiRequest<InstitutionCounsellingSessionsResponse>("/api/v1/institution/counselling/sessions");
  },

  async getInstitutionCounsellingBookings(): Promise<InstitutionCounsellingBookingsResponse> {
    return apiRequest<InstitutionCounsellingBookingsResponse>("/api/v1/institution/counselling/bookings");
  },

  async updateInstitutionBookingStatus(
    id: number,
    status: string,
  ): Promise<{ data: InstitutionCounsellingBookingItem; message: string }> {
    return apiRequest<{ data: InstitutionCounsellingBookingItem; message: string }>(`/api/v1/institution/counselling/bookings/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  async getColleges(params: Record<string, any>): Promise<CollegesResponse> {
    const typeIdToBackendValue: Record<string, string> = {
      ct_private: "Private",
      ct_public: "Public / Govt",
      ct_community: "Community",
      ct_constituent: "Constituent",
      ct_foreign: "Foreign Affiliated",
    };

    const normalizedParams: Record<string, string> = {};
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      if (key === "type" && typeof value === "string") {
        const normalizedTypes = value
          .split(",")
          .map((type) => type.trim())
          .filter(Boolean)
          .map((type) => typeIdToBackendValue[type] || type);
        if (normalizedTypes.length > 0) {
          normalizedParams[key] = normalizedTypes.join(",");
        }
        return;
      }

      normalizedParams[key] = String(value);
    });

    const query = new URLSearchParams(normalizedParams).toString();
    return apiRequest<CollegesResponse>(`/api/v1/colleges${query ? `?${query}` : ""}`);
  },

  async getCollegeFilterCounts(): Promise<CollegeFilterCountsResponse> {
    return apiRequest<CollegeFilterCountsResponse>("/api/v1/colleges/filter-counts");
  },

  async getUniversities(params?: {
    search?: string;
    type?: string;
    popular?: boolean;
  }): Promise<{ data: { universities: University[] } }> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.type) query.set("type", params.type);
    if (params?.popular) query.set("popular", "true");

    return apiRequest<{ data: { universities: University[] } }>(`/api/v1/universities${query.toString() ? `?${query.toString()}` : ""}`);
  },

  async getAdminColleges(params?: Record<string, any>): Promise<CollegesResponse> {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      query.set(key, String(value));
    });

    return apiRequest<CollegesResponse>(`/api/v1/admin/colleges${query.toString() ? `?${query.toString()}` : ""}`);
  },

  async getAdminCollegeById(id: number): Promise<{ data: College }> {
    return apiRequest<{ data: College }>(`/api/v1/admin/colleges/${id}`);
  },

  async createCollege(data: {
    university_id?: number;
    name: string;
    full_name?: string;
    location: string;
    affiliation?: string;
    type?: string;
    verified?: boolean;
    popular?: boolean;
    rating?: number;
    reviews?: number;
    programs?: number;
    established?: string;
    students?: string;
    description?: string;
    website?: string;
    email?: string;
    phone?: string;
    image_url?: string;
    featured_programs?: string[];
    amenities?: string[];
    academic_fit_score?: number;
    campus_life_score?: number;
    career_fit_score?: number;
    balanced_fit_score?: number;
    profile_tags?: string[];
  }): Promise<{ data: College }> {
    return apiRequest<{ data: College }>("/api/v1/admin/colleges", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateCollege(id: number, data: Partial<{
    university_id: number;
    name: string;
    full_name: string;
    location: string;
    affiliation: string;
    type: string;
    verified: boolean;
    popular: boolean;
    rating: number;
    reviews: number;
    programs: number;
    established: string;
    students: string;
    description: string;
    website: string;
    email: string;
    phone: string;
    image_url: string;
    featured_programs: string[];
    amenities: string[];
    academic_fit_score: number;
    campus_life_score: number;
    career_fit_score: number;
    balanced_fit_score: number;
    profile_tags: string[];
  }>): Promise<{ data: College }> {
    return apiRequest<{ data: College }>(`/api/v1/admin/colleges/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteCollege(id: number): Promise<void> {
    await apiRequest(`/api/v1/admin/colleges/${id}`, {
      method: "DELETE",
    });
  },

  async approveCollege(id: number): Promise<{ data: College }> {
    return apiRequest<{ data: College }>(`/api/v1/admin/colleges/${id}/approve`, {
      method: "PUT",
    });
  },

  async toggleCollegeFeatured(id: number): Promise<{ data: College }> {
    return apiRequest<{ data: College }>(`/api/v1/admin/colleges/${id}/featured`, {
      method: "PUT",
    });
  },

  async uploadCollegeImage(file: File): Promise<string> {
    const token = this.getToken();
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/api/v1/admin/colleges/upload-image`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || data?.message || "Failed to upload image");
    }

    return data?.data?.url || data?.url;
  },

  async getEducationCourses(params?: {
    page?: number;
    limit?: number;
    search?: string;
    level?: string;
    field?: string;
    affiliation?: string;
  }): Promise<{ data: { courses: EducationCourse[] } }> {
    // Use course-api.ts with backend integration
    const { courses } = await fetchCourses({
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
      level: params?.level,
      field: params?.field,
      affiliation: params?.affiliation,
    });

    return {
      data: {
        courses: courses as unknown as EducationCourse[],
      },
    };
  },

  async getEducationScholarshipById(id: any): Promise<any> {
    return apiRequest<ScholarshipDetailResponse>(`/api/v1/education/scholarships/${id}`, {
      cache: "no-store",
    });
  },

  async getEducationSimilarScholarships(id: any): Promise<any> {
    return apiRequest<ScholarshipDetailResponse>(`/api/v1/education/scholarships/${id}/similar`, {
      cache: "no-store",
    });
  },

  async applyScholarship(scholarshipId: number, data: any): Promise<any> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const token = this.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return apiRequest<any>(`/api/v1/education/scholarships/${scholarshipId}/apply`, {
      method: "POST",
      body: JSON.stringify(data),
      headers,
    });
  },

  async getForumCommunities(_token?: string): Promise<ForumCommunity[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/communities`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch communities");
    const data = await response.json();
    return data.data || data;
  },

  async getForumPosts(limit?: number, _token?: string, communityId?: number, page?: number): Promise<{ posts: ForumPost[]; has_more: boolean }> {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (communityId) params.set("community_id", String(communityId));
    if (page) params.set("page", String(page));

    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts?${params.toString()}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch posts");
    const data = await response.json();
    return data.data || data;
  },

  async joinForumCommunity(_token: string, id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/communities/${id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to join community");
    const data = await response.json();
    return data.data || data;
  },

  async getForumPostComments(postId: number, limit?: number, offset?: number): Promise<any> {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (offset) params.set("offset", String(offset));

    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${postId}/comments?${params.toString()}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch comments");
    const data = await response.json();
    return data.data || data;
  },

  async createForumComment(_token: string, postId: number, data: any): Promise<ForumComment> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create comment");
    const result = await response.json();
    return result.data || result;
  },

  async voteForumPoll(_token: string, postId: number, optionIdx: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${postId}/poll/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ option_index: optionIdx }),
    });
    if (!response.ok) throw new Error("Failed to vote");
    const data = await response.json();
    return data.data || data;
  },

  async likeForumPost(_token: string, postId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${postId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to like post");
    const data = await response.json();
    return data.data || data;
  },

  async dislikeForumPost(_token: string, postId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${postId}/dislike`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to dislike post");
    const data = await response.json();
    return data.data || data;
  },

  async saveForumPost(_token: string, postId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${postId}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to save post");
    const data = await response.json();
    return data.data || data;
  },

  async createForumPost(_token: string, data: any): Promise<ForumPost> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create post");
    const result = await response.json();
    return result.data || result;
  },

  async updateForumPost(_token: string, id: number, data: any): Promise<ForumPost> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update post");
    const result = await response.json();
    return result.data || result;
  },

  async deleteForumPost(_token: string, id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete post");
    return response.json();
  },

  async getCollegeById(id: number): Promise<{ data: College }> {
    return apiRequest<{ data: College }>(`/api/v1/colleges/${id}`);
  },

  async uploadForumMedia(_token: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(`${API_BASE_URL}/api/v1/forum/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to upload media");
    const data = await response.json();
    return data.data?.urls || data.urls || [];
  },

  async savePreferences(data: {
    preference_role: string;
    preference_flow: string;
    preferences: Record<string, any>;
  }, _token?: string): Promise<any> {
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

  async getCollegeRecommenderRecommendations(payload: CollegeRecommenderPayload): Promise<{ data: { recommendations: CollegeRecommendation[] } }> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
      data: {
        recommendations: [
          {
            id: 1,
            name: "Pulchowk Campus, IOE",
            location: "Lalitpur",
            type: "Engineering",
            match_score: 9,
            tuition: "Rs. 50,000/year",
            reasons: ["Strong academics", "High placement rate", "Low tuition fees"],
          },
          {
            id: 2,
            name: "Thapathali Campus, IOE",
            location: "Kathmandu",
            type: "Engineering",
            match_score: 8,
            tuition: "Rs. 60,000/year",
            reasons: ["Good infrastructure", "Affordable fees", "Central location"],
          },
          {
            id: 3,
            name: "Kathmandu University",
            location: "Dhulikhel",
            type: "Engineering",
            match_score: 7,
            tuition: "Rs. 1,20,000/year",
            reasons: ["Excellent campus life", "Modern labs", "International exposure"],
          },
        ],
      },
    };
  },

  async scholarshipProviderLogin(email: string, password: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/v1/scholarship-providers/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  async scholarshipProviderRegister(data: {
    provider_name: string;
    registration_number: string;
    email: string;
    contact_number?: string;
    pan_number?: string;
    website_url?: string;
  }): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/api/v1/scholarship-providers/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async listPendingProviders(): Promise<{ data: any[]; message: string }> {
    return apiRequest<{ data: any[]; message: string }>("/api/v1/superadmin/pending-providers");
  },

  async approveProvider(providerId: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/api/v1/superadmin/providers/approve", {
      method: "POST",
      body: JSON.stringify({ provider_id: providerId, action: "approved" }),
    });
  },

  async rejectProvider(providerId: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/api/v1/superadmin/providers/approve", {
      method: "POST",
      body: JSON.stringify({ provider_id: providerId, action: "rejected" }),
    });
  },
  scholarshipProviderLogout(): void {
    if (typeof window === "undefined") return;
    clearAllAuthSessions();
  },

  async getCollegeReviews(collegeId: number, params?: {
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<any> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.sort) query.set("sort", params.sort);

    const queryStr = query.toString();
    return apiRequest<any>(`/api/v1/education/reviews/college/${collegeId}${queryStr ? `?${queryStr}` : ""}`);
  },

  async submitReview(data: {
    collegeId: number;
    collegeName?: string;
    studentType: "current" | "alumni";
    course: string;
    level: string;
    batchYear: number;
    ratings: Record<string, number>;
    pros: string;
    cons: string;
    summaryTitle: string;
    yearlyFee?: number;
    scholarship?: boolean;
    internshipOutcome?: string;
    email: string;
  }): Promise<any> {
    return apiRequest<any>("/api/v1/user/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getUserReviews(params?: {
    page?: number;
    limit?: number;
  }): Promise<any> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const queryStr = query.toString();
    return apiRequest<any>(`/api/v1/user/reviews${queryStr ? `?${queryStr}` : ""}`);
  },

  async updateReview(reviewId: number, data: Partial<{
    pros: string;
    cons: string;
    summaryTitle: string;
    ratings: Record<string, number>;
  }>): Promise<any> {
    return apiRequest<any>(`/api/v1/user/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteReview(reviewId: number): Promise<any> {
    return apiRequest<any>(`/api/v1/user/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },

  async markReviewHelpful(reviewId: number): Promise<any> {
    return apiRequest<any>(`/api/v1/education/reviews/${reviewId}/helpful`, {
      method: "POST",
    });
  },

  async reportReview(reviewId: number, reason: string): Promise<any> {
    return apiRequest<any>(`/api/v1/user/reviews/${reviewId}/report`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  // === Dashboard ===
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    return apiRequest<DashboardStatsResponse>("/api/v1/dashboard/stats");
  },

  async getRecentApplications(): Promise<RecentApplicationsResponse> {
    return apiRequest<RecentApplicationsResponse>("/api/v1/dashboard/recent-applications");
  },

  // === My Applications ===
  async getMyApplications(params?: { page?: number; limit?: number }): Promise<MyApplicationsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiRequest<MyApplicationsResponse>(`/api/v1/my-applications${qs ? `?${qs}` : ""}`);
  },

  // === Messages ===
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

  // === Calendar Events ===
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
    return apiRequest<void>(`/api/v1/calendar/events/${id}`, {
      method: "DELETE",
    });
  },

  // === Invites ===
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

  // === Profile ===
  async updateProfile(data: UpdateProfilePayload): Promise<ProfileResponse> {
    return apiRequest<ProfileResponse>("/api/v1/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async changePassword(data: ChangePasswordPayload): Promise<void> {
    return apiRequest<void>("/api/v1/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // === Education Entries ===
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
    return apiRequest<void>(`/api/v1/profile/education/${id}`, {
      method: "DELETE",
    });
  },
};

export const callApi = async <T>(path: string): Promise<T> => {
  return apiRequest<T>(path);
};

export const scholarshipApi = {
  async getScholarships() {
    return callApi<{ scholarships: any[] }>('/api/v1/scholarships');
  },
  
  async getScholarshipById(id: number) {
    return callApi<any>(`/api/v1/scholarships/${id}`);
  },
  
  async applyScholarship(scholarshipId: number, data: any) {
    return apiRequest(`/api/v1/scholarships/${scholarshipId}/apply`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async initiatePayment(scholarshipId: number, data: { method: string; amount: number }) {
    return apiRequest(`/api/v1/scholarships/${scholarshipId}/pay`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async confirmPayment(paymentId: number, transactionId: string) {
    return apiRequest(`/api/v1/scholarships/pay/${paymentId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ transaction_id: transactionId }),
    });
  },
  
  async uploadBankReceipt(paymentId: number, receiptImage: string) {
    return apiRequest(`/api/v1/scholarships/pay/${paymentId}/receipt`, {
      method: 'POST',
      body: JSON.stringify({ receipt_image: receiptImage }),
    });
  },
};

export const scholarshipProviderApi = {
  async getScholarships() {
    return apiRequest<any[]>('/api/v1/scholarship-providers/scholarships');
  },
  
  async createScholarship(data: any) {
    return apiRequest('/api/v1/scholarship-providers/scholarships', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async updateScholarship(id: number, data: any) {
    return apiRequest(`/api/v1/scholarship-providers/scholarships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  async publishScholarship(id: number) {
    return apiRequest(`/api/v1/scholarship-providers/scholarships/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'published' }),
    });
  },
  
  async saveFormConfig(scholarshipId: number, formConfig: any) {
    return apiRequest(`/api/v1/scholarship-providers/scholarships/${scholarshipId}`, {
      method: 'PUT',
      body: JSON.stringify({ form_config: formConfig }),
    });
  },
  
  async savePaymentConfig(scholarshipId: number, paymentConfig: any) {
    return apiRequest(`/api/v1/scholarship-providers/scholarships/${scholarshipId}`, {
      method: 'PUT',
      body: JSON.stringify({ payment_config: paymentConfig }),
    });
  },
  
  async approvePayment(paymentId: number, approve: boolean, reason?: string) {
    return apiRequest(`/api/v1/scholarship-providers/payments/${paymentId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approve, reason: reason || '' }),
    });
  },
};
