/**
 * The admin coin console's client — 04 §6's "admin console and monitoring".
 *
 * Covers five endpoints on one gate:
 *
 *   GET  /api/v1/admin/coins/economy            the config editor
 *   PUT  /api/v1/admin/coins/economy            the same, partial
 *   GET  /api/v1/admin/coins/economy/versions   the config version history
 *   GET  /api/v1/admin/coins/economy-daily     05 §5's health dashboard
 *   GET  /api/v1/admin/coins/users/:id         the support view
 *   POST /api/v1/admin/coins/adjust/:userId    a signed correction
 *
 * ## There is deliberately no way to set a balance
 *
 * 04 §4.4 forbids "set balance to N", and `coins/adjust.go` refuses the ledger's
 * `Reverse` path outright. A correction is a signed MOVEMENT with a reason from a
 * closed set and an author from the session. This module therefore has no setter, and
 * `adminCoinsApi.test.ts` asserts the absence by name — a client method for it would
 * put a non-reversible operation one autocomplete away from an operator.
 *
 * ## Every call carries the superadmin token, not the user token
 *
 * The gate is `RequireRole("superadmin", "super_admin")` in main.go, which is NOT the
 * main user session. Sending the student's token would either 403 or, worse, be
 * resolved as a different principal — and `created_by` would then record the wrong
 * author on an audit row that exists to record exactly that.
 */

import { apiRequest } from "./api";

// ─── types ────────────────────────────────────────────────────────────────────

/** The whole admin-editable economy, as `PUT /economy` accepts and returns it. */
export interface AdminEconomyConfig {
  prices: { study_resource: number; video: number; mock_test: number };
  awards: {
    profile_complete: number;
    profile_instalment: number;
    profile_instalments: number;
    referral_referrer: number;
    referral_referred: number;
    resource_approved: number;
  };
  allowance: {
    document_unlocks: number;
    video_unlocks: number;
    mock_test_unlocks: number;
    expires_in_days: number;
  };
  expiry: { free_days: number; earned_days: number; activity_extend_days: number };
  referral: { monthly_cap: number; lifetime_coin_cap: number; hold_days: number };
  clawback_window_days: number;
  gates_enabled: { study_resource: boolean; video: boolean; mock_test: boolean };
  unlock_endpoint_enabled: boolean;
}

/** One row of the config version history. */
export interface AdminConfigVersion {
  id: number;
  created_at: string;
  changed_by: string;
  changed_by_user_id: number;
  /** Decoded snapshots. Either may be null — the first version has no previous, and
   *  a row whose stored text did not parse has neither. The raw text is always there. */
  previous: AdminEconomyConfig | null;
  new: AdminEconomyConfig | null;
  previous_json: string;
  new_json: string;
}

/** One account row in the support view, with all four balance figures. */
export interface AdminSupportAccount {
  account_id: number;
  bucket: string;
  kind: string;
  closed: boolean;
  cached_posted: number;
  cached_reserved: number;
  computed_posted: number;
  computed_reserved: number;
  drifted: boolean;
}

/** One lot in the support view. */
export interface AdminSupportLot {
  id: number;
  journal_id: string;
  bucket: string;
  granted: number;
  consumed: number;
  remaining: number;
  expires_at: string | null;
  /** True when the lot has lapsed but not been swept: the balance still counts it
   *  while it is already unspendable. That gap is the question support gets asked. */
  expired: boolean;
  created_at: string;
}

/** One journal row. */
export interface AdminSupportJournal {
  id: string;
  entry_type: string;
  state: string;
  reason_code: string;
  amount: number;
  ref_type?: string | null;
  ref_id?: string | null;
  created_at: string;
  created_by?: string;
  postings?: { account_id: number; amount: number }[];
}

/** The whole support view. */
export interface AdminSupportView {
  user_id: number;
  generated_at: string;
  accounts: AdminSupportAccount[];
  total_posted: number;
  total_reserved: number;
  total_available: number;
  lots: AdminSupportLot[];
  journals: AdminSupportJournal[];
  /** Non-empty when this student's rows do not reconcile. */
  discrepancies?: string[];
}

/** The window aggregate from `/economy-daily`. */
export interface AdminHealthSummaryData {
  coins_issued: number;
  coins_spent: number;
  coins_expired: number;
  faucet_sink_ratio: number;
  faucet_sink_ratio_defined: boolean;
  velocity: number;
  velocity_defined: boolean;
  referral_share: number;
  referral_share_defined: boolean;
  referral_share_healthy: boolean;
  days_above_target: number;
  days_defined: number;
  days_of_currency_on_hand: number;
  days_of_currency_on_hand_defined: boolean;
}

/** The dashboard payload. */
export interface AdminHealth {
  days: Array<{
    day: string;
    coins_issued: number;
    coins_spent: number;
    coins_expired: number;
    students_holding: number;
    students_paying: number;
    faucet_sink_ratio: number;
    faucet_sink_ratio_defined: boolean;
    velocity: number;
    velocity_defined: boolean;
    payer_conversion: number;
    payer_conversion_defined: boolean;
    referral_share_of_issuance: number;
    referral_share_of_issuance_defined: boolean;
    referral_share_healthy: boolean;
  }>;
  summary: AdminHealthSummaryData;
  referral_share_target: number;
  metric_version: number;
  window_days: number;
}

/** The adjustment's result. */
export interface AdminAdjustResult {
  journal_id: string;
  amount: number;
  replayed?: boolean;
}

// ─── the closed reason set ────────────────────────────────────────────────────

/**
 * The adjustment reasons, mirroring `coins.AdjustmentReasonsSQLList()`.
 *
 * **Both sides must agree.** The server enforces this vocabulary with a database
 * CHECK (`chk_coin_journal_adjustment_reason`), so a `<select>` offering an extra
 * option produces a write the database rejects — a 500 on a correction an operator
 * was told was valid.
 *
 * The labels exist because the codes are audit vocabulary rather than English. An
 * operator choosing between `DATA_CORRECTION` and `OTHER` with no description is
 * choosing at random, and the reason code is the record of *why* — which is the thing
 * this endpoint exists to preserve.
 */
export const adjustmentReasons: { code: string; label: string }[] = [
  {
    code: "DUPLICATE_AWARD",
    label: "Duplicate award — the same event paid the student twice",
  },
  {
    code: "UNAUTHORISED_SPEND",
    label: "Unauthorised spend — coins left the wallet without an unlock",
  },
  {
    code: "DATA_CORRECTION",
    label: "Data correction — the ledger is right and something else was wrong",
  },
  {
    code: "GOODWILL_CREDIT",
    label: "Goodwill credit — a gesture, not a correction",
  },
  {
    code: "OTHER",
    label: "Other — explain fully in the note",
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

/** The superadmin session token, which is NOT the main user token. */
function superadminToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem("superadmin_token") ?? undefined;
}

/** Unwraps the backend's `{ success, data }` envelope. */
async function unwrap<T>(request: Promise<unknown>): Promise<T> {
  const res = (await request) as { data?: T } | T;
  if (res && typeof res === "object" && "data" in (res as object)) {
    return (res as { data: T }).data;
  }
  return res as T;
}

// ─── the client ───────────────────────────────────────────────────────────────

export const adminCoinsApi = {
  /** The whole config, for the editor. */
  async getEconomyConfig(): Promise<AdminEconomyConfig> {
    return unwrap(
      apiRequest("/api/v1/admin/coins/economy", { authToken: superadminToken() }),
    );
  },

  /**
   * A PARTIAL config update.
   *
   * Partial because 03 §3.1 defines the body as a merge: an omitted key keeps its
   * current value. Sending the whole object would make an edit to one price a write
   * of every price, which is both a lost-update hazard and an audit row describing a
   * change that did not happen.
   *
   * The merge base is the STORED config and a merge never shrinks the set of
   * violations, so while the stored config is non-compliant every write is refused
   * until one request carries compliant figures. That is the intended forcing
   * function, and it is why this editor sends the whole figure set.
   */
  async updateEconomyConfig(patch: PartialDeep<AdminEconomyConfig>): Promise<AdminEconomyConfig> {
    return unwrap(
      apiRequest("/api/v1/admin/coins/economy", {
        method: "PUT",
        authToken: superadminToken(),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      }),
    );
  },

  /** The config version history, newest first. */
  async getConfigHistory(limit?: number): Promise<AdminConfigVersion[]> {
    const qs = limit ? `?limit=${Math.max(1, Math.trunc(limit))}` : "";
    return unwrap(
      apiRequest(`/api/v1/admin/coins/economy/versions${qs}`, {
        authToken: superadminToken(),
      }),
    );
  },

  /** 05 §5's health dashboard. */
  async getHealth(days?: number): Promise<AdminHealth> {
    const qs = days ? `?days=${Math.max(1, Math.trunc(days))}` : "";
    return unwrap(
      apiRequest(`/api/v1/admin/coins/economy-daily${qs}`, { authToken: superadminToken() }),
    );
  },

  /**
   * The support view: "why does this student have 30 coins".
   *
   * A wrong `id` returns an empty view rather than a 404 — see the backend's own
   * note — so the caller distinguishes "no such student" from "no coins" by the
   * emptiness of the payload rather than by a status code.
   */
  async getSupportView(userId: number): Promise<AdminSupportView> {
    return unwrap(
      apiRequest(`/api/v1/admin/coins/users/${encodeURIComponent(String(userId))}`, {
        authToken: superadminToken(),
      }),
    );
  },

  /**
   * A signed correction.
   *
   * A MOVEMENT, not a setting. `amount` is signed: negative debits the student.
   * A magnitude with a separate direction field would let the two disagree.
   *
   * `userId` goes in the PATH and never in the body — the path is what the operator
   * saw on screen and what sits next to it in the access log. A body that could name
   * a different student than the path is a body that eventually will.
   *
   * The idempotency key is required and is the CALLER's, not derived from the
   * amount or the clock: the ledger treats a repeat as a replay rather than a second
   * correction, and a derived key that collides across two genuine corrections would
   * silently swallow the second.
   */
  async adjust(input: {
    userId: number;
    amount: number;
    reason: string;
    idempotencyKey: string;
    note?: string;
  }): Promise<AdminAdjustResult> {
    // Two checks the server also enforces. Doing them here turns a round trip and a
    // 400 or a constraint error into an immediate, nameable field error.
    if (!Number.isFinite(input.amount) || input.amount === 0) {
      throw new Error(
        "A correction must be a non-zero movement. There is no way to set a balance — use a signed amount.",
      );
    }
    if (!adjustmentReasons.some((r) => r.code === input.reason)) {
      throw new Error(
        `Unknown reason "${input.reason}". Use one of: ${adjustmentReasons
          .map((r) => r.code)
          .join(", ")}.`,
      );
    }
    return unwrap(
      apiRequest(`/api/v1/admin/coins/adjust/${encodeURIComponent(String(input.userId))}`, {
        method: "POST",
        authToken: superadminToken(),
        headers: {
          "Content-Type": "application/json",
          // The server reads the HEADER. A key that only reached the body would be
          // ignored and a retry would apply the correction twice — the exact
          // double-payment the key exists to prevent.
          "Idempotency-Key": input.idempotencyKey,
        },
        body: JSON.stringify({
          amount: input.amount,
          reason: input.reason,
          idempotency_key: input.idempotencyKey,
          note: input.note ?? "",
        }),
      }),
    );
  },
};

// ─── the config diff ──────────────────────────────────────────────────────────

/** One changed field. */
export interface ConfigChange {
  /** Dotted path, e.g. `prices.study_resource`. Stable enough to key a diff on. */
  path: string;
  before: unknown;
  after: unknown;
}

/**
 * The fields that changed between two configs.
 *
 * **Leaves only.** An audit row with 40 unchanged fields listed beside the two that
 * moved is a row nobody reads, and the version history's purpose is to answer "what
 * did this change" in one glance.
 *
 * Leaves rather than a generic deep-compare because the shape is known, four
 * levels deep, and a hand-written walk of it cannot silently miss a field the way a
 * reflective one can.
 */
export function diffConfigVersions(
  before: AdminEconomyConfig,
  after: AdminEconomyConfig,
): ConfigChange[] {
  const changes: ConfigChange[] = [];

  const sections = ["prices", "awards", "allowance", "expiry", "referral", "gates_enabled"] as const;
  for (const section of sections) {
    const a = before?.[section] as Record<string, unknown>;
    const b = after?.[section] as Record<string, unknown>;
    if (!a || !b) continue;
    for (const key of Object.keys({ ...a, ...b })) {
      if (a[key] !== b[key]) {
        changes.push({ path: `${section}.${key}`, before: a[key], after: b[key] });
      }
    }
  }

  // The two top-level scalars, compared explicitly rather than by iterating keys, so
  // adding a field to the config does not require editing this function to be
  // diffed — and, more importantly, so adding one does NOT silently appear as a
  // change of undefined.
  for (const key of ["clawback_window_days", "unlock_endpoint_enabled"] as const) {
    if (before?.[key] !== after?.[key]) {
      changes.push({ path: key, before: before?.[key], after: after?.[key] });
    }
  }

  return changes;
}

/** A config with nested objects, partially overridable. */
type PartialDeep<T> = {
  [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K];
};

// ─── the health summary ───────────────────────────────────────────────────────

/** What the dashboard banner should say. */
export interface HealthVerdict {
  status: "ok" | "action" | "unknown";
  /** Sentences naming what is wrong, or what is not yet measurable. */
  reasons: string[];
}

/** The band 05 §5 states for the faucet:sink ratio, monthly. */
const FAUCET_SINK_LOW = 0.7;
const FAUCET_SINK_HIGH = 1.3;

/**
 * Turns the dashboard payload into one banner verdict.
 *
 * Three states, and the third is the one that matters. **"unknown" is not "ok".**
 * A fresh deployment has no rollup rows at all, so every ratio is undefined; a
 * dashboard that rendered that as "all clear" would teach its operator to stop
 * looking, and the first real breach would arrive on a banner they had learned to
 * skim.
 *
 * So: `action` when something breaches, `unknown` when nothing is measurable, `ok`
 * only when there is a measurement and it is inside the band.
 */
export function summariseHealth(health: AdminHealth | null): HealthVerdict {
  if (!health?.summary) {
    return { status: "unknown", reasons: ["No economy history yet."] };
  }
  const s = health.summary;
  const reasons: string[] = [];

  if (s.referral_share_defined && !s.referral_share_healthy) {
    reasons.push(
      `Referral issuance is ${(s.referral_share * 100).toFixed(1)}% of all issuance, ` +
        `over the ${(health.referral_share_target * 100).toFixed(0)}% target, ` +
        `on ${s.days_above_target} of ${s.days_defined} measurable days.`,
    );
  }
  if (s.faucet_sink_ratio_defined && s.faucet_sink_ratio !== 0) {
    if (s.faucet_sink_ratio < FAUCET_SINK_LOW || s.faucet_sink_ratio > FAUCET_SINK_HIGH) {
      reasons.push(
        `Faucet:sink is ${s.faucet_sink_ratio.toFixed(2)}, outside the ` +
          `${FAUCET_SINK_LOW}–${FAUCET_SINK_HIGH} band. ${
            s.faucet_sink_ratio < FAUCET_SINK_LOW
              ? "More coins are circulating than are being issued — students are hoarding."
              : "More coins are being issued than are leaving circulation — coins are inflating."
          }`,
      );
    }
  }

  if (reasons.length > 0) return { status: "action", reasons };

  if (!s.faucet_sink_ratio_defined && !s.referral_share_defined && s.days_defined === 0) {
    return {
      status: "unknown",
      reasons: [
        "No economy activity recorded in this window yet, so nothing can be measured. " +
          "This is not a healthy reading.",
      ],
    };
  }

  return { status: "ok", reasons: ["Every measured figure is inside its band."] };
}