const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const SUPERADMIN_STORAGE_KEY = "studsphere_superadmin_auth";

let newsToken: string | null = null;

export function setNewsToken(token: string | null) {
  newsToken = token;
}

export interface NewsEntry {
  id: number;
  title: string;
  slug: string;
  desc: string;
  content?: string;
  image: string;
  author: string;
  category: string;
  status: string;
  views: number;
  date: string;
  deadline: string;
  created: string;
  featured: boolean;
  tags: string[];
  targetAudience: string[];
  branch: string;
}

export interface NewsMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

function getAdminToken(): string | null {
  if (newsToken) return newsToken;
  try {
    const raw = localStorage.getItem(SUPERADMIN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.token || null;
    }
  } catch { /* ignore */ }
  return null;
}

async function apiFetch<T>(path: string, options: RequestInit = {}, token?: string): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
      msg.includes("network") ||
      msg.includes("abort") ||
      msg.includes("err_connection")
    ) {
      console.info("[NewsAPI] Backend offline — using local storage fallback");
      return null;
    }
    throw err;
  }
}

export async function fetchAdminNews(params: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
} = {}): Promise<{ news: NewsEntry[]; meta: NewsMeta }> {
  try {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);

    const res = await fetch(`/api/v1/admin/news?${query.toString()}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch news");
    }

    const result = await res.json();
    if (result?.data) {
      return result.data;
    }

    return { news: [], meta: { total: 0, page: 1, limit: 20, pages: 0 } };
  } catch {
    return { news: [], meta: { total: 0, page: 1, limit: 20, pages: 0 } };
  }
}

export async function createNews(data: {
  title: string;
  slug: string;
  desc: string;
  content?: string;
  image: string;
  author: string;
  category: string;
  status?: string;
  featured?: boolean;
  date?: string;
  deadline?: string;
  tags?: string[];
  targetAudience?: string[];
  branch?: string;
}): Promise<NewsEntry> {
  try {
    const res = await fetch("/api/v1/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to create news");
    }

    const result = await res.json();
    if (result?.data) {
      return result.data;
    }

    throw new Error("Failed to create news. Please try again.");
  } catch (err) {
    throw new Error("Failed to create news. Please try again.");
  }
}

export async function updateNews(id: string, data: Partial<{
  title: string;
  slug: string;
  desc: string;
  content: string;
  image: string;
  author: string;
  category: string;
  status: string;
  featured: boolean;
  date: string;
  deadline: string;
  tags: string[];
  targetAudience: string[];
  branch: string;
}>): Promise<NewsEntry> {
  try {
    const res = await fetch(`/api/v1/admin/news/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to update news");
    }

    const result = await res.json();
    if (result?.data) {
      return result.data;
    }

    throw new Error("Failed to update news. Please try again.");
  } catch (err) {
    throw new Error("Failed to update news. Please try again.");
  }
}

export async function deleteNews(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/v1/admin/news/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete news");
    }

    return;
  } catch (err) {
    throw new Error("Failed to delete news. Please try again.");
  }
}

export async function uploadNewsImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/v1/admin/news/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Upload failed");
    }

    const data = await res.json();
    return data.data.url;
  } catch (err) {
    throw new Error("Failed to upload image");
  }
}