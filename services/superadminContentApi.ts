const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getSuperadminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("superadmin_token");
}

/**
 * Fetch helper for superadmin content endpoints (media-press, downloads).
 * Unlike superadminFetch, this returns the raw parsed JSON body so callers
 * can unwrap list envelopes ({ data: [...], pagination }) themselves.
 * Multipart requests are supported (no forced Content-Type header).
 */
async function contentFetch(
  path: string,
  options: RequestInit = {},
): Promise<any> {
  const token = getSuperadminToken();
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  if (res.status === 401 || res.status === 403)
    throw new Error("auth_required");
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Unexpected response: ${text.substring(0, 100)}`);
  }
  if (!res.ok)
    throw new Error(
      data?.message || data?.error || `Request failed (${res.status})`,
    );
  return data;
}

const unwrap = (payload: any) => payload?.data ?? payload;

const extractList = (payload: any): { items: any[]; pagination: any } => {
  if (Array.isArray(payload)) return { items: payload, pagination: null };
  if (Array.isArray(payload?.data))
    return { items: payload.data, pagination: payload.pagination ?? null };
  if (Array.isArray(payload?.items))
    return { items: payload.items, pagination: payload.pagination ?? null };
  return { items: [], pagination: null };
};

export interface ContentListParams {
  page?: number;
  limit?: number;
  category?: string;
}

export const superadminPressApi = {
  async list(
    params: ContentListParams = {},
  ): Promise<{ items: any[]; pagination: any }> {
    const search = new URLSearchParams();
    if (params.page !== undefined) search.set("page", String(params.page));
    if (params.limit !== undefined) search.set("limit", String(params.limit));
    if (params.category) search.set("category", params.category);
    const qs = search.toString();
    return extractList(
      await contentFetch(`/api/v1/superadmin/media-press${qs ? `?${qs}` : ""}`),
    );
  },

  async getById(id: number): Promise<any> {
    return unwrap(await contentFetch(`/api/v1/superadmin/media-press/${id}`));
  },

  async create(payload: Record<string, any>): Promise<any> {
    return unwrap(
      await contentFetch("/api/v1/superadmin/media-press", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
  },

  async update(id: number, payload: Record<string, any>): Promise<any> {
    return unwrap(
      await contentFetch(`/api/v1/superadmin/media-press/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
  },

  async delete(id: number): Promise<void> {
    await contentFetch(`/api/v1/superadmin/media-press/${id}`, {
      method: "DELETE",
    });
  },

  /** Upload an image for a press item (multipart field "file"). Returns image_url. */
  async uploadImage(id: number, file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await contentFetch(`/api/v1/superadmin/media-press/${id}/image`, {
      method: "POST",
      body: formData,
    });
    return res?.data?.image_url ?? res?.image_url ?? "";
  },
};

export const superadminDownloadsApi = {
  async list(
    params: ContentListParams = {},
  ): Promise<{ items: any[]; pagination: any }> {
    const search = new URLSearchParams();
    if (params.page !== undefined) search.set("page", String(params.page));
    if (params.limit !== undefined) search.set("limit", String(params.limit));
    if (params.category) search.set("category", params.category);
    const qs = search.toString();
    return extractList(
      await contentFetch(`/api/v1/superadmin/downloads${qs ? `?${qs}` : ""}`),
    );
  },

  async getById(id: number): Promise<any> {
    return unwrap(await contentFetch(`/api/v1/superadmin/downloads/${id}`));
  },

  /** Create a download item. FormData must include the document in field "file". */
  async create(formData: FormData): Promise<any> {
    return unwrap(
      await contentFetch("/api/v1/superadmin/downloads", {
        method: "POST",
        body: formData,
      }),
    );
  },

  /** Update metadata; include an optional "file" field to replace the document. */
  async update(id: number, formData: FormData): Promise<any> {
    return unwrap(
      await contentFetch(`/api/v1/superadmin/downloads/${id}`, {
        method: "PUT",
        body: formData,
      }),
    );
  },

  async delete(id: number): Promise<void> {
    await contentFetch(`/api/v1/superadmin/downloads/${id}`, {
      method: "DELETE",
    });
  },
};
