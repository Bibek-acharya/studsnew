// Core utilities - kept in this file
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

if (typeof window !== "undefined") {
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

export const callApi = async <T>(path: string): Promise<T> => {
  return apiRequest<T>(path);
};

// ─── Re-export all interfaces and types ──────────────────────────────────────
export type {
  AuthResponse,
  RegisterResponse,
  OTPResponse,
  ContactInquiryResponse,
  SuperadminDashboardStats,
  PublicNotificationItem,
  PublicNotificationsResponse,
  StudentNotificationItem,
  StudentNotificationsResponse,
  EducationEvent,
  EducationEventsResponse,
  EducationEventResponse,
  EducationExam,
  EducationExamsResponse,
  CarouselSlide,
  CarouselsResponse,
  Ad,
  AdsResponse,
  ScholarshipItem,
  ScholarshipsResponse,
  ScholarshipDetailResponse,
  EducationNewsItem,
  EducationNewsResponse,
  BookmarkItem,
  BookmarksResponse,
  CreateBookmarkResponse,
  CounsellingBookingPayload,
  CounsellingBookingItem,
  MyCounsellingBookingsResponse,
  CounsellingSessionItem,
  InstitutionCounsellingBookingItem,
  PaginationMeta,
  InstitutionCounsellingSessionsResponse,
  InstitutionCounsellingBookingsResponse,
  EducationCourse,
  College,
  University,
  UniversityCollege,
  UniversityDetailResponse,
  UniversityFilterCountsResponse,
  CollegeFilterCountsResponse,
  CollegeRecommendation,
  CollegePagination,
  CollegesResponse,
  ForumUser,
  ForumCommunity,
  ForumComment,
  ForumPost,
  AdminForumReport,
  TrendingPost,
  DashboardStats,
  DashboardStatsResponse,
  RecentApplicationItem,
  RecentApplicationsResponse,
  MyApplicationItem,
  MyApplicationsResponse,
  MessageItem,
  MessagesResponse,
  MessageResponse,
  CreateMessagePayload,
  MessageContactItem,
  MessageContactsResponse,
  CalendarEventsResponse,
  CalendarEventResponse,
  CalendarEventItem,
  CreateEventPayload,
  UpdateEventPayload,
  InvitesResponse,
  InviteItem,
  ProfileResponse,
  UpdateProfilePayload,
  ChangePasswordPayload,
  EducationEntriesResponse,
  EducationEntryItem,
  EducationEntryPayload,
  EducationEntryResponse,
  InstitutionDashboardData,
  InstitutionAnalyticsData,
  InstitutionProfileData,
  ApiRequestOptions,
  SphereAIRole,
  SphereAIMessage,
  SphereAIStreamHandlers,
  SphereAIModelInfo,
  SphereAIModelsResponse,
} from "./api.types";

// Also re-export careers types directly from api.types (which re-exports from careers.api)
export type {
  Job,
  JobApplication,
  PaginatedJobs,
  PaginatedApplications,
} from "./api.types";

// ─── Re-export domain API objects ────────────────────────────────────────────
export { authApi } from "./auth.api";
export { collegeApi } from "./college.api";
export { universityApi } from "./university.api";
export { forumApi } from "./forum.api";
export { counsellingApi } from "./counselling.api";
export { notificationApi } from "./notification.api";
export { bookmarkApi } from "./bookmark.api";
export { contactApi } from "./contact.api";
export { dashboardApi } from "./dashboard.api";
export { carouselApi } from "./carousel.api";
export { scholarshipEducationApi } from "./scholarship-education.api";
export { reviewApi } from "./review.api";
export { faqApi } from "./faq.api";
export { educationApi } from "./education.api";
export { careersApi } from "./careers.api";

// ─── Backward-compatible apiService object ───────────────────────────────────
import { authApi } from "./auth.api";
import { collegeApi } from "./college.api";
import { universityApi } from "./university.api";
import { forumApi } from "./forum.api";
import { counsellingApi } from "./counselling.api";
import { notificationApi } from "./notification.api";
import { bookmarkApi } from "./bookmark.api";
import { contactApi } from "./contact.api";
import { dashboardApi } from "./dashboard.api";
import { carouselApi } from "./carousel.api";
import { scholarshipEducationApi } from "./scholarship-education.api";
import { reviewApi } from "./review.api";
import { faqApi } from "./faq.api";
import { educationApi } from "./education.api";

export const apiService = {
  // Auth
  getUser: authApi.getUser.bind(authApi),
  setUser: authApi.setUser.bind(authApi),
  setScholarshipProviderUser: authApi.setScholarshipProviderUser.bind(authApi),
  getScholarshipProviderUser: authApi.getScholarshipProviderUser.bind(authApi),
  getToken: authApi.getToken.bind(authApi),
  getScholarshipProviderToken: authApi.getScholarshipProviderToken.bind(authApi),
  setToken: authApi.setToken.bind(authApi),
  setScholarshipProviderToken: authApi.setScholarshipProviderToken.bind(authApi),
  isAuthenticated: authApi.isAuthenticated.bind(authApi),
  logout: authApi.logout.bind(authApi),
  login: authApi.login.bind(authApi),
  register: authApi.register.bind(authApi),
  verifyOTP: authApi.verifyOTP.bind(authApi),
  sendOTP: authApi.sendOTP.bind(authApi),
  checkEmailExists: authApi.checkEmailExists.bind(authApi),
  resetPassword: authApi.resetPassword.bind(authApi),
  institutionLogin: authApi.institutionLogin.bind(authApi),
  scholarshipProviderLogin: authApi.scholarshipProviderLogin.bind(authApi),
  scholarshipProviderRegister: authApi.scholarshipProviderRegister.bind(authApi),
  institutionRegister: authApi.institutionRegister.bind(authApi),
  saveInstitutionPreferences: authApi.saveInstitutionPreferences.bind(authApi),
  getInstitutionPreferences: authApi.getInstitutionPreferences.bind(authApi),
  institutionSendOTP: authApi.institutionSendOTP.bind(authApi),
  institutionResetPassword: authApi.institutionResetPassword.bind(authApi),
  claimRegister: authApi.claimRegister.bind(authApi),
  generateTOTPSecret: authApi.generateTOTPSecret.bind(authApi),
  enableTOTP: authApi.enableTOTP.bind(authApi),
  disableTOTP: authApi.disableTOTP.bind(authApi),
  verifyLoginTOTP: authApi.verifyLoginTOTP.bind(authApi),
  deactivateAccount: authApi.deactivateAccount.bind(authApi),
  queueDeletion: authApi.queueDeletion.bind(authApi),
  cancelDeletion: authApi.cancelDeletion.bind(authApi),
  getDeletionStatus: authApi.getDeletionStatus.bind(authApi),
  getLoginSessions: authApi.getLoginSessions.bind(authApi),
  revokeSession: authApi.revokeSession.bind(authApi),
  revokeAllSessions: authApi.revokeAllSessions.bind(authApi),
  changePassword: authApi.changePassword.bind(authApi),
  scholarshipProviderLogout: authApi.scholarshipProviderLogout.bind(authApi),

  // Dashboard / Profile
  getProfile: dashboardApi.getProfile.bind(dashboardApi),
  updateProfile: dashboardApi.updateProfile.bind(dashboardApi),
  uploadProfilePicture: dashboardApi.uploadProfilePicture.bind(dashboardApi),
  getEducationEntries: dashboardApi.getEducationEntries.bind(dashboardApi),
  createEducationEntry: dashboardApi.createEducationEntry.bind(dashboardApi),
  updateEducationEntry: dashboardApi.updateEducationEntry.bind(dashboardApi),
  deleteEducationEntry: dashboardApi.deleteEducationEntry.bind(dashboardApi),
  getProfileDocuments: dashboardApi.getProfileDocuments.bind(dashboardApi),
  uploadProfileDocument: dashboardApi.uploadProfileDocument.bind(dashboardApi),
  deleteProfileDocument: dashboardApi.deleteProfileDocument.bind(dashboardApi),
  savePreferences: dashboardApi.savePreferences.bind(dashboardApi),
  getDashboardStats: dashboardApi.getDashboardStats.bind(dashboardApi),
  getRecentApplications: dashboardApi.getRecentApplications.bind(dashboardApi),
  getMyApplications: dashboardApi.getMyApplications.bind(dashboardApi),
  getMessages: dashboardApi.getMessages.bind(dashboardApi),
  getMessageById: dashboardApi.getMessageById.bind(dashboardApi),
  createMessage: dashboardApi.createMessage.bind(dashboardApi),
  replyToMessage: dashboardApi.replyToMessage.bind(dashboardApi),
  getMessageContacts: dashboardApi.getMessageContacts.bind(dashboardApi),
  getCalendarEvents: dashboardApi.getCalendarEvents.bind(dashboardApi),
  getCalendarEventById: dashboardApi.getCalendarEventById.bind(dashboardApi),
  createCalendarEvent: dashboardApi.createCalendarEvent.bind(dashboardApi),
  updateCalendarEvent: dashboardApi.updateCalendarEvent.bind(dashboardApi),
  deleteCalendarEvent: dashboardApi.deleteCalendarEvent.bind(dashboardApi),
  getInvites: dashboardApi.getInvites.bind(dashboardApi),
  acceptInvite: dashboardApi.acceptInvite.bind(dashboardApi),
  declineInvite: dashboardApi.declineInvite.bind(dashboardApi),
  saveInvite: dashboardApi.saveInvite.bind(dashboardApi),
  getSuperadminDashboardStats: dashboardApi.getSuperadminDashboardStats.bind(dashboardApi),
  listAllUsers: dashboardApi.listAllUsers.bind(dashboardApi),
  getUserDetail: dashboardApi.getUserDetail.bind(dashboardApi),
  suspendUser: dashboardApi.suspendUser.bind(dashboardApi),
  reinstateUser: dashboardApi.reinstateUser.bind(dashboardApi),
  getUserEducation: dashboardApi.getUserEducation.bind(dashboardApi),
  getInstitutionDashboard: dashboardApi.getInstitutionDashboard.bind(dashboardApi),
  getInstitutionAnalytics: dashboardApi.getInstitutionAnalytics.bind(dashboardApi),
  getInstitutionAdmissions: dashboardApi.getInstitutionAdmissions.bind(dashboardApi),
  updateAdmissionStatus: dashboardApi.updateAdmissionStatus.bind(dashboardApi),
  getInstitutionProfile: dashboardApi.getInstitutionProfile.bind(dashboardApi),
  updateInstitutionProfile: dashboardApi.updateInstitutionProfile.bind(dashboardApi),

  // College
  getColleges: collegeApi.getColleges.bind(collegeApi),
  getFeaturedColleges: collegeApi.getFeaturedColleges.bind(collegeApi),
  getCollegeById: collegeApi.getCollegeById.bind(collegeApi),
  compareColleges: collegeApi.compareColleges.bind(collegeApi),
  getCollegeFilterCounts: collegeApi.getCollegeFilterCounts.bind(collegeApi),
  getPublicInstitutionFilterCounts: collegeApi.getPublicInstitutionFilterCounts.bind(collegeApi),
  getAdminColleges: collegeApi.getAdminColleges.bind(collegeApi),
  getAdminCollegeById: collegeApi.getAdminCollegeById.bind(collegeApi),
  createCollege: collegeApi.createCollege.bind(collegeApi),
  updateCollege: collegeApi.updateCollege.bind(collegeApi),
  deleteCollege: collegeApi.deleteCollege.bind(collegeApi),
  approveCollege: collegeApi.approveCollege.bind(collegeApi),
  toggleCollegeFeatured: collegeApi.toggleCollegeFeatured.bind(collegeApi),
  uploadCollegeImage: collegeApi.uploadCollegeImage.bind(collegeApi),
  getMapColleges: collegeApi.getMapColleges.bind(collegeApi),
  updateCollegeLocation: collegeApi.updateCollegeLocation.bind(collegeApi),
  updateInstitutionCollegeLocation: collegeApi.updateInstitutionCollegeLocation.bind(collegeApi),
  getCollegeRecommenderRecommendations: collegeApi.getCollegeRecommenderRecommendations.bind(collegeApi),
  getPublicInstitutions: collegeApi.getPublicInstitutions.bind(collegeApi),
  getPublicInstitutionById: collegeApi.getPublicInstitutionById.bind(collegeApi),
  getSponsoredInstitutions: collegeApi.getSponsoredInstitutions.bind(collegeApi),
  getInstitutionsByUniversity: collegeApi.getInstitutionsByUniversity.bind(collegeApi),
  toggleInstitutionSponsored: collegeApi.toggleInstitutionSponsored.bind(collegeApi),
  getSuperadminInstitution: collegeApi.getSuperadminInstitution.bind(collegeApi),
  updateSuperadminInstitution: collegeApi.updateSuperadminInstitution.bind(collegeApi),
  listPendingInstitutions: collegeApi.listPendingInstitutions.bind(collegeApi),
  listVerifiedInstitutions: collegeApi.listVerifiedInstitutions.bind(collegeApi),
  listRejectedInstitutions: collegeApi.listRejectedInstitutions.bind(collegeApi),
  approveInstitution: collegeApi.approveInstitution.bind(collegeApi),
  listPendingProviders: collegeApi.listPendingProviders.bind(collegeApi),
  approveProvider: collegeApi.approveProvider.bind(collegeApi),
  rejectProvider: collegeApi.rejectProvider.bind(collegeApi),
  geocodeLocation: collegeApi.geocodeLocation.bind(collegeApi),
  logComparison: collegeApi.logComparison.bind(collegeApi),
  getPopularComparisons: collegeApi.getPopularComparisons.bind(collegeApi),

  // University
  getUniversities: universityApi.getUniversities.bind(universityApi),
  getUniversityById: universityApi.getUniversityById.bind(universityApi),
  getUniversityCourses: universityApi.getUniversityCourses.bind(universityApi),
  getUniversityScholarships: universityApi.getUniversityScholarships.bind(universityApi),
  getUniversityFilterCounts: universityApi.getUniversityFilterCounts.bind(universityApi),
  getUniversityReviews: universityApi.getUniversityReviews.bind(universityApi),
  submitUniversityReview: universityApi.submitUniversityReview.bind(universityApi),
  updateUniversityReview: universityApi.updateUniversityReview.bind(universityApi),
  getMyUniversityReview: universityApi.getMyUniversityReview.bind(universityApi),
  getUniversityEvents: universityApi.getUniversityEvents.bind(universityApi),
  getUniversityNews: universityApi.getUniversityNews.bind(universityApi),

  // Forum
  getForumCommunities: forumApi.getForumCommunities.bind(forumApi),
  getTrendingForumPosts: forumApi.getTrendingForumPosts.bind(forumApi),
  createForumCommunity: forumApi.createForumCommunity.bind(forumApi),
  updateForumCommunity: forumApi.updateForumCommunity.bind(forumApi),
  deleteForumCommunity: forumApi.deleteForumCommunity.bind(forumApi),
  getForumPosts: forumApi.getForumPosts.bind(forumApi),
  joinForumCommunity: forumApi.joinForumCommunity.bind(forumApi),
  getForumPostComments: forumApi.getForumPostComments.bind(forumApi),
  createForumComment: forumApi.createForumComment.bind(forumApi),
  voteForumPoll: forumApi.voteForumPoll.bind(forumApi),
  likeForumPost: forumApi.likeForumPost.bind(forumApi),
  dislikeForumPost: forumApi.dislikeForumPost.bind(forumApi),
  saveForumPost: forumApi.saveForumPost.bind(forumApi),
  createForumPost: forumApi.createForumPost.bind(forumApi),
  updateForumPost: forumApi.updateForumPost.bind(forumApi),
  deleteForumPost: forumApi.deleteForumPost.bind(forumApi),
  adminDeleteForumPost: forumApi.adminDeleteForumPost.bind(forumApi),
  getAdminForumReports: forumApi.getAdminForumReports.bind(forumApi),
  getAdminForumPostComments: forumApi.getAdminForumPostComments.bind(forumApi),
  adminDeleteForumComment: forumApi.adminDeleteForumComment.bind(forumApi),
  uploadForumMedia: forumApi.uploadForumMedia.bind(forumApi),
  reportForumPost: forumApi.reportForumPost.bind(forumApi),
  notInterestedForumPost: forumApi.notInterestedForumPost.bind(forumApi),

  // Counselling
  createCounsellingBooking: counsellingApi.createCounsellingBooking.bind(counsellingApi),
  getMyCounsellingBookings: counsellingApi.getMyCounsellingBookings.bind(counsellingApi),
  getInstitutionCounsellingSessions: counsellingApi.getInstitutionCounsellingSessions.bind(counsellingApi),
  getInstitutionCounsellingBookings: counsellingApi.getInstitutionCounsellingBookings.bind(counsellingApi),
  updateInstitutionBookingStatus: counsellingApi.updateInstitutionBookingStatus.bind(counsellingApi),
  updateCounsellingSession: counsellingApi.updateCounsellingSession.bind(counsellingApi),
  getPublicCounsellingSessions: counsellingApi.getPublicCounsellingSessions.bind(counsellingApi),
  createPublicCounsellingBooking: counsellingApi.createPublicCounsellingBooking.bind(counsellingApi),

  // Notifications
  getPublicNotifications: notificationApi.getPublicNotifications.bind(notificationApi),
  getStudentNotifications: notificationApi.getStudentNotifications.bind(notificationApi),
  markNotificationRead: notificationApi.markNotificationRead.bind(notificationApi),
  markAllNotificationsRead: notificationApi.markAllNotificationsRead.bind(notificationApi),

  // Bookmarks
  getBookmarksByType: bookmarkApi.getBookmarksByType.bind(bookmarkApi),
  createBookmark: bookmarkApi.createBookmark.bind(bookmarkApi),
  deleteBookmark: bookmarkApi.deleteBookmark.bind(bookmarkApi),

  // Contact
  submitContactInquiry: contactApi.submitContactInquiry.bind(contactApi),
  getContactInquiries: contactApi.getContactInquiries.bind(contactApi),
  updateContactInquiryStatus: contactApi.updateContactInquiryStatus.bind(contactApi),

  // Carousel/Ads
  getActiveAds: carouselApi.getActiveAds.bind(carouselApi),
  getCarousels: carouselApi.getCarousels.bind(carouselApi),

  // Education Scholarships
  getEducationScholarships: scholarshipEducationApi.getEducationScholarships.bind(scholarshipEducationApi),
  getEducationScholarshipById: scholarshipEducationApi.getEducationScholarshipById.bind(scholarshipEducationApi),
  getAvailableExamCenters: scholarshipEducationApi.getAvailableExamCenters.bind(scholarshipEducationApi),
  getEducationSimilarScholarships: scholarshipEducationApi.getEducationSimilarScholarships.bind(scholarshipEducationApi),
  applyScholarship: scholarshipEducationApi.applyScholarship.bind(scholarshipEducationApi),
  uploadScholarshipFile: scholarshipEducationApi.uploadScholarshipFile.bind(scholarshipEducationApi),
  listAllScholarships: scholarshipEducationApi.listAllScholarships.bind(scholarshipEducationApi),
  deleteScholarship: scholarshipEducationApi.deleteScholarship.bind(scholarshipEducationApi),
  toggleScholarshipFeature: scholarshipEducationApi.toggleScholarshipFeature.bind(scholarshipEducationApi),
  updateScholarship: scholarshipEducationApi.updateScholarship.bind(scholarshipEducationApi),

  // Reviews
  getCollegeReviews: reviewApi.getCollegeReviews.bind(reviewApi),
  submitReview: reviewApi.submitReview.bind(reviewApi),
  getUserReviews: reviewApi.getUserReviews.bind(reviewApi),
  updateReview: reviewApi.updateReview.bind(reviewApi),
  deleteReview: reviewApi.deleteReview.bind(reviewApi),
  voteReview: reviewApi.voteReview.bind(reviewApi),
  reportReview: reviewApi.reportReview.bind(reviewApi),
  submitTestimonial: reviewApi.submitTestimonial.bind(reviewApi),
  getUserTestimonials: reviewApi.getUserTestimonials.bind(reviewApi),

  // Education
  getEducationEvents: educationApi.getEducationEvents.bind(educationApi),
  getEducationEventFilterCounts: educationApi.getEducationEventFilterCounts.bind(educationApi),
  getEducationEventById: educationApi.getEducationEventById.bind(educationApi),
  getAdminEvents: educationApi.getAdminEvents.bind(educationApi),
  createEvent: educationApi.createEvent.bind(educationApi),
  updateEvent: educationApi.updateEvent.bind(educationApi),
  deleteEvent: educationApi.deleteEvent.bind(educationApi),
  toggleEventFeatured: educationApi.toggleEventFeatured.bind(educationApi),
  getEducationNews: educationApi.getEducationNews.bind(educationApi),
  getEducationNewsFilterCounts: educationApi.getEducationNewsFilterCounts.bind(educationApi),
  getEducationCourses: educationApi.getEducationCourses.bind(educationApi),
  getEducationExams: educationApi.getEducationExams.bind(educationApi),
  getPublicVolunteers: educationApi.getPublicVolunteers.bind(educationApi),
  getPublicVolunteerByID: educationApi.getPublicVolunteerByID.bind(educationApi),
  submitVolunteerApplication: educationApi.submitVolunteerApplication.bind(educationApi),
  reindexEmbeddings: educationApi.reindexEmbeddings.bind(educationApi),
  getReindexProgress: educationApi.getReindexProgress.bind(educationApi),

  // FAQ
  getFAQCategories: faqApi.getFAQCategories.bind(faqApi),
  createFAQCategory: faqApi.createFAQCategory.bind(faqApi),
  updateFAQCategory: faqApi.updateFAQCategory.bind(faqApi),
  deleteFAQCategory: faqApi.deleteFAQCategory.bind(faqApi),
  createFAQItem: faqApi.createFAQItem.bind(faqApi),
  updateFAQItem: faqApi.updateFAQItem.bind(faqApi),
  deleteFAQItem: faqApi.deleteFAQItem.bind(faqApi),
};

// ─── Sphere AI (kept here as it uses API_BASE_URL) ──────────────────────────

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
  history: import("./api.types").SphereAIMessage[],
  handlers: import("./api.types").SphereAIStreamHandlers,
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

export async function listSphereAIModels(): Promise<import("./api.types").SphereAIModelsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/ai/models`, {
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || `Could not list models (${res.status})`);
  }
  return json.data as import("./api.types").SphereAIModelsResponse;
}

// ─── Scholarship API (kept here as it uses callApi directly) ─────────────────

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

// ─── Feedback API (kept here as it uses API_BASE_URL) ───────────────────────

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

// ─── Scholarship Provider API (kept here as it uses API_BASE_URL) ────────────

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
