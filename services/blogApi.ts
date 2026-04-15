/**
 * Blog API Service
 * Handles all blog operations for both the public site and superadmin panel.
 * Falls back to local storage when the backend is unreachable.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const LOCAL_BLOGS_KEY = "studsphere_local_blogs";
const SUPERADMIN_STORAGE_KEY = "studsphere_superadmin_auth";

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

// ─── Local fallback data ─────────────────────────────────────────────────────

const SEED_BLOGS: BlogEntry[] = [
  {
    id: 1,
    title: "Important Notice: Revised Counseling Schedule for IOE Admission 2024",
    slug: "revised-counseling-schedule-ioe-2024",
    excerpt: "The Institute of Engineering (IOE) has announced a revised schedule for the upcoming counseling sessions.",
    content: "The Institute of Engineering (IOE) has officially announced a revised schedule for the counseling sessions related to the 2024 admission cycle.\n\nThe counseling process will now be conducted in multiple rounds to ensure a smooth and efficient seat allocation process.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    author: "Studsphere Team",
    category: "Admission",
    tags: ["IOE", "Admission", "Counseling"],
    read_time: "3 min",
    featured: true,
    published: true,
    views: 1240,
    created_at: "2024-10-25T10:00:00Z"
  },
  {
    id: 2,
    title: "Top 10 Scholarships for Nepalese Students in 2025",
    slug: "top-10-scholarships-nepal-2025",
    excerpt: "A comprehensive guide to the best scholarship opportunities available for Nepalese students.",
    content: "Studying abroad can be financially challenging, but numerous scholarships are available to support talented Nepalese students.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&w=1200&q=80",
    author: "Education Desk",
    category: "Scholarship",
    tags: ["Scholarship", "Study Abroad"],
    read_time: "5 min",
    featured: false,
    published: true,
    views: 890,
    created_at: "2024-11-02T10:00:00Z"
  },
  {
    id: 3,
    title: "How to Prepare for IOE Entrance Exam: A Complete Guide",
    slug: "prepare-ioe-entrance-exam-guide",
    excerpt: "Expert tips and strategies to crack the IOE entrance examination.",
    content: "The IOE entrance exam is one of the most competitive examinations in Nepal.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
    author: "Exam Prep Team",
    category: "Exams",
    tags: ["IOE", "Entrance", "Preparation"],
    read_time: "7 min",
    featured: false,
    published: true,
    views: 2100,
    created_at: "2024-11-10T10:00:00Z"
  },
  {
    id: 4,
    title: "Student Life at Kathmandu University: What to Expect",
    slug: "student-life-kathmandu-university",
    excerpt: "An inside look at campus life, extracurricular activities, and academic culture.",
    content: "Kathmandu University offers a vibrant campus life that goes beyond academics.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    author: "Campus Reporter",
    category: "Others",
    tags: ["KU", "Campus Life"],
    read_time: "4 min",
    featured: false,
    published: true,
    views: 560,
    created_at: "2024-12-01T10:00:00Z"
  },
];

// ─── Local storage helpers ───────────────────────────────────────────────────

function getLocalBlogs(): BlogEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_BLOGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  // Seed with defaults on first visit
  localStorage.setItem(LOCAL_BLOGS_KEY, JSON.stringify(SEED_BLOGS));
  return [...SEED_BLOGS];
}

function saveLocalBlogs(blogs: BlogEntry[]) {
  localStorage.setItem(LOCAL_BLOGS_KEY, JSON.stringify(blogs));
}

function getAdminToken(): string | null {
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
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);

  const result = await apiFetch<{ data: { blogs: BlogEntry[]; meta: BlogMeta } }>(
    `/api/v1/education/blogs?${query.toString()}`
  );

  if (result?.data) {
    return result.data;
  }

  // Offline fallback
  const allBlogs = getLocalBlogs().filter(b => b.published);
  const filtered = allBlogs.filter(b => {
    if (params.category && b.category !== params.category) return false;
    if (params.search && !b.title.toLowerCase().includes(params.search.toLowerCase())) return false;
    return true;
  });

  const page = params.page || 1;
  const limit = params.limit || 12;
  const start = (page - 1) * limit;

  return {
    blogs: filtered.slice(start, start + limit),
    meta: {
      total: filtered.length,
      page,
      limit,
      pages: Math.ceil(filtered.length / limit),
    },
  };
}

export async function fetchPublicBlogById(id: string): Promise<{ blog: BlogEntry; related: BlogEntry[] } | null> {
  const result = await apiFetch<{ data: { blog: BlogEntry; related: BlogEntry[] } }>(
    `/api/v1/education/blogs/${id}`
  );

  if (result?.data) {
    return result.data;
  }

  // Offline fallback
  const blogs = getLocalBlogs();
  const blog = blogs.find(b => String(b.id) === id && b.published);
  if (!blog) return null;

  const related = blogs.filter(b => b.id !== blog.id && b.category === blog.category && b.published).slice(0, 3);
  return { blog, related };
}

// ─── Admin API (used by superadmin blog management) ──────────────────────────

export async function fetchAdminBlogs(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
} = {}): Promise<{ blogs: BlogEntry[]; meta: BlogMeta }> {
  const token = getAdminToken();
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);

  const result = await apiFetch<{ data: { blogs: BlogEntry[]; meta: BlogMeta } }>(
    `/api/v1/superadmin/blogs?${query.toString()}`,
    {},
    token || undefined
  );

  if (result?.data) {
    return result.data;
  }

  // Offline fallback — admin sees ALL blogs (including drafts)
  const allBlogs = getLocalBlogs();
  const filtered = allBlogs.filter(b => {
    if (params.category && b.category !== params.category) return false;
    if (params.search && !b.title.toLowerCase().includes(params.search.toLowerCase())) return false;
    return true;
  });

  const page = params.page || 1;
  const limit = params.limit || 20;
  const start = (page - 1) * limit;

  return {
    blogs: filtered.slice(start, start + limit),
    meta: {
      total: filtered.length,
      page,
      limit,
      pages: Math.ceil(filtered.length / limit),
    },
  };
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
  const token = getAdminToken();

  const result = await apiFetch<{ data: BlogEntry }>(
    "/api/v1/superadmin/blogs",
    { method: "POST", body: JSON.stringify(data) },
    token || undefined
  );

  if (result?.data) {
    return result.data;
  }

  // Offline fallback
  const blogs = getLocalBlogs();
  const newBlog: BlogEntry = {
    id: Date.now(),
    title: data.title,
    slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80),
    excerpt: data.excerpt,
    content: data.content,
    image: data.image,
    author: data.author,
    category: data.category,
    tags: data.tags || [],
    read_time: `${Math.max(1, Math.ceil((data.content?.length || 0) / 1000))} min`,
    featured: data.featured || false,
    published: data.published !== undefined ? data.published : true,
    views: 0,
    created_at: new Date().toISOString(),
  };
  blogs.unshift(newBlog);
  saveLocalBlogs(blogs);
  return newBlog;
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
  const token = getAdminToken();

  const result = await apiFetch<{ data: BlogEntry }>(
    `/api/v1/superadmin/blogs/${id}`,
    { method: "PUT", body: JSON.stringify(data) },
    token || undefined
  );

  if (result?.data) {
    return result.data;
  }

  // Offline fallback
  const blogs = getLocalBlogs();
  const idx = blogs.findIndex(b => String(b.id) === id);
  if (idx === -1) throw new Error("Blog not found");

  blogs[idx] = { ...blogs[idx], ...data };
  saveLocalBlogs(blogs);
  return blogs[idx];
}

export async function deleteBlog(id: string): Promise<void> {
  const token = getAdminToken();

  const result = await apiFetch<{ message: string }>(
    `/api/v1/superadmin/blogs/${id}`,
    { method: "DELETE" },
    token || undefined
  );

  if (result) return;

  // Offline fallback
  const blogs = getLocalBlogs();
  const filtered = blogs.filter(b => String(b.id) !== id);
  saveLocalBlogs(filtered);
}
