"use client";

/**
 * The referral page's section: one read of §2.4, one optional read of the
 * per-referral list, and the composition of the two.
 *
 * ## Where this page lives and why
 *
 * At `/user/dashboard/referral`, a sibling of `/user/dashboard/coins`, and not
 * at the `/referral` that 06 §6 names. Three reasons, in order of weight:
 *
 *  1. **The endpoint requires auth and the middleware is what supplies it.**
 *    `middleware.ts` matches `/user/dashboard/:path*` and nothing else that
 *    matters here, so a root-level `/referral` would be served to signed-out
 *    visitors, fail its own data read, and render an error to somebody who has
 *    simply not signed in yet. Every other per-student surface in this app is
 *    under `/user/dashboard/*` for exactly this reason.
 *  2. **The dashboard is where the navigation is.** `Sidebar.tsx` is how a
 *    signed-in student moves between their own pages, and a page no nav item
 *    points at is a dead end — the precise failure the previous slice fixed when
 *    the anti-dead-end link was given a destination that listens. So this page
 *    has a nav item, and `EarnRoutes` and the wallet's own "Invite a friend"
 *    row both point here.
 *  3. **It inherits the shell.** The dashboard layout supplies the header, the
 *    sidebar and the scroll container, so this is a page rather than a route
 *    that happens to render HTML.
 *
 * `/referral` still resolves, by redirecting here, so the URL in the spec
 * document and any link already pasted into a chat both land somewhere.
 *
 * ## The read
 *
 * §2.4 first, and it is the only source for the numbers on this page. The
 * per-referral list is a second, separate request whose absence changes nothing
 * that is rendered — see `readMyReferrals` in `services/coinsApi.ts` for why it
 * is read that way.
 *
 * The two are `Promise.allSettled` rather than a sequential await so a slow or
 * absent list endpoint never delays the page. That is the whole reason the
 * enrichment is allowed to exist: it cannot be on the critical path.
 */
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Info, RefreshCw, UserPlus } from "lucide-react";
import { useAuth } from "@/services/AuthContext";
import ReferralCodeShare from "@/components/coins/ReferralCodeShare";
import ReferralLedger from "@/components/coins/ReferralLedger";
import { COPY, CAP_REACHED, capLine, monthlyCap } from "@/components/coins/referralView";
import { SPEND_STATUS } from "@/components/coins/spendStatus";
import {
  coinsApi,
  type MyReferral,
  type ReferralSummary,
} from "@/services/coinsApi";

type Phase = "loading" | "ready" | "error";

interface ReferralPage {
  summary: ReferralSummary | null;
  rows: MyReferral[] | null;
}

/**
 * One read of the page, shared by the mount effect and the retry button so the
 * two cannot drift.
 *
 * `allSettled` rather than `all` because the two requests have different
 * consequences on failure. §2.4 failing means the page has no numbers and says
 * so; the per-referral list failing means the page is still complete, because
 * it is an enrichment and never a source of a figure. A rejected list must not
 * take the settled number down with it, and an unsettled list must not delay
 * it.
 */
async function readReferralPage(): Promise<ReferralPage> {
  const [summaryResult, rowsResult] = await Promise.allSettled([
    coinsApi.getReferralSummary(),
    coinsApi.listMyReferrals(),
  ]);
  return {
    summary: summaryResult.status === "fulfilled" ? summaryResult.value : null,
    rows: rowsResult.status === "fulfilled" ? rowsResult.value : null,
  };
}


/**
 * §6's cap meter.
 *
 * A `<meter>`-shaped bar, and it is informational rather than a progress bar
 * toward anything: there is no reward framing on this page, because there is no
 * reward. A bar that fills as the student invites more people, with a treat at
 * the end, is a different product from one that tells them where they stand
 * against a limit.
 *
 * Amber when the limit is reached, gray otherwise. Amber here is the same job
 * it has everywhere else in this feature — the clock is running, the window has
 * closed for this month — and the copy beside it says the same thing in words,
 * so the colour is never the only signal.
 */
function CapMeter({
  used,
  cap,
  percent,
  remaining,
}: {
  used: number;
  cap: number;
  percent: number;
  remaining: number;
}) {
  const capped = remaining === 0;
  return (
    <section className="rounded-md border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900">
          {capped ? CAP_REACHED : capLine(used, cap)}
        </h2>
        {capped && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
            Cap reached
          </span>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={cap}
        aria-valuenow={used}
        aria-valuetext={capLine(used, cap)}
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
      >
        <div
          className={`h-full rounded-full ${capped ? "bg-amber-500" : "bg-gray-400"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </section>
  );
}

export default function ReferralSection() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<ReferralSummary | null>(null);
  const [rows, setRows] = useState<MyReferral[] | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");

  /**
   * The retry, from the error card's own button rather than from a remount.
   *
   * Setting the phase to `loading` first is correct in an event handler, where
   * it costs one render. The mount effect deliberately does NOT call this — see
   * below.
   */
  const load = useCallback(() => {
    setPhase("loading");
    void readReferralPage().then((page) => {
      setSummary(page.summary);
      setRows(page.rows);
      // null is the error branch, not "you have no referrals". A student whose
      // read failed must not be shown an empty ledger, which is the one figure
      // this page must never invent.
      setPhase(page.summary ? "ready" : "error");
    });
  }, []);

  useEffect(() => {
    // `phase` starts as `loading` rather than being set to it here: a setState in
    // an effect body is a synchronous cascade, and there is nothing to cascade
    // from. This is the same reasoning, and the same shape, as
    // `WalletSection`'s mount read.
    let active = true;
    void readReferralPage().then((page) => {
      if (!active) return;
      setSummary(page.summary);
      setRows(page.rows);
      setPhase(page.summary ? "ready" : "error");
    });
    return () => {
      active = false;
    };
  }, []);

  // Behind the dashboard middleware, so a signed-out visitor is redirected
  // before this renders. Nothing rather than an empty ledger, for the same
  // reason the wallet renders nothing without a user.
  if (!user) return null;

  const cap = summary ? monthlyCap(summary.stats) : null;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">{COPY.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{COPY.subtitle}</p>
      </header>

      {phase === "loading" && (
        <div className="space-y-5" data-testid="referral-skeleton">
          <div className="h-56 animate-pulse rounded-md border border-gray-200 bg-white" aria-hidden="true" />
          <div className="h-20 animate-pulse rounded-md border border-gray-200 bg-white" aria-hidden="true" />
          <div className="h-48 animate-pulse rounded-md border border-gray-200 bg-white" aria-hidden="true" />
        </div>
      )}

      {phase === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4" role="alert">
          <p className="text-sm font-semibold text-red-700">
            We could not read your referral details.
          </p>
          <p className="mt-1 text-sm text-red-700">
            Nothing has changed on your account. Try again.
          </p>
          <button
            type="button"
            onClick={load}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            <RefreshCw size={13} aria-hidden="true" />
            Try again
          </button>
        </div>
      )}

      {phase === "ready" && summary && (
        <>
          <ReferralCodeShare
            code={summary.referral_code}
            link={summary.referral_link}
          />

          {cap && (
            <CapMeter
              used={cap.used}
              cap={cap.cap}
              percent={cap.percent}
              remaining={cap.remaining}
            />
          )}

          {summary.stats.invited === 0 ? (
            // §9's empty state: the sentence, and the share row above stays
            // fully interactive. A student with no invites yet has not failed at
            // anything, so nothing here is red and nothing is an error.
            <p className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              {COPY.noInvites}
            </p>
          ) : (
            <ReferralLedger stats={summary.stats} rows={rows} />
          )}

          {/*
            The one honest sentence about the gates, shared verbatim with the
            wallet by `spendStatus.ts` so the two cannot disagree.

            It is on this page as well as that one, and that is a departure from
            the wallet's "one statement, one place" note — which is about the
            HEADER, and stays true. This page is the other place a student is
            shown a StudsToken figure they might try to spend, and it is the page
            a student reaches having just been told that inviting a friend earns
            them coins. Omitting the caveat here does not leave the page neutral,
            it leaves the page making the claim by omission. The line below is
            gray with an information glyph, not amber: no clock is running on it.
          */}
          <p className="flex items-start gap-2 rounded-md bg-white p-3 text-xs leading-5 text-gray-600">
            <Info size={13} className="mt-0.5 shrink-0 text-gray-400" aria-hidden="true" />
            <span>{SPEND_STATUS}</span>
          </p>

          {/*
            The other thing a student on this page can do. Without it the page is
            a dead end at the bottom: you have come to earn, and the only way on
            from here is the sidebar.
          */}
          <Link
            href="/user/dashboard/coins"
            className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            <UserPlus size={14} aria-hidden="true" />
            See your StudsToken balance
          </Link>
        </>
      )}
    </div>
  );
}
