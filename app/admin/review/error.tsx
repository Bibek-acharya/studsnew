"use client";

/**
 * Error boundary for the review queue.
 *
 * Client-only because `error.tsx` receives the error and a reset callback. The
 * message deliberately does NOT speculate about whether any approval succeeded: a
 * bulk approve is N independent financial operations and this boundary cannot know how
 * many landed, so it tells the operator to re-open the queue rather than guess. Saying
 * "some uploads may have been approved" without a count is the one sentence here that
 * must not be vague.
 */
export default function AdminReviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <div
        role="alert"
        className="rounded-md border border-red-200 bg-red-50 p-4 text-red-900"
      >
        <h1 className="text-lg font-semibold">The review queue did not load</h1>
        <p className="mt-1 text-sm">
          Re-open the queue to see what is still waiting. Anything already approved stays
          approved and stays paid — approving twice does nothing, because each approval is
          idempotent.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-3 rounded-md bg-red-900 px-3 py-2 text-sm font-medium text-white hover:bg-red-800"
        >
          Try again
        </button>
        {error.digest ? (
          <p className="mt-3 text-xs text-red-700">Reference: {error.digest}</p>
        ) : null}
      </div>
    </main>
  );
}
