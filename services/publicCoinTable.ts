/**
 * The public coin table — GET /api/v1/coins/table.
 *
 * Consumer Protection Act 2075 s.16(2)(n) obliges a professional service provider
 * to specify **price, quality of service, venue and time**. That is the whole
 * obligation, and this module plus `app/coins/page.tsx` is where it is discharged.
 *
 * ## Why the copy is written here and not in the JSX
 *
 * 09-support-copy-cheat-sheet.md carries three hard bans, and each of them is a
 * legal exposure rather than a style preference:
 *
 *   - **"free"** — CPA 2075 s.16(2)(c)(3) treats advertising "even when no
 *     benefit is obtained as declared" as a misleading advertisement, 2–5 years
 *     under s.40(3)(b). A class a student pays nothing for is exactly what a
 *     careful-but-tired developer writes "free" about, so the word is asserted
 *     absent in a test rather than trusted to review.
 *   - **Currency beside a coin figure** — StudsTokens cannot be bought or cashed
 *     out, so an equivalence is false on the product's own terms, not merely
 *     inapt.
 *   - **"prize" / "award" / "winner"** — Income Tax Act 2058 defines windfall gain
 *     by those words. They read as compliments, which is precisely why they arrive
 *     by accident.
 *
 * Keeping the strings in TypeScript rather than JSX means the banned-word tests can
 * sweep every sentence without rendering React.
 *
 * ## Why the price and the charge-switch travel together
 *
 * The backend publishes `prices` AND `charges_apply`. Every gate ships dark, so a
 * row that printed "40 StudsTokens" without checking `charges_apply` would be
 * advertising a charge the platform is not making — the same s.16(2)(c)(3) problem
 * reached from a different direction. The rule is therefore applied here rather than
 * left to each row's author.
 */

/** The three classes the economy prices separately. */
export type PublicResourceClass = "study_resource" | "video" | "mock_test";

/** One unlockable class's coin cost. */
export interface PublicPrices {
  study_resource: number;
  video: number;
  mock_test: number;
}

/** Whether each published price is actually being charged right now. */
export interface PublicChargeState {
  study_resource: boolean;
  video: boolean;
  mock_test: boolean;
}

/**
 * The entitlement a new account starts with.
 *
 * Named `included` on the wire for the reason the backend names it that way: a key
 * called `free_unlocks` would put the banned word one mapping from a label.
 */
export interface PublicIncluded {
  document_unlocks: number;
  video_unlocks: number;
  mock_test_unlocks: number;
  expires_in_days: number;
}

/** How long coins live. */
export interface PublicExpiry {
  included_days: number;
  earned_days: number;
  /**
   * `earned_days` plus the qualifying-activity extension, computed server-side.
   *
   * The frontend must never do this arithmetic: 06 §10 requires the page to state
   * the EXTENDED figure, and a student told "12 months" who then reads a rule that
   * extends it to 18 has been told less than they are owed.
   */
  earned_days_extended: number;
  activity_extend_days: number;
}

/** The structure, as published booleans rather than prose. */
export interface PublicTerms {
  can_be_bought: boolean;
  can_be_sent_to_others: boolean;
  can_be_converted_to_money: boolean;
  spends_are_final: boolean;
  expired_coins_recoverable: boolean;
  /** Always 1. See `structureHeadline`. */
  referral_levels: number;
}

/** The whole public payload. */
export interface PublicCoinTable {
  prices: PublicPrices;
  charges_apply: PublicChargeState;
  included: PublicIncluded;
  expiry: PublicExpiry;
  terms: PublicTerms;
}

/** The backend's standard success envelope. */
export interface PublicCoinTableEnvelope {
  success: boolean;
  message?: string;
  data: PublicCoinTable | null;
}

/** One row of the published table. */
export interface ChargeRow {
  /** The class as a reader knows it, not as the API spells it. */
  label: string;
  /** The one sentence a reader actually needs. */
  detail: string;
  /** False means the class is included with an account rather than chargeable. */
  charged: boolean;
}

/** Class → how a reader names it. */
const CLASS_LABELS: Record<PublicResourceClass, string> = {
  study_resource: "Documents",
  video: "Videos",
  mock_test: "Mock tests",
};

/**
 * Coin counts are rendered with a thin space and the product name, never with a
 * currency marker.
 *
 * "StudsToken" singular for exactly 1 is handled by the caller: a row saying "costs
 * 1 StudsToken" is correct English and reads as a typo in this context, so the
 * plural is used unconditionally.
 */
function coins(amount: number): string {
  return `${amount} StudsTokens`;
}

/**
 * A stored figure, made safe to print.
 *
 * The backend clamps negatives to zero already, so this is defence in depth rather
 * than a fix — but the rendering layer is where a bad number becomes a reader's
 * belief about what they owe, and one `Math.max` is cheaper than explaining a
 * "costs -5 StudsTokens" screenshot to a regulator.
 */
function safe(amount: number): number {
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

/**
 * Builds the table rows from the published payload.
 *
 * The `charged` decision is made ONCE, here, and every row obeys it. That is the
 * point: the failure this prevents is one row's author checking the gate and the
 * next one not.
 */
export function describeCharge(table: PublicCoinTable): Record<PublicResourceClass, ChargeRow> {
  const rows = {} as Record<PublicResourceClass, ChargeRow>;

  (Object.keys(CLASS_LABELS) as PublicResourceClass[]).forEach((cls) => {
    const price = safe(table?.prices?.[cls]);
    const applies = Boolean(table?.charges_apply?.[cls]) && price > 0;

    rows[cls] = {
      label: CLASS_LABELS[cls],
      charged: applies,
      detail: applies
        ? `Costs ${coins(price)} to unlock. Included with your account as well.`
        : "Included with your account. No StudsTokens needed.",
    };
  });

  return rows;
}

/**
 * The one-line structure statement, which leads the page.
 *
 * 07 §"Mitigation, in order of preference" says to state the single-level structure
 * *proactively in the published coin table*, "so the first thing a reader finds is
 * the structure, not the name". The product name contains "Token" and the statute
 * names "token system" in its pyramid-scheme prohibition, so the ORDER of these two
 * facts is the entire mitigation and it is worth a dedicated field rather than a
 * paragraph somebody might move.
 *
 * The number is spoken as a count rather than as the word "level", and no network
 * vocabulary appears: 07 says never describe the mechanic in network, chain,
 * downline, tree or level language, because those are the words that do the
 * regulator's work for them.
 */
export function structureHeadline(table: PublicCoinTable): string {
  const levels = table?.terms?.referral_levels ?? 1;
  return (
    `Inviting a friend is a ${levels}-step arrangement. ` +
    `If they join, you get StudsTokens. There are no further steps, ` +
    `no one above you, and nobody pays you for the people you invite.`
  );
}

/**
 * The permanent terms, one sentence each.
 *
 * Every one is a product invariant from ADR-001 except the expiry one, which exists
 * so the page can answer the question instead of leaving a reader to assume. 09 is
 * explicit that a softened figure is worse than none — "do not soften with roughly
 * or approximately" — so there is no hedge anywhere in these strings.
 */
export function termStatements(table: PublicCoinTable): string[] {
  const terms = table?.terms;
  const statements: string[] = [];

  if (!terms?.can_be_bought) {
    statements.push("StudsTokens cannot be bought. There is no way to purchase them.");
  }
  if (!terms?.can_be_sent_to_others) {
    statements.push("StudsTokens cannot be sent to another account.");
  }
  if (!terms?.can_be_converted_to_money) {
    statements.push(
      "StudsTokens cannot be converted to money. They are only used to unlock resources on StudSphere.",
    );
  }
  if (terms?.spends_are_final) {
    // 09's replacement copy, verbatim in substance: there is no refund path at all,
    // so the honest statement is about what happens rather than about what might.
    statements.push("Spent StudsTokens stay spent. If an unlock did not complete, nothing was spent.");
  }
  if (!terms?.expired_coins_recoverable) {
    statements.push("Expired StudsTokens are not recoverable and are not exchanged for anything.");
  }
  return statements;
}

/**
 * Fetches the published table.
 *
 * **No credentials are sent.** The endpoint is public by design — the audience for a
 * published price is someone who has not registered yet — so attaching a token would
 * make the page depend on login state it does not need.
 *
 * Returns `null` rather than throwing when the table cannot be read. The page then
 * renders its structure with the figures marked unavailable, because a public terms
 * page that hard-fails is worse than one that says it cannot reach its numbers: the
 * reader came for terms.
 */
export async function fetchPublicCoinTable(): Promise<PublicCoinTable | null> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  try {
    const res = await fetch(`${base}/api/v1/coins/table`, {
      // Public content, and the backend's own Cache-Control is `max-age=300`. The
      // two agree deliberately: a published price that outlives its change by much
      // is the misleading-advertisement problem again, produced by staleness.
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10_000),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;

    const envelope = (await res.json()) as PublicCoinTableEnvelope;
    const table = envelope?.data;
    // A zeroed table is real data, not absence: every gate ships dark, so on a
    // fresh deployment this is the payload. Discarding it as empty would leave the
    // page blank exactly when it first needs to exist.
    if (!table || typeof table !== "object" || !table.terms) return null;
    return table;
  } catch {
    // Network failure, abort, or malformed JSON. Same reasoning as a non-2xx.
    return null;
  }
}