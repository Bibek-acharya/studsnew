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

export interface StudyResourceCategory {
  slug: string;
  label: string;
  href: string;
  description: string;
  apiType: ApiStudyResourceType | null;
  /** Kept for metadata/robots only; the cards do not render a status badge. */
  status: StudyResourceCategoryStatus;
  render: StudyResourceCategoryRender;
  /** Which lucide icon represents the collection. */
  icon: StudyResourceCategoryIcon;
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
    icon: "notes",
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
    icon: "past-questions",
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
    icon: "model-questions",
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
    icon: "syllabus",
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
    icon: "video",
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
    icon: "mock-test",
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
