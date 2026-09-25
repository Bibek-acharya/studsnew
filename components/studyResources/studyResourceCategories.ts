import type { StudyResourceFilters } from "@/services/studyResourcesApi";
import {
  STUDY_RESOURCE_API_TYPES,
  STUDY_RESOURCE_DOCUMENT_TYPES,
  STUDY_RESOURCE_VIDEO_TYPE,
  type StudyResourceApiType,
} from "@/services/studyResourceTypes";

/** The four downloadable document types, in their original order. */
export const API_STUDY_RESOURCE_TYPES = STUDY_RESOURCE_DOCUMENT_TYPES;

/** Every type the study-resources API serves, documents plus video lectures. */
export const ALL_STUDY_RESOURCE_TYPES = STUDY_RESOURCE_API_TYPES;

export type ApiStudyResourceType = StudyResourceApiType;

export type StudyResourceCategoryStatus =
  | "available"
  | "coming-soon"
  | "planned";

/**
 * Which surface renders a category. `resources` is the shared document
 * catalog; the other two have their own dedicated screens.
 */
export type StudyResourceCategoryRender =
  | "resources"
  | "video-lectures"
  | "mock-tests";

export type StudyResourceCategoryIcon =
  | "notes"
  | "past-questions"
  | "model-questions"
  | "syllabus"
  | "video"
  | "mock-test";

export interface StudyResourceCategoryVisual {
  icon: StudyResourceCategoryIcon;
  number: string;
  accentClass: string;
  glowClass: string;
  hoverClass: string;
  topBorderClass: string;
  statusClass: string;
}

export interface StudyResourceCategory {
  slug: string;
  label: string;
  href: string;
  description: string;
  apiType: ApiStudyResourceType | null;
  status: StudyResourceCategoryStatus;
  render: StudyResourceCategoryRender;
  visual: StudyResourceCategoryVisual;
}

export const STUDY_RESOURCE_CATEGORIES = [
  {
    slug: "study-notes",
    label: "Study Notes",
    href: "/study-resources/study-notes",
    description:
      "Clear, course-wise notes that turn dense syllabus topics into easier revision.",
    apiType: "study-notes",
    status: "available",
    render: "resources",
    visual: {
      icon: "notes",
      number: "01",
      accentClass: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      glowClass: "bg-emerald-300/35",
      hoverClass: "hover:border-emerald-200 hover:shadow-emerald-100/80",
      topBorderClass: "from-emerald-400 to-teal-500",
      statusClass: "bg-emerald-50 text-emerald-700",
    },
  },
  {
    slug: "past-questions",
    label: "Past Questions",
    href: "/study-resources/past-questions",
    description:
      "Practice with previous exam papers and recognize the questions that repeat.",
    apiType: "past-questions",
    status: "available",
    render: "resources",
    visual: {
      icon: "past-questions",
      number: "02",
      accentClass: "bg-blue-50 text-blue-700 ring-blue-100",
      glowClass: "bg-blue-300/35",
      hoverClass: "hover:border-blue-200 hover:shadow-blue-100/80",
      topBorderClass: "from-blue-500 to-indigo-600",
      statusClass: "bg-blue-50 text-blue-700",
    },
  },
  {
    slug: "model-questions",
    label: "Model Questions",
    href: "/study-resources/model-questions",
    description:
      "Exam-style practice sets designed to test concepts and improve timing.",
    apiType: "model-questions",
    status: "available",
    render: "resources",
    visual: {
      icon: "model-questions",
      number: "03",
      accentClass: "bg-violet-50 text-violet-700 ring-violet-100",
      glowClass: "bg-violet-300/35",
      hoverClass: "hover:border-violet-200 hover:shadow-violet-100/80",
      topBorderClass: "from-violet-500 to-purple-600",
      statusClass: "bg-violet-50 text-violet-700",
    },
  },
  {
    slug: "syllabus",
    label: "Syllabus",
    href: "/study-resources/syllabus",
    description:
      "Find official course outlines and focus your preparation on every topic.",
    apiType: "syllabus",
    status: "available",
    render: "resources",
    visual: {
      icon: "syllabus",
      number: "04",
      accentClass: "bg-amber-50 text-amber-700 ring-amber-100",
      glowClass: "bg-amber-300/35",
      hoverClass: "hover:border-amber-200 hover:shadow-amber-100/80",
      topBorderClass: "from-amber-400 to-orange-500",
      statusClass: "bg-amber-50 text-amber-700",
    },
  },
  {
    slug: "video-lectures",
    label: "Video Lectures",
    href: "/study-resources/video-lectures",
    description:
      "Follow focused lessons and revisit difficult concepts at your own pace.",
    apiType: STUDY_RESOURCE_VIDEO_TYPE,
    status: "available",
    render: "video-lectures",
    visual: {
      icon: "video",
      number: "05",
      accentClass: "bg-rose-50 text-rose-700 ring-rose-100",
      glowClass: "bg-rose-300/35",
      hoverClass: "hover:border-rose-200 hover:shadow-rose-100/80",
      topBorderClass: "from-rose-400 to-pink-600",
      statusClass: "bg-rose-50 text-rose-700",
    },
  },
  {
    slug: "mock-test",
    label: "Mock Test",
    href: "/study-resources/mock-test",
    description:
      "Simulate exam conditions, check your score, and know what to improve next.",
    apiType: null,
    status: "available",
    render: "mock-tests",
    visual: {
      icon: "mock-test",
      number: "06",
      accentClass: "bg-cyan-50 text-cyan-700 ring-cyan-100",
      glowClass: "bg-cyan-300/35",
      hoverClass: "hover:border-cyan-200 hover:shadow-cyan-100/80",
      topBorderClass: "from-cyan-400 to-sky-600",
      statusClass: "bg-cyan-50 text-cyan-700",
    },
  },
] as const satisfies readonly StudyResourceCategory[];

export type StudyResourceCategorySlug =
  (typeof STUDY_RESOURCE_CATEGORIES)[number]["slug"];

/**
 * Filter options for the combined catalog, which lists every API-backed type —
 * documents and video lectures. Mock tests live in their own API, so they are
 * not filterable here.
 */
export const STUDY_RESOURCE_TYPE_OPTIONS = [
  { value: "", label: "All resource types" },
  ...ALL_STUDY_RESOURCE_TYPES.map((value) => ({
    value,
    label:
      STUDY_RESOURCE_CATEGORIES.find(
        (category) => category.apiType === value,
      )?.label ?? value,
  })),
] as const;

/** The category labels used by both public and superadmin type pickers. */
export const STUDY_RESOURCE_TYPE_LABELS: Record<string, string> =
  Object.fromEntries(
    STUDY_RESOURCE_CATEGORIES.filter(
      (category) => category.apiType !== null,
    ).map((category) => [category.apiType as string, category.label]),
  );

export function getStudyResourceCategory(
  slug: string,
): StudyResourceCategory | undefined {
  return STUDY_RESOURCE_CATEGORIES.find((category) => category.slug === slug);
}

export function requireStudyResourceCategory(
  slug: StudyResourceCategorySlug,
): StudyResourceCategory {
  const category = getStudyResourceCategory(slug);
  if (!category) {
    throw new Error(`Unknown study resource category: ${slug}`);
  }
  return category;
}

export function getStudyResourceCategoryByApiType(
  type: ApiStudyResourceType,
): StudyResourceCategory {
  const category = STUDY_RESOURCE_CATEGORIES.find(
    (item) => item.apiType === type,
  );
  if (!category) {
    throw new Error(`No study resource category for API type: ${type}`);
  }
  return category;
}

export function isApiStudyResourceType(
  value: string | undefined,
): value is ApiStudyResourceType {
  return ALL_STUDY_RESOURCE_TYPES.some((type) => type === value);
}

/** The surface that renders a category: the document catalog, videos, or tests. */
export function resolveCategoryRender(
  category: Pick<StudyResourceCategory, "render">,
): StudyResourceCategoryRender {
  return category.render;
}

/** The API type a route lock may pin, or undefined when the page is untyped. */
export function resolveLockedApiType(
  category: Pick<StudyResourceCategory, "apiType" | "render">,
): ApiStudyResourceType | undefined {
  if (category.render !== "resources") return undefined;
  return category.apiType ?? undefined;
}

/** A route lock always wins over any selector state. Unsupported values are dropped. */
export function resolveStudyResourceType(
  lockedType?: ApiStudyResourceType,
  selectedType?: string,
): ApiStudyResourceType | undefined {
  if (lockedType && isApiStudyResourceType(lockedType)) return lockedType;
  return isApiStudyResourceType(selectedType) ? selectedType : undefined;
}

export interface StudyResourceQueryInput {
  lockedType?: ApiStudyResourceType;
  selectedType?: string;
  query?: string;
  course?: string;
  year?: string;
  page: number;
  limit?: number;
}

export function buildStudyResourceFilters({
  lockedType,
  selectedType,
  query,
  course,
  year,
  page,
  limit = 20,
}: StudyResourceQueryInput): StudyResourceFilters {
  return {
    q: query?.trim() || undefined,
    type: resolveStudyResourceType(lockedType, selectedType),
    course: course?.trim() || undefined,
    year: year?.trim() || undefined,
    page,
    limit,
  };
}
