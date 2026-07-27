import { apiRequest } from "./api";

export interface AdminNews {
  id: number;
  university_id?: number;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  source: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

function getSuperadminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("superadmin_token");
}

async function extractData<T>(promise: Promise<any>): Promise<T> {
  const res = await promise;
  if (res && typeof res === "object" && "data" in res) return res.data as T;
  return res as T;
}

export const adminNewsApi = {
  async list(
    params: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
      university_id?: number;
    } = {},
  ): Promise<{ news: AdminNews[]; meta: NewsMeta }> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    if (params.university_id) query.set("university_id", String(params.university_id));
    const qs = query.toString();
    return extractData(
      apiRequest(`/api/v1/admin/news${qs ? "?" + qs : ""}`, {
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
  },

  async getById(id: number): Promise<AdminNews> {
    return extractData(
      apiRequest(`/api/v1/admin/news/${id}`, {
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
  },

  async create(data: {
    title: string;
    category: string;
    content: string;
    excerpt?: string;
    image?: string;
    author?: string;
    date?: string;
    readTime?: string;
    source?: string;
    tags?: string[];
    published?: boolean;
    featured?: boolean;
  }): Promise<AdminNews> {
    return extractData(
      apiRequest("/api/v1/admin/news", {
        method: "POST",
        body: JSON.stringify(data),
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
  },

  async update(
    id: number,
    data: {
      title?: string;
      category?: string;
      content?: string;
      excerpt?: string;
      image?: string;
      author?: string;
      date?: string;
      readTime?: string;
      source?: string;
      tags?: string[];
      published?: boolean;
      featured?: boolean;
    },
  ): Promise<AdminNews> {
    return extractData(
      apiRequest(`/api/v1/admin/news/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
  },

  async delete(id: number): Promise<void> {
    await apiRequest(`/api/v1/admin/news/${id}`, {
      method: "DELETE",
      authToken: getSuperadminToken() ?? undefined,
    });
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);
    const res = await extractData<{ url?: string }>(
      apiRequest("/api/v1/admin/news/upload-image", {
        method: "POST",
        body: formData,
        authToken: getSuperadminToken() ?? undefined,
      }),
    );
    const rawUrl = res?.url || "";
    if (!rawUrl) return "";
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://"))
      return rawUrl;
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return `${base}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
  },
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface NewsComment {
  id: number;
  news_id: number;
  author: string;
  avatar: string;
  message: string;
  likes: number;
  time: string;
  created_at: string;
}

export async function fetchNewsComments(
  newsId: string,
): Promise<NewsComment[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/news/${newsId}/comments`);
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || json || [];
  } catch {
    return [];
  }
}

export async function postNewsComment(
  newsId: string,
  data: { author: string; avatar?: string; message: string },
): Promise<NewsComment | null> {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch(`${API_BASE_URL}/api/v1/news/${newsId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ ...data, news_id: Number(newsId) || 0 }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || json || null;
  } catch {
    return null;
  }
}

export async function fetchPublicNewsBySlug(slug: string): Promise<any> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const res = await fetch(`${API_BASE}/api/v1/education/news/by-slug/${slug}`);
  if (!res.ok) throw new Error("News not found");
  const data = await res.json();
  return data.data || data;
}
