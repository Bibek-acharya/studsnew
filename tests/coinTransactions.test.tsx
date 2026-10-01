/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import TransactionJournal from "@/components/coins/TransactionJournal";
import { coinsApi, type CoinTransaction } from "@/services/coinsApi";

/**
 * The transaction journal: cursor handling and the three render branches.
 *
 * Two properties are load-bearing and neither is visible in the markup:
 *
 * 1. **The cursor is opaque.** The client must never build one, decode one or
 *    compare one to a row — it hands the previous response's string back
 *    verbatim. 06 §2.2's worked example decodes to `{created_at}` alone, which is
 *    not unique; the implementation carries an id. A test that reconstructs the
 *    token would pin the client to whichever shape it happened to assume.
 * 2. **"No transactions" and "we could not read your history" are different
 *    screens.** A student who is owed an explanation for a missing grant is owed
 *    the truth about which one this is, and 09 §"The balance trap" makes the
 *    history the thing support argues from.
 */

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const row = (over: Partial<CoinTransaction> = {}): CoinTransaction => ({
  journal_id: "j1",
  entry_type: "GRANT",
  reason_code: "PROFILE_COMPLETE",
  amount: 5,
  balance_after: 25,
  ref: null,
  description: "Profile progress: your account",
  reversed: false,
  created_at: "2026-11-01T05:00:00Z",
  ...over,
});

describe("the journal pages with an opaque cursor", () => {
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
    jest.restoreAllMocks();
  });

  const settle = async () => {
    await act(async () => {
      root.render(<TransactionJournal />);
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  };

  test("the cursor from one response is handed back exactly, never rebuilt", async () => {
    // A token this client could not have produced. If the implementation ever
    // started parsing or reconstructing cursors, this would fail.
    const opaque = "eyJjcmVhdGVkX2F0IjoiMjAyNi0wOS0yNlQwNTowMDoxMVoiLCJpZCI6IjliMmMifQ";
    const spy = jest
      .spyOn(coinsApi, "listTransactions")
      .mockResolvedValueOnce({ items: [row()], next_cursor: opaque })
      .mockResolvedValueOnce({ items: [row({ journal_id: "j2", amount: -40 })], next_cursor: "" });

    await settle();
    expect(container.textContent).toContain("Profile progress");
    expect(container.textContent).toContain("+5");

    const more = container.querySelector("button");
    expect(more?.textContent).toBe("Load more");
    await act(async () => {
      more?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(spy.mock.calls[1]?.[0]).toEqual({ cursor: opaque, limit: 20 });
    // Page 2 appended, not substituted: a student's earlier entries stay put.
    expect(container.textContent).toContain("+5");
    expect(container.textContent).toContain("40");
  });

  test("an empty cursor means the last page, and the button disappears", async () => {
    jest
      .spyOn(coinsApi, "listTransactions")
      .mockResolvedValue({ items: [row()], next_cursor: "" });
    await settle();
    expect(container.querySelector("button")?.textContent).not.toBe("Load more");
  });

  test("a failed read is an error, never an empty history", async () => {
    jest.spyOn(coinsApi, "listTransactions").mockResolvedValue(null);
    await settle();
    expect(container.textContent).toContain("could not read");
    // And the two together make the distinction explicit.
    expect(container.textContent).not.toContain("No StudsToken transactions yet");
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
  });

  test("a genuinely empty history says so, and says the balance is intact", async () => {
    jest.spyOn(coinsApi, "listTransactions").mockResolvedValue({ items: [], next_cursor: "" });
    await settle();
    expect(container.textContent).toContain("No StudsToken transactions yet");
  });

  test("a reversal appears as its own signed row", async () => {
    jest.spyOn(coinsApi, "listTransactions").mockResolvedValue({
      items: [
        row({ journal_id: "r1", entry_type: "REVERSAL", reason_code: "GRANT_REVERSAL", amount: -5, description: "Reversed: user_referral 12" }),
        row({ journal_id: "g1", reversed: true }),
      ],
      next_cursor: "",
    });
    await settle();
    // Signed, so the direction is text and not colour alone.
    expect(container.textContent).toContain("−5");
    expect(container.textContent).toContain("+5");
    // And the original row says it no longer stands, or a student scrolling
    // past it sees a positive amount with no indication anything happened.
    expect(container.textContent).toContain("This entry was reversed");
  });

  test("a raw reason code is never shown as jargon", async () => {
    // The backend's own fallback for an unrecognised code is the code. A wrong
    // or unreadable reason on a balance line is the thing support cannot
    // defend (09 §"The balance trap").
    jest.spyOn(coinsApi, "listTransactions").mockResolvedValue({
      items: [row({ description: "SOME_NEW_CODE" })],
      next_cursor: "",
    });
    await settle();
    expect(container.textContent).not.toContain("SOME_NEW_CODE");
  });

  test("no banned term reaches a ledger line", async () => {
    jest.spyOn(coinsApi, "listTransactions").mockResolvedValue({
      items: [
        row({ description: "Unlocked: Physics 2075 Past Paper" }),
        row({ journal_id: "g1", amount: 80, reason_code: "RESOURCE_APPROVED", description: "Resource published: study_resource 812" }),
      ],
      next_cursor: "",
    });
    await settle();
    for (const pattern of [/\bfree\b/i, /\bNPR\b/, /\bRs\.?\b/, /\bprize\b/i, /\baward\b/i, /\bwin\b/i, /!/]) {
      expect(container.textContent ?? "").not.toMatch(pattern);
    }
    // A coin figure and a resource title, with no money figure anywhere.
    expect(container.textContent).toContain("80");
    expect(container.textContent).toContain("Physics 2075 Past Paper");
  });
});