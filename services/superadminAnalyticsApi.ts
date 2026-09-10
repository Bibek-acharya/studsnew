import { apiRequest } from "./api";

export function getSuperadminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("superadmin_token");
}

function auth() {
  return {
    authToken: getSuperadminToken() ?? undefined,
    suppressAuthExpired: true as const,
  };
}

export interface SeriesPoint {
  bucket: string;
  values: Record<string, number>;
}

export interface UsersAnalytics {
  totals: {
    students: number;
    institutions: number;
    providers: number;
    pending_institutions: number;
    pending_providers: number;
    active_7d: number;
    activation_pct: number;
  };
  user_status_breakdown: Record<string, number>;
  series: SeriesPoint[];
}

export interface FunnelAnalytics {
  totals: { admissions: number; scholarship_applications: number; bookings: number };
  admission_conversion_pct: number;
  admissions_by_status: Record<string, number>;
  series: SeriesPoint[];
}

export interface RankedItem {
  kind: string;
  id: number;
  count: number;
}

export interface SupplyAnalytics {
  totals: {
    colleges: number;
    scholarships_published: number;
    events: number;
    blogs: number;
    news: number;
  };
  approval_aging: {
    institutions: { lt_24h: number; d1_3: number; gt_3d: number };
    providers: { lt_24h: number; d1_3: number; gt_3d: number };
  };
  top_bookmarked: RankedItem[];
  top_followed: RankedItem[];
  stale_scholarships: { id: number; title: string; deadline: string }[];
  series: SeriesPoint[];
}

export interface OpsAnalytics {
  totals: {
    forum_reports: number;
    review_reports: number;
    feedback: number;
    broadcasts: number;
    broadcasts_failed: number;
  };
  inquiries_by_status: Record<string, number>;
  recent_broadcasts: { id: number; status: string; audience: string; created_at: string }[];
  series: SeriesPoint[];
}

export interface HealthSnapshot {
  process: { uptime_seconds: number; goroutines: number; heap_alloc_bytes: number; heap_sys_bytes: number };
  database: { pool_open: number; pool_in_use: number; pool_idle: number; pool_wait_count: number; size_bytes: number };
  queues: {
    email: { available: boolean; pending: number; active: number; failed: number };
    outbox_pending: number;
  };
  api: {
    total_requests: number;
    server_errors_5xx: number;
    avg_latency_ms: number;
    p95_latency_ms: number;
    top_endpoints: { path: string; count: number }[];
  };
}

function rangeQuery(from: string, to: string): string {
  const params = new URLSearchParams({ from, to, granularity: "day" });
  return params.toString();
}

async function get<T>(path: string): Promise<T> {
  return apiRequest<T>(path, auth());
}

export const superadminAnalyticsApi = {
  getUsers(from: string, to: string): Promise<{ data: UsersAnalytics }> {
    return get<{ data: UsersAnalytics }>(
      `/api/v1/superadmin/analytics/users?${rangeQuery(from, to)}`,
    );
  },
  getFunnel(from: string, to: string): Promise<{ data: FunnelAnalytics }> {
    return get<{ data: FunnelAnalytics }>(
      `/api/v1/superadmin/analytics/funnel?${rangeQuery(from, to)}`,
    );
  },
  getSupply(from: string, to: string): Promise<{ data: SupplyAnalytics }> {
    return get<{ data: SupplyAnalytics }>(
      `/api/v1/superadmin/analytics/supply?${rangeQuery(from, to)}`,
    );
  },
  getOps(from: string, to: string): Promise<{ data: OpsAnalytics }> {
    return get<{ data: OpsAnalytics }>(
      `/api/v1/superadmin/analytics/ops?${rangeQuery(from, to)}`,
    );
  },
  getHealth(): Promise<{ data: HealthSnapshot }> {
    return get<{ data: HealthSnapshot }>(`/api/v1/superadmin/analytics/health`);
  },
};
