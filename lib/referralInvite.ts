/**
 * Getting an invite code from a shared link to the signup request.
 *
 * ## The problem this solves
 *
 * A student clicks a friend's link, and the code has to arrive at the
 * registration request. Between those two moments there is everything that
 * makes a signup hard: a page they may not read, a form they may abandon, an
 * OTP step, a closed laptop, and possibly a different day. A code held in a
 * React `useState` in the route that received it is gone the moment they
 * navigate.
 *
 * ## Two carriers, because neither one is enough
 *
 * 1. **The URL.** `?ref=` on `/register`. This is the durable record: it
 *    survives a different session, a different day, a shared browser and a
 *    bookmark, and it is the only carrier a support agent can read off a
 *    student's screenshot. It is why `/r/[code]` redirects rather than renders
 *    — see the route for the argument.
 * 2. **`localStorage`.** The wallet chip already reads `localStorage` for its
 *    bearer token (`services/api.ts:51`), so this is the house precedent and
 *    not a new storage mechanism. It survives the student leaving `/register`
 *    and coming back to a bare `/register` with no query string, which the URL
 *    alone does not.
 *
 * A URL that has been closed and a browser that has been cleared are the only
 * losses, and they lose nothing that matters: the referral is attributed at user
 * creation, and a student who closes the tab and signs up tomorrow from the home
 * page was never going to be attributed by any client-side mechanism short of a
 * server-side session, which this slice is explicitly not adding.
 *
 * ## Precedence, and the one place it is deliberately unhelpful
 *
 * A `ref` in the URL beats a stored code: it is the most recent thing the
 * student did, and it is the link they actually followed.
 *
 * A `ref` that is present but unusable does NOT fall back to the stored code.
 * That is the one case where being helpful would be dishonest. Someone who
 * clicked a truncated or mangled link and registered would be silently credited
 * to an unrelated invite from a week ago, and the friend who earned that
 * referral would be paid for a student they never sent. An unknown code
 * attributes nothing, which is the correct outcome, so the stored code is left
 * alone and the student is told plainly that the link did not work.
 */

/** Storage key. Namespaced so it cannot collide with the auth keys. */
import { asUsableReferralCode } from "./referralCode";

const STORAGE_KEY = "studsphere.referralInvite";

/**
 * Where the code about to be sent came from, and therefore what, if anything,
 * the signup form should say about it.
 *
 * `invalid-link` is a first-class outcome rather than the absence of one: the
 * difference between "you arrived here with no invite" and "you followed an
 * invite link that did not work" is the difference between silence and an
 * apology, and only the second one is worth a student's attention.
 */
export type ReferralInviteSource = "link" | "storage" | "invalid-link" | "none";

export interface ReferralInvite {
  /** Canonical code, or null when there is nothing usable to send. */
  code: string | null;
  source: ReferralInviteSource;
}

const NOTHING: ReferralInvite = { code: null, source: "none" };

/**
 * `localStorage` is not always available and not always writable.
 *
 * Safari in private mode throws on write, and a user with site data blocked
 * throws on read. Neither is worth losing a signup over, and a throw inside an
 * effect would take the form down with it. So every access is guarded and every
 * failure is a silent `null` — the URL carrier is still in place when this one
 * is not, which is the argument for having two.
 */
function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Remember a code for a later visit to a bare `/register`.
 *
 * Best effort by design. Returns the code that was stored so a caller can use
 * it without re-reading, and null when there was nothing to store or the store
 * refused.
 */
export function persistReferralInvite(code: string | null | undefined): string | null {
  if (!code) return null;
  const store = storage();
  if (!store) return null;
  try {
    store.setItem(STORAGE_KEY, code);
    return code;
  } catch {
    return null;
  }
}

/** The remembered code, or null. Normalisation is the caller's business. */
export function readStoredReferralInvite(): string | null {
  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(STORAGE_KEY);
    return raw && raw.length > 0 ? raw : null;
  } catch {
    return null;
  }
}

/**
 * Park the code where the GOOGLE OAuth callback can still read it.
 *
 * The query string does not survive the dance: Google returns the browser to a
 * callback URL carrying only `code` and `state`, so `GoogleCallback` reads the
 * invite from the `referral_code` cookie instead (`referralCodeFrom`,
 * internal/auth/handler.go) — SameSite=Lax survives Google's top-level
 * redirect back. Nothing has ever set this cookie, which is why a code typed or
 * clicked before "Continue with Google" was silently dropped: the backend was
 * asking for a value the client never wrote.
 *
 * A 30-minute max-age bounds the blast radius rather than relying on someone to
 * clear it: the cookie only needs to outlive one OAuth round trip, and a stale
 * code lingering for a later, unrelated signup is a referral attributed to the
 * wrong invitation. The email path does not need it at all — that code travels
 * in the registration body.
 *
 * Best effort, like every storage access in this file: a browser with cookies
 * blocked loses the Google attribution and nothing else.
 */
export function persistReferralCookie(code: string | null | undefined): void {
  if (!code || typeof document === "undefined") return;
  try {
    document.cookie = `referral_code=${encodeURIComponent(code)}; path=/; max-age=1800; SameSite=Lax`;
  } catch {
    // Nothing to do and nowhere to report it: see the header.
  }
}

/**
 * Forget the code.
 *
 * Called once the registration request has been made. A referral is attributed
 * at user creation and the field is single-use per account, so keeping the code
 * around afterwards risks nothing but confusion — and a student who later
 * registers a second account from the same browser would otherwise carry a code
 * that cannot be used. The cookie goes with the localStorage entry for the same
 * reason: it is the same code, parked in the second carrier.
 */
export function clearReferralInvite(): void {
  const store = storage();
  if (store) {
    try {
      store.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to do and nowhere to report it: this is a tidy-up.
    }
  }
  if (typeof document !== "undefined") {
    document.cookie = "referral_code=; path=/; max-age=0; SameSite=Lax";
  }
}

/**
 * Decide what code, if any, this registration should carry.
 *
 * ## Pure, deliberately
 *
 * This used to persist as a side effect of deciding, which made it unusable
 * during a render: React may render any component more than once, and a
 * function that writes to storage every time it is called is a function that
 * cannot be called during rendering. The write is now a separate, explicit step
 * (`persistReferralInvite`), which also means the decision itself is testable
 * with no browser at all.
 */
export function resolveReferralInvite(
  refParam: string | null | undefined,
): ReferralInvite {
  if (typeof refParam === "string" && refParam.trim().length > 0) {
    const usable = asUsableReferralCode(refParam);
    // A link was followed. If it can be a code, that is the code; if it cannot,
    // say so rather than falling back — see the file header.
    return usable
      ? { code: usable, source: "link" }
      : { code: null, source: "invalid-link" };
  }

  const stored = asUsableReferralCode(readStoredReferralInvite());
  if (stored) return { code: stored, source: "storage" };
  return NOTHING;
}
