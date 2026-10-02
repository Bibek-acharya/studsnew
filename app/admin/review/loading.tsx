/**
 * Loading state for the review queue.
 *
 * A skeleton rather than a spinner, because the queue is a table: reserving its rows
 * stops the page jumping when the count and the rows arrive.
 */
export default function AdminReviewLoading() {
  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6" aria-busy="true">
      <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-100" />
      <div className="mt-6 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    </main>
  );
}
