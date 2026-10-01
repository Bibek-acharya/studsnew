/**
 * Typed client for the StudsToken wallet endpoints (03-api-contract.md
 * §2.1–§2.3).
 *
 * Two things are load-bearing here and both are about not inventing numbers.
 *
 * 1. **The price is never computed by the client.** `UnlockRequest` on the
 *    server has no amount field at all — a client that can name the cost is an
 *    exploit — so this module sends `{ resource_type, resource_id }` and
 *    nothing else. Every figure the UI renders comes back in a response body.
 *
 * 2. **The spend order is the server's, not ours.** §2.1's `spend_order` is
 *    already FEFO: soonest expiry first. `buildSpendPreview` walks that array
 *    from the front. It does not sort by `expires_at`, does not pick lots, and
 *    does not decide which bucket pays. It is a reader of a plan the ledger
 *    already made, which is what lets the confirmation dialog name the lots
 *    without the client ever knowing what a lot is.
 *
 * The unlock endpoint is mounted but dark — it answers 503 until an admin sets
 * `EconomyConfig.UnlockEndpointEnabled`. That is the switch, and it lives on the
 * server: with the gate off, every request here returns the same answers it
 * always did and no coin state is ever derived, because the catalogue items
 * carry no `access` block and `resolveResourceAccess` returns null for them.
 */
import { apiRequest } from "./api";

/** The three classes the ledger prices separately. */
export type CoinResourceType = "study_resource" | "video" | "mock_test";

/** One open lot as §2.1 reports it: the soonest expiry in that bucket. */
export interface CoinBucket {
  bucket: string;
  balance: number;
  expires_at: string | null;
  lot_count?: number;
}

/** §2.2's `ref`: what a journal is about. Absent rather than empty strings. */
export interface CoinRef {
  type: string;
  id: number;
}

/**
 * One row of §2.2's journal, as the student sees it.
 *
 * `amount` is SIGNED from the caller's perspective — a grant is positive, a
 * spend negative, a clawback negative again — so the history never has to infer
 * direction from an entry type, and a reversal reads as its own negative row
 * rather than as an edit to the row it reverses (03 §2.2).
 */
export interface CoinTransaction {
  journal_id: string;
  entry_type: string;
  reason_code: string;
  amount: number;
  balance_after: number;
  ref: CoinRef | null;
  description: string;
  reversed: boolean;
  created_at: string;
}

/** One page of §2.2. `next_cursor` is opaque; see `listTransactions`. */
export interface CoinTransactionsPage {
  items: CoinTransaction[];
  /** Empty string on the last page. Never null, never parsed by this client. */
  next_cursor: string;
}

/** One leg of the FEFO plan. The ORDER of these is the spend order. */
export interface CoinSpendLeg {
  bucket: string;
  coins: number;
  expires_at: string | null;
}

/** §2.1's allowance block: quotas per class, never a single blended total. */
export interface CoinAllowance {
  granted_at: string | null;
  expires_at: string | null;
  document_unlocks: number;
  document_used: number;
  video_unlocks: number;
  video_used: number;
  mock_test_unlocks: number;
  mock_test_used: number;
}

export interface CoinBalance {
  total_available: number;
  total_reserved: number;
  buckets: CoinBucket[];
  spend_order: CoinSpendLeg[];
  allowance: CoinAllowance | null;
}

/**
 * The per-resource state the gated list endpoint carries alongside each item.
 *
 * Absent means the gate is off for that item, and the card renders exactly as
 * it did before this feature existed. That absence is the feature switch, and
 * it is why nothing in the UI has to be told the gate is on.
 */
export interface ResourceAccess {
  /** Server-resolved cost in StudsTokens. The client never derives this. */
  price: number;
  /** The caller already holds a live unlock, so nothing is ever charged. */
  unlocked: boolean;
  /**
   * Starter allowance still available for THIS resource's class. Left is
   * `0` once the quota is used up; the whole block is absent when the student
   * was never granted one, which is not the same as having used it.
   */
  allowance?: { left: number; total: number; expires_at: string | null } | null;
  /** The class the price was resolved against, when it differs from the item. */
  resource_type?: CoinResourceType;
}

/** One route to coins this student can still take, as §2.3 computes it. */
export interface WayToEarn {
  code: string;
  label: string;
  /** The route's REMAINING value to this student, not the configured award. */
  potential: number;
}

/**
 * A route that exists on paper and cannot be taken yet. Reported rather than
 * dropped so the client can say so instead of rendering a button for a feature
 * that is not launched, which is worse than no button.
 */
export interface UnavailableRoute {
  code: string;
  label: string;
  reason: string;
}

/** §2.3's designed object. A refusal, not a string. */
export interface InsufficientCoinsData {
  required: number;
  available: number;
  shortfall: number;
  /** Days until the soonest-expiring lot the caller holds. Null when none. */
  expires_in_days: number | null;
  ways_to_earn: WayToEarn[];
  unavailable_routes?: UnavailableRoute[];
}

/** §2.3's 200 body. */
export interface UnlockResponse {
  unlocked: boolean;
  /** True ⇒ idempotent no-op, `coins_paid` is 0, nothing was charged. */
  already_unlocked: boolean;
  coins_paid: number;
  balance_after: number;
  spent_from: CoinSpendLeg[];
  used_allowance: boolean;
}

/**
 * Everything one unlock attempt can turn out to be.
 *
 * The four HTTP outcomes are four different screens, and the distinctions are
 * the whole point: `already-unlocked` says nothing was spent, `charged` says
 * what was, and they must never render the same words. A student who retries on
 * a flaky connection lands on `already-unlocked` or `replayed` and is told the
 * truth, not that they were charged twice.
 */
export type UnlockOutcome =
  | {
      status: "unlocked";
      alreadyUnlocked: boolean;
      usedAllowance: boolean;
      coinsPaid: number;
      balanceAfter: number;
      spentFrom: CoinSpendLeg[];
    }
  | { status: "insufficient"; data: InsufficientCoinsData }
  /** 423 — the starter allowance LAPSED and no purchase covers this student. */
  | { status: "allowance-expired"; data: InsufficientCoinsData }
  /** 401 — not signed in. Never rendered as "you have no StudsTokens". */
  | { status: "unauthenticated" }
  /** 404 — unknown, unpublished, or the wrong class. */
  | { status: "not-found" }
  /**
   * A failure that spent nothing: 400 (idempotency), 409 (key reuse), 409
   * (frozen account), 500, 503 (gate off), and any network error. The student
   * is told their balance has not changed and is never shown an error code.
   */
  | { status: "failed"; reason: "invalid-request" | "conflict" | "server" | "offline" };

/** One allocation leg as the confirmation dialog renders it. */
export interface SpendPreviewLeg {
  bucket: string;
  amount: number;
  expiresAt: string | null;
}

export interface SpendPreview {
  cost: number;
  balanceBefore: number;
  balanceAfter: number;
  allocation: SpendPreviewLeg[];
  /**
   * False when the server's spend order does not add up to the cost, which
   * means the balance moved between reads. The confirm button is not rendered
   * in that case: a live confirm without a balance check is how a student gets
   * charged twice (06 §4).
   */
  covered: boolean;
}

/**
 * Walk the server's FEFO order to show which lots a spend would burn.
 *
 * `covered: false` is a real, expected answer, not an error: the wallet can
 * change between the balance read and the press. The caller must not offer a
 * confirm it cannot back up.
 */
export function buildSpendPreview(
  balance: CoinBalance,
  cost: number,
): SpendPreview {
  const balanceBefore = Math.max(0, Number(balance.total_available) || 0);
  const allocation: SpendPreviewLeg[] = [];
  let remaining = Math.max(0, Number(cost) || 0);

  for (const leg of balance.spend_order ?? []) {
    if (remaining <= 0) break;
    const available = Math.max(0, Number(leg.coins) || 0);
    if (available <= 0) continue;
    const take = Math.min(available, remaining);
    allocation.push({
      bucket: leg.bucket,
      amount: take,
      expiresAt: leg.expires_at ?? null,
    });
    remaining -= take;
  }

  return {
    cost: Math.max(0, Number(cost) || 0),
    balanceBefore,
    balanceAfter: Math.max(0, balanceBefore - Math.max(0, Number(cost) || 0)),
    allocation,
    covered: remaining <= 0,
  };
}

/**
 * A retry-safe key for one unlock attempt.
 *
 * The key is generated once per attempt and REUSED for every retry of that
 * same attempt, which is the entire reason the header exists: a retry that
 * cannot reproduce its key double-charges (03 §2.3). `crypto.randomUUID` is
 * available in every browser this app supports; the fallback exists only so the
 * call cannot throw on an older engine and leave a student with a dead button.
 */
export function newIdempotencyKey(): string {
  const cryptoRef =
    typeof globalThis !== "undefined"
      ? (globalThis.crypto as Crypto | undefined)
      : undefined;
  if (cryptoRef?.randomUUID) return cryptoRef.randomUUID();
  if (cryptoRef?.getRandomValues) {
    const bytes = cryptoRef.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return `unlock-${Date.now().toString(36)}`;
}

function unwrapData(payload: unknown): Record<string, unknown> {
  if (payload && typeof payload === "object") {
    const body = payload as Record<string, unknown>;
    if (body.data && typeof body.data === "object") {
      return body.data as Record<string, unknown>;
    }
  }
  return {};
}

/**
 * The 402/423 payload, read off the parsed body `apiRequest` attaches.
 *
 * Returns null rather than a partially-filled object when the fields the screen
 * needs are absent: the insufficient screen leads with arithmetic, and an
 * invented `required` is a fabricated debt.
 */
function readInsufficientData(payload: unknown): InsufficientCoinsData | null {
  const envelope =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};
  const error = envelope.error;
  const source =
    error && typeof error === "object"
      ? (error as Record<string, unknown>).data
      : undefined;
  const data =
    source && typeof source === "object"
      ? (source as Record<string, unknown>)
      : envelope.data && typeof envelope.data === "object"
        ? (envelope.data as Record<string, unknown>)
        : null;
  if (!data) return null;

  const num = (value: unknown): number => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };
  const shortfall = num(data.shortfall);

  return {
    required: num(data.required),
    available: num(data.available),
    shortfall: shortfall > 0 ? shortfall : Math.max(0, num(data.required) - num(data.available)),
    expires_in_days:
      data.expires_in_days === null || data.expires_in_days === undefined
        ? null
        : num(data.expires_in_days),
    ways_to_earn: Array.isArray(data.ways_to_earn)
      ? (data.ways_to_earn as WayToEarn[]).map((way) => ({
          code: String(way?.code ?? ""),
          label: String(way?.label ?? ""),
          potential: num(way?.potential),
        }))
      : [],
    unavailable_routes: Array.isArray(data.unavailable_routes)
      ? (data.unavailable_routes as UnavailableRoute[]).map((route) => ({
          code: String(route?.code ?? ""),
          label: String(route?.label ?? ""),
          reason: String(route?.reason ?? ""),
        }))
      : [],
  };
}

function readUnlockResponse(payload: unknown): UnlockResponse {
  const data = unwrapData(payload);
  const spentFrom = Array.isArray(data.spent_from)
    ? (data.spent_from as CoinSpendLeg[]).map((leg) => ({
        bucket: String(leg?.bucket ?? ""),
        coins: Number(leg?.coins) || 0,
        expires_at: leg?.expires_at ?? null,
      }))
    : [];
  return {
    unlocked: data.unlocked === true,
    // Default true on an unreadable body: a response we cannot read must never
    // be rendered as a charge. The safe direction is "nothing was spent".
    already_unlocked: data.already_unlocked !== false,
    coins_paid: Number(data.coins_paid) || 0,
    balance_after: Number(data.balance_after) || 0,
    spent_from: spentFrom,
    used_allowance: data.used_allowance === true,
  };
}

/**
 * §2.2's page, read defensively.
 *
 * A row missing its amount, its date or its description is dropped rather than
 * rendered with a zero in it: a history is the thing a student uses to argue
 * with support (09 §"The balance trap"), so a plausible-looking blank row is
 * worse than a short list. An unreadable envelope returns null, which is the
 * page's error state, never an empty successful page — "no transactions yet"
 * and "we could not read your history" are different sentences and must not
 * render as the same screen.
 */
function readTransactionsPage(payload: unknown): CoinTransactionsPage | null {
  const data = unwrapData(payload);
  if (!Array.isArray(data.items)) return null;

  const items: CoinTransaction[] = [];
  for (const raw of data.items as unknown[]) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;
    const amount = Number(row.amount);
    const createdAt = String(row.created_at ?? "");
    // A journal with no date cannot be placed in a history, and one with no
    // amount is a row we would have to guess at.
    if (!createdAt || !Number.isFinite(amount)) continue;
    items.push({
      journal_id: String(row.journal_id ?? ""),
      entry_type: String(row.entry_type ?? ""),
      reason_code: String(row.reason_code ?? ""),
      amount,
      balance_after: Number(row.balance_after) || 0,
      ref:
        row.ref && typeof row.ref === "object"
          ? {
              type: String((row.ref as Record<string, unknown>).type ?? ""),
              id: Number((row.ref as Record<string, unknown>).id) || 0,
            }
          : null,
      description: String(row.description ?? ""),
      reversed: row.reversed === true,
      created_at: createdAt,
    });
  }

  // "" is the documented last-page value. Anything else is handed back verbatim
  // as the opaque token it is.
  const next = typeof data.next_cursor === "string" ? data.next_cursor : "";
  return { items, next_cursor: next };
}

function readBalance(payload: unknown): CoinBalance | null {
  const data = unwrapData(payload);
  if (typeof data.total_available !== "number") return null;
  return {
    total_available: data.total_available,
    total_reserved: Number(data.total_reserved) || 0,
    buckets: Array.isArray(data.buckets) ? (data.buckets as CoinBucket[]) : [],
    spend_order: Array.isArray(data.spend_order)
      ? (data.spend_order as CoinSpendLeg[])
      : [],
    allowance:
      data.allowance && typeof data.allowance === "object"
        ? (data.allowance as CoinAllowance)
        : null,
  };
}

/**
 * Turn one unlock attempt into a screen-defining outcome.
 *
 * Split out from the request so the mapping is testable without a network and
 * so there is exactly one place a status code becomes a word.
 */
export function toUnlockOutcome(
  status: number,
  payload: unknown,
): UnlockOutcome {
  if (status === 200) {
    const body = readUnlockResponse(payload);
    return {
      status: "unlocked",
      alreadyUnlocked: body.already_unlocked,
      usedAllowance: body.used_allowance,
      coinsPaid: body.coins_paid,
      balanceAfter: body.balance_after,
      spentFrom: body.spent_from,
    };
  }
  if (status === 401) return { status: "unauthenticated" };
  if (status === 402) {
    const data = readInsufficientData(payload);
    return data ? { status: "insufficient", data } : { status: "failed", reason: "server" };
  }
  if (status === 423) {
    const data = readInsufficientData(payload);
    return data
      ? { status: "allowance-expired", data }
      : { status: "failed", reason: "server" };
  }
  if (status === 404) return { status: "not-found" };
  if (status === 400) return { status: "failed", reason: "invalid-request" };
  if (status === 409) return { status: "failed", reason: "conflict" };
  if (status === 503) return { status: "failed", reason: "offline" };
  return { status: "failed", reason: "server" };
}

export const coinsApi = {
  /**
   * §2.1. The hot path: the header chip, the card badges and the confirmation
   * dialog all read one snapshot, so they cannot disagree about a balance.
   *
   * A 401 here is a normal outcome for a signed-out visitor, not a failure,
   * so the global auth-expired handler is suppressed and the caller decides
   * what a missing wallet means (06 §2.2: never render 0, which is a lie).
   */
  async getBalance(options: { signal?: AbortSignal } = {}): Promise<CoinBalance | null> {
    try {
      const response = await apiRequest<unknown>("/api/v1/coins/balance", {
        suppressAuthExpired: true,
        ...(options.signal ? { signal: options.signal } : {}),
      });
      return readBalance(response);
    } catch {
      // No wallet is a rendering state, not an error banner: a failed balance
      // read must not tell a signed-in student they have nothing.
      return null;
    }
  },

  /**
   * §2.2. The cursor is OPAQUE and stays that way.
   *
   * It is base64url of `{created_at, id}` server-side and may change shape
   * without notice (03 §2.2), so this client never builds one, never decodes one
   * and never compares one to a row. It is a string that comes back from the
   * server and goes straight back to it, and that is the only way a pagination
   * change on the server can never become a data bug here. 06 §2.2's worked
   * example decodes to `{created_at}` alone, which is not unique; the
   * implementation carries an id as well. Depending on either shape would be
   * depending on both being wrong.
   */
  async listTransactions(
    options: { cursor?: string; limit?: number; signal?: AbortSignal } = {},
  ): Promise<CoinTransactionsPage | null> {
    const params = new URLSearchParams();
    if (options.cursor) params.set("cursor", options.cursor);
    if (typeof options.limit === "number" && options.limit > 0) {
      params.set("limit", String(Math.round(options.limit)));
    }
    const query = params.toString();
    try {
      const response = await apiRequest<unknown>(
        `/api/v1/coins/transactions${query ? `?${query}` : ""}`,
        {
          // A 401 here is "not signed in", which is a rendering state on this
          // page rather than a reason to wipe the session.
          suppressAuthExpired: true,
          ...(options.signal ? { signal: options.signal } : {}),
        },
      );
      return readTransactionsPage(response);
    } catch {
      return null;
    }
  },

  /**
   * §2.3, the single write path. Takes no amount by design.
   *
   * `idempotencyKey` must be the SAME value across every retry of one attempt;
   * a fresh key per retry is what double-charges a student on a flaky
   * connection.
   */
  async unlock(input: {
    resourceType: CoinResourceType;
    resourceId: number;
    idempotencyKey: string;
  }): Promise<UnlockOutcome> {
    try {
      const response = await apiRequest<unknown>("/api/v1/coins/unlock", {
        method: "POST",
        headers: { "Idempotency-Key": input.idempotencyKey },
        body: JSON.stringify({
          resource_type: input.resourceType,
          resource_id: input.resourceId,
        }),
        // A 401 on this endpoint is a designed outcome (not signed in), and the
        // global handler would wipe the session and bounce the student to the
        // landing page instead of offering a log-in.
        suppressAuthExpired: true,
      });
      return toUnlockOutcome(200, response);
    } catch (error) {
      const requestError = error as { status?: number; payload?: unknown };
      // A thrown fetch (offline, DNS, dropped connection) has no status at
      // all. It is reported as a failure that spent nothing, which is the only
      // claim a client can make honestly: whether the request landed is the
      // server's to say, and the retry carries the same idempotency key.
      if (typeof requestError?.status !== "number") {
        return { status: "failed", reason: "offline" };
      }
      return toUnlockOutcome(requestError.status, requestError.payload);
    }
  },
};

export type { InsufficientCoinsData as InsufficientCoinsPayload };
