import type { Metadata } from "next";
import StudyResourcesPage from "@/components/studyResources/StudyResourcesPage";

/**
 * `/study-resources/can-unlock` — the destination of the anti-dead-end link.
 *
 * ## Why this is its own route and not a branch of the landing
 *
 * `EarnRoutes` closes every insufficient-funds screen with one link, and that
 * link used to point at `/study-resources?affordable=1`. The landing renders
 * `StudyResourcesLanding` and ignores the parameter: a carousel and six
 * collection cards, no grid, no filter. A student who cannot afford a document
 * clicked "browse what you can afford" and arrived somewhere that silently
 * ignored them, which is the one outcome the link exists to prevent.
 *
 * Branching `app/study-resources/page.tsx` on `searchParams` would fix the
 * behaviour and cost the page. `searchParams` is a request-time API, so reading
 * it opts the route into dynamic rendering and its `revalidate = 300` with it —
 * a public SEO landing with canonical and OpenGraph tags, served per request
 * instead of revalidated every five minutes, to serve a mode almost nobody
 * arrives at directly. The filter is worth a page of its own; it is not worth
 * that page.
 *
 * ## Why the MIXED grid, and what is in it
 *
 * The route renders `StudyResourcesPage` with no `lockedType`, which is the one
 * render that asks the API for every type it serves: the four document
 * collections plus video lectures. That is the largest set of resources the
 * platform prices, gates and unlocks, so it is the only honest answer to a
 * button that offers to show what a student can unlock — larger than any single
 * category, and larger than the two that have their own screens.
 *
 * Mock tests are the one class left out, and deliberately. They are charged
 * when the paper is OPENED (`coins.PaperGate` on `mocktests.GetTest`), not when
 * it is listed, so `PublicMockTest` carries no price and no `access` block: a
 * list-level affordability filter would have nothing to compare and would either
 * drop every test or keep every test, both of which are lies. Widening this to
 * cover them is a backend change — the list endpoint would have to carry each
 * test's access block — not a routing decision. See the report.
 *
 * The `heading` prop is what turns this render into a page rather than a
 * section: an `h1` of its own and the "All study resources" link back that
 * every collection on this site has. `loading.tsx` and `error.tsx` are inherited
 * from the `study-resources` segment, so neither is redeclared here.
 *
 * Nothing about the gate reaches the route. With the gate off this is the plain
 * mixed catalogue — every resource visible, and the "Can unlock now" toggle
 * withheld, because a control that provably removes nothing is not a control.
 * `?affordable=1` still arrives in the URL from the link, is read by the same
 * code, and excludes nothing, which is the inertness the filter was built for.
 *
 * Not indexed: the page's value is per-student, and the six collection cards on
 * the landing are the indexable route into the same content.
 */
export const metadata: Metadata = {
  title: { absolute: "Resources you can unlock | Studsphere" },
  description:
    "Study notes, past questions, model questions, syllabi and video lectures, in one list.",
  robots: { index: false, follow: true },
};

export default function CanUnlockStudyResourcesPage() {
  return (
    <StudyResourcesPage
      heading={{
        title: "Resources you can unlock",
        description:
          "Study notes, past questions, model questions, syllabi and video lectures, in one list.",
      }}
    />
  );
}
