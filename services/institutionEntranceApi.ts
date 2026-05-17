const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("institutionToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiCall<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders() as Record<string, string>,
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, credentials: "include" });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { throw new Error(`Unexpected response: ${text.substring(0, 100)}`); }
  if (!res.ok) throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
  return data?.data ?? data;
}

export interface InstitutionEntrance {
  id: number;
  institution_id: number;
  title: string;
  description: string;
  program: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  total_marks: number;
  passing_marks: number;
  total_seats: number;
  filled_seats: number;
  instructions: string;
  hero_banner: string;
  questions: any;
  status: string;
  created_at: string;
  updated_at: string;
  application_fee: string;
  overview_details: any[];
  exam_date_schedules: any[];
  eligibility_list: any[];
  application_steps: any[];
  exam_pattern: any[];
  subject_marks: any[];
  model_sets: any[];
  upcoming_dates: any[];
  contact_persons: any[];
  faqs: any[];
}

export interface EntranceApplicant {
  id: number;
  entrance_id: number;
  user_id: number;
  status: string;
  score: number;
  rank: number;
  created_at: string;
}

export const institutionEntranceApi = {
  async list(page = 1, limit = 50, status?: string): Promise<{ entrances: InstitutionEntrance[]; meta: { total: number } }> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set("status", status);
    return apiCall(`/api/v1/institution/entrances?${params.toString()}`);
  },

  async getById(id: number): Promise<InstitutionEntrance> {
    return apiCall(`/api/v1/institution/entrances/${id}`);
  },

  async create(data: any): Promise<InstitutionEntrance> {
    return apiCall("/api/v1/institution/entrances", { method: "POST", body: JSON.stringify(data) });
  },

  async update(id: number, data: any): Promise<InstitutionEntrance> {
    return apiCall(`/api/v1/institution/entrances/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },

  async delete(id: number): Promise<void> {
    await apiCall(`/api/v1/institution/entrances/${id}`, { method: "DELETE" });
  },

  async getApplicants(entranceId: number): Promise<EntranceApplicant[]> {
    return apiCall(`/api/v1/institution/entrances/${entranceId}/applicants`);
  },
};
