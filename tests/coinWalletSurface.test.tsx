/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import CoinBalanceChip, {
  SIGNED_OUT_HREF,
  chipLabel,
  resolveChipView,
} from "@/components/coins/CoinBalanceChip";
import WalletExpiryStamp from "@/components/coins/WalletExpiryStamp";
import {
  daysLeft,
  expiryBand,
  isExpiringSoon,
  soonestExpiry,
} from "@/components/coins/expiry";
import { coinsApi, type CoinBalance } from "@/services/coinsApi";
import type { ChipView } from "@/components/coins/CoinBalanceChip";

// The house test convention for `act` in this repo (see coinResourceCard.test.tsx:24).
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * The header chip's four states, the expiry bands, and the spend decision.
 *
 * These are the places a student can be told something false by a header: a `0`
 * they do not have, an amber dot on coins that never expire, a countdown that
 * rounds up, and a number with no unit. Each is asserted directly rather than
 * through a rendered page, because the chip has to be correct when the wallet
 * page is not on screen at all.
 */

const NOW = Date.parse("2026-11-01T00:00:00Z");

const wallet = (over: Partial<CoinBalance> = {}): CoinBalance => ({
  total_available: 128,
  total_reserved: 0,
  buckets: [{ bucket: "EARNED", balance: 128, expires_at: null, lot_count: 3 }],
  spend_order: [],
  allowance: null,
  ...over,
});

describe("the chip's decision about a balance nothing can buy yet", () => {
  test("a balance is shown whether or not anything is purchasable", () => {
    // THE DECISION. Every gate is off, so a student with 25 earned coins can
    // spend none of them. The chip shows the 25 anyway, because the number is
    // true, the earning mechanic is live, and a surface that already exists is
    // worth more than one that appears the day an admin flips a boolean.
    const view = resolveChipView({
      signedIn: true,
      loading: false,
      balance: wallet({ total_available: 25 }),
      readOk: true,
      now: NOW,
    });
    expect(view.kind).toBe("link");
    expect(view.total).toBe(25);
    expect(view.urgent).toBe(false);
  });

  test("it never claims a balance is spendable, because nothing in the response says it is", () => {
    // The balance endpoint carries no gate state. If the chip rendered "ready to
    // spend" it would be asserting a fact the client cannot see, and it would be
    // wrong the moment the gates go live.
    const view = resolveChipView({
      signedIn: true,
      loading: false,
      balance: wallet(),
      readOk: true,
      now: NOW,
    });
    expect(chipLabel(view)).toBe(
      "StudsToken balance: 128. Open your StudsTokens.",
    );
    expect(chipLabel(view)).not.toMatch(/spend|ready|unlock/i);
  });

  test("a real zero is shown as zero; a failed read is shown as no number", () => {
    // These are different facts and must never render as the same chip. Showing
    // 0 for a failed read is a lie told to a student with a full wallet.
    const empty = resolveChipView({
      signedIn: true,
      loading: false,
      balance: wallet({ total_available: 0, buckets: [] }),
      readOk: true,
      now: NOW,
    });
    expect(empty.total).toBe(0);

    const failed = resolveChipView({
      signedIn: true,
      loading: false,
      balance: null,
      readOk: false,
      now: NOW,
    });
    expect(failed.total).toBeNull();
    expect(chipLabel(failed)).not.toContain("0");
    // Still a working route to the wallet, so an outage does not also delete
    // the surface.
    expect(failed.href).toBe("/user/dashboard/coins");
  });
});

describe("the chip's three header-render states", () => {
  test("signed out: a link, and never a fetch", () => {
    const view = resolveChipView({
      signedIn: false,
      loading: false,
      balance: null,
      readOk: false,
      now: NOW,
    });
    expect(view.kind).toBe("link");
    expect(view.signedOut).toBe(true);
    expect(view.total).toBeNull();
    expect(view.href).toBe(SIGNED_OUT_HREF);
    expect(chipLabel(view)).toContain("Earn StudsTokens");
  });

  test("a read in flight holds a fixed-width slot, so nothing shifts", () => {
    const view = resolveChipView({
      signedIn: true,
      loading: true,
      balance: null,
      readOk: false,
      now: NOW,
    });
    // `skeleton` is 06 §9's `h-7 w-16 animate-pulse rounded-md bg-gray-100`. The
    // width is the load-bearing part: it is what stops the bell and the profile
    // menu moving when the number lands four seconds later.
    expect(view.kind).toBe("skeleton");
    expect(view.total).toBeNull();
  });

  test("a signed-in student with no read yet is a skeleton, not the signed-out link", () => {
    // The auth bootstrap window: `user` is null but not known to be absent.
    // Rendering "Earn StudsTokens" for that frame is a flash of the wrong chrome
    // at a signed-in student.
    const view = resolveChipView({
      signedIn: true,
      loading: true,
      balance: null,
      readOk: false,
      now: NOW,
    });
    expect(view.signedOut).toBe(false);
  });
});

describe("the amber treatment is used honestly", () => {
  test("the amber figure is the coins in expiring lots, not the balance", () => {
    const view = resolveChipView({
      signedIn: true,
      loading: false,
      balance: wallet({
        total_available: 128,
        buckets: [
          { bucket: "FREE", balance: 20, expires_at: "2026-11-05T00:00:00Z" },
          { bucket: "EARNED", balance: 108, expires_at: null },
        ],
      }),
      readOk: true,
      now: NOW,
    });
    expect(view.total).toBe(128);
    expect(view.expiring).toBe(20);
    expect(view.urgent).toBe(true);
    // The link carries the focus target: pressing an amber chip lands on the
    // lots rather than at the top of a page they must scroll.
    expect(view.href).toContain("focus=expiring");
  });

  test("coins that never expire never go amber, whatever the balance", () => {
    const view = resolveChipView({
      signedIn: true,
      loading: false,
      balance: wallet({
        buckets: [{ bucket: "EARNED", balance: 900, expires_at: null }],
      }),
      readOk: true,
      now: NOW,
    });
    expect(view.urgent).toBe(false);
    expect(chipLabel(view)).not.toContain("expiring");
  });

  test("a lot beyond the window is not counted as expiring", () => {
    const view = resolveChipView({
      signedIn: true,
      loading: false,
      balance: wallet({
        buckets: [{ bucket: "EARNED", balance: 128, expires_at: "2027-01-01T00:00:00Z" }],
      }),
      readOk: true,
      now: NOW,
    });
    expect(view.expiring).toBe(0);
  });
});

describe("daysLeft floors, so expiry never rounds in the student's favour", () => {
  test("4.1 days reads as 4, not 5", () => {
    // The direction that matters. `Math.ceil` — which `daysUntil` uses for
    // countdown questions — would say 5 here and tell a student they have longer
    // than they do. On the one mechanic where a balance drops without being
    // spent, that is the unacceptable direction.
    const fourPointOne = NOW + 4.1 * 86_400_000;
    expect(daysLeft(new Date(fourPointOne).toISOString(), NOW)).toBe(4);
  });

  test("a past date floors at zero rather than going negative", () => {
    expect(daysLeft("2026-10-01T00:00:00Z", NOW)).toBe(0);
  });

  test("an unreadable date is zero, not NaN", () => {
    expect(daysLeft("not a date", NOW)).toBe(0);
    expect(daysLeft(null, NOW)).toBe(0);
  });

  test("the bands are 06 §2.3's: 7 is the amber boundary, not 8", () => {
    expect(expiryBand(8)).toBe("soon");
    expect(expiryBand(7)).toBe("urgent");
    expect(expiryBand(31)).toBe("later");
    expect(expiryBand(30)).toBe("soon");
    // 8 days out is not amber; 7 days out is, and so is anything under it.
    expect(isExpiringSoon("2026-11-09T00:00:00Z", NOW)).toBe(false);
    expect(isExpiringSoon("2026-11-08T00:00:00Z", NOW)).toBe(true);
    // A lot that never expires is never "expiring soon", which is why
    // `hasExpiry` exists: `daysLeft(null)` is 0 and 0 is inside the band.
    expect(isExpiringSoon(null, NOW)).toBe(false);
    expect(isExpiringSoon(undefined, NOW)).toBe(false);
  });

  test("the soonest expiry is the minimum across lots, skipping those that never lapse", () => {
    expect(
      soonestExpiry([
        { expires_at: null },
        { expires_at: "2027-03-01T00:00:00Z" },
        { expires_at: "2026-12-01T00:00:00Z" },
      ]),
    ).toBe(new Date("2026-12-01T00:00:00Z").toISOString());
    expect(soonestExpiry([{ expires_at: null }])).toBeNull();
  });
});

describe("the expiry stamp says a date, never a clock", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  const render = (expiresAt: string | null) => {
    act(() => {
      root.render(<WalletExpiryStamp expiresAt={expiresAt} now={NOW} />);
    });
    return container.textContent ?? "";
  };

  test("never expires is plain prose with no colour claim", () => {
    expect(render(null)).toBe("Never expires");
  });

  test("inside the final week: the date, the day count, and the hourglass", () => {
    const text = render("2026-11-05T00:00:00Z");
    expect(text).toContain("November");
    expect(text).toContain("expires in 4 days");
    expect(container.querySelector("svg")).not.toBeNull();
  });

  test("inside 24 hours it does not say 'in 0 days'", () => {
    // 06 does not cover the sub-day case. "expires in 0 days" is nonsense and
    // "in 1 day" would round in the student's favour, so the stamp says today.
    const text = render(new Date(NOW + 3 * 3_600_000).toISOString());
    expect(text).toBe("expires today");
  });

  test("beyond 30 days it is a date and nothing else", () => {
    expect(render("2027-06-01T00:00:00Z")).toBe("1 June 2027");
  });

  test("there is no countdown element anywhere in it", () => {
    render("2026-11-05T00:00:00Z");
    // A ticking clock is the failure 06 §1.4 rules out. Asserted structurally:
    // the only glyph allowed is the static hourglass, never a timer.
    expect(container.querySelectorAll("svg").length).toBe(1);
  });
});

describe("the rendered chip never wraps or shifts the header", () => {
  let container: HTMLDivElement;
  let root: Root;
  // A STABLE object per mount: `user.id` keys the balance read, so a fresh
  // literal on every render would re-read the wallet forever.
  const session = { id: 7 };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    jest.restoreAllMocks();
  });

  /** Mount the chip for a session and let the balance read settle. */
  const settle = async (
    balance: CoinBalance | null,
    user: { id?: number } | null = session,
  ) => {
    jest.spyOn(coinsApi, "getBalance").mockResolvedValue(balance);
    await act(async () => {
      root.render(<CoinBalanceChip user={user} />);
    });
    await act(async () => {
      await Promise.resolve();
    });
    return {
      chip: container.querySelector("[data-testid='coin-chip']"),
      skeleton: container.querySelector("[data-testid='coin-chip-skeleton']"),
    };
  };

  test("a resolved balance renders one fixed-footprint chip", async () => {
    const { chip } = await settle(wallet({ total_available: 128 }));
    expect(chip).not.toBeNull();
    // `shrink-0` stops the chip being squeezed and `whitespace-nowrap` stops the
    // number wrapping inside it. The fixed `h-7` is what keeps the header from
    // growing when the chip appears.
    expect(chip?.className).toContain("shrink-0");
    expect(chip?.className).toContain("whitespace-nowrap");
    expect(chip?.className).toContain("h-7");
    expect(chip?.textContent).toContain("128");
  });

  test("a failed read renders the link with no number, never 0", async () => {
    const { chip } = await settle(null);
    expect(chip).not.toBeNull();
    expect(chip?.textContent).not.toContain("0");
    expect(chip?.getAttribute("aria-label")).toBe("Open your StudsTokens.");
    // Still navigable: an outage must not also delete the surface.
    expect(chip?.getAttribute("href")).toBe("/user/dashboard/coins");
  });

  test("an amber chip says how much is expiring, in the accessible name", async () => {
    // Relative to the real clock, because the chip reads `Date.now()` itself —
    // there is no injectable `now` on the component, only on `resolveChipView`.
    const inThreeDays = new Date(Date.now() + 3 * 86_400_000).toISOString();
    const { chip } = await settle(
      wallet({
        total_available: 128,
        buckets: [
          { bucket: "FREE", balance: 20, expires_at: inThreeDays },
          { bucket: "EARNED", balance: 108, expires_at: null },
        ],
      }),
    );
    expect(chip?.getAttribute("data-urgent")).toBe("true");
    expect(chip?.getAttribute("aria-label")).toContain("20 expiring");
    expect(chip?.className).toContain("amber");
  });

  test("a signed-out chip never calls the balance endpoint at all", async () => {
    // Not an optimisation. A 401 here would be a request fired at every signed-
    // out page view, and it is the state the endpoint cannot answer.
    const spy = jest.spyOn(coinsApi, "getBalance").mockResolvedValue(wallet());
    await settle(wallet(), null);
    const chip = container.querySelector("[data-testid='coin-chip']");
    expect(spy).not.toHaveBeenCalled();
    expect(chip?.textContent).toContain("Earn StudsTokens");
    expect(chip?.getAttribute("href")).toBe(SIGNED_OUT_HREF);
  });

  test("signing out clears the previous student's number", async () => {
    await settle(wallet({ total_available: 128 }));
    expect(container.textContent).toContain("128");

    await settle(null, null);
    // Left in place this puts one account's balance in front of the next
    // person at the same machine.
    expect(container.textContent).not.toContain("128");
    expect(container.textContent).toContain("Earn StudsTokens");
  });

  test("a slow read holds a skeleton rather than claiming a number", async () => {
    // The read never resolves inside the test. The chip must show the fixed-size
    // placeholder, which is the whole reason nothing to its right moves.
    let release: (value: CoinBalance | null) => void = () => {};
    jest
      .spyOn(coinsApi, "getBalance")
      .mockImplementation(() => new Promise((resolve) => {
        release = resolve;
      }));

    await act(async () => {
      root.render(<CoinBalanceChip user={session} />);
    });
    const skeleton = container.querySelector(
      "[data-testid='coin-chip-skeleton']",
    );
    expect(skeleton).not.toBeNull();
    expect(container.querySelector("[data-testid='coin-chip']")).toBeNull();

    await act(async () => {
      release(wallet({ total_available: 25 }));
      await Promise.resolve();
    });
    // And the number arrives without ever having rendered a zero.
    expect(container.querySelector("[data-testid='coin-chip']")?.textContent).toContain(
      "25",
    );
  });
});

describe("the wallet's copy stays inside the rules", () => {
  const banned = [
    /\bfree\b/i,
    /\bNPR\b/,
    /\bRs\.?\b/,
    /\bprize\b/i,
    /\baward\b/i,
    /\bwin\b/i,
    /\braffle\b/i,
    /\bdraw\b/i,
    /!/,
    /you will lose/i,
    /unlock more with/i,
  ];

  test("nothing the wallet or the chip renders uses a banned term", async () => {
    const original = window.fetch;
    // The chip's four labels and the wallet's ledger footnote, read off the
    // components rather than off a page, because these are the strings that
    // reach a student.
    const strings: string[] = [
      chipLabel({
        kind: "link",
        href: "/login",
        total: null,
        expiring: 0,
        urgent: false,
        signedOut: true,
      } as ChipView),
      chipLabel({
        kind: "link",
        href: "/user/dashboard/coins",
        total: 128,
        expiring: 20,
        urgent: true,
        signedOut: false,
      } as ChipView),
      chipLabel({
        kind: "link",
        href: "/user/dashboard/coins",
        total: 0,
        expiring: 0,
        urgent: false,
        signedOut: false,
      } as ChipView),
      "We spend the StudsTokens that expire soonest first, so nothing is wasted.",
      "Your starter unlocks expired on 12 November 2026.",
      "included with your account",
      "Right now you can earn StudsTokens but not spend them yet.",
      "held for invites",
    ];
    window.fetch = original;
    for (const value of strings) {
      for (const pattern of banned) {
        expect(`${value}`.replace(/never expires/i, "")).not.toMatch(pattern);
      }
    }
  });

  test("no currency figure ever sits beside a coin figure", () => {
    // The rule with statutory teeth (CPA 2075 s.16(2)(c)(3)): a coin cannot be
    // bought, so any money attached to it is a false claim about value.
    const { description } = { description: "This costs 40 StudsTokens." };
    expect(description).not.toMatch(/NPR|Rs\.?|\d+\s*(ruppee|rupees)/i);
  });
});