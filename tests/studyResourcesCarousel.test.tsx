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

/** A slide still carrying the full copy the carousel used to render. */
function slide(
  id: number,
  overrides: Partial<CarouselSlide> = {},
): CarouselSlide {
  return {
    id,
    title: `Title ${id}`,
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

function control(container: HTMLElement, label: string): HTMLButtonElement {
  const target = Array.from(container.querySelectorAll("button")).find(
    (b) => b.getAttribute("aria-label") === label,
  );
  if (!target) throw new Error(`control "${label}" not found`);
  return target;
}

function click(container: HTMLElement, label: string): void {
  act(() => {
    control(container, label).dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
  });
}

function liveRegion(container: HTMLElement): string {
  return container.querySelector("[aria-live]")?.textContent ?? "";
}

afterEach(() => {
  while (roots.length) act(() => roots.pop()!.unmount());
  while (containers.length) containers.pop()!.remove();
});

describe("StudyResourcesCarousel", () => {
  test("renders nothing when there are no active slides", () => {
    expect(render([]).innerHTML).toBe("");

    const allInactive = render([
      slide(1, { active: false }),
      slide(2, { active: false }),
    ]);
    expect(allInactive.innerHTML).toBe("");
  });

  test("shows images and nothing else — no copy, links or CTA", () => {
    const container = render([
      slide(1, {
        title: "Past papers, sorted",
        subtitle: "Every year, one place",
        description: "Filter by course and year.",
        link_url: "/study-resources/past-questions",
        button_text: "Browse papers",
      }),
    ]);

    const text = container.textContent ?? "";
    for (const removed of [
      "Past papers, sorted",
      "Every year, one place",
      "Filter by course and year.",
      "Browse papers",
      // The old decorative pill.
      "Study resources",
    ]) {
      expect(text).not.toContain(removed);
    }

    // No link survives, so the slide cannot be clicked through to anywhere.
    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("h1, h2, h3")).toBeNull();

    // The image is still the whole slide.
    const image = container.querySelector("img");
    expect(image?.getAttribute("data-src")).toBe(
      `${API_BASE}/uploads/banner-1.png`,
    );
  });

  test("slide images resolve through the shared image URL helper", () => {
    const container = render([slide(1, { image_url: "/uploads/banner.png" })]);

    expect(container.querySelector("img")?.getAttribute("data-src")).toBe(
      `${API_BASE}/uploads/banner.png`,
    );
  });

  test("every active slide keeps its own image, inactive ones drop out", () => {
    const container = render([
      slide(1),
      slide(2, { active: false }),
      slide(3),
    ]);

    const track = container.querySelector('[data-testid="carousel-track"]');
    const images = Array.from(track?.querySelectorAll("img") ?? []);
    expect(images.map((img) => img.getAttribute("data-src"))).toEqual([
      `${API_BASE}/uploads/banner-1.png`,
      `${API_BASE}/uploads/banner-3.png`,
    ]);
  });

  test("keeps the carousel and slide accessibility semantics", () => {
    const container = render([slide(1), slide(2)]);
    const region = container.querySelector('[aria-roledescription="carousel"]');

    expect(region?.getAttribute("role")).toBe("region");
    expect(region?.getAttribute("aria-label")).toBe(
      "Study resources promotions",
    );

    const groups = container.querySelectorAll('[aria-roledescription="slide"]');
    expect(groups).toHaveLength(2);
    expect(groups[0].getAttribute("role")).toBe("group");
    expect(groups[0].getAttribute("aria-label")).toBe("1 of 2");
    expect(groups[1].getAttribute("aria-label")).toBe("2 of 2");

    // Image alt text describes position, not the removed slide copy.
    expect(groups[0].querySelector("img")?.getAttribute("alt")).toBe(
      "Study resource slide 1 of 2",
    );
  });

  test("previous/next arrows and dots remain and still navigate", () => {
    const container = render([slide(1), slide(2), slide(3)]);

    const dots = container.querySelectorAll('button[aria-label^="Go to slide"]');
    expect(dots).toHaveLength(3);

    click(container, "Next study resources slide");
    expect(liveRegion(container)).toBe("Slide 2 of 3");

    click(container, "Previous study resources slide");
    expect(liveRegion(container)).toBe("Slide 1 of 3");

    // Wraps backwards from the first slide to the last.
    click(container, "Previous study resources slide");
    expect(liveRegion(container)).toBe("Slide 3 of 3");
  });

  test("dots jump to a slide and mark the current one", () => {
    const container = render([slide(1), slide(2), slide(3)]);

    click(container, "Go to slide 3");
    expect(liveRegion(container)).toBe("Slide 3 of 3");

    const current = container.querySelectorAll('[aria-current="true"]');
    expect(current).toHaveLength(1);
    expect(current[0].getAttribute("aria-label")).toBe("Go to slide 3");
  });

  test("the track slides with a transform rather than swapping opacity", () => {
    const container = render([slide(1), slide(2)]);
    const track = container.querySelector<HTMLElement>(
      '[data-testid="carousel-track"]',
    );

    // jsdom normalises the first offset to `-0%`.
    expect(track?.style.transform).toMatch(/translateX\(-?0%\)/);
    click(container, "Next study resources slide");
    expect(track?.style.transform).toBe("translateX(-100%)");
  });
});
