import { InstitutionProgram, CourseApprovalRequest } from '@/types/course';

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
  if (!res.ok)
    throw new Error(
      data?.message || data?.error || `Request failed (${res.status})`,
    );
  return data?.data ?? data;
}

export const institutionProgramApi = {
  async list(page = 1, limit = 50): Promise<{ programs: InstitutionProgram[]; meta: { total: number } }> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    return apiCall(`/api/v1/institution/programs?${params}`);
  },

  async getById(id: number): Promise<InstitutionProgram> {
    return apiCall(`/api/v1/institution/programs/${id}`);
  },

  async create(data: any): Promise<InstitutionProgram> {
    return apiCall("/api/v1/institution/programs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: any): Promise<InstitutionProgram> {
    return apiCall(`/api/v1/institution/programs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    await apiCall(`/api/v1/institution/programs/${id}`, { method: "DELETE" });
  },
};

export const courseApprovalApi = {
  async list(page = 1, limit = 20): Promise<{ requests: CourseApprovalRequest[]; meta: { total: number } }> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    return apiCall(`/api/v1/institution/course-requests?${params}`);
  },

  async getById(id: number): Promise<CourseApprovalRequest> {
    return apiCall(`/api/v1/institution/course-requests/${id}`);
  },

  async create(data: any): Promise<CourseApprovalRequest> {
    return apiCall("/api/v1/institution/course-requests", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
