import { apiRequest } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface EventEntry {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  image: string;
  organizer: string;
  location: string;
  date: string;
  time: string;
  registrationFee: string;
  interestedCount: number;
  published: boolean;
  created_at: string;
}

export interface EventMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export async function fetchPublicEvents(params: {
  page?: number;
  limit?: number;
  category?: string;
} = {}): Promise<{ events: EventEntry[]; meta: EventMeta }> {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.category) query.set("category", params.category);

    const res = await fetch(`/api/v1/events?${query.toString()}`);

    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }

    const result = await res.json();
    let events: EventEntry[] = [];
    let total = 0;

    if (result?.data) {
      events = result.data.events || [];
      total = result.data.meta?.total || 0;
    }

    try {
      const providerRes = await fetch(`${API_BASE_URL}/api/v1/public/events?page=1&limit=50`);
      if (providerRes.ok) {
        const providerResult = await providerRes.json();
        if (providerResult?.data?.events && providerResult.data.events.length > 0) {
          const providerEvents = providerResult.data.events.map((e: any): EventEntry => ({
            id: `provider-${e.id}`,
            title: e.name,
            excerpt: e.short_desc || "",
            description: e.description || "",
            category: e.category || e.event_type || "Event",
            image: e.image_url || "",
            organizer: e.organized_by || "",
            location: e.location || "",
            date: e.start_date ? new Date(e.start_date).toLocaleDateString() : "",
            time: e.start_date ? new Date(e.start_date).toLocaleTimeString() : "",
            registrationFee: "",
            interestedCount: 0,
            published: true,
            created_at: e.created_at,
          }));
          events = [...events, ...providerEvents];
          total += providerResult.data.meta?.total || 0;
        }
      }
    } catch (providerErr) {
      console.warn("Failed to fetch provider events:", providerErr);
    }

    return { 
      events, 
      meta: { total, page: params.page || 1, limit: params.limit || 12, pages: Math.ceil(total / (params.limit || 12)) } 
    };
  } catch {
    return { events: [], meta: { total: 0, page: 1, limit: 12, pages: 0 } };
  }
}

export async function fetchPublicEventById(id: string): Promise<EventEntry | null> {
  try {
    const res = await fetch(`/api/v1/events/${id}`);

    if (!res.ok) {
      return null;
    }

    const result = await res.json();
    if (result?.data) {
      const raw = result.data;
      return {
        id: String(raw.id ?? raw.event_id),
        title: raw.title || raw.name || "",
        excerpt: raw.excerpt || raw.short_desc || raw.description?.slice(0, 200) || "",
        description: raw.description || "",
        category: raw.category || raw.event_type || "Event",
        image: raw.image || raw.image_url || raw.banner_image || "",
        organizer: raw.organizer || raw.organized_by || "",
        location: raw.location || "",
        date: raw.date || raw.start_date
          ? new Date(raw.date || raw.start_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "",
        time: raw.time || raw.start_date
          ? new Date(raw.start_date).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        registrationFee: raw.registrationFee ?? raw.registration_fee ?? "",
        interestedCount: raw.interestedCount ?? raw.interested_count ?? 0,
        published: raw.published ?? raw.status === "published",
        created_at: raw.created_at || raw.publish_date || new Date().toISOString(),
      };
    }

    return null;
  } catch {
    return null;
  }
}

export interface AdminEvent {
  id: number;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  organizer: string;
  location: string;
  date: string;
  time: string;
  registrationFee: string;
  image: string;
  interested: number;
  trending: boolean;
  featured: boolean;
}

export interface EventMeta {
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

export const adminEventApi = {
  async list(params: { page?: number; limit?: number; category?: string; search?: string } = {}): Promise<{ events: AdminEvent[]; meta: EventMeta }> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    const qs = query.toString();
    return extractData(apiRequest(`/api/v1/admin/events${qs ? "?" + qs : ""}`, { authToken: getSuperadminToken() ?? undefined }));
  },

  async getById(id: number): Promise<AdminEvent> {
    return extractData(apiRequest(`/api/v1/admin/events/${id}`, { authToken: getSuperadminToken() ?? undefined }));
  },

  async create(data: {
    title: string;
    excerpt?: string;
    description?: string;
    category?: string;
    organizer?: string;
    location?: string;
    date?: string;
    time?: string;
    registrationFee?: string;
    image?: string;
  }): Promise<AdminEvent> {
    return extractData(apiRequest("/api/v1/admin/events", {
      method: "POST",
      body: JSON.stringify(data),
      authToken: getSuperadminToken() ?? undefined,
    }));
  },

  async update(id: number, data: {
    title?: string;
    excerpt?: string;
    description?: string;
    category?: string;
    organizer?: string;
    location?: string;
    date?: string;
    time?: string;
    registrationFee?: string;
    image?: string;
  }): Promise<AdminEvent> {
    return extractData(apiRequest(`/api/v1/admin/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      authToken: getSuperadminToken() ?? undefined,
    }));
  },

  async delete(id: number): Promise<void> {
    await apiRequest(`/api/v1/admin/events/${id}`, {
      method: "DELETE",
      authToken: getSuperadminToken() ?? undefined,
    });
  },

  async toggleFeatured(id: number): Promise<AdminEvent> {
    return extractData(apiRequest(`/api/v1/admin/events/${id}/feature`, {
      method: "PUT",
      authToken: getSuperadminToken() ?? undefined,
    }));
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);
    const res = await extractData<{ url?: string }>(apiRequest("/api/v1/admin/news/upload-image", {
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
