const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("institutionToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function uploadFile(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/v1/institution/upload?folder=${encodeURIComponent(folder)}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  const rawUrl = data?.data?.url || data?.url || "";
  if (!rawUrl) return "";
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) return rawUrl;
  return `${API_BASE_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
}

async function apiCall<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders() as Record<string, string>,
    ...(options.headers as Record<string, string> || {}),
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
    throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
  }

  return data?.data ?? data;
}

export const institutionScholarshipApi = {
  uploadImage(file: File, folder: string): Promise<string> {
    return uploadFile(file, folder);
  },

  async getScholarshipById(id: number): Promise<any> {
    return apiCall(`/api/v1/institution/scholarships/${id}`);
  },

  async createScholarship(data: any): Promise<any> {
    return apiCall("/api/v1/institution/scholarships", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateScholarship(id: number, data: any): Promise<any> {
    return apiCall(`/api/v1/institution/scholarships/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
