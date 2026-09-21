const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ─── Types ────────────────────────────────────────────────────────────────

export type MediaPressCategory =
  | "press_release"
  | "news"
  | "media_coverage"
  | string;

export interface MediaPressItem {
  id: number | string;
  title: string;
  slug: string;
  category: MediaPressCategory;
  summary: string;
  /** Rich HTML content from the admin — already trusted. */
  content: string;
  imageUrl: string;
  fileUrl: string;
  externalUrl: string;
  publishedAt: string;
  isPublished: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface MediaPressListResponse {
  items: MediaPressItem[];
  pagination: PaginationMeta;
  /** True when the API could not be reached (dev-tolerance). */
  unavailable?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

export function resolveMediaUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${API_BASE_URL}${url}`;
  return url;
}

export function mapRawMediaPress(raw: any): MediaPressItem {
  return {
    id: raw.id ?? "",
    title: raw.title || "Untitled",
    slug: raw.slug || "",
    category: raw.category || "news",
    summary: raw.summary || "",
    content: raw.content || "",
    imageUrl: resolveMediaUrl(raw.image_url || raw.imageUrl || ""),
    fileUrl: resolveMediaUrl(raw.file_url || raw.fileUrl || ""),
    externalUrl: raw.external_url || raw.externalUrl || "",
    publishedAt: raw.published_at || raw.publishedAt || "",
    isPublished: raw.is_published ?? true,
  };
}

/** Tolerates `{ data: [...] }`, `{ data: { data: [...] } }`, or a raw array. */
function normalizeList(json: any, fallbackLimit: number) {
  const payload = json?.data ?? json;
  const list: any[] = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.items)
        ? payload.items
        : [];

  const p = payload?.pagination ?? json?.pagination;
  const pagination: PaginationMeta = {
    page: Number(p?.page) || 1,
    limit: Number(p?.limit) || fallbackLimit,
    total: Number(p?.total ?? p?.totalItems) || list.length,
  };

  return { list, pagination };
}

// ─── Service ──────────────────────────────────────────────────────────────

export async function fetchMediaPressList(opts: {
  page?: number;
  limit?: number;
  category?: string;
  /** Pass a revalidate window for server-side (ISR) fetching. */
  revalidate?: number;
} = {}): Promise<MediaPressListResponse> {
  const { page = 1, limit = 9, category = "all", revalidate } = opts;

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (category && category !== "all") params.set("category", category);

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/media-press?${params.toString()}`,
      revalidate !== undefined
        ? { next: { revalidate } }
        : { cache: "no-store" },
    );
    if (!res.ok) throw new Error(`Request failed (${res.status})`);

    const json = await res.json();
    const { list, pagination } = normalizeList(json, limit);
    return {
      items: list.map(mapRawMediaPress),
      pagination,
      unavailable: false,
    };
  } catch {
    return {
      items: [],
      pagination: { page, limit, total: 0 },
      unavailable: true,
    };
  }
}

export async function fetchMediaPressById(
  id: number | string,
  opts: { revalidate?: number } = {},
): Promise<MediaPressItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/media-press/${id}`, {
      ...(opts.revalidate !== undefined
        ? { next: { revalidate: opts.revalidate } }
        : { cache: "no-store" }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const raw = json?.data ?? json;
    return raw ? mapRawMediaPress(raw) : null;
  } catch {
    return null;
  }
}

export const mediaPressService = {
  fetchMediaPressList,
  fetchMediaPressById,
};
