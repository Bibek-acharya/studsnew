import { apiRequest, type ApiRequestOptions } from "./api";
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
  listNotifications(page = 1, opts: InboxListOptions = {}, req?: ApiRequestOptions): Promise<InboxResponse> {
    return call<InboxResponse>(`${BASE}?${inboxQuery(page, opts)}`, {}, req);
  },
  fetchUnreadCount(req?: ApiRequestOptions): Promise<UnreadCountResponse> {
    return call<UnreadCountResponse>(`${BASE}/unread-count`, {}, req);
  },
  markRead(id: number, req?: ApiRequestOptions): Promise<void> {
    return call<void>(`${BASE}/${id}/read`, { method: "PUT" }, req);
  },
  markAllRead(req?: ApiRequestOptions): Promise<void> {
    return call<void>(`${BASE}/read-all`, { method: "PUT" }, req);
  },
  setArchived(id: number, archived: boolean, req?: ApiRequestOptions): Promise<void> {
    return call<void>(`${BASE}/${id}/${archived ? "archive" : "unarchive"}`, {
      method: "PUT",
    }, req);
  },
  remove(id: number, req?: ApiRequestOptions): Promise<void> {
    return call<void>(`${BASE}/${id}`, { method: "DELETE" }, req);
  },
  fetchPreferences(req?: ApiRequestOptions): Promise<PreferencesResponse> {
    return call<PreferencesResponse>(`${BASE}/preferences`, {}, req);
  },
  updatePreferences(payload: UpdatePreferencesPayload, req?: ApiRequestOptions): Promise<PreferencesResponse> {
    return call<PreferencesResponse>(`${BASE}/preferences`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }, req);
  },
  createBroadcast(payload: CreateBroadcastPayload, req?: ApiRequestOptions): Promise<BroadcastResponse> {
    return call<BroadcastResponse>(`${BASE}/broadcast`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, req);
  },
  listBroadcasts(req?: ApiRequestOptions): Promise<BroadcastsResponse> {
    return call<BroadcastsResponse>(`${BASE}/broadcasts`, {}, req);
  },
  cancelBroadcast(id: number, req?: ApiRequestOptions): Promise<void> {
    return call<void>(`${BASE}/broadcasts/${id}/cancel`, { method: "POST" }, req);
  },
};

// Merges the caller's auth overrides without changing the default wire
// shape: no overrides → the exact single/double-arg call as before.
function call<T>(path: string, init: ApiRequestOptions = {}, req?: ApiRequestOptions): Promise<T> {
  const merged = { ...init, ...req };
  return Object.keys(merged).length > 0
    ? apiRequest<T>(path, merged)
    : apiRequest<T>(path);
};
