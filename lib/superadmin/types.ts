export type NavSection =
  | "overview"
  | "add-college"
  | "manage-college"
  | "add-course"
  | "manage-course"
  | "create-scholarship"
  | "manage-scholarship"
  | "add-entrance"
  | "manage-entrance"
  | "message-inquiry"
  | "create-news"
  | "manage-news"
  | "create-blog"
  | "manage-blog"
  | "create-event"
  | "manage-events"
  | "manage-campus-feed"
  | "add-user"
  | "user-management"
  | "analytics"
  | "manage-notification"
  | "access-control"
  | "payment"
  | "organization-profile"
  | "organization-settings"
  | "history"
  | "backup"
  | "settings";

export interface VideoParticipant {
  id: string;
  name: string;
  designation: string;
}

export interface UniversityField {
  id: string;
  field: string;
  value: string;
}

export interface LeadershipMember {
  id: string;
  position: string;
  role: string;
  holder: string;
}

export interface InquiryFormField {
  name: string;
  required: boolean;
  enabled: boolean;
}

export interface CourseEntry {
  id: string;
  name: string;
  level: string;
  duration: string;
  fees: string;
  specialization: string;
  eligibility: string;
  totalSeats: string;
}

export interface AdmissionNotice {
  id: string;
  program: string;
  affiliation: string;
  openDate: string;
  deadline: string;
  status: string;
}

export interface OfferedProgram {
  id: string;
  name: string;
  level: string;
  affiliation: string;
  status: string;
}

export interface CollegeEvent {
  id: string;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CollegeScholarship {
  id: string;
  program: string;
  name: string;
  benefit: string;
  forWhom: string;
}

export interface AlumniEntry {
  id: string;
  name: string;
  position: string;
  graduationYear: string;
  program: string;
  linkedin: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  description: string;
  publishedDate: string;
}

export interface DownloadDocument {
  id: string;
  title: string;
  type: string;
}

export interface CollegeFormData {
  collegeName: string;
  location: string;
  collegeLevel: string;
  collegeType: string;
  affiliation: string;
  establishmentDate: string;
  registrationNumber: string;
  campusSize: string;
  averageRating: string;
  websiteUrl: string;

  contactPersonName: string;
  designation: string;
  phoneNumber: string;
  emailAddress: string;
  physicalAddress: string;
  contactWebsiteUrl: string;

  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  tiktok: string;

  videoTitle: string;
  videoParticipants: VideoParticipant[];

  description: string;
  visionStatement: string;
  missionStatement: string;

  universityFields: UniversityField[];
  leadershipMembers: LeadershipMember[];

  googleMapsEmbedUrl: string;

  formTitle: string;
  formDescription: string;
  submitButtonText: string;
  emailRecipient: string;
  inquiryFormFields: InquiryFormField[];
  selectedFacilities: string[];
  additionalFacilities: string;

  courses: CourseEntry[];
  admissionNotices: AdmissionNotice[];
  offeredPrograms: OfferedProgram[];
  events: CollegeEvent[];
  scholarships: CollegeScholarship[];
  alumni: AlumniEntry[];
  newsItems: NewsItem[];
  documents: DownloadDocument[];

  collegeLogo: File | null;
  coverPhoto: File | null;
  mainVideo: File | null;
}

export type LockedSections = Record<string, boolean>;
