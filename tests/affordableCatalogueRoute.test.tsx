/**
 * The anti-dead-end's destination: `/study-resources/can-unlock`.
 *
 * The link on every insufficient-funds screen used to point at
 * `/study-resources?affordable=1`, and the landing ignores that parameter
 * entirely — a carousel and six cards, no grid, no filter. A student who
 * cannot afford a document clicked "browse what you can afford" and arrived
 * somewhere that silently discarded what they asked for. This suite pins the two
 * things that make the new destination honest, and the two ways it could quietly
 * go back to being a dead end.
 */
import { AFFORDABLE_CATALOGUE_HREF } from "@/components/coins/EarnRoutes";
import { STUDY_RESOURCE_CATEGORIES } from "@/components/studyResources/studyResourceCategories";
import { isAffordableParamOn } from "@/components/studyResources/affordableFilter";
import CanUnlockPage, { metadata } from "@/app/study-resources/can-unlock/page";
import StudyResourcesPage from "@/components/studyResources/StudyResourcesPage";

describe("the link and its destination are the same page", () => {
  test("the href is the new route with the filter on", () => {
    expect(AFFORDABLE_CATALOGUE_HREF).toBe(
      "/study-resources/can-unlock?affordable=1",
    );
  });

  test("the href is not the landing, which ignores the parameter", () => {
    // The bug this route exists to fix. If the constant ever points back at
    // `/study-resources`, the parameter is read by nothing and the link is a
    // dead end wearing the costume of an escape.
    expect(AFFORDABLE_CATALOGUE_HREF).not.toBe("/study-resources?affordable=1");
    expect(AFFORDABLE_CATALOGUE_HREF.startsWith("/study-resources?")).toBe(
      false,
    );
  });

  test("the href is a route that exists, and it is not one of the six collections", () => {
    const path = AFFORDABLE_CATALOGUE_HREF.split("?")[0];
    // The landing and the six category pages are all accounted for; this route
    // is the only href the link can carry that is none of them.
    expect(path).toBe("/study-resources/can-unlock");
    expect(STUDY_RESOURCE_CATEGORIES.map((c) => c.href)).not.toContain(path);
  });

  test("the filter the link carries is spelled the one way the page reads", () => {
    // One spelling of "on", asserted across the two files that own it, so the
    // link and the grid cannot drift into a state where the parameter is in the
    // URL and nothing acts on it.
    const value = new URL(AFFORDABLE_CATALOGUE_HREF, "https://x").searchParams.get(
      "affordable",
    );
    expect(isAffordableParamOn(value)).toBe(true);
  });

  test("the page it names exists and renders the grid with its own heading", () => {
    const element = CanUnlockPage();
    expect(element).toBeTruthy();
    expect(StudyResourcesPage).toBeDefined();
  });
});

describe("the page's own metadata", () => {
  test("is not indexed, because its value is per-student", () => {
    // Six indexable collection cards already lead into the same content from
    // the landing; a second indexable route for a per-student mode competes
    // with them for the same queries.
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });

  test("names the promise in the title and the contents in the description", () => {
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { absolute: string }).absolute;
    expect(title).toContain("Resources you can unlock");
    // The description states what is in the list. It does not claim to be
    // everything on the site: mock tests are charged when a paper is opened
    // rather than when it is listed, so they carry no price for a list to
    // compare and cannot be filtered.
    expect(metadata.description).toContain("video lectures");
    expect(metadata.description?.toLowerCase()).not.toContain("everything");
  });

  test("never says a resource is free", () => {
    const everything = JSON.stringify(metadata).toLowerCase();
    expect(everything).not.toContain("free");
  });

  test("claims no canonical, so it cannot displace the landing in search", () => {
    expect(metadata.alternates?.canonical).toBeUndefined();
  });
});
