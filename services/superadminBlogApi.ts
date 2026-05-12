import { apiRequest } from "./api";

export interface SuperAdminBlog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  read_time: string;
  featured: boolean;
  published: boolean;
  views: number;
  created_at: string;
}

export interface BlogMeta {
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

export const superadminBlogApi = {
  async list(params: { page?: number; limit?: number; category?: string; search?: string; sort?: string } = {}): Promise<{ blogs: SuperAdminBlog[]; meta: BlogMeta }> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    if (params.sort) query.set("sort", params.sort);
    const qs = query.toString();
    return extractData(apiRequest(`/api/v1/admin/blogs${qs ? "?" + qs : ""}`, { authToken: getSuperadminToken() ?? undefined }));
  },

  async getById(id: number): Promise<SuperAdminBlog> {
    return extractData(apiRequest(`/api/v1/admin/blogs/${id}`, { authToken: getSuperadminToken() ?? undefined }));
  },

  async create(data: {
    title: string;
    content: string;
    excerpt?: string;
    image?: string;
    author?: string;
    category?: string;
    tags?: string[];
    featured?: boolean;
    published?: boolean;
  }): Promise<SuperAdminBlog> {
    return extractData(apiRequest("/api/v1/admin/blogs", {
      method: "POST",
      body: JSON.stringify(data),
      authToken: getSuperadminToken() ?? undefined,
    }));
  },

  async update(id: number, data: {
    title?: string;
    content?: string;
    excerpt?: string;
    image?: string;
    author?: string;
    category?: string;
    tags?: string[];
    featured?: boolean;
    published?: boolean;
  }): Promise<SuperAdminBlog> {
    return extractData(apiRequest(`/api/v1/admin/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      authToken: getSuperadminToken() ?? undefined,
    }));
  },

  async delete(id: number): Promise<void> {
    await apiRequest(`/api/v1/admin/blogs/${id}`, {
      method: "DELETE",
      authToken: getSuperadminToken() ?? undefined,
    });
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);
    const res = await extractData<{ url?: string }>(apiRequest("/api/v1/admin/blogs/upload-image", {
      method: "POST",
      body: formData,
      authToken: getSuperadminToken() ?? undefined,
    }));
    const rawUrl = res?.url || "";
    if (!rawUrl) return "";
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) return rawUrl;
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return `${base}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
  },
};
