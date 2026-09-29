/**
 * The state matrix, implemented once.
 *
 * 06 §3.2 defines seven states. Before this file there were three copies of the
 * card and no matrix at all, so any rule about what a card shows had nowhere to
 * live and the copies were free to disagree. Every surface now calls
 * `resolveResourceAccess` and renders whatever comes back, which is the only
 * thing keeping the document catalog and the video list in step.
 *
 * The colour semantics are the existing ones (06 §0.4) and no new hue is
 * introduced: blue presses, amber is a clock, emerald is settled, gray states a
 * fact, and rose means "not yet". The badge is always neutral gray — it states a
 * price and does not judge whether the student can pay — while the BUTTON carries
 * the affordance, so nothing on a card nags or scolds.
 */
import type { CoinBalance, ResourceAccess } from "@/services/coinsApi";

/**
 * The seven states of 06 §3.2, plus `price-unknown`.
 *
 * `price-unknown` is the one addition to the table, and it is the degradation
 * 06 §9 already prescribes for a card whose price could not be read: the badge
 * falls back to "Unlock to see price", the button opens the same confirmation
 * flow, and the SERVER decides — a 402 opens the insufficient screen with the
 * server's own numbers. Inventing a client-side price here is the one thing
 * that would make a later re-pricing feel like a bait-and-switch.
 */
export type ResourceAccessState =
  /** Starter allowance covers this resource's class. Free in the coin sense. */
  | "starter-eligible"
  /** The student already holds a live unlock. Nothing is ever charged again. */
  | "unlocked"
  /** Priced, and the balance covers it. */
  | "affordable"
  /** Priced, and the balance does not cover it. The button names the gap. */
  | "insufficient"
  /** Not signed in. This is what the brief calls the "gated" state. */
  | "anonymous"
  /** An unlock is in flight. The card is busy, not broken. */
  | "unlocking"
  /** The server sent no `access` block: price unknown, decision deferred to it. */
  | "price-unknown"
  /** An unpublished draft. Renders nothing outside the admin view. */
  | "draft";

/** Everything the badge and the button need, and nothing they do not. */
export interface ResolvedResourceAccess {
  state: ResourceAccessState;
  /** Server price, or null when the server sent none. */
  price: number | null;
  /** The student's balance, or null when it could not be read. */
  balance: number | null;
  /** The shortfall. Only ever non-zero in the `insufficient` state. */
  gap: number;
  /** Starter unlocks left for this class, and the quota they came from. */
  starterLeft: number | null;
  starterTotal: number | null;
  /** True while this card's own unlock request is in flight. */
  busy: boolean;
}

export interface ResolveResourceAccessInput {
  /** Per-resource state from the gated list endpoint. Absent = gate is off. */
  access?: ResourceAccess | null;
  /** Null when no wallet could be read. Never coerced to zero. */
  balance: CoinBalance | null;
  /** Whether a student is signed in. Drives the anonymous state. */
  signedIn: boolean;
  /** This card's unlock is in flight. */
  busy?: boolean;
  /** The resource, for the draft check only. */
  isPublished?: boolean;
  /** The admin table renders drafts; the public catalogue does not. */
  isAdminView?: boolean;
}

/**
 * The single decision. Read it as the server's own order, which is what it
 * mirrors: entitlement first (you already have it, so nothing is charged),
 * then the allowance, then the balance. Reordering these would let the UI
 * offer a purchase for something the student already owns.
 */
export function resolveResourceAccess({
  access,
  balance,
  signedIn,
  busy = false,
  isPublished,
  isAdminView = false,
}: ResolveResourceAccessInput): ResolvedResourceAccess | null {
  // A draft is not a student-facing state at all. Outside the admin view the
  // card renders nothing, which is what `is_published` already means
  // (services/studyResourcesApi.ts); this branch covers an optimistic insert
  // and any stale cached page.
  if (isPublished === false && !isAdminView) return null;

  const empty = {
    price: null,
    balance: balance?.total_available ?? null,
    gap: 0,
    starterLeft: null,
    starterTotal: null,
    busy,
  };

  // No `access` block means the gate is off for this item. Returning null — and
  // not a state — is what makes the feature inert rather than merely hidden:
  // the card draws no badge, mounts no dialog, and renders the plain button it
  // rendered before coins existed. A `price-unknown` state here would put an
  // "Unlock to see price" badge on every card in a catalogue that is not gated
  // at all, which is a design change nobody asked for.
  if (!access) return null;

  const price = Number(access.price);
  const priced = Number.isFinite(price) && price >= 0 ? price : null;
  const available = balance?.total_available ?? null;

  if (access.unlocked) {
    return { ...empty, state: "unlocked", price: priced, busy: false };
  }

  if (!signedIn) {
    return { ...empty, state: "anonymous", price: priced };
  }

  const allowance = access.allowance;
  const starterLeft = allowance ? Math.max(0, Number(allowance.left) || 0) : 0;
  const starterTotal = allowance ? Number(allowance.total) || 0 : 0;
  const withStarter = {
    ...empty,
    price: priced,
    starterLeft,
    starterTotal: starterTotal > 0 ? starterTotal : null,
  };

  if (starterLeft > 0) {
    return { ...withStarter, state: "starter-eligible" };
  }

  if (busy) {
    return { ...withStarter, state: "unlocking" };
  }

  // A price we do not have is not a price we can judge. Defer to the server.
  if (priced === null) {
    return { ...withStarter, state: "price-unknown" };
  }

  // A missing balance is not a zero balance. Treating it as zero would render
  // every card as unaffordable and send a student with a full wallet to an
  // earn screen they do not need, so the state stays undetermined.
  if (available === null) {
    return { ...withStarter, state: "price-unknown" };
  }

  if (available >= priced) {
    return { ...withStarter, state: "affordable" };
  }

  return {
    ...withStarter,
    state: "insufficient",
    gap: Math.max(0, priced - available),
  };
}

/** 40 → "40". Lakh/crore grouping is what this audience reads. */
export function fmtCoins(value: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.max(0, Math.round(value)));
}

/** 2026-11-12 → "12 November 2026". */
export function formatExpiryDate(value: string | null | undefined): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Whole days from now until the date, floored at zero. */
export function daysUntil(value: string | null | undefined, now = Date.now()): number {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.ceil((parsed - now) / 86_400_000));
}

/**
 * The noun the insufficient screen uses for this item: "This document costs
 * 40 StudsTokens" reads correctly, "This resource costs" does not name what was
 * pressed.
 */
export function resourceNoun(kind: "document" | "video" | "mock-test"): string {
  if (kind === "video") return "video lecture";
  if (kind === "mock-test") return "mock test";
  return "document";
}
