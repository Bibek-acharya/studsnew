/**
 * The referral view model: §2.4's facts turned into words, in one place.
 *
 * ## What this file is for
 *
 * The numbers are not the hard part of this feature. The hard part is that two
 * of them mean different things to the same student, and the difference is
 * seven days long.
 *
 * §2.4 sends `coins_earned_total` and `coins_pending`, and the second is the
 * ledger's `reserved` balance — real StudsTokens, already set aside, not yet
 * released. The obvious page renders a single headline: "3 referrals, 180
 * coins". That sentence is false in three ways at once. It implies the 180 is
 * in the balance when it is not spendable. It implies all three referrals paid
 * when some are in a hold that may not release. And it is a number the student
 * will check against their wallet in a week and find does not match — which is
 * the moment they stop believing every other figure on the product.
 *
 * So there is no combined figure anywhere on this surface, by construction. The
 * settled number and the held number are different fields, rendered in different
 * groups, under different words, in different colours, and are never added
 * together by any function in this file. §2.4's guarantee that `coins_pending`
 * is the `reserved` balance — "so it can never disagree with
 * `GET /coins/balance`" — is exactly what makes the split honest rather than
 * merely cautious: the two figures on this page are the two figures in the
 * wallet.
 *
 * ## The three groups, and why the third one is neutral grey
 *
 * 06 §6's per-referral table has a `failed` state in `bg-red-50 text-red-700`.
 * This file does not use red for it, and the disagreement is deliberate.
 *
 * 06 §0.4's own semantic map reserves red for "destructive, rejection, failed
 * fraud check", and 06 §1 states principle 7 as "a pending hold is never
 * described as a loss … the student is not scolded for inviting someone". A
 * friend who signed up and never finished onboarding has done nothing wrong, and
 * neither has the student who invited them. Red against a name says otherwise:
 * it reads as a failed fraud check, and it tells a student their invite was a
 * mistake. So `not-confirmed` is neutral gray, the count is stated, and the
 * reason is stated once in plain words.
 *
 * ## Is a non-qualifying referral better shown as nothing at all?
 *
 * Half of this feature says hide it: 06 §1.7's "never scolded for inviting
 * someone", and the appeal of a clean list where everything in it worked. The
 * other half says show it, and the second half wins here, for one reason —
 * arithmetic.
 *
 * `invited` is 14. Nine are in the settled group and three are on hold. The
 * remaining two have to appear somewhere. If they do not, a student counting
 * their own invites finds two invites that went nowhere and no explanation,
 * which is not reassurance, it is a hole — and the hole becomes a support
 * ticket phrased as "where did my other two go", and a page that cannot answer
 * a question a student can see they are asking is the dishonest outcome, not the
 * tidy one.
 *
 * So they are shown, as a count, in a third group, in neutral grey, with the
 * reason given in a sentence and no per-person scolding. What is withheld is
 * the per-name red row. The reconciliation is visible; the accusation is not.
 */

import { fmtCoins } from "@/components/coins/useCoinState";
import type { MyReferral, ReferralRowState, ReferralStats } from "@/services/coinsApi";

/* ── Copy ──────────────────────────────────────────────────────────────────
 *
 * Every student-facing string for this surface, so that none of them is written
 * twice and the tests can assert against the same constants the page renders.
 *
 * Checked against `09-support-copy-cheat-sheet.md`: no "free", no currency
 * beside a coin count, no prize/award/win/raffle/draw, no exclamation marks,
 * British-leaning spelling, no second-person excitement, and no promised date.
 */

/**
 * 06 §10's deck says "60 StudsTokens for each friend who completes their first
 * action", and the 60 is dropped.
 *
 * `referral_referrer` is an economy config value (`03` §3.1) and §2.4 does not
 * return it, so writing 60 into this page is a copy that is wrong the day an
 * admin changes the award — the same rot `EarnRoutes` was built to prevent,
 * where a value copied out of configuration tells a student about an award that
 * has moved. The per-referral figure is not derived either: dividing
 * `coins_earned_total` by `qualified` is the client computing an economy number,
 * which is the one thing `services/coinsApi.ts` exists to refuse. So the promise
 * is made without a figure and every figure on the page is one the server sent.
 */
export const COPY = {
  title: "Invite a friend",
  subtitle: "Your code, and what has happened to each invite.",
  headline: "You get StudsTokens for each friend who completes their first action.",
  codeLabel: "Your referral code",
  copy: "Copy code",
  copied: "Copied",
  copiedToast: "Referral code copied.",
  shareHeading: "Share",
  shareWhatsApp: "WhatsApp",
  shareViber: "Viber",
  shareFacebook: "Facebook",
  shareEmail: "Email",
  copyLink: "Copy link",
  linkCopiedToast: "Referral link copied.",
  noInvites: "No invites yet.",
  /** §10's pre-filled message, which the STUDENT sends, so first person. */
  shareMessage: "I'm studying on StudSphere. Join me with my code {CODE}: {LINK}",
  spendNote:
    "Right now you can earn StudsTokens but not spend them yet. Everything you earn is kept, and it starts unlocking resources when that switches on.",
} as const;

/** §6's cap line, with the reset stated as a cycle rather than a date. */
export const capLine = (used: number, cap: number): string =>
  `${fmtCoins(used)} of ${fmtCoins(cap)} used this month · resets next month`;

/**
 * §10: "You've reached the monthly invite limit. It resets on {date}."
 *
 * Without the date, because §2.4 sends no reset date and this feature does not
 * promise one. "Next month" is a statement about the cycle the student is
 * already inside; a date would be a commitment nobody has made, and 09 is
 * explicit that support must never promise one.
 */
export const CAP_REACHED =
  "You've reached the monthly invite limit. It resets next month.";

/**
 * §6's honesty sentence, verbatim except that the amount is not in it.
 *
 * The original names "these 60 coins"; 60 is a config value this page does not
 * have (§ COPY.headline), and the sentence is about the RULE, not the figure —
 * "if they don't complete one, these StudsTokens are not released" says the
 * same thing and cannot go stale.
 */
export const HOLD_RULE =
  "We confirm their first completed action before releasing. If they don't complete one, these StudsTokens are not released.";

/** The three groups, and the tone each one is allowed. */
export type ReferralGroup = "settled" | "on-hold" | "not-confirmed";

export interface ReferralGroupView {
  group: ReferralGroup;
  /**
   * The colour job, named as the job and not as a hue.
   *
   * `settled` → emerald, "this landed". `on-hold` → amber, "the clock is
   * running". `not-confirmed` → gray, "here is a fact". Never rose: nothing on
   * this surface is "you cannot have this yet", which is what rose means in this
   * product (06 §0.4).
   */
  tone: "landed" | "clock" | "neutral";
  /** The group heading. */
  label: string;
  /** The count sentence. "1 confirmed" needs no plural handling, by design. */
  count: string;
  /** The server's figure for this group, or null when the server sent none. */
  coins: number | null;
  /** One sentence of plain explanation. Never a promise, never a scolding. */
  note: string;
}

/**
 * The monthly cap, reconstructed from two facts the server sent.
 *
 * `03` §3.1 has `referral.monthly_cap` as config, and §2.4 sends
 * `monthly_cap_remaining` and `this_month_qualified` but not the cap itself.
 * The total is their sum, which is a reconstruction rather than an invention —
 * both terms are server-reported and the server keeps them consistent — and it
 * is the only arithmetic in this file. It exists because §6 wants a meter, and a
 * meter needs a denominator.
 *
 * A cap of zero (both terms zero, which means a misconfigured economy rather
 * than a student at their limit) returns null so the page renders no meter
 * instead of "0 of 0 used this month", which would be a claim about a limit
 * that does not exist.
 */
export function monthlyCap(
  stats: ReferralStats,
): { used: number; cap: number; remaining: number; percent: number } | null {
  const used = Math.max(0, Math.round(stats.this_month_qualified));
  const remaining = Math.max(0, Math.round(stats.monthly_cap_remaining));
  const cap = used + remaining;
  if (cap <= 0) return null;
  const percent = Math.max(0, Math.min(100, Math.round((used / cap) * 100)));
  return { used, cap, remaining, percent };
}

/**
 * Turn §2.4's stats into the three groups.
 *
 * Order is the argument: settled first because it is the only money in the
 * balance, then the hold because it is the thing the student is waiting on, then
 * the count that reconciles the arithmetic. A page led by the hold would be
 * leading with the absence of something.
 */
export function buildReferralGroups(stats: ReferralStats): ReferralGroupView[] {
  return [
    {
      group: "settled",
      tone: "landed",
      label: "Added to your balance",
      count: `${fmtCoins(stats.qualified)} confirmed`,
      coins: stats.coins_earned_total,
      note: "These StudsTokens are in your balance now.",
    },
    {
      group: "on-hold",
      tone: "clock",
      label: "On hold",
      count: `${fmtCoins(stats.pending)} on hold`,
      coins: stats.coins_pending,
      // The lead clause is the one doing the work: "not in your balance yet"
      // next to a number is what stops this group being read as money.
      note: `Not in your balance yet. ${HOLD_RULE}`,
    },
    {
      group: "not-confirmed",
      tone: "neutral",
      label: "Not confirmed",
      count: `${fmtCoins(stats.rejected)} not confirmed`,
      coins: null,
      note: "Not every invite finishes onboarding. Nothing was added for these.",
    },
  ];
}

/** A per-referral row, as 06 §6 draws it: `icon + text + tone`. */
export interface ReferralRowView {
  id: string;
  label: string;
  state: ReferralRowState;
  /** The badge sentence. A date only when the server reported one. */
  badge: string;
  /** §6's second line, on held rows only. */
  note: string | null;
}

/** The badge for one row state, and the date only where there is one to show. */
function rowBadge(state: ReferralRowState, holdUntil: string | null): string {
  if (state === "on-hold") {
    return holdUntil ? `Held until ${holdUntil}` : "On hold";
  }
  if (state === "settled") return "Added to your balance";
  if (state === "capped") return "Cap reached";
  return "Not confirmed";
}

/**
 * The rows, in the order a student cares about: money first, then the wait,
 * then the rest. Sorted here rather than in the component so the ordering is
 * testable and cannot drift between render paths.
 */
export function buildReferralRows(rows: MyReferral[]): ReferralRowView[] {
  const order: Record<ReferralRowState, number> = {
    settled: 0,
    "on-hold": 1,
    "not-confirmed": 2,
    capped: 3,
  };
  return [...rows]
    .sort((a, b) => order[a.state] - order[b.state])
    .map((row) => ({
      id: row.id,
      label: row.label,
      state: row.state,
      badge: rowBadge(row.state, row.holdUntil),
      note: row.state === "on-hold" ? HOLD_RULE : null,
    }));
}
