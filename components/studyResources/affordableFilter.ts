/**
 * `?affordable=1` — the anti-dead-end filter of 06 §5.
 *
 * `EarnRoutes` closes every insufficient-funds screen with one link, "Browse
 * resources you can unlock now", pointing at `/study-resources?affordable=1`.
 * Until now that link landed on the unfiltered catalogue, which is the dead end
 * §5 rule 4 forbids. This file is what makes the link mean something, and its
 * entire job is one narrow decision made in one place: **which resource is known
 * to be out of reach right now**.
 *
 * ## The rule, and why it is phrased the way it is
 *
 * It excludes exactly ONE state — `insufficient`, the only state in which a
 * price is known, a balance that covers it is known, and that balance falls
 * short. Everything else stays visible:
 *
 * - `null` — no `access` block, which is what every item looks like while the
 *   gate is off. Treating absent as unaffordable would empty the catalogue for
 *   exactly the student who clicked "resources you can unlock now", on the one
 *   screen whose entire job is to stop them feeling walled in.
 * - `price-unknown` — the price or the balance could not be read. Unknown is
 *   not "no", and a failed wallet read must not hide content the student can
 *   already pay for.
 * - `unlocked` — the student holds it. Hiding it would remove the one card whose
 *   action is guaranteed to work.
 * - `starter-eligible`, `anonymous`, `unlocking` — none of them a proven
 *   shortfall.
 *
 * So the predicate is written "keep unless positively known unaffordable"
 * rather than as an allow-list of the good states. An allow-list has to be
 * edited every time the state matrix grows, and the day somebody forgets is the
 * day content disappears. `tests/affordableCatalogueFilter.test.ts` pins one
 * case per state so the list cannot quietly widen.
 *
 * **No server round trip.** The filter reads the `access` already on each
 * resource (06 §12) and runs over the page the catalogue has already fetched,
 * which is why it costs nothing and why it composes with search, course, year
 * and pagination instead of replacing them.
 */
import type { ResolvedResourceAccess } from "@/components/coins/useCoinState";
import type { StudyResource } from "@/services/studyResourcesApi";

/** The query parameter `EarnRoutes` links to, and its only "on" value. */
export const AFFORDABLE_PARAM = "affordable";
export const AFFORDABLE_PARAM_ON = "1";

/**
 * Strict on purpose. `?affordable=0`, `?affordable=` and no parameter at all are
 * all off, so there is exactly one spelling of "on" and the checkbox and the URL
 * can never disagree about it.
 */
export function isAffordableParamOn(value: string | null | undefined): boolean {
  return value === AFFORDABLE_PARAM_ON;
}

/**
 * The one state that is a positive, evidenced answer to "not yet": a known
 * price the known balance does not cover.
 *
 * Everything else — including a null resolved state — is undetermined, and an
 * undetermined item is kept.
 */
export function isKnownUnaffordable(
  access: ResolvedResourceAccess | null,
): boolean {
  return access?.state === "insufficient";
}

/** The grid test: keep unless positively known unaffordable. */
export function matchesAffordableFilter(
  access: ResolvedResourceAccess | null,
): boolean {
  return !isKnownUnaffordable(access);
}

/**
 * Whether the gate is off for the page currently on screen.
 *
 * The gated list endpoint sends an `access` block per resource, so a loaded page
 * whose items carry none is a page from an ungated catalogue. That is the only
 * signal available without a new request, and it is the same signal
 * `useCoinState` keys off when it returns null.
 *
 * Only a loaded page with items can answer: an empty, loading or failed response
 * says nothing, and the caller keeps the control rather than hiding a working
 * filter on a guess.
 */
export function isGateOffForItems(
  items: ReadonlyArray<Pick<StudyResource, "access">>,
): boolean {
  return items.length > 0 && !items.some((item) => item?.access != null);
}