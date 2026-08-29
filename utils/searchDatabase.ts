export interface SearchItem {
  title: string;
  type: string;
}

export const trendingSearches: SearchItem[] = [
  { title: "+2 science colleges", type: "Trending" },
  { title: "BIT colleges in Nepal", type: "Trending" },
  { title: "CMAT entrance preparation", type: "Trending" },
  { title: "MoE scholarships", type: "Trending" },
];

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
  university: "universities",
  universities: "universities",
  admission: "admissions",
  admissions: "admissions",
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
  University: "universities",
  Universities: "universities",
  Admission: "admissions",
  Admissions: "admissions",
};
