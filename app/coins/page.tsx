import type { Metadata } from "next";
import {
  fetchPublicCoinTable,
  describeCharge,
  structureHeadline,
  termStatements,
  type PublicCoinTable,
} from "@/services/publicCoinTable";

// ─── metadata ─────────────────────────────────────────────────────────────────

const TITLE = "StudsToken coin table";
const DESCRIPTION =
  "What a StudsToken unlock costs, what every account includes, how long coins last, " +
  "and how the referral programme is structured.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "./" },
  openGraph: { title: `${TITLE} | Studsphere`, description: DESCRIPTION, type: "website" },
};

// ─── the page ─────────────────────────────────────────────────────────────────

/**
 * The public coin table — CPA 2075 s.16(2)(n), and 04 §6's Phase 4 deliverable.
 *
 * A **Server Component**, deliberately. The page has no interactivity: no state, no
 * handlers, no browser API. Its only job is to fetch the published figures and lay
 * them out, so everything about it — the data fetch, the copy, the markup — is
 * content that belongs on the server. A `"use client"` version would ship a
 * JavaScript bundle to do a `fetch` and a render, and would withhold the page's
 * content from anything that does not run JavaScript.
 *
 * ## The structure comes FIRST
 *
 * The order of the sections is the compliance mechanism, not a design preference.
 *
 * 07 §"Mitigation, in order of preference" ranks the measures against the risk that
 * the name "StudsToken" reads as the "token system" the Consumer Protection Act names
 * in its pyramid-scheme prohibition, and states that the published coin table should
 * **state the single-level structure proactively, "so the first thing a reader finds
 * is the structure, not the name."**
 *
 * So the structure statement opens the page. A reader who stops after one paragraph
 * has already seen that there is exactly one step and nobody above them.
 *
 * ## The figures come from the server, never from a constant here
 *
 * Every number on this page is read from `GET /api/v1/coins/table`. There is no
 * fallback copy of the economy in this file, and that is the point: a page whose
 * prices are hardcoded is a page that publishes whatever it was written with, which
 * is the misleading-advertisement problem in its purest form.
 */
export default async function CoinTablePage() {
  const table = await fetchPublicCoinTable();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{TITLE}</h1>
        <p className="mt-2 text-gray-600">
          Everything below is published before you spend anything, and it is the same
          for every account.
        </p>
      </header>

      <StructureSection table={table} />
      <ChargeSection table={table} />
      <ExpirySection table={table} />
      <TermsSection table={table} />
      <HelpSection />
    </main>
  );
}

// ─── sections ────────────────────────────────────────────────────────────────

/**
 * The structure, first and unmissably.
 *
 * Reads from `terms.referral_levels` rather than hardcoding "single level", so if
 * the backend ever changed the published value the page would say so rather than
 * continue asserting something the API no longer claims.
 */
function StructureSection({ table }: { table: PublicCoinTable | null }) {
  return (
    <section aria-labelledby="structure" className="mb-10">
      <h2 id="structure" className="text-lg font-semibold text-gray-900">
        How the referral programme works
      </h2>
      <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        {/* aria-live is not used here: this is static content that does not change
            after load, and announcing it twice helps nobody. */}
        <p className="text-gray-800">{structureHeadline(table ?? fallbackTerms())}</p>
      </div>
    </section>
  );
}

/**
 * The price table — the "price" limb of s.16(2)(n).
 *
 * A real `<table>` with a caption and header scopes rather than a grid of divs: the
 * figures are a comparison the reader is meant to scan down a column, and assistive
 * technology needs the row/column relationship that only a table expresses.
 */
function ChargeSection({ table }: { table: PublicCoinTable | null }) {
  const rows = describeCharge(table ?? fallbackTerms());

  return (
    <section aria-labelledby="charges" className="mb-10">
      <h2 id="charges" className="text-lg font-semibold text-gray-900">
        What an unlock costs
      </h2>

      {!table ? (
        <Unavailable />
      ) : (
        <table className="mt-3 w-full border-collapse text-left">
          <caption className="sr-only">
            Coin cost of unlocking each resource type, and what is included with every
            account.
          </caption>
          <thead>
            <tr className="border-b border-gray-200">
              <th scope="col" className="py-2 pr-4 font-medium text-gray-700">
                Resource type
              </th>
              <th scope="col" className="py-2 pr-4 font-medium text-gray-700">
                Unlocking it
              </th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(rows) as (keyof typeof rows)[]).map((cls) => {
              const row = rows[cls];
              return (
                <tr key={cls} className="border-b border-gray-100 align-top">
                  <th scope="row" className="py-3 pr-4 font-medium text-gray-900">
                    {row.label}
                  </th>
                  <td className="py-3 pr-4 text-gray-700">
                    {row.detail}
                    {row.charged ? (
                      <span className="ml-2 text-sm text-gray-500">Optional.</span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <IncludedList table={table} />
    </section>
  );
}

/**
 * What every account includes, which 04 §6 lists as a required element alongside the
 * price.
 *
 * "Included" rather than "free" in every label here — see the header of
 * publicCoinTable.ts for why that word is not a style choice.
 */
function IncludedList({ table }: { table: PublicCoinTable | null }) {
  const included = table?.included;
  if (!included) return null;

  const entries = [
    { label: "Documents", count: included.document_unlocks },
    { label: "Videos", count: included.video_unlocks },
    { label: "Mock tests", count: included.mock_test_unlocks },
  ].filter((entry) => entry.count > 0);

  if (entries.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-gray-900">Included with every account</h3>
      <ul className="mt-1 list-inside list-disc text-gray-700">
        {entries.map((entry) => (
          <li key={entry.label}>
            {entry.count} {entry.count === 1 ? "unlock" : "unlocks"} — {entry.label.toLowerCase()}
          </li>
        ))}
        {included.expires_in_days > 0 ? (
          <li>
            These included unlocks last {included.expires_in_days} days from the day your
            account is created.
          </li>
        ) : null}
      </ul>
    </div>
  );
}

/**
 * The "time" limb of s.16(2)(n).
 *
 * States the EXTENDED figure for earned coins, which is 06 §10's requirement: a
 * student told "12 months" who then reads a rule extending it to 18 has been told
 * less than they are owed. The server computes the sum — the page never does
 * arithmetic on a policy.
 *
 * No countdown, no urgency, and no "limited time". 09 bans urgency copy on earned
 * coins specifically, and a countdown is not a fact about the policy.
 */
function ExpirySection({ table }: { table: PublicCoinTable | null }) {
  const expiry = table?.expiry;
  if (!expiry) return <Unavailable />;

  const earnedLine =
    expiry.activity_extend_days > 0
      ? `Earned StudsTokens last ${months(expiry.earned_days_extended)}, extended from ${months(
          expiry.earned_days,
        )} on qualifying activity.`
      : `Earned StudsTokens last ${months(expiry.earned_days)}.`;

  return (
    <section aria-labelledby="expiry" className="mb-10">
      <h2 id="expiry" className="text-lg font-semibold text-gray-900">
        How long StudsTokens last
      </h2>
      <ul className="mt-3 list-inside list-disc text-gray-700">
        {expiry.included_days > 0 ? (
          <li>Included starter StudsTokens last {months(expiry.included_days)}.</li>
        ) : null}
        <li>{earnedLine}</li>
        <li>We spend the StudsTokens that expire soonest first.</li>
      </ul>
    </section>
  );
}

/** The permanent terms, one per bullet. */
function TermsSection({ table }: { table: PublicCoinTable | null }) {
  const statements = termStatements(table ?? fallbackTerms());

  return (
    <section aria-labelledby="terms" className="mb-10">
      <h2 id="terms" className="text-lg font-semibold text-gray-900">
        The rules that do not change
      </h2>
      <ul className="mt-3 list-inside list-disc text-gray-700">
        {statements.map((statement) => (
          <li key={statement}>{statement}</li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Where to go with a question.
 *
 * 09's "the three questions students ask" is support copy, and this page is where a
 * prospective student arrives with one of them. The links are to real in-app
 * destinations rather than invented URLs.
 */
function HelpSection() {
  return (
    <section aria-labelledby="help" className="mb-4 border-t border-gray-200 pt-6">
      <h2 id="help" className="text-lg font-semibold text-gray-900">
        Questions
      </h2>
      <p className="mt-2 text-gray-700">
        Your balance and its history are on{" "}
        <a href="/user/dashboard/coins" className="text-blue-700 underline hover:text-blue-900">
          your StudsToken wallet
        </a>
        . Referral details are on{" "}
        <a href="/user/dashboard/referral" className="text-blue-700 underline hover:text-blue-900">
          your referral page
        </a>
        .
      </p>
    </section>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Renders a day count as a duration.
 *
 * Months rather than days because a policy expressed in days ("365 days") invites a
 * reader to do calendar arithmetic against it, and because the number everyone
 * remembers is "12 months". Below 60 days it stays in days, because rounding a
 * three-week figure to "1 month" would overstate it.
 */
function months(days: number): string {
  if (days <= 0) return "0 days";
  if (days < 60) return `${days} days`;
  const whole = Math.round(days / 30);
  return `${whole} ${whole === 1 ? "month" : "months"}`;
}

/**
 * Shown in place of the figures when the table cannot be read.
 *
 * Deliberately does NOT guess. A terms page that renders plausible-looking numbers
 * when its data failed is the one failure mode that would matter here: the reader
 * would be told a price the platform does not charge. Saying nothing is honest;
 * saying something wrong is the offence.
 */
function Unavailable() {
  return (
    <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-900">
      These figures are temporarily unavailable. The rules that do not change are listed
      below, and no StudsToken is charged for any unlock while the economy is closed.
    </p>
  );
}

/**
 * A shape with the structural terms only, so the two sections that depend on
 * `terms.referral_levels` and the invariant list still render when the fetch failed.
 *
 * The invariant booleans are hardcoded `false`/`true` because they are product
 * invariants from ADR-001, not observations — they are true whether or not the API
 * answered, and a page that hid them because of a network error would be omitting
 * exactly the disclosures that matter most.
 */
function fallbackTerms(): PublicCoinTable {
  return {
    prices: { study_resource: 0, video: 0, mock_test: 0 },
    charges_apply: { study_resource: false, video: false, mock_test: false },
    included: { document_unlocks: 0, video_unlocks: 0, mock_test_unlocks: 0, expires_in_days: 0 },
    expiry: { included_days: 0, earned_days: 0, earned_days_extended: 0, activity_extend_days: 0 },
    terms: {
      can_be_bought: false,
      can_be_sent_to_others: false,
      can_be_converted_to_money: false,
      spends_are_final: true,
      expired_coins_recoverable: false,
      referral_levels: 1,
    },
  };
}