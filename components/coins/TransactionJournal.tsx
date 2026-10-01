"use client";

/**
 * The transaction history: §2.2, cursor-paginated.
 *
 * ## Why append and not paginate
 *
 * The cursor is a keyset on `(created_at, id)`, not an offset, because an
 * OFFSET re-reads and re-skips rows when a new journal lands mid-scroll (03 §2.2).
 * A numbered pager built on top of a keyset would be lying about position: page
 * 2 of 4 means nothing when the set is changing underneath it. So "Load more"
 * appends the next page to what is already on screen, and each page's rows stay
 * where the server put them.
 *
 * The cursor itself is treated as opaque. It is base64url of a two-field key
 * whose shape the backend is free to change, and this component never builds
 * one, decodes one, or compares one to a row — it only ever hands the previous
 * response's string back. 06 §2.2's worked example decodes to `{created_at}`
 * alone, which is not unique; depending on either shape would be depending on
 * both being wrong.
 *
 * ## Why the amount is rendered signed and never colour-coded by direction alone
 *
 * `amount` is signed from the caller's perspective. A grant is positive, a spend
 * negative, a clawback negative again. The sign is drawn as a literal `+`/`−`
 * before the number, so the direction is carried by text and not only by
 * position or colour — emerald for a grant and neutral gray for a spend, which
 * is the §0.4 semantic map, and red is nowhere near it because a spend is the
 * normal case and a clawback is stated in words beside the amount.
 *
 * A reversal appears as its own row (03 §2.2), never as an edit to the row it
 * reverses, so a student who disputes a clawback can see both sides. The
 * `reversed` flag additionally marks the ORIGINAL row as reversed, because the
 * student reading the page needs to know that the grant above is no longer
 * standing — that flag alone, without a reversal row beside it, would be a
 * number silently changing.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react";
import { coinsApi, type CoinTransaction } from "@/services/coinsApi";
import { fmtCoins } from "@/components/coins/useCoinState";

const PAGE_SIZE = 20;

type Phase = "loading" | "ready" | "error";

function formatWhen(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  // Date and time, no relative phrase. "3 hours ago" on a balance ledger is the
  // same fake-clock pressure 06 §1.4 rules out for expiry.
  return parsed.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}



/**
 * The plain-language reason, derived from the server's own `reason_code`.
 *
 * The server also sends a `description` and the backend substitutes a resource
 * title into it for unlocks (`describeUnlocked`). It is preferred when present
 * because it is the richer sentence, and this is a fallback for the cases where
 * it is absent or still a raw code. These are the codes §3.1 defines; an
 * unrecognised one renders as itself rather than as a guess, because a wrong
 * reason on a balance line is the thing support cannot defend (09 §"The balance
 * trap").
 */
const REASON_TEXT: Record<string, string> = {
  PROFILE_COMPLETE: "Profile progress",
  REFERRAL_QUALIFIED: "Referral confirmed",
  RESOURCE_APPROVED: "Your upload was published",
  RESOURCE_UNLOCK: "Unlock",
  REFERRAL_HOLD: "Referral on hold",
  GRANT_REVERSAL: "Reversed",
};

function describe(row: CoinTransaction): string {
  const described = row.description.trim();
  // The backend's fallback for an unknown code is the raw code itself, so a
  // description that looks like one is replaced rather than shown as jargon.
  const looksLikeRawCode =
    described.length > 0 &&
    !/\s/.test(described) &&
    described === described.toUpperCase() &&
    /^[A-Z_]+$/.test(described);
  if (described && !looksLikeRawCode) return described;
  return REASON_TEXT[row.reason_code] ?? row.reason_code ?? "Adjustment";
}

export default function TransactionJournal() {
  const [rows, setRows] = useState<CoinTransaction[]>([]);
  // Opaque. Whatever the server sent, handed back verbatim, never inspected.
  const [cursor, setCursor] = useState("");
  const [hasMore, setHasMore] = useState(false);
  // Starts at `loading` rather than being set to it inside the mount effect: a
  // setState in an effect body is a synchronous re-render cascade, and there is
  // nothing to render between "mounting" and "first page" anyway. The retry
  // handler sets it from an event, where a state change belongs.
  const [phase, setPhase] = useState<Phase>("loading");
  const [loadingMore, setLoadingMore] = useState(false);

  // Guards a slow page 2 from landing after a fast page 2, which would append
  // the same rows twice. The cursor is per-response state, so the check is on
  // the token we asked with rather than on a counter.
  const inFlight = useRef<string | null>(null);

  /**
   * The first page, read in the mount effect.
   *
   * Declared inside the effect rather than pulled out into a `useCallback` for
   * two reasons. The call only touches state after its `await` resolves, so the
   * effect is a subscription to the network rather than a synchronous render
   * cascade; and a stable callback shared with the "Load more" handler would
   * have to be a dependency of this effect, which re-reads page 1 whenever
   * anything about it changes.
   *
   * `load` below is the same body, minus the mount, for the button.
   */
  useEffect(() => {
    let active = true;
    void coinsApi
      .listTransactions({ limit: PAGE_SIZE })
      .then((page) => {
        if (!active) return;
        // null is the failure branch. It must not be rendered as an empty
        // history: "you have no transactions" and "we could not read your
        // history" are different sentences, and a student who is owed an
        // explanation for a missing grant is owed the truth about which one
        // this is.
        if (!page) {
          setPhase("error");
          return;
        }
        setRows(page.items);
        setCursor(page.next_cursor);
        setHasMore(page.next_cursor !== "");
        setPhase("ready");
      });
    return () => {
      active = false;
    };
  }, []);

  /**
   * Append the next page.
   *
   * `inFlight` guards against a double click appending the same page twice, and
   * the key it holds is the cursor we asked WITH — so the guard is per-request,
   * not a counter that a slow-then-fast pair could satisfy out of order.
   */
  const load = useCallback(async (from: string) => {
    if (inFlight.current === from) return;
    inFlight.current = from;
    const page = await coinsApi.listTransactions({
      cursor: from,
      limit: PAGE_SIZE,
    });
    inFlight.current = null;
    if (!page) {
      setPhase("error");
      return;
    }
    setRows((current) => [...current, ...page.items]);
    setCursor(page.next_cursor);
    setHasMore(page.next_cursor !== "");
  }, []);

  if (phase === "loading") {
    return (
      <div aria-busy="true" aria-label="Loading your StudsToken history">
        <ul className="space-y-2" data-testid="journal-skeleton">
          {Array.from({ length: 4 }, (_, index) => (
            <li
              key={index}
              className="h-11 animate-pulse rounded-md bg-gray-100"
              data-testid="journal-skeleton-row"
            />
          ))}
        </ul>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div
        className="rounded-md border border-red-200 bg-red-50 p-4"
        role="alert"
      >
        <p className="text-sm font-semibold text-red-700">
          We could not read your StudsToken history.
        </p>
        <p className="mt-1 text-sm text-red-700">
          Nothing has changed on your balance. Try again.
        </p>
        <button
          type="button"
          onClick={() => {
            // A retry is a FRESH first-page read, not a re-request of the
            // cursor, because a failure can be a rejected cursor and re-sending
            // the same opaque token would just fail again.
            setRows([]);
            setCursor("");
            setHasMore(false);
            setPhase("loading");
            void coinsApi.listTransactions({ limit: PAGE_SIZE }).then((page) => {
              if (!page) {
                setPhase("error");
                return;
              }
              setRows(page.items);
              setCursor(page.next_cursor);
              setHasMore(page.next_cursor !== "");
              setPhase("ready");
            });
          }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
        >
          <RefreshCw size={13} aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
        No StudsToken transactions yet. Your balance changes here when you earn
        or spend, and every entry is kept.
      </p>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-gray-100">
        {rows.map((row) => {
          const credit = row.amount > 0;
          const debit = row.amount < 0;
          const when = formatWhen(row.created_at);
          return (
            <li
              key={row.journal_id}
              className="flex items-start justify-between gap-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm text-gray-900">
                  {credit && (
                    <ArrowDownLeft
                      size={13}
                      className="shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                  )}
                  {debit && (
                    <ArrowUpRight
                      size={13}
                      className="shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate">{describe(row)}</span>
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{when}</p>
                {/*
                  The reversal marker on the original row. Without it, a student
                  scrolling past a clawed-back grant sees a positive amount and
                  no indication it no longer stands. Worded as a fact in gray,
                  never red: the reversal is already in the list as its own row
                  with its own amount, and colouring this one red would make a
                  routine audit line look like an accusation.
                */}
                {row.reversed && (
                  <p className="mt-1 text-xs font-semibold text-gray-500">
                    This entry was reversed. The reversal is listed as its own
                    entry.
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p
                  className={`text-sm font-bold tabular-nums ${
                    credit ? "text-emerald-700" : "text-gray-900"
                  }`}
                >
                  {credit ? "+" : debit ? "−" : ""}
                  {fmtCoins(Math.abs(row.amount))}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  Balance {fmtCoins(row.balance_after)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {hasMore && (
        <button
          type="button"
          disabled={loadingMore}
          aria-busy={loadingMore}
          onClick={() => {
            setLoadingMore(true);
            void load(cursor).finally(() => setLoadingMore(false));
          }}
          className="mt-3 w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
        >
          {loadingMore ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}