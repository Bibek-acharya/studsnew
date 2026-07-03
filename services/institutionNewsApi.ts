const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("institutionToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiCall<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(getAuthHeaders() as Record<string, string>),
    ...((options.headers as Record<string, string>) || {}),
  };

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Unexpected response: ${text.substring(0, 100)}`);
  }

  if (!res.ok) {
    throw new Error(
      data?.message || data?.error || `Request failed (${res.status})`,
    );
  }

  return data?.data ?? data;
}

async function uploadFile(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${API_BASE_URL}/api/v1/institution/upload?folder=${encodeURIComponent(folder)}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    },
  );

  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  const rawUrl = data?.data?.url || data?.url || "";
  if (!rawUrl) return "";
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://"))
    return rawUrl;
  return `${API_BASE_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
}

export interface InstitutionNews {
  id: number;
  institution_id: number;
  title: string;
  short_desc: string;
  content: string;
  image_url: string | null;
  news_type: string;
  published_by: string;
  publish_date: string | null;
  tags: string[];
  allow_comments: boolean;
  status: string;
  published_at: string | null;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export const institutionNewsApi = {
  async list(
    page = 1,
    limit = 10,
  ): Promise<{
    news: InstitutionNews[];
    meta: { total: number; page: number; limit: number };
  }> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    }).toString();
    return apiCall(`/api/v1/institution/news?${params}`);
  },

  async getById(id: number): Promise<InstitutionNews> {
    return apiCall(`/api/v1/institution/news/${id}`);
  },

  async create(data: {
    title: string;
    short_desc?: string;
    content: string;
    image_url?: string;
    news_type?: string;
    published_by?: string;
    publish_date?: string;
    tags?: string[];
    allow_comments?: boolean;
    status?: string;
  }): Promise<InstitutionNews> {
    return apiCall("/api/v1/institution/news", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(
    id: number,
    data: {
      title: string;
      short_desc?: string;
      content: string;
      image_url?: string;
      news_type?: string;
      published_by?: string;
      publish_date?: string;
      tags?: string[];
      allow_comments?: boolean;
      status?: string;
    },
  ): Promise<InstitutionNews> {
    return apiCall(`/api/v1/institution/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    await apiCall(`/api/v1/institution/news/${id}`, { method: "DELETE" });
  },

  async uploadImage(file: File, folder: string): Promise<string> {
    return uploadFile(file, folder);
  },
};

export async function fetchInstitutionNewsBySlug(
  slug: string,
): Promise<InstitutionNews> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const res = await fetch(
    `${API_BASE}/api/v1/institutions/public/news/by-slug/${slug}`,
  );
  if (!res.ok) throw new Error("News not found");
  const data = await res.json();
  return data.data || data;
}
