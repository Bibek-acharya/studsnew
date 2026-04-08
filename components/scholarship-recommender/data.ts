import { RecommenderState, ScholarshipCardItem } from "./types";

export const initialRecommenderState: RecommenderState = {
  educationLevel: "",
  studyMode: "",
  academicScore: "",
  fieldOfStudy: "",
  willingEssay: "",
  willingInterview: "",
  willingGpa: "",
  province: "",
  district: "",
  studyLocation: "",
  category: "",
  gender: "",
  income: "",
  talents: [],
  achievements: [],
  involvement: [],
};

export const recommendations: ScholarshipCardItem[] = [
  {
    id: 1,
    title: "Grace LeGendre Fellowships",
    providerType: "Govt",
    coverage: "Full Coverage",
    deadline: "Feb 28, 2026",
    description:
      "For women pursuing graduate studies in NY state with strong academic standing and clear research intent.",
    tagColorClass: "bg-blue-600",
  },
  {
    id: 2,
    title: "Women's Overseas Service League",
    providerType: "NGO",
    coverage: "Partial",
    deadline: "Mar 01, 2026",
    description:
      "Supports women committed to military or public service pathways, with preference for demonstrated financial need.",
    tagColorClass: "bg-slate-800",
  },
  {
    id: 3,
    title: "BFWG Academic Award",
    providerType: "Intl",
    coverage: "Tuition Only",
    deadline: "Mar 06, 2026",
    description:
      "Designed for international female postgraduate applicants with high-impact academic and research profiles.",
    tagColorClass: "bg-emerald-600",
  },
  {
    id: 4,
    title: "Carmel Valley Women's Foundation",
    providerType: "College",
    coverage: "Partial",
    deadline: "Mar 15, 2026",
    description:
      "For female high school seniors with strong leadership records who plan to enroll in a 4-year college.",
    tagColorClass: "bg-purple-600",
  },
  {
    id: 5,
    title: "Rhode Island Commission Grant",
    providerType: "Govt",
    coverage: "Tuition Only",
    deadline: "Apr 14, 2026",
    description:
      "Assists adult women returning to study after a long academic break and meeting residency criteria.",
    tagColorClass: "bg-blue-600",
  },
  {
    id: 6,
    title: "Nondas Hurst Voll Scholarship",
    providerType: "NGO",
    coverage: "Hostel Only",
    deadline: "Apr 14, 2026",
    description:
      "Accommodation-focused scholarship for single mothers pursuing formal higher education tracks.",
    tagColorClass: "bg-slate-800",
  },
  {
    id: 7,
    title: "Women on Par Scholarship",
    providerType: "NGO",
    coverage: "Partial",
    deadline: "Apr 15, 2026",
    description:
      "For female student athletes in collegiate golf pathways; essay and participation evidence required.",
    tagColorClass: "bg-slate-800",
  },
  {
    id: 8,
    title: "YWCA Clark County Scholarship",
    providerType: "NGO",
    coverage: "Full Coverage",
    deadline: "Apr 15, 2026",
    description:
      "Supports learners overcoming adversity with grants that can cover tuition, books, and childcare expenses.",
    tagColorClass: "bg-slate-800",
  },
];
