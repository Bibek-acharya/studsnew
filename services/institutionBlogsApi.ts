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

export interface InstitutionBlog {
  id: number;
  institution_id: number;
  title: string;
  content: string;
  image: string;
  excerpt: string;
  category: string;
  read_time?: string;
  tags?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const institutionBlogsApi = {
  async list(
    page = 1,
    limit = 10,
  ): Promise<{
    blogs: InstitutionBlog[];
    meta: { total: number; page: number; limit: number };
  }> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    }).toString();
    return apiCall(`/api/v1/institution/blogs?${params}`);
  },

  async getById(id: number): Promise<InstitutionBlog> {
    return apiCall(`/api/v1/institution/blogs/${id}`);
  },

  async create(data: {
    title: string;
    content: string;
    image?: string;
    excerpt?: string;
    category?: string;
    read_time?: string;
    tags?: string;
  }): Promise<InstitutionBlog> {
    return apiCall("/api/v1/institution/blogs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(
    id: number,
    data: {
      title?: string;
      content?: string;
      image?: string;
      excerpt?: string;
      category?: string;
      read_time?: string;
      tags?: string;
    },
  ): Promise<InstitutionBlog> {
    return apiCall(`/api/v1/institution/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    await apiCall(`/api/v1/institution/blogs/${id}`, { method: "DELETE" });
  },

  async uploadImage(file: File, folder: string): Promise<string> {
    return uploadFile(file, folder);
  },
};
