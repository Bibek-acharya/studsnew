/**
 * Expiry arithmetic, and only expiry arithmetic.
 *
 * ## Why this is not `daysUntil` from `useCoinState`
 *
 * `daysUntil` is `Math.ceil`, and for a *countdown* that is the generous
 * direction: a lot with 4.1 days left reports 5. On a screen that answers "how
 * long have I got", rounding up is the direction that flatters the product.
 *
 * On an expiry surface it is the wrong direction. A wallet that says "expires
 * in 5 days" when 4.1 days remain has told a student they have longer than
 * they do, and expiry is the one mechanic in this feature where a student
 * discovers their balance dropped without spending anything (06 §1.4). So the
 * days here FLOOR: 4.1 days reads as 4. The error is at most one day early,
 * never one day late.
 *
 * `daysUntil` is left exactly as it is. It is used where the figure is a
 * positive "you still have this much" and rounding up is harmless, and it has a
 * test pinning that behaviour. Two helpers rather than one because the two
 * questions genuinely round in opposite directions, and merging them would mean
 * choosing which surface gets the lie.
 */

/** 86_400_000. Named so the two call sites below read as intent. */
const DAY_MS = 86_400_000;

/**
 * Whole days remaining until `value`, floored at zero.
 *
 * Floored, never ceiled — see the file header. `now` is injectable so the
 * boundary is testable without a clock.
 */
export function daysLeft(
  value: string | null | undefined,
  now: number = Date.now(),
): number {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.floor((parsed - now) / DAY_MS));
}

/**
 * True when a lot has an expiry date at all.
 *
 * Its own function, and load-bearing. `daysLeft(null)` is 0, and 0 falls inside
 * every "expiring soon" band — so a lot that NEVER expires would be treated as
 * one expiring today, put in amber, and have its whole balance reported as about
 * to lapse. Every caller that bands on days has to test the date first, and
 * this makes that the easy call.
 */
export function hasExpiry(
  value: string | null | undefined,
): value is string {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

/**
 * The soonest expiry among the lots the caller holds, or null when nothing they
 * hold lapses.
 *
 * Deliberately reads `expires_at` and nothing else: not the balance, not the lot
 * count. A bucket's `expires_at` is the SOONEST expiry in that bucket, so this
 * is exactly the figure the server itself puts in a 402 body's
 * `expires_in_days` (`SoonestLotExpiry`, unlock_api.go). Same number, so the
 * chip and the insufficient screen cannot disagree about how much time is left.
 */
export function soonestExpiry(
  lots: ReadonlyArray<{ expires_at: string | null }>,
): string | null {
  let soonest: number | null = null;
  for (const lot of lots) {
    if (!lot.expires_at) continue;
    const parsed = new Date(lot.expires_at).getTime();
    if (Number.isNaN(parsed)) continue;
    if (soonest === null || parsed < soonest) soonest = parsed;
  }
  return soonest === null ? null : new Date(soonest).toISOString();
}

/**
 * How alarming an expiry is, as one of the three bands 06 §2.3 specifies.
 *
 * `> 30` is a date and nothing else; `8–30` adds the day count in neutral gray;
 * `≤ 7` (and anything already inside a day) is amber, because that is the
 * window where a student can still act on it.
 *
 * A lot inside its final 24 hours floors to 0 days. "expires in 0 days" is
 * nonsense and "expires in 1 day" would be rounding in the student's favour
 * again, so the band renders its own word. 06 does not cover the sub-day case;
 * this is the reading that does not lie.
 */
export type ExpiryBand = "later" | "soon" | "urgent";

export function expiryBand(daysLeftCount: number): ExpiryBand {
  if (daysLeftCount <= 7) return "urgent";
  if (daysLeftCount <= 30) return "soon";
  return "later";
}

/** True once a lot is inside the band where amber is the honest treatment. */
export function isExpiringSoon(
  value: string | null | undefined,
  now: number = Date.now(),
): boolean {
  if (!hasExpiry(value)) return false;
  return expiryBand(daysLeft(value, now)) === "urgent";
}