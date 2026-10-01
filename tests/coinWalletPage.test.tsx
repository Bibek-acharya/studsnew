/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import StarterAllowanceCard from "@/components/coins/StarterAllowanceCard";
import type { CoinAllowance } from "@/services/coinsApi";

/**
 * The wallet page's two rule-bound sections.
 *
 * The allowance card is where §2.4's six constraints are enforced and where the
 * two banned phrasings live — "free" and any rendering of the allowance as a
 * coin count. The ledger's arithmetic is checked through the helpers it depends
 * on rather than through a rendered page, because the page is a client component
 * behind a data read that has no server-side fixture.
 */

// `let`, not `const`: jest.mock factories are hoisted above the imports, so a
// binding declared here is what the mocked module closes over. The
// authenticated session is stubbed but the page under test renders the
// allowance card directly, which needs no session of its own.
const mockUser = { id: 7 };
const mockAuthLoading = false;
const mockBalance = null;

jest.mock("@/services/AuthContext", () => ({
  useAuth: () => ({ user: mockUser, loading: mockAuthLoading }),
}));

jest.mock("@/services/coinsApi", () => ({
  ...jest.requireActual("@/services/coinsApi"),
  coinsApi: {
    getBalance: () => Promise.resolve(mockBalance),
    listTransactions: () => Promise.resolve(null),
  },
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const DAY = 86_400_000;
const inDays = (days: number) => new Date(Date.now() + days * DAY).toISOString();

const allowance = (over: Partial<CoinAllowance> = {}): CoinAllowance => ({
  granted_at: inDays(-30),
  expires_at: inDays(19),
  document_unlocks: 3,
  document_used: 0,
  video_unlocks: 1,
  video_used: 0,
  mock_test_unlocks: 1,
  mock_test_used: 0,
  ...over,
});

describe("the allowance is never rendered as coins", () => {
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

  const render = (value: CoinAllowance | null) => {
    act(() => {
      root.render(<StarterAllowanceCard allowance={value} />);
    });
    return container.textContent ?? "";
  };

  test("a live allowance shows counts and a date, never a balance", () => {
    const text = render(allowance());
    expect(text).toContain("Starter unlocks");
    expect(text).toContain("5 starter unlocks left");
    // A date, not a countdown: "Use them by <day month year>" and nothing that
    // ticks. The exact rendering is asserted in coinWalletSurface against a
    // fixed clock; here the shape is what matters.
    expect(text).toMatch(/Use them by \d{1,2} [A-Z][a-z]+ \d{4}/);
    // Constraint 6: not a coin figure anywhere, not even as an equivalent.
    expect(text).not.toMatch(/studstoken/i);
    expect(text).not.toMatch(/NPR|Rs\.?/i);
    expect(text).not.toMatch(/\bfree\b/i);
  });

  test("the quota line singularises the grants of one", () => {
    // Every starter grant is small, so "1 video lecture" is the common case and
    // "1 video lectures" is what actually reaches a student.
    expect(render(allowance())).toContain(
      "3 documents · 1 video lecture · 1 mock test",
    );
  });

  test("an allowance that was never granted renders nothing at all", () => {
    // Null is not "used up". The backend distinguishes them deliberately:
    // `granted_at` null means nothing was ever issued, and rendering that as a
    // lapsed allowance tells a student their unlocks ran out when they never
    // had any.
    expect(render(null)).toBe("");
    expect(render(allowance({ granted_at: null }))).toBe("");
  });

  test("a used-up allowance says so and stops there", () => {
    const text = render(
      allowance({ document_used: 3, video_used: 1, mock_test_used: 1 }),
    );
    expect(text).toContain("Your starter unlocks are used up.");
    expect(text).not.toContain("left");
  });

  test("an expired allowance states the date, with no apology and no offer", () => {
    const text = render(allowance({ expires_at: inDays(-11) }));
    expect(text).toMatch(
      /Your starter unlocks expired on \d{1,2} [A-Z][a-z]+ \d{4}\./,
    );
    // 09 §"What support must never promise": no extension, no apology, and
    // nothing that reads as a fine.
    expect(text).not.toMatch(/sorry|apolog|extend|extension|lose/i);
  });

  test("an expiry inside its window carries a glyph, not colour alone", () => {
    const text = render(allowance({ expires_at: inDays(2) }));
    expect(text).toMatch(/Use them by/);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});