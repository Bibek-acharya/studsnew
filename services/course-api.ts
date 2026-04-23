/**
 * Course API Service
 * Handles all course-related operations for the course finder.
 * Uses backend API with local storage fallback.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  shortTitle?: string;
  colleges: number;
  affiliation: string;
  badges: string[];
  level: string;
  field: string;
  duration: string;
  estFee: string;
  highlights: string[];
  careerPath: string;
  description: string;
  location?: string;
  govtFee?: string;
  privateFee?: string;
}

export interface CourseDetails extends Course {
  mode?: string;
  degreeLabel?: string;
  about?: string[];
  curriculum?: any[];
  admissions?: any[];
  careers?: string[];
}

export interface CourseMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CourseFilterCounts {
  level_counts: Record<string, number>;
  field_counts: Record<string, number>;
  affiliation_counts: Record<string, number>;
  total: number;
}

// ─── Local storage helpers ─────────────────────────────────────────────

const LOCAL_COURSES_KEY = "studsphere_local_courses";

interface LocalCourse {
  id: number;
  title: string;
  level: string;
  field: string;
  affiliation: string;
  colleges: number;
}

const SEED_COURSES: LocalCourse[] = [
  { id: 1, title: "Science (+2)", level: "+2 (Plus Two)", field: "Science", affiliation: "NEB", colleges: 145 },
  { id: 2, title: "Management (+2)", level: "+2 (Plus Two)", field: "Management", affiliation: "NEB", colleges: 210 },
  { id: 3, title: "A Level Science", level: "A Level", field: "Science", affiliation: "Cambridge", colleges: 25 },
  { id: 4, title: "Diploma in Civil Engineering", level: "Diploma", field: "Engineering", affiliation: "CTEVT", colleges: 45 },
  { id: 5, title: "MBA", level: "Masters", field: "Management", affiliation: "Tribhuvan University", colleges: 12 },
  { id: 6, title: "Humanities (+2)", level: "+2 (Plus Two)", field: "Humanities", affiliation: "NEB", colleges: 85 },
];

function getLocalCourses(): LocalCourse[] {
  try {
    const raw = localStorage.getItem(LOCAL_COURSES_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(SEED_COURSES));
  return [...SEED_COURSES];
}

function saveLocalCourses(courses: LocalCourse[]) {
  localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(courses));
}

// ─── Network helper ────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || data.error || "Request failed");
    }

    return (await res.json()) as T;
  } catch (err: any) {
    const msg = (err?.message || "").toLowerCase();
    if (
      err.name === "TypeError" ||
      err.name === "AbortError" ||
      msg.includes("failed to fetch") ||
      msg.includes("networkerror") ||
      msg.includes("network")
    ) {
      console.info("[CourseAPI] Backend offline — using local fallback");
      return null;
    }
    throw err;
  }
}

// ─── Public API ────────────────────────────────────────────────────────────────

export interface CourseListParams {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  field?: string;
  affiliation?: string;
  sort?: string;
}

export async function fetchCourses(params: CourseListParams = {}): Promise<{ courses: Course[]; meta: CourseMeta }> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.level) query.set("level", params.level);
  if (params.field) query.set("field", params.field);
  if (params.affiliation) query.set("affiliation", params.affiliation);

  const result = await apiFetch<{ data: { courses: Course[]; meta: CourseMeta } }>(
    `/api/v1/education/courses?${query.toString()}`
  );

  if (result?.data) {
    return result.data;
  }

  // Offline fallback
  const allCourses = getLocalCourses();
  const filtered = allCourses.filter(c => {
    if (params.level && c.level !== params.level) return false;
    if (params.field && c.field !== params.field) return false;
    if (params.affiliation && c.affiliation !== params.affiliation) return false;
    if (params.search && !c.title.toLowerCase().includes(params.search.toLowerCase())) return false;
    return true;
  });

  const page = params.page || 1;
  const limit = params.limit || 12;
  const start = (page - 1) * limit;

  return {
    courses: filtered.slice(start, start + limit).map(c => ({
      id: String(c.id),
      title: c.title,
      level: c.level,
      field: c.field,
      affiliation: c.affiliation,
      colleges: c.colleges,
      duration: "",
      estFee: "N/A",
      badges: [],
      highlights: [],
      careerPath: "",
      description: "",
    })),
    meta: {
      total: filtered.length,
      page,
      limit,
      pages: Math.ceil(filtered.length / limit),
    },
  };
}

export async function fetchCourseById(id: string): Promise<CourseDetails | null> {
  const result = await apiFetch<{ data: CourseDetails }>(
    `/api/v1/education/courses/${id}`
  );

  if (result?.data) {
    return result.data;
  }

  // Offline fallback
  const courses = getLocalCourses();
  const course = courses.find(c => String(c.id) === id);
  if (!course) return null;

  return {
    id: String(course.id),
    title: course.title,
    level: course.level,
    field: course.field,
    affiliation: course.affiliation,
    colleges: course.colleges,
    duration: "",
    estFee: "N/A",
    badges: [],
    highlights: [],
    careerPath: "",
    description: "",
  };
}

export async function fetchCourseFilterCounts(): Promise<CourseFilterCounts> {
  const result = await apiFetch<{ data: CourseFilterCounts }>(
    "/api/v1/education/courses/filter-counts"
  );

  if (result?.data) {
    return result.data;
  }

  // Offline fallback
  const courses = getLocalCourses();
  const levelCounts: Record<string, number> = {};
  const fieldCounts: Record<string, number> = {};
  const affilCounts: Record<string, number> = {};

  for (const c of courses) {
    levelCounts[c.level] = (levelCounts[c.level] || 0) + 1;
    fieldCounts[c.field] = (fieldCounts[c.field] || 0) + 1;
    affilCounts[c.affiliation] = (affilCounts[c.affiliation] || 0) + 1;
  }

  return {
    level_counts: levelCounts,
    field_counts: fieldCounts,
    affiliation_counts: affilCounts,
    total: courses.length,
  };
}