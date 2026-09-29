import {
  daysUntil,
  fmtCoins,
  formatExpiryDate,
  resolveResourceAccess,
  resourceNoun,
  type ResolveResourceAccessInput,
} from "@/components/coins/useCoinState";
import { rankWaysToEarn } from "@/components/coins/EarnRoutes";
import { buildSpendPreview, toUnlockOutcome } from "@/services/coinsApi";
import type { CoinBalance } from "@/services/coinsApi";

/**
 * The state matrix, the spend preview, and the four HTTP outcomes.
 *
 * These are the three places a student can be told something false — a wrong
 * state, a wrong price, or a wrong claim about what was spent — so each is
 * asserted directly rather than through a rendered card.
 */

const wallet = (total: number): CoinBalance => ({
  total_available: total,
  total_reserved: 0,
  buckets: [],
  spend_order: [{ bucket: "EARNED", coins: total, expires_at: null }],
  allowance: null,
});

const base = (over: Partial<ResolveResourceAccessInput> = {}): ResolveResourceAccessInput => ({
  access: { price: 40, unlocked: false },
  balance: wallet(100),
  signedIn: true,
  ...over,
});

describe("resolveResourceAccess", () => {
  test("no access block means the gate is off, and no coin state is invented", () => {
    // The inertness contract: with the gate off the list endpoint sends no
    // `access`, and the card must fall through to today's plain button.
    expect(resolveResourceAccess(base({ access: null }))).toBeNull();
    expect(resolveResourceAccess(base({ access: undefined }))).toBeNull();
  });

  test("a held unlock wins over everything, including a zero balance", () => {
    const state = resolveResourceAccess(
      base({
        access: {
          price: 40,
          unlocked: true,
          allowance: { left: 3, total: 3, expires_at: null },
        },
        balance: wallet(0),
      }),
    );
    // Entitlement first, exactly as the server orders it: a student who already
    // owns this is never offered a purchase for it.
    expect(state?.state).toBe("unlocked");
  });

  test("the starter allowance is spent before the balance is consulted", () => {
    // Zero coins, one starter unlock left: this must NOT read as insufficient.
    expect(
      resolveResourceAccess(
        base({
          access: {
            price: 40,
            unlocked: false,
            allowance: { left: 1, total: 3, expires_at: null },
          },
          balance: wallet(0),
        }),
      )?.state,
    ).toBe("starter-eligible");
  });

  test("an allowance with nothing left is not starter-eligible", () => {
    expect(
      resolveResourceAccess(
        base({
          access: {
            price: 40,
            unlocked: false,
            allowance: { left: 0, total: 3, expires_at: null },
          },
        }),
      )?.state,
    ).toBe("affordable");
  });

  test("signed out is its own state and never reads as a shortfall", () => {
    const state = resolveResourceAccess(
      base({ signedIn: false, balance: null }),
    );
    expect(state?.state).toBe("anonymous");
    // Crucially, no gap: telling an anonymous visitor how far short they are
    // would be a claim about a wallet we have not read.
    expect(state?.gap).toBe(0);
  });

  test("a balance that covers the price is affordable", () => {
    expect(resolveResourceAccess(base())?.state).toBe("affordable");
  });

  test("a balance short of the price reports the exact gap", () => {
    const state = resolveResourceAccess(base({ balance: wallet(18) }));
    expect(state?.state).toBe("insufficient");
    expect(state?.gap).toBe(22);
  });

  test("an unreadable balance is undetermined, never treated as zero", () => {
    // A failed balance read must not render every card as unaffordable and send
    // a student with a full wallet off to earn coins they do not need.
    expect(resolveResourceAccess(base({ balance: null }))?.state).toBe("price-unknown");
  });

  test("a missing price defers to the server rather than defaulting to zero", () => {
    expect(
      resolveResourceAccess(
        base({ access: { price: undefined as unknown as number, unlocked: false } }),
      )?.state,
    ).toBe("price-unknown");
  });

  test("an in-flight unlock reads as busy", () => {
    expect(resolveResourceAccess(base({ busy: true }))?.state).toBe("unlocking");
  });

  test("an unpublished draft renders nothing outside the admin view", () => {
    expect(resolveResourceAccess(base({ isPublished: false }))).toBeNull();
    // The admin table still needs to see it, as its own "Awaiting review" state.
    expect(
      resolveResourceAccess(base({ isPublished: false, isAdminView: true }))?.state,
    ).not.toBeNull();
  });
});

describe("buildSpendPreview", () => {
  const fefo: CoinBalance = {
    total_available: 145,
    total_reserved: 0,
    buckets: [],
    // Soonest-expiring first, which is the order the server sends.
    spend_order: [
      { bucket: "FREE", coins: 40, expires_at: "2026-10-26T00:00:00Z" },
      { bucket: "EARNED", coins: 105, expires_at: null },
    ],
    allowance: null,
  };

  test("walks the server's order and stops at the cost", () => {
    const preview = buildSpendPreview(fefo, 40);
    expect(preview.allocation).toEqual([
      { bucket: "FREE", amount: 40, expiresAt: "2026-10-26T00:00:00Z" },
    ]);
    expect(preview.balanceBefore).toBe(145);
    expect(preview.balanceAfter).toBe(105);
    expect(preview.covered).toBe(true);
  });

  test("a cost spanning two lots splits across them in FEFO order", () => {
    const preview = buildSpendPreview(fefo, 100);
    expect(preview.allocation.map((leg) => leg.amount)).toEqual([40, 60]);
    expect(preview.covered).toBe(true);
  });

  test("a cost the wallet cannot cover is reported as uncovered, not padded", () => {
    // `covered: false` is the signal that suppresses the confirm button: the
    // balance moved between the read and the press.
    expect(buildSpendPreview(fefo, 200).covered).toBe(false);
  });

  test("a zero cost is trivially covered and allocates nothing", () => {
    const preview = buildSpendPreview(fefo, 0);
    expect(preview.allocation).toEqual([]);
    expect(preview.covered).toBe(true);
  });
});

describe("toUnlockOutcome", () => {
  test("a charged unlock says coins moved and how many", () => {
    const outcome = toUnlockOutcome(200, {
      data: {
        unlocked: true,
        already_unlocked: false,
        coins_paid: 40,
        balance_after: 105,
        spent_from: [],
        used_allowance: false,
      },
    });
    expect(outcome).toMatchObject({
      status: "unlocked",
      alreadyUnlocked: false,
      coinsPaid: 40,
      balanceAfter: 105,
    });
  });

  test("an already-owned unlock says nothing was spent", () => {
    // The distinction the whole feature turns on. A retry on a flaky connection
    // lands here and must never be rendered as a second charge.
    const outcome = toUnlockOutcome(200, {
      data: { unlocked: true, already_unlocked: true, coins_paid: 0, balance_after: 145 },
    });
    expect(outcome).toMatchObject({
      status: "unlocked",
      alreadyUnlocked: true,
      coinsPaid: 0,
    });
  });

  test("an unreadable 200 defaults to already-owned, never to a charge", () => {
    // The safe direction when the body cannot be read.
    const outcome = toUnlockOutcome(200, {});
    expect(outcome).toMatchObject({ alreadyUnlocked: true, coinsPaid: 0 });
  });

  test("401 is not signed in, and is never an insufficiency", () => {
    expect(toUnlockOutcome(401, {})).toEqual({ status: "unauthenticated" });
  });

  test("402 reads the designed object, including the server's earn routes", () => {
    const outcome = toUnlockOutcome(402, {
      success: false,
      error: {
        code: "INSUFFICIENT_COINS",
        message: "You do not have enough coins for this yet.",
        data: {
          required: 40,
          available: 18,
          shortfall: 22,
          expires_in_days: 12,
          ways_to_earn: [{ code: "PROFILE", label: "Complete your profile", potential: 15 }],
          unavailable_routes: [{ code: "REFERRAL", label: "Invite a friend", reason: "NOT_LAUNCHED" }],
        },
      },
    });
    expect(outcome.status).toBe("insufficient");
    if (outcome.status !== "insufficient") throw new Error("unreachable");
    expect(outcome.data.shortfall).toBe(22);
    expect(outcome.data.ways_to_earn[0]).toEqual({
      code: "PROFILE",
      label: "Complete your profile",
      potential: 15,
    });
    expect(outcome.data.unavailable_routes?.[0]?.reason).toBe("NOT_LAUNCHED");
  });

  test("423 is the lapsed allowance, a different sentence from a shortfall", () => {
    const outcome = toUnlockOutcome(423, {
      error: {
        code: "ALLOWANCE_EXPIRED",
        data: { required: 40, available: 18, shortfall: 22, ways_to_earn: [] },
      },
    });
    expect(outcome.status).toBe("allowance-expired");
  });

  test("a 402 whose body is unreadable is a failure, not a fabricated debt", () => {
    // Inventing `required` would put a number on screen that no server produced.
    expect(toUnlockOutcome(402, { error: { code: "INSUFFICIENT_COINS" } })).toEqual({
      status: "failed",
      reason: "server",
    });
  });

  test("404, 400, 409, 503 and 500 all map to spent-nothing failures", () => {
    expect(toUnlockOutcome(404, {})).toEqual({ status: "not-found" });
    expect(toUnlockOutcome(400, {})).toEqual({ status: "failed", reason: "invalid-request" });
    expect(toUnlockOutcome(409, {})).toEqual({ status: "failed", reason: "conflict" });
    expect(toUnlockOutcome(503, {})).toEqual({ status: "failed", reason: "offline" });
    expect(toUnlockOutcome(500, {})).toEqual({ status: "failed", reason: "server" });
  });
});

describe("rankWaysToEarn", () => {
  const way = (code: string, potential: number) => ({ code, label: code, potential });

  test("a route that can close the gap alone leads, largest first", () => {
    // A 15-coin profile gap is a faster answer for a 22-coin shortfall than a
    // 60-coin referral that takes a week, so it must not be buried.
    const ranked = rankWaysToEarn(
      [way("REFERRAL", 60), way("PROFILE", 15)],
      22,
    );
    expect(ranked.map((w) => w.code)).toEqual(["REFERRAL", "PROFILE"]);
    // Neither closes it, so both fall to the by-value group.
  });

  test("a route that closes the gap alone outranks one that cannot", () => {
    // 06 §5's rule: routes whose remaining value reaches the gap lead, then the
    // rest by value. So an 80-coin upload leads a 22-coin gap over a 15-coin
    // profile remainder, because only the first can settle it unaided.
    const ranked = rankWaysToEarn(
      [way("UPLOAD", 80), way("PROFILE", 15)],
      22,
    );
    expect(ranked.map((w) => w.code)).toEqual(["UPLOAD", "PROFILE"]);
  });

  test("within a group, the larger value leads", () => {
    const ranked = rankWaysToEarn(
      [way("A", 20), way("B", 50), way("C", 80)],
      100,
    );
    expect(ranked.map((w) => w.code)).toEqual(["C", "B", "A"]);
  });
});

describe("copy helpers", () => {
  test("coin counts group the way this audience reads them", () => {
    expect(fmtCoins(40)).toBe("40");
    expect(fmtCoins(1234567)).toBe("12,34,567");
  });

  test("a date renders as a day, a month and a year, never a countdown", () => {
    expect(formatExpiryDate("2026-11-12T00:00:00Z")).toContain("November");
    expect(formatExpiryDate(null)).toBe("");
  });

  test("days until a date floors at zero rather than going negative", () => {
    const now = Date.parse("2026-11-12T00:00:00Z");
    expect(daysUntil("2026-11-20T00:00:00Z", now)).toBe(8);
    expect(daysUntil("2026-11-01T00:00:00Z", now)).toBe(0);
  });

  test("the noun names what was pressed", () => {
    expect(resourceNoun("document")).toBe("document");
    expect(resourceNoun("video")).toBe("video lecture");
    expect(resourceNoun("mock-test")).toBe("mock test");
  });
});
