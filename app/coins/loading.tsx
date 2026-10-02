/**
 * Loading state for the public coin table.
 *
 * A skeleton rather than a spinner, because this page is a single column of short
 * text blocks: a skeleton reserves the shape and stops the page jumping when the
 * figures arrive.
 *
 * `aria-busy` on the container tells assistive technology the region is still
 * settling, which is more useful here than a live region announcing "loading" — the
 * content is not updating, it is arriving once.
 */
export default function CoinTableLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading the StudsToken coin table"
      className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6"
    >
      <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200" />
      <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-gray-100" />

      <div className="mt-10 space-y-3">
        <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="h-16 w-full animate-pulse rounded bg-gray-100" />
      </div>
      <div className="mt-8 space-y-3">
        <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200" />
        <div className="h-24 w-full animate-pulse rounded bg-gray-100" />
      </div>
      <div className="mt-8 space-y-3">
        <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200" />
        <div className="h-20 w-full animate-pulse rounded bg-gray-100" />
      </div>
    </main>
  );
}