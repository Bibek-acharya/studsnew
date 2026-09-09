import { apiRequest } from "./api";
import type {
  Broadcast,
  CreateBroadcastPayload,
  NotificationPreferences,
  RawNotificationItem,
  UpdatePreferencesPayload,
} from "../features/notifications/types";

const BASE = "/api/v1/notifications";

export interface InboxListOptions {
  limit?: number;
  category?: string;
  unread_only?: boolean;
  archived?: boolean;
  sort?: string;
  query?: string;
}

export interface InboxResponse {
  data: {
    notifications: RawNotificationItem[];
    unread_count: number;
    meta: { total: number; page: number; limit: number };
  };
  message: string;
}

export interface UnreadCountResponse {
  data: { unread_count: number };
  message: string;
}

export interface PreferencesResponse {
  data: NotificationPreferences;
  message: string;
}

export interface BroadcastResponse {
  data: { broadcast_id: number; status: string };
  message: string;
}

export interface BroadcastsResponse {
  data: Broadcast[];
  message: string;
}

function inboxQuery(page: number, opts: InboxListOptions): string {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(opts.limit ?? 20),
  });
  if (opts.category) params.set("category", opts.category);
  if (opts.unread_only) params.set("unread_only", "true");
  if (opts.archived) params.set("archived", "true");
  if (opts.sort) params.set("sort", opts.sort);
  if (opts.query) params.set("query", opts.query);
  return params.toString();
}

export const notificationClient = {
  listNotifications(page = 1, opts: InboxListOptions = {}): Promise<InboxResponse> {
    return apiRequest<InboxResponse>(`${BASE}?${inboxQuery(page, opts)}`);
  },
  fetchUnreadCount(): Promise<UnreadCountResponse> {
    return apiRequest<UnreadCountResponse>(`${BASE}/unread-count`);
  },
  markRead(id: number): Promise<void> {
    return apiRequest<void>(`${BASE}/${id}/read`, { method: "PUT" });
  },
  markAllRead(): Promise<void> {
    return apiRequest<void>(`${BASE}/read-all`, { method: "PUT" });
  },
  setArchived(id: number, archived: boolean): Promise<void> {
    return apiRequest<void>(`${BASE}/${id}/${archived ? "archive" : "unarchive"}`, {
      method: "PUT",
    });
  },
  remove(id: number): Promise<void> {
    return apiRequest<void>(`${BASE}/${id}`, { method: "DELETE" });
  },
  fetchPreferences(): Promise<PreferencesResponse> {
    return apiRequest<PreferencesResponse>(`${BASE}/preferences`);
  },
  updatePreferences(payload: UpdatePreferencesPayload): Promise<PreferencesResponse> {
    return apiRequest<PreferencesResponse>(`${BASE}/preferences`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  createBroadcast(payload: CreateBroadcastPayload): Promise<BroadcastResponse> {
    return apiRequest<BroadcastResponse>(`${BASE}/broadcast`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  listBroadcasts(): Promise<BroadcastsResponse> {
    return apiRequest<BroadcastsResponse>(`${BASE}/broadcasts`);
  },
  cancelBroadcast(id: number): Promise<void> {
    return apiRequest<void>(`${BASE}/broadcasts/${id}/cancel`, { method: "POST" });
  },
};
