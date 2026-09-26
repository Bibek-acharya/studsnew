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
// what this suite is about; the year/type/search filters are.
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
const listStudyResources = jest.fn(async () => ({
  data: {
    study_resources: [] as StudyResource[],
    total: 0,
    years: ["2080", "2081"],
  },
}));

jest.mock("@/services/studyResourcesApi", () => ({
  studyResourcesApi: { listStudyResources: (...args: unknown[]) => listStudyResources(...(args as [])) },
  isVideoStudyResourceType: () => false,
  getStudyResourceStreamUrl: (id: number) => `/stream/${id}`,
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const containers: HTMLElement[] = [];
const roots: Root[] = [];

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

beforeEach(() => {
  listStudyResources.mockClear();
});

afterEach(() => {
  while (roots.length) act(() => roots.pop()!.unmount());
  while (containers.length) containers.pop()!.remove();
});

describe("StudyResourcesPage filter layout", () => {
  test("filters sit in a left sidebar beside the results, not in a horizontal toolbar", async () => {
    const container = await render();

    const aside = container.querySelector("aside");
    expect(aside).not.toBeNull();
    // Hidden below lg, fixed 75-wide column from lg up — the Find College shape.
    expect(aside?.className).toContain("hidden");
    expect(aside?.className).toContain("lg:block");
    expect(aside?.className).toContain("lg:w-75");

    // The two columns live in one row that only splits at lg.
    const layout = aside?.parentElement;
    expect(layout?.className).toContain("lg:flex-row");
    expect(layout?.className).toContain("lg:flex-nowrap");

    // The results column is the flexible sibling that follows the sidebar.
    const main = container.querySelector("main");
    expect(main?.className).toContain("min-w-0");
    expect(main?.className).toContain("flex-1");
    expect(main?.parentElement).toBe(layout);

    // The old single-panel horizontal toolbar is gone.
    expect(container.textContent).not.toContain("Browse resources");
  });

  test("the sidebar panel carries every filter, stacked in its own sections", async () => {
    const container = await render();

    const aside = container.querySelector("aside")!;
    const panel = aside.querySelector("h2")?.closest("div");
    expect(panel).not.toBeNull();
    expect(aside.textContent).toContain("Filters");

    // Search stays above the results in the main column, not in the panel.
    expect(aside.querySelector('input[type="search"]')).toBeNull();
    const search = container.querySelector('input[aria-label="Search study resources"]');
    expect(search?.closest("main")).not.toBeNull();

    // Type, course and year are all inside the panel, in their own groups.
    const type = aside.querySelector('select[aria-label="Filter by resource type"]');
    const year = aside.querySelector('select[aria-label="Filter by year"]');
    const course = aside.querySelector('[data-testid="course-combobox"]');
    expect(type).not.toBeNull();
    expect(year).not.toBeNull();
    expect(course).not.toBeNull();

    // Vertical stacking: each label is a collapsible section header, so no
    // filter is laid out in a horizontal row any more.
    ["Resource type", "Course", "Year"].forEach((title) => {
      expect(aside.textContent).toContain(title);
    });
    expect(aside.querySelector("input[name='q']")).toBeNull();
  });

  test("below lg the sidebar is replaced by a drawer behind a Filters button", async () => {
    const container = await render();

    const trigger = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim() === "Filters",
    );
    expect(trigger).toBeDefined();
    // The trigger is the only thing that is lg:hidden about the filters.
    expect(trigger?.className).toContain("lg:hidden");

    // Closed to begin with.
    expect(container.querySelector('[aria-label="Close filters"]')).toBeNull();

    act(() => {
      trigger!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // The drawer is viewport-fixed, capped in height and scrollable, so the
    // form can never overflow the screen.
    const drawer = container.querySelector('[aria-label="Close filters"]')
      ?.closest("div.fixed");
    expect(drawer).not.toBeNull();
    expect(drawer?.className).toContain("inset-0");
    expect(drawer?.className).toContain("lg:hidden");
    const sheet = drawer?.querySelector("div.absolute.bottom-0");
    expect(sheet?.className).toContain("max-h-[70vh]");
    expect(sheet?.className).toContain("overflow-y-auto");

    // The same filter panel is inside it.
    expect(sheet?.querySelector('[aria-label="Filter by year"]')).not.toBeNull();

    act(() => {
      container
        .querySelector('[aria-label="Close filters"]')!
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(container.querySelector('[aria-label="Close filters"]')).toBeNull();
  });

  test("search still runs from the input and the Search button", async () => {
    const container = await render();

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
    });
    clickByText(container, "Search");

    await act(async () => {
      await Promise.resolve();
    });
    expect(listStudyResources).toHaveBeenCalledWith(
      expect.objectContaining({ q: "calculus" }),
    );
  });

  test("reset clears search, type, course and year in one action", async () => {
    const container = await render();

    const aside = container.querySelector("aside")!;
    const year = aside.querySelector<HTMLSelectElement>(
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

    clickByText(container, "Reset");

    await act(async () => {
      await Promise.resolve();
    });
    // buildStudyResourceFilters drops cleared values, so they go out undefined.
    expect(listStudyResources).toHaveBeenLastCalledWith({
      q: undefined,
      type: undefined,
      course: undefined,
      year: undefined,
      page: 1,
      limit: 20,
    });
  });
});

describe("StudyResourcesPage with a route-locked type", () => {
  test("the type selector is replaced by a lock marker naming the collection", async () => {
    const container = await render("study-notes");
    const aside = container.querySelector("aside")!;

    // No selector is offered, so the type cannot be changed from this route.
    expect(
      aside.querySelector('select[aria-label="Filter by resource type"]'),
    ).toBeNull();
    const lock = aside.querySelector(
      '[aria-label="Resource type locked to Study Notes"]',
    );
    expect(lock).not.toBeNull();
    expect(lock?.textContent).toContain("Study Notes");
    expect(lock?.textContent).toContain("Fixed by this page");

    // The page stays an h1 with the collection name, plus the way back.
    expect(container.querySelector("h1")?.textContent).toBe("Study Notes");
    expect(container.textContent).toContain("All study resources");
  });

  test("the other filters still work while the type stays locked", async () => {
    const container = await render("study-notes");
    const aside = container.querySelector("aside")!;

    // Course and year are present and usable.
    expect(aside.querySelector('[data-testid="course-combobox"]')).not.toBeNull();
    const year = aside.querySelector<HTMLSelectElement>(
      'select[aria-label="Filter by year"]',
    )!;

    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLSelectElement.prototype,
        "value",
      )!.set!;
      setter.call(year, "2080");
      year.dispatchEvent(new Event("change", { bubbles: true }));
      await Promise.resolve();
    });

    // The request keeps the locked type no matter what else is filtered.
    expect(listStudyResources).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: "study-notes", year: "2080" }),
    );
  });

  test("reset leaves the locked type in place", async () => {
    const container = await render("study-notes");

    clickByText(container, "Reset");

    await act(async () => {
      await Promise.resolve();
    });
    expect(listStudyResources).toHaveBeenLastCalledWith({
      q: undefined,
      type: "study-notes",
      course: undefined,
      year: undefined,
      page: 1,
      limit: 20,
    });
  });
});
