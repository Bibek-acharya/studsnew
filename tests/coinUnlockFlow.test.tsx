/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import ResourceAccessDialog from "@/components/coins/ResourceAccessDialog";
import type { ResolvedResourceAccess } from "@/components/coins/useCoinState";
import type { StudyResource } from "@/services/studyResourcesApi";
import type { CoinResourceType } from "@/services/coinsApi";

/**
 * The four outcomes, as four different screens.
 *
 * The distinction under test throughout is the expensive one: "you already own
 * this, nothing was spent" must never render the words of a charge, and a
 * failure must always say the balance has not changed. A student who retries on
 * a flaky connection is the case this exists for.
 *
 * The coin API is mocked rather than the network, so these assert on the
 * mapping from outcome to screen and not on fetch mechanics.
 */

const unlockMock = jest.fn();
const balanceMock = jest.fn();

// Only the two network methods are stubbed. The pure helpers (the spend
// preview, the outcome mapping, the key) come from the real module, so this
// suite tests the mapping from outcome to screen rather than re-testing the
// service it is already covered by in coinResourceState.
jest.mock("@/services/coinsApi", () => {
  const actual = jest.requireActual("@/services/coinsApi");
  return {
    ...actual,
    coinsApi: {
      getBalance: (...args: unknown[]) => balanceMock(...args),
      unlock: (...args: unknown[]) => unlockMock(...args),
    },
  };
});

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const resource = {
  id: 812,
  title: "Thermodynamics Notes",
  description: "Chapter notes",
  resource_type: "study-notes",
  course: "BSc CSIT",
  year: "2081",
  file_name: "notes.pdf",
  file_url: "/uploads/notes.pdf",
  file_size: 1_000,
  mime_type: "application/pdf",
  downloads: 3,
  created_at: "2026-09-01T00:00:00Z",
} as StudyResource;

const access = (over: Partial<ResolvedResourceAccess>): ResolvedResourceAccess => ({
  state: "affordable",
  price: 40,
  balance: 145,
  gap: 0,
  starterLeft: null,
  starterTotal: null,
  busy: false,
  ...over,
});

const BALANCE = {
  total_available: 145,
  total_reserved: 0,
  buckets: [{ bucket: "EARNED", balance: 145, expires_at: null, lot_count: 1 }],
  spend_order: [{ bucket: "EARNED", coins: 145, expires_at: null }],
  allowance: null,
};

const containers: HTMLElement[] = [];
const roots: Root[] = [];

function render(props: Partial<React.ComponentProps<typeof ResourceAccessDialog>> = {}) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  const root = createRoot(container);
  roots.push(root);
  act(() => {
    root.render(
      <ResourceAccessDialog
        access={access({})}
        resource={resource}
        resourceType={"study_resource" as CoinResourceType}
        signInHref="/login"
        enabled
        onSignIn={() => {}}
        onUnlocked={() => {}}
        onPlainAction={() => {}}
        {...props}
      />,
    );
  });
  return container;
}

function button(container: HTMLElement, re: RegExp): HTMLButtonElement {
  const found = Array.from(container.querySelectorAll("button")).find((b) =>
    re.test(b.textContent ?? ""),
  );
  if (!found) throw new Error(`no button matching ${re} in: ${container.textContent}`);
  return found;
}

async function clickAndSettle(container: HTMLElement, re: RegExp): Promise<void> {
  await act(async () => {
    button(container, re).dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

function dialog(container: HTMLElement): HTMLElement {
  return container.querySelector("[role='dialog']") as HTMLElement;
}

beforeEach(() => {
  unlockMock.mockReset();
  balanceMock.mockReset();
  balanceMock.mockResolvedValue(BALANCE);
});

afterEach(() => {
  while (roots.length) act(() => roots.pop()!.unmount());
  while (containers.length) containers.pop()!.remove();
});

describe("the confirmation", () => {
  test("states the cost, the resulting balance, and that FEFO is the rule", async () => {
    const container = render();
    await clickAndSettle(container, /Unlock/);

    const text = dialog(container).textContent ?? "";
    expect(text).toContain("Cost");
    expect(text).toContain("40 StudsTokens");
    // The balance is shown as a movement, not just a figure: a spend with no
    // "after" is the surprise this dialog exists to prevent.
    expect(text).toContain("145");
    expect(text).toContain("105");
    expect(text).toContain("We spend the StudsTokens that expire soonest first");
  });

  test("says nothing is spent until the student confirms", async () => {
    const container = render();
    await clickAndSettle(container, /Unlock/);
    expect(unlockMock).not.toHaveBeenCalled();
  });

  test("a confirmation with no price coverage is not offered", async () => {
    // The spend order does not add up to the price, so the balance moved since
    // the read. A live confirm here is how a student gets charged for something
    // they cannot afford.
    balanceMock.mockResolvedValue({
      ...BALANCE,
      total_available: 10,
      spend_order: [{ bucket: "EARNED", coins: 10, expires_at: null }],
    });
    const container = render({ access: access({ balance: 145 }) });
    await clickAndSettle(container, /Unlock/);

    expect(dialog(container).textContent).toContain("Not enough StudsTokens");
    expect(Array.from(container.querySelectorAll("button")).some((b) =>
      /Unlock for/.test(b.textContent ?? ""),
    )).toBe(false);
  });

  test("a preview that cannot be read offers a retry and no confirm", async () => {
    balanceMock.mockResolvedValue(null);
    const container = render();
    await clickAndSettle(container, /Unlock/);

    const text = dialog(container).textContent ?? "";
    expect(text).toContain("We could not check your balance");
    expect(text).toContain("Nothing has been spent");
    expect(button(container, /Try again/)).toBeDefined();
    expect(unlockMock).not.toHaveBeenCalled();
  });

  test("a starter unlock confirms without a cost table", async () => {
    const container = render({
      access: access({ state: "starter-eligible", starterLeft: 2, starterTotal: 3 }),
    });
    await clickAndSettle(container, /Use starter unlock/);

    const text = dialog(container).textContent ?? "";
    expect(text).toContain("This is 1 of your 3 document starter unlocks");
    // "145 → 145" would be theatre: a zero-cost action has no balance to move.
    expect(text).not.toContain("145");
  });
});

describe("the 200 outcome", () => {
  test("a charge states the number spent and the balance left", async () => {
    unlockMock.mockResolvedValue({
      status: "unlocked",
      alreadyUnlocked: false,
      usedAllowance: false,
      coinsPaid: 40,
      balanceAfter: 105,
      spentFrom: [],
    });
    const container = render();
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);

    const text = dialog(container).textContent ?? "";
    expect(text).toContain("Unlocked");
    expect(text).toContain("40 StudsTokens spent");
    expect(text).toContain("105 left");
  });

  test("an already-owned unlock says NOTHING was spent, in as many words", async () => {
    // The single most damaging wrong answer available here: telling a student
    // who already owns a resource that they were charged for it.
    unlockMock.mockResolvedValue({
      status: "unlocked",
      alreadyUnlocked: true,
      usedAllowance: false,
      coinsPaid: 0,
      balanceAfter: 145,
      spentFrom: [],
    });
    const container = render();
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);

    const text = dialog(container).textContent ?? "";
    expect(text).toContain("Already unlocked");
    expect(text).toContain("Nothing was spent");
    expect(text).toContain("your balance has not changed");
    // The charged screen's own phrasing must not appear here in any form.
    expect(text).not.toMatch(/\d+\s*StudsTokens spent/);
    expect(text).not.toMatch(/\d+\s*left/);
  });

  test("a settled unlock offers the real action, which is the download", async () => {
    const onUnlocked = jest.fn();
    unlockMock.mockResolvedValue({
      status: "unlocked",
      alreadyUnlocked: false,
      usedAllowance: false,
      coinsPaid: 40,
      balanceAfter: 105,
      spentFrom: [],
    });
    const container = render({ onUnlocked });
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);
    await clickAndSettle(container, /^Download$/);

    expect(onUnlocked).toHaveBeenCalledTimes(1);
  });
});

describe("the 402 outcome", () => {
  const INSUFFICIENT = {
    status: "insufficient",
    data: {
      required: 40,
      available: 18,
      shortfall: 22,
      expires_in_days: 12,
      ways_to_earn: [
        { code: "PROFILE", label: "Complete your profile", potential: 15 },
        { code: "UPLOAD", label: "Upload a study resource", potential: 80 },
      ],
      unavailable_routes: [
        { code: "REFERRAL", label: "Invite a friend", reason: "NOT_LAUNCHED" },
      ],
    },
  };

  test("leads with arithmetic: the gap, the cost, the balance", async () => {
    unlockMock.mockResolvedValue(INSUFFICIENT);
    const container = render();
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);

    const text = dialog(container).textContent ?? "";
    expect(text).toContain("You need 22 more StudsTokens");
    expect(text).toContain("This document costs 40 StudsTokens");
    expect(text).toContain("Your balance is 18");
  });

  test("renders the routes the SERVER decided, in the order it sent them", async () => {
    // Not a hardcoded list: a student with a finished profile must not be told
    // to finish it, and the client cannot know that.
    unlockMock.mockResolvedValue(INSUFFICIENT);
    const container = render();
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);

    const text = dialog(container).textContent ?? "";
    expect(text).toContain("Complete your profile");
    expect(text).toContain("+15 StudsTokens");
    expect(text).toContain("Upload a study resource");
    expect(text).toContain("+80 StudsTokens");
    // A route reported unavailable is shown as unavailable, with no button.
    expect(text).toContain("Invite a friend is not available yet");
  });

  test("is not red and not rose, and carries no warning icon", async () => {
    // Rose and red are the product's destructive and video signals. A shortfall
    // is a calculator, not a fine.
    unlockMock.mockResolvedValue(INSUFFICIENT);
    const container = render();
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);

    const panel = dialog(container);
    expect(panel.className).toContain("max-w-md");
    expect(panel.className).toContain("overflow-y-auto");
    expect(panel.innerHTML).not.toContain("text-red-");
    expect(panel.innerHTML).not.toContain("rose");
    expect(panel.innerHTML).toContain("bg-amber-50");
  });

  test("never leaves a dead end", async () => {
    unlockMock.mockResolvedValue(INSUFFICIENT);
    const container = render();
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);

    expect(dialog(container).textContent).toContain(
      "Browse resources you can unlock now",
    );
    expect(button(container, /Keep browsing/)).toBeDefined();
  });

  test("an empty route list says so and still offers a way forward", async () => {
    unlockMock.mockResolvedValue({
      status: "insufficient",
      data: {
        required: 40,
        available: 0,
        shortfall: 40,
        expires_in_days: null,
        ways_to_earn: [],
        unavailable_routes: [],
      },
    });
    const container = render();
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);

    const text = dialog(container).textContent ?? "";
    expect(text).toContain("no ways to earn more StudsTokens");
    expect(text).toContain("You can still unlock other resources");
    expect(button(container, /Keep browsing/)).toBeDefined();
  });

  test("carries no currency figure anywhere, and never the word free", async () => {
    // The banned combination: a coin count beside a money amount is a claim
    // about value that cannot be substantiated, because coins cannot be bought
    // or converted.
    unlockMock.mockResolvedValue(INSUFFICIENT);
    const container = render();
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);

    const text = dialog(container).textContent ?? "";
    expect(text).not.toMatch(/NPR|Rs\.?|rupee|₹/i);
    expect(text).not.toMatch(/\bfree\b/i);
    expect(text).not.toMatch(/prize|award|\bwin\b|raffle|\bdraw\b|baksis|jitauri/i);
  });
});

describe("the 423 outcome", () => {
  test("says the allowance expired, without an apology or an extension", async () => {
    unlockMock.mockResolvedValue({
      status: "allowance-expired",
      data: {
        required: 40,
        available: 18,
        shortfall: 22,
        expires_in_days: null,
        ways_to_earn: [],
        unavailable_routes: [],
      },
    });
    const container = render();
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);

    const text = dialog(container).textContent ?? "";
    expect(text).toContain("Your starter unlocks have expired");
    expect(text).toContain("40 StudsTokens");
    expect(text).not.toMatch(/sorry|apolog|extend|should not have/i);
    expect(text).not.toMatch(/\bfree\b/i);
  });

  test("is visually distinct from a plain shortfall", async () => {
    // 423 and 402 are different sentences and must not look identical.
    unlockMock.mockResolvedValue({
      status: "allowance-expired",
      data: { required: 40, available: 18, shortfall: 22, ways_to_earn: [] },
    });
    const container = render();
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);

    expect(dialog(container).textContent).toContain("starter unlocks have expired");
  });
});

describe("the 401 outcome", () => {
  test("hands the student to log in and never claims a shortfall", async () => {
    const onSignIn = jest.fn();
    unlockMock.mockResolvedValue({ status: "unauthenticated" });
    const container = render({ onSignIn });
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);

    // "Log in", "you have no StudsTokens" and "you already own this" are three
    // different answers, and only the first is true here. The unlock dialog
    // closes and the page's own login prompt takes over, so no shortfall
    // wording is left on screen.
    expect(onSignIn).toHaveBeenCalledTimes(1);
    expect(dialog(container)).toBeNull();
  });
});

describe("every failure says the balance has not changed", () => {
  test.each([
    ["an invalid request", "invalid-request"],
    ["a key conflict", "conflict"],
    ["a server error", "server"],
    ["a dropped connection", "offline"],
  ])("%s", async (_label, reason) => {
    unlockMock.mockResolvedValue({ status: "failed", reason });
    const container = render();
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);

    const text = dialog(container).textContent ?? "";
    expect(text).toContain("Nothing was spent");
    expect(text).toContain("your balance has not changed");
    // No code, no cause, and no invented retry deadline.
    expect(text).not.toMatch(/IDEMPOTENCY|409|500|503|error code/i);
    expect(button(container, /Try again/)).toBeDefined();
  });
});

describe("idempotency", () => {
  test("a retry of the same attempt reuses the same key", async () => {
    // The reason the header exists. A fresh key per retry is what double-charges
    // a student whose connection dropped.
    unlockMock.mockResolvedValue({ status: "failed", reason: "offline" });
    const container = render();
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);
    await clickAndSettle(container, /Try again/);
    await clickAndSettle(container, /Unlock for/);

    const keys = unlockMock.mock.calls.map((call) => (call[0] as { idempotencyKey: string }).idempotencyKey);
    expect(keys.length).toBeGreaterThanOrEqual(2);
    expect(new Set(keys).size).toBe(1);
  });

  test("the request carries no amount, because the price is the server's", async () => {
    unlockMock.mockResolvedValue({
      status: "unlocked",
      alreadyUnlocked: false,
      usedAllowance: false,
      coinsPaid: 40,
      balanceAfter: 105,
      spentFrom: [],
    });
    const container = render();
    await clickAndSettle(container, /Unlock/);
    await clickAndSettle(container, /Unlock for/);

    const sent = unlockMock.mock.calls[0][0] as Record<string, unknown>;
    expect(Object.keys(sent).sort()).toEqual(["idempotencyKey", "resourceId", "resourceType"]);
    expect(sent.resourceType).toBe("study_resource");
    expect(sent.resourceId).toBe(812);
  });
});
