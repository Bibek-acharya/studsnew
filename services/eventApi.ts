const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const ADMIN_STORAGE_KEY = "studsphere_admin_auth";

let eventToken: string | null = null;

export function setEventToken(token: string | null) {
  eventToken = token;
}

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

function getAdminToken(): string | null {
  if (eventToken) return eventToken;
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.token || null;
    }
  } catch { /* ignore */ }
  return null;
}

// ─── Public API ───────────────────────────────────────────────────────────────────

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

    // Also fetch provider events from Go backend
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
    const res = await fetch(`/api/v1/admin/events/${id}`);

    if (!res.ok) {
      return null;
    }

    const result = await res.json();
    if (result?.data) {
      return result.data;
    }

    return null;
  } catch {
    return null;
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    const res = await fetch(`${path}`, {
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
      console.info("[EventAPI] Backend offline — using local storage fallback");
      return null;
    }
    throw err;
  }
}

export async function fetchAdminEvents(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
} = {}): Promise<{ events: EventEntry[]; meta: EventMeta }> {
  try {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);

    const res = await fetch(`/api/v1/admin/events?${query.toString()}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }

    const result = await res.json();
    if (result?.data) {
      return result.data;
    }

    return { events: [], meta: { total: 0, page: 1, limit: 20, pages: 0 } };
  } catch {
    return { events: [], meta: { total: 0, page: 1, limit: 20, pages: 0 } };
  }
}

export async function createEvent(data: {
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
  published?: boolean;
}): Promise<EventEntry> {
  try {
    const res = await fetch("/api/v1/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to create event");
    }

    const result = await res.json();
    if (result?.data) {
      return result.data;
    }

    throw new Error("Failed to create event. Please try again.");
  } catch (err) {
    throw new Error("Failed to create event. Please try again.");
  }
}

export async function updateEvent(id: string, data: Partial<{
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
  published: boolean;
}>): Promise<EventEntry> {
  try {
    const res = await fetch(`/api/v1/admin/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to update event");
    }

    const result = await res.json();
    if (result?.data) {
      return result.data;
    }

    throw new Error("Failed to update event. Please try again.");
  } catch (err) {
    throw new Error("Failed to update event. Please try again.");
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/v1/admin/events/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete event");
    }

    return;
  } catch (err) {
    throw new Error("Failed to delete event. Please try again.");
  }
}

export async function uploadEventImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/v1/admin/events/upload-image", {
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
