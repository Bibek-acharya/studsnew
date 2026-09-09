// Priority values mirror the backend registry (low | normal | critical).
export type Priority = "low" | "normal" | "critical";

// NotificationItem collapses the backend's two envelope generations into one
// interface (doc 13 §4); field names match the backend envelope exactly.
export interface NotificationItem {
  id: number;
  event_key: string;
  category: string;
  priority: Priority;
  title: string;
  body: string;
  link: string;
  read_at: string | null;
  created_at: string;
  data: Record<string, unknown> | null;
}

// Raw envelope: v2 fields (event_key/category/priority/body/read_at) merged
// with the legacy transition shape (message=body, type, read, updated_at).
export interface RawNotificationItem {
  id: number;
  title: string;
  created_at: string;
  event_key?: string;
  category?: string;
  priority?: string;
  body?: string;
  message?: string;
  link?: string;
  read_at?: string | null;
  read?: boolean;
  type?: string;
  updated_at?: string;
  data?: Record<string, unknown> | null;
}

export function toNotificationItem(raw: RawNotificationItem): NotificationItem {
  return {
    id: raw.id,
    event_key: raw.event_key ?? raw.type ?? "",
    category: raw.category ?? "",
    priority: (raw.priority as Priority) ?? "normal",
    title: raw.title,
    body: raw.body ?? raw.message ?? "",
    link: raw.link ?? "",
    read_at: raw.read_at ?? (raw.read ? raw.updated_at ?? raw.created_at : null),
    created_at: raw.created_at,
    data: raw.data ?? null,
  };
}

// ─── Preferences (doc 05 §2.4, backend DTOs verbatim) ───────────────────────

export interface PreferenceGroup {
  key: string;
  label: string;
  in_app: boolean;
  email: boolean;
  overridden: boolean;
}

export interface GlobalPreferences {
  in_app?: boolean | null;
  email?: boolean | null;
}

export interface NotificationPreferences {
  groups: PreferenceGroup[];
  global: GlobalPreferences;
}

export interface PreferenceOverride {
  pref_key: string;
  in_app?: boolean | null;
  email?: boolean | null;
}

export interface UpdatePreferencesPayload {
  overrides: PreferenceOverride[];
  global?: GlobalPreferences;
}

// ─── Broadcast (doc 05 §2.5, superadmin only) ───────────────────────────────

export type BroadcastAudience = "user" | "institution" | "provider" | "all";

export interface CreateBroadcastPayload {
  title: string;
  body: string;
  link?: string;
  audience: BroadcastAudience[];
  priority?: Priority;
  idempotency_key?: string;
}

export interface Broadcast {
  id: number;
  created_by: number;
  title: string;
  body: string;
  link: string;
  priority: string;
  status: string;
  total_count: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
}
