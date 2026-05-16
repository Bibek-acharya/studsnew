const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("institutionToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiCall<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeaders() as Record<string, string>, ...(options.headers as Record<string, string> || {}) };
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, credentials: "include" });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { throw new Error(`Unexpected response: ${text.substring(0, 100)}`); }
  if (!res.ok) throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
  return data?.data ?? data;
}

export interface CounsellingSession {
  id: number;
  institution_id: number;
  title: string;
  description: string;
  scheduled_at: string;
  duration: number;
  max_seats: number;
  booked_seats: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CounsellingBooking {
  id: number;
  session_id: number;
  user_id: number;
  status: string;
  notes: string;
  created_at: string;
  session?: CounsellingSession;
}

export const institutionCounsellingApi = {
  async getSessions(): Promise<CounsellingSession[]> {
    return apiCall("/api/v1/institution/counselling/sessions");
  },
  async createSession(data: { title: string; description: string; scheduled_at: string; duration: number; max_seats: number }): Promise<CounsellingSession> {
    return apiCall("/api/v1/institution/counselling/sessions", {
      method: "POST", body: JSON.stringify(data),
    });
  },
  async deleteSession(id: number): Promise<void> {
    return apiCall(`/api/v1/institution/counselling/sessions/${id}`, { method: "DELETE" });
  },
  async getBookings(): Promise<CounsellingBooking[]> {
    return apiCall("/api/v1/institution/counselling/bookings");
  },
  async updateBookingStatus(id: number, status: string): Promise<CounsellingBooking> {
    return apiCall(`/api/v1/institution/counselling/bookings/${id}/status`, {
      method: "PUT", body: JSON.stringify({ status }),
    });
  },
};
