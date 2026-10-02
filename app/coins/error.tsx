"use client";

/**
 * Error boundary for the public coin table.
 *
 * A client component because `error.tsx` receives the error and a reset callback,
 * which only exists on the client. It is the one file in this route that needs
 * `"use client"`.
 *
 * ## The copy constraint applies here too
 *
 * This is a page about what a coin costs, so a failure message on it is a place a
 * reader might go looking for the price. It therefore says nothing about the
 * economy's figures — no "we could not load pricing", which invites the reader to
 * wonder what the price is. It reports a problem and points at the invariant list,
 * which is always true and is rendered below this boundary's siblings.
 *
 * There is no banned word here to be careful about, and that is deliberate: the
 * message avoids pricing vocabulary entirely rather than phrasing around "free".
 */
export default function CoinTableError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div
        role="alert"
        className="rounded-md border border-red-200 bg-red-50 p-4 text-red-900"
      >
        <h1 className="text-lg font-semibold">This page did not load</h1>
        <p className="mt-1 text-sm">
          Something went wrong fetching this page. The rules that do not change — that
          StudsTokens cannot be bought, cannot be sent to another account, and cannot be
          converted to money — are true regardless, and no unlock is affected.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-3 rounded-md bg-red-900 px-3 py-2 text-sm font-medium text-white hover:bg-red-800"
        >
          Try again
        </button>
        {error.digest ? (
          // The digest is what a support request needs to find the matching server
          // log. Rendered small and last, because it is for an operator rather than
          // for a reader.
          <p className="mt-3 text-xs text-red-700">Reference: {error.digest}</p>
        ) : null}
      </div>
    </main>
  );
}