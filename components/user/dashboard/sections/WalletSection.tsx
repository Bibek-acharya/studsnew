"use client";

/**
 * The wallet page: `grid-cols-1 lg:grid-cols-3` with the earn rail LAST in DOM
 * order (06 §2.3).
 *
 * ## The second half of the header decision, in one place
 *
 * The chip shows the spendable balance whether or not anything can be bought
 * with it, because a number that is true and a surface that already exists beat
 * a hidden affordance waiting for a config flag. That choice obliges this page
 * to say the quiet part out loud, exactly once, where there is room for it:
 *
 * > Right now you can earn StudsTokens but not spend them yet.
 *
 * Three properties make that line safe, and each one is a decision:
 *
 * 1. **It is on the wallet page, not the header.** Repeating it on every page
 *    turns a state into a campaign (06 §1.5). One statement, one place.
 * 2. **It states a fact about the product, not about the student.** No red, no
 *    urgency, no countdown, nothing that reads as a fine or a loss. It is
 *    gray prose with an amber-free treatment because there is no clock running
 *    on it.
 * 3. **It does not deny the balance is real.** It sits under a live number. A
 *    student with 25 coins is told they have 25 coins, and separately told what
 *    those coins can and cannot do yet. Hiding the number or softening it to a
 *    dash would be the actual lie; this sentence is the honest version of the
 *    same information.
 *
 * The alternative considered and rejected: hide the chip and the page entirely
 * until `unlock_endpoint_enabled` is true. It fails asymmetrically. If the chip
 * is hidden, the day an admin flips the boolean there is no discoverable surface
 * anywhere on the site — the fix is a deploy to every page, and the first
 * student to see a price is the first to see the currency for the first time.
 * If the chip is already there, flipping the boolean changes what the existing
 * surface *does*, which is a far smaller change than introducing one.
 *
 * ## What is on the page
 *
 * Order follows 06 §2.3: the allowance, then the ledger beside the earn rail,
 * then the history. `lg:col-span-2` for the ledger so the per-lot expiry column
 * is not squeezed, `lg:col-span-1` for the rail, and the rail is the LAST child
 * so mobile stacks it below the balance where the reading order matches it.
 */
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Coins, Info, RefreshCw } from "lucide-react";
import { useAuth } from "@/services/AuthContext";
import StarterAllowanceCard from "@/components/coins/StarterAllowanceCard";
import TransactionJournal from "@/components/coins/TransactionJournal";
import WalletExpiryStamp from "@/components/coins/WalletExpiryStamp";
import { AFFORDABLE_CATALOGUE_HREF } from "@/components/coins/EarnRoutes";
import { SPEND_STATUS } from "@/components/coins/spendStatus";
import { daysLeft } from "@/components/coins/expiry";
import { fmtCoins } from "@/components/coins/useCoinState";
import { coinsApi, type CoinBalance } from "@/services/coinsApi";

type Phase = "loading" | "ready" | "error";

/**
 * The one honest sentence about the gates.
 *
 * Moved to `components/coins/spendStatus.ts` and imported rather than declared
 * here, because the referral page shows a StudsToken figure too and two copies
 * of this sentence would be free to drift apart. A drift here is not a typo, it
 * is a promise the platform stops keeping. The wording is unchanged.
 *
 * "Not switched on yet" rather than a date, because nobody has committed to a
 * date and 09 §"What support must never promise" is explicit that there is no
 * commitment to when a gate flips. A date here would be invented, and it is the
 * single line on this page most likely to end up wrong.
 */

export default function WalletSection() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<CoinBalance | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");

  /**
   * A manual re-read, from the header's own button rather than from an effect.
   *
   * It is deliberately the same body as the mount read rather than a call to a
   * shared helper: this is an event handler, where setting the loading phase
   * first is correct and costs one render, whereas the same call inside the
   * effect would be a synchronous cascade before anything has been drawn.
   */
  const refresh = useCallback(() => {
    setPhase("loading");
    void coinsApi.getBalance().then((next) => {
      setBalance(next);
      // null is the error branch, not an empty wallet. A student with a full
      // wallet and a dropped connection is not a student with nothing.
      setPhase(next ? "ready" : "error");
    });
  }, []);

  /**
   * The read on mount.
   *
   * `phase` starts at `loading` rather than being set to it inside the effect: a
   * setState in an effect body is a synchronous cascade, and there is nothing to
   * render between mounting and the first response anyway. The result arrives in
   * the promise, which is where a network response belongs.
   */
  useEffect(() => {
    let active = true;
    void coinsApi.getBalance().then((next) => {
      if (!active) return;
      setBalance(next);
      setPhase(next ? "ready" : "error");
    });
    return () => {
      active = false;
    };
  }, []);

  // Signed out there is no wallet to read, and the page is behind the dashboard
  // middleware anyway. Render nothing rather than an empty balance of zero,
  // which is the one figure this page must never invent.
  if (!user) return null;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">StudsTokens</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your balance, where each part of it expires, and every transaction on
          it.
        </p>
      </header>

      <StarterAllowanceCard allowance={balance?.allowance ?? null} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* The ledger. Two of three columns because it carries a per-lot expiry
            column and a number column, and one column makes both unreadable. */}
        <section
          aria-labelledby="wallet-balance-heading"
          className="lg:col-span-2 rounded-md border border-gray-200 bg-white p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <h2
              id="wallet-balance-heading"
              className="text-base font-semibold text-gray-900"
            >
              StudsToken balance, by expiry
            </h2>
            {phase === "ready" && (
              <button
                type="button"
                onClick={refresh}
                aria-label="Refresh your StudsToken balance"
                className="shrink-0 rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
              >
                <RefreshCw size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          {phase === "loading" && (
            <div className="mt-4">
              <div
                className="h-8 w-24 animate-pulse rounded-md bg-gray-100"
                aria-hidden="true"
              />
              <ul className="mt-4 space-y-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <li
                    key={index}
                    data-testid="wallet-lot-skeleton"
                    className="h-11 animate-pulse rounded-md bg-gray-100"
                  />
                ))}
              </ul>
            </div>
          )}

          {phase === "error" && (
            <div
              className="mt-4 rounded-md border border-red-200 bg-red-50 p-4"
              role="alert"
            >
              <p className="text-sm font-semibold text-red-700">
                We could not read your StudsToken balance.
              </p>
              <p className="mt-1 text-sm text-red-700">
                Nothing has changed on your account. Try again.
              </p>
              <button
                type="button"
                onClick={refresh}
                className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
              >
                <RefreshCw size={13} aria-hidden="true" />
                Try again
              </button>
            </div>
          )}

          {phase === "ready" && balance && (
            <Ledger balance={balance} />
          )}
        </section>

        {/* The earn rail. LAST in DOM order on purpose: on mobile it stacks
            below the balance, which is the order a student reads in — what you
            have, then what to do about it. */}
        <aside
          aria-labelledby="wallet-earn-heading"
          className="lg:col-span-1 rounded-md border border-gray-200 bg-gray-50 p-5"
        >
          <h2
            id="wallet-earn-heading"
            className="flex items-center gap-2 text-base font-semibold text-gray-900"
          >
            <Coins size={16} className="text-gray-400" aria-hidden="true" />
            Ways to earn
          </h2>

          {/*
            The spend-status line. Info-tinted, not amber: amber means the clock
            is running on the student's coins, and no clock is running here. This
            is a neutral fact about the product, so it is neutral grey with an
            information glyph. See the file header for why it is here at all.
          */}
          <p className="mt-3 flex items-start gap-2 rounded-md bg-white p-3 text-xs leading-5 text-gray-600">
            <Info size={13} className="mt-0.5 shrink-0 text-gray-400" aria-hidden="true" />
            <span>{SPEND_STATUS}</span>
          </p>

          {/*
            The route list. No `EarnRoutes` here, deliberately: that component
            takes its values from a 402 body's `ways_to_earn`, and this page has
            no shortfall so it has no 402. Inventing the three figures here from
            the launch values in the docs is exactly the drift `EarnRoutes`
            exists to prevent — a student whose profile is already complete must
            never be shown a profile route.

            So this is navigation, not arithmetic: where each route lives, with
            no number beside it. The referral route now has a page of its own at
            `/user/dashboard/referral` — that is the one change the referral slice
            made here. It did NOT replace this list with `EarnRoutes`, because the
            blocker was never the absence of a referral page: it is the absence of
            a 402 body, and this page has no shortfall and therefore no
            `ways_to_earn`. Replacing the list would need the economy to answer a
            question this page cannot ask.
          */}
          <ul className="mt-4 space-y-2">
            {[
              {
                label: "Complete your profile",
                href: "/user/dashboard/profile",
                cta: "Open",
              },
              {
                label: "Invite a friend",
                href: "/user/dashboard/referral",
                cta: "Invite",
              },
              {
                label: "Upload a study resource",
                href: "/user/dashboard/coins",
                cta: "Upload",
              },
            ].map((route) => (
              <li
                key={route.label}
                className="flex items-center justify-between gap-3 rounded-md bg-white p-3"
              >
                <span className="min-w-0 truncate text-sm font-semibold text-gray-900">
                  {route.label}
                </span>
                <Link
                  href={route.href}
                  className="shrink-0 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                >
                  {route.cta}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={AFFORDABLE_CATALOGUE_HREF}
            className="mt-4 flex items-center justify-between gap-2 rounded-md bg-white p-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            Browse resources
            <span className="text-gray-400" aria-hidden="true">
              →
            </span>
          </Link>
        </aside>
      </div>

      <section
        aria-labelledby="wallet-history-heading"
        className="rounded-md border border-gray-200 bg-white p-5"
      >
        <h2
          id="wallet-history-heading"
          className="text-base font-semibold text-gray-900"
        >
          Transaction history
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Every change to your balance, newest first.
        </p>
        <div className="mt-4">
          <TransactionJournal />
        </div>
      </section>
    </div>
  );
}

/**
 * The lots.
 *
 * Sorted the way the backend sorted them: `spend_order` is already FEFO and the
 * buckets arrive in that order too (`sortBucketsFEFO`, unlock_api.go), so this
 * renders the order it was given and never re-sorts. Sorting client-side would
 * be a second implementation of FEFO, and the ledger's whole job is to teach
 * FEFO by being in the order the money actually leaves in.
 *
 * **Expired lots are not rendered, and never as a tombstone.** 06 §2.3: no
 * struck-through rows, no greyed-out ghosts. A ledger of what you lost is a
 * scold, and the figure has already left the total. The backend also excludes
 * them from the open-lot query, so an expired lot does not arrive here at all —
 * which means "silently passing" is handled at the query, not by this component.
 *
 * **The total is `aria-live="polite"`** (06 §11.5) so a spend is announced. It is
 * the only live region on the page: a live region per ledger row would read the
 * whole table on every refresh.
 */
function Ledger({ balance }: { balance: CoinBalance }) {
  const lots = balance.buckets ?? [];
  const total = Math.max(0, Number(balance.total_available) || 0);
  const reserved = Math.max(0, Number(balance.total_reserved) || 0);

  // Held coins are shown as their own line and never folded into the total.
  // 06 §1.7: a pending hold is "held until a date", never a loss and never part
  // of the balance. §2.4 makes `total_reserved` this figure precisely so the
  // two cannot disagree.
  const heldShown = reserved > 0;

  if (lots.length === 0 && !heldShown) {
    return (
      <div className="mt-4">
        <p
          className="text-3xl font-bold tabular-nums text-gray-900"
          aria-live="polite"
          aria-atomic="true"
        >
          0
          <span className="ml-2 text-sm font-semibold text-gray-500">
            StudsTokens
          </span>
        </p>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          You have no StudsTokens yet. Complete your profile, invite a friend, or
          upload a study resource to start.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p
        className="text-3xl font-bold tabular-nums text-gray-900"
        aria-live="polite"
        aria-atomic="true"
      >
        {fmtCoins(total)}
        <span className="ml-2 text-sm font-semibold text-gray-500">StudsTokens</span>
      </p>

      <ul className="mt-4">
        {lots.map((lot) => {
          const amount = Math.max(0, Number(lot.balance) || 0);
          const days = daysLeft(lot.expires_at);
          return (
            <li
              key={lot.bucket}
              className="flex items-center justify-between gap-3 border-b border-gray-100 py-2.5 last:border-b-0"
            >
              <span className="flex min-w-0 items-center gap-2 text-sm">
                <span className="font-bold tabular-nums text-gray-900">
                  {fmtCoins(amount)}
                </span>
                <Coins size={13} className="text-gray-400" aria-hidden="true" />
                <span className="sr-only">coins</span>
                {/*
                  The bucket name as a bucket name. "from your profile" and
                  "from referrals" are 06 §10's strings, but a bucket on the
                  balance endpoint is `FREE`/`EARNED` — a ledger category, not a
                  source. Mapping EARNED onto "from your profile" would be a lie
                  for a student whose coins came from an upload, so the source is
                  read from the transaction history instead, where the server
                  writes the real reason. The bucket is a fact and is shown as one.
                */}
                <span className="truncate text-gray-500">
                  {lot.bucket === "EARNED" ? "earned" : lot.bucket === "FREE" ? "included with your account" : lot.bucket.toLowerCase()}
                </span>
                {typeof lot.lot_count === "number" && lot.lot_count > 1 && (
                  <span className="shrink-0 text-xs text-gray-500">
                    across {lot.lot_count} lots
                  </span>
                )}
              </span>
              <span className="shrink-0 text-xs">
                <WalletExpiryStamp expiresAt={lot.expires_at} />
                {/* The band boundary is stated as words, not implied by colour.
                    A student inside the window should not have to know that
                    amber means "seven days" to know they have seven days. */}
                {days === 7 && (
                  <span className="sr-only">
                    This is the last week before it expires.
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {heldShown && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-md bg-amber-50 p-3 ring-1 ring-amber-200">
          <span className="text-sm text-amber-700">
            <span className="font-bold tabular-nums">{fmtCoins(reserved)}</span>{" "}
            StudsTokens held for invites
          </span>
          <span className="shrink-0 text-xs font-semibold text-amber-700">
            Added after we confirm
          </span>
        </div>
      )}

      {/*
        06 §2.3's one footnote. Not a policy link, not a terms page: "we spend the
        coins that expire soonest first" is the only sentence that makes the
        order above legible, and it is the sentence that stops a student reading
        the ledger as arbitrary.
      */}
      <p className="mt-4 border-t border-gray-100 pt-3 text-xs leading-5 text-gray-500">
        We spend the StudsTokens that expire soonest first, so nothing is wasted.
      </p>
    </div>
  );
}