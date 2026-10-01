"use client";

/**
 * The starter allowance, on the wallet only.
 *
 * ## The six constraints from 06 §2.4, and where each one lives
 *
 * 1. **A date and a count, never a live clock.** Rendered as "Use them by 12
 *    November 2026" plus per-class counts. No `02:14:33`, no re-render timer.
 * 2. **Wallet page only.** It is not on a card, not in the header, not in a
 *    dialog, and not a badge anywhere. Placement C (the one-line form on gated
 *    cards) is a different surface and is not implemented while the gates are
 *    off, which is the same inertness the catalogue already has.
 * 3. **The catalogue is never gated behind it.** Nothing here links to a
 *    filtered catalogue, because the allowance is an entitlement and not a
 *    price.
 * 4. **Reminders are 30/7/1 and opt-out — REPORTED, NOT BUILT.** The
 *    `allowance.expiring` notification event exists server-side (03 §5) and the
 *    backend sends those emails. There is NO endpoint in the contract to read or
 *    write a student's expiry-email preference, so the "Email me before
 *    StudsTokens expire" toggle cannot be rendered without inventing a call. It
 *    is omitted and reported rather than faked with a checkbox that does
 *    nothing. See the report.
 * 5. **No blame grammar.** "Your starter unlocks expire on 12 November", never
 *    "you will lose 3 unlocks". An expired allowance states the date and stops:
 *    no apology, no red, no extension offer (09 §"What support must never
 *    promise").
 * 6. **Never rendered as coins.** It is per-class entitlements and never
 *    appears as a number beside the balance. There is deliberately no
 *    `fmtCoins` anywhere in this file.
 */
import React, { useState } from "react";
import { Check, Gift, Hourglass } from "lucide-react";
import type { CoinAllowance } from "@/services/coinsApi";
import { formatExpiryDate } from "@/components/coins/useCoinState";

/**
 * "1 video lecture" and "3 documents", from one noun list.
 *
 * Every starter grant is small (3 documents, 1 video, 1 mock test) so the
 * singular cases are the common ones, and "1 video lectures" on a page a student
 * reads closely is the kind of sloppiness that makes the rest of the copy feel
 * generated.
 */
function plural(count: number, noun: string): string {
  if (count === 1) return noun.replace(/s$/, "");
  return noun;
}

/** One class's quota: how many were granted and how many are gone. */
function remaining(granted: number, used: number): number {
  return Math.max(0, (Number(granted) || 0) - (Number(used) || 0));
}

export default function StarterAllowanceCard({
  allowance,
}: {
  /** §2.1's allowance block, or null when the student was never granted one. */
  allowance: CoinAllowance | null;
}) {
  /**
   * The clock, sampled once on mount.
   *
   * `Date.now()` cannot be read during render: it is impure, so two renders a
   * millisecond apart can disagree and React is entitled to discard and re-run
   * one. Sampled once, it is also the right granularity — a wallet is a
   * snapshot, and re-deciding "has my allowance lapsed?" on every render is a
   * timer this page has no business running.
   *
   * Declared BEFORE the early return below so the hook order is unconditional.
   */
  const [sampledAt] = useState(() => Date.now());

  // Null is not "used up", it is "never granted". The backend distinguishes
  // these on purpose: `granted_at` null means no allowance was ever issued, and
  // rendering that as a lapsed allowance would tell a student their starter
  // unlocks ran out when they were never given any (allowanceDTOFrom,
  // unlock_api.go). So an ungranted allowance renders nothing at all.
  if (!allowance || !allowance.granted_at) return null;

  const documentLeft = remaining(allowance.document_unlocks, allowance.document_used);
  const videoLeft = remaining(allowance.video_unlocks, allowance.video_used);
  const mockLeft = remaining(allowance.mock_test_unlocks, allowance.mock_test_used);
  const totalLeft = documentLeft + videoLeft + mockLeft;

  const expiresAt = allowance.expires_at;
  const expiryDate = formatExpiryDate(expiresAt);

  /**
   * Lapsed, derived from the date the server sent against the mount-time sample.
   *
   * A null `expires_at` on a granted allowance is NOT a lapse; the backend only
   * leaves it null when nothing was ever granted, which returns null above.
   */
  const lapsed = expiresAt
    ? new Date(expiresAt).getTime() <= sampledAt
    : false;

  const classes = [
    { noun: "documents", left: documentLeft, total: allowance.document_unlocks },
    { noun: "video lectures", left: videoLeft, total: allowance.video_unlocks },
    { noun: "mock tests", left: mockLeft, total: allowance.mock_test_unlocks },
  ];

  return (
    <section
      aria-labelledby="starter-allowance-heading"
      className="rounded-md border border-gray-200 bg-white p-5"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          aria-hidden="true"
        >
          <Gift size={16} />
        </span>
        <div className="min-w-0">
          <h2
            id="starter-allowance-heading"
            className="text-base font-semibold text-gray-900"
          >
            Starter unlocks
          </h2>
          {/*
            The quota line, from the server's own numbers. "3 documents · 1 video
            lecture · 1 mock test" is 06 §10's exact string, and it states the
            grants rather than the balance — which is the whole reason an
            allowance is never rendered as coins.
          */}
          <p className="mt-1 text-xs text-gray-500">
            {classes
              .map((item) => `${item.total} ${plural(item.total, item.noun)}`)
              .join(" · ")}
          </p>
        </div>
      </div>

      {lapsed ? (
        <>
          {/* Constraint 5: the fact, the date, no apology and no colour of blame.
              06 §9's own line for this case. */}
          <p className="mt-4 rounded-md bg-gray-50 p-3 text-sm leading-6 text-gray-600">
            Your starter unlocks expired on {expiryDate}.
          </p>
          <p className="mt-2 text-xs leading-5 text-gray-500">
            You can still unlock resources with the StudsTokens you have earned.
          </p>
        </>
      ) : totalLeft === 0 ? (
        <>
          <p className="mt-4 rounded-md bg-gray-50 p-3 text-sm leading-6 text-gray-600">
            Your starter unlocks are used up.
          </p>
          {expiresAt && (
            <p className="mt-2 text-xs text-gray-500">
              The remaining window closes on {expiryDate}.
            </p>
          )}
        </>
      ) : (
        <>
          {/*
            Constraint 1: a date and a count. The remaining total is the
            headline rather than a checklist, because a per-class breakdown
            without the total makes the student do the sum.
          */}
          <p className="mt-4 text-sm font-semibold text-gray-900">
            {totalLeft} starter {totalLeft === 1 ? "unlock" : "unlocks"} left
          </p>
          <ul className="mt-2 space-y-1.5">
            {classes.map((item) => (
              <li
                key={item.noun}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Check
                    size={13}
                    className={
                      item.left > 0 ? "text-emerald-600" : "text-gray-300"
                    }
                    aria-hidden="true"
                  />
                  {item.noun}
                </span>
                <span className="shrink-0 text-xs font-bold tabular-nums text-gray-500">
                  {item.left} of {item.total} left
                </span>
              </li>
            ))}
          </ul>
          {expiresAt && (
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
              <Hourglass size={12} aria-hidden="true" />
              Use them by {expiryDate}
            </p>
          )}
        </>
      )}
    </section>
  );
}