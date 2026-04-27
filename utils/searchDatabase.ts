export interface SearchItem {
  title: string;
  type: "College" | "University" | "Scholarship" | "Program" | "Course" | "Trending";
}

export interface CollegeCard {
  image: string;
  featured: boolean;
  title: string;
  verified: boolean;
  rating: number;
  institutionType: string;
  location: string;
  university: string;
  website: string;
  slug: string;
}

export interface CategoryData {
  title: string;
  description: string;
  related: string[];
  categories: string[];
  suggestions: string[];
  hasResults: boolean;
  cards?: CollegeCard[];
}

export const searchDatabase: SearchItem[] = [
  { title: "St. Xavier's College", type: "College" },
  { title: "Kathmandu University", type: "University" },
  { title: "Tribhuvan University", type: "University" },
  { title: "BIT at Islington College", type: "Program" },
  { title: "BSc CSIT", type: "Course" },
  { title: "CMAT Preparation Bootcamp", type: "Course" },
  { title: "MoE Merit Scholarship", type: "Scholarship" },
  { title: "Pokhara Engineering College", type: "College" },
  { title: "MBA at KUSOM", type: "Program" },
  { title: "Bharatpur Medical College", type: "College" },
  { title: "A-Level Science in Kathmandu", type: "Program" },
];

export const trendingSearches: SearchItem[] = [
  { title: "+2 science colleges", type: "Trending" },
  { title: "BIT colleges in Nepal", type: "Trending" },
  { title: "CMAT entrance preparation", type: "Trending" },
  { title: "MoE scholarships", type: "Trending" },
];

export const searchIcons: Record<string, string> = {
  Trending:
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18"></path><path d="M17 6h6v6"></path></svg>',
  College:
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>',
  University:
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 4l9 6.5"></path><path d="M5 10v9h14v-9"></path><path d="M9 19v-5h6v5"></path></svg>',
  Scholarship:
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>',
  Program:
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
  Course:
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a2.5 2.5 0 0 0 0 5H15a2.5 2.5 0 0 1 0 5H7"></path></svg>',
};

export const searchData: Record<string, CategoryData> = {
  colleges: {
    title: "Colleges",
    description: "Explore college listings, admission details, and student reviews",
    related: ["engineering", "medical", "business", "arts", "science", "law", "management", "pharmacy"],
    categories: ["Discover", "Engineering", "Medical", "Management", "Arts & Humanities", "Science", "Law", "Pharmacy"],
    suggestions: ["best colleges", "top engineering colleges", "medical colleges", "business schools", "law colleges", "arts colleges", "science colleges", "private colleges", "government colleges", "colleges near me"],
    hasResults: true,
    cards: [
      {
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
        featured: true,
        title: "St. Xavier's Secondary School",
        verified: true,
        rating: 4.7,
        institutionType: "Private",
        location: "Kathmandu",
        university: "Tribhuvan University",
        website: "sxc.edu.np",
        slug: "st-xaviers"
      },
      {
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
        featured: true,
        title: "Pokhara Plus Two Institute",
        verified: true,
        rating: 4.6,
        institutionType: "Private",
        location: "Kaski",
        university: "Pokhara University",
        website: "ppti.edu.np",
        slug: "pokhara-plus-two"
      },
      {
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
        featured: false,
        title: "Bharatpur Medical College",
        verified: true,
        rating: 4.5,
        institutionType: "Private",
        location: "Chitwan",
        university: "Tribhuvan University",
        website: "bmc.edu.np",
        slug: "bharatpur-medical"
      },
      {
        image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
        featured: false,
        title: "Kathmandu Valley School",
        verified: true,
        rating: 4.4,
        institutionType: "Public",
        location: "Lalitpur",
        university: "Kathmandu University",
        website: "kvs.edu.np",
        slug: "kathmandu-valley"
      },
    ]
  },
  courses: {
    title: "Courses",
    description: "Browse courses by subject, level, and institution",
    related: ["computer science", "business administration", "mechanical engineering", "mbbs", "mba", "data science", "ai & ml", "cybersecurity"],
    categories: ["All Courses", "Undergraduate", "Postgraduate", "Diploma", "Certificate", "Online", "Distance Learning"],
    suggestions: ["best courses", "popular courses", "online courses", "certificate courses", "diploma courses", "free courses", "professional courses"],
    hasResults: true
  },
  exams: {
    title: "Exams",
    description: "Find exam dates, syllabus, preparation resources and more",
    related: ["entrance exams", "competitive exams", "language proficiency", "graduate exams", "undergraduate exams"],
    categories: ["All Exams", "Entrance", "Graduate", "Language", "Certification", "Government Jobs"],
    suggestions: ["entrance exams", "ielts", "toefl", "gre", "gmat", "sat", "act", "jee", "neet", "upsc"],
    hasResults: true
  },
  scholarships: {
    title: "Scholarships",
    description: "Discover scholarships, grants, and financial aid opportunities",
    related: ["fully funded", "merit based", "need based", "international", "women scholarships", "sports quota"],
    categories: ["All Scholarships", "Merit Based", "Need Based", "International", "Government", "Private"],
    suggestions: ["scholarships 2026", "fully funded scholarships", "international scholarships", "scholarships for nepal", "merit scholarships", "sports scholarships"],
    hasResults: true
  },
  news: {
    title: "News & Blog",
    description: "Stay updated with our latest announcements and stories",
    related: ["education news", "exam updates", "admission news", "policy changes", "career guidance"],
    categories: ["All News", "Education", "Exams", "Admissions", "Career", "Policy"],
    suggestions: ["latest education news", "exam updates", "admission news", "career news", "university updates"],
    hasResults: true,
    cards: [
      {
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
        featured: true,
        title: "Education Fair 2026 Announced",
        verified: false,
        rating: 0,
        institutionType: "Event",
        location: "",
        university: "",
        website: "",
        slug: "education-fair-2026"
      },
      {
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
        featured: true,
        title: "New Scholarship Program Launched",
        verified: false,
        rating: 0,
        institutionType: "News",
        location: "",
        university: "",
        website: "",
        slug: "new-scholarship"
      },
    ]
  },
  events: {
    title: "Events",
    description: "Upcoming education fairs, webinars, workshops and more",
    related: ["education fairs", "webinars", "workshops", "career fairs", "college fests"],
    categories: ["All Events", "Fairs", "Webinars", "Workshops", "Conferences", "Career Fairs"],
    suggestions: ["education fairs", "career webinars", "college workshops", "upcoming events", "virtual events"],
    hasResults: true
  },
  blogs: {
    title: "Blogs",
    description: "Read expert articles, student experiences, and career guides",
    related: ["career guides", "study tips", "student life", "exam preparation", "college reviews"],
    categories: ["All Blogs", "Career", "Study Tips", "Student Life", "Reviews", "Guides"],
    suggestions: ["career blogs", "study tips", "exam preparation", "student experiences", "college life"],
    hasResults: true
  },
  reviews: {
    title: "Reviews",
    description: "Read honest reviews from students and alumni",
    related: ["college reviews", "course reviews", "professor reviews", "campus reviews", "placement reviews"],
    categories: ["All Reviews", "Colleges", "Courses", "Professors", "Campus", "Placements"],
    suggestions: ["college reviews", "course reviews", "student reviews", "alumni reviews", "campus reviews"],
    hasResults: true
  }
};

export const categoryMap: Record<string, string> = {
  college: "colleges",
  colleges: "colleges",
  course: "courses",
  courses: "courses",
  exam: "exams",
  exams: "exams",
  scholarship: "scholarships",
  scholarships: "scholarships",
  news: "news",
  events: "events",
  event: "events",
  blog: "blogs",
  blogs: "blogs",
  review: "reviews",
  reviews: "reviews",
};

export const dropdownCategoryMap: Record<string, string> = {
  All: "colleges",
  Colleges: "colleges",
  Courses: "courses",
  Exams: "exams",
  Scholarships: "scholarships",
  News: "news",
};

export const suggestionCategoryMap: Record<string, string> = {
  College: "colleges",
  Colleges: "colleges",
  Entrance: "exams",
  Scholarship: "scholarships",
  Scholarships: "scholarships",
  Events: "events",
  News: "news",
  Blogs: "blogs",
  Reviews: "reviews",
};
