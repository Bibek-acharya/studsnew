import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import StudyResourcesLanding from "@/components/studyResources/StudyResourcesLanding";
import { STUDY_RESOURCE_CATEGORIES } from "@/components/studyResources/studyResourceCategories";

// The carousel is a self-contained client island; stub it so this test stays
// about the landing's own layout contract.
jest.mock("@/components/studyResources/StudyResourcesCarousel", () => ({
  __esModule: true,
  default: () => <div data-testid="carousel" />,
}));

const EXPECTED_CARDS = [
  ["Study Notes", "/study-resources/study-notes"],
  ["Past Questions", "/study-resources/past-questions"],
  ["Model Questions", "/study-resources/model-questions"],
  ["Syllabus", "/study-resources/syllabus"],
  ["Video Lectures", "/study-resources/video-lectures"],
  ["Mock Test", "/study-resources/mock-test"],
];

function renderLanding() {
  return renderToStaticMarkup(<StudyResourcesLanding slides={[]} />);
}

describe("study resources landing layout contract", () => {
  test("renders exactly the six collection cards, linked to their routes", () => {
    const html = renderLanding();

    EXPECTED_CARDS.forEach(([label, href]) => {
      expect(html).toContain(`href="${href}"`);
      expect(html).toContain(label);
    });

    // The card grid is the only set of collection links on the page.
    const collectionLinks = html.match(/href="\/study-resources\/[a-z-]+"/g) ?? [];
    expect(collectionLinks).toHaveLength(6);
  });

  test("the carousel slot is still rendered", () => {
    expect(renderLanding()).toContain('data-testid="carousel"');
  });

  test("the landing has no desktop horizontal padding", () => {
    const html = renderLanding();
    // The container is the first max-w-350 wrapper; it must keep mobile
    // padding and add none from `sm` upwards.
    const container = html.match(
      /class="([^"]*max-w-350[^"]*)"/,
    )?.[1];

    expect(container).toBeDefined();
    expect(container).toContain("px-4");
    // Padding is dropped at sm and nothing re-adds it at a larger breakpoint.
    expect(container).toContain("sm:px-0");
    expect(container).not.toMatch(/\b(sm|md|lg|xl|2xl):px-(?!0)/);
  });

  test("cards use the site's card treatment, not a per-category palette", () => {
    const html = renderLanding();

    // House card shell: white, gray border, small radius, blue hover accent.
    expect(html).toContain("rounded-xl border border-gray-200 bg-white");
    expect(html).toContain("hover:border-blue-300");
    // Focus states survive the restyle.
    expect(html).toContain("focus-visible:ring-brand-blue");
    // The invented visual system is gone: no gradient top bars, glow orbs,
    // per-card colour classes or monospace ordinals.
    expect(html).not.toContain("topBorderClass");
    expect(html).not.toContain("blur-2xl");
    expect(html).not.toMatch(/from-(emerald|violet|amber|rose|cyan)-/);
    expect(html).not.toMatch(/text-(emerald|violet|amber|rose|cyan)-/);
    expect(html).not.toContain("font-mono");
  });

  test("every card uses the same action copy", () => {
    const html = renderLanding();
    const actionLabels = html.match(/>View all</g) ?? [];

    expect(actionLabels).toHaveLength(6);
    expect(html).not.toContain("Download");
    expect(html).not.toContain("Take test");
  });

  test("no availability badges are shown", () => {
    const html = renderLanding();

    expect(html).not.toContain("Available now");
    expect(html).not.toContain("Coming soon");
    expect(html).not.toContain("In planning");
  });

  test("the removed generic catalogue heading is not part of the landing", () => {
    expect(renderLanding()).not.toContain("Past Questions &amp; Resources");
  });

  test("the config exposes an icon per collection and no palette fields", () => {
    STUDY_RESOURCE_CATEGORIES.forEach((category) => {
      expect(typeof category.icon).toBe("string");
      expect(category).not.toHaveProperty("visual");
    });
  });
});
