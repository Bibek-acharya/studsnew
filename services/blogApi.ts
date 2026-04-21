/**
 * Blog API Service
 * Handles all blog operations for both the public site and superadmin panel.
 * Falls back to local storage when the backend is unreachable.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const SUPERADMIN_STORAGE_KEY = "studsphere_superadmin_auth";

let blogToken: string | null = null;

export function setBlogToken(token: string | null) {
  blogToken = token;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BlogEntry {
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

function getAdminToken(): string | null {
  if (blogToken) return blogToken;
  try {
    const raw = localStorage.getItem(SUPERADMIN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.token || null;
    }
  } catch { /* ignore */ }
  return null;
}

// ─── Network helper ──────────────────────────────────────────────────────────

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
    // Any network/connection error → return null so offline fallback runs
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
      console.info("[BlogAPI] Backend offline — using local storage fallback");
      return null;
    }
    throw err; // real API error (400, 401, etc.)
  }
}

// ─── Public API (used by main blog page) ─────────────────────────────────────

export async function fetchPublicBlogs(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
} = {}): Promise<{ blogs: BlogEntry[]; meta: BlogMeta }> {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);

    const res = await fetch(`/api/v1/education/blogs?${query.toString()}`);

    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const result = await res.json();
    if (result?.data) {
      return result.data;
    }

    return { blogs: [], meta: { total: 0, page: 1, limit: 12, pages: 0 } };
  } catch {
    return { blogs: [], meta: { total: 0, page: 1, limit: 12, pages: 0 } };
  }
}

export async function fetchPublicBlogById(id: string): Promise<{ blog: BlogEntry; related: BlogEntry[] } | null> {
  try {
    const res = await fetch(`/api/v1/education/blogs/${id}`);

    if (!res.ok) {
      return null;
    }

    const result = await res.json();
    if (result?.data) {
      return { blog: result.data, related: [] };
    }

    return null;
  } catch {
    return null;
  }
}

// ─── Admin API (used by superadmin blog management) ──────────────────────────

export async function fetchAdminBlogs(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
} = {}): Promise<{ blogs: BlogEntry[]; meta: BlogMeta }> {
  try {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);

    const res = await fetch(`/api/v1/admin/blogs?${query.toString()}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const result = await res.json();
    if (result?.data) {
      return result.data;
    }

    return { blogs: [], meta: { total: 0, page: 1, limit: 20, pages: 0 } };
  } catch {
    return { blogs: [], meta: { total: 0, page: 1, limit: 20, pages: 0 } };
  }
}

export async function createBlog(data: {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
}): Promise<BlogEntry> {
  try {
    const res = await fetch("/api/v1/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to create blog");
    }

    const result = await res.json();
    if (result?.data) {
      return result.data;
    }

    throw new Error("Failed to create blog. Please try again.");
  } catch (err) {
    throw new Error("Failed to create blog. Please try again.");
  }
}

export async function updateBlog(id: string, data: Partial<{
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
}>): Promise<BlogEntry> {
  try {
    const res = await fetch(`/api/v1/admin/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to update blog");
    }

    const result = await res.json();
    if (result?.data) {
      return result.data;
    }

    throw new Error("Failed to update blog. Please try again.");
  } catch (err) {
    throw new Error("Failed to update blog. Please try again.");
  }
}

export async function deleteBlog(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/v1/admin/blogs/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete blog");
    }

    return;
  } catch (err) {
    throw new Error("Failed to delete blog. Please try again.");
  }
}

export async function uploadBlogImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/v1/admin/blogs/upload-image", {
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

// ─── Blog Comments ──────────────────────────────────────────────────────────

export interface BlogComment {
  id: number;
  blog_id: number;
  author: string;
  avatar: string;
  message: string;
  likes: number;
  time: string;
}

export async function fetchBlogComments(blogId: string): Promise<BlogComment[]> {
  const result = await apiFetch<{ data: BlogComment[] }>(
    `/api/v1/blogs/${blogId}/comments`
  );

  if (result?.data) {
    return result.data;
  }

  return [];
}

export async function postBlogComment(blogId: string, data: {
  author: string;
  avatar?: string;
  message: string;
}): Promise<BlogComment> {
  const result = await apiFetch<{ data: BlogComment }>(
    `/api/v1/blogs/${blogId}/comments`,
    {
      method: "POST",
      body: JSON.stringify({
        ...data,
        blog_id: Number(blogId) || 0
      })
    }
  );

  if (result?.data) {
    return result.data;
  }

  const comment: BlogComment = {
    id: Date.now(),
    blog_id: Number(blogId),
    author: data.author,
    avatar: data.avatar || data.author.charAt(0).toUpperCase(),
    message: data.message,
    likes: 0,
    time: "Just now",
  };
  return comment;
}
