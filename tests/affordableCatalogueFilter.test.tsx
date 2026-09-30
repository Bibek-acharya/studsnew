/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import StudyResourcesPage from "@/components/studyResources/StudyResourcesPage";
import { resolveResourceAccess } from "@/components/coins/useCoinState";
import {
  isAffordableParamOn,
  isGateOffForItems,
  matchesAffordableFilter,
} from "@/components/studyResources/affordableFilter";
import type { ResolveResourceAccessInput } from "@/components/coins/useCoinState";
import type { CoinBalance, ResourceAccess } from "@/services/coinsApi";
import type { StudyResource } from "@/services/studyResourcesApi";

/**
 * `?affordable=1` — the link every insufficient-funds screen ends on (06 §5).
 *
 * The filter has exactly one job and one way to get it wrong. It must INCLUDE
 * every resource whose access state is unknown, because the backend gate is off
 * by default and while it is off `access` is absent from every item: a filter
 * that read absent as unaffordable would render an empty catalogue for the one
 * student who just clicked "Browse resources you can unlock now", on the one
 * screen whose whole purpose is to stop them feeling walled in.
 *
 * So the first half of this file walks the state matrix one state at a time,
 * through the REAL `resolveResourceAccess`, and asserts which one is excluded.
 * The second half renders the page and proves the same thing end to end, that
 * the filter costs no request, and that the URL is the only thing holding its
 * state.
 */

// ── the page harness ───────────────────────────────────────────────────────────

/** The current query string, standing in for the address bar. */
let mockQuery = "";
const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: mockReplace }),
  usePathname: () => "/study-resources/study-notes",
  useSearchParams: () => new URLSearchParams(mockQuery),
}));

// The combobox reaches the network for its option list, which is not what this
// suite is about.
jest.mock("@/components/studyResources/CourseCombobox", () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    inputClassName,
  }: {
    value: string;
    onChange: (value: string) => void;
    inputClassName?: string;
  }) => (
    <input
      data-testid="course-combobox"
      aria-label="Course"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClassName}
    />
  ),
}));

// A stable object: `useAuth`'s result is an effect dependency on the page, and a
// fresh literal every render would re-run the wallet read forever.
let mockUser: { id: number } | null = { id: 7 };

jest.mock("@/services/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

/** Null is the interesting value: the wallet read failed. */
let mockBalance: CoinBalance | null = {
  total_available: 100,
  total_reserved: 0,
  buckets: [],
  spend_order: [{ bucket: "EARNED", coins: 100, expires_at: null }],
  allowance: null,
};

jest.mock("@/services/coinsApi", () => ({
  ...jest.requireActual("@/services/coinsApi"),
  coinsApi: { getBalance: () => Promise.resolve(mockBalance) },
}));

let mockItems: StudyResource[] = [];
let mockTotal = 0;

const listStudyResources = jest.fn<Promise<unknown>, [params?: unknown]>(() =>
  Promise.resolve({
    data: { study_resources: mockItems, total: mockTotal, years: ["2081"] },
  }),
);

jest.mock("@/services/studyResourcesApi", () => ({
  studyResourcesApi: { listStudyResources: (p?: unknown) => listStudyResources(p) },
  isVideoStudyResourceType: () => false,
  getStudyResourceStreamUrl: (id: number) => `/stream/${id}`,
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const containers: HTMLElement[] = [];
const roots: Root[] = [];

/** Drains the microtask chain the effects leave behind, including the wallet. */
async function flush(): Promise<void> {
  await act(async () => {
    for (let turn = 0; turn < 10; turn += 1) await Promise.resolve();
  });
}

async function render(query = ""): Promise<HTMLElement> {
  mockQuery = query;
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  const root = createRoot(container);
  roots.push(root);
  await act(async () => {
    root.render(<StudyResourcesPage lockedType={"study-notes" as never} />);
  });
  await flush();
  return container;
}

/** Unmounts everything, which is what a reload looks like from here. */
function teardown(): void {
  while (roots.length) act(() => roots.pop()!.unmount());
  while (containers.length) containers.pop()!.remove();
}

function cardTitles(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("article h3")).map(
    (h) => h.textContent ?? "",
  );
}

function tallyText(container: HTMLElement): string {
  return container.querySelector("[aria-live='polite']")?.textContent ?? "";
}

function checkbox(container: HTMLElement): HTMLInputElement | null {
  return container.querySelector('aside input[type="checkbox"]');
}

async function pressCheckbox(container: HTMLElement): Promise<void> {
  const input = checkbox(container)!;
  await act(async () => {
    input.click();
  });
}

function buttonWithText(container: HTMLElement, text: string) {
  const found = Array.from(container.querySelectorAll("button")).find(
    (b) => b.textContent?.trim() === text,
  );
  if (!found) throw new Error(`button "${text}" not found`);
  return found;
}

// ── fixtures ───────────────────────────────────────────────────────────────────

const WALLET_100: CoinBalance = {
  total_available: 100,
  total_reserved: 0,
  buckets: [],
  spend_order: [{ bucket: "EARNED", coins: 100, expires_at: null }],
  allowance: null,
};

const resolve = (over: Partial<ResolveResourceAccessInput> = {}) =>
  resolveResourceAccess({ balance: WALLET_100, signedIn: true, ...over });

/** A gated item: the server priced it and says whether it is already yours. */
const gated = (price: number, unlocked = false): ResourceAccess => ({
  price,
  unlocked,
});

function item(
  id: number,
  title: string,
  access?: ResourceAccess | null,
): StudyResource {
  return {
    id,
    title,
    description: "Chapter notes",
    resource_type: "study-notes",
    course: "BSc CSIT",
    year: "2081",
    file_name: "notes.pdf",
    file_url: "/uploads/notes.pdf",
    file_size: 4096,
    mime_type: "application/pdf",
    downloads: 3,
    created_at: "2026-09-01T00:00:00Z",
    ...(access === undefined ? {} : { access }),
  } as StudyResource;
}

beforeEach(() => {
  mockQuery = "";
  mockItems = [];
  mockTotal = 0;
  mockBalance = WALLET_100;
  mockUser = { id: 7 };
  mockReplace.mockReset();
  listStudyResources.mockClear();
});

afterEach(teardown);

// ── one test per state, through the real matrix ────────────────────────────────

describe("the affordable filter decides per resolved state", () => {
  test("absent access — the gate is off — is kept, and is never called unaffordable", () => {
    // THE load-bearing case. With the gate off the list endpoint sends no
    // `access` on any item, so `resolveResourceAccess` returns null. Reading
    // that as "unaffordable" would empty the catalogue for every visitor.
    const access = resolve({ access: null });
    expect(access).toBeNull();
    expect(matchesAffordableFilter(access)).toBe(true);
  });

  test("`price-unknown` is kept, because unknown is not unaffordable", () => {
    // The price could not be determined. Hiding it would say "you cannot have
    // this", which nothing established.
    const access = resolve({ access: { price: Number.NaN, unlocked: false } });
    expect(access?.state).toBe("price-unknown");
    expect(matchesAffordableFilter(access)).toBe(true);
  });

  test("an unreadable wallet is `price-unknown`, and is kept", () => {
    // The specific failure the filter must survive: a failed balance read is
    // not a zero balance, so the catalogue stays whole.
    const access = resolve({ access: gated(40), balance: null });
    expect(access?.state).toBe("price-unknown");
    expect(matchesAffordableFilter(access)).toBe(true);
  });

  test("`unlocked` is kept, because the student can already use it", () => {
    // Hiding the one card whose action is guaranteed to work would be a second
    // dead end.
    const access = resolve({ access: gated(40, true) });
    expect(access?.state).toBe("unlocked");
    expect(matchesAffordableFilter(access)).toBe(true);
  });

  test("`affordable` is kept", () => {
    const access = resolve({ access: gated(40) });
    expect(access?.state).toBe("affordable");
    expect(matchesAffordableFilter(access)).toBe(true);
  });

  test("`starter-eligible` is kept, because a starter unlock is enough", () => {
    const access = resolve({
      access: {
        price: 40,
        unlocked: false,
        allowance: { left: 1, total: 3, expires_at: null },
      },
      balance: { ...WALLET_100, total_available: 0 },
    });
    expect(access?.state).toBe("starter-eligible");
    expect(matchesAffordableFilter(access)).toBe(true);
  });

  test("`anonymous` is kept, because a signed-out visitor has no wallet to judge", () => {
    const access = resolve({ access: gated(40), signedIn: false, balance: null });
    expect(access?.state).toBe("anonymous");
    expect(matchesAffordableFilter(access)).toBe(true);
  });

  test("`unlocking` is kept, because an unlock already in flight is not a refusal", () => {
    const access = resolve({ access: gated(40), busy: true });
    expect(access?.state).toBe("unlocking");
    expect(matchesAffordableFilter(access)).toBe(true);
  });

  test("`insufficient` is the ONLY state excluded", () => {
    // A known price the known balance does not cover. This is the whole filter.
    const access = resolve({ access: gated(500) });
    expect(access?.state).toBe("insufficient");
    expect(matchesAffordableFilter(access)).toBe(false);
  });

  test("a draft resolves to null and is kept, exactly like an ungated item", () => {
    // A draft is not a student-facing state at all; the card renders nothing, so
    // the filter has no opinion about it.
    const access = resolve({ access: gated(500), isPublished: false });
    expect(access).toBeNull();
    expect(matchesAffordableFilter(access)).toBe(true);
  });
});

// ── the empty-catalogue bug this filter could ship ─────────────────────────────

describe("the gate being off cannot empty the catalogue", () => {
  const ungated = () => [item(1, "One"), item(2, "Two"), item(3, "Three")];

  test("every item with no `access` survives, and the counts are identical", async () => {
    mockItems = ungated();
    mockTotal = 3;

    const unfiltered = await render();
    const filtered = await render("affordable=1");

    // Same cards, same tally. This is the assertion that fails if absent access
    // is ever read as unaffordable.
    expect(cardTitles(filtered)).toEqual(cardTitles(unfiltered));
    expect(cardTitles(filtered)).toHaveLength(3);
    expect(tallyText(filtered)).toBe(tallyText(unfiltered));
    expect(tallyText(filtered)).toContain("of 3");
  });

  test("the gate-off signal is only claimed for a loaded page with items", () => {
    expect(isGateOffForItems(ungated())).toBe(true);
    // An empty, loading or failed page says nothing, so the control stays.
    expect(isGateOffForItems([])).toBe(false);
    expect(isGateOffForItems([item(1, "One", gated(40))])).toBe(false);
  });

  test("an ungated catalogue never reaches the filtered no-results state", async () => {
    mockItems = ungated();
    mockTotal = 3;
    const container = await render("affordable=1");

    expect(container.textContent).not.toContain("Nothing You Can Unlock Here Yet");
    expect(container.textContent).not.toContain("No Resources Found");
  });
});

// ── the filter on a gated catalogue ────────────────────────────────────────────

describe("?affordable=1 on a gated catalogue", () => {
  const gatedCatalogue = () => [
    item(1, "Forty tokens", gated(40)),
    item(2, "Five hundred tokens", gated(500)),
    item(3, "Already yours", gated(40, true)),
  ];

  test("drops the unaffordable card and keeps the rest, in the server's order", async () => {
    mockItems = gatedCatalogue();
    mockTotal = 3;

    const unfiltered = await render();
    expect(cardTitles(unfiltered)).toEqual([
      "Forty tokens",
      "Five hundred tokens",
      "Already yours",
    ]);

    const filtered = await render("affordable=1");
    // Order is preserved: the filter narrows, it never re-sorts.
    expect(cardTitles(filtered)).toEqual(["Forty tokens", "Already yours"]);
    expect(filtered.textContent).not.toContain("Five hundred tokens");
    expect(tallyText(filtered)).toContain("Showing 1-2 of 2");
  });

  test("costs no request: the same two loads, the same two list calls", async () => {
    mockItems = gatedCatalogue();
    mockTotal = 3;

    await render();
    expect(listStudyResources).toHaveBeenCalledTimes(1);
    await render("affordable=1");
    // The filter narrows the page already fetched. A second call here would mean
    // a new server round trip, which is out of bounds.
    expect(listStudyResources).toHaveBeenCalledTimes(2);
  });

  test("keeps an item whose price could not be determined", async () => {
    mockItems = [item(1, "Priced", gated(40)), item(2, "Price unreadable", null)];
    mockTotal = 2;
    // `access: null` is not the same as "no access key at all" to the server's
    // shape, so give one item a key whose price cannot be read.
    mockItems[1].access = {
      price: Number.NaN,
      unlocked: false,
    };

    const container = await render("affordable=1");
    expect(cardTitles(container)).toEqual(["Priced", "Price unreadable"]);
  });

  test("an unreadable wallet narrows nothing", async () => {
    mockBalance = null;
    mockItems = gatedCatalogue();
    mockTotal = 3;

    const container = await render("affordable=1");
    // Every card resolves to price-unknown, so every card stays.
    expect(cardTitles(container)).toEqual([
      "Forty tokens",
      "Five hundred tokens",
      "Already yours",
    ]);
  });

  test("?affordable=0 is off, so there is exactly one spelling of on", () => {
    expect(isAffordableParamOn("1")).toBe(true);
    expect(isAffordableParamOn("0")).toBe(false);
    expect(isAffordableParamOn("")).toBe(false);
    expect(isAffordableParamOn(null)).toBe(false);
  });
});

// ── the toggle ─────────────────────────────────────────────────────────────────

describe("the Can unlock now toggle", () => {
  const gatedCatalogue = () => [
    item(1, "Forty tokens", gated(40)),
    item(2, "Five hundred tokens", gated(500)),
  ];

  test("is offered when the gate is on and the cards carry access", async () => {
    mockItems = gatedCatalogue();
    mockTotal = 2;
    const container = await render();

    const input = checkbox(container);
    expect(input).not.toBeNull();
    expect(container.querySelector("aside")?.textContent).toContain(
      "Can unlock now",
    );
    expect(input?.className).toContain("custom-checkbox");
  });

  test("hides itself while the gate is off, the way the panel hides a dead control", async () => {
    // There is no resource-type selector in this panel either, for the same
    // reason: a control that provably narrows nothing is not a control.
    mockItems = [item(1, "One"), item(2, "Two")];
    mockTotal = 2;
    const container = await render("affordable=1");

    expect(checkbox(container)).toBeNull();
    expect(container.querySelector("aside")?.textContent).not.toContain(
      "Can unlock now",
    );
  });

  test("is not offered before the first response, so it cannot appear and vanish", async () => {
    // `isGateOffForItems([])` answers false on purpose — an empty page says
    // nothing about the gate — which is right for a collection a course or year
    // filter emptied and wrong for the seconds before any answer exists. Drawn
    // on that second, the control appeared on the first paint of every ungated
    // catalogue and took itself back when the items landed.
    const container = document.createElement("div");
    document.body.appendChild(container);
    containers.push(container);
    const root = createRoot(container);
    roots.push(root);
    mockQuery = "affordable=1";

    let release: ((value: unknown) => void) | undefined;
    listStudyResources.mockImplementationOnce(
      () => new Promise((resolve) => (release = resolve)),
    );

    await act(async () => {
      root.render(<StudyResourcesPage lockedType={"study-notes" as never} />);
    });
    // In flight: no response, so no answer, so no control.
    expect(checkbox(container)).toBeNull();

    // Gated items land and it arrives with them.
    mockItems = [item(1, "Forty tokens", gated(40))];
    mockTotal = 1;
    await act(async () => {
      release?.({
        data: { study_resources: mockItems, total: 1, years: ["2081"] },
      });
      await Promise.resolve();
    });
    await flush();
    expect(checkbox(container)).not.toBeNull();
  });

  test("a signed-out viewer keeps the toggle, and is told why nothing left the page", async () => {
    // Hiding a filter because of who you are is the walled-in feeling this
    // feature exists to remove. So the control stays, and the one sentence that
    // keeps a checked box from reading as a promise the page is not keeping is
    // drawn under it.
    mockUser = null;
    mockBalance = null;
    mockItems = [item(1, "One", gated(40)), item(2, "Two", gated(40))];
    mockTotal = 2;
    const container = await render("affordable=1");

    const input = checkbox(container);
    expect(input).not.toBeNull();
    expect(input?.checked).toBe(true);
    expect(container.querySelector("aside")?.textContent).toContain(
      "Sign in and this checks your balance",
    );
    // No wallet, no known shortfall, so nothing is excluded.
    expect(cardTitles(container)).toEqual(["One", "Two"]);
  });

  test("a signed-in viewer is not told about signing in", async () => {
    mockItems = [item(1, "One", gated(40)), item(2, "Two", gated(40))];
    mockTotal = 2;
    const container = await render("affordable=1");

    expect(checkbox(container)).not.toBeNull();
    expect(container.querySelector("aside")?.textContent).not.toContain(
      "Sign in and this checks your balance",
    );
  });

  test("pressing it writes ?affordable=1", async () => {
    mockItems = gatedCatalogue();
    mockTotal = 2;
    const container = await render();

    await pressCheckbox(container);
    expect(mockReplace).toHaveBeenLastCalledWith(
      "/study-resources/study-notes?affordable=1",
    );
  });

  test("pressing it again clears the parameter rather than setting it to zero", async () => {
    // Clearable from the page, and the parameter is REMOVED rather than set to
    // some off-value, so the URL returns to the one the student arrived on.
    mockItems = gatedCatalogue();
    mockTotal = 2;
    const container = await render("affordable=1");
    expect(checkbox(container)?.checked).toBe(true);

    await pressCheckbox(container);
    expect(mockReplace).toHaveBeenLastCalledWith("/study-resources/study-notes");
  });

  test("the URL is the state: a link in survives a reload, a link out does not", async () => {
    mockItems = gatedCatalogue();
    mockTotal = 2;

    const linked = await render("affordable=1");
    expect(checkbox(linked)?.checked).toBe(true);
    expect(cardTitles(linked)).toEqual(["Forty tokens"]);

    // A reload: unmount, then mount again from the bare URL.
    teardown();
    const bare = await render();
    expect(checkbox(bare)?.checked).toBe(false);
    expect(cardTitles(bare)).toEqual(["Forty tokens", "Five hundred tokens"]);
  });

  test("Reset drops the parameter along with the course and year filters", async () => {
    mockItems = gatedCatalogue();
    mockTotal = 2;
    const container = await render("affordable=1");

    await act(async () => {
      buttonWithText(container, "Reset").dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });
    expect(mockReplace).toHaveBeenLastCalledWith("/study-resources/study-notes");
  });

  test("turning the filter on does not re-request the page", async () => {
    mockItems = gatedCatalogue();
    mockTotal = 2;
    const container = await render();
    listStudyResources.mockClear();

    await pressCheckbox(container);
    expect(listStudyResources).not.toHaveBeenCalled();
  });
});

// ── composition with the existing filters ──────────────────────────────────────

describe("?affordable=1 combines with the existing filters", () => {
  test("search still refines the request while the filter is on", async () => {
    mockItems = [item(1, "Forty tokens", gated(40)), item(2, "Five hundred tokens", gated(500))];
    mockTotal = 2;
    const container = await render("affordable=1");

    const search = container.querySelector<HTMLInputElement>(
      'input[aria-label="Search study resources"]',
    )!;
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(search, "calculus");
      search.dispatchEvent(new Event("input", { bubbles: true }));
      await Promise.resolve();
    });

    // The debounce is real timers here, so wait it out.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });
    await flush();

    expect(listStudyResources).toHaveBeenLastCalledWith(
      expect.objectContaining({ q: "calculus", type: "study-notes" }),
    );
  });

  test("course and year still reach the request while the filter is on", async () => {
    mockItems = [item(1, "Forty tokens", gated(40)), item(2, "Five hundred tokens", gated(500))];
    mockTotal = 2;
    const container = await render("affordable=1");

    const year = container.querySelector<HTMLSelectElement>(
      'select[aria-label="Filter by year"]',
    )!;
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLSelectElement.prototype,
        "value",
      )!.set!;
      setter.call(year, "2081");
      year.dispatchEvent(new Event("change", { bubbles: true }));
      await Promise.resolve();
    });
    expect(listStudyResources).toHaveBeenLastCalledWith(
      expect.objectContaining({ year: "2081" }),
    );
    // And the affordable param was not smuggled into the request: it is not a
    // server filter.
    expect(mockQuery).toBe("affordable=1");
  });

  test("pagination survives the filter", async () => {
    mockItems = [item(1, "Forty tokens", gated(40)), item(2, "Five hundred tokens", gated(500))];
    mockTotal = 45;
    const container = await render("affordable=1");

    // Twenty per page, so 45 results is three pages, and only one of them is
    // affordable on this page.
    const pageTwo = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim() === "2",
    );
    expect(pageTwo).toBeDefined();
  });
});

// ── the tally, which cannot count what it has not fetched ──────────────────────

describe("the tally says only what the page knows", () => {
  test("one page, filtered: the visible count IS the collection, so the ordinary range is used", async () => {
    mockItems = [item(1, "Forty tokens", gated(40)), item(2, "Five hundred tokens", gated(500))];
    mockTotal = 2;
    const container = await render("affordable=1");

    // Nothing was hidden from this page — one page held the whole collection —
    // so "Showing 1-1 of 1" is exactly true and the page says it.
    expect(tallyText(container)).toContain("Showing 1-1 of 1");
    expect(tallyText(container)).not.toContain("you can unlock now");
  });

  test("several pages, filtered: no range, because the visible cards are not positions 1-n of the total", async () => {
    mockItems = [item(1, "Forty tokens", gated(40)), item(2, "Five hundred tokens", gated(500))];
    mockTotal = 45;
    const container = await render("affordable=1");

    // The old sentence was "Showing 1-1 of 45": a range and a total that are both
    // false, since the one visible card is the only one this page could check
    // and 45 is the size of the collection being paged. The count is now the
    // page's own and the total is labelled as the collection's.
    expect(tallyText(container)).toContain("1 Resource you can unlock now");
    expect(tallyText(container)).toContain("45 in this collection");
    expect(tallyText(container)).not.toContain("Showing 1-1");
    expect(tallyText(container)).not.toContain("of 45");
  });

  test("several pages, filtered: the plural is not a bare " + "'s'", async () => {
    mockItems = [
      item(1, "Forty tokens", gated(40)),
      item(2, "Fifty tokens", gated(50)),
      item(3, "Five hundred tokens", gated(500)),
    ];
    mockTotal = 45;
    const container = await render("affordable=1");

    expect(tallyText(container)).toContain("2 Resources you can unlock now");
  });

  test("unfiltered, the tally is untouched whatever the page holds", async () => {
    mockItems = [item(1, "One", gated(40)), item(2, "Two", gated(40))];
    mockTotal = 45;
    const container = await render();

    // No filter, no new sentence: the server's own range and total, as always.
    expect(tallyText(container)).toContain("Showing 1-2 of 45");
    expect(tallyText(container)).not.toContain("you can unlock now");
  });

  test("with the gate off, the filtered tally is identical to the unfiltered one", async () => {
    // The default state of the product. Nothing about the tally may differ from
    // a page that never had the parameter.
    mockItems = [item(1, "One"), item(2, "Two")];
    mockTotal = 2;

    const unfiltered = await render();
    const filtered = await render("affordable=1");

    expect(tallyText(filtered)).toBe(tallyText(unfiltered));
    expect(tallyText(filtered)).toBe("Showing 1-2 of 2 Resources");
  });
});

// ── the filtered no-results state ──────────────────────────────────────────────

describe("when the filter empties the page", () => {
  beforeEach(() => {
    mockItems = [
      item(1, "Five hundred tokens", gated(500)),
      item(2, "Six hundred tokens", gated(600)),
    ];
    mockTotal = 2;
  });

  test("says what happened instead of the generic empty state", async () => {
    const container = await render("affordable=1");

    expect(container.textContent).toContain("Nothing You Can Unlock Here Yet");
    expect(container.textContent).toContain(
      "Nothing here is covered by your StudsTokens right now.",
    );
    // The generic empty state is the SERVER's, and keeps its own copy.
    expect(container.textContent).not.toContain("No Resources Found");
  });

  test("never says a resource is free", async () => {
    const container = await render("affordable=1");
    expect((container.textContent ?? "").toLowerCase()).not.toContain("free");
  });

  test("does not claim the collection is empty", async () => {
    // The temptation here is to tally "of 0 Resources", which is false: the
    // collection holds two resources and neither is reachable. The range is
    // empty; the total is the collection's.
    const container = await render("affordable=1");

    expect(tallyText(container)).toContain("Showing 0-0 of 2");
    expect(tallyText(container)).not.toContain("of 0 Resources");
  });

  test("offers a way back to the whole catalogue", async () => {
    const container = await render("affordable=1");
    const back = buttonWithText(container, "Show all resources");
    expect(back.className).toContain("bg-brand-blue");

    await act(async () => {
      back.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(mockReplace).toHaveBeenLastCalledWith("/study-resources/study-notes");
  });

  test("an empty collection keeps the existing empty state, not this one", async () => {
    // Nothing here is the server saying there is nothing, which is a different
    // sentence and keeps the copy it always had.
    mockItems = [];
    mockTotal = 0;
    const container = await render("affordable=1");

    expect(container.textContent).toContain("No Resources Found");
    expect(container.textContent).toContain("Try changing your search or filters.");
    expect(container.textContent).not.toContain("Nothing You Can Unlock Here Yet");
  });
});