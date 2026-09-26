/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import HeroBannerTab from "@/components/superadmin/client/HeroBannerTab";
import HeroBannerModal from "@/components/superadmin/client/HeroBannerModal";
import type { CarouselSlide } from "@/services/api";

// next/image renders through the Next.js loader, which jsdom cannot resolve.
// A plain <img> stand-in keeps the assertions on src, not on markup.
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    alt,
    ...rest
  }: {
    alt?: string;
    src: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt ?? ""} data-src={rest.src} />
  ),
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/** A stored study-resources slide that still carries the legacy copy columns. */
const STORED_SLIDE: CarouselSlide = {
  id: 7,
  page: "study-resources",
  title: "Legacy headline",
  subtitle: "Legacy supporting line",
  description: "Legacy description",
  image_url: "/uploads/study-resources.png",
  link_url: "/study-resources/past-questions",
  button_text: "Browse papers",
  order: 1,
  active: true,
  created_at: "2026-01-15T00:00:00Z",
};

/** The same slide as the landing hero would hold it, for the shared tab. */
const LANDING_SLIDE: CarouselSlide = {
  ...STORED_SLIDE,
  page: "landing",
};

const containers: HTMLElement[] = [];
const roots: Root[] = [];

function mount(node: React.ReactNode): HTMLElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  const root = createRoot(container);
  roots.push(root);
  act(() => {
    root.render(node);
  });
  return container;
}

function button(container: HTMLElement, label: string): HTMLButtonElement {
  const target = Array.from(container.querySelectorAll("button")).find(
    (b) => b.getAttribute("aria-label") === label,
  );
  if (!target) throw new Error(`button "${label}" not found`);
  return target;
}

function press(container: HTMLElement, label: string): void {
  act(() => {
    button(container, label).dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
  });
}

function columnNames(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("thead th")).map(
    (th) => th.textContent?.trim() ?? "",
  );
}

/** Lets the tab's initial fetch and the handlers' promises settle. */
async function flush(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

interface FetchCall {
  url: string;
  method: string;
  body: unknown;
}

let calls: FetchCall[] = [];
let fetchMock: jest.Mock;

function ok(data: unknown) {
  return {
    ok: true,
    json: async () => ({ success: true, data }),
  };
}

beforeEach(() => {
  calls = [];
  fetchMock = jest.fn(async (url: string, init?: RequestInit) => {
    calls.push({
      url: String(url),
      method: init?.method ?? "GET",
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    });
    if (String(url).includes("/carousels?")) {
      return ok(
        String(url).includes("page=landing") ? [LANDING_SLIDE] : [STORED_SLIDE],
      );
    }
    return ok({});
  });
  (globalThis as Record<string, unknown>).fetch = fetchMock;
  window.alert = jest.fn();
  window.confirm = jest.fn(() => true);
});

afterEach(() => {
  while (roots.length) act(() => roots.pop()!.unmount());
  while (containers.length) containers.pop()!.remove();
  jest.clearAllMocks();
});

describe("HeroBannerModal in image-only mode", () => {
  test("offers no title, subtitle, description, link or CTA fields", () => {
    const container = mount(
      <HeroBannerModal
        slide={STORED_SLIDE}
        page="study-resources"
        itemLabel="Study Resources Slide"
        imageOnly
        onClose={() => {}}
      />,
    );

    for (const field of [
      "carousel-slide-title",
      "carousel-slide-subtitle",
      "carousel-slide-description",
      "carousel-slide-link",
      "carousel-slide-cta",
    ]) {
      expect(container.querySelector(`#${field}`)).toBeNull();
    }
    expect(container.textContent).not.toContain("Legacy headline");
    expect(container.textContent).not.toContain("Browse papers");

    // The image field itself stays, with the stored picture as its preview.
    expect(container.querySelector('input[type="file"]')).not.toBeNull();
    expect(
      container.querySelector<HTMLImageElement>("img")?.getAttribute("src"),
    ).toBe(`${API_BASE}/uploads/study-resources.png`);
  });

  test("saves an image-only payload that blanks every text field", async () => {
    const onClose = jest.fn();
    const container = mount(
      <HeroBannerModal
        slide={STORED_SLIDE}
        page="study-resources"
        itemLabel="Study Resources Slide"
        imageOnly
        onClose={onClose}
      />,
    );

    await act(async () => {
      container
        .querySelector("form")
        ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      await Promise.resolve();
    });
    await flush();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(calls[0]).toMatchObject({
      url: `${API_BASE}/api/v1/admin/carousels/7`,
      method: "PUT",
      body: {
        page: "study-resources",
        title: "",
        subtitle: "",
        description: "",
        image_url: "/uploads/study-resources.png",
        link_url: "",
        button_text: "",
        active: true,
      },
    });
    expect(onClose).toHaveBeenCalledWith(true);
  });

  test("creating an image-only slide posts the same text-free shape", async () => {
    const container = mount(
      <HeroBannerModal
        slide={null}
        page="study-resources"
        itemLabel="Study Resources Slide"
        imageOnly
        onClose={() => {}}
      />,
    );

    // No title to type, so the missing image is what stops the save.
    expect(window.alert).not.toHaveBeenCalled();
    await act(async () => {
      container
        .querySelector("form")
        ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      await Promise.resolve();
    });
    await flush();

    expect(window.alert).toHaveBeenCalledWith("Please upload a slide image");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("the landing hero modal keeps all of its text fields", () => {
    const container = mount(
      <HeroBannerModal slide={STORED_SLIDE} onClose={() => {}} />,
    );

    const title = container.querySelector<HTMLInputElement>(
      "#carousel-slide-title",
    );
    expect(title?.required).toBe(true);
    expect(title?.value).toBe("Legacy headline");
    expect(container.querySelector("#carousel-slide-subtitle")).not.toBeNull();
    expect(container.querySelector("#carousel-slide-description")).not.toBeNull();
    expect(container.querySelector("#carousel-slide-link")).not.toBeNull();
    expect(container.querySelector("#carousel-slide-cta")).not.toBeNull();
    expect(container.textContent).toContain("Banner image");
  });

  test("the landing hero modal still refuses to save without a title", async () => {
    const container = mount(
      <HeroBannerModal
        slide={{ ...STORED_SLIDE, title: "" }}
        onClose={() => {}}
      />,
    );

    await act(async () => {
      container
        .querySelector("form")
        ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      await Promise.resolve();
    });
    await flush();

    expect(window.alert).toHaveBeenCalledWith("Please enter a title");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("HeroBannerTab in image-only mode", () => {
  test("lists slides by image only, with no content columns", async () => {
    const container = mount(
      <HeroBannerTab
        page="study-resources"
        heading="Study Resources Carousel"
        itemLabel="Study Resources Slide"
        imageOnly
      />,
    );
    await flush();

    expect(columnNames(container)).toEqual([
      "Priority",
      "Image",
      "Active",
      "Created",
      "Actions",
    ]);

    // The preview is the row's subject matter.
    const preview = container.querySelector("tbody img");
    expect(preview?.getAttribute("data-src")).toBe(
      `${API_BASE}/uploads/study-resources.png`,
    );
    expect(preview?.getAttribute("alt")).toBe("Slide 1");

    // No stored copy leaks into the list.
    const text = container.textContent ?? "";
    expect(text).not.toContain("Legacy headline");
    expect(text).not.toContain("Legacy supporting line");
    expect(text).not.toContain("Legacy description");
    expect(text).not.toContain("Browse papers");
    expect(text).not.toContain("/study-resources/past-questions");
  });

  test("row controls are named by position, and state plus order stay", async () => {
    const container = mount(
      <HeroBannerTab
        page="study-resources"
        heading="Study Resources Carousel"
        itemLabel="Study Resources Slide"
        imageOnly
      />,
    );
    await flush();

    for (const label of [
      "Deactivate slide 1",
      "Edit slide 1",
      "Delete slide 1",
      "Move slide 1 down",
    ]) {
      expect(container.querySelector(`[aria-label="${label}"]`)).not.toBeNull();
    }
    // The first slide cannot move up.
    expect(
      (button(container, "Move slide 1 up") as HTMLButtonElement).disabled,
    ).toBe(true);

    const activeToggle = button(container, "Deactivate slide 1");
    expect(activeToggle.getAttribute("aria-pressed")).toBe("true");
    expect(activeToggle.textContent).toBe("Active");
  });

  test("toggling active still sends the whole record for the page", async () => {
    const container = mount(
      <HeroBannerTab
        page="study-resources"
        heading="Study Resources Carousel"
        itemLabel="Study Resources Slide"
        imageOnly
      />,
    );
    await flush();

    await act(async () => {
      button(container, "Deactivate slide 1").dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
      await Promise.resolve();
    });
    await flush();

    expect(calls.at(-1)).toMatchObject({
      url: `${API_BASE}/api/v1/admin/carousels/7`,
      method: "PUT",
      body: {
        page: "study-resources",
        title: "Legacy headline",
        image_url: "/uploads/study-resources.png",
        link_url: "/study-resources/past-questions",
        button_text: "Browse papers",
        order: 1,
        active: false,
      },
    });
    // And the row flips locally.
    expect(
      container.querySelector('[aria-label="Activate slide 1"]'),
    ).not.toBeNull();
  });

  test("editing a slide opens the image-only form", async () => {
    const container = mount(
      <HeroBannerTab
        page="study-resources"
        heading="Study Resources Carousel"
        itemLabel="Study Resources Slide"
        imageOnly
      />,
    );
    await flush();

    press(container, "Edit slide 1");

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog?.querySelector("#carousel-slide-title")).toBeNull();
    expect(dialog?.querySelector('input[type="file"]')).not.toBeNull();
  });

  test("the landing hero tab keeps its content columns", async () => {
    const container = mount(<HeroBannerTab />);
    await flush();

    expect(columnNames(container)).toEqual([
      "Priority",
      "Image",
      "Content",
      "Link & CTA",
      "Active",
      "Created",
      "Actions",
    ]);
    expect(container.textContent).toContain("Legacy headline");
    expect(container.textContent).toContain("Browse papers");
    // Landing rows are still named by their title.
    expect(
      container.querySelector('[aria-label="Deactivate Legacy headline"]'),
    ).not.toBeNull();
  });
});
