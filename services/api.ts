import { fetchCourses, fetchCourseFilterCounts } from "./course-api";
import { clearAllAuthSessions } from "./authSession";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

if (typeof window !== "undefined") {
  // log base URL in browser console to help debugging routing to backend

  console.info("API_BASE_URL:", API_BASE_URL);
}

const PLACEHOLDER_IMAGE = "https://placehold.co/800x400?text=No+Image";

export function getImageUrl(url: string | null | undefined): string {
  if (!url) return PLACEHOLDER_IMAGE;
  if (url.startsWith("blob:") || url.startsWith("data:"))
    return PLACEHOLDER_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}/${url}`;
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

type ApiRequestOptions = RequestInit & {
  suppressAuthExpired?: boolean;
  authToken?: string;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { suppressAuthExpired, authToken, ...requestOptions } = options;
  let token: string | null = authToken ?? null;
  if (!token && typeof window !== "undefined") {
    if (path.includes("/scholarship-providers/")) {
      token =
        localStorage.getItem("scholarshipProviderToken") ||
        localStorage.getItem("token");
    } else {
      token = localStorage.getItem("token");
    }
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
    throw new Error(
      `Unexpected response from server: ${text.substring(0, 100)}`,
    );
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
      image_url?: string;
      preferences?: any;
      provider_id?: number;
      permissions?: string[];
      is_sub_user?: boolean;
      totp_enabled?: boolean;
    };
    token: string;
  };
  message: string;
  requires_totp?: boolean;
  totp_token?: string;
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

export interface SuperadminDashboardStats {
  total_students: number;
  total_institutions: number;
  total_providers: number;
  pending_institutions: number;
  pending_providers: number;
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
  featured: boolean;
  slug?: string;
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

export interface EducationExam {
  id: number;
  title: string;
  board: string;
  level: string;
  type: string;
  exam_date: string;
  form_deadline: string;
  status: string;
  highlights: string[];
  institution_logo?: string;
  institution_name?: string;
  location?: string;
}

export interface EducationExamsResponse {
  data: {
    exams: EducationExam[];
  };
  message: string;
}

export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  link_url: string;
  button_text: string;
  order: number;
  active: boolean;
}

export interface CarouselsResponse {
  data: {
    carousels: CarouselSlide[];
  };
  message: string;
}

export interface Ad {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  position: string;
  active: boolean;
}

export interface AdsResponse {
  data: {
    ads: Ad[];
  };
  message: string;
}

export interface ScholarshipItem {
  id: number;
  slug?: string;
  provider_id?: number;
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
  application_start_date?: string;
  application_end_date?: string;
  start_date?: string;
  end_date?: string;
  isFeatured?: boolean;
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
  featured?: boolean;
  slug?: string;
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
  actual_status?: string;
}

export interface InstitutionCounsellingBookingItem {
  id: number;
  created_at: string;
  updated_at: string;
  session_id: number;
  user_id: number;
  status: string;
  notes: string;
  student_name?: string;
  student_phone?: string;
  student_email?: string;
  program_level?: string;
  interested_course?: string;
  session_mode?: string;
  meeting_link?: string;
  meeting_platform?: string;
  session?: CounsellingSessionItem;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export interface InstitutionCounsellingSessionsResponse {
  data: {
    sessions: CounsellingSessionItem[];
    meta: PaginationMeta;
  };
  message: string;
}

export interface InstitutionCounsellingBookingsResponse {
  data: {
    bookings: InstitutionCounsellingBookingItem[];
    meta: PaginationMeta;
  };
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
  source?: string;
}

export interface College {
  id: number;
  university_id?: number;
  name: string;
  full_name?: string;
  image_url?: string;
  banner_url?: string;
  logo_url?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  type?: string;
  location?: string;
  affiliation?: string;
  verified?: boolean;
  claimed?: boolean;
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
  latitude?: number;
  longitude?: number;
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
  isPopular?: boolean;
  is_nepali?: boolean;
  programsCount?: number;
  collegesCount?: number;
  status?: string;
  website?: string;
  cover?: string;
  description?: string;
  established?: string;
  students?: string;
  chancellor?: string;
  vice_chancellor?: string;
  founder?: string;
  popularPrograms?: string[];
  about?: any;
  contact?: any;
  quick?: any;
  overview?: any;
  leadership?: any;
  courses?: any;
  programs?: any;
  scholarships?: any;
  events?: any;
  news?: any;
  downloads?: any;
  gallery?: any;
  faculties?: any;
  admissions?: any;
  reviews?: any;
}

export interface UniversityCollege {
  id: number;
  universityId: number;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  affiliation: string;
  type: string;
}

export interface UniversityDetailResponse {
  university: University;
  colleges: UniversityCollege[];
}

export interface UniversityFilterCountsResponse {
  data: {
    total: number;
    type_counts: Record<string, number>;
    type_counts_by_id: Record<string, number>;
    rating_counts: Record<string, number>;
    academic_counts: Record<string, number>;
  };
  message?: string;
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
  breakdown?: {
    studentType: number;
    preferredField: number;
    location: number;
    budget: number;
    financialAid: number;
    academicsVsCampus: number;
    activities: number;
    facilities: number;
    reputation: number;
    distanceFromHome?: number;
    classSize?: number;
    profileCompatibility?: number;
  };
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
  category?: string;
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
  saved_scholarships: number;
  scholarships_applied: number;
  active_invites: number;
  unread_messages: number;
  upcoming_deadlines: number;
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
  middle_name?: string;
  image_url: string;
  phone: string;
  alternate_phone?: string;
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
  middle_name?: string;
  phone?: string;
  alternate_phone?: string;
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

// === Institution Dashboard ===
export interface InstitutionDashboardData {
  total_programs: number;
  total_students: number;
  active_entrances: number;
  pending_bookings: number;
  unread_messages: number;
}

export interface InstitutionAnalyticsProgramStat {
  id: number;
  name: string;
  status: string;
  entrances: number;
}

export interface InstitutionAnalyticsData {
  program_stats: InstitutionAnalyticsProgramStat[];
  total_applicants: number;
}

export interface InstitutionProfileData {
  id: number;
  institution_name: string;
  email: string;
  registration_number: string;
  role: string;
  location: string;
  website: string;
  logo_url: string;
  banner_url: string;
  about: string;
  vision: string;
  mission: string;
  videos: any;
  overview_data: any;
  leadership_data: any;
  courses_data: any;
  programs_data: any;
  facilities_data: any;
  alumni_data: any;
  downloads_data: any;
  whats_new_data: any;
  eligibility_data: any;
  admission_process_data: any;
  scholarships_data: any;
  faqs_data: any;
  contact_persons_data: any;
  brochure_data: any;
}

export const apiService = {
  getUser(): ForumUser | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
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
    await apiRequest("/api/v1/auth/logout", {
      method: "POST",
      suppressAuthExpired: true,
    });
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

  async sendOTP(
    email: string,
    type: "verification" | "password_reset" = "verification",
  ): Promise<OTPResponse> {
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

  async getProfile(
    options: { suppressAuthExpired?: boolean } = {},
  ): Promise<ProfileResponse> {
    return apiRequest<ProfileResponse>("/api/v1/profile", options);
  },

  async getEducationEvents(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
    featured?: string;
  }): Promise<EducationEventsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.sort) query.set("sort", params.sort);
    if (params?.featured) query.set("featured", params.featured);

    const queryStr = query.toString();
    return apiRequest<EducationEventsResponse>(
      `/api/v1/education/events${queryStr ? `?${queryStr}` : ""}`,
    );
  },

  async getEducationEventFilterCounts(): Promise<any> {
    return apiRequest<any>("/api/v1/education/events/filter-counts");
  },

  async getEducationEventById(id: number): Promise<EducationEventResponse> {
    return apiRequest<EducationEventResponse>(`/api/v1/education/events/${id}`);
  },

  async getAdminEvents(page = 1, limit = 50): Promise<any> {
    return apiRequest<any>(`/api/v1/admin/events?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });
  },

  async createEvent(data: any): Promise<any> {
    return apiRequest<any>("/api/v1/admin/events", {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
    });
  },

  async updateEvent(id: number, data: any): Promise<any> {
    return apiRequest<any>(`/api/v1/admin/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      cache: "no-store",
    });
  },

  async deleteEvent(id: number): Promise<any> {
    return apiRequest<any>(`/api/v1/admin/events/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });
  },

  async toggleEventFeatured(id: number): Promise<any> {
    return apiRequest<any>(`/api/v1/admin/events/${id}/feature`, {
      method: "PUT",
      cache: "no-store",
    });
  },

  async getEducationNews(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
    featured?: string;
  }): Promise<EducationNewsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.sort) query.set("sort", params.sort);
    if (params?.featured) query.set("featured", params.featured);

    const queryStr = query.toString();
    return apiRequest<EducationNewsResponse>(
      `/api/v1/education/news${queryStr ? `?${queryStr}` : ""}`,
    );
  },

  async getEducationNewsFilterCounts(): Promise<any> {
    return apiRequest<any>("/api/v1/education/news/filter-counts");
  },

  async getEducationScholarships(
    params: {
      page?: number;
      limit?: number;
      degree_level?: string;
      funding_type?: string;
      search?: string;
      category?: string;
      status?: string;
      sort?: string;
    } = {},
  ): Promise<ScholarshipsResponse> {
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
    return apiRequest<ScholarshipsResponse>(
      `/api/v1/education/scholarships${queryStr ? `?${queryStr}` : ""}`,
    );
  },

  async getFeaturedColleges(limit = 4): Promise<CollegesResponse> {
    const query = new URLSearchParams();
    query.set("limit", String(limit));
    return apiRequest<CollegesResponse>(
      `/api/v1/colleges/featured?${query.toString()}`,
    );
  },

  async getBookmarksByType(type: string): Promise<BookmarkItem[]> {
    const res = await apiRequest<{
      success: boolean;
      data: BookmarkItem[] | { bookmarks: BookmarkItem[] };
      message: string;
    }>(`/api/v1/bookmarks/${type}`);
    return Array.isArray(res.data) ? res.data : res.data?.bookmarks || [];
  },

  async createBookmark(
    item_id: number,
    item_type: string,
  ): Promise<CreateBookmarkResponse> {
    return apiRequest<CreateBookmarkResponse>("/api/v1/bookmarks", {
      method: "POST",
      body: JSON.stringify({ item_id, type: item_type }),
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

  async getContactInquiries(): Promise<{
    success: boolean;
    data: {
      inquiries: ContactInquiryResponse["data"][];
      meta: { total: number; page: number; limit: number };
    };
    message: string;
  }> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("superadmin_token")
        : null;
    return apiRequest("/api/v1/admin/inquiries", {
      authToken: token || undefined,
    });
  },

  async updateContactInquiryStatus(
    id: number,
    status: string,
  ): Promise<{ success: boolean; message: string }> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("superadmin_token")
        : null;
    return apiRequest(`/api/v1/admin/inquiries/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
      authToken: token || undefined,
    });
  },

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

  async resetPassword(
    email: string,
    otp: string,
    password: string,
  ): Promise<any> {
    return apiRequest<any>("/api/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, password }),
    });
  },

  async createCounsellingBooking(
    token: string,
    data: CounsellingBookingPayload,
  ): Promise<{ data: any; message: string }> {
    return apiRequest<{ data: any; message: string }>(
      "/api/v1/counselling/bookings",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  async getMyCounsellingBookings(): Promise<MyCounsellingBookingsResponse> {
    return apiRequest<MyCounsellingBookingsResponse>(
      "/api/v1/counselling/bookings/my",
    );
  },

  async getInstitutionCounsellingSessions(
    page = 1,
    limit = 50,
  ): Promise<InstitutionCounsellingSessionsResponse> {
    return apiRequest<InstitutionCounsellingSessionsResponse>(
      `/api/v1/institution/counselling/sessions?page=${page}&limit=${limit}`,
    );
  },

  async getInstitutionCounsellingBookings(
    page = 1,
    limit = 20,
  ): Promise<InstitutionCounsellingBookingsResponse> {
    return apiRequest<InstitutionCounsellingBookingsResponse>(
      `/api/v1/institution/counselling/bookings?page=${page}&limit=${limit}`,
    );
  },

  async updateInstitutionBookingStatus(
    id: number,
    status: string,
    meetingLink?: string,
    meetingPlatform?: string,
  ): Promise<{ data: InstitutionCounsellingBookingItem; message: string }> {
    return apiRequest<{
      data: InstitutionCounsellingBookingItem;
      message: string;
    }>(`/api/v1/institution/counselling/bookings/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({
        status,
        meeting_link: meetingLink,
        meeting_platform: meetingPlatform,
      }),
    });
  },

  async updateCounsellingSession(
    id: number,
    data: {
      title?: string;
      description?: string;
      scheduled_at?: string;
      duration?: number;
      max_seats?: number;
      status?: string;
    },
  ): Promise<any> {
    return apiRequest<any>(`/api/v1/institution/counselling/sessions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
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
    return apiRequest<CollegesResponse>(
      `/api/v1/colleges${query ? `?${query}` : ""}`,
    );
  },

  async getUniversityById(
    id: number,
  ): Promise<{ data: UniversityDetailResponse }> {
    return apiRequest<{ data: UniversityDetailResponse }>(
      `/api/v1/universities/${id}`,
    );
  },

  async getCollegeFilterCounts(): Promise<CollegeFilterCountsResponse> {
    return apiRequest<CollegeFilterCountsResponse>(
      "/api/v1/colleges/filter-counts",
    );
  },

  async getPublicInstitutionFilterCounts(): Promise<CollegeFilterCountsResponse> {
    return apiRequest<CollegeFilterCountsResponse>(
      "/api/v1/institutions/public/filter-counts",
    );
  },

  async getUniversities(params?: {
    search?: string;
    type?: string;
    popular?: boolean;
    isNepali?: string;
  }): Promise<{ data: { universities: University[] } }> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.type) query.set("type", params.type);
    if (params?.popular) query.set("popular", "true");
    if (params?.isNepali) query.set("isNepali", params.isNepali);

    return apiRequest<{ data: { universities: University[] } }>(
      `/api/v1/universities${query.toString() ? `?${query.toString()}` : ""}`,
    );
  },

  async getUniversityFilterCounts(
    isNepali?: string,
  ): Promise<UniversityFilterCountsResponse> {
    const query = isNepali ? `?isNepali=${isNepali}` : "";
    return apiRequest<UniversityFilterCountsResponse>(
      `/api/v1/universities/filter-counts${query}`,
    );
  },

  async getAdminColleges(
    params?: Record<string, any>,
  ): Promise<CollegesResponse> {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      query.set(key, String(value));
    });

    return apiRequest<CollegesResponse>(
      `/api/v1/admin/colleges${query.toString() ? `?${query.toString()}` : ""}`,
    );
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

  async updateCollege(
    id: number,
    data: Partial<{
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
    }>,
  ): Promise<{ data: College }> {
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
    return apiRequest<{ data: College }>(
      `/api/v1/admin/colleges/${id}/approve`,
      {
        method: "PUT",
      },
    );
  },

  async toggleCollegeFeatured(id: number): Promise<{ data: College }> {
    return apiRequest<{ data: College }>(
      `/api/v1/admin/colleges/${id}/featured`,
      {
        method: "PUT",
      },
    );
  },

  async uploadCollegeImage(file: File): Promise<string> {
    const token = this.getToken();
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `${API_BASE_URL}/api/v1/admin/colleges/upload-image`,
      {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );

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

  async getEducationExams(params?: {
    page?: number;
    limit?: number;
  }): Promise<EducationExamsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const queryStr = query.toString();
    return apiRequest<EducationExamsResponse>(
      `/api/v1/education/exams${queryStr ? `?${queryStr}` : ""}`,
    );
  },

  async getActiveAds(page?: string): Promise<AdsResponse> {
    const query = page ? `?page=${page}` : "";
    return apiRequest<AdsResponse>(`/api/v1/system/ads${query}`);
  },

  async getCarousels(page?: string): Promise<CarouselsResponse> {
    const query = page ? `?page=${page}` : "";
    return apiRequest<CarouselsResponse>(`/api/v1/system/carousels${query}`);
  },

  async getEducationScholarshipById(id: string | number): Promise<any> {
    return apiRequest<ScholarshipDetailResponse>(
      `/api/v1/education/scholarships/${id}`,
      {
        cache: "no-store",
      },
    );
  },

  async getAvailableExamCenters(id: string | number): Promise<string[]> {
    const res = await apiRequest<any>(
      `/api/v1/education/scholarships/${id}/exam-centers`,
      {
        cache: "no-store",
      },
    );
    return res?.data?.exam_centers || [];
  },

  async getEducationSimilarScholarships(id: string | number): Promise<any> {
    return apiRequest<ScholarshipDetailResponse>(
      `/api/v1/education/scholarships/${id}/similar`,
      {
        cache: "no-store",
      },
    );
  },

  async applyScholarship(
    scholarshipId: string | number,
    data: any,
  ): Promise<any> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = this.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return apiRequest<any>(
      `/api/v1/education/scholarships/${scholarshipId}/apply`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers,
      },
    );
  },

  async uploadScholarshipFile(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/scholarships/upload?folder=${encodeURIComponent(folder)}`,
      {
        method: "POST",
        body: formData,
        headers,
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to upload file");
    }

    const res = await response.json();
    return res.data?.url || res.url || "";
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

  async createForumCommunity(data: {
    name: string;
    description?: string;
    emoji?: string;
    bg_color?: string;
  }): Promise<ForumCommunity> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("superadmin_token")
        : null;
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/communities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to create community");
    const res = await response.json();
    return res.data || res;
  },

  async getForumPosts(
    limit?: number,
    _token?: string,
    communityId?: number,
    page?: number,
  ): Promise<{ posts: ForumPost[]; has_more: boolean }> {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (communityId) params.set("community_id", String(communityId));
    if (page) params.set("page", String(page));

    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/posts?${params.toString()}`,
      {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Failed to fetch posts");
    const data = await response.json();
    return data.data || data;
  },

  async joinForumCommunity(_token: string, id: number): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/communities/${id}/join`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Failed to join community");
    const data = await response.json();
    return data.data || data;
  },

  async getForumPostComments(
    postId: number,
    limit?: number,
    offset?: number,
  ): Promise<any> {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (offset) params.set("offset", String(offset));

    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/posts/${postId}/comments?${params.toString()}`,
      {
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Failed to fetch comments");
    const data = await response.json();
    return data.data || data;
  },

  async createForumComment(
    _token: string,
    postId: number,
    data: any,
  ): Promise<ForumComment> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/posts/${postId}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );
    if (!response.ok) throw new Error("Failed to create comment");
    const result = await response.json();
    return result.data || result;
  },

  async voteForumPoll(
    _token: string,
    postId: number,
    optionIdx: number,
  ): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/posts/${postId}/poll/vote`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ option_index: optionIdx }),
      },
    );
    if (!response.ok) throw new Error("Failed to vote");
    const data = await response.json();
    return data.data || data;
  },

  async likeForumPost(_token: string, postId: number): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/posts/${postId}/like`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Failed to like post");
    const data = await response.json();
    return data.data || data;
  },

  async dislikeForumPost(_token: string, postId: number): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/posts/${postId}/dislike`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Failed to dislike post");
    const data = await response.json();
    return data.data || data;
  },

  async saveForumPost(_token: string, postId: number): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/posts/${postId}/save`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
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

  async updateForumPost(
    _token: string,
    id: number,
    data: any,
  ): Promise<ForumPost> {
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

  async getMapColleges(params: {
    north?: number;
    south?: number;
    east?: number;
    west?: number;
  }): Promise<any> {
    const qs = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) qs.set(k, String(v));
    });
    const s = qs.toString();
    return apiRequest<any>(`/api/v1/map/colleges${s ? `?${s}` : ""}`);
  },

  async geocodeLocation(query: string): Promise<any> {
    return apiRequest<any>(`/api/v1/geocode?q=${encodeURIComponent(query)}`);
  },

  async updateCollegeLocation(
    id: number,
    latitude: number,
    longitude: number,
  ): Promise<any> {
    return apiRequest<any>(`/api/v1/admin/colleges/${id}/location`, {
      method: "PUT",
      body: JSON.stringify({ latitude, longitude }),
    });
  },

  async updateInstitutionCollegeLocation(
    latitude: number,
    longitude: number,
  ): Promise<any> {
    return apiRequest<any>("/api/v1/institution/college/location", {
      method: "PUT",
      body: JSON.stringify({ latitude, longitude }),
    });
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

  async savePreferences(
    data: {
      preference_role: string;
      preference_flow: string;
      preferences: Record<string, any>;
    },
    _token?: string,
  ): Promise<any> {
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

  async getCollegeRecommenderRecommendations(
    payload: object,
  ): Promise<{ data: { recommendations: CollegeRecommendation[] } }> {
    const res = await apiRequest<{
      data: { recommendations: CollegeRecommendation[] };
    }>("/api/v1/colleges/recommend", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res;
  },

  async institutionLogin(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/v1/institutions/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  async scholarshipProviderLogin(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    return apiRequest<AuthResponse>(
      "/api/v1/scholarship-providers/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );
  },
  async scholarshipProviderRegister(data: {
    provider_name: string;
    registration_number: string;
    email: string;
    contact_number?: string;
    pan_number?: string;
    website_url?: string;
  }): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>(
      "/api/v1/scholarship-providers/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  async institutionRegister(data: {
    institution_name: string;
    registration_number: string;
    email: string;
    contact_number?: string;
    province?: string;
    district?: string;
    local_body?: string;
    organization_type?: string;
    pan_number?: string;
    website_url?: string;
    contact_person?: string;
    contact_person_designation?: string;
    contact_person_phone?: string;
  }): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/api/v1/institutions/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async institutionSendOTP(
    email: string,
    type: "verification" | "password_reset",
  ): Promise<void> {
    await apiRequest("/api/v1/institutions/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email, type }),
    });
  },

  async institutionResetPassword(
    email: string,
    otp: string,
    password: string,
  ): Promise<void> {
    await apiRequest("/api/v1/institutions/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, password }),
    });
  },

  async claimRegister(data: {
    college_id: number;
    institution_name: string;
    registration_number: string;
    email: string;
    contact_number?: string;
    province?: string;
    district?: string;
    local_body?: string;
    organization_type?: string;
    pan_number?: string;
    website_url?: string;
    contact_person?: string;
    contact_person_designation?: string;
    contact_person_phone?: string;
  }): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/api/v1/institutions/auth/claim", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // === Institution Dashboard ===
  async getInstitutionDashboard(): Promise<{
    success: boolean;
    data: InstitutionDashboardData;
    message: string;
  }> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("institutionToken")
        : null;
    return apiRequest("/api/v1/institution/dashboard", {
      authToken: token || undefined,
    });
  },

  async getInstitutionAnalytics(): Promise<{
    success: boolean;
    data: InstitutionAnalyticsData;
    message: string;
  }> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("institutionToken")
        : null;
    return apiRequest("/api/v1/institution/analytics", {
      authToken: token || undefined,
    });
  },

  async getInstitutionAdmissions(
    status?: string,
  ): Promise<{ success: boolean; data: any[]; message: string }> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("institutionToken")
        : null;
    const query = status ? `?status=${status}` : "";
    return apiRequest(`/api/v1/institution/admissions${query}`, {
      authToken: token || undefined,
    });
  },

  async updateAdmissionStatus(
    id: number,
    status: string,
    notes?: string,
  ): Promise<{ success: boolean; data: any; message: string }> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("institutionToken")
        : null;
    return apiRequest(`/api/v1/institution/admissions/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, notes: notes || "" }),
      authToken: token || undefined,
    });
  },

  async getInstitutionProfile(): Promise<{
    success: boolean;
    data: InstitutionProfileData;
    message: string;
  }> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("institutionToken")
        : null;
    return apiRequest("/api/v1/institution/profile", {
      authToken: token || undefined,
    });
  },

  async updateInstitutionProfile(
    data: Partial<InstitutionProfileData>,
  ): Promise<{
    success: boolean;
    data: InstitutionProfileData;
    message: string;
  }> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("institutionToken")
        : null;
    return apiRequest("/api/v1/institution/profile", {
      method: "PUT",
      body: JSON.stringify(data),
      authToken: token || undefined,
    });
  },

  async getSuperadminDashboardStats(): Promise<{
    data: SuperadminDashboardStats;
  }> {
    return apiRequest<{ data: SuperadminDashboardStats }>(
      "/api/v1/superadmin/dashboard/stats",
    );
  },

  async listAllUsers(params?: {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ data: { users: any[]; pagination: any } }> {
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
    return apiRequest<{ data: any[] }>(
      `/api/v1/superadmin/users/${id}/education`,
    );
  },

  async listPendingInstitutions(): Promise<{ data: any[]; message: string }> {
    return apiRequest<{ data: any[]; message: string }>(
      "/api/v1/superadmin/pending-institutions",
    );
  },

  async listVerifiedInstitutions(): Promise<{ data: any[]; message: string }> {
    return apiRequest<{ data: any[]; message: string }>(
      "/api/v1/superadmin/institutions",
    );
  },

  async listRejectedInstitutions(): Promise<{ data: any[]; message: string }> {
    return apiRequest<{ data: any[]; message: string }>(
      "/api/v1/superadmin/rejected-institutions",
    );
  },

  async approveInstitution(
    institutionId: number,
    action: string,
  ): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      "/api/v1/superadmin/institutions/approve",
      {
        method: "POST",
        body: JSON.stringify({ institution_id: institutionId, action }),
      },
    );
  },

  async listPendingProviders(): Promise<{ data: any[]; message: string }> {
    return apiRequest<{ data: any[]; message: string }>(
      "/api/v1/superadmin/pending-providers",
    );
  },

  async approveProvider(providerId: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      "/api/v1/superadmin/providers/approve",
      {
        method: "POST",
        body: JSON.stringify({ provider_id: providerId, action: "approved" }),
      },
    );
  },

  async rejectProvider(providerId: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      "/api/v1/superadmin/providers/approve",
      {
        method: "POST",
        body: JSON.stringify({ provider_id: providerId, action: "rejected" }),
      },
    );
  },
  async listAllScholarships(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{
    data: {
      scholarships: any[];
      total?: number;
      page?: number;
      limit?: number;
      stats?: {
        total: number;
        active: number;
        draft: number;
        featured: number;
      };
    };
  }> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);
    const qs = query.toString();
    return apiRequest(`/api/v1/education/scholarships${qs ? `?${qs}` : ""}`);
  },

  async deleteScholarship(id: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/api/v1/admin/scholarships/${id}`, {
      method: "DELETE",
    });
  },

  async toggleScholarshipFeature(
    id: number,
    featured: boolean,
  ): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `/api/v1/education/scholarships/${id}`,
      { method: "PATCH", body: JSON.stringify({ isFeatured: featured }) },
    );
  },

  async updateScholarship(id: number, data: any): Promise<any> {
    return apiRequest(`/api/v1/education/scholarships/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  scholarshipProviderLogout(): void {
    if (typeof window === "undefined") return;
    clearAllAuthSessions();
  },

  async getCollegeReviews(
    collegeId: number,
    params?: {
      page?: number;
      limit?: number;
      sort?: string;
    },
    options?: ApiRequestOptions,
  ): Promise<any> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.sort) query.set("sort", params.sort);

    const queryStr = query.toString();
    return apiRequest<any>(
      `/api/v1/education/reviews/college/${collegeId}${queryStr ? `?${queryStr}` : ""}`,
      options,
    );
  },

  async submitReview(
    data: {
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
    },
    options?: ApiRequestOptions,
  ): Promise<any> {
    return apiRequest<any>("/api/v1/user/reviews", {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  },

  async getUserReviews(
    params?: {
      page?: number;
      limit?: number;
    },
    options?: ApiRequestOptions,
  ): Promise<any> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const queryStr = query.toString();
    return apiRequest<any>(
      `/api/v1/user/reviews${queryStr ? `?${queryStr}` : ""}`,
      options,
    );
  },

  async updateReview(
    reviewId: number,
    data: Partial<{
      pros: string;
      cons: string;
      summaryTitle: string;
      ratings: Record<string, number>;
    }>,
    options?: ApiRequestOptions,
  ): Promise<any> {
    return apiRequest<any>(`/api/v1/user/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  },

  async deleteReview(
    reviewId: number,
    options?: ApiRequestOptions,
  ): Promise<any> {
    return apiRequest<any>(`/api/v1/user/reviews/${reviewId}`, {
      method: "DELETE",
      ...options,
    });
  },

  async markReviewHelpful(
    reviewId: number,
    options?: ApiRequestOptions,
  ): Promise<any> {
    return apiRequest<any>(`/api/v1/education/reviews/${reviewId}/helpful`, {
      method: "POST",
      ...options,
    });
  },

  async reportReview(
    reviewId: number,
    reason: string,
    options?: ApiRequestOptions,
  ): Promise<any> {
    return apiRequest<any>(`/api/v1/user/reviews/${reviewId}/report`, {
      method: "POST",
      body: JSON.stringify({ reason }),
      ...options,
    });
  },

  async getUniversityReviews(
    universityId: number,
    params?: { page?: number; limit?: number },
    options?: ApiRequestOptions,
  ): Promise<any> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiRequest<any>(
      `/api/v1/education/reviews/university/${universityId}${qs ? `?${qs}` : ""}`,
      options,
    );
  },

  async submitUniversityReview(
    data: { university_id: number; rating: number; review: string },
    options?: ApiRequestOptions,
  ): Promise<any> {
    return apiRequest<any>("/api/v1/user/university-reviews", {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  },

  async getMyUniversityReview(
    universityId: number,
    options?: ApiRequestOptions,
  ): Promise<any> {
    return apiRequest<any>(
      `/api/v1/user/university-reviews/${universityId}`,
      options,
    );
  },

  async getUniversityEvents(
    universityId: number,
    params?: { page?: number; limit?: number },
  ): Promise<any> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    qs.set("university_id", String(universityId));
    return apiRequest<any>(`/api/v1/education/events?${qs.toString()}`);
  },

  async getUniversityNews(
    universityId: number,
    params?: { page?: number; limit?: number },
  ): Promise<any> {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    qs.set("university_id", String(universityId));
    return apiRequest<any>(`/api/v1/education/news?${qs.toString()}`);
  },

  async getSponsoredInstitutions(universityId: number): Promise<any> {
    return apiRequest<any>(`/api/v1/institutions/public/sponsored/${universityId}`);
  },

  async getInstitutionsByUniversity(universityId: number): Promise<any> {
    return apiRequest<any>(`/api/v1/institutions/public/by-university/${universityId}`);
  },

  async toggleInstitutionSponsored(institutionId: number, isSponsored: boolean): Promise<any> {
    return apiRequest<any>(`/api/v1/admin/institutions/${institutionId}/sponsored`, {
      method: "PUT",
      body: JSON.stringify({ is_sponsored: isSponsored }),
    });
  },

  async submitTestimonial(data: {
    name: string;
    designation: string;
    rating: number;
    review: string;
  }): Promise<{ success: boolean; message: string; data?: any }> {
    return apiRequest("/api/v1/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getUserTestimonials(): Promise<{
    success: boolean;
    data: Array<{
      id: number;
      user_id: number;
      user_name: string;
      role: string;
      image_url: string;
      rating: number;
      experience: string;
      created_at: string;
    }>;
  }> {
    return apiRequest("/api/v1/testimonials");
  },

  // === Dashboard ===
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    return apiRequest<DashboardStatsResponse>("/api/v1/dashboard/stats");
  },

  async getRecentApplications(): Promise<RecentApplicationsResponse> {
    return apiRequest<RecentApplicationsResponse>(
      "/api/v1/dashboard/recent-applications",
    );
  },

  // === My Applications ===
  async getMyApplications(params?: {
    page?: number;
    limit?: number;
  }): Promise<MyApplicationsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiRequest<MyApplicationsResponse>(
      `/api/v1/my-applications${qs ? `?${qs}` : ""}`,
    );
  },

  // === Messages ===
  async getMessages(params?: {
    page?: number;
    limit?: number;
  }): Promise<MessagesResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiRequest<MessagesResponse>(
      `/api/v1/messages${qs ? `?${qs}` : ""}`,
    );
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

  async createCalendarEvent(
    data: CreateEventPayload,
  ): Promise<CalendarEventResponse> {
    return apiRequest<CalendarEventResponse>("/api/v1/calendar/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateCalendarEvent(
    id: number,
    data: UpdateEventPayload,
  ): Promise<CalendarEventResponse> {
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
  async getInvites(params?: {
    page?: number;
    limit?: number;
  }): Promise<InvitesResponse> {
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

  // === TOTP 2FA ===
  async generateTOTPSecret(): Promise<{
    success: boolean;
    data: { secret: string; qr_uri: string; account: string };
    message: string;
  }> {
    return apiRequest("/api/v1/auth/totp/generate", { method: "POST" });
  },

  async enableTOTP(
    code: string,
  ): Promise<{ success: boolean; message: string }> {
    return apiRequest("/api/v1/auth/totp/enable", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },

  async disableTOTP(
    password: string,
    code: string,
  ): Promise<{ success: boolean; message: string }> {
    return apiRequest("/api/v1/auth/totp/disable", {
      method: "POST",
      body: JSON.stringify({ password, code }),
    });
  },

  async verifyLoginTOTP(
    tempToken: string,
    code: string,
  ): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/v1/auth/totp/verify", {
      method: "POST",
      body: JSON.stringify({ temp_token: tempToken, code }),
    });
  },

  async deactivateAccount(): Promise<{ success: boolean; message: string }> {
    return apiRequest("/api/v1/auth/deactivate", { method: "POST" });
  },

  async queueDeletion(): Promise<{
    success: boolean;
    message: string;
    data?: { scheduled_deletion_at: string };
  }> {
    return apiRequest("/api/v1/auth/delete-queue", { method: "POST" });
  },

  async cancelDeletion(): Promise<{ success: boolean; message: string }> {
    return apiRequest("/api/v1/auth/cancel-deletion", { method: "POST" });
  },

  // === FAQ ===
  async getFAQCategories(): Promise<{
    success: boolean;
    data: Array<{
      id: number;
      name: string;
      description: string;
      order: number;
      items: Array<{
        id: number;
        category_id: number;
        question: string;
        answer: string;
        order: number;
      }>;
    }>;
  }> {
    return apiRequest("/api/v1/faq");
  },

  async createFAQCategory(data: {
    name: string;
    description?: string;
  }): Promise<any> {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest("/api/v1/admin/faq/categories", {
      method: "POST",
      body: JSON.stringify(data),
      authToken: token || undefined,
    });
  },

  async updateFAQCategory(id: number, data: any): Promise<any> {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest(`/api/v1/admin/faq/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      authToken: token || undefined,
    });
  },

  async deleteFAQCategory(id: number): Promise<any> {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest(`/api/v1/admin/faq/categories/${id}`, {
      method: "DELETE",
      authToken: token || undefined,
    });
  },

  async createFAQItem(data: {
    category_id: number;
    question: string;
    answer: string;
  }): Promise<any> {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest("/api/v1/admin/faq/items", {
      method: "POST",
      body: JSON.stringify(data),
      authToken: token || undefined,
    });
  },

  async updateFAQItem(id: number, data: any): Promise<any> {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest(`/api/v1/admin/faq/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      authToken: token || undefined,
    });
  },

  async deleteFAQItem(id: number): Promise<any> {
    const token = localStorage.getItem("superadmin_token");
    return apiRequest(`/api/v1/admin/faq/items/${id}`, {
      method: "DELETE",
      authToken: token || undefined,
    });
  },

  async getDeletionStatus(): Promise<{
    success: boolean;
    data: { scheduled_deletion_at?: string; days_remaining?: number };
  }> {
    return apiRequest("/api/v1/auth/deletion-status");
  },

  // === Login Sessions ===
  async getLoginSessions(): Promise<{
    success: boolean;
    data: Array<{
      id: number;
      device_name: string;
      device_type: string;
      browser: string;
      location: string;
      ip_address: string;
      is_current: boolean;
      last_active_at: string;
      created_at: string;
    }>;
  }> {
    return apiRequest("/api/v1/auth/sessions");
  },

  async revokeSession(sessionId: number): Promise<void> {
    return apiRequest(`/api/v1/auth/sessions/${sessionId}`, {
      method: "DELETE",
    });
  },

  async revokeAllSessions(): Promise<void> {
    return apiRequest("/api/v1/auth/sessions", { method: "DELETE" });
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

  async uploadProfilePicture(file: File): Promise<ProfileResponse> {
    const token =
      typeof window !== "undefined"
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

  // === Education Entries ===
  async getEducationEntries(): Promise<EducationEntriesResponse> {
    return apiRequest<EducationEntriesResponse>("/api/v1/profile/education");
  },

  async createEducationEntry(
    data: EducationEntryPayload,
  ): Promise<EducationEntryResponse> {
    return apiRequest<EducationEntryResponse>("/api/v1/profile/education", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateEducationEntry(
    id: number,
    data: EducationEntryPayload,
  ): Promise<EducationEntryResponse> {
    return apiRequest<EducationEntryResponse>(
      `/api/v1/profile/education/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
  },

  async deleteEducationEntry(id: number): Promise<void> {
    return apiRequest<void>(`/api/v1/profile/education/${id}`, {
      method: "DELETE",
    });
  },

  // === Profile Documents ===
  async getProfileDocuments(): Promise<{
    success: boolean;
    data: Array<{
      id: number;
      file_name: string;
      file_size: number;
      type: string;
      mime_type: string;
      url: string;
      created_at: string;
    }>;
  }> {
    return apiRequest("/api/v1/profile/documents");
  },

  async uploadProfileDocument(
    file: File,
    type: string,
  ): Promise<{
    success: boolean;
    data: {
      id: number;
      file_name: string;
      file_size: number;
      type: string;
      mime_type: string;
      url: string;
      created_at: string;
    };
  }> {
    const token =
      typeof window !== "undefined"
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

  // ─── Public Volunteer API ─────────────────────────────────────────

  async getPublicVolunteers(params?: {
    search?: string;
    type?: string;
    province?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.type) searchParams.set("type", params.type);
    if (params?.province) searchParams.set("province", params.province);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return apiRequest(`/api/v1/public/volunteers${qs ? `?${qs}` : ""}`);
  },

  async getPublicVolunteerByID(id: string | number): Promise<any> {
    return apiRequest(`/api/v1/public/volunteers/${id}`);
  },

  async submitVolunteerApplication(
    volunteerId: string | number,
    data: any,
    cvFile?: File,
  ): Promise<any> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v: string) => formData.append(key, v));
      } else {
        formData.append(key, value as string);
      }
    });
    if (cvFile) {
      formData.append("cv_file", cvFile);
    }
    return apiRequest(`/api/v1/public/volunteers/${volunteerId}/apply`, {
      method: "POST",
      body: formData,
    });
  },

  async getPublicInstitutions(params: Record<string, any>): Promise<any> {
    const typeIdToBackendValue: Record<string, string> = {
      ct_private: "Private",
      ct_public: "Public / Govt",
      ct_community: "Community",
      ct_constituent: "Constituent",
      ct_foreign: "Foreign Affiliated",
    };
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        const normalized =
          key === "type" && typeof value === "string"
            ? value
                .split(",")
                .map((t) => typeIdToBackendValue[t.trim()] || t.trim())
                .filter(Boolean)
                .join(",")
            : String(value);
        query.set(key, normalized);
      }
    });
    const qs = query.toString();
    return apiRequest<any>(`/api/v1/institutions/public${qs ? `?${qs}` : ""}`);
  },

  async getPublicInstitutionById(id: number): Promise<any> {
    return apiRequest<any>(`/api/v1/institutions/public/${id}`);
  },

  async getPublicCounsellingSessions(institutionId: number): Promise<any> {
    return apiRequest<any>(
      `/api/v1/institutions/public/${institutionId}/counselling-sessions`,
    );
  },

  async createPublicCounsellingBooking(data: {
    session_id: number;
    program_level: string;
    interested_course: string;
    session_mode: string;
    student_name: string;
    student_phone: string;
    student_email: string;
    student_notes?: string;
  }): Promise<any> {
    return apiRequest<any>("/api/v1/counselling/sessions/book", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getSuperadminInstitution(id: number): Promise<any> {
    return apiRequest<any>(`/api/v1/superadmin/institutions/${id}`);
  },

  async updateSuperadminInstitution(id: number, data: any): Promise<any> {
    return apiRequest<any>(`/api/v1/superadmin/institutions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async reindexEmbeddings(
    force = false,
  ): Promise<{ success: boolean; message: string }> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("superadmin_token")
        : null;
    return apiRequest<{ success: boolean; message: string }>(
      `/api/v1/admin/search/reindex?force=${force}`,
      {
        method: "POST",
        authToken: token || undefined,
      },
    );
  },
};

export const callApi = async <T>(path: string): Promise<T> => {
  return apiRequest<T>(path);
};

export const scholarshipApi = {
  async getScholarships() {
    return callApi<{ scholarships: any[] }>("/api/v1/scholarships");
  },

  async getScholarshipById(id: string | number) {
    return callApi<any>(`/api/v1/education/scholarships/${id}`);
  },

  async applyScholarship(scholarshipId: number, data: any) {
    return apiRequest(`/api/v1/scholarships/${scholarshipId}/apply`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async initiatePayment(
    scholarshipId: number,
    data: { method: string; amount: number; application_id?: number },
  ) {
    return apiRequest(`/api/v1/scholarships/${scholarshipId}/pay`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async confirmPayment(paymentId: number, transactionId: string) {
    return apiRequest(`/api/v1/scholarships/pay/${paymentId}/confirm`, {
      method: "POST",
      body: JSON.stringify({ transaction_id: transactionId }),
    });
  },

  async uploadBankReceipt(paymentId: number, receiptImage: string) {
    return apiRequest(`/api/v1/scholarships/pay/${paymentId}/receipt`, {
      method: "POST",
      body: JSON.stringify({ receipt_image: receiptImage }),
    });
  },

  async esewaInitiate(applicationId: number, amount: number) {
    return apiRequest("/api/v1/scholarships/pay/esewa/initiate", {
      method: "POST",
      body: JSON.stringify({
        application_id: applicationId,
        amount,
      }),
    });
  },

  async esewaVerifyPayment(applicationId: number, data: any) {
    return apiRequest("/api/v1/scholarships/pay/esewa/verify", {
      method: "POST",
      body: JSON.stringify({
        application_id: applicationId,
        transaction_uuid: data.transaction_uuid || data.transactionUuid,
        total_amount: data.total_amount || data.totalAmount,
        product_code: data.product_code || data.productCode,
        status: data.status,
        transaction_code: data.transaction_code || data.transactionCode || "",
        ref_id: data.ref_id || data.reference_id || data.refId || "",
      }),
    });
  },

  async recommendScholarships(data: {
    educationLevel: string;
    studyMode: string;
    academicScoreType: string;
    academicScore: string;
    fieldOfStudy: string;
    willingEssay: string;
    willingInterview: string;
    willingGpa: string;
    province: string;
    district: string;
    studyLocation: string;
    category: string;
    gender: string;
    income: string;
    talents: string[];
    achievements: string[];
    involvement: string[];
  }): Promise<{
    success: boolean;
    data: {
      scholarships: Array<{
        id: number;
        title: string;
        providerType: string;
        coverage: string;
        deadline: string;
        description: string;
        tagColorClass: string;
        score?: number;
        breakdown?: {
          educationLevel: number;
          fieldOfStudy: number;
          location: number;
          financialFit: number;
          studyLocation: number;
          categoryGender: number;
          gpaMatch: number;
          willingness: number;
          talents: number;
          achievements: number;
          profileCompatibility?: number;
        };
      }>;
    };
    message: string;
  }> {
    return apiRequest("/api/v1/education/scholarships/recommend", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export const feedbackApi = {
  async submitFeedback(data: {
    rating: number;
    experience: string;
    email?: string;
  }): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(
      "/api/v1/feedback",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  async listFeedback(): Promise<{
    success: boolean;
    data: Array<{
      id: number;
      user_name: string;
      image_url: string;
      rating: number;
      experience: string;
      email: string;
      created_at: string;
    }>;
    message: string;
  }> {
    return apiRequest("/api/v1/feedback");
  },

  async deleteFeedback(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    return apiRequest(`/api/v1/feedback/${id}`, {
      method: "DELETE",
    });
  },

  async getPublicFeedbacks(): Promise<{
    success: boolean;
    data: Array<{
      id: number;
      user_name: string;
      image_url: string;
      rating: number;
      experience: string;
      created_at: string;
    }>;
    message: string;
  }> {
    return apiRequest("/api/v1/public/feedback");
  },

  async submitTestimonial(data: {
    name: string;
    designation: string;
    rating: number;
    review: string;
  }): Promise<{ success: boolean; message: string }> {
    return apiRequest("/api/v1/public/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export const scholarshipProviderApi = {
  async getScholarships() {
    return apiRequest<any[]>("/api/v1/scholarship-providers/scholarships");
  },

  async createScholarship(data: any) {
    return apiRequest("/api/v1/scholarship-providers/scholarships", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateScholarship(id: number, data: any) {
    return apiRequest(`/api/v1/scholarship-providers/scholarships/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async publishScholarship(id: number) {
    return apiRequest(`/api/v1/scholarship-providers/scholarships/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "published" }),
    });
  },

  async saveFormConfig(scholarshipId: number, formConfig: any) {
    return apiRequest(
      `/api/v1/scholarship-providers/scholarships/${scholarshipId}`,
      {
        method: "PUT",
        body: JSON.stringify({ form_config: formConfig }),
      },
    );
  },

  async savePaymentConfig(scholarshipId: number, paymentConfig: any) {
    return apiRequest(
      `/api/v1/scholarship-providers/scholarships/${scholarshipId}`,
      {
        method: "PUT",
        body: JSON.stringify({ payment_config: paymentConfig }),
      },
    );
  },

  async approvePayment(paymentId: number, approve: boolean, reason?: string) {
    return apiRequest(
      `/api/v1/scholarship-providers/payments/${paymentId}/approve`,
      {
        method: "POST",
        body: JSON.stringify({ approve, reason: reason || "" }),
      },
    );
  },
};

export type SphereAIRole = "user" | "assistant" | "system";

export interface SphereAIMessage {
  role: SphereAIRole;
  content: string;
}

export interface SphereAIStreamHandlers {
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

let sphereAISessionCounter = 0;
function getSphereAISessionId(): string {
  if (typeof window === "undefined") return "ssr";
  const key = "studsphere_ai_session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    sphereAISessionCounter += 1;
    id = `sai_${Date.now()}_${sphereAISessionCounter}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function streamSphereAIChat(
  message: string,
  history: SphereAIMessage[],
  handlers: SphereAIStreamHandlers,
): () => void {
  const controller = new AbortController();

  (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message,
          session_id: getSphereAISessionId(),
          history,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        handlers.onError(
          err.error || err.message || `Sphere AI returned ${response.status}`,
        );
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        handlers.onError("No response stream from Sphere AI");
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let sep = buffer.indexOf("\n\n");
        while (sep !== -1) {
          const event = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          if (event.startsWith("data:")) {
            const data = event.slice(5).trim();
            if (!data) {
              sep = buffer.indexOf("\n\n");
              continue;
            }
            try {
              const parsed = JSON.parse(data);
              if (typeof parsed.token === "string" && parsed.token.length > 0) {
                handlers.onToken(parsed.token);
              } else if (parsed.done) {
                handlers.onDone();
              } else if (parsed.error) {
                handlers.onError(parsed.error);
              }
            } catch {
              // ignore malformed chunk
            }
          }
          sep = buffer.indexOf("\n\n");
        }
      }

      if (buffer.trim().startsWith("data:")) {
        const data = buffer.trim().slice(5).trim();
        try {
          const parsed = JSON.parse(data);
          if (parsed.done) handlers.onDone();
          else if (parsed.error) handlers.onError(parsed.error);
        } catch {
          // ignore
        }
      } else {
        handlers.onDone();
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      handlers.onError(err?.message || "Connection to Sphere AI failed");
    }
  })();

  return () => controller.abort();
}

export interface SphereAIModelInfo {
  id: string;
  owned_by?: string;
}

export interface SphereAIModelsResponse {
  models: SphereAIModelInfo[];
  active_model: string;
  base_url: string;
}

export async function listSphereAIModels(): Promise<SphereAIModelsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/ai/models`, {
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || `Could not list models (${res.status})`);
  }
  return json.data as SphereAIModelsResponse;
}
