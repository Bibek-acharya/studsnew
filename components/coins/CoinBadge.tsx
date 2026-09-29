"use client";

/**
 * The coin badge.
 *
 * One slot per card, and the tones are the four already in the product
 * (06 §0.4): gray for a fact, emerald for a starter unlock that is in hand,
 * amber reserved for a lot that is actually expiring. No new hue is introduced
 * for coins — the `Coins` glyph plus the literal word "StudsTokens" carry the
 * meaning, and colour only reinforces it, which is what keeps this passable for
 * a colourblind reader and for a screen reader (06 §11.3).
 *
 * `aria-live="polite"` is on the badge because the balance can change under a
 * card while a student is looking at it: they unlock something elsewhere, come
 * back, and the button has become affordable. Silence there would be a lie.
 */
import React from "react";
import { Coins, Gift, LockKeyhole } from "lucide-react";
import {
  fmtCoins,
  type ResolvedResourceAccess,
} from "@/components/coins/useCoinState";

/**
 * 06 §3.3's `expiring` tone is deliberately NOT used on a card. A price badge
 * that counts down turns a price into pressure, and §1.4 says expiry is a fact
 * with a date shown in the wallet, not a threat with a timer. The tone is here
 * so the one surface that may show an expiring lot has a token, and so nobody
 * reaches for red.
 */
const TONE = {
  price: "bg-gray-100 text-gray-700",
  starter: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  unlocked: "bg-gray-100 text-gray-600",
  locked: "bg-gray-100 text-gray-500",
} as const;

export type CoinBadgeTone = keyof typeof TONE;

const BASE =
  "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold";

/**
 * The badge's whole content, for one resolved state.
 *
 * Highest priority wins, and the order is the argument: a card that shows both
 * "Unlocked" and "40 StudsTokens" is noise, and one that shows "Starter · 2
 * left" next to a price invites the wrong question (is the token worth more
 * than the coins? — it is, and the student should spend the scarcer thing
 * without being asked to compare).
 */
export default function CoinBadge({
  access,
  className = "",
}: {
  access: ResolvedResourceAccess;
  className?: string;
}) {
  const { state, price, starterLeft, starterTotal } = access;

  if (state === "unlocked") {
    return (
      <span
        className={`${BASE} ${TONE.unlocked} ${className}`}
        aria-live="polite"
      >
        <LockKeyhole size={12} aria-hidden="true" />
        Unlocked
      </span>
    );
  }

  if (state === "starter-eligible") {
    return (
      <span
        className={`${BASE} ${TONE.starter} ${className}`}
        aria-live="polite"
      >
        <Gift size={12} aria-hidden="true" />
        Starter · {starterLeft} of {starterTotal} left
      </span>
    );
  }

  // The price is never guessed. Without one the badge says so plainly and the
  // button still opens the flow, where the SERVER quotes the real number.
  if (price === null) {
    return (
      <span className={`${BASE} ${TONE.locked} ${className}`}>
        <LockKeyhole size={12} aria-hidden="true" />
        Unlock to see price
      </span>
    );
  }

  return (
    <span className={`${BASE} ${TONE.price} ${className}`} aria-live="polite">
      <Coins size={12} aria-hidden="true" />
      {fmtCoins(price)} StudsTokens
    </span>
  );
}

/** The tone a given state resolves to, exposed for the tests and for docs. */
export function badgeToneFor(state: ResolvedResourceAccess["state"]): CoinBadgeTone {
  if (state === "unlocked") return "unlocked";
  if (state === "starter-eligible") return "starter";
  return "price";
}
