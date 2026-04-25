export type CollegeSubscriptionPlan = "none" | "basic" | "standard" | "premium";
export type CollegeSubscriptionStatus = "inactive" | "active" | "paused" | "expired";

export interface CollegeSubscriptionRecord {
  collegeId: number;
  plan: CollegeSubscriptionPlan;
  status: CollegeSubscriptionStatus;
  renewalDate: string;
  notes?: string;
  updatedAt: string;
}

const STORAGE_KEY = "studsphere_college_subscriptions";

function loadAll(): Record<number, CollegeSubscriptionRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(records: Record<number, CollegeSubscriptionRecord>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getCollegeSubscription(collegeId: number): CollegeSubscriptionRecord | null {
  const records = loadAll();
  return records[collegeId] || null;
}

export function upsertCollegeSubscription(record: Omit<CollegeSubscriptionRecord, "updatedAt">): CollegeSubscriptionRecord {
  const records = loadAll();
  const next = {
    ...record,
    updatedAt: new Date().toISOString(),
  };
  records[record.collegeId] = next;
  saveAll(records);
  return next;
}

export function clearCollegeSubscription(collegeId: number): void {
  const records = loadAll();
  delete records[collegeId];
  saveAll(records);
}

