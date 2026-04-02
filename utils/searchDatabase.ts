export interface SearchItem {
  title: string;
  type: "College" | "University" | "Scholarship" | "Program" | "Course" | "Trending";
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
