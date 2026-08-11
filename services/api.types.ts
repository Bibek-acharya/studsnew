// ─── Auth ────────────────────────────────────────────────────────────────────

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

// ─── Contact ─────────────────────────────────────────────────────────────────

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

// ─── Superadmin ──────────────────────────────────────────────────────────────

export interface SuperadminDashboardStats {
  total_students: number;
  total_institutions: number;
  total_providers: number;
  pending_institutions: number;
  pending_providers: number;
}

// ─── Notifications ───────────────────────────────────────────────────────────

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

// ─── Education Events ────────────────────────────────────────────────────────

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

// ─── Education Exams ─────────────────────────────────────────────────────────

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

// ─── Carousel / Ads ──────────────────────────────────────────────────────────

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

// ─── Scholarships ────────────────────────────────────────────────────────────

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

// ─── Education News ──────────────────────────────────────────────────────────

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

// ─── Bookmarks ───────────────────────────────────────────────────────────────

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

// ─── Counselling ─────────────────────────────────────────────────────────────

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

// ─── Education Courses ───────────────────────────────────────────────────────

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

// ─── Colleges ────────────────────────────────────────────────────────────────

export interface College {
  id: number;
  university_id?: number;
  name: string;
  full_name?: string;
  image_url?: string;
  banner_url?: string;
  logo_url?: string;
  card_image_url?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  type?: string;
  location?: string;
  affiliation?: string;
  non_university_affiliation?: string;
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

// ─── Universities ────────────────────────────────────────────────────────────

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
  official_notices?: any;
  latest_news?: any;
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

// ─── Forum ───────────────────────────────────────────────────────────────────

export interface ForumUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image_url?: string;
}

export interface ForumCommunity {
  id: number;
  name: string;
  icon: string;
  description?: string;
  bg_color?: string;
  member_count?: number;
  post_count?: number;
  is_member?: boolean;
  is_general?: boolean;
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
  user_name?: string;
  user?: ForumUser;
  community?: ForumCommunity;
}

export interface TrendingPost {
  id: number;
  title: string;
  category: string;
  upvotes: number;
  comment_count: number;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

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

// ─── My Applications ─────────────────────────────────────────────────────────

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

// ─── Messages ────────────────────────────────────────────────────────────────

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

// ─── Calendar Events ─────────────────────────────────────────────────────────

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

// ─── Invites ─────────────────────────────────────────────────────────────────

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

// ─── Profile ─────────────────────────────────────────────────────────────────

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

// ─── Education Entries ───────────────────────────────────────────────────────

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

// ─── Institution Dashboard ───────────────────────────────────────────────────

export interface InstitutionDashboardData {
  total_programs: number;
  total_students: number;
  active_students: number;
  active_entrances: number;
  pending_bookings: number;
  unread_messages: number;
  active_programs: number;
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

// ─── Sphere AI ───────────────────────────────────────────────────────────────

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

export interface SphereAIModelInfo {
  id: string;
  owned_by?: string;
}

export interface SphereAIModelsResponse {
  models: SphereAIModelInfo[];
  active_model: string;
  base_url: string;
}

// ─── Careers (re-export from careers.api) ────────────────────────────────────
export type { Job, JobApplication, PaginatedJobs, PaginatedApplications } from "./careers.api";

// ─── API Request Options ─────────────────────────────────────────────────────

export type ApiRequestOptions = RequestInit & {
  suppressAuthExpired?: boolean;
  authToken?: string;
};
