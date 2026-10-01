/**
 * `/r/[code]` and the API client's referral readers.
 *
 * @jest-environment jsdom
 *
 * Two things are pinned here that are easy to get quietly wrong.
 *
 * The first is that the capture route NEVER dead-ends. A redirect that only
 * fires for a valid code is the single worst failure this feature has: the
 * student is one step from an account, the friend who sent the link is not
 * present to explain, and the code is not what they came for.
 *
 * The second is that §2.4 is read defensively, in BOTH directions. A missing
 * stat filled with a zero is not a rendering detail — it is a student shown as
 * having earned nothing when 540 StudsTokens are in their balance. And a stat the
 * server has RETIRED must not survive in the reader, because the mechanic behind
 * `coins_pending` is gone and a client still reading it renders a number nobody
 * sent.
 */
import InviteCapturePage, { metadata } from "@/app/r/[code]/page";
import ReferralAliasPage from "@/app/referral/page";
import ReferralPage, { metadata as referralMetadata } from "@/app/user/dashboard/referral/page";
import { coinsApi } from "@/services/coinsApi";
import { apiRequest } from "@/services/api";

jest.mock("@/services/api", () => ({
  apiRequest: jest.fn(),
}));

const mockedApiRequest = apiRequest as unknown as jest.Mock;

/**
 * `redirect()` throws a `NEXT_REDIRECT` error whose `digest` is
 * `NEXT_REDIRECT;<type>;<url>;<status>`. That throw IS the redirect, so the
 * digest is what this suite asserts on.
 *
 * The URL is field 2. Splitting on `;` is safe for it because the capture route
 * puts the code through `encodeURIComponent`, which encodes the separator.
 */
function redirectUrl(error: unknown): string {
  const digest = (error as { digest?: string }).digest ?? "";
  const fields = String(digest).split(";");
  return fields[0] === "NEXT_REDIRECT" ? (fields[2] ?? "") : "";
}

const redirectOf = async (code: string) => {
  let target = "";
  await InviteCapturePage({ params: Promise.resolve({ code }) }).catch((error) => {
    target = redirectUrl(error);
  });
  return target;
};

describe("the capture route always forwards the student to signup", () => {
  test("a valid code arrives at /register in canonical form", async () => {
    expect(await redirectOf("7K2M9Q4XTB")).toBe("/register?ref=7K2M9Q4XTB");
  });

  test("a lower-case code is canonicalised on the way past", async () => {
    // The last point at which the code is text somebody typed. A miss here is
    // invisible: the server sees a well-formed request carrying a code that
    // matches nothing.
    expect(await redirectOf("7k2m9q4xtb")).toBe("/register?ref=7K2M9Q4XTB");
  });

  test("a code mistyped as O for 0 is corrected", async () => {
    expect(await redirectOf("ok2m9q4xtb")).toBe("/register?ref=0K2M9Q4XTB");
  });

  test("an impossible code still lands on /register, never an error", async () => {
    // The dead-end rule. The student still reaches the signup form.
    expect(await redirectOf("not-a-code")).toContain("/register?ref=");
  });

  test("an unusable code is forwarded raw, so the form can say so", async () => {
    // Dropping it would make a broken link indistinguishable from no link, and
    // the student who followed one deserves to be told.
    const target = await redirectOf("not-a-code");
    expect(target).toBe("/register?ref=not-a-code");
    // Encoded, because an unvalidated path segment is going into a redirect
    // target and must not be able to terminate the query string.
    expect(await redirectOf("a&b=c")).toBe("/register?ref=a%26b%3Dc");
  });

  test("an empty segment does not produce a bare '?ref='", async () => {
    expect(await redirectOf("")).toBe("/register?ref=");
  });

  test("it is never indexed, because a referral link is not content", () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });
});

describe("06's URL resolves rather than 404ing", () => {
  test("/referral points at the page that exists", () => {
    let target = "";
    try {
      ReferralAliasPage();
    } catch (error) {
      target = redirectUrl(error);
    }
    expect(target).toBe("/user/dashboard/referral");
  });

  test("the page is not indexed, because every figure on it is one student's", () => {
    expect(referralMetadata.robots).toMatchObject({ index: false, follow: false });
    // And it exists, which is the point of the alias.
    expect(ReferralPage).toBeDefined();
  });
});

describe("§2.4 is read defensively, and a missing figure is never a zero", () => {
  const envelope = (data: unknown) => ({ success: true, data });
  // §2.4's `stats`, verbatim against the implementation: `expired` is a fifth
  // bucket and `coins_pending` is GONE, because a referral payout no longer
  // reserves from the referrer and there is no reserved balance to report.
  const validStats = {
    invited: 14,
    qualified: 9,
    pending: 3,
    expired: 1,
    rejected: 1,
    coins_earned_total: 540,
    this_month_qualified: 4,
    monthly_cap_remaining: 6,
    lifetime_cap_remaining: 60,
  };

  afterEach(() => {
    mockedApiRequest.mockReset();
  });

  test("a well-formed body reads through unchanged", async () => {
    mockedApiRequest.mockResolvedValue(
      envelope({
        referral_code: "7K2M9Q4XTB",
        referral_link: "https://studsphere.com/r/7K2M9Q4XTB",
        stats: validStats,
      }),
    );

    const summary = await coinsApi.getReferralSummary();
    expect(summary?.referral_code).toBe("7K2M9Q4XTB");
    expect(summary?.stats.coins_earned_total).toBe(540);
    expect(summary?.stats.expired).toBe(1);
    // The endpoint the server MOUNTS. internal/coins/routes.go mounts
    // `GET /api/v1/referrals` and has never mounted `/referral/me`, so a client
    // asking for the old spelling gets a 404, `getReferralSummary` returns null,
    // and every signed-in student sees the error card instead of their code.
    // The test used to assert the misspelling, which is how it stayed green.
    expect(mockedApiRequest.mock.calls[0][0]).toBe("/api/v1/referrals");
  });

  test("a body with no code is null, not an empty object", async () => {
    // A page with no code has nothing to show. null is its error state.
    mockedApiRequest.mockResolvedValue(envelope({ stats: validStats }));
    expect(await coinsApi.getReferralSummary()).toBeNull();
  });

  test("a body with no stats is null rather than a set of zeros", async () => {
    // THE case. Defaulting a missing `stats` to zeros would render a student with
    // nine paid referrals as having none, and one with 180 StudsTokens reserved as
    // having nothing on hold. No correct copy elsewhere can repair that.
    mockedApiRequest.mockResolvedValue(
      envelope({ referral_code: "7K2M9Q4XTB", referral_link: "https://x" }),
    );
    expect(await coinsApi.getReferralSummary()).toBeNull();
  });

  test("a junk figure becomes a number, and never a negative one", async () => {
    mockedApiRequest.mockResolvedValue(
      envelope({
        referral_code: "7K2M9Q4XTB",
        stats: { ...validStats, coins_earned_total: "not a number", invited: -4 },
      }),
    );
    const summary = await coinsApi.getReferralSummary();
    expect(summary?.stats.coins_earned_total).toBe(0);
    // A negative count is not a thing, and rendering one would be a lie of a
    // different kind: it reads as a debt.
    expect(summary?.stats.invited).toBe(0);
  });

  test("there is no pending-coins figure, because the server sends none", async () => {
    // The load-bearing consequence of dropping `coins_pending`. A reader that
    // still looked for it would find `undefined`, coerce it to 0, and the held
    // group would render "0 StudsTokens" — a figure the server never sent, on the
    // one group whose entire job is to not read as spendable money.
    mockedApiRequest.mockResolvedValue(
      envelope({
        referral_code: "7K2M9Q4XTB",
        stats: validStats,
      }),
    );
    const summary = await coinsApi.getReferralSummary();
    const stats = summary?.stats as unknown as Record<string, unknown> | undefined;
    expect(stats?.coins_pending).toBeUndefined();
  });

  test("a missing link degrades to empty rather than being rebuilt", async () => {
    // The client never concatenates a host and a code. See ReferralCodeShare.
    mockedApiRequest.mockResolvedValue(
      envelope({ referral_code: "7K2M9Q4XTB", stats: validStats }),
    );
    expect((await coinsApi.getReferralSummary())?.referral_link).toBe("");
  });

  test("a failed read is null, and never a fabricated object", async () => {
    mockedApiRequest.mockRejectedValue(new Error("500"));
    expect(await coinsApi.getReferralSummary()).toBeNull();
  });

  test("a 401 is suppressed so it cannot wipe the session", async () => {
    mockedApiRequest.mockRejectedValue({ status: 401 });
    await coinsApi.getReferralSummary();
    // "Not signed in" is a rendering state on this page, not a reason to destroy
    // the session and bounce the student to the landing page.
    expect(mockedApiRequest.mock.calls[0][1]).toMatchObject({
      suppressAuthExpired: true,
    });
  });

  test("the stats shape names every field §2.4 documents", () => {
    // If §2.4 gains or loses a figure, this list changes with it.
    expect(Object.keys(validStats).sort()).toEqual([
      "coins_earned_total",
      "expired",
      "invited",
      "lifetime_cap_remaining",
      "monthly_cap_remaining",
      "pending",
      "qualified",
      "rejected",
      "this_month_qualified",
    ]);
  });

  test("a reader drops a figure the server no longer sends", async () => {
    // A client tolerant of EXTRA fields is correct — the server may add one. The
    // direction that matters is the other: this reader must not carry a figure the
    // server has retired, because every consumer of it renders a number.
    mockedApiRequest.mockResolvedValue(
      envelope({
        referral_code: "7K2M9Q4XTB",
        stats: { ...validStats, coins_pending: 180 },
      }),
    );
    const summary = await coinsApi.getReferralSummary();
    const stats = summary?.stats as unknown as Record<string, unknown> | undefined;
    expect(stats?.coins_pending).toBeUndefined();
  });
});

describe("the per-referral list is an enrichment, never a dependency", () => {
  afterEach(() => {
    mockedApiRequest.mockReset();
  });

  test("a bare array and an items envelope are both accepted", async () => {
    mockedApiRequest.mockResolvedValueOnce({
      success: true,
      data: [
        { id: 1, name: "Aarav Sharma", status: "pending_hold", hold_until: "2026-11-22" },
        { id: 2, first_name: "Bina", last_name: "Rai", status: "released" },
      ],
    });
    const bare = await coinsApi.listMyReferrals();
    expect(bare).toEqual([
      { id: "1", label: "Aarav Sharma", state: "on-hold", holdUntil: "2026-11-22" },
      { id: "2", label: "Bina Rai", state: "settled", holdUntil: null },
    ]);

    mockedApiRequest.mockResolvedValueOnce({
      success: true,
      data: { items: [{ id: 3, name: "Chetan", status: "qualified" }] },
    });
    const wrapped = await coinsApi.listMyReferrals();
    expect(wrapped?.[0]).toMatchObject({ label: "Chetan", state: "settled" });
  });

  test("a row whose state cannot be named is DROPPED, not guessed", async () => {
    // Every state is a claim about someone's money, so an unrecognised one is not
    // rendered in a state this client invented.
    mockedApiRequest.mockResolvedValue({
      success: true,
      data: [
        { id: 1, name: "Known", status: "qualified" },
        { id: 2, name: "Mystery", status: "quantum_superposition" },
        "not even an object",
      ],
    });
    const rows = await coinsApi.listMyReferrals();
    expect(rows).toHaveLength(1);
    expect(rows?.[0].label).toBe("Known");
  });

  test("a failed list is null, and the page is still complete", async () => {
    // This is the case that makes the whole enrichment safe: the endpoint not
    // existing yet cannot take the §2.4 numbers down with it.
    mockedApiRequest.mockRejectedValue({ status: 404 });
    expect(await coinsApi.listMyReferrals()).toBeNull();
  });

  test("an unreadable envelope is null rather than an empty list", async () => {
    // "There are no per-referral rows" and "we could not read the list" are
    // different sentences, and only one of them is true here.
    mockedApiRequest.mockResolvedValue({ success: true, data: { nope: true } });
    expect(await coinsApi.listMyReferrals()).toBeNull();
  });
});
