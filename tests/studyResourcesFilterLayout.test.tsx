/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import StudyResourcesPage from "@/components/studyResources/StudyResourcesPage";
import type { StudyResource } from "@/services/studyResourcesApi";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// The course combobox reaches the network for its option list, which is not
// what this suite is about; the search/year filters are.
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

jest.mock("@/services/AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));

// The year filter is populated from the list response, so the stub returns a
// couple of years for it to aggregate.
interface StubOptions {
  items?: StudyResource[];
  total?: number;
  failWith?: string;
}

let stub: StubOptions = {};

/** The standing stub, re-established before every test so a test that swaps in
 *  its own implementation cannot leak into the next one. Arguments are recorded
 *  by the jest.fn wrapper, so the implementation itself ignores them. */
function stubListStudyResources() {
  if (stub.failWith) throw new Error(stub.failWith);
  return Promise.resolve({
    data: {
      study_resources: stub.items ?? [],
      total: stub.total ?? 0,
      years: ["2080", "2081"],
    },
  });
}

type ListStudyResourcesArgs = [
  params?: unknown,
  options?: { signal?: AbortSignal },
];

const listStudyResources = jest.fn<
  Promise<unknown>,
  ListStudyResourcesArgs
>(stubListStudyResources);

jest.mock("@/services/studyResourcesApi", () => ({
  studyResourcesApi: {
    listStudyResources: (params?: unknown, options?: { signal?: AbortSignal }) =>
      listStudyResources(params, options),
  },
  isVideoStudyResourceType: () => false,
  getStudyResourceStreamUrl: (id: number) => `/stream/${id}`,
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const DEBOUNCE_MS = 350;

const containers: HTMLElement[] = [];
const roots: Root[] = [];

/** Lets the debounce elapse and the fetch it starts settle. A second round
 *  covers the case where clearing a field re-arms the debounce. */
async function settle(): Promise<void> {
  for (let round = 0; round < 3; round += 1) {
    jest.advanceTimersByTime(DEBOUNCE_MS);
    await act(async () => {
      for (let turn = 0; turn < 6; turn += 1) await Promise.resolve();
    });
  }
}

/** Drains the microtask chain an effect's await chain leaves behind. */
async function flush(): Promise<void> {
  await act(async () => {
    for (let turn = 0; turn < 6; turn += 1) await Promise.resolve();
  });
}

async function render(lockedType?: string): Promise<HTMLElement> {
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  const root = createRoot(container);
  roots.push(root);
  await act(async () => {
    root.render(
      <StudyResourcesPage
        {...(lockedType ? { lockedType: lockedType as never } : {})}
      />,
    );
  });
  // The first load resolves over several microtask turns.
  await flush();
  return container;
}

function clickByText(container: HTMLElement, text: string): void {
  const button = Array.from(container.querySelectorAll("button")).find(
    (b) => b.textContent?.trim() === text,
  );
  if (!button) throw new Error(`button "${text}" not found`);
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

async function type(
  container: HTMLElement,
  selector: string,
  value: string,
): Promise<void> {
  const input = container.querySelector(selector)!;
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )!.set!;
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

async function selectYear(container: HTMLElement, value: string): Promise<void> {
  const year = container.querySelector<HTMLSelectElement>(
    'select[aria-label="Filter by year"]',
  )!;
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLSelectElement.prototype,
      "value",
    )!.set!;
    setter.call(year, value);
    year.dispatchEvent(new Event("change", { bubbles: true }));
    await Promise.resolve();
  });
}

beforeEach(() => {
  stub = {};
  listStudyResources.mockReset();
  listStudyResources.mockImplementation(stubListStudyResources);
});

afterEach(() => {
  while (roots.length) act(() => roots.pop()!.unmount());
  while (containers.length) containers.pop()!.remove();
  jest.useRealTimers();
});

describe("StudyResourcesPage layout contract", () => {
  test("a page header titles the page in the Find College style", async () => {
    const container = await render();

    const heading = container.querySelector("h1, h2");
    expect(heading?.textContent).toBe("Past Questions & Resources");
    expect(heading?.className).toContain("text-3xl");
    expect(heading?.className).toContain("font-bold");
    expect(heading?.className).toContain("text-gray-900");
  });

  test("a result tally sits beside the search row", async () => {
    stub = {
      items: [
        { id: 1, title: "One" },
        { id: 2, title: "Two" },
      ] as StudyResource[],
      total: 57,
    };
    const container = await render();

    const tally = container.querySelector("[aria-live='polite']");
    expect(tally?.textContent).toContain("Showing 1-2 of 57");
    expect(tally?.textContent).toContain("Resources");
  });

  test("an empty page tallies 0-0 rather than a backwards range", async () => {
    stub = { items: [], total: 0 };
    const container = await render();

    expect(container.querySelector("[aria-live='polite']")?.textContent).toContain(
      "Showing 0-0 of 0",
    );
  });

  test("filters sit in a left sidebar beside the results, not a toolbar", async () => {
    const container = await render();

    const aside = container.querySelector("aside");
    expect(aside).not.toBeNull();
    // Hidden below lg, fixed 75-wide column from lg up — the Find College shape.
    expect(aside?.className).toContain("hidden");
    expect(aside?.className).toContain("lg:block");
    expect(aside?.className).toContain("lg:w-75");

    const layout = aside?.parentElement;
    expect(layout?.className).toContain("lg:flex-row");
    expect(layout?.className).toContain("lg:flex-nowrap");

    const main = container.querySelector("main");
    expect(main?.className).toContain("min-w-0");
    expect(main?.className).toContain("flex-1");
    expect(main?.parentElement).toBe(layout);

    // The old horizontal toolbar is gone.
    expect(container.textContent).not.toContain("Browse resources");
  });

  test("below lg the sidebar is replaced by a drawer behind a Filters button", async () => {
    const container = await render();

    const trigger = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim() === "Filters",
    );
    expect(trigger).toBeDefined();
    expect(trigger?.className).toContain("lg:hidden");

    expect(container.querySelector('[aria-label="Close filters"]')).toBeNull();

    act(() => {
      trigger!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // Viewport-fixed, height-capped and scrollable, so the form can never
    // overflow the screen.
    const drawer = container
      .querySelector('[aria-label="Close filters"]')
      ?.closest("div.fixed");
    expect(drawer?.className).toContain("inset-0");
    expect(drawer?.className).toContain("lg:hidden");
    const sheet = drawer?.querySelector("div.absolute.bottom-0");
    expect(sheet?.className).toContain("max-h-[70vh]");
    expect(sheet?.className).toContain("overflow-y-auto");
    expect(sheet?.querySelector('[aria-label="Filter by year"]')).not.toBeNull();

    act(() => {
      container
        .querySelector('[aria-label="Close filters"]')!
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(container.querySelector('[aria-label="Close filters"]')).toBeNull();
  });

  test("course and year filters are still there and still reach the API", async () => {
    const container = await render();
    const aside = container.querySelector("aside")!;

    expect(aside.querySelector('[data-testid="course-combobox"]')).not.toBeNull();
    const year = aside.querySelector<HTMLSelectElement>(
      'select[aria-label="Filter by year"]',
    )!;
    expect(Array.from(year.options).map((o) => o.value)).toEqual([
      "",
      "2081",
      "2080",
    ]);

    await selectYear(container, "2080");
    expect(listStudyResources).toHaveBeenLastCalledWith(
      expect.objectContaining({ year: "2080" }),
      expect.anything(),
    );

    await act(async () => {
      const course = aside.querySelector<HTMLInputElement>(
        '[data-testid="course-combobox"]',
      )!;
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(course, "BSc CSIT");
      course.dispatchEvent(new Event("input", { bubbles: true }));
      await Promise.resolve();
    });
    expect(listStudyResources).toHaveBeenLastCalledWith(
      expect.objectContaining({ course: "BSc CSIT" }),
      expect.anything(),
    );
  });
});

describe("StudyResourcesPage has no resource-type control", () => {
  test("neither the unfiltered catalog nor a locked page offers a type filter", async () => {
    const catalog = await render();
    const locked = await render("study-notes");

    [catalog, locked].forEach((container) => {
      const aside = container.querySelector("aside")!;
      // No select, no lock marker, and no type wording anywhere in the panel.
      expect(
        aside.querySelector('select[aria-label="Filter by resource type"]'),
      ).toBeNull();
      expect(aside.querySelector('[aria-label^="Resource type"]')).toBeNull();
      expect(aside.textContent).not.toContain("Resource type");
      expect(aside.textContent).not.toContain("Fixed by this page");

      // Nor is there a whole section for it: the panel is Reset plus exactly
      // the two filters that can narrow a collection.
      const panelControls = Array.from(
        aside.querySelectorAll<HTMLButtonElement>("button"),
      ).map((b) => b.textContent?.trim());
      expect(panelControls).toEqual(["Reset", "Course", "Year"]);
    });
  });

  test("a locked page keeps its title and back link, and still pins the request", async () => {
    const container = await render("study-notes");

    expect(container.querySelector("h1")?.textContent).toBe("Study Notes");
    expect(container.textContent).toContain("All study resources");

    await selectYear(container, "2080");
    // The route lock still narrows the request even with no type UI on screen.
    expect(listStudyResources).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: "study-notes", year: "2080" }),
      expect.anything(),
    );
  });
});

describe("StudyResourcesPage autonomous search", () => {
  // Only this group needs the clock under its own control, to prove the debounce
  // holds a request back. Fake timers elsewhere would also hold back React's own
  // post-await flush, so they stay scoped to here.
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test("typing refines the results on a debounce, with no Search button", async () => {
    const container = await render();
    const searchSelector = 'input[aria-label="Search study resources"]';

    // Nothing to press: the previous submit control is gone.
    expect(
      Array.from(container.querySelectorAll("button")).some(
        (b) => b.textContent?.trim() === "Search",
      ),
    ).toBe(false);

    listStudyResources.mockClear();
    await type(container, searchSelector, "calculus");

    // A burst of keystrokes costs no request while the debounce is open.
    jest.advanceTimersByTime(DEBOUNCE_MS - 50);
    expect(listStudyResources).not.toHaveBeenCalled();

    await settle();
    expect(listStudyResources).toHaveBeenCalledTimes(1);
    expect(listStudyResources).toHaveBeenLastCalledWith(
      expect.objectContaining({ q: "calculus" }),
      expect.anything(),
    );
  });

  test("each settled query supersedes the last, never stacking requests", async () => {
    const container = await render();
    const searchSelector = 'input[aria-label="Search study resources"]';

    listStudyResources.mockClear();
    await type(container, searchSelector, "cal");
    jest.advanceTimersByTime(DEBOUNCE_MS - 50);
    // Rewriting the query inside the window restarts the timer.
    await type(container, searchSelector, "calculus");
    jest.advanceTimersByTime(DEBOUNCE_MS - 50);
    expect(listStudyResources).not.toHaveBeenCalled();

    await settle();
    expect(listStudyResources).toHaveBeenCalledTimes(1);
    expect(listStudyResources).toHaveBeenLastCalledWith(
      expect.objectContaining({ q: "calculus" }),
      expect.anything(),
    );
  });

  test("requests carry an abort signal and the previous one is aborted", async () => {
    const container = await render();
    const searchSelector = 'input[aria-label="Search study resources"]';

    await type(container, searchSelector, "calculus");
    await settle();
    const firstSignal = listStudyResources.mock.calls.at(-1)?.[1]?.signal;
    expect(firstSignal).toBeInstanceOf(AbortSignal);
    expect(firstSignal?.aborted).toBe(false);

    await type(container, searchSelector, "derivative");
    await settle();

    // The superseded request is cancelled, so a late reply cannot land.
    expect(firstSignal?.aborted).toBe(true);
    expect(listStudyResources).toHaveBeenLastCalledWith(
      expect.objectContaining({ q: "derivative" }),
      expect.anything(),
    );
  });

  test("a late reply from a superseded request is ignored", async () => {
    const container = await render();
    const searchSelector = 'input[aria-label="Search study resources"]';

    // Resolve the newest request first, then the oldest, out of order.
    const resolvers: Array<(value: unknown) => void> = [];
    listStudyResources.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvers.push(resolve);
        }),
    );

    await type(container, searchSelector, "cal");
    await settle();
    await type(container, searchSelector, "calculus");
    await settle();

    const stale = { data: { study_resources: [{ id: 1, title: "Stale" }], total: 1 } };
    const fresh = {
      data: {
        study_resources: [{ id: 2, title: "Fresh result" }],
        total: 1,
        years: [],
      },
    };
    // Newest first, then the superseded one.
    await act(async () => {
      resolvers[1]?.(fresh);
      resolvers[0]?.(stale);
      await Promise.resolve();
    });

    expect(container.textContent).toContain("Fresh result");
    expect(container.textContent).not.toContain("Stale");
  });

  test("clearing the box back to empty also refines the results", async () => {
    const container = await render();
    const searchSelector = 'input[aria-label="Search study resources"]';

    await type(container, searchSelector, "calculus");
    await settle();
    await type(container, searchSelector, "");
    await settle();

    expect(listStudyResources).toHaveBeenLastCalledWith(
      expect.objectContaining({ q: undefined }),
      expect.anything(),
    );
  });

  test("reset clears the search box as well as the filters", async () => {
    const container = await render();
    const searchSelector = 'input[aria-label="Search study resources"]';

    await type(container, searchSelector, "calculus");
    await settle();
    await selectYear(container, "2080");

    clickByText(container, "Reset");
    await settle();

    expect(
      container.querySelector<HTMLInputElement>(searchSelector)?.value,
    ).toBe("");
    expect(listStudyResources).toHaveBeenLastCalledWith(
      {
        q: undefined,
        type: undefined,
        course: undefined,
        year: undefined,
        page: 1,
        limit: 20,
      },
      expect.anything(),
    );
  });
});

describe("StudyResourcesPage result states", () => {
  test("a cold load shows skeleton cards, and a refetch does not", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    containers.push(container);
    const root = createRoot(container);
    roots.push(root);

    let release: ((value: unknown) => void) | undefined;
    listStudyResources.mockImplementation(
      () => new Promise((resolve) => (release = resolve)),
    );

    await act(async () => {
      root.render(<StudyResourcesPage />);
    });
    expect(container.querySelectorAll('[data-testid="resource-skeleton"]'))
      .toHaveLength(6);

    stub = { items: [{ id: 3, title: "A resource" } as StudyResource], total: 1 };
    await act(async () => {
      release?.(stub);
      await Promise.resolve();
    });
    expect(
      container.querySelectorAll('[data-testid="resource-skeleton"]'),
    ).toHaveLength(0);
  });

  test("an empty result set reads like Find College's empty state", async () => {
    const container = await render();

    expect(container.textContent).toContain("No Resources Found");
    expect(container.textContent).toContain("Try changing your search or filters.");
  });

  test("a failed request is reported in the shared error panel", async () => {
    stub = { failWith: "Service unavailable" };
    const container = await render();

    expect(container.textContent).toContain("Service unavailable");
    const panel = Array.from(container.querySelectorAll("div")).find((d) =>
      d.className.includes("border-red-200"),
    );
    expect(panel).toBeDefined();
  });

  test("more than one page gets the shared pagination control", async () => {
    stub = { items: [{ id: 1 } as StudyResource], total: 45 };
    const container = await render();

    // Twenty per page, so 45 results means three pages.
    expect(listStudyResources).toHaveBeenLastCalledWith(
      expect.objectContaining({ limit: 20 }),
      expect.anything(),
    );
    expect(container.textContent).toContain("Showing 1-1 of 45");
    const pageTwo = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim() === "2",
    );
    expect(pageTwo).toBeDefined();
  });
});
