/**
 * @jest-environment jsdom
 *
 * The referral surface: how §2.4's numbers are allowed to be shown, and the copy
 * rules that govern every string on the page.
 *
 * The load-bearing test in this file is the first one. "3 referrals, 180 coins"
 * is the kind of sentence that is not obviously a lie and is wrong in three ways,
 * and the only defence against it is that the held group carries no coin figure
 * at all — so there is nothing on this surface that could be summed, and the one
 * figure that IS shown is labelled as money in the balance.
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import ReferralLedger from "@/components/coins/ReferralLedger";
import ReferralCodeShare from "@/components/coins/ReferralCodeShare";
import {
  CAP_REACHED,
  COPY,
  HOLD_RULE,
  buildReferralGroups,
  buildReferralRows,
  capLine,
  monthlyCap,
} from "@/components/coins/referralView";
import type {
  MyReferral,
  ReferralRowState,
  ReferralStats,
} from "@/services/coinsApi";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

/** §2.4's worked example, verbatim against the implementation. */
const STATS: ReferralStats = {
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

describe("settled and held are never added together", () => {
  test("the settled figure is the only coin figure on the surface", () => {
    const settled = buildReferralGroups(STATS).find((g) => g.group === "settled");
    const hold = buildReferralGroups(STATS).find((g) => g.group === "on-hold");

    expect(settled?.coins).toBe(540);

    // THE load-bearing assertion, and it is stronger than the one it replaced.
    // There used to be a second figure here — a `coins_pending` of 180 — and the
    // old test's job was to prove the two were never summed into 720. The server
    // no longer sends it: a referral payout credits the referrer directly instead
    // of reserving against their balance, so there is no reserved balance and
    // nothing to report. The stronger property is that the held group now carries
    // NO figure at all rather than a zero the server never sent.
    expect(hold?.coins).toBeNull();

    const renderedGroups = buildReferralGroups(STATS);
    expect(renderedGroups).toHaveLength(3);
    // Two of the three groups carry no figure: the one that will never pay, and
    // the one whose value the server does not report.
    expect(renderedGroups.filter((g) => g.coins === null)).toHaveLength(2);
  });

  test("the held group still states its COUNT, because the server sends one", () => {
    // Dropping the coin figure must not drop the count. `pending` is a real
    // server field and "3 on hold" is a true answer; "0 on hold" would tell a
    // student three invitations are unaccounted for.
    const hold = buildReferralGroups(STATS).find((g) => g.group === "on-hold");
    expect(hold?.count).toBe("3 on hold");
  });

  test("the held group says plainly that the money is not in the balance", () => {
    const hold = buildReferralGroups(STATS).find((g) => g.group === "on-hold")!;
    // This clause is what stops the group being read as money, and 06 §6's
    // second sentence is what stops the hold being read as a hidden deduction.
    expect(hold.note).toContain("Not in your balance yet");
    expect(hold.note).toContain(HOLD_RULE);
    expect(hold.tone).toBe("clock");
  });

  test("the settled group is stated as balance, and the tone is emerald", () => {
    const settled = buildReferralGroups(STATS).find((g) => g.group === "settled")!;
    expect(settled.note).toContain("in your balance now");
    expect(settled.tone).toBe("landed");
  });
});

describe("a referral that did not qualify is a fact, not a failure", () => {
  test("it is counted, and it is never red", () => {
    const notConfirmed = buildReferralGroups(STATS).find(
      (g) => g.group === "not-confirmed",
    )!;
    // Counted, so the page's arithmetic reconciles and "where did my other two
    // go" is answerable from the screen. 06 §1.7 forbids scolding the student
    // for inviting someone, and §0.4 reserves red for a failed fraud check.
    expect(notConfirmed.count).toBe("1 not confirmed");
    expect(notConfirmed.tone).toBe("neutral");
    expect(notConfirmed.coins).toBeNull();
    // No row is dressed as a failure.
    expect(notConfirmed.label).toBe("Not confirmed");
  });

  test("no tone anywhere on the surface is a destructive one", () => {
    const tones = buildReferralGroups(STATS).map((g) => g.tone);
    expect(new Set(tones)).toEqual(new Set(["landed", "clock", "neutral"]));
  });
});

describe("the cap is reconstructed, not invented", () => {
  test("used plus remaining gives the total, and the meter follows it", () => {
    const cap = monthlyCap(STATS)!;
    expect(cap.used).toBe(4);
    expect(cap.remaining).toBe(6);
    expect(cap.cap).toBe(10);
    expect(cap.percent).toBe(40);
  });

  test("a cap of zero renders no meter rather than '0 of 0'", () => {
    // Both terms zero means a misconfigured economy, not a student at their
    // limit, and "0 of 0 used this month" is a claim about a limit that is not
    // there.
    expect(monthlyCap({ ...STATS, this_month_qualified: 0, monthly_cap_remaining: 0 })).toBeNull();
  });

  test("at the limit the copy says so, and promises no date", () => {
    const capped = monthlyCap({ ...STATS, this_month_qualified: 10, monthly_cap_remaining: 0 })!;
    expect(capped.remaining).toBe(0);
    expect(capped.percent).toBe(100);
    // No date: §2.4 sends none and 09 forbids promising one.
    expect(CAP_REACHED).toContain("It resets next month");
    expect(CAP_REACHED).not.toMatch(/\d{1,2} [A-Z][a-z]+ \d{4}|\d{4}-\d{2}-\d{2}/);
    expect(CAP_REACHED).not.toMatch(/\bon \d|January|February|March|April|May|June|July|August|September|October|November|December/);
  });

  test("the ordinary cap line states a cycle, not a date", () => {
    const line = capLine(4, 10);
    expect(line).toBe("4 of 10 used this month · resets next month");
    expect(line).not.toMatch(/\d{4}/);
  });
});

describe("per-referral rows", () => {
  const rows: MyReferral[] = [
    { id: "1", label: "Aarav Sharma", state: "on-hold", holdUntil: "22 November 2026" },
    { id: "2", label: "Bina Rai", state: "settled", holdUntil: null },
    { id: "3", label: "", state: "not-confirmed", holdUntil: null },
    { id: "4", label: "Chetan", state: "capped", holdUntil: null },
  ];

  test("a held row carries the date and the rule", () => {
    const [first] = buildReferralRows(rows);
    // Sorted settled-first by buildReferralRows, so find rather than index.
    const held = buildReferralRows(rows).find((r) => r.state === "on-hold")!;
    expect(held.label).toBe("Aarav Sharma");
    expect(held.badge).toBe("Held until 22 November 2026");
    expect(held.note).toBe(HOLD_RULE);
    expect(first.state).toBe("settled");
  });

  test("a row with no name is generic rather than numbered", () => {
    // A list that invents "Friend 1" has invented a person.
    const anonymous = buildReferralRows(rows).find((r) => r.state === "not-confirmed")!;
    expect(anonymous.label).toBe("");
    expect(anonymous.badge).toBe("Not confirmed");
  });

  test("a held row with no date says 'On hold' rather than inventing one", () => {
    const view = buildReferralRows([
      { id: "9", label: "Deepak", state: "on-hold", holdUntil: null },
    ]);
    expect(view[0].badge).toBe("On hold");
    expect(view[0].badge).not.toMatch(/until/);
  });

  test("only held rows carry the hold rule", () => {
    const views = buildReferralRows(rows);
    for (const view of views) {
      expect(view.note === HOLD_RULE).toBe(view.state === "on-hold");
    }
  });
});

describe("the copy deck obeys 09 and 06 §10", () => {
  const banned = /prize|award|\bwin\b|winner|raffle|\bdraw\b|baksis|jitauri/i;
  const hasExclamation = /!/;
  // Word-bounded: an unanchored `Rs` matches the "rs" in "friends", which is how
  // a currency check ends up failing on a string that has no currency in it.
  const currency = /\bNPR\b|\bRs\.?\b|₹|\brupees?\b/i;
  const promisesABuy = /\bunlock|spend|buy|purchase|redeem|cash out/i;

  test("no banned windfall-gain word appears in any surface string", () => {
    // Naming, not phrasing: these are an Income Tax Act 2058 s.5/88A exposure.
    const strings = Object.values(COPY).map(String).concat([
      CAP_REACHED,
      HOLD_RULE,
      capLine(4, 10),
    ]);
    for (const text of strings) expect(text).not.toMatch(banned);
  });

  test("no exclamation mark in system copy", () => {
    for (const text of Object.values(COPY).map(String)) {
      expect(text).not.toMatch(hasExclamation);
    }
  });

  test("no currency is ever printed beside a coin count", () => {
    for (const text of Object.values(COPY).map(String)) {
      expect(text).not.toMatch(currency);
    }
  });

  test("the word 'free' never appears", () => {
    for (const text of Object.values(COPY).map(String)) {
      expect(text).not.toMatch(/\bfree\b/i);
    }
  });

  test("no share-side string implies coins can currently buy something", () => {
    // The earn side is live and the spend side is not. The referral surface is
    // where a student is told what coins are for, so nothing in the invite or the
    // share row may say they unlock anything.
    //
    // `spendNote` is excluded deliberately and is asserted separately: it is the
    // one honest statement about the gates, and its whole content is the denial.
    // Testing it against the same ban would fail on the word "spend" inside "not
    // spend them yet".
    const shareSide = Object.entries(COPY)
      .filter(([key]) => key !== "spendNote")
      .map(([, value]) => String(value));
    for (const text of shareSide) {
      expect(text).not.toMatch(promisesABuy);
    }

    // And the denial itself is present, and says the gates are off.
    expect(COPY.spendNote).toMatch(/not spend them yet/);
    expect(COPY.spendNote).toMatch(/when that switches on/);
    expect(COPY.spendNote).not.toMatch(/now you can (unlock|spend|buy)/i);
  });

  test("the share message is first person, because the student sends it", () => {
    expect(COPY.shareMessage).toContain("my code");
    expect(COPY.shareMessage).not.toMatch(hasExclamation);
    expect(COPY.shareMessage).not.toMatch(banned);
  });

  test("British-leaning spelling is used where a choice exists", () => {
    // `recognise`-style forms, not `-ize`. The strings here avoid the
    // contested spellings entirely, which is the stronger form of compliance.
    for (const text of Object.values(COPY).map(String)) {
      expect(text).not.toMatch(/\b(organize|organize[ds]?|customize|color|behavior|favorite|analyze)\w*/i);
    }
  });
});

describe("the rendered surface", () => {
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

  test("the ledger shows the settled figure, and names the hold without pricing it", () => {
    act(() => {
      root.render(<ReferralLedger stats={STATS} rows={null} />);
    });
    const text = container.textContent ?? "";

    expect(text).toContain("Added to your balance");
    expect(text).toContain("540");
    expect(text).toContain("On hold");
    expect(text).toContain("Not in your balance yet");
    expect(text).toContain("1 not confirmed");

    // THE assertion, and it is about absence. The server retired `coins_pending`,
    // so the only coin figure on this surface is the settled one. "0
    // StudsTokens" on the held group would be a figure nobody sent, on the one
    // group whose entire job is to not read as money in the balance.
    // Word-bounded, and deliberately not `not.toContain("0 StudsTokens")`:
    // "540 StudsTokens" contains that substring, so the naive assertion fails on
    // the settled group and would not have tested the held one at all.
    expect(text).not.toMatch(/\b0\s+StudsTokens/);
    expect(text).not.toMatch(/On hold[\s\S]{0,120}?\d+\s*StudsTokens/);

    // The dishonest sentences this page exists to avoid.
    expect(text).not.toContain("720");
    expect(text).not.toMatch(/\b3 referrals\b/);
    expect(text).not.toMatch(/total[^.]*\b720\b/i);
  });

  test("every group carries a glyph, so colour is never the only signal", () => {
    act(() => {
      root.render(<ReferralLedger stats={STATS} rows={null} />);
    });
    // One per group, and none of them red.
    expect(container.querySelectorAll("svg").length).toBeGreaterThanOrEqual(3);
    expect(container.innerHTML).not.toMatch(/bg-red-\d+/);
  });

  test("a row with no name renders 'Your friend'", () => {
    act(() => {
      root.render(
        <ReferralLedger
          stats={STATS}
          rows={[{ id: "1", label: "", state: "on-hold", holdUntil: null }]}
        />,
      );
    });
    expect(container.textContent).toContain("Your friend");
    expect(container.textContent).toContain(HOLD_RULE);
  });

  test("the code is shown verbatim with the deck's treatment", () => {
    act(() => {
      root.render(
        <ReferralCodeShare
          code="7K2M9Q4XTB"
          link="https://studsphere.com/r/7K2M9Q4XTB"
        />,
      );
    });
    const code = container.querySelector("code");
    expect(code?.textContent).toBe("7K2M9Q4XTB");
    // §6's exact classes.
    expect(code?.className).toContain("font-mono");
    expect(code?.className).toContain("tracking-[0.18em]");
    expect(code?.className).toContain("rounded-md");
    expect(container.textContent).toContain("Copy code");
    // The share message is pre-filled with the code the student was given.
    expect(COPY.shareMessage.replace("{CODE}", "7K2M9Q4XTB")).toContain("7K2M9Q4XTB");
  });

  test("the invitee's own award is never mentioned on the referrer's page", () => {
    act(() => {
      root.render(<ReferralCodeShare code="7K2M9Q4XTB" link="https://x/r/7K2M9Q4XTB" />);
    });
    // 06 §6: the 25 coins are the invitee's award, shown in the invitee's wallet.
    // Mentioning it here would frame the invite as recruiting for the referrer's
    // benefit with someone else's reward attached.
    expect(container.textContent).not.toMatch(/\b25\b/);
  });
});

describe("state names are exhaustive", () => {
  test("every row state has a badge and a defined treatment", () => {
    const states: ReferralRowState[] = ["settled", "on-hold", "not-confirmed", "capped"];
    for (const state of states) {
      const [view] = buildReferralRows([{ id: "x", label: "A", state, holdUntil: null }]);
      expect(view.badge.length).toBeGreaterThan(0);
      expect(view.state).toBe(state);
    }
  });
});
