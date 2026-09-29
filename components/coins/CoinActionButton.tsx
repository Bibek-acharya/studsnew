"use client";

/**
 * The card's primary action, for all seven states.
 *
 * Two decisions here are load-bearing and both come straight from 06.
 *
 * **The insufficient button is never `disabled`.** A greyed-out control with no
 * explanation is the failure mode of every gated product: the student cannot
 * tell whether they are short of coins, signed out, or looking at something
 * broken. So the button stays live, says what the gap is, and opens the screen
 * that says how to close it. The gap IS the action.
 *
 * **The label carries the verb only.** The price lives in the badge above, and
 * it lives there on purpose: a price in a button label wraps below `sm` and
 * doubles the footer height on a 360px screen (06 §9). The one exception is the
 * confirmation button, where the number is the point of the press and the press
 * is deliberate rather than a card footer.
 */
import React from "react";
import { Check, Coins, Gift, Loader2, LockOpen } from "lucide-react";
import {
  fmtCoins,
  type ResolvedResourceAccess,
} from "@/components/coins/useCoinState";

const BTN =
  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2";

/** Costs something, and the student has it. Press this. */
const solid = `${BTN} bg-brand-blue text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60`;
/** Something is in the way, and pressing this explains what. */
const outline = `${BTN} border border-gray-200 bg-white text-gray-700 hover:bg-gray-50`;

/** 06 §3.2's `unlocking` arm. `aria-busy` so the wait is announced. */
function Unlocking({ label }: { label: string }) {
  return (
    <span
      aria-busy="true"
      className={`${solid} cursor-not-allowed opacity-60`}
    >
      <Loader2 size={13} className="animate-spin" aria-hidden="true" />
      {label}…
    </span>
  );
}

interface CoinActionButtonProps {
  access: ResolvedResourceAccess;
  /** The verb this resource class uses when the thing is already yours. */
  doneLabel: string;
  onPrimary: () => void;
  onNeedEarn: () => void;
  onSignIn: () => void;
}

export default function CoinActionButton({
  access,
  doneLabel,
  onPrimary,
  onNeedEarn,
  onSignIn,
}: CoinActionButtonProps) {
  switch (access.state) {
    case "unlocked":
      return (
        <button type="button" onClick={onPrimary} className={solid}>
          <Check size={13} aria-hidden="true" />
          {doneLabel}
        </button>
      );

    case "starter-eligible":
      return (
        <button type="button" onClick={onPrimary} className={solid}>
          <Gift size={13} aria-hidden="true" />
          Use starter unlock
        </button>
      );

    case "affordable":
      return (
        <button type="button" onClick={onPrimary} className={solid}>
          <LockOpen size={13} aria-hidden="true" />
          Unlock
        </button>
      );

    case "insufficient":
      return (
        <button type="button" onClick={onNeedEarn} className={outline}>
          <Coins size={13} aria-hidden="true" />
          Earn {fmtCoins(access.gap)} more
        </button>
      );

    case "anonymous":
      return (
        <button type="button" onClick={onSignIn} className={outline}>
          <LockOpen size={13} aria-hidden="true" />
          Log in to unlock
        </button>
      );

    case "unlocking":
      return <Unlocking label="Unlocking" />;

    case "price-unknown":
      // No price, so no affordability claim in either direction. Pressing opens
      // the same flow; if the student cannot pay, the server says so with its
      // own figures.
      return (
        <button type="button" onClick={onPrimary} className={outline}>
          <LockOpen size={13} aria-hidden="true" />
          Unlock
        </button>
      );

    case "draft":
    default:
      return null;
  }
}
