"use client";

/**
 * One lot's expiry, rendered honestly.
 *
 * Expiry is the mechanic most likely to make a student feel the product is
 * unfair, because their balance drops and they spent nothing (06 §1.4). Three
 * rules follow from that and all three are enforced here rather than left to
 * each caller's judgement:
 *
 * 1. **A date, never a live clock.** No countdown, no ticking seconds, no
 *    per-second re-render. "Expires in 5 days" is a fact; "02:14:33" is
 *    pressure, and a student manipulated by a fake clock stops trusting the
 *    product.
 * 2. **Never round in the student's favour.** Days are floored by `daysLeft`,
 *    so a lot with 4.1 days left says 4, not 5. See `expiry.ts` for why this is
 *    a separate helper from `daysUntil`.
 * 3. **Amber means the clock is running and nothing else.** The bands are
 *    06 §2.3's: `> 30` days is a plain date, `8–30` adds the count in neutral
 *    gray, `≤ 7` is amber with the hourglass. A lot that never expires says so
 *    in words and carries no colour at all.
 *
 * `Hourglass` accompanies the amber text because 06 §11.3 forbids colour as the
 * only channel. The glyph is decorative here — the word "expires" is the state.
 */
import React from "react";
import { Hourglass } from "lucide-react";
import {
  daysLeft,
  expiryBand,
} from "@/components/coins/expiry";
import { formatExpiryDate } from "@/components/coins/useCoinState";

export default function WalletExpiryStamp({
  expiresAt,
  now,
  className = "",
}: {
  expiresAt: string | null | undefined;
  /** Injectable so the bands are testable without a clock. */
  now?: number;
  className?: string;
}) {
  // No expiry is a good state and renders as plain gray prose. It is not amber
  // and it is not emerald: neither colour means anything here, and inventing
  // one would break the semantics the rest of the feature depends on.
  if (!expiresAt) {
    return <span className={`text-gray-500 ${className}`}>Never expires</span>;
  }

  const days = daysLeft(expiresAt, now);
  const band = expiryBand(days);
  const date = formatExpiryDate(expiresAt);

  // Inside the final 24 hours `daysLeft` floors to 0, and "expires in 0 days"
  // is nonsense. 06 does not cover this case; "today" is the word that is true
  // in every timezone and does not round in the student's favour either.
  if (days === 0) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold text-amber-700 ${className}`}
      >
        <Hourglass size={12} aria-hidden="true" />
        expires today
      </span>
    );
  }

  if (band === "urgent") {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold text-amber-700 ${className}`}
      >
        <Hourglass size={12} aria-hidden="true" />
        {date} · expires in {days} days
      </span>
    );
  }

  if (band === "soon") {
    return (
      <span className={`text-gray-500 ${className}`}>
        {date} · {days} days left
      </span>
    );
  }

  return <span className={`text-gray-500 ${className}`}>{date}</span>;
}