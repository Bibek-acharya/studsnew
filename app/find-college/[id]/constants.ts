import type { TabKey } from "../types";

export const TAB_DEFINITIONS: Array<[TabKey, string]> = [
  ["about", "About"],
  ["recognition", "Recognition & Accreditation"],
  ["offered", "Programs Offered"],
  ["admissions", "Admissions"],
  ["courses", "Courses & Fees"],
  ["scholarship", "Scholarships"],
  ["facilities", "Facilities"],
  ["events", "Events & Activities"],
  ["alumni", "Alumni"],
  ["gallery", "Gallery"],
  ["news", "News & Notices"],
  ["download", "Downloads"],
  ["review", "Reviews"],
  ["faq", "FAQs"],
];

export const FALLBACK_COURSES: { level: "+2" | "Bachelor" | "Master" | "all"; name: string; specialization: string; duration: string; type: string; fees: string; eligibility: string; seats: string }[] = [];

export const FALLBACK_ADMISSIONS: { level: "+2" | "Bachelor" | "Master" | "all"; status: string; title: string; affiliation: string; openDate: string; deadline: string; image?: string }[] = [];

export const FALLBACK_OFFERED_PROGRAMS: { level: "+2" | "Bachelor" | "Master" | "all"; name: string; affiliation: string; status: string }[] = [];

export const FALLBACK_SCHOLARSHIPS: { level: "+2" | "Bachelor" | "Master" | "all"; program: string; scholarship: string; benefit: string; audience: string }[] = [];

export const FALLBACK_FACILITIES: { icon: string; title: string; desc: string }[] = [];

export const FALLBACK_EVENTS: { image: string; title: string; date: string; desc: string }[] = [];

export const FALLBACK_ALUMNI: { image: string; name: string; role: string; batch: string }[] = [];

export const FALLBACK_GALLERY_IMAGES: string[] = [];

export const FALLBACK_NEWS_CARDS: { badge: string; badgeClass: string; image: string; title: string; desc: string; time: string }[] = [];

export const FALLBACK_DOWNLOADS: { title: string; size: string; color: string; btn: string }[] = [];
