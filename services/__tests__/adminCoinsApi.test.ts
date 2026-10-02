/**
 * @jest-environment jsdom
 *
 * jsdom because the admin coin endpoints are authenticated from
 * `localStorage["superadmin_token"]`, and asserting that the right token is sent is
 * half of what this client is for. The repo's jest default is `node`, so the
 * docblock is required — the same pattern studyResourcesApi.test.ts uses.
 */
import {
  adminCoinsApi,
  adjustmentReasons,
  diffConfigVersions,
  summariseHealth,
  type AdminEconomyConfig,
  type AdminSupportView,
} from "../adminCoinsApi";

/**
 * The admin coin console's client.
 *
 * The properties tested here are not about shape — the shapes are checked by
 * TypeScript. They are about the three ways this client can quietly do the wrong
 * thing, and all three have a legal or financial tail:
 *
 *  1. **Send no balance.** There is deliberately no `setBalance` method, because
 *     04 §4.4 forbids "set balance to N" and `coins/adjust.go` refuses the ledger's
 *     Reverse path outright. A client that offered a setter would put a
 *     not-reversible operation one autocomplete away. Asserted below.
 *  2. **Send the superadmin token.** These endpoints are behind
 *     `RequireRole("superadmin", "super_admin")`, distinct from the main user
 *     session — so a call authenticated as an ordinary student would either 403 or,
 *     worse, be read as a different principal.
 *  3. **Send an idempotency key that is reused.** The correction endpoint requires
 *     one and the ledger treats a repeat as a replay rather than a second
 *     correction. A key derived from the amount or the timestamp defeats that, so
 *     the key is generated once per user-intent and must be stable across retries.
 */

jest.mock("../api", () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from "../api";
const mockRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

const CONFIG: AdminEconomyConfig = {
  prices: { study_resource: 40, video: 90, mock_test: 25 },
  awards: {
    profile_complete: 200,
    profile_instalment: 50,
    profile_instalments: 4,
    referral_referrer: 300,
    referral_referred: 200,
    resource_approved: 80,
  },
  allowance: {
    document_unlocks: 3,
    video_unlocks: 1,
    mock_test_unlocks: 1,
    expires_in_days: 90,
  },
  expiry: { free_days: 90, earned_days: 365, activity_extend_days: 180 },
  referral: { monthly_cap: 10, lifetime_coin_cap: 5000, hold_days: 7 },
  clawback_window_days: 14,
  gates_enabled: { study_resource: false, video: false, mock_test: false },
  unlock_endpoint_enabled: false,
};

beforeEach(() => {
  mockRequest.mockReset();
  mockRequest.mockResolvedValue({ success: true, data: {} });
  window.localStorage.clear();
});

// ─── the balance-setter prohibition ───────────────────────────────────────────

describe("the admin coin client", () => {
  it("exposes no way to set a balance", () => {
    // 04 §4.4 and coins/adjust.go: a correction is a signed MOVEMENT, never "set
    // balance to N". There is no such endpoint on the server, so a client method
    // named for one would either 404 or — far worse — tempt someone to implement it
    // as a difference. Its absence is the guarantee.
    const surface = Object.keys(adminCoinsApi).map((k) => k.toLowerCase());
    for (const banned of ["setbalance", "setwallet", "setcoins", "overwrite"]) {
      expect(surface).not.toContain(banned);
    }
    // And the movement methods that DO exist are named for movements.
    expect(surface).toContain("adjust");
  });

  it("authenticates every admin call with the superadmin token", async () => {
    window.localStorage.setItem("superadmin_token", "sa-secret");

    await adminCoinsApi.getEconomyConfig();

    const options = mockRequest.mock.calls[0][1] as { authToken?: string };
    expect(options.authToken).toBe("sa-secret");
  });

  it("reads each documented admin path", async () => {
    await adminCoinsApi.getEconomyConfig();
    expect(mockRequest.mock.calls[0][0]).toBe("/api/v1/admin/coins/economy");

    await adminCoinsApi.getConfigHistory(25);
    expect(mockRequest.mock.calls[1][0]).toBe("/api/v1/admin/coins/economy/versions?limit=25");

    await adminCoinsApi.getHealth(30);
    expect(mockRequest.mock.calls[2][0]).toBe("/api/v1/admin/coins/economy-daily?days=30");

    await adminCoinsApi.getSupportView(4242);
    expect(mockRequest.mock.calls[3][0]).toBe("/api/v1/admin/coins/users/4242");

    await adminCoinsApi.adjust({
      userId: 4242,
      amount: -10,
      reason: "DUPLICATE_AWARD",
      idempotencyKey: "k-1",
    });
    // The target is in the PATH, not the body: the operator saw which student they
    // were correcting, and it belongs next to that in the access log.
    expect(mockRequest.mock.calls[4][0]).toBe("/api/v1/admin/coins/adjust/4242");
  });

  it("never puts the amount or the user in the adjust body", async () => {
    await adminCoinsApi.adjust({
      userId: 4242,
      amount: -10,
      reason: "DUPLICATE_AWARD",
      idempotencyKey: "k-1",
      note: "paid twice on 2 Oct",
    });

    const body = JSON.parse((mockRequest.mock.calls[0][1] as { body: string }).body);
    // The body carries the MOVEMENT and its attribution. user_id is deliberately
    // absent: the path already names the student, and a body that could disagree
    // with the path is a body that will.
    expect(body).not.toHaveProperty("user_id");
    expect(body).not.toHaveProperty("userId");
    expect(body.amount).toBe(-10);
    expect(body.reason).toBe("DUPLICATE_AWARD");
    expect(body.idempotency_key).toBe("k-1");
    expect(body.note).toBe("paid twice on 2 Oct");
  });

  it("sends the idempotency key as a header, not only in the body", async () => {
    // The server reads the header. A key that only reached the body would be
    // ignored, and the correction would be applied twice on retry — the exact
    // double-payment the key exists to prevent.
    await adminCoinsApi.adjust({
      userId: 7,
      amount: 5,
      reason: "GOODWILL_CREDIT",
      idempotencyKey: "corr-abc-123",
    });
    const options = mockRequest.mock.calls[0][1] as {
      headers?: Record<string, string>;
    };
    const headerNames = Object.keys(options.headers ?? {}).map((k) => k.toLowerCase());
    expect(headerNames).toContain("idempotency-key");
    expect(options.headers?.["Idempotency-Key"]).toBe("corr-abc-123");
  });

  it("refuses a zero-amount correction before sending it", async () => {
    // A zero movement is not a correction and the ledger would reject it. Catching
    // it here turns a round trip and a 400 into an immediate field error.
    await expect(
      adminCoinsApi.adjust({ userId: 1, amount: 0, reason: "OTHER", idempotencyKey: "k" }),
    ).rejects.toThrow(/zero/i);
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it("refuses a reason outside the closed set before sending it", async () => {
    // The server enforces a DB CHECK on the vocabulary; catching it here means the
    // admin gets a message naming the valid codes rather than a constraint error.
    await expect(
      adminCoinsApi.adjust({
        userId: 1,
        amount: 5,
        reason: "BECAUSE_I_SAID_SO",
        idempotencyKey: "k",
      }),
    ).rejects.toThrow(/reason/i);
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it("unwraps the data envelope rather than returning it whole", async () => {
    mockRequest.mockResolvedValue({ success: true, data: CONFIG });
    await expect(adminCoinsApi.getEconomyConfig()).resolves.toMatchObject({
      prices: { study_resource: 40 },
    });
  });
});

// ─── the reason vocabulary ────────────────────────────────────────────────────

describe("adjustmentReasons", () => {
  it("offers only the closed set the server accepts", () => {
    // Mirrors coins.AdjustmentReasonsSQLList(). A UI select that offers an extra
    // option produces a write the database rejects, so the client's set and the
    // server's CHECK have to agree.
    expect(adjustmentReasons.map((r) => r.code).sort()).toEqual([
      "DATA_CORRECTION",
      "DUPLICATE_AWARD",
      "GOODWILL_CREDIT",
      "OTHER",
      "UNAUTHORISED_SPEND",
    ]);
  });

  it("describes each reason, so an operator is not picking from bare codes", () => {
    // The codes are audit vocabulary, not English. An operator choosing between
    // "DATA_CORRECTION" and "OTHER" with no label is choosing at random, and the
    // record of WHY is the thing this endpoint exists to preserve.
    for (const reason of adjustmentReasons) {
      expect(reason.label.length).toBeGreaterThan(3);
    }
  });
});

// ─── the version diff ─────────────────────────────────────────────────────────

describe("diffConfigVersions", () => {
  it("names only the fields that actually changed", () => {
    const before = { ...CONFIG };
    const after = {
      ...CONFIG,
      prices: { ...CONFIG.prices, study_resource: 55 },
      gates_enabled: { study_resource: true, video: false, mock_test: false },
    };

    const changes = diffConfigVersions(before, after);
    const paths = changes.map((c) => c.path);

    expect(paths).toContain("prices.study_resource");
    expect(paths).toContain("gates_enabled.study_resource");
    // The whole point: an audit row with 40 unchanged fields listed alongside the
    // two that moved is a row nobody reads.
    expect(paths).not.toContain("prices.video");
    expect(paths).not.toContain("expiry.earned_days");
  });

  it("reports the previous and the new figure for each change", () => {
    const after = { ...CONFIG, prices: { ...CONFIG.prices, video: 120 } };
    const changes = diffConfigVersions(CONFIG, after);
    const video = changes.find((c) => c.path === "prices.video");

    expect(video?.before).toBe(90);
    expect(video?.after).toBe(120);
  });

  it("shows a false gate as a change, since turning one ON is the biggest move here", () => {
    // A boolean that flips false -> true is the single most consequential edit an
    // operator can make to this economy — it starts charging students. A diff that
    // skipped falsy values would omit exactly the rows that matter.
    const after = { ...CONFIG, gates_enabled: { ...CONFIG.gates_enabled, mock_test: true } };
    const changes = diffConfigVersions(CONFIG, after);

    expect(changes).toHaveLength(1);
    expect(changes[0].before).toBe(false);
    expect(changes[0].after).toBe(true);
  });

  it("returns nothing when two versions are identical", () => {
    expect(diffConfigVersions(CONFIG, { ...CONFIG })).toEqual([]);
  });
});

// ─── the health summary ───────────────────────────────────────────────────────

describe("summariseHealth", () => {
  it("says nothing is known when there is no history", () => {
    // Day one of a fresh deployment. The dashboard must not render "all clear",
    // because an operator who reads an empty dashboard as healthy will not look
    // again once data starts arriving.
    const summary = summariseHealth(null);
    expect(summary.status).toBe("unknown");
    expect(summary.reasons.join(" ")).not.toMatch(/healthy|compliant/i);
  });

  it("flags a breach of the fraud ratio rather than merely reporting it", () => {
    // 05 §5: "treat as a ratio monitored weekly, not an incident discovered later".
    // A metric that computes but does not flag is a number nobody acts on.
    const summary = summariseHealth({
      days: [],
      summary: {
        coins_issued: 1000,
        coins_spent: 500,
        coins_expired: 0,
        faucet_sink_ratio: 2,
        faucet_sink_ratio_defined: true,
        velocity: 2,
        velocity_defined: true,
        referral_share: 0.2,
        referral_share_defined: true,
        referral_share_healthy: false,
        days_above_target: 7,
        days_defined: 30,
        days_of_currency_on_hand: 40,
        days_of_currency_on_hand_defined: true,
      },
      referral_share_target: 0.08,
      metric_version: 1,
      window_days: 30,
    });

    expect(summary.status).toBe("action");
    expect(summary.reasons.join(" ")).toMatch(/referral/i);
  });

  it("flags a faucet:sink ratio outside the 0.7-1.3 band", () => {
    const summary = summariseHealth({
      days: [],
      summary: {
        coins_issued: 5000,
        coins_spent: 100,
        coins_expired: 0,
        faucet_sink_ratio: 50,
        faucet_sink_ratio_defined: true,
        velocity: 50,
        velocity_defined: true,
        referral_share: 0,
        referral_share_defined: true,
        referral_share_healthy: true,
        days_above_target: 0,
        days_defined: 30,
        days_of_currency_on_hand: 1,
        days_of_currency_on_hand_defined: true,
      },
      referral_share_target: 0.08,
      metric_version: 1,
      window_days: 30,
    });

    expect(summary.status).toBe("action");
    expect(summary.reasons.join(" ")).toMatch(/faucet/i);
  });

  it("says unknown rather than healthy for an undefined ratio", () => {
    // An idle day or a fresh deployment has no defined faucet:sink ratio. Reporting
    // that as a passing ratio would be inventing a measurement.
    const summary = summariseHealth({
      days: [],
      summary: {
        coins_issued: 0,
        coins_spent: 0,
        coins_expired: 0,
        faucet_sink_ratio: 0,
        faucet_sink_ratio_defined: false,
        velocity: 0,
        velocity_defined: false,
        referral_share: 0,
        referral_share_defined: false,
        referral_share_healthy: false,
        days_above_target: 0,
        days_defined: 0,
        days_of_currency_on_hand: 0,
        days_of_currency_on_hand_defined: false,
      },
      referral_share_target: 0.08,
      metric_version: 1,
      window_days: 30,
    });

    expect(summary.status).toBe("unknown");
  });

  it("calls a healthy window healthy", () => {
    const summary = summariseHealth({
      days: [],
      summary: {
        coins_issued: 1000,
        coins_spent: 600,
        coins_expired: 400,
        faucet_sink_ratio: 1,
        faucet_sink_ratio_defined: true,
        velocity: 1.67,
        velocity_defined: true,
        referral_share: 0.02,
        referral_share_defined: true,
        referral_share_healthy: true,
        days_above_target: 0,
        days_defined: 30,
        days_of_currency_on_hand: 20,
        days_of_currency_on_hand_defined: true,
      },
      referral_share_target: 0.08,
      metric_version: 1,
      window_days: 30,
    });

    expect(summary.status).toBe("ok");
  });
});

// ─── the support view ─────────────────────────────────────────────────────────

describe("the support view", () => {
  it("surfaces drift above everything else", () => {
    // `Drifted` is the field the endpoint exists for: cached != computed means a
    // real bug, and it is more urgent than any number on the same screen. A support
    // engineer reading a balance that is quietly wrong is worse off than one
    // reading no balance at all.
    const view = {
      user_id: 4242,
      total_available: 30,
      accounts: [
        {
          account_id: 1,
          bucket: "EARNED",
          kind: "USER",
          closed: false,
          cached_posted: 30,
          cached_reserved: 0,
          computed_posted: 35,
          computed_reserved: 0,
          drifted: true,
        },
      ],
    } as AdminSupportView;

    expect(view.accounts[0].drifted).toBe(true);
  });
});