import { Exam } from "@/components/entrance/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || data.error || "Request failed");
  }

  return response.json() as Promise<T>;
}

export interface EntranceFilters {
  search?: string;
  academicLevel?: string[];
  stream?: string[];
  status?: string[];
  sortBy?: string;
  location?: string;
  institutionType?: string[];
  province?: string[];
  district?: string[];
  localLevel?: string[];
  applicationFee?: string[];
  scholarship?: string[];
  gpa?: string[];
}

export interface EntrancesResponse {
  data: {
    entrances: Exam[];
    total: number;
    page: number;
    pageSize: number;
  };
  message?: string;
}

export interface EntranceFilterCountsResponse {
  data: {
    total: number;
    academic_level_counts: Record<string, number>;
    stream_counts: Record<string, number>;
    program_counts: Record<string, number>;
    university_counts: Record<string, number>;
    status_counts: Record<string, number>;
  };
}

export interface EntranceDetailsResponse {
  data: Exam;
}



export const entranceService = {
  async getEntrances(
    filters: EntranceFilters = {},
    page: number = 1,
    pageSize: number = 10
  ): Promise<EntrancesResponse> {
    try {
      return await apiRequest<EntrancesResponse>("/api/v1/entrances", {
        method: "POST",
        body: JSON.stringify({ ...filters, page, pageSize }),
      });
    } catch (error) {
      throw error;
    }
  },

  async getEntranceFilterCounts(): Promise<EntranceFilterCountsResponse> {
    try {
      return await apiRequest<EntranceFilterCountsResponse>("/api/v1/entrances/filter-counts");
    } catch (error) {
      throw error;
    }
  },

  async getEntranceById(id: string): Promise<EntranceDetailsResponse> {
    try {
      return await apiRequest<EntranceDetailsResponse>(`/api/v1/entrances/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // ─── Institution Entrance Management ─────────────────────────────────

  async createEntrance(data: {
    title: string;
    description: string;
    level: string;
    stream: string;
    date: string;
    deadline: string;
    status: string;
    location: string;
  }): Promise<{ data: { id: number }; message: string }> {
    const token = localStorage.getItem("token");
    return apiRequest<{ data: { id: number }; message: string }>("/api/v1/institution/entrances", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(data),
    });
  },

  async updateEntrance(id: string, data: {
    title?: string;
    description?: string;
    level?: string;
    stream?: string;
    date?: string;
    deadline?: string;
    status?: string;
    location?: string;
  }): Promise<{ data: { id: number }; message: string }> {
    const token = localStorage.getItem("token");
    return apiRequest<{ data: { id: number }; message: string }>(`/api/v1/institution/entrances/${id}`, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(data),
    });
  },

  async deleteEntrance(id: string): Promise<{ message: string }> {
    const token = localStorage.getItem("token");
    return apiRequest<{ message: string }>(`/api/v1/institution/entrances/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  async getMyEntrances(): Promise<{ data: { entrances: any[] }; message: string }> {
    const token = localStorage.getItem("token");
    return apiRequest<{ data: { entrances: any[] }; message: string }>("/api/v1/institution/entrances", {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};