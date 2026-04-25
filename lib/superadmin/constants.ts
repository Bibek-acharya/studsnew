export const COLLEGE_LEVELS = [
  { value: "+2", label: "+2 College" },
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "a-level", label: "A Level" },
  { value: "ctevt", label: "CTEVT" },
] as const;

export const COLLEGE_TYPES = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "community", label: "Community" },
] as const;

export const AFFILIATIONS = [
  { value: "tu", label: "Tribhuvan University" },
  { value: "ku", label: "Kathmandu University" },
  { value: "pu", label: "Pokhara University" },
  { value: "purbanchal", label: "Purbanchal University" },
  { value: "neb", label: "NEB" },
  { value: "ctevt", label: "CTEVT" },
  { value: "cambridge", label: "Cambridge" },
] as const;

export const PROVINCES = [
  { value: "1", label: "Province 1" },
  { value: "2", label: "Madhesh" },
  { value: "3", label: "Bagmati" },
  { value: "4", label: "Gandaki" },
  { value: "5", label: "Lumbini" },
  { value: "6", label: "Karnali" },
  { value: "7", label: "Sudurpashchim" },
] as const;

export const COURSE_LEVELS = [
  { value: "+2", label: "+2" },
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
] as const;

export const ADMISSION_STATUSES = [
  { value: "ongoing", label: "Ongoing" },
  { value: "upcoming", label: "Upcoming" },
  { value: "closed", label: "Closed" },
] as const;

export const PROGRAM_STATUSES = [
  { value: "ongoing", label: "Ongoing" },
  { value: "closed", label: "Closed" },
] as const;

export const NEWS_CATEGORIES = [
  { value: "admission", label: "Admission" },
  { value: "exam", label: "Exam" },
  { value: "scholarship", label: "Scholarship" },
  { value: "event", label: "Event" },
  { value: "notice", label: "Notice" },
] as const;

export const DOCUMENT_TYPES = [
  { value: "brochure", label: "Brochure" },
  { value: "form", label: "Form" },
  { value: "guideline", label: "Guideline" },
  { value: "catalogue", label: "Catalogue" },
  { value: "other", label: "Other" },
] as const;

export const SCHOLARSHIP_TYPES = [
  { value: "merit", label: "Merit Based" },
  { value: "need", label: "Need Based" },
  { value: "minority", label: "Minority" },
] as const;

export const FACILITIES: { id: string; label: string; icon: string }[] = [
  { id: "library", label: "Central Library", icon: "Library" },
  { id: "science-labs", label: "Science Labs", icon: "FlaskConical" },
  { id: "computer-labs", label: "Computer Labs", icon: "Laptop" },
  { id: "sports", label: "Sports Complex", icon: "Dumbbell" },
  { id: "wifi", label: "High-Speed WiFi", icon: "Wifi" },
  { id: "transport", label: "Transportation", icon: "Bus" },
  { id: "cafeteria", label: "Cafeteria", icon: "Utensils" },
  { id: "auditorium", label: "Auditorium", icon: "CircleHelp" },
  { id: "hostel", label: "Hostel", icon: "Bed" },
];

export const DEFAULT_INQUIRY_FIELDS = [
  { name: "Full Name", required: true, enabled: true },
  { name: "Email Address", required: true, enabled: true },
  { name: "Phone Number", required: true, enabled: true },
  { name: "Course of Interest (Dropdown)", required: true, enabled: true },
];

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
