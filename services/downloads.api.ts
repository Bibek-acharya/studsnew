const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ─── Types ────────────────────────────────────────────────────────────────

export interface DownloadItem {
  id: number | string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  downloadCount: number;
  publishedAt: string;
}

export interface DownloadListResponse {
  items: DownloadItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  /** True when the API could not be reached (dev-tolerance). */
  unavailable?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

export function resolveDownloadUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${API_BASE_URL}${url}`;
  return url;
}

/** Absolute endpoint that streams the file for a given download id. */
export function getDownloadEndpoint(id: number | string): string {
  return `${API_BASE_URL}/api/v1/downloads/${id}/download`;
}

export function mapRawDownload(raw: any): DownloadItem {
  return {
    id: raw.id ?? "",
    title: raw.title || "Untitled file",
    description: raw.description || "",
    category: raw.category || "",
    fileUrl: resolveDownloadUrl(raw.file_url || raw.fileUrl || ""),
    fileName: raw.file_name || raw.fileName || "",
    fileSize: Number(raw.file_size ?? raw.fileSize ?? 0),
    mimeType: raw.mime_type || raw.mimeType || "",
    downloadCount: Number(raw.download_count ?? raw.downloadCount ?? 0),
    publishedAt: raw.published_at || raw.publishedAt || "",
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
  const pagination = {
    page: Number(p?.page) || 1,
    limit: Number(p?.limit) || fallbackLimit,
    total: Number(p?.total ?? p?.totalItems) || list.length,
  };

  return { list, pagination };
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb % 1 === 0 ? kb : kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb % 1 === 0 ? mb : mb.toFixed(1)} MB`;
}

// ─── Service ──────────────────────────────────────────────────────────────

export async function fetchDownloadsList(opts: {
  page?: number;
  limit?: number;
  category?: string;
  /** Pass a revalidate window for server-side (ISR) fetching. */
  revalidate?: number;
} = {}): Promise<DownloadListResponse> {
  const { page = 1, limit = 9, category = "all", revalidate } = opts;

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (category && category !== "all") params.set("category", category);

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/downloads?${params.toString()}`,
      revalidate !== undefined
        ? { next: { revalidate } }
        : { cache: "no-store" },
    );
    if (!res.ok) throw new Error(`Request failed (${res.status})`);

    const json = await res.json();
    const { list, pagination } = normalizeList(json, limit);
    return {
      items: list.map(mapRawDownload),
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

export const downloadsService = {
  fetchDownloadsList,
};
