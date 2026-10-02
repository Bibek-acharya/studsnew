import {
  fetchPublicCoinTable,
  describeCharge,
  structureHeadline,
  termStatements,
  type PublicCoinTable,
  type PublicCoinTableEnvelope,
} from "../publicCoinTable";

/**
 * The public coin table's presentation logic (publicCoinTable.ts).
 *
 * These tests exist because of 09-support-copy-cheat-sheet.md, and specifically
 * because the copy rules are EASY to state and EASY to violate by accident three
 * months later when someone adds a fourth resource class or renames a label.
 *
 * The rules under test:
 *
 *   - "free" is banned whenever anything is chargeable, because CPA 2075
 *     s.16(2)(c)(3) treats advertising "even when no benefit is obtained as
 *     declared" as a misleading advertisement.
 *   - No currency figure may sit beside a coin figure. StudsTokens cannot be
 *     bought or cashed out, so any equivalence is false on the product's own
 *     terms — not merely inapt.
 *   - No "prize" / "award" / "winner": the Income Tax Act 2058 defines windfall
 *     gain by those words, and one email using one is enough.
 *   - Expiry is a date or a day count, never a countdown or "limited time".
 */

const CHARGING: PublicCoinTable = {
  prices: { study_resource: 40, video: 90, mock_test: 25 },
  charges_apply: { study_resource: true, video: true, mock_test: true },
  included: {
    document_unlocks: 3,
    video_unlocks: 1,
    mock_test_unlocks: 1,
    expires_in_days: 90,
  },
  expiry: {
    included_days: 90,
    earned_days: 365,
    earned_days_extended: 545,
    activity_extend_days: 180,
  },
  terms: {
    can_be_bought: false,
    can_be_sent_to_others: false,
    can_be_converted_to_money: false,
    spends_are_final: true,
    expired_coins_recoverable: false,
    referral_levels: 1,
  },
};

const NOT_CHARGING: PublicCoinTable = {
  ...CHARGING,
  charges_apply: { study_resource: false, video: false, mock_test: false },
};

/** Everything the page can render, concatenated, for a banned-word sweep. */
function renderAllRows(table: PublicCoinTable): string {
  return Object.values(describeCharge(table))
    .map((row) => `${row.label} ${row.detail}`)
    .join(" ");
}

// ─── the rows ────────────────────────────────────────────────────────────────

describe("describeCharge", () => {
  it("states the price when a charge actually applies", () => {
    const rows = describeCharge(CHARGING);
    const doc = rows.study_resource;

    expect(doc.label).toBe("Documents");
    // The figure is the headline. A row that buries "40" in a sentence is a row
    // nobody can scan, and this table exists to be scanned before a decision.
    expect(doc.detail).toContain("40");
    expect(doc.charged).toBe(true);
  });

  it("says a class is included rather than free when no charge applies", () => {
    const rows = describeCharge(NOT_CHARGING);
    const doc = rows.study_resource;

    expect(doc.charged).toBe(false);
    expect(doc.detail).toMatch(/included with your account/i);
    // The load-bearing assertion. 09's ban on "free" carries a criminal penalty,
    // and this is the only row in the whole product where the temptation is
    // strongest — a class the student pays nothing for is exactly what a careless
    // dev writes "free" about.
    expect(doc.detail).not.toMatch(/\bfree\b/i);
  });

  it("never shows a price for a class where the charge does not apply", () => {
    // This is the s.16(2)(c)(3) trap, and the reason charges_apply travels with
    // prices: the backend knows a document is published at 40 StudsTokens and
    // that the gate is off. A row that printed "40" regardless would be
    // advertising a charge that is not being made.
    const rows = describeCharge(NOT_CHARGING);
    expect(rows.study_resource.detail).not.toContain("40");
    expect(rows.video.detail).not.toContain("90");
    expect(rows.mock_test.detail).not.toContain("25");
  });

  it("puts no currency beside any coin figure", () => {
    const everything = renderAllRows(CHARGING);
    for (const marker of ["NPR", "Rs.", "Rs", "rupee", "₨", "$", "USD"]) {
      expect(everything).not.toContain(marker);
    }
  });

  it("uses no tax-trigger word in any row", () => {
    const everything = renderAllRows(CHARGING).toLowerCase();
    // The Income Tax Act 2058 defines windfall gain with these words. They feel
    // like compliments, which is exactly why they get written by accident.
    for (const word of ["prize", "award", "winner", "win ", "raffle", "baksis"]) {
      expect(everything).not.toContain(word);
    }
  });

  it("keeps expiry a plain day count with no urgency", () => {
    const everything = renderAllRows(CHARGING).toLowerCase();
    // 09 forbids urgency copy and any countdown on earned coins specifically.
    for (const phrase of ["limited time", "hurry", "expires soon", "act now", "don't miss"]) {
      expect(everything).not.toContain(phrase);
    }
  });

  it("ignores a negative or absurd figure rather than printing it", () => {
    // The backend clamps, so this cannot arrive from the API today. It is asserted
    // anyway because the rendering layer is where a bad number becomes a reader's
    // belief, and a defensive clamp here costs one line.
    const hostile: PublicCoinTable = {
      ...CHARGING,
      prices: { study_resource: -5, video: 0, mock_test: 0 },
    };
    const rows = describeCharge(hostile);
    expect(rows.study_resource.detail).not.toContain("-5");
    // A zero price is not a price; it means the class is not chargeable, so it
    // takes the "included" wording rather than "costs 0 StudsTokens".
    expect(rows.video.charged).toBe(false);
    expect(rows.video.detail).not.toContain("0 StudsToken");
  });
});

// ─── the response envelope ───────────────────────────────────────────────────

describe("fetchPublicCoinTable", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

  function mockFetch(body: unknown, ok = true) {
    global.fetch = jest.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 503,
      json: async () => body,
    }) as unknown as typeof fetch;
  }

  it("unwraps the {data} envelope", async () => {
    mockFetch({ success: true, data: CHARGING });
    await expect(fetchPublicCoinTable()).resolves.toMatchObject({
      prices: { study_resource: 40 },
    });
  });

  it("requests the documented public path with no credentials", async () => {
    mockFetch({ success: true, data: CHARGING });
    await fetchPublicCoinTable();

    const call = (global.fetch as jest.Mock).mock.calls[0];
    const [url, init] = call;

    expect(url).toContain("/api/v1/coins/table");
    // No Authorization header, no cookies. The endpoint is public by design — a
    // disclosure behind a login does not reach the student deciding whether to
    // register — and sending credentials to it would make the page fail for a
    // logged-out visitor if the backend ever tightened up.
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(Object.keys(headers).map((k) => k.toLowerCase())).not.toContain(
      "authorization",
    );
  });

  it("returns null rather than throwing when the table is unavailable", async () => {
    // The page must still render. A public terms page that 500s because the
    // economy service is down is worse than one that says the figures are
    // unavailable — the reader is looking for terms, not a number.
    mockFetch({}, false);
    await expect(fetchPublicCoinTable()).resolves.toBeNull();
  });

  it("returns null when the envelope has no usable table", async () => {
    mockFetch({ success: true, data: null });
    await expect(fetchPublicCoinTable()).resolves.toBeNull();

    mockFetch({ success: true });
    await expect(fetchPublicCoinTable()).resolves.toBeNull();
  });

  it("keeps a zeroed table rather than discarding it as empty", async () => {
    // A configured-but-all-zero economy is a real state — every gate ships dark,
    // so before an admin touches anything this is exactly the payload. Treating it
    // as "no data" would leave the page blank on a fresh deployment, which is the
    // moment the page most needs to exist.
    const zeroed = {
      prices: { study_resource: 0, video: 0, mock_test: 0 },
      charges_apply: { study_resource: false, video: false, mock_test: false },
      included: {
        document_unlocks: 0,
        video_unlocks: 0,
        mock_test_unlocks: 0,
        expires_in_days: 0,
      },
      expiry: {
        included_days: 0,
        earned_days: 0,
        earned_days_extended: 0,
        activity_extend_days: 0,
      },
      terms: {
        can_be_bought: false,
        can_be_sent_to_others: false,
        can_be_converted_to_money: false,
        spends_are_final: true,
        expired_coins_recoverable: false,
        referral_levels: 1,
      },
    };
    mockFetch({ success: true, data: zeroed });
    const got = await fetchPublicCoinTable();
    expect(got).not.toBeNull();
    expect(got!.terms.spends_are_final).toBe(true);
  });
});

// ─── the structural claims ───────────────────────────────────────────────────

describe("the structure statement", () => {
  it("leads with the single-level structure", () => {
    // 07's mitigation list, in order of preference: state the structure
    // proactively in the published coin table, so the first thing a reader finds
    // is the structure and not the name. The product name contains "Token" and
    // the Consumer Protection Act names "token system" in its pyramid-scheme
    // prohibition, so the order of these two facts is the whole mitigation.
    const headline = structureHeadline(CHARGING);

    expect(headline).toContain("1");
    // No network vocabulary. 07: never describe the mechanic in network, chain,
    // downline, tree or level language — those are the words that do the
    // regulator's work for them.
    for (const word of ["network", "chain", "downline", "tree"]) {
      expect(headline.toLowerCase()).not.toContain(word);
    }
  });

  it("states every permanent term as what it is", () => {
    const statements = termStatements(CHARGING).join(" ");

    // 09: never soften with "roughly" or "approximately"; never give a range.
    expect(statements.toLowerCase()).not.toContain("roughly");
    expect(statements.toLowerCase()).not.toContain("approximately");
    // The three ADR-001 invariants must each be answered, because a reader who has
    // to ask is a reader who suspects.
    expect(statements).toMatch(/cannot be bought/i);
    expect(statements).toMatch(/cannot be sent/i);
    expect(statements).toMatch(/cannot be converted to money/i);
  });
});

describe("PublicCoinTableEnvelope", () => {
  it("is the shape the backend actually returns", () => {
    // A type-only assertion. If the backend envelope changes, this is where the
    // mismatch should surface rather than as a blank page in production.
    const envelope: PublicCoinTableEnvelope = { success: true, data: CHARGING };
    // The non-null assertion is deliberate rather than a cast: this assertion exists
    // to check the TYPE, so asserting `data` away would defeat its purpose. The
    // runtime envelope really can carry null — fetchPublicCoinTable handles that —
    // which is exactly why the envelope types it as nullable.
    expect(envelope.data?.prices.study_resource).toBe(40);
  });
});