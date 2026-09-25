import { apiRequest } from "./api";
import { fetchCourses } from "./course-api";
import type { GlobalCourse } from "@/types/course";

export {
  STUDY_RESOURCE_API_TYPES,
  STUDY_RESOURCE_DOCUMENT_TYPES,
  STUDY_RESOURCE_VIDEO_TYPE,
  isVideoStudyResourceType,
} from "./studyResourceTypes";
export type { StudyResourceApiType } from "./studyResourceTypes";

import {
  STUDY_RESOURCE_VIDEO_TYPE,
  isVideoStudyResourceType,
} from "./studyResourceTypes";

export interface StudyResource {
  id: number;
  title: string;
  description: string;
  resource_type: string;
  course: string;
  year: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  downloads: number;
  created_at: string;
  /** Draft resources stay hidden from the public collections. */
  is_published?: boolean;
  /** Video lectures only: runtime in seconds. */
  duration_seconds?: number | null;
  /** Video lectures only: play counter. */
  views?: number;
}

export interface StudyResourceListEnvelope {
  page: number;
  limit: number;
  total: number;
  study_resources: StudyResource[];
  /** Aggregated year values from the backend, when provided. */
  years?: string[];
  /** Aggregated course values from the backend, when provided. */
  courses?: string[];
}

export interface StudyResourcesResponse {
  success: boolean;
  data?: StudyResourceListEnvelope;
  total?: number;
  page?: number;
  limit?: number;
}

export interface StudyResourceFilters {
  q?: string;
  type?: string;
  course?: string;
  year?: string;
  page?: number;
  limit?: number;
}

/** A normalized page of resources, safe to render without envelope guessing. */
export interface StudyResourcePage {
  items: StudyResource[];
  total: number;
  page: number;
  limit: number;
  years: string[];
  courses: string[];
}

export interface StudyResourceListOptions {
  /** ISR window, used only for public server-side fetches. */
  revalidate?: number;
}

/** Accept + size contract for the superadmin upload form, per resource type. */
export interface StudyResourceUploadRule {
  accept: string;
  maxBytes: number;
  maxLabel: string;
  /** Human hint rendered under the file input. */
  hint: string;
  /** Optional note, e.g. how the backend treats the uploaded file. */
  note?: string;
}

const DOCUMENT_UPLOAD_ACCEPT =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.zip,.rar,.7z,image/*";
// Kept in step with the backend's accepted source formats. Anything it can
// transcode is offered here, because the server normalizes the result.
const VIDEO_UPLOAD_ACCEPT =
  "video/mp4,video/webm,video/quicktime,video/x-m4v,video/x-msvideo,video/ogg," +
  ".mp4,.webm,.mov,.m4v,.mkv,.avi,.ogv";

const DOCUMENT_UPLOAD_RULE: StudyResourceUploadRule = {
  accept: DOCUMENT_UPLOAD_ACCEPT,
  maxBytes: 20 * 1024 * 1024,
  maxLabel: "20 MB",
  hint: "pdf, doc, ppt, xls, txt, csv, zip, images",
};

const VIDEO_UPLOAD_RULE: StudyResourceUploadRule = {
  accept: VIDEO_UPLOAD_ACCEPT,
  maxBytes: 200 * 1024 * 1024,
  maxLabel: "200 MB",
  hint: "mp4, webm, mov, m4v, mkv, avi",
  note: "Uploads are normalized to a cross-platform MP4 when possible, so the lecture plays on current desktop, iOS and Android players.",
};

/** Video uploads are far larger than documents, so the limit follows the type. */
export function getStudyResourceUploadRule(
  type: string | undefined,
): StudyResourceUploadRule {
  return isVideoStudyResourceType(type)
    ? VIDEO_UPLOAD_RULE
    : DOCUMENT_UPLOAD_RULE;
}

export interface StudyResourceUploadInput {
  file: File;
  title: string;
  type: string;
  course?: string;
  year?: string;
  description?: string;
  /** Video lectures only. */
  durationSeconds?: number | null;
  /** Video lectures only; omitted for documents (implicitly published). */
  isPublished?: boolean;
}

/**
 * Build the multipart body for POST /api/v1/admin/study-resources.
 * Empty optional fields are omitted so the backend keeps its defaults.
 */
export function buildStudyResourceUploadFormData(
  input: StudyResourceUploadInput,
): FormData {
  const form = new FormData();
  form.append("file", input.file);
  form.append("title", input.title.trim());
  form.append("type", input.type);
  if (input.course?.trim()) form.append("course", input.course.trim());
  if (input.year?.trim()) form.append("year", input.year.trim());
  if (input.description?.trim()) {
    form.append("description", input.description.trim());
  }
  if (isVideoStudyResourceType(input.type)) {
    const seconds = Number(input.durationSeconds);
    if (Number.isFinite(seconds) && seconds > 0) {
      form.append("duration_seconds", String(Math.round(seconds)));
    }
    if (typeof input.isPublished === "boolean") {
      form.append("is_published", String(input.isPublished));
    }
  }
  return form;
}

function buildStudyResourceQuery(params: StudyResourceFilters): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.type) search.set("type", params.type);
  if (params.course) search.set("course", params.course);
  if (params.year) search.set("year", params.year);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return `/api/v1/study-resources${qs ? `?${qs}` : ""}`;
}

/**
 * Flatten the list envelope (plus its two accepted shapes) into a page the UI
 * can render directly, including the year/course facet values.
 */
export function normalizeStudyResourceList(
  response: StudyResourcesResponse | StudyResourcePage | null | undefined,
): StudyResourcePage {
  if (!response) {
    return { items: [], total: 0, page: 1, limit: 20, years: [], courses: [] };
  }
  if (!("data" in response) && "items" in response) {
    return response;
  }
  const envelope = (response as StudyResourcesResponse).data;
  const items = Array.isArray(envelope?.study_resources)
    ? envelope.study_resources
    : [];
  const years = Array.isArray(envelope?.years) ? envelope.years : [];
  const courses = Array.isArray(envelope?.courses) ? envelope.courses : [];
  const total =
    envelope?.total ??
    (response as StudyResourcesResponse).total ??
    items.length;
  return {
    items,
    total,
    page: envelope?.page ?? 1,
    limit: envelope?.limit ?? items.length,
    years,
    courses,
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/** Query name the backend reads the short-lived playback token from. */
export const STUDY_RESOURCE_PLAYBACK_TOKEN_PARAM = "pt";

/**
 * Inline (non-attachment) stream for the <video> player.
 *
 * The short-lived playback token travels as a `pt` query parameter because a
 * <video src> request cannot carry an Authorization header. Only that token is
 * ever accepted here — the normal session JWT is never placed in a URL, and no
 * blob/object URL is used (the range requests a player needs would break).
 */
export function getStudyResourceStreamUrl(
  id: number | string,
  playbackToken?: string | null,
): string {
  const base = `${API_BASE_URL}/api/v1/study-resources/${id}/stream`;
  const token = playbackToken?.trim();
  if (!token) return base;
  return `${base}?${STUDY_RESOURCE_PLAYBACK_TOKEN_PARAM}=${encodeURIComponent(token)}`;
}

export function getStudyResourceDownloadUrl(id: number | string): string {
  return `${API_BASE_URL}/api/v1/study-resources/${id}/download`;
}

/** Short-lived credential the backend issues for one lecture's stream. */
export interface StudyResourcePlaybackToken {
  token: string;
  expires_at: string;
  /** Backend-provided stream path; informational, the player builds its own. */
  stream_url?: string;
}

/**
 * Outcome of asking for a playback token. A 401/403 is a normal outcome for a
 * signed-out visitor, not a failure — the player turns it into a login prompt.
 */
export type PlaybackAuthorization =
  | { status: "authorized"; token: StudyResourcePlaybackToken }
  | { status: "login-required"; message: string }
  | { status: "error"; message: string };

export interface PlaybackTokenOptions {
  /** Which stored session to authenticate as. Defaults to the user session. */
  session?: "user" | "superadmin";
}

const PLAYBACK_TOKEN_SKEW_MS = 5_000;

function readStoredToken(session: "user" | "superadmin"): string | undefined {
  if (typeof window === "undefined") return undefined;
  const key = session === "superadmin" ? "superadmin_token" : "token";
  return localStorage.getItem(key) ?? undefined;
}

/** A token is usable while it has not expired, allowing for clock skew. */
export function isPlaybackTokenFresh(
  expiresAt: string | null | undefined,
  nowMs: number = Date.now(),
  skewMs: number = PLAYBACK_TOKEN_SKEW_MS,
): boolean {
  if (!expiresAt) return false;
  const expiry = Date.parse(expiresAt);
  if (!Number.isFinite(expiry)) return false;
  return expiry - skewMs > nowMs;
}

function unwrapData(response: unknown): unknown {
  if (
    response &&
    typeof response === "object" &&
    !Array.isArray(response) &&
    "data" in (response as Record<string, unknown>)
  ) {
    return (response as { data: unknown }).data;
  }
  return response;
}

function parsePlaybackToken(raw: unknown): PlaybackAuthorization {
  const payload = (unwrapData(raw) ?? {}) as Record<string, unknown>;
  const token = typeof payload.token === "string" ? payload.token.trim() : "";
  if (!token) {
    return {
      status: "error",
      message: "The playback token came back empty. Please try again.",
    };
  }
  const expiresAt =
    typeof payload.expires_at === "string" ? payload.expires_at : "";
  if (!isPlaybackTokenFresh(expiresAt)) {
    return {
      status: "error",
      message: "That playback link had already expired. Please try again.",
    };
  }
  return {
    status: "authorized",
    token: {
      token,
      expires_at: expiresAt,
      stream_url:
        typeof payload.stream_url === "string" ? payload.stream_url : undefined,
    },
  };
}

/**
 * Ask the backend for a playback token. The session JWT travels in the
 * Authorization header via apiRequest, and an expected 401 is reported as a
 * login-required result instead of tripping the global auth-expired handler.
 */
export async function requestStudyResourcePlaybackToken(
  id: number | string,
  options: PlaybackTokenOptions = {},
): Promise<PlaybackAuthorization> {
  const session = options.session ?? "user";
  try {
    const response = await apiRequest<unknown>(
      `/api/v1/study-resources/${id}/playback-token`,
      {
        method: "GET",
        authToken: readStoredToken(session),
        suppressAuthExpired: true,
      },
    );
    return parsePlaybackToken(response);
  } catch (error) {
    const status = (error as { status?: number })?.status;
    if (status === 401 || status === 403) {
      return {
        status: "login-required",
        message: "Log in to watch this lecture.",
      };
    }
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Could not prepare this lecture for playback.",
    };
  }
}

export const studyResourcesApi = {
  async listStudyResources(
    params: StudyResourceFilters = {},
  ): Promise<StudyResourcesResponse> {
    return apiRequest<StudyResourcesResponse>(
      buildStudyResourceQuery(params),
    );
  },

  /**
   * Public video-lecture collection. Server callers pass `revalidate` so the
   * list is cached; client callers omit it and always hit the API.
   */
  async listVideoLectures(
    params: StudyResourceFilters = {},
    options: StudyResourceListOptions = {},
  ): Promise<StudyResourcePage> {
    const path = buildStudyResourceQuery({
      ...params,
      type: STUDY_RESOURCE_VIDEO_TYPE,
    });
    const response =
      options.revalidate !== undefined
        ? await apiRequest<StudyResourcesResponse>(path, {
            next: { revalidate: options.revalidate },
          })
        : await apiRequest<StudyResourcesResponse>(path);
    return normalizeStudyResourceList(response);
  },

  async getStudyResource(id: number | string): Promise<StudyResource> {
    const res = await apiRequest<unknown>(`/api/v1/study-resources/${id}`);
    const payload = res as { data?: StudyResource } | StudyResource;
    if (payload && typeof payload === "object" && "data" in payload) {
      return (payload as { data: StudyResource }).data;
    }
    return payload as StudyResource;
  },

  /** Authorize playback of one lecture; a 401 comes back as login-required. */
  requestPlaybackToken: requestStudyResourcePlaybackToken,

  /** Distinct course names for filter/dropdowns, from one shared source. */
  async listCourseOptions(): Promise<string[]> {
    // Preferred: existing courses service.
    try {
      const result = await fetchCourses({ limit: 100 });
      const courses: GlobalCourse[] = Array.isArray(result)
        ? result
        : result.courses ?? [];
      const names = courses
        .map((c) => c.title || (c as unknown as { name?: string }).name || "")
        .map((n) => n.trim())
        .filter(Boolean);
      if (names.length > 0) return Array.from(new Set(names)).sort();
    } catch {
      // Fall through to the simple endpoint below.
    }
    const res = await apiRequest<unknown>("/api/v1/courses/simple");
    const payload = Array.isArray(res)
      ? res
      : (res as { data?: unknown }).data ?? [];
    const items = Array.isArray(payload) ? payload : [];
    const names = items
      .map(
        (item: unknown) =>
          typeof item === "string"
            ? item
            : (item as { name?: string; title?: string })?.name ||
              (item as { title?: string })?.title ||
              "",
      )
      .map((n: string) => n.trim())
      .filter(Boolean);
    return Array.from(new Set(names)).sort();
  },

  // ─── Admin (superadmin) ─────────────────────────────────────────────────────

  async createStudyResource(form: FormData): Promise<StudyResource> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("superadmin_token")
        : null;
    return apiRequest<StudyResource>("/api/v1/admin/study-resources", {
      method: "POST",
      body: form,
      authToken: token ?? undefined,
    });
  },

  async adminListStudyResources(): Promise<StudyResource[]> {
    const res = await apiRequest<{
      data?: { study_resources?: StudyResource[] } | StudyResource[];
    }>("/api/v1/admin/study-resources", {
      authToken:
        (typeof window !== "undefined"
          ? localStorage.getItem("superadmin_token")
          : null) ?? undefined,
    });
    if (Array.isArray(res)) return res;
    return (res as { data?: { study_resources?: StudyResource[] } })
      .data?.study_resources ?? [];
  },

  async updateStudyResource(
    id: number,
    data: Partial<
      Pick<
        StudyResource,
        | "title"
        | "resource_type"
        | "course"
        | "year"
        | "description"
        // Video lectures: publish state and runtime.
        | "is_published"
        | "duration_seconds"
      >
    >,
  ): Promise<StudyResource> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("superadmin_token")
        : null;
    return apiRequest<StudyResource>(`/api/v1/admin/study-resources/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      authToken: token ?? undefined,
    });
  },

  /** Replace the file of an existing resource (metadata already saved via PUT). */
  async replaceStudyResourceFile(
    id: number,
    form: FormData,
  ): Promise<StudyResource> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("superadmin_token")
        : null;
    return apiRequest<StudyResource>(
      `/api/v1/admin/study-resources/${id}/file`,
      {
        method: "POST",
        body: form,
        authToken: token ?? undefined,
      },
    );
  },

  async deleteStudyResource(id: number): Promise<void> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("superadmin_token")
        : null;
    await apiRequest(`/api/v1/admin/study-resources/${id}`, {
      method: "DELETE",
      authToken: token ?? undefined,
    });
  },
};
