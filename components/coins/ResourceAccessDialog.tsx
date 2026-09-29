"use client";

/**
 * The one place a download or a watch is attempted, and every outcome it can
 * have.
 *
 * The gate returns four distinguishable answers (03 §2.3) and each needs its own
 * screen, because the differences are the whole safety property of the feature:
 *
 *   200 unlocked          → coins were spent, and the student is told how many
 *   200 already_unlocked  → NOTHING was spent, and the student is told that
 *   401                   → not signed in; never rendered as "no StudsTokens"
 *   402 / 423             → the shortfall screen, with the server's own routes
 *   anything else         → "your balance has not changed", and no error code
 *
 * The dangerous confusion is the first two. A student on a flaky connection who
 * presses Unlock twice must not be told they were charged twice, and a student
 * who already owns a resource must never see a charge. Both are handled by
 * branching on the server's own `already_unlocked` flag, never on a client
 * guess.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Check, Coins, Hourglass } from "lucide-react";
import Modal from "@/components/ui/Modal";
import CoinActionButton from "@/components/coins/CoinActionButton";
import EarnRoutes from "@/components/coins/EarnRoutes";
import {
  fmtCoins,
  formatExpiryDate,
  resourceNoun,
  type ResolvedResourceAccess,
} from "@/components/coins/useCoinState";
import {
  buildSpendPreview,
  coinsApi,
  newIdempotencyKey,
  type CoinBalance,
  type CoinResourceType,
  type InsufficientCoinsData,
  type UnlockOutcome,
} from "@/services/coinsApi";
import type { StudyResource } from "@/services/studyResourcesApi";

/** One attempt in flight, refused, or settled. */
type Phase =
  | { kind: "idle" }
  /** Confirming. `preview` is null while the balance is read. */
  | { kind: "confirm"; previewLoading: boolean; previewError: string | null }
  /** The press is in the air. */
  | { kind: "committing"; startedAt: number; slow: boolean }
  /** Coins moved. */
  | { kind: "done"; coinsPaid: number; balanceAfter: number }
  /** Already yours. Nothing was spent, and that is the whole message. */
  | { kind: "already" }
  /** Not enough. The server's routes, not ours. */
  | { kind: "insufficient"; data: InsufficientCoinsData }
  /** The starter allowance lapsed and this is not covered by a purchase. */
  | { kind: "lapsed"; data: InsufficientCoinsData | null }
  /** Anything else. Balance explicitly unchanged, no error code. */
  | { kind: "failed" };

interface ResourceAccessDialogProps {
  /** The card's resolved state, recomputed by the parent on every change. */
  access: ResolvedResourceAccess;
  resource: StudyResource;
  /** Which class the price was resolved against. */
  resourceType: CoinResourceType;
  /** Where "log in" goes, and where the earn list's links start. */
  signInHref: string;
  /**
   * False while the gate is off for this resource. The card then renders the
   * plain button it rendered before this feature existed, and none of the below
   * mounts — which is what makes the whole feature inert until it is switched
   * on, rather than merely hidden.
   */
  enabled: boolean;
  onSignIn: () => void;
  /** Called once the resource is genuinely unlocked, to fire the real action. */
  onUnlocked: () => void;
  /** The plain, ungated action: today's download or watch. */
  onPlainAction: () => void;
  /**
   * The card's own unlock is in flight. Threaded to the button so it renders the
   * busy arm, which is `aria-busy` rather than `disabled`: a student watching
   * a button grey out cannot tell a slow unlock from a refusal.
   */
  busy?: boolean;
}

export default function ResourceAccessDialog({
  access,
  resource,
  resourceType,
  signInHref,
  enabled,
  busy = false,
  onSignIn,
  onUnlocked,
  onPlainAction,
}: ResourceAccessDialogProps) {
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [balance, setBalance] = useState<CoinBalance | null>(null);
  // The key is generated ONCE per attempt and reused by every retry of that
  // attempt. A fresh key per retry is precisely what double-charges a student on
  // a bad connection (03 §2.3), so it lives in a ref rather than in state.
  const idempotencyKey = useRef<string>("");
  const titleId = `coin-title-${resource.id}`;
  const bodyId = `coin-body-${resource.id}`;
  const isVideo = resourceType === "video";
  const noun = resourceNoun(
    resourceType === "video" ? "video" : resourceType === "mock_test" ? "mock-test" : "document",
  );
  const doneLabel = isVideo ? "Watch" : "Download";

  const close = useCallback(() => {
    setPhase({ kind: "idle" });
    idempotencyKey.current = "";
  }, []);

  /**
   * Open the confirmation, reading the balance HERE, at the press, rather than
   * from whatever the card happened to be holding. A confirm that quotes a
   * balance from five minutes ago is a bait-and-switch if anything moved
   * (06 §4).
   */
  const beginConfirm = useCallback(async () => {
    // Only mint a key if this attempt has none. "Try again" on a failed unlock
    // re-enters here, and it MUST reuse the key: a fresh key per retry is
    // exactly what double-charges a student whose connection dropped. Closing
    // the dialog clears the ref, so a genuinely new press always gets a new key.
    if (!idempotencyKey.current) idempotencyKey.current = newIdempotencyKey();
    setPhase({ kind: "confirm", previewLoading: true, previewError: null });
    const wallet = await coinsApi.getBalance();
    if (!wallet) {
      setPhase({
        kind: "confirm",
        previewLoading: false,
        previewError: "We could not check your balance. Nothing has been spent.",
      });
      return;
    }
    setBalance(wallet);
    setPhase({ kind: "confirm", previewLoading: false, previewError: null });
  }, []);

  /**
   * The press.
   *
   * There is deliberately no amount argument: the request body cannot carry one
   * (03 §2.3 — a client that can name the cost is an exploit), so the figure
   * shown in the dialog is presentation only and the price is re-resolved
   * server-side. That is why a price change between the preview and the press
   * is safe: the student is charged the server's price, and if it is higher
   * than the one quoted the 402 arrives and the shortfall screen says so.
   */
  const commit = useCallback(
    async () => {
      if (!idempotencyKey.current) idempotencyKey.current = newIdempotencyKey();
      setPhase({ kind: "committing", startedAt: Date.now(), slow: false });

      const outcome: UnlockOutcome = await coinsApi.unlock({
        resourceType,
        resourceId: resource.id,
        idempotencyKey: idempotencyKey.current,
      });

      if (outcome.status === "unlocked") {
        // The distinction the whole feature turns on. A replay of the same
        // idempotency key, or a student who already owns this, lands here with
        // alreadyUnlocked true and is told NOTHING was spent.
        if (outcome.alreadyUnlocked) {
          setPhase({ kind: "already" });
          return;
        }
        setPhase({
          kind: "done",
          coinsPaid: outcome.coinsPaid,
          balanceAfter: outcome.balanceAfter,
        });
        return;
      }
      if (outcome.status === "insufficient") {
        setPhase({ kind: "insufficient", data: outcome.data });
        return;
      }
      if (outcome.status === "allowance-expired") {
        setPhase({ kind: "lapsed", data: outcome.data });
        return;
      }
      if (outcome.status === "unauthenticated") {
        // 401 is its own answer. It is never folded into "insufficient": a
        // student who has not signed in does not have a shortfall, and saying
        // so would send them off to earn coins they do not need.
        close();
        onSignIn();
        return;
      }
      setPhase({ kind: "failed" });
    },
    [close, onSignIn, resource.id, resourceType],
  );

  // A slow unlock reports itself once. No interval, no re-render loop, and no
  // countdown: expiry and progress are stated as facts, never as a clock.
  useEffect(() => {
    if (phase.kind !== "committing" || phase.slow) return;
    const timer = window.setTimeout(() => {
      setPhase((current) =>
        current.kind === "committing" ? { ...current, slow: true } : current,
      );
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (!enabled) {
    return (
      <button
        type="button"
        onClick={onPlainAction}
        className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs font-semibold text-brand-blue hover:bg-blue-100 disabled:opacity-60"
      >
        {doneLabel}
      </button>
    );
  }

  const cost = access.price ?? 0;
  const preview = balance ? buildSpendPreview(balance, cost) : null;

  return (
    <>
      <CoinActionButton
        access={busy ? { ...access, state: "unlocking", busy: true } : access}
        doneLabel={doneLabel}
        onPrimary={() => {
          if (access.state === "unlocked") onPlainAction();
          else void beginConfirm();
        }}
        onNeedEarn={() => void beginConfirm()}
        onSignIn={onSignIn}
      />

      <Modal
        open={phase.kind !== "idle"}
        onClose={close}
        labelledBy={titleId}
        describedBy={bodyId}
        size={phase.kind === "insufficient" ? "md" : "sm"}
        panelClassName={
          phase.kind === "insufficient" ? "max-h-[85vh] overflow-y-auto" : ""
        }
      >
        {phase.kind === "confirm" && (
          <ConfirmScreen
            phase={phase}
            access={access}
            noun={noun}
            titleId={titleId}
            bodyId={bodyId}
            preview={preview}
            onClose={close}
            onBegin={beginConfirm}
            onCommit={commit}
          />
        )}

        {phase.kind === "committing" && (
          <>
            <h2 id={titleId} className="text-lg font-semibold text-gray-900">
              Unlocking…
            </h2>
            <p id={bodyId} className="mt-2 text-sm leading-6 text-gray-500">
              {phase.slow
                ? "This is taking longer than usual. Your StudsTokens are only spent once it completes."
                : "Checking your balance and unlocking."}
            </p>
          </>
        )}

        {phase.kind === "done" && (
          <>
            <h2
              id={titleId}
              className="flex items-center gap-2 text-lg font-semibold text-gray-900"
            >
              <Check size={18} className="text-emerald-600" aria-hidden="true" />
              Unlocked
            </h2>
            <p id={bodyId} className="mt-2 text-sm leading-6 text-gray-500">
              {fmtCoins(phase.coinsPaid)} StudsTokens spent,{" "}
              {fmtCoins(phase.balanceAfter)} left.
            </p>
            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                data-modal-initial
                onClick={() => {
                  close();
                  onUnlocked();
                }}
                className="w-full rounded-md bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
              >
                {doneLabel}
              </button>
            </div>
          </>
        )}

        {phase.kind === "already" && (
          <>
            <h2
              id={titleId}
              className="flex items-center gap-2 text-lg font-semibold text-gray-900"
            >
              <Check size={18} className="text-emerald-600" aria-hidden="true" />
              Already unlocked
            </h2>
            <p id={bodyId} className="mt-2 text-sm leading-6 text-gray-500">
              Nothing was spent, and your balance has not changed. This{" "}
              {noun} is ready.
            </p>
            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={close}
                className="flex-1 rounded-md bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-200"
              >
                Not now
              </button>
              <button
                type="button"
                data-modal-initial
                onClick={() => {
                  close();
                  onUnlocked();
                }}
                className="flex-1 rounded-md bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
              >
                {doneLabel}
              </button>
            </div>
          </>
        )}

        {phase.kind === "insufficient" && (
          <InsufficientScreen
            titleId={titleId}
            bodyId={bodyId}
            noun={noun}
            data={phase.data}
            onClose={close}
          />
        )}

        {phase.kind === "lapsed" && (
          <LapsedScreen
            titleId={titleId}
            bodyId={bodyId}
            data={phase.data}
            onClose={close}
            onSignIn={onSignIn}
            signInHref={signInHref}
          />
        )}

        {phase.kind === "failed" && (
          <>
            <h2 id={titleId} className="text-lg font-semibold text-gray-900">
              That unlock did not complete
            </h2>
            <p id={bodyId} className="mt-2 text-sm leading-6 text-gray-500">
              Nothing was spent and your balance has not changed. You can try
              again, or keep browsing.
            </p>
            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={close}
                className="flex-1 rounded-md bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-200"
              >
                Keep browsing
              </button>
              <button
                type="button"
                data-modal-initial
                onClick={() => void beginConfirm()}
                className="flex-1 rounded-md bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
              >
                Try again
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

/**
 * The confirmation. Three things and nothing else: cost, resulting balance, and
 * which lots are consumed.
 *
 * `preview.covered` gates the confirm button. If the server's spend order does
 * not add up to the price, the balance moved between the read and the press, and
 * a live confirm that cannot succeed is how a student ends up believing they
 * were charged for something they did not get.
 */
function ConfirmScreen({
  phase,
  access,
  noun,
  titleId,
  bodyId,
  preview,
  onClose,
  onBegin,
  onCommit,
}: {
  phase: Extract<Phase, { kind: "confirm" }>;
  access: ResolvedResourceAccess;
  noun: string;
  titleId: string;
  bodyId: string;
  preview: ReturnType<typeof buildSpendPreview> | null;
  onClose: () => void;
  onBegin: () => Promise<void>;
  onCommit: () => Promise<void>;
}) {
  // A starter unlock costs no coins, so there is no cost table and no balance
  // row: showing "128 → 128" would be theatre. It still confirms, because a
  // mis-tap on a phone would burn one of three.
  const isStarter = access.state === "starter-eligible";

  if (phase.previewLoading && !isStarter) {
    return (
      <>
        <h2 id={titleId} className="text-lg font-semibold text-gray-900">
          Checking your balance
        </h2>
        <p id={bodyId} className="mt-2 text-sm leading-6 text-gray-500">
          Nothing is spent until you confirm.
        </p>
        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-200"
          >
            Not now
          </button>
          <span
            aria-busy="true"
            className="flex-1 cursor-not-allowed rounded-md bg-gray-100 px-4 py-2.5 text-center text-sm font-semibold text-gray-500"
          >
            Checking…
          </span>
        </div>
      </>
    );
  }

  if (phase.previewError) {
    return (
      <>
        <h2 id={titleId} className="text-lg font-semibold text-gray-900">
          We could not check your balance
        </h2>
        <p id={bodyId} className="mt-2 text-sm leading-6 text-gray-500">
          {phase.previewError}
        </p>
        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-200"
          >
            Not now
          </button>
          <button
            type="button"
            data-modal-initial
            onClick={() => void onBegin()}
            className="flex-1 rounded-md bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            Try again
          </button>
        </div>
      </>
    );
  }

  if (isStarter) {
    return (
      <>
        <h2 id={titleId} className="text-lg font-semibold text-gray-900">
          Use a starter unlock?
        </h2>
        <p id={bodyId} className="mt-2 text-sm leading-6 text-gray-500">
          This is 1 of your {access.starterTotal} {noun} starter unlocks.{" "}
          {Math.max(0, (access.starterLeft ?? 1) - 1)} will be left after this.
        </p>
        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-200"
          >
            Keep browsing
          </button>
          <button
            type="button"
            data-modal-initial
            onClick={() => void onCommit()}
            className="flex-1 rounded-md bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            Use starter unlock
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 id={titleId} className="text-lg font-semibold text-gray-900">
        Unlock this {noun}?
      </h2>
      <dl id={bodyId} className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-gray-500">Cost</dt>
          <dd className="font-bold tabular-nums text-gray-900">
            {fmtCoins(preview?.cost ?? 0)} StudsTokens
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-gray-100 pt-2.5">
          <dt className="text-gray-500">Your balance</dt>
          <dd className="font-bold tabular-nums text-gray-900">
            {preview ? (
              <>
                <span className="text-gray-400">{fmtCoins(preview.balanceBefore)}</span>
                {" → "}
                {fmtCoins(preview.balanceAfter)}
              </>
            ) : (
              "—"
            )}
          </dd>
        </div>
      </dl>

      {preview && preview.allocation.length > 0 && (
        <div className="mt-4 rounded-md bg-gray-50 p-3">
          <p className="text-xs font-semibold text-gray-700">StudsTokens used</p>
          {preview.allocation.map((leg, index) => (
            <p
              key={`${leg.bucket}-${index}`}
              className="mt-1.5 flex items-baseline justify-between gap-3 text-xs text-gray-500"
            >
              <span className="truncate">
                {leg.expiresAt
                  ? `expires ${formatExpiryDate(leg.expiresAt)}`
                  : "never expires"}
              </span>
              <span className="shrink-0 font-bold tabular-nums text-gray-700">
                {fmtCoins(leg.amount)}
              </span>
            </p>
          ))}
          <p className="mt-2 text-[11px] leading-4 text-gray-400">
            We spend the StudsTokens that expire soonest first, so nothing is
            wasted.
          </p>
        </div>
      )}

      <div className="mt-6 flex gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-md bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-200"
        >
          Not now
        </button>
        {preview && preview.covered ? (
          <button
            type="button"
            data-modal-initial
            onClick={() => void onCommit()}
            className="flex-1 rounded-md bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            Unlock for {fmtCoins(preview.cost)} StudsTokens
          </button>
        ) : (
          <span className="flex-1 cursor-not-allowed rounded-md bg-gray-100 px-4 py-2.5 text-center text-sm font-semibold text-gray-500">
            Not enough StudsTokens
          </span>
        )}
      </div>
    </>
  );
}

/**
 * Not enough StudsTokens.
 *
 * The tone is amber, which in this product already means "needs your attention
 * in a bounded time" and is used that way on pending and expiring states. It is
 * not red and not rose: this screen is a calculator, not a fine, and borrowing
 * the colour of a rejection would make a normal moment feel like a punishment
 * (06 §5.1).
 */
function InsufficientScreen({
  titleId,
  bodyId,
  noun,
  data,
  onClose,
}: {
  titleId: string;
  bodyId: string;
  noun: string;
  data: InsufficientCoinsData;
  onClose: () => void;
}) {
  const gap = Math.max(0, data.shortfall);
  const hasRoutes = data.ways_to_earn.length > 0;

  return (
    <>
      <h2
        id={titleId}
        className="flex items-start gap-2 text-lg font-semibold text-gray-900"
      >
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700 ring-1 ring-amber-200"
          aria-hidden="true"
        >
          <Coins size={16} />
        </span>
        You need {fmtCoins(gap)} more StudsTokens
      </h2>

      <p id={bodyId} className="mt-2.5 text-sm leading-6 text-gray-500">
        This {noun} costs {fmtCoins(data.required)} StudsTokens. Your balance is{" "}
        {fmtCoins(data.available)}.
      </p>

      {hasRoutes ? (
        <EarnRoutes
          shortfall={gap}
          waysToEarn={data.ways_to_earn}
          unavailableRoutes={data.unavailable_routes ?? []}
        />
      ) : (
        <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm leading-6 text-gray-600">
            You have no ways to earn more StudsTokens at the moment. You can
            still unlock other resources with the StudsTokens you have.
          </p>
        </div>
      )}

      <div className="mt-4">
        <button
          type="button"
          data-modal-initial
          onClick={onClose}
          className="w-full rounded-md bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-200"
        >
          Keep browsing
        </button>
      </div>
    </>
  );
}

/**
 * 423. The starter allowance LAPSED and this student is not covered by a
 * purchase, which is a different sentence from "you are short".
 *
 * No apology and no offer of an extension: neither is ours to give (09 §"What
 * support must never promise"). The expiry is a fact, and the ways forward are
 * still listed, so this is not a dead end either.
 */
function LapsedScreen({
  titleId,
  bodyId,
  data,
  onClose,
  onSignIn,
  signInHref,
}: {
  titleId: string;
  bodyId: string;
  data: InsufficientCoinsData | null;
  onClose: () => void;
  onSignIn: () => void;
  signInHref: string;
}) {
  return (
    <>
      <h2
        id={titleId}
        className="flex items-start gap-2 text-lg font-semibold text-gray-900"
      >
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700 ring-1 ring-amber-200"
          aria-hidden="true"
        >
          <Hourglass size={16} />
        </span>
        Your starter unlocks have expired
      </h2>
      <p id={bodyId} className="mt-2.5 text-sm leading-6 text-gray-500">
        {data
          ? `This one is not covered by a starter unlock. It costs ${fmtCoins(
              data.required,
            )} StudsTokens. Your balance is ${fmtCoins(data.available)}.`
          : "You can still unlock this one with StudsTokens."}
      </p>
      {data && data.ways_to_earn.length > 0 && (
        <EarnRoutes
          shortfall={Math.max(0, data.shortfall)}
          waysToEarn={data.ways_to_earn}
          unavailableRoutes={data.unavailable_routes ?? []}
        />
      )}
      <div className="mt-4 flex gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-md bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-200"
        >
          Keep browsing
        </button>
        <a
          href={signInHref}
          onClick={onSignIn}
          data-modal-initial
          className="flex-1 rounded-md bg-brand-blue px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
        >
          Log in
        </a>
      </div>
    </>
  );
}
