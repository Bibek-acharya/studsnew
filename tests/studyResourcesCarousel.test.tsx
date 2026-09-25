/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import StudyResourcesCarousel from "@/components/studyResources/StudyResourcesCarousel";
import type { CarouselSlide } from "@/services/api";

// next/image is not exercised by this contract test; a plain <img> stand-in
// lets the test assert the resolved source URL directly.
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    alt,
    ...rest
  }: {
    alt: string;
    src: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} data-src={rest.src} />
  ),
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function slide(
  id: number,
  overrides: Partial<CarouselSlide> = {},
): CarouselSlide {
  return {
    id,
    title: `Slide ${id}`,
    subtitle: `Subtitle ${id}`,
    description: `Description ${id}`,
    image_url: `/uploads/banner-${id}.png`,
    link_url: `https://example.com/${id}`,
    button_text: `Go ${id}`,
    active: true,
    ...overrides,
  } as CarouselSlide;
}

const containers: HTMLElement[] = [];
const roots: Root[] = [];

function render(slides: CarouselSlide[]) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  const root = createRoot(container);
  roots.push(root);
  act(() => {
    root.render(<StudyResourcesCarousel slides={slides} />);
  });
  return container;
}

function click(
  container: HTMLElement,
  selector: string,
  label?: string,
): void {
  const buttons = Array.from(container.querySelectorAll("button"));
  const target = label
    ? buttons.find((b) => b.getAttribute("aria-label") === label)
    : buttons.find((b) => b.className.includes(selector));
  if (!target) throw new Error(`control "${label ?? selector}" not found`);
  act(() => {
    target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

function liveRegion(container: HTMLElement): string {
  return container.querySelector("[aria-live]")?.textContent ?? "";
}

beforeEach(() => {
  // requestAnimationFrame + matchMedia are used for the fade and reduced motion.
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  act(() => {
    roots.forEach((root) => root.unmount());
  });
  roots.length = 0;
  containers.forEach((container) => container.remove());
  containers.length = 0;
});

describe("StudyResourcesCarousel", () => {
  test("renders nothing when there are no active slides", () => {
    const empty = render([]);
    expect(empty.innerHTML).toBe("");

    const allInactive = render([
      slide(1, { active: false }),
      slide(2, { active: false }),
    ]);
    expect(allInactive.innerHTML).toBe("");
  });

  test("only active slides take part in the rotation", () => {
    const container = render([
      slide(1),
      slide(2, { active: false }),
      slide(3),
    ]);

    // Two active slides => two dots, and the live region counts only those.
    const dots = container.querySelectorAll('button[aria-label^="Go to slide"]');
    expect(dots).toHaveLength(2);
    expect(liveRegion(container)).toContain("1 of 2");

    // The inactive slide's image is not in the track.
    const track = container.querySelector('[data-testid="carousel-track"]');
    expect(track?.querySelectorAll("img")).toHaveLength(2);
  });

  test("keeps the carousel and slide accessibility semantics", () => {
    const container = render([slide(1), slide(2)]);
    const region = container.querySelector('[aria-roledescription="carousel"]');

    expect(region?.getAttribute("role")).toBe("region");
    expect(region?.getAttribute("aria-label")).toBe(
      "Study resources promotions",
    );

    const group = container.querySelector('[aria-roledescription="slide"]');
    expect(group?.getAttribute("role")).toBe("group");
    expect(group?.getAttribute("aria-label")).toBe("1 of 2");
  });

  test("advances with the next/previous controls and wraps around", () => {
    const container = render([slide(1), slide(2), slide(3)]);

    click(container, "", "Next study resources slide");
    expect(liveRegion(container)).toContain("2 of 3");

    click(container, "", "Previous study resources slide");
    expect(liveRegion(container)).toContain("1 of 3");

    // Wraps backwards from the first slide to the last.
    click(container, "", "Previous study resources slide");
    expect(liveRegion(container)).toContain("3 of 3");
  });

  test("dots jump to a slide and mark the current one", () => {
    const container = render([slide(1), slide(2), slide(3)]);

    click(container, "", "Go to slide 3: Slide 3");
    expect(liveRegion(container)).toContain("3 of 3");

    const current = container.querySelectorAll('[aria-current="true"]');
    expect(current).toHaveLength(1);
    expect(current[0].getAttribute("aria-label")).toBe(
      "Go to slide 3: Slide 3",
    );
  });

  test("the track slides with a transform rather than swapping opacity", () => {
    const container = render([slide(1), slide(2)]);
    const track = container.querySelector<HTMLElement>(
      '[data-testid="carousel-track"]',
    );

    // jsdom normalises the first offset to `-0%`.
    expect(track?.style.transform).toMatch(/translateX\(-?0%\)/);
    click(container, "", "Next study resources slide");
    expect(track?.style.transform).toBe("translateX(-100%)");
  });

  test("shows the active slide's title, subtitle, description and CTA", () => {
    const container = render([
      slide(1, {
        title: "Past papers, sorted",
        subtitle: "Every year, one place",
        description: "Filter by course and year.",
        link_url: "/study-resources/past-questions",
        button_text: "Browse papers",
      }),
    ]);

    expect(container.textContent).toContain("Past papers, sorted");
    expect(container.textContent).toContain("Every year, one place");
    expect(container.textContent).toContain("Filter by course and year.");
    // No description => the fallback headline is used instead of a blank.
    const bare = render([slide(9, { title: "", subtitle: "", description: "" })]);
    expect(bare.textContent).toContain("Prepare for what comes next");

    const cta = container.querySelector<HTMLAnchorElement>(
      'a[href="/study-resources/past-questions"]',
    );
    expect(cta?.textContent).toContain("Browse papers");
    // Internal links stay in the tab.
    expect(cta?.getAttribute("target")).toBeNull();
    expect(cta?.getAttribute("rel")).toBeNull();
  });

  test("external CTAs open safely in a new tab", () => {
    const container = render([slide(1, { link_url: "https://example.com/1" })]);

    const cta = container.querySelector<HTMLAnchorElement>(
      `a[href="https://example.com/1"]`,
    );
    expect(cta?.getAttribute("target")).toBe("_blank");
    expect(cta?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  test("a slide without a link has no CTA", () => {
    const container = render([slide(1, { link_url: "" })]);

    expect(container.querySelector("a[href]")).toBeNull();
    expect(container.textContent).toContain("Slide 1");
  });

  test("slide images resolve through the shared image URL helper", () => {
    const container = render([slide(1, { image_url: "/uploads/banner.png" })]);

    expect(container.querySelector("img")?.getAttribute("data-src")).toBe(
      `${API_BASE}/uploads/banner.png`,
    );
  });
});
