"use client";

/**
 * The header chip. The highest-risk surface in the feature, because it renders
 * on every page.
 *
 * ## THE DECISION: what the chip says when nothing can be bought
 *
 * Every gate is currently off. A student can earn 25 coins for a completed
 * profile and cannot spend one of them on anything, because the study-resource,
 * video and mock-test gates are all false and `unlock_endpoint_enabled` is
 * false. So the honest question is not "how do we show a balance" — it is
 * "what does a number mean when the only thing it can do is go up".
 *
 * **The chip shows the spendable balance, always, and never claims it is
 * spendable.** That is the decision, and the reasoning is:
 *
 * 1. **The number is true and it is the product's job to be true.** 06 §1.8 says
 *    "one number, always truthful". A student who earned 25 coins has 25 coins.
 *    Rendering nothing, or rendering a softened "0", tells them the earning
 *    mechanic did not work — which is the one thing that is definitely false,
 *    because the profile award landed yesterday and is paying out now.
 *
 * 2. **A hidden chip is a permanent regression, an early chip is a temporary
 *    embarrassment.** The gates are config booleans read at runtime. When they
 *    flip, a chip that was hidden has no discoverable surface on the day the
 *    product starts charging, and the fix is a deploy to every page. A chip that
 *    was already there needs nothing. The asymmetry is not close.
 *
 * 3. **What actually trains students to ignore a number is decoration, not
 *    absence.** The failure mode is a chip styled like a slot machine. So the
 *    chip is `text-xs`, gray, and looks like navigation — 06 §1.8's exact
 *    instruction. It is not the largest thing in the header and it is never
 *    animated except for the one `coin-pop` a landed grant earns.
 *
 * 4. **"What can I unlock" is NOT the more useful header content, and the
 *    brief's own framing is why.** When the answer is "everything", that link
 *    filter removes nothing, and 06 already has the precedent: the `?affordable=1`
 *    toggle is deliberately withheld while the gate is off, because "a control
 *    that provably removes nothing is not a control" (can-unlock/page.tsx:47).
 *    Promoting an always-true filter into the header of every page would make
 *    that same argument at ten times the exposure. The filter's home is the
 *    wallet's earn rail and the catalogue, where it earns its place by removing
 *    something.
 *
 * So the chip is a link, a number, and nothing else. The honesty about "not yet
 * spendable" lives on the wallet page, where there is room to state it once,
 * plainly, next to the routes that will make it true — rather than being
 * repeated on every page as a badge.
 *
 * ## The three states a header render can be in, and each one's answer
 *
 * **Signed out.** No fetch at all. The chip renders the "Earn StudsTokens" link
 * to `/login` (06 §2.2) and never calls `getBalance`, so there is no 401 to
 * suppress, no auth-expired event, and no wasted request on the majority of
 * page views. This is the cheapest of the three states and the one most likely
 * to be got wrong by fetching optimistically.
 *
 * The session arrives as a prop rather than from `useAuth`, deliberately: see
 * `CoinBalanceChipProps` below. Both hosts already have it.
 *
 * **Read failed.** 06 §9 is unambiguous: "**hidden.** A failed balance fetch must
 * not show `0`, which would be a lie; fall back to the link with no number."
 * The chip degrades to a link with the glyph and no number — still a working
 * route to the wallet, so a transient outage does not also remove the surface.
 * It never renders a zero and never renders an error in the header.
 *
 * **Slow.** The skeleton is a fixed `h-7 w-16` block (06 §9) and the chip's own
 * footprint is `shrink-0` with a reserved min-width, so a slow read occupies the
 * space the number will occupy. The header does not reflow when the number lands,
 * and the number arriving late never pushes the notification bell or the profile
 * menu sideways. A read that takes 4s shows a skeleton for 4s; a read that never
 * finishes is indistinguishable from a slow one, which is the correct rendering —
 * the chip simply never claims a number it does not have.
 *
 * ## Where the expiring state comes from
 *
 * `soonestExpiry` over the open lots, and the amount is the coins in the lots
 * that are inside the 7-day band — not the total balance. A chip reading "25
 * coins · 20 expiring" is a statement about the clock, and 06 §9 drops the
 * "20 expiring" text below `sm` leaving only the amber dot, so the number that
 * remains is always the balance.
 */
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Coins } from "lucide-react";
import { fmtCoins } from "@/components/coins/useCoinState";
import { daysLeft, hasExpiry } from "@/components/coins/expiry";
import { coinsApi, type CoinBalance } from "@/services/coinsApi";

/**
 * Where the chip goes when it is not showing a balance.
 *
 * `/login` rather than a next-parameterised URL: nothing in this app reads a
 * `next` param off the login page (checked — `app/login/page.tsx` takes no
 * `searchParams`), so sending one would look like a redirect that does not
 * happen. A promise the UI cannot keep is worse than no promise.
 */
export const SIGNED_OUT_HREF = "/login";

/** 06 §9's skeleton, verbatim: `h-7 w-16 animate-pulse rounded-md bg-gray-100`. */
const SKELETON = "h-7 w-16 animate-pulse rounded-md bg-gray-100";

/**
 * The chip's box. Fixed footprint and `shrink-0` because this is the whole
 * reason the slow case does not shift the header: the slot is reserved at the
 * same height and a floor on width whether it holds a skeleton, a number, or
 * nothing at all.
 */
const CHIP_BASE =
  "inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md " +
  "border px-2.5 text-xs transition-colors focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2";

/** Plain. A number is a fact, and a fact does not get a background. */
const CHIP_PLAIN = `${CHIP_BASE} border-gray-200 bg-white text-gray-700 hover:bg-gray-50`;

/** Expiring. Amber is the house's "the clock is running" tone (06 §0.4). */
const CHIP_EXPIRING =
  `${CHIP_BASE} border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 ` +
  "focus-visible:ring-amber-500";

/**
 * What one balance read resolves to for display.
 *
 * Kept as a pure function so the four branches — signed out, unread, failed,
 * read — are testable without a network, and so the accessible name is derived
 * from the same branch that chose the classes. Two derivations of "what does
 * this chip say" is exactly how a number and its label drift apart.
 */
export interface ChipView {
  /** What to render. `link` covers signed out, failed, and read. */
  kind: "skeleton" | "link";
  href: string;
  /** The balance, or null when there is nothing truthful to show. */
  total: number | null;
  /** Coins inside the amber window. Drives both the dot and the label. */
  expiring: number;
  /** True when `expiring > 0`, i.e. the amber treatment is warranted. */
  urgent: boolean;
  /** True when we are signed out, which changes the words. */
  signedOut: boolean;
}

export function resolveChipView(input: {
  signedIn: boolean;
  loading: boolean;
  balance: CoinBalance | null;
  /** False once a read has failed or come back empty. */
  readOk: boolean;
  now?: number;
}): ChipView {
  const now = input.now ?? Date.now();

  if (!input.signedIn) {
    return {
      kind: "link",
      href: SIGNED_OUT_HREF,
      total: null,
      expiring: 0,
      urgent: false,
      signedOut: true,
    };
  }

  // Only a signed-in student with a read still running gets the skeleton. A
  // failed or empty read is a link, not a pulse that never resolves.
  if (input.loading) {
    return {
      kind: "skeleton",
      href: "/user/dashboard/coins",
      total: null,
      expiring: 0,
      urgent: false,
      signedOut: false,
    };
  }

  // A read that failed, or came back with no readable wallet, renders no
  // number. Never 0 — a student with a full wallet and a flaky connection is
  // not a student with nothing (06 §9).
  if (!input.readOk || !input.balance) {
    return {
      kind: "link",
      href: "/user/dashboard/coins",
      total: null,
      expiring: 0,
      urgent: false,
      signedOut: false,
    };
  }

  // Only coins in lots inside the 7-day band count as expiring. The balance
  // itself is what the chip leads with; the amber figure is what the clock is
  // about, and conflating the two would put a deadline on coins that have none.
  const lots = input.balance.buckets ?? [];
  const expiring = lots.reduce((sum, lot) => {
    const balance = Math.max(0, Number(lot.balance) || 0);
    // `hasExpiry` first, not `daysLeft`. A lot with no expiry date returns 0
    // days from `daysLeft`, and 0 is inside the amber band — so testing the day
    // count alone would put every never-expiring lot in amber and report the
    // whole balance as about to lapse.
    if (!hasExpiry(lot.expires_at)) return sum;
    return daysLeft(lot.expires_at, now) <= 7 ? sum + balance : sum;
  }, 0);

  return {
    kind: "link",
    // 06 §2.2's expiring variant links to `?focus=expiring`, so a student who
    // presses the chip because something is running out arrives on the lots
    // with the amber ones in view rather than at the top of a page they have to
    // scroll to find. The wallet reads the param and nothing else.
    href:
      expiring > 0
        ? "/user/dashboard/coins?focus=expiring"
        : "/user/dashboard/coins",
    total: Math.max(0, Number(input.balance.total_available) || 0),
    expiring,
    urgent: expiring > 0,
    signedOut: false,
  };
}

/**
 * The accessible name.
 *
 * 06 §2.2: the name comes from `aria-label` on the container and the inner
 * spans are hidden, so a screen reader hears one sentence instead of a glyph, a
 * number, a dot and a phrase read as four unrelated things. A bare number with
 * no unit is the failure this prevents.
 */
export function chipLabel(view: ChipView): string {
  if (view.signedOut) return "Earn StudsTokens. Open your StudsTokens.";
  if (view.total === null) return "Open your StudsTokens.";
  if (view.urgent) {
    return `StudsToken balance: ${view.total}. ${view.expiring} expiring. Open your StudsTokens.`;
  }
  return `StudsToken balance: ${view.total}. Open your StudsTokens.`;
}

/**
 * The session, passed in rather than read from context.
 *
 * This is a deliberate exception to the "self-reads" pattern, and it is the
 * right one here for a reason that is not taste: `useAuth` THROWS when it is
 * called outside an `AuthProvider`, and this component mounts on every page.
 * Reading the session through context makes the header's most fragile element
 * also its most fragile to render anywhere the provider is absent — including
 * the navbar's own test, which renders `EducationNavbar` bare.
 *
 * Both hosts already hold the session and neither needs a new source for it:
 * `EducationNavbar` receives `user` as a prop from `navbar-wrapper.tsx`, and
 * `DashboardLayout`'s header already calls `useAuth` for the profile button.
 * The chip stays a dumb component with one input, per `studsnew/AGENTS.md`.
 */
export interface CoinBalanceChipProps {
  /**
   * The signed-in user, or null/undefined when signed out.
   *
   * Null means "signed out" for this component's purposes and nothing else: it
   * is never read as "a balance of zero".
   */
  user?: { id?: number } | null;
}

export default function CoinBalanceChip({ user }: CoinBalanceChipProps) {
  /**
   * The read is TAGGED with the user it belongs to, exactly as
   * `StudyResourcesPage` and `VideoLecturesPage` tag theirs.
   *
   * Two properties come out of that, and both are needed:
   *
   * - **Signing out clears the previous student's number for free.** There is no
   *   effect watching `signedIn` and clearing state; the tag simply stops
   *   matching, so the derivation below returns null. Without the tag this would
   *   put one account's balance in front of the next person at the same machine.
   * - **No setState runs synchronously in the mount effect.** The read is fired
   *   and the result arrives in the promise, which is where a network response
   *   belongs; there is no separate "loading" flag to flip on the way in, and
   *   "is it still loading" is derived from whether a tag for this user has
   *   landed yet.
   */
  const [read, setRead] = useState<{
    userId: number | null;
    balance: CoinBalance | null;
    /** Whether a read actually completed, as opposed to never having run. */
    settled: boolean;
  } | null>(null);

  const signedIn = Boolean(user);
  // `user.id` is optional on the session type. A session without one is not a
  // wallet we can attribute, so it is tagged null like the catalogue pages do.
  const userId = user?.id ?? null;
  const mine = read?.userId === userId ? read : null;

  useEffect(() => {
    if (!signedIn) return;
    let active = true;
    void coinsApi.getBalance().then((next) => {
      // null here is the failure branch: settled, but with no balance. The chip
      // renders the link with no number rather than a zero.
      if (active) setRead({ userId, balance: next, settled: true });
    });
    return () => {
      active = false;
    };
  }, [signedIn, userId]);

  const balance = mine?.balance ?? null;
  const settled = mine?.settled === true;

  const view = useMemo(
    () =>
      resolveChipView({
        signedIn,
        // A read that has not landed yet is the loading case, so the skeleton is
        // shown for exactly as long as the truth is unknown, and no longer.
        // There is no separate auth-bootstrapping flag: `user` being null is the
        // only answer this component has, and the hosts decide what a null user
        // means for them.
        loading: signedIn && !settled,
        balance,
        readOk: settled,
      }),
    [signedIn, settled, balance],
  );

  if (view.kind === "skeleton") {
    return (
      <span
        className={`${SKELETON} shrink-0`}
        aria-hidden="true"
        data-testid="coin-chip-skeleton"
      />
    );
  }

  return (
    <Link
      href={view.href}
      aria-label={chipLabel(view)}
      className={view.urgent ? CHIP_EXPIRING : CHIP_PLAIN}
      data-testid="coin-chip"
      data-urgent={view.urgent ? "true" : "false"}
    >
      <Coins size={14} aria-hidden="true" />
      {view.signedOut ? (
        <span className="font-semibold" aria-hidden="true">
          Earn StudsTokens
        </span>
      ) : (
        view.total !== null && (
          <span className="font-bold tabular-nums" aria-hidden="true">
            {fmtCoins(view.total)}
          </span>
        )
      )}
      {/*
        The amber dot survives below `sm` where the text does not (06 §9). It is
        `aria-hidden` because the accessible name above already says how much is
        expiring — a second announcement of the same fact is noise, and colour
        alone is not a state (06 §11.3).
      */}
      {view.urgent && (
        <>
          <span
            className="h-1 w-1 shrink-0 rounded-full bg-amber-600"
            aria-hidden="true"
          />
          <span className="hidden font-semibold sm:inline" aria-hidden="true">
            {fmtCoins(view.expiring)} expiring
          </span>
        </>
      )}
    </Link>
  );
}