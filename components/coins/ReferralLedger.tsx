"use client";

/**
 * The referral groups and the per-referral rows.
 *
 * This is where §2.4's eight numbers stop being numbers. The whole honesty
 * argument for the surface is in `components/coins/referralView.ts`; this
 * component's only job is to put the three groups on screen with the tone each
 * one is allowed and never let them blur into one figure.
 *
 * ## The structural rules it enforces
 *
 * 1. **No combined total.** There is no headline anywhere on this surface that
 *    adds `coins_earned_total` to `coins_pending`. A student reading this page
 *    sees two numbers under two headings, and the headings are what make the
 *    numbers mean anything.
 * 2. **Amber means a clock, and only here.** The `on-hold` group is the one
 *    place on this page where something is genuinely in progress, so it is the
 *    one place amber appears. The settled group is emerald because it landed.
 *    The not-confirmed group is gray because nothing is happening and nobody
 *    did anything wrong.
 * 3. **`icon + text + tone`, never colour alone.** Every group and every row
 *    carries a glyph and a sentence, so the page is readable in greyscale and by
 *    a screen reader. 06 §11.3 asks for exactly this.
 * 4. **A row with no name renders generically.** `ReferralCodeShare` numbers
 *    nothing and this neither: a list that invents "Friend 1" has invented a
 *    person.
 */
import React from "react";
import { Check, CircleDashed, Hourglass, Lock } from "lucide-react";
import { fmtCoins } from "@/components/coins/useCoinState";
import {
  buildReferralGroups,
  buildReferralRows,
  type ReferralGroupView,
  type ReferralRowView,
} from "@/components/coins/referralView";
import type { MyReferral, ReferralRowState, ReferralStats } from "@/services/coinsApi";

/**
 * Tone classes per 06 §6's per-referral table, with one change documented in
 * `referralView.ts`: the `failed` row is neutral gray rather than
 * `bg-red-50 text-red-700`, because 06 §0.4 reserves red for a failed fraud
 * check and a friend who never finished onboarding is not one.
 */
const TONE = {
  landed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  clock: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  neutral: "bg-gray-100 text-gray-600",
} as const;

type ToneKey = keyof typeof TONE;

/**
 * Row state → tone job, stated rather than assumed.
 *
 * The two vocabularies are deliberately different — a row is a `ReferralRowState`
 * and a tone is a colour job — and indexing one by the other is a type error for
 * a reason. The mapping is the assertion that these are the same three jobs:
 * settled is the landed job, a hold is the clock job, and both `not-confirmed`
 * and `capped` are neutral facts.
 *
 * `capped` is neutral for the same reason as `not-confirmed`: the monthly limit
 * is the product's, not a verdict on the student, so it is stated and not
 * dramatised.
 */
const ROW_TONE: Record<ReferralRowState, ToneKey> = {
  settled: "landed",
  "on-hold": "clock",
  "not-confirmed": "neutral",
  capped: "neutral",
};

const BADGE_BASE =
  "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold";

/** The glyph for each job. Never the only signal. */
const GROUP_ICON = {
  landed: Check,
  clock: Hourglass,
  neutral: CircleDashed,
} as const;

const ROW_ICON = {
  settled: Check,
  "on-hold": Hourglass,
  "not-confirmed": CircleDashed,
  capped: Lock,
} as const;

function CoinFigure({ coins }: { coins: number | null }) {
  // Null renders NOTHING rather than a zero. "0 StudsTokens" next to a
  // not-confirmed group would state a figure the server never sent, and a zero
  // on a money surface is a claim.
  if (coins === null) return null;
  return (
    <span className="text-sm font-bold tabular-nums text-gray-900">
      {fmtCoins(coins)}{" "}
      <span className="font-semibold text-gray-500">StudsTokens</span>
    </span>
  );
}

function Group({ group }: { group: ReferralGroupView }) {
  const Icon = GROUP_ICON[group.tone];
  return (
    <li className="flex flex-col gap-1.5 p-3 sm:flex-row sm:items-start sm:gap-3">
      <span
        className={`${BADGE_BASE} ${TONE[group.tone]} shrink-0`}
      >
        <Icon size={12} aria-hidden="true" />
        {group.count}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p className="text-sm font-semibold text-gray-900">{group.label}</p>
          <CoinFigure coins={group.coins} />
        </div>
        <p className="mt-0.5 text-xs leading-5 text-gray-600">{group.note}</p>
      </div>
    </li>
  );
}

function Row({ row }: { row: ReferralRowView }) {
  const Icon = ROW_ICON[row.state];
  return (
    <li className="p-3">
      {/*
        §6's row shape: a name and a badge on one line, and the rule on the next,
        indented under the name.

          Aarav Sharma   [Hourglass] Held until 22 November
          We confirm their first completed action before releasing...

        A single flex row cannot express that — the note would land to the RIGHT
        of the badge — so the header is its own flex row and the note is a sibling
        beneath it. Getting this wrong buries the honesty sentence at the end of a
        long line, which is the one place a sentence like that does not get read.
      */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
        {/*
          The name is never generated. With no name from the server the row says
          "Your friend" rather than a numbered placeholder, because a list that
          numbers its people has invented them.
        */}
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">
          {row.label || "Your friend"}
        </span>
        <span className={`${BADGE_BASE} ${TONE[ROW_TONE[row.state]]} shrink-0`}>
          <Icon size={12} aria-hidden="true" />
          {row.badge}
        </span>
      </div>
      {row.note && (
        <p className="mt-1 max-w-prose text-xs leading-5 text-gray-600">
          {row.note}
        </p>
      )}
    </li>
  );
}

export default function ReferralLedger({
  stats,
  rows,
}: {
  stats: ReferralStats;
  /** Optional. The page is complete without it; see `readMyReferrals`. */
  rows: MyReferral[] | null;
}) {
  const groups = buildReferralGroups(stats);
  const rowViews = buildReferralRows(rows ?? []);

  return (
    <div className="space-y-3">
      {/*
        The three groups, in a bordered list so they read as three rows of one
        ledger rather than three floating cards. Divided rather than gapped: they
        are parts of the same total and should look like parts of it.
      */}
      <ul className="divide-y divide-gray-100 rounded-md border border-gray-200 bg-white">
        {groups.map((group) => (
          <Group key={group.group} group={group} />
        ))}
      </ul>

      {/* Per-referral rows, only when the endpoint supplied any. */}
      {rowViews.length > 0 && (
        <ul className="divide-y divide-gray-100 rounded-md border border-gray-200 bg-white">
          {rowViews.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </ul>
      )}
    </div>
  );
}
