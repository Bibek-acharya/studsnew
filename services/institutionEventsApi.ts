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

export interface InstitutionEvent {
  id: number;
  institution_id: number;
  name: string;
  short_desc: string;
  description: string;
  image_url: string | null;
  event_type: string;
  category: string;
  max_participants: number;
  online_link: string;
  organized_by: string;
  contact_person: string;
  contact_email: string;
  start_date: string;
  end_date: string;
  location: string;
  tags: string[];
  enable_registration: boolean;
  application_link?: string;
  status: string;
  attendees: number;
  registration_fee?: string;
  registration_deadline?: string;
  featured?: boolean;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export const institutionEventsApi = {
  async list(
    page = 1,
    limit = 10,
  ): Promise<{
    events: InstitutionEvent[];
    meta: { total: number; page: number; limit: number };
  }> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    }).toString();
    return apiCall(`/api/v1/institution/events?${params}`);
  },

  async getById(id: number): Promise<InstitutionEvent> {
    return apiCall(`/api/v1/institution/events/${id}`);
  },

  async create(data: {
    name: string;
    short_desc?: string;
    description: string;
    image_url?: string;
    event_type?: string;
    category?: string;
    max_participants?: number;
    online_link?: string;
    organized_by?: string;
    contact_person?: string;
    contact_email?: string;
    start_date: string;
    end_date?: string;
    location?: string;
    tags?: string[];
    enable_registration?: boolean;
    status?: string;
  }): Promise<InstitutionEvent> {
    return apiCall("/api/v1/institution/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(
    id: number,
    data: {
      name: string;
      short_desc?: string;
      description: string;
      image_url?: string;
      event_type?: string;
      category?: string;
      max_participants?: number;
      online_link?: string;
      organized_by?: string;
      contact_person?: string;
      contact_email?: string;
      start_date: string;
      end_date?: string;
      location?: string;
      tags?: string[];
      enable_registration?: boolean;
      status?: string;
    },
  ): Promise<InstitutionEvent> {
    return apiCall(`/api/v1/institution/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    await apiCall(`/api/v1/institution/events/${id}`, { method: "DELETE" });
  },

  async uploadImage(file: File, folder: string): Promise<string> {
    return uploadFile(file, folder);
  },
};

export async function fetchInstitutionEventBySlug(
  slug: string,
): Promise<InstitutionEvent> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const res = await fetch(
    `${API_BASE}/api/v1/institutions/public/events/by-slug/${slug}`,
  );
  if (!res.ok) throw new Error("Event not found");
  const data = await res.json();
  return data.data || data;
}
