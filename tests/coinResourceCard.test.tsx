/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import ResourceCard from "@/components/studyResources/ResourceCard";
import type { ResolvedResourceAccess } from "@/components/coins/useCoinState";
import type { StudyResource } from "@/services/studyResourcesApi";

/**
 * What the card says, per state.
 *
 * The three things worth pinning down here are all things a student would be
 * misled by: a locked card must still show its full metadata (you cannot spend
 * on something you cannot see), the price is a neutral fact and never a
 * judgement, and the insufficient button is live rather than disabled.
 */

jest.mock("@/services/api", () => ({
  stripHtml: (value: string | null | undefined) =>
    (value ?? "").replace(/<[^>]*>/g, "").trim(),
}));

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
  file_size: 12_345_678,
  mime_type: "application/pdf",
  downloads: 24,
  created_at: "2026-09-01T00:00:00Z",
} as StudyResource;

const access = (over: Partial<ResolvedResourceAccess>): ResolvedResourceAccess => ({
  state: "affordable",
  price: 40,
  balance: 100,
  gap: 0,
  starterLeft: null,
  starterTotal: null,
  busy: false,
  ...over,
});

const containers: HTMLElement[] = [];
const roots: Root[] = [];

function render(props: Partial<React.ComponentProps<typeof ResourceCard>> = {}) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  const root = createRoot(container);
  roots.push(root);
  act(() => {
    root.render(
      <ResourceCard
        resource={resource}
        variant="document"
        access={access({})}
        onPrimaryAction={() => {}}
        onSignIn={() => {}}
        {...props}
      />,
    );
  });
  return container;
}

function buttons(container: HTMLElement): HTMLButtonElement[] {
  return Array.from(container.querySelectorAll("button"));
}

afterEach(() => {
  while (roots.length) act(() => roots.pop()!.unmount());
  while (containers.length) containers.pop()!.remove();
});

describe("ResourceCard keeps a locked card fully browsable", () => {
  test("title, course, year and size are all present on an unaffordable card", () => {
    // 06 §1.6: gating the content as well as the action would make the spend
    // uninformed. A student must be able to see what they are buying.
    const container = render({ access: access({ state: "insufficient", gap: 22, balance: 18 }) });
    const text = container.textContent ?? "";
    expect(text).toContain("Thermodynamics Notes");
    expect(text).toContain("BSc CSIT");
    expect(text).toContain("2081");
    expect(text).toContain("11.8 MB");
    expect(text).toContain("24 downloads");
  });

  test("a locked card is not visually diminished", () => {
    // No opacity-60, no desaturation: the student can afford a different
    // resource, and this one is simply not it.
    const container = render({ access: access({ state: "insufficient", gap: 22, balance: 18 }) });
    const article = container.querySelector("article")!;
    expect(article.className).not.toContain("opacity");
  });
});

describe("ResourceCard price badge", () => {
  test("states the price as a neutral fact in every unaffordability", () => {
    const container = render({ access: access({ state: "insufficient", gap: 22, balance: 18 }) });
    // The price is STILL shown when they cannot pay. Hiding it would make the
    // gap inexplicable, and colouring it would make a fact a judgement.
    expect(container.textContent).toContain("40 StudsTokens");
    const badge = Array.from(container.querySelectorAll("span")).find((s) =>
      s.textContent?.includes("40 StudsTokens"),
    );
    expect(badge?.className).toContain("bg-gray-100");
    expect(badge?.className).toContain("text-gray-700");
  });

  test("an unlocked card does not also show a price", () => {
    // Both at once invites a question that has no useful answer.
    const container = render({ access: access({ state: "unlocked" }) });
    expect(container.textContent).toContain("Unlocked");
    expect(container.textContent).not.toContain("40 StudsTokens");
  });

  test("a starter card says how many are left, and no price", () => {
    const container = render({
      access: access({ state: "starter-eligible", starterLeft: 2, starterTotal: 3 }),
    });
    expect(container.textContent).toContain("Starter · 2 of 3 left");
    expect(container.textContent).not.toContain("40 StudsTokens");
  });

  test("a missing price says so plainly rather than showing a zero", () => {
    const container = render({ access: access({ state: "price-unknown", price: null }) });
    expect(container.textContent).toContain("Unlock to see price");
    expect(container.textContent).not.toContain("0 StudsTokens");
  });

  test("the coin glyph is decorative; the word is the accessible name", () => {
    const container = render();
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("ResourceCard action button", () => {
  test("an unaffordable card offers a LIVE button naming the gap", () => {
    const onNeed = jest.fn();
    const container = render({
      access: access({ state: "insufficient", gap: 22, balance: 18 }),
    });
    const primary = buttons(container).find((b) => /Earn/.test(b.textContent ?? ""));
    expect(primary).toBeDefined();
    // Never `disabled`: a greyed-out button with no explanation is the failure
    // mode of every gated product.
    expect(primary?.disabled).toBe(false);
    expect(primary?.textContent).toContain("Earn 22 more");
    expect(onNeed).not.toHaveBeenCalled();
  });

  test("an affordable card offers a solid Unlock whose label carries no price", () => {
    const container = render();
    const primary = buttons(container).find((b) => /Unlock/.test(b.textContent ?? ""));
    expect(primary?.textContent?.trim()).toBe("Unlock");
    // The price is in the badge. In the label it would wrap below sm and
    // double the footer height.
    expect(primary?.textContent).not.toContain("40");
    expect(primary?.className).toContain("bg-brand-blue");
  });

  test("a signed-out card asks them to log in, not to earn", () => {
    // Telling an anonymous visitor to earn coins would be a claim about a
    // wallet nobody has read.
    const container = render({ access: access({ state: "anonymous" }) });
    expect(buttons(container).some((b) => /Log in to unlock/.test(b.textContent ?? ""))).toBe(
      true,
    );
  });

  test("an in-flight unlock is announced as busy, not merely greyed out", () => {
    const container = render({ access: access({ state: "unlocking" }) });
    const busy = container.querySelector("[aria-busy='true']");
    expect(busy).not.toBeNull();
  });

  test("an unlocked card's action downloads rather than offering a purchase", () => {
    const onPrimary = jest.fn();
    const container = render({ access: access({ state: "unlocked" }), onPrimaryAction: onPrimary });
    const primary = buttons(container).find((b) => /Download/.test(b.textContent ?? ""));
    expect(primary).toBeDefined();
    act(() => {
      primary!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onPrimary).toHaveBeenCalledTimes(1);
  });
});

describe("ResourceCard with the gate off", () => {
  test("renders no badge and the plain Download button, exactly as before", () => {
    // The inertness contract. A null access must be indistinguishable from the
    // pre-coins card, or switching the gate on becomes a visual redesign.
    const onPrimary = jest.fn();
    const container = render({ access: null, onPrimaryAction: onPrimary });
    expect(container.textContent).not.toContain("StudsTokens");
    expect(container.textContent).not.toContain("Starter");
    const primary = buttons(container).find((b) => /Download/.test(b.textContent ?? ""));
    expect(primary?.textContent?.trim()).toBe("Download");
    expect(primary?.className).toContain("bg-blue-50");
    act(() => {
      primary!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onPrimary).toHaveBeenCalledTimes(1);
  });

  test("an ungated card opens no dialog", () => {
    render({ access: null });
    expect(document.querySelector("[role='dialog']")).toBeNull();
  });
});

describe("ResourceCard video variant", () => {
  const lecture = {
    ...resource,
    id: 42,
    title: "Derivatives from scratch",
    resource_type: "video-lectures",
    duration_seconds: 545,
    views: 12,
  } as StudyResource;

  test("stays the selectable button with the rose ring it always was", () => {
    const container = render({
      resource: lecture,
      variant: "video",
      selected: true,
      onSelect: jest.fn(),
    });
    const tile = container.querySelector("li > button")!;
    expect(tile).not.toBeNull();
    // The rose selection ring is load-bearing and is not flattened.
    expect(tile.className).toContain("border-rose-300");
    expect(tile.className).toContain("ring-1");
    expect(container.querySelector("li")).not.toBeNull();
  });

  test("carries the coin state as a badge, replacing the low-contrast label", () => {
    const container = render({
      resource: lecture,
      variant: "video",
      access: access({ state: "insufficient", gap: 22, balance: 18 }),
    });
    expect(container.textContent).toContain("40 StudsTokens");
    // The old "Sign in to play" label sat at 2.56:1 contrast and is gone.
    expect(container.textContent).not.toContain("Sign in to play");
  });

  test("nests no button inside the selection button", () => {
    // Invalid HTML, and two competing actions for one tap.
    const container = render({
      resource: lecture,
      variant: "video",
      access: access({}),
    });
    expect(container.querySelector("button button")).toBeNull();
  });
});

describe("ResourceCard drafts", () => {
  test("an unpublished draft renders nothing at all", () => {
    const container = render({ resource: { ...resource, is_published: false } });
    expect(container.innerHTML).toBe("");
  });
});
